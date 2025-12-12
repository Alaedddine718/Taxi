# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import threading
import time
import math

# ---------------------------------------------------
# MODELOS DE DATOS (Pydantic)
# ---------------------------------------------------

class Taxi(BaseModel):
    id: int
    x: float
    y: float
    free: bool = True          # True = taxi libre, False = ocupado
    total_earned: float = 0.0  # dinero ganado por ese taxi


class Client(BaseModel):
    id: int
    name: str


class Trip(BaseModel):
    id: int
    client_name: str
    taxi_id: int
    origin_x: float
    origin_y: float
    dest_x: float
    dest_y: float
    distance: float
    fare: float
    finished: bool = False     # True cuando el viaje termina


class Match(BaseModel):
    """
    Para mostrar de forma clara cómo se hizo
    la selección cliente–taxi.
    """
    trip_id: int
    client_name: str
    taxi_id: int
    distance: float            # distancia del taxi al cliente al asignar


class StartRequest(BaseModel):
    num_taxis: int


class NewRequest(BaseModel):
    client_name: str
    origin_x: float
    origin_y: float
    dest_x: float
    dest_y: float


class StatusResponse(BaseModel):
    """
    Estado completo del sistema que consume el frontend.
    """
    taxis: List[Taxi]
    clients: List[Client]
    trips: List[Trip]
    matches: List[Match]     # últimos emparejamientos taxi–cliente


class FinancialSummary(BaseModel):
    total_trips: int
    total_fares: float
    company_income: float
    taxis_income: float
    per_taxi: List[dict]
    tracked_trips: List[Trip]


# ---------------------------------------------------
# ESTADO GLOBAL + SINCRONIZACIÓN (SEMÁFOROS)
# ---------------------------------------------------

# Recursos críticos compartidos entre hilos
taxis: List[Taxi] = []
clients: List[Client] = []
trips: List[Trip] = []
matches_log: List[Match] = []   # para ver cómo se hizo la selección

# 🔒 Semáforo binario / mutex: exclusión mutua de secciones críticas
lock = threading.Lock()

# 🚦 Semáforo de conteo: número de taxis libres disponibles
free_taxis_sem = threading.Semaphore(0)


# ---------------------------------------------------
# APP FASTAPI + CORS
# ---------------------------------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------
# FUNCIONES AUXILIARES
# ---------------------------------------------------

def distance(a_x: float, a_y: float, b_x: float, b_y: float) -> float:
    """Distancia euclídea simple entre dos puntos."""
    return math.sqrt((a_x - b_x) ** 2 + (a_y - b_y) ** 2)


def calculate_fare(dist: float) -> float:
    """Tarifa sencilla: 5 fijo + 2 por unidad de distancia."""
    return round(5 + 2 * dist, 2)


def find_or_create_client(name: str) -> Client:
    """
    Busca un cliente por nombre; si no existe, lo crea.
    Recurso crítico: lista clients (se protege desde fuera con lock).
    """
    global clients
    for c in clients:
        if c.name == name:
            return c
    new_client = Client(id=len(clients) + 1, name=name)
    clients.append(new_client)
    return new_client


def assign_taxi_to_request(req: NewRequest) -> Trip:
    """
    FUNCIÓN CLAVE (para la profe 👀):
    - Usa semáforo de conteo free_taxis_sem para esperar taxis libres.
    - Dentro del lock (semáforo binario) elige el taxi libre más cercano
      al cliente y crea el viaje.
    """
    global taxis, trips, matches_log, free_taxis_sem

    # 1) Esperar a que haya al menos un taxi libre (semáforo de conteo)
    acquired = free_taxis_sem.acquire(timeout=3)
    if not acquired:
        raise HTTPException(status_code=503, detail="No hay taxis libres en este momento")

    # 2) Sección crítica: acceso a taxis / clients / trips
    with lock:
        # Lista de taxis libres en este momento
        free_taxis = [t for t in taxis if t.free]
        if not free_taxis:
            # Caso raro: nadie libre → devolvemos el permiso al semáforo
            free_taxis_sem.release()
            raise HTTPException(status_code=503, detail="No hay taxis libres en este momento")

        # 3) Elegir el taxi LIBRE más CERCANO al cliente
        best_taxi = None
        best_dist = None
        for t in free_taxis:
            d = distance(t.x, t.y, req.origin_x, req.origin_y)
            if best_dist is None or d < best_dist:
                best_dist = d
                best_taxi = t

        # 4) Crear o recuperar cliente
        client = find_or_create_client(req.client_name)

        # 5) Calcular distancia del viaje y tarifa
        dist = distance(req.origin_x, req.origin_y, req.dest_x, req.dest_y)
        fare = calculate_fare(dist)

        # 6) Crear viaje y agregar a la lista
        trip_id = len(trips) + 1
        trip = Trip(
            id=trip_id,
            client_name=client.name,
            taxi_id=best_taxi.id,
            origin_x=req.origin_x,
            origin_y=req.origin_y,
            dest_x=req.dest_x,
            dest_y=req.dest_y,
            distance=dist,
            fare=fare,
            finished=False,
        )
        trips.append(trip)

        # 7) Marcar taxi como ocupado
        best_taxi.free = False

        # 8) Registrar el emparejamiento para mostrarlo en el frontend
        match = Match(
            trip_id=trip.id,
            client_name=client.name,
            taxi_id=best_taxi.id,
            distance=best_dist if best_dist is not None else 0.0,
        )
        matches_log.append(match)
        # nos quedamos solo con los últimos 8 emparejamientos
        if len(matches_log) > 8:
            matches_log = matches_log[-8:]

    # 9) Lanzar hilo independiente que simula el viaje
    thread = threading.Thread(target=run_trip, args=(trip.id,), daemon=True)
    thread.start()

    return trip


def run_trip(trip_id: int):
    """
    Hilo que simula el viaje:
    - Espera 20 segundos (simulación de tiempo real).
    - Luego entra en una sección crítica para actualizar taxi y viaje.
    - Libera un permiso en free_taxis_sem cuando el taxi vuelve a estar libre.
    """
    global taxis, trips, free_taxis_sem

    # ⏱️ Simular tiempo de viaje: 20 segundos
    time.sleep(20)

    with lock:
        # Buscar viaje y taxi asociados
        trip = next((v for v in trips if v.id == trip_id), None)
        if trip is None:
            return

        taxi = next((t for t in taxis if t.id == trip.taxi_id), None)
        if taxi is None:
            return

        # Actualizar posición del taxi al destino
        taxi.x = trip.dest_x
        taxi.y = trip.dest_y

        # Actualizar ingresos del taxi (80 % de la tarifa)
        taxi.total_earned += trip.fare * 0.8

        # Marcar taxi libre de nuevo
        taxi.free = True

        # Marcar viaje como finalizado
        trip.finished = True

        # Liberar un permiso en el semáforo de taxis libres
        free_taxis_sem.release()


def build_status() -> StatusResponse:
    """
    Devuelve un “snapshot” coherente del sistema
    (se protege con lock para que no se lea a mitad de una actualización).
    """
    with lock:
        return StatusResponse(
            taxis=list(taxis),
            clients=list(clients),
            trips=list(trips),
            matches=list(matches_log),
        )


# ---------------------------------------------------
# ENDPOINTS DE LA API (usados por React)
# ---------------------------------------------------

@app.post("/start", response_model=StatusResponse)
def start_system(req: StartRequest):
    """
    Reinicia el sistema UNIETAXI con N taxis.
    - Limpia todas las listas.
    - Reinicia el semáforo de taxis libres.
    - Crea N taxis libres y hace release() por cada uno.
    """
    global taxis, clients, trips, matches_log, free_taxis_sem

    if req.num_taxis <= 0:
        raise HTTPException(status_code=400, detail="num_taxis debe ser > 0")

    with lock:
        taxis = []
        clients = []
        trips = []
        matches_log = []

        # Reiniciar semáforo de taxis libres (valor inicial 0)
        free_taxis_sem = threading.Semaphore(0)

        # Crear N taxis
        for i in range(1, req.num_taxis + 1):
            t = Taxi(
                id=i,
                x=float(i),   # posiciones simples
                y=0.0,
                free=True,
                total_earned=0.0,
            )
            taxis.append(t)
            # Cada taxi libre incrementa el semáforo de conteo
            free_taxis_sem.release()

    return build_status()


@app.get("/status", response_model=StatusResponse)
def get_status():
    """Devuelve el estado actual: taxis, clientes, viajes y últimos matches."""
    return build_status()


@app.post("/request")
def create_request(req: NewRequest):
    """
    Recibe una solicitud de taxi:
    - Espera taxi libre (free_taxis_sem.acquire()).
    - Dentro del lock selecciona el taxi libre más cercano.
    - Crea cliente (si no existe) y viaje.
    - Lanza hilo del viaje.
    """
    trip = assign_taxi_to_request(req)
    return {"status": "ok", "trip_id": trip.id}


@app.get("/financial", response_model=FinancialSummary)
def get_financial():
    """
    Calcula resumen financiero:
    - número total de viajes
    - suma de tarifas
    - 20 % empresa, 80 % taxis
    - detalle por taxi
    - últimos viajes para seguimiento
    """
    with lock:
        total_fares = sum(t.fare for t in trips)
        company_income = round(total_fares * 0.2, 2)
        taxis_income = round(total_fares - company_income, 2)

        per_taxi = []
        for t in taxis:
            per_taxi.append(
                {
                    "taxi_id": t.id,
                    "earned": round(t.total_earned, 2),
                }
            )

        # Seguimiento hasta de 5 viajes
        tracked = trips[-5:] if len(trips) > 5 else list(trips)

    return FinancialSummary(
        total_trips=len(trips),
        total_fares=round(total_fares, 2),
        company_income=company_income,
        taxis_income=taxis_income,
        per_taxi=per_taxi,
        tracked_trips=tracked,
    )




