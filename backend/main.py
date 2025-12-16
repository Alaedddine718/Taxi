# backend/main.py
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import threading
import time
import math

# ---------------------------------------------------
# MODELOS DE DATOS
# ---------------------------------------------------

class Taxi(BaseModel):
    id: int
    x: float
    y: float
    free: bool = True
    total_earned: float = 0.0
    rating: float = 0.0
    rating_sum: int = 0
    rating_count: int = 0


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
    finished: bool = False


class Match(BaseModel):
    trip_id: int
    client_name: str
    taxi_id: int
    distance: float


class StartRequest(BaseModel):
    num_taxis: int


class NewRequest(BaseModel):
    client_name: str
    origin_x: float
    origin_y: float
    dest_x: float
    dest_y: float


class RatingRequest(BaseModel):
    taxi_id: int
    rating: int


class StatusResponse(BaseModel):
    taxis: List[Taxi]
    clients: List[Client]
    trips: List[Trip]
    matches: List[Match]


class FinancialSummary(BaseModel):
    total_trips: int
    total_fares: float
    company_income: float
    taxis_income: float
    per_taxi: List[dict]
    tracked_trips: List[Trip]


# ---------------------------------------------------
# ESTADO GLOBAL + SEMÁFOROS
# ---------------------------------------------------

taxis: List[Taxi] = []
clients: List[Client] = []
trips: List[Trip] = []
matches_log: List[Match] = []

# 🔒 Mutex (sección crítica)
lock = threading.Lock()
# 🚦 Semáforo de conteo: cuántos taxis libres hay
free_taxis_sem = threading.Semaphore(0)


# ---------------------------------------------------
# APP FASTAPI + CORS
# ---------------------------------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------
# FUNCIONES AUXILIARES
# ---------------------------------------------------

def distance(a_x: float, a_y: float, b_x: float, b_y: float) -> float:
    return math.sqrt((a_x - b_x) ** 2 + (a_y - b_y) ** 2)


def calculate_fare(dist: float) -> float:
    return round(5 + 2 * dist, 2)


def find_or_create_client(name: str) -> Client:
    global clients
    for c in clients:
        if c.name == name:
            return c
    new_client = Client(id=len(clients) + 1, name=name)
    clients.append(new_client)
    return new_client


def assign_taxi_to_request(req: NewRequest) -> Trip:
    """
    FUNCIÓN CLAVE DE SINCRONIZACIÓN:

    - Usa free_taxis_sem (semaforo de conteo) para BLOQUEAR
      la solicitud hasta que haya al menos un taxi libre.
    - Como los taxis se liberan en run_trip después de 20 segundos,
      si todos están ocupados la nueva petición ESPERA esos ~20 s.
    """
    global taxis, trips, matches_log, free_taxis_sem

    # 👉 Aquí ya NO hay timeout: se queda esperando al taxi.
    free_taxis_sem.acquire()

    with lock:
        # lista de taxis libres en este momento
        free_taxis = [t for t in taxis if t.free]
        if not free_taxis:
            # por seguridad, devolvemos el permiso
            free_taxis_sem.release()
            raise HTTPException(status_code=503, detail="No hay taxis libres en este momento")

        # taxi libre más cercano al cliente
        best_taxi = None
        best_dist = None
        for t in free_taxis:
            d = distance(t.x, t.y, req.origin_x, req.origin_y)
            if best_dist is None or d < best_dist:
                best_dist = d
                best_taxi = t

        # cliente (se crea si no existía)
        client = find_or_create_client(req.client_name)

        # distancia viaje + tarifa
        dist = distance(req.origin_x, req.origin_y, req.dest_x, req.dest_y)
        fare = calculate_fare(dist)

        # crear viaje
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

        # marcar taxi ocupado
        best_taxi.free = False

        # guardar match
        match = Match(
            trip_id=trip.id,
            client_name=client.name,
            taxi_id=best_taxi.id,
            distance=best_dist if best_dist is not None else 0.0,
        )
        matches_log.append(match)
        if len(matches_log) > 8:
            matches_log = matches_log[-8:]

    # lanzar hilo que simula el viaje
    thread = threading.Thread(target=run_trip, args=(trip.id,), daemon=True)
    thread.start()

    return trip


def run_trip(trip_id: int):
    """
    Hilo que simula el viaje:
    - Duerme 20 s (tiempo de viaje).
    - Marca el viaje como terminado.
    - Vuelve a poner el taxi como libre.
    - Hace free_taxis_sem.release() para desbloquear la siguiente solicitud.
    """
    global taxis, trips, free_taxis_sem

    # ⏱️ SIMULACIÓN DEL VIAJE: 20 segundos
    time.sleep(20)

    with lock:
        trip = next((v for v in trips if v.id == trip_id), None)
        if trip is None:
            return

        taxi = next((t for t in taxis if t.id == trip.taxi_id), None)
        if taxi is None:
            return

        taxi.x = trip.dest_x
        taxi.y = trip.dest_y
        taxi.total_earned += trip.fare * 0.8
        taxi.free = True
        trip.finished = True

        # 👉 Aquí liberamos un taxi libre más
        free_taxis_sem.release()


def build_status() -> StatusResponse:
    with lock:
        return StatusResponse(
            taxis=list(taxis),
            clients=list(clients),
            trips=list(trips),
            matches=list(matches_log),
        )


# ---------------------------------------------------
# ENDPOINTS
# ---------------------------------------------------

@app.post("/start", response_model=StatusResponse)
def start_system(req: StartRequest):
    """
    Reinicia el sistema con N taxis.
    Inicializa el semáforo con N permisos (N taxis libres).
    """
    global taxis, clients, trips, matches_log, free_taxis_sem

    if req.num_taxis <= 0:
        raise HTTPException(status_code=400, detail="num_taxis debe ser > 0")

    with lock:
        taxis = []
        clients = []
        trips = []
        matches_log = []

        free_taxis_sem = threading.Semaphore(0)

        for i in range(1, req.num_taxis + 1):
            t = Taxi(
                id=i,
                x=float(i),
                y=0.0,
                free=True,
                total_earned=0.0,
                rating=0.0,
                rating_sum=0,
                rating_count=0,
            )
            taxis.append(t)
            free_taxis_sem.release()

    return build_status()


@app.get("/status", response_model=StatusResponse)
def get_status():
    return build_status()


@app.post("/request")
def create_request(payload: dict = Body(...)):
    """
    Recibe una solicitud de taxi.
    Acepta camelCase o snake_case y nunca peta por tipos:
    si algo viene vacío lo convierte a 0.0.
    """
    def safe_float(value, default=0.0):
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    client_name = (
        payload.get("client_name")
        or payload.get("clientName")
        or "Cliente_sin_nombre"
    )

    origin_x = safe_float(payload.get("origin_x") or payload.get("originX"), 0.0)
    origin_y = safe_float(payload.get("origin_y") or payload.get("originY"), 0.0)
    dest_x = safe_float(payload.get("dest_x") or payload.get("destX"), 0.0)
    dest_y = safe_float(payload.get("dest_y") or payload.get("destY"), 0.0)

    req = NewRequest(
        client_name=str(client_name),
        origin_x=origin_x,
        origin_y=origin_y,
        dest_x=dest_x,
        dest_y=dest_y,
    )

    trip = assign_taxi_to_request(req)
    return {"status": "ok", "trip_id": trip.id}


@app.post("/rate")
def rate_taxi(req: RatingRequest):
    global taxis

    if req.rating < 1 or req.rating > 5:
        raise HTTPException(status_code=400, detail="La valoración debe estar entre 1 y 5")

    with lock:
        taxi = next((t for t in taxis if t.id == req.taxi_id), None)
        if taxi is None:
            raise HTTPException(status_code=404, detail="Taxi no encontrado")

        taxi.rating_sum += req.rating
        taxi.rating_count += 1
        taxi.rating = round(taxi.rating_sum / taxi.rating_count, 2)

    return {"status": "ok", "taxi_id": taxi.id, "rating": taxi.rating}


@app.get("/financial", response_model=FinancialSummary)
def get_financial():
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
                    "rating": round(t.rating, 2) if t.rating_count > 0 else None,
                }
            )

        tracked = trips[-5:] if len(trips) > 5 else list(trips)

    return FinancialSummary(
        total_trips=len(trips),
        total_fares=round(total_fares, 2),
        company_income=company_income,
        taxis_income=taxis_income,
        per_taxi=per_taxi,
        tracked_trips=tracked,
    )








