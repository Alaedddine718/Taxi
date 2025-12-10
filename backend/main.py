from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import math
import threading
import time
import uuid

app = FastAPI()

# Permitimos peticiones desde el frontend (Vite en localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # para el proyecto de clase está bien así
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========
#  MODELOS
# ==========

class Taxi(BaseModel):
    id: int
    x: int
    y: int
    free: bool = True
    total_earned: float = 0.0  # cuánto ha ganado el taxi

class Client(BaseModel):
    id: int
    name: str

class Trip(BaseModel):
    id: str
    client_name: str
    taxi_id: int
    origin_x: int
    origin_y: int
    dest_x: int
    dest_y: int
    distance: float
    fare: float
    finished: bool = False

class StatusResponse(BaseModel):
    taxis: List[Taxi]
    clients: List[Client]
    trips: List[Trip]

class StartRequest(BaseModel):
    num_taxis: int

class NewRequest(BaseModel):
    client_name: str
    origin_x: int
    origin_y: int
    dest_x: int
    dest_y: int

class FinancialSummary(BaseModel):
    total_trips: int
    total_fares: float
    company_income: float
    taxis_income: float
    income_per_taxi: Dict[int, float]
    sample_trips: List[Trip]

# =========================
#  ESTADO COMPARTIDO + "SEMÁFORO"
# =========================

# Este lock es nuestro "semáforo binario" para proteger la sección crítica
lock = threading.Lock()

taxis: List[Taxi] = []
clients: List[Client] = []
trips: List[Trip] = []

PRICE_PER_KM = 1.5
COMPANY_PERCENT = 0.20  # 20% para la empresa


def calc_distance(o_x: int, o_y: int, d_x: int, d_y: int) -> float:
    """Distancia euclídea entre origen y destino."""
    return math.sqrt((d_x - o_x) ** 2 + (d_y - o_y) ** 2)


def run_trip(trip_id: str) -> None:
    """
    Simula un viaje en un hilo aparte.
    - Duerme unos segundos (viaje)
    - Marca el viaje como terminado
    - Libera el taxi y suma sus ingresos
    """
    global taxis, trips

    # Simulamos que el viaje tarda 3 segundos
    time.sleep(3)

    with lock:  # sección crítica
        trip = next((t for t in trips if t.id == trip_id), None)
        if trip is None:
            return

        taxi = next((tx for tx in taxis if tx.id == trip.taxi_id), None)
        if taxi is None:
            return

        # El taxi llega al destino del viaje
        taxi.x = trip.dest_x
        taxi.y = trip.dest_y
        taxi.free = True

        # El taxi se queda con el 80% del viaje
        taxi.total_earned += trip.fare * (1 - COMPANY_PERCENT)

        # Marcamos el viaje como finalizado
        trip.finished = True


# ======================
#       ENDPOINTS
# ======================

@app.post("/start", response_model=StatusResponse)
def start_system(body: StartRequest):
    """Inicializa el sistema con N taxis y borra el estado anterior."""
    global taxis, clients, trips

    if body.num_taxis <= 0:
        raise HTTPException(status_code=400, detail="num_taxis debe ser > 0")

    with lock:  # protegemos la sección crítica
        taxis = [Taxi(id=i + 1, x=0, y=0, free=True) for i in range(body.num_taxis)]
        clients = []
        trips = []

        return StatusResponse(taxis=taxis, clients=clients, trips=trips)


@app.get("/status", response_model=StatusResponse)
def get_status():
    """Devuelve el estado actual del sistema."""
    with lock:
        return StatusResponse(taxis=taxis, clients=clients, trips=trips)


@app.post("/request", response_model=Trip)
def new_request(body: NewRequest):
    """
    Crea una nueva solicitud de taxi:
    - Busca el taxi libre más cercano
    - Crea un viaje
    - Lanza un hilo que simula el viaje
    """
    global taxis, clients, trips

    with lock:
        if not taxis:
            raise HTTPException(
                status_code=400,
                detail="No hay taxis en el sistema. Inicia la simulación primero.",
            )

        # Elegimos solo taxis libres
        libres = [tx for tx in taxis if tx.free]
        if not libres:
            raise HTTPException(
                status_code=400,
                detail="No hay taxis libres en este momento.",
            )

        # Elegimos el taxi libre más cercano al origen
        distancias = [
            (tx, calc_distance(body.origin_x, body.origin_y, tx.x, tx.y))
            for tx in libres
        ]
        distancias.sort(key=lambda par: par[1])
        chosen_taxi, dist = distancias[0]
        chosen_taxi.free = False

        # Buscamos o creamos el cliente
        client = next((c for c in clients if c.name == body.client_name), None)
        if client is None:
            client = Client(id=len(clients) + 1, name=body.client_name)
            clients.append(client)

        # Calculamos la tarifa
        fare = round(dist * PRICE_PER_KM, 2)

        trip = Trip(
            id=str(uuid.uuid4()),
            client_name=client.name,
            taxi_id=chosen_taxi.id,
            origin_x=body.origin_x,
            origin_y=body.origin_y,
            dest_x=body.dest_x,
            dest_y=body.dest_y,
            distance=round(dist, 2),
            fare=fare,
            finished=False,
        )
        trips.append(trip)

    # Lanzamos el hilo que simula el viaje fuera del lock
    hilo = threading.Thread(target=run_trip, args=(trip.id,), daemon=True)
    hilo.start()

    return trip


@app.get("/financial", response_model=FinancialSummary)
def get_financial():
    """
    Calcula resumen económico:
    - número de viajes
    - suma total de tarifas
    - ingreso empresa (20%)
    - ingreso taxis (80%)
    - ingresos por taxi
    - 5 primeros viajes como muestra
    """
    with lock:
        total_fares = sum(t.fare for t in trips)
        total_trips = len(trips)

        company_income = round(total_fares * COMPANY_PERCENT, 2)
        taxis_income = round(total_fares * (1 - COMPANY_PERCENT), 2)

        income_per_taxi: Dict[int, float] = {
            tx.id: round(tx.total_earned, 2) for tx in taxis
        }

        sample_trips = trips[:5]

        return FinancialSummary(
            total_trips=total_trips,
            total_fares=round(total_fares, 2),
            company_income=company_income,
            taxis_income=taxis_income,
            income_per_taxi=income_per_taxi,
            sample_trips=sample_trips,
        )

