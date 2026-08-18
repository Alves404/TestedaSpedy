from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = "sqlite:///./coworking.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Sala(Base):
    __tablename__ = "salas"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    reservas = relationship("Reserva", back_populates="sala")

class Reserva(Base):
    __tablename__ = "reservas"
    id = Column(Integer, primary_key=True, index=True)
    sala_id = Column(Integer, ForeignKey("salas.id"))
    titulo = Column(String)
    inicio = Column(DateTime, index=True)
    fim = Column(DateTime, index=True)
    cancelado_em = Column(DateTime, nullable=True)
    sala = relationship("Sala", back_populates="reservas")
