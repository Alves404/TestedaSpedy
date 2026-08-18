from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from banco_de_dados import Base
from datetime import datetime

class Sala(Base):
    __tablename__ = "salas"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, index=True)

class Reserva(Base):
    __tablename__ = "reservas"
    id = Column(Integer, primary_key=True, index=True)
    sala_id = Column(Integer, ForeignKey("salas.id"))
    titulo = Column(String, nullable=False)
    inicio = Column(DateTime, nullable=False)
    fim = Column(DateTime, nullable=False)
    cancelado_em = Column(DateTime, nullable=True, default=None)
