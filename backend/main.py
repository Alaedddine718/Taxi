"""
Backend del sistema UNIETAXI
----------------------------

Objetivo del ejercicio:
- Practicar sincronización y comunicación entre procesos/hilos.
- Control de recursos críticos (listas compartidas de taxis, clientes, viajes).
- Uso de semáforos y locks.

Este archivo implementa:
- FastAPI como servidor web.
- Un hilo que simula el "Sistema de atención".
- Endpoints:
    POST /start      -> iniciar el sistema con N taxis
    POST /request    -> un cliente pide un taxi
    GET  /status     -> estado general del sistema (taxis, clientes, viajes, métricas)
    GET  /financial  -> resumen de ingresos y cierre contable básico
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import threading
import time
import math
import random
from typing import List, Dict, Any

# -----------------------------
# Configuración general
# -----------------------------

# Porcentaje que se queda la empresa
COMPANY_PERCENT = 0.20   # 20 %
TAXI_PERCENT = 0.80      # 80 %

# Velocidad de la simulación (para los sleeps del hilo)
SLEEP_FACTOR = 0.05      # cuanto más pequeño, más rápido van los viajes


# -----------------------------
# Estado compartido del sistema
# -----------------------------
# Estas estructuras son el "recurso crítico"

taxis: List[Dict[str, Any]] = []            # lista de taxis registrados
clients: List[Dict[str, Any]] = []          # lista de clientes registrados
trips: List[Dict[str, Any]] = []            # lista de viajes realizados
pending_requests: List[Dict[str, Any]] = [] # cola de solicitudes pendientes

# Lock para proteger el acceso concurrente a las estructuras anteriores
state_lock = threading.Lock()

# Semáforo que indica cuántas solicitudes hay en la cola
sem_requests = threading.Semaphore(0)


# -----------------------------
# Modelos de entrada (Pydantic)
# -----------------------------

class StartRequest(BaseModel):
    num_taxis: int


class TaxiRequest(BaseModel):
    name: str
    origin_x: int
    origin_y: int
    dest_x: int
    dest_y: int


# -----------------------------
# Funciones auxiliares
# -----------------------------

def distance(x1: float, y1: float, x2: float, y2: float) -> float:
    """Distancia euclídea simple entre dos puntos (x1, y1) y (x2, y2)."""
    return math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)


def reset_system(num_taxis: int) -> None:
    """
    Reinicia el estado del sistema:
    - Borra taxis, clientes, viajes y solicitudes pendientes.
    - Crea num_taxis taxis nuevos con posición aleatoria.
    """
    with state_lock:
        taxis.clear()
        clients.clear()
        trips.clear()
        pending_requests.clear()

        # Creamos taxis con posición aleatoria en un mapa 0..10 x 0..10
        for i in range(1, num_taxis + 1):
            taxis.append({
                "id": i,
                "x": random.randint(0, 10),
                "y": random.randint(0, 10),
                "status": "free",        # "free" o "busy"
                "total_earnings": 0.0,   # dinero acumulado para este taxi
            })


def choose_best_taxi(req: Dict[str, Any]):
    """
    Elige el taxi libre más cercano al punto de origen de la solicitud.
    Si no hay taxis libres, devuelve None.
    """
    origin_x = req["origin_x"]
    origin_y = req["origin_y"]

    best_taxi = None
    best_dist = None

    for t in taxis:
        if t["status"] != "free":
            continue
        d = distance(t["x"], t["y"], origin_x, origin_y)
        if best_dist is None or d < best_dist:
            best_dist = d
            best_taxi = t

    return best_taxi, best_dist


def simulate_trip(taxi: Dict[str, Any], req: Dict[str, Any]) -> None:
    """
    Simula el viaje de un taxi para atender una solicitud:
    - Se mueve desde su posición actual al origen del cliente.
    - Luego del origen al destino.
    - Calcula distancia total y tarifa.
    """
    # Copiamos datos de la solicitud
    origin_x = req["origin_x"]
    origin_y = req["origin_y"]
    dest_x = req["dest_x"]
    dest_y = req["dest_y"]

    # Distancia desde el taxi al cliente
    dist_to_client = distance(taxi["x"], taxi["y"], origin_x, origin_y)
    # Distancia desde el cliente al destino
    dist_trip = distance(origin_x, origin_y, dest_x, dest_y)
    total_dist = dist_to_client + dist_trip

    # Simulamos tiempo (muy pequeño para que la demo no tarde)
    time.sleep(SLEEP_FACTOR * total_dist)

    # Tarifa simple: por ejemplo, 2 € por unidad de distancia
    fare = round(total_dist * 2.0, 2)

    with state_lock:
        # Actualizamos posición final y estado del taxi
        taxi["x"] = dest_x
        taxi["y"] = dest_y
        taxi["status"] = "free"

        # Parte para el taxi (80 %)
        taxi_earn = fare * TAXI_PERCENT
        taxi["total_earnings"] += taxi_earn

        # Registramos el viaje
        trip_id = len(trips) + 1
        trips.append({
            "id": trip_id,
            "client_id": req["client_id"],
            "taxi_id": taxi["id"],
            "origin_x": origin_x,
            "origin_y": origin_y,
            "dest_x": dest_x,
            "dest_y": dest_y,
            "distance": total_dist,
            "fare": fare,
            "status": "finished",
        })


def worker_loop():
    """
    Hilo principal del Sistema de atención.

    - Espera en el semáforo hasta que haya solicitudes.
    - Extrae una solicitud de la cola (sección crítica con el lock).
    - Elige el taxi libre más cercano.
    - Simula el viaje.
    """
    while True:
        # Esperamos a que haya al menos una solicitud en la cola
        sem_requests.acquire()

        # Tomamos una solicitud pendiente
        with state_lock:
            if not pending_requests:
                # Puede pasar si hubo un reordenamiento raro; continuamos
                continue

            req = pending_requests.pop(0)

            # Elegimos el mejor taxi libre
            taxi, _ = choose_best_taxi(req)

            if taxi is None:
                # No hay taxis libres: reinsertamos la solicitud y continuamos
                pending_requests.append(req)
                # Pequeña espera para no hacer un bucle demasiado rápido
                time.sleep(0.1)
                # Volvemos a liberar el semáforo porque la solicitud sigue viva
                sem_requests.release()
                continue

            # Marcamos el taxi como ocupado
            taxi["status"] = "busy"

        # Simulamos el viaje fuera de la sección crítica
        simulate_trip(taxi, req)


# Lanzamos el hilo del sistema de atención al arrancar el backend
worker_thread = threading.Thread(target=worker_loop, daemon=True)
worker_thread.start()


# -----------------------------
# Inicialización de FastAPI
# -----------------------------

app = FastAPI(title="UNIETAXI Backend")

# Permitimos peticiones desde el frontend (Vite en localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # para el proyecto basta con permitir todo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Endpoints
# -----------------------------

@app.post("/start")
def start_system(body: StartRequest):
    """
    Inicia o reinicia el sistema con N taxis.
    Esta operación:
      - limpia taxis, clientes, viajes y cola de solicitudes
      - crea num_taxis taxis nuevos
    """
    num = max(1, body.num_taxis)
    reset_system(num)
    return {
        "message": "Sistema iniciado",
        "num_taxis": num,
    }


@app.post("/request")
def create_request(body: TaxiRequest):
    """
    Un cliente realiza una nueva solicitud de taxi.
    - Se registra el cliente (id, nombre).
    - Se añade una solicitud a la cola pendiente.
    - Se libera el semáforo para que el hilo de atención la procese.
    """
    with state_lock:
        client_id = len(clients) + 1
        clients.append({
            "id": client_id,
            "name": body.name,
        })

        req_id = len(pending_requests) + len(trips) + 1
        request = {
            "id": req_id,
            "client_id": client_id,
            "origin_x": body.origin_x,
            "origin_y": body.origin_y,
            "dest_x": body.dest_x,
            "dest_y": body.dest_y,
        }
        pending_requests.append(request)

        # Incrementamos el semáforo: hay una nueva solicitud para el hilo
        sem_requests.release()

    return {
        "message": "Solicitud registrada",
        "client_id": client_id,
        "request_id": req_id,
    }


@app.get("/status")
def get_status():
    """
    Devuelve un resumen del estado del sistema:
    - listas de taxis, clientes y viajes
    - métricas agregadas para el dashboard
    """
    with state_lock:
        total_taxis = len(taxis)
        total_clients = len(clients)
        total_trips = len(trips)
        free_taxis = sum(1 for t in taxis if t["status"] == "free")
        busy_taxis = total_taxis - free_taxis
        ongoing_trips = busy_taxis  # aproximación: 1 viaje por taxi ocupado

        return {
            "taxis": taxis,
            "clients": clients,
            "trips": trips,
            "metrics": {
                "total_taxis": total_taxis,
                "total_clients": total_clients,
                "total_trips": total_trips,
                "free_taxis": free_taxis,
                "busy_taxis": busy_taxis,
                "ongoing_trips": ongoing_trips,
            },
        }


@app.get("/financial")
def get_financial():
    """
    Cierre contable básico:
    - total_fares: suma de todas las tarifas cobradas a los clientes
    - total_trips: número total de viajes realizados
    - company_total: 20% del total_fares (lo que gana la empresa)
    - taxis_total: 80% del total_fares (lo que se reparten los taxis)
    - per_taxi: lista con lo que gana cada taxi y la parte estimada de empresa
    """
    with state_lock:
        total_fares = sum(t["fare"] for t in trips)
        total_trips = len(trips)
        company_total = total_fares * COMPANY_PERCENT
        taxis_total = total_fares * TAXI_PERCENT

        per_taxi = []
        for t in taxis:
            taxi_earn = t["total_earnings"]
            if taxi_earn > 0:
                # parte de la empresa asociada a este taxi, proporcional
                company_part = taxi_earn * COMPANY_PERCENT / TAXI_PERCENT
            else:
                company_part = 0.0

            per_taxi.append({
                "taxi_id": t["id"],
                "taxi_earnings": taxi_earn,
                "company_part": company_part,
            })

        return {
            "total_fares": total_fares,
            "total_trips": total_trips,
            "company_total": company_total,
            "taxis_total": taxis_total,
            "per_taxi": per_taxi,
        }
