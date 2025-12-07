from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from math import sqrt
from typing import List

app = FastAPI()

# Permitir peticiones desde el frontend (Vite)
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

# ------------------------
# MODELOS DE ENTRADA
# ------------------------

class StartRequest(BaseModel):
    num_taxis: int

class TaxiRequest(BaseModel):
    name: str
    origin_x: float
    origin_y: float
    dest_x: float
    dest_y: float


# ------------------------
# ESTADO EN MEMORIA
# ------------------------

taxis = []
clients = []
trips = []

next_taxi_id = 1
next_client_id = 1
next_trip_id = 1

COMPANY_PERCENT = 0.20  # 20%
TAXI_PERCENT = 0.80     # 80%


def reset_system(num_taxis: int):
    global taxis, clients, trips, next_taxi_id, next_client_id, next_trip_id
    taxis = []
    clients = []
    trips = []

    next_taxi_id = 1
    next_client_id = 1
    next_trip_id = 1

    # Creamos taxis en (0,0) con estado libre
    for i in range(1, num_taxis + 1):
        taxis.append({
            "id": i,
            "x": 0,
            "y": 0,
            "busy": False,
            "current_trip_id": None,
            "rating": 5.0,
            "total_earnings": 0.0,
        })
    next_taxi_id = num_taxis + 1


def distance(x1, y1, x2, y2):
    return sqrt((x2 - x1)**2 + (y2 - y1)**2)


def assign_taxi_for_trip(origin_x, origin_y):
    # Taxi libre más cercano
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


# ------------------------
# ENDPOINTS
# ------------------------

@app.post("/start")
def start_simulation(req: StartRequest):
    if req.num_taxis <= 0:
        return {"status": "error", "message": "num_taxis debe ser > 0"}

    reset_system(req.num_taxis)
    return {"status": "ok", "num_taxis": len(taxis)}


@app.post("/request")
def create_request(req: TaxiRequest):
    global next_client_id, next_trip_id

    # Crear cliente
    client = {
        "id": next_client_id,
        "name": req.name,
        "origin_x": req.origin_x,
        "origin_y": req.origin_y,
        "dest_x": req.dest_x,
        "dest_y": req.dest_y,
        "rating_given": None,
    }
    clients.append(client)
    next_client_id += 1

    # Asignar taxi
    taxi = assign_taxi_for_trip(req.origin_x, req.origin_y)
    if taxi is None:
        return {"status": "error", "message": "No hay taxis libres"}

    # Calcular viaje
    dist = distance(req.origin_x, req.origin_y, req.dest_x, req.dest_y)
    base_fare = 2.0
    price_per_unit = 1.0
    fare = base_fare + dist * price_per_unit

    trip = {
        "id": next_trip_id,
        "client_id": client["id"],
        "taxi_id": taxi["id"],
        "status": "finished",  # simplificamos: terminado instantáneamente
        "distance": dist,
        "fare": fare,
    }
    trips.append(trip)
    next_trip_id += 1

    # Actualizar taxi
    taxi["busy"] = False
    taxi["current_trip_id"] = trip["id"]
    taxi["x"] = req.dest_x
    taxi["y"] = req.dest_y
    taxi["total_earnings"] += fare * TAXI_PERCENT

    return {"status": "ok", "trip_id": trip["id"]}


@app.get("/status")
def get_status():
    return {
        "taxis": taxis,
        "clients": clients,
        "trips": trips,
    }


@app.get("/financial")
def get_financial():
    # Suma total de lo cobrado por todos los viajes
    total_fares = sum(t["fare"] for t in trips)
    company_total = total_fares * COMPANY_PERCENT

    per_taxi = []
    for t in taxis:
        taxi_earn = t["total_earnings"]
        # comisión empresa por este taxi = (total taxi / 0.8) * 0.2
        if taxi_earn > 0:
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
