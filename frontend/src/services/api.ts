import type { Sala, Reserva, ReservaCriar } from '../types';

const API_URL = 'http://localhost:8000/api';

export const fetchSalas = async (): Promise<Sala[]> => {
  const res = await fetch(`${API_URL}/salas`);
  return res.json();
};

export const fetchReservas = async (): Promise<Reserva[]> => {
  const res = await fetch(`${API_URL}/reservas`);
  return res.json();
};

export const createReserva = async (reserva: ReservaCriar): Promise<Reserva> => {
  const res = await fetch(`${API_URL}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reserva),
  });
  if (!res.ok) {
    const err = await res.json();
    let errorMessage = 'Erro ao criar reserva';
    
    if (typeof err.detail === 'string') {
      errorMessage = err.detail;
    } else if (Array.isArray(err.detail)) {
      errorMessage = err.detail.map((e: any) => e.msg).join(', ');
    } else if (err.detail && typeof err.detail === 'object') {
      errorMessage = JSON.stringify(err.detail);
    }
    
    if (errorMessage.includes('Já existe uma reserva para esta sala')) {
        errorMessage = 'Conflito de Agendamento: Já há uma reunião agendada nesse horário para a sala selecionada. Verifique a disponibilidade.';
    }

    throw new Error(errorMessage);
  }
  return res.json();
};

export const cancelReserva = async (id: number): Promise<{ mensagem: string }> => {
  const res = await fetch(`${API_URL}/reservas/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Erro ao cancelar reserva');
  }
  return res.json();
};
