from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional, List

# Imports from our single database file
from database import engine, Base, SessionLocal, Sala, Reserva

app = FastAPI(title="Coworking Booking API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Schemas ---
class ReservaCriar(BaseModel):
    sala_id: int
    titulo: str
    inicio: datetime
    fim: datetime

    @field_validator('fim')
    @classmethod
    def fim_maior_que_inicio(cls, v, info):
        if 'inicio' in info.data and v <= info.data['inicio']:
            raise ValueError('O horário de fim deve ser posterior ao horário de início.')
        return v

class ReservaResposta(BaseModel):
    id: int
    sala_id: int
    titulo: str
    inicio: datetime
    fim: datetime
    cancelado_em: Optional[datetime] = None

    model_config = {"from_attributes": True}

class SalaResposta(BaseModel):
    id: int
    nome: str

    model_config = {"from_attributes": True}

# --- Routes (Integrated) ---
import crud
router = APIRouter()

@router.get("/salas", response_model=List[SalaResposta])
def ler_salas(db: Session = Depends(get_db)):
    return crud.get_salas(db)

@router.get("/reservas", response_model=List[ReservaResposta])
def ler_reservas(db: Session = Depends(get_db)):
    return crud.get_reservas_ativas(db)

@router.post("/reservas", response_model=ReservaResposta)
def criar_reserva(reserva: ReservaCriar, db: Session = Depends(get_db)):
    return crud.criar_reserva_db(db, reserva.sala_id, reserva.titulo, reserva.inicio, reserva.fim)

@router.delete("/reservas/{reserva_id}")
def cancelar_reserva(reserva_id: int, db: Session = Depends(get_db)):
    return crud.cancelar_reserva_db(db, reserva_id)

app.include_router(router, prefix="/api")

# --- Startup Event (Database Seeding) ---
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if db.query(Sala).count() == 0:
        salas_iniciais = [
            Sala(nome="Sala Steve Jobs"),
            Sala(nome="Sala Bill Gates"),
            Sala(nome="Sala Ada Lovelace")
        ]
        db.add_all(salas_iniciais)
        db.commit()
    db.close()
