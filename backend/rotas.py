from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import servicos, esquemas
from banco_de_dados import obter_banco

router = APIRouter()

@router.get("/salas", response_model=List[esquemas.SalaResposta])
def ler_salas(banco: Session = Depends(obter_banco)):
    return servicos.listar_salas(banco)

@router.get("/reservas", response_model=List[esquemas.ReservaResposta])
def ler_reservas(banco: Session = Depends(obter_banco)):
    return servicos.listar_reservas_ativas(banco)

@router.post("/reservas", response_model=esquemas.ReservaResposta)
def adicionar_reserva(reserva: esquemas.ReservaCriar, banco: Session = Depends(obter_banco)):
    return servicos.criar_reserva(banco, reserva)

@router.delete("/reservas/{reserva_id}")
def deletar_reserva(reserva_id: int, banco: Session = Depends(obter_banco)):
    return servicos.cancelar_reserva(banco, reserva_id)
