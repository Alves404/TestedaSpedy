from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional

# Esquema para criar uma nova reserva (dados de entrada)
class ReservaCriar(BaseModel):
    sala_id: int
    titulo: str
    inicio: datetime
    fim: datetime

    @field_validator('fim')
    @classmethod
    def fim_maior_que_inicio(cls, v, info):
        # Garante que o horário de fim seja posterior ao de início
        if 'inicio' in info.data and v <= info.data['inicio']:
            raise ValueError('O horário de fim deve ser posterior ao horário de início.')
        return v

# Esquema de resposta para uma reserva (dados de saída)
class ReservaResposta(BaseModel):
    id: int
    sala_id: int
    titulo: str
    inicio: datetime
    fim: datetime
    cancelado_em: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Esquema de resposta para uma sala (dados de saída)
class SalaResposta(BaseModel):
    id: int
    nome: str

    model_config = {"from_attributes": True}
