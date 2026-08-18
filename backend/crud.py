from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime
from fastapi import HTTPException
from database import Sala, Reserva

def get_salas(db: Session):
    return db.query(Sala).all()

def get_reservas_ativas(db: Session):
    return db.query(Reserva).filter(Reserva.cancelado_em == None).order_by(Reserva.inicio).all()

def criar_reserva_db(db: Session, sala_id: int, titulo: str, inicio: datetime, fim: datetime):
    # Verifica se a sala de fato existe no banco
    sala = db.query(Sala).filter(Sala.id == sala_id).first()
    if not sala:
        raise HTTPException(status_code=404, detail="Sala não encontrada.")

    # Checagem matemática para evitar colisão/sobreposição de horários de reserva
    reserva_existente = db.query(Reserva).filter(
        Reserva.sala_id == sala_id,
        Reserva.cancelado_em == None,
        or_(
            and_(Reserva.inicio <= inicio, Reserva.fim > inicio),
            and_(Reserva.inicio < fim, Reserva.fim >= fim),
            and_(Reserva.inicio >= inicio, Reserva.fim <= fim)
        )
    ).first()

    if reserva_existente:
        raise HTTPException(status_code=400, detail="Já existe uma reserva para esta sala neste horário.")

    nova_reserva = Reserva(
        sala_id=sala_id,
        titulo=titulo,
        inicio=inicio,
        fim=fim
    )
    db.add(nova_reserva)
    db.commit()
    db.refresh(nova_reserva)
    return nova_reserva

def cancelar_reserva_db(db: Session, reserva_id: int):
    reserva = db.query(Reserva).filter(Reserva.id == reserva_id, Reserva.cancelado_em == None).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada ou já cancelada.")
    
    # Implementação do Soft Delete: Registra a data do cancelamento sem excluir a linha
    reserva.cancelado_em = datetime.now()
    db.commit()
    return {"mensagem": "Reserva cancelada com sucesso (Soft Delete)."}
