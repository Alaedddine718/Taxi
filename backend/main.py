# main.py
# Backend sencillo para el proyecto UNIETAXI
# Usa FastAPI + hilos (threading) + semáforos para simular
# un sistema de atención de taxis.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from math import sqrt
from typing import List, Dict, Any
import threading

# ---------------------------------------------------
# 1. CREACIÓN DE LA APP FASTAPI + CORS
# ---------------------------------------------------

app = FastAPI()

# Permitimos peticiones desde el frontend (Vite: puerto 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# 2. MODELOS DE ENTRADA (Pydantic)
# ---------------------------------------------------

class StartRequest(BaseModel):
    """Datos para iniciar el sistema: solo el número de taxis."""
    num_taxis: int

class TaxiRequest(BaseModel):
    """Datos de una solicitud de taxi."""
    name: str
    origin_x: float
    origin_y: float
    dest_x: float
    dest_y: float

# ---------------------------------------------------
# 3. ESTADO COMPARTIDO DEL SISTEMA
#    (simula memoria compartida entre procesos)
# ---------------------------------------------------

# Listas que representan el estado del sistema
taxis: List[Dict[str, Any]] = []
clients: List[Dict[str, Any]] = []
trips: List[Dict[str, Any]] = []

# Contadores para generar IDs
next_taxi_id = 1
next_client_id = 1
next_trip_id = 1

# Porcentajes de reparto del dinero
COMPANY_PERCENT = 0.20  # 20% para la empresa
TAXI_PERCENT = 0.80     # 80% para el taxi

# Lock para proteger el acceso a las listas compartidas
state_lock = threading.Lock()

# Cola de peticiones y semáforo:
#   - pending_requests: lista que guarda solicitudes de viaje
#   - sem_requests: cuenta cuántas solicitudes pendientes hay
pending_requests: List[Dict[str, Any]] = []
sem_requests = threading.Semaphore(0)

# ---------------------------------------------------
# 4. FUNCIONES AUXILIARES
# ---------------------------------------------------

def reset_system(num_taxis: int):
    """
    Reinicia todo el sistema:
    - borra taxis, clientes y viajes
    - crea 'num_taxis' taxis en la posición (0,0)
    """
    global taxis, clients, trips
    global next_taxi_id, next_client_id, next_trip_id
    global pending_requests

    # Usamos el lock porque cambiamos el estado global
    with state_lock:
        taxis = []
        clients = []
        trips = []
        pending_requests = []

        next_taxi_id = 1
        next_client_id = 1
        next_trip_id = 1

        for i in range(1, num_taxis + 1):
            taxis.append({
                "id": i,
                "x": 0.0,
                "y": 0.0,
                "busy": False,
                "current_trip_id": None,
                "rating": 5.0,
                "total_earnings": 0.0,
            })
        next_taxi_id = num_taxis + 1


def distance(x1: float, y1: float, x2: float, y2: float) -> float:
    """Devuelve la distancia euclídea entre dos puntos."""
    return sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


def assign_taxi_for_trip(origin_x: float, origin_y: float):
    """
    Selecciona el taxi libre más cercano a un punto de origen.
    Devuelve el diccionario del taxi o None si no hay taxis libres.
    """
    free_taxis = [t for t in taxis if not t["busy"]]
    if not free_taxis:
        return None

    best_taxi = None
    best_dist = None
    for t in free_taxis:
        d = distance(t["x"], t["y"], origin_x, origin_y)
        if best_dist is None or d < best_dist:
            best_dist = d
            best_taxi = t
    return best_taxi


def process_single_request(req: Dict[str, Any]):
    """
    Procesa UNA solicitud de taxi:
    - Crea el cliente
    - Asigna el taxi más cercano
    - Calcula distancia, tarifa y viaje
    - Actualiza el estado del taxi y las ganancias
    """
    global next_client_id, next_trip_id

    name = req["name"]
    origin_x = req["origin_x"]
    origin_y = req["origin_y"]
    dest_x = req["dest_x"]
    dest_y = req["dest_y"]

    # Creamos el cliente
    client = {
        "id": next_client_id,
        "name": name,
        "origin_x": origin_x,
        "origin_y": origin_y,
        "dest_x": dest_x,
        "dest_y": dest_y,
        "rating_given": None,
    }
    clients.append(client)
    next_client_id += 1

    # Buscamos taxi libre más cercano
    taxi = assign_taxi_for_trip(origin_x, origin_y)
    if taxi is None:
        # Si no hay taxis libres, no creamos viaje (simplificación)
        return

    # Calculamos distancia y tarifa
    dist = distance(origin_x, origin_y, dest_x, dest_y)
    base_fare = 2.0
    price_per_unit = 1.0
    fare = base_fare + dist * price_per_unit

    # Creamos el viaje
    trip = {
        "id": next_trip_id,
        "client_id": client["id"],
        "taxi_id": taxi["id"],
        "status": "finished",  # simplificamos: el viaje termina al instante
        "distance": dist,
        "fare": fare,
    }
    trips.append(trip)
    next_trip_id += 1

    # Actualizamos el taxi
    taxi["busy"] = False
    taxi["current_trip_id"] = trip["id"]
    taxi["x"] = dest_x
    taxi["y"] = dest_y
    taxi["total_earnings"] += fare * TAXI_PERCENT


def worker_loop():
    """
    Hilo del 'sistema de atención'.
    - Espera a que haya solicitudes en la cola (semáforo).
    - Cuando hay una, la saca y la procesa.
    """
    while True:
        # Esperamos hasta que haya al menos 1 solicitud
        sem_requests.acquire()

        # Leemos una solicitud de la cola
        with state_lock:
            if not pending_requests:
                # Si por alguna razón no hay, seguimos
                continue
            req = pending_requests.pop(0)

            # Ahora que tenemos la solicitud, procesamos el viaje
            process_single_request(req)


# Creamos y arrancamos el hilo al iniciar el módulo
worker_thread = threading.Thread(target=worker_loop, daemon=True)
worker_thread.start()

# ---------------------------------------------------
# 5. ENDPOINTS DE LA API
# ---------------------------------------------------

@app.post("/start")
def start_simulation(req: StartRequest):
    """
    Reinicia el sistema con un número de taxis.
    Endpoint usado por el formulario 'Iniciar simulación'.
    """
    if req.num_taxis <= 0:
        return {"status": "error", "message": "num_taxis debe ser > 0"}

    reset_system(req.num_taxis)
    return {"status": "ok", "num_taxis": len(taxis)}


@app.post("/request")
def create_request(req: TaxiRequest):
    """
    Crea una solicitud de taxi.
    En lugar de procesarla directamente,
    la metemos en la cola 'pending_requests' y el hilo worker la atiende.
    """
    # Convertimos el modelo Pydantic a dict
    data = req.dict()

    # Metemos en la cola bajo protección del lock
    with state_lock:
        pending_requests.append(data)
        # Indicamos al semáforo que hay 1 solicitud más
        sem_requests.release()

    # No devolvemos trip_id porque el hilo la procesará después.
    return {"status": "ok", "message": "Solicitud encolada"}


@app.get("/status")
def get_status():
    """
    Devuelve el estado actual del sistema:
    - taxis
    - clientes
    - viajes
    """
    with state_lock:
        # Devolvemos copias superficiales para evitar problemas
        return {
            "taxis": list(taxis),
            "clients": list(clients),
            "trips": list(trips),
        }


@app.get("/financial")
def get_financial():
    """
    Calcula los ingresos totales y cuánto corresponde
    a la empresa y a cada taxi.
    """
    with state_lock:
        total_fares = sum(t["fare"] for t in trips)
        company_total = total_fares * COMPANY_PERCENT

        per_taxi = []
        for t in taxis:
            taxi_earn = t["total_earnings"]
            if taxi_earn > 0:
                # parte para la empresa proporcional a ese taxi
                company_part = taxi_earn * COMPANY_PERCENT / TAXI_PERCENT
            else:
                company_part = 0.0

            per_taxi.append({
                "taxi_id": t["id"],
                "taxi_earnings": taxi_earn,
                "company_part": company_part,
            })

        return {
            "company_total": company_total,
            "per_taxi": per_taxi,
        }
