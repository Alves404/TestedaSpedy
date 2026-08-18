// Tipagem para uma Sala de reunião
export type Sala = {
  id: number;
  nome: string;
};

// Tipagem para uma Reserva (dados retornados pelo back-end)
export type Reserva = {
  id: number;
  sala_id: number;
  titulo: string;
  inicio: string;
  fim: string;
  cancelado_em: string | null;
};

// Tipagem para criar uma nova Reserva (dados enviados ao back-end)
export type ReservaCriar = {
  sala_id: number;
  titulo: string;
  inicio: string;
  fim: string;
};
