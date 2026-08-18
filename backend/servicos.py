from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from modelos import Reserva, Sala
from esquemas import ReservaCriar
from datetime import datetime
from fastapi import HTTPException

def listar_salas(banco: Session):
    return banco.query(Sala).all()

def listar_reservas_ativas(banco: Session):
    return banco.query(Reserva).filter(Reserva.cancelado_em == None).order_by(Reserva.inicio).all()

def verificar_sobreposicao(banco: Session, sala_id: int, inicio: datetime, fim: datetime):
    reserva_existente = banco.query(Reserva).filter(
        Reserva.sala_id == sala_id,
        Reserva.cancelado_em == None,
        or_(
            and_(Reserva.inicio <= inicio, Reserva.fim > inicio),
            and_(Reserva.inicio < fim, Reserva.fim >= fim),
            and_(Reserva.inicio >= inicio, Reserva.fim <= fim)
        )
    ).first()
    return reserva_existente

def criar_reserva(banco: Session, reserva: ReservaCriar):
    # Verifica se a sala existe
    sala = banco.query(Sala).filter(Sala.id == reserva.sala_id).first()
    if not sala:
        raise HTTPException(status_code=404, detail="Sala não encontrada.")

    # Verifica sobreposição
    if verificar_sobreposicao(banco, reserva.sala_id, reserva.inicio, reserva.fim):
        raise HTTPException(status_code=400, detail="Já existe uma reserva para esta sala neste horário.")

    nova_reserva = Reserva(
        sala_id=reserva.sala_id,
        titulo=reserva.titulo,
        inicio=reserva.inicio,
        fim=reserva.fim
    )
    banco.add(nova_reserva)
    banco.commit()
    banco.refresh(nova_reserva)
    return nova_reserva

def cancelar_reserva(banco: Session, reserva_id: int):
    reserva = banco.query(Reserva).filter(Reserva.id == reserva_id, Reserva.cancelado_em == None).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada ou já cancelada.")
    
    reserva.cancelado_em = datetime.now()
    banco.commit()
    return {"mensagem": "Reserva cancelada com sucesso (Soft Delete)."}
