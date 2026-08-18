import { useEffect, useState, FormEvent } from 'react';
import type { Sala, Reserva } from '../../types';
import { fetchSalas, fetchReservas, createReserva, cancelReserva } from '../../services/api';

/* --- Tipagem interna para Toast --- */
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export default function MobileApp() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmTitulo, setConfirmTitulo] = useState('');

  // Campos do formulário
  const [salaId, setSalaId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Exibe uma mensagem toast temporária
  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Busca dados do back-end
  const loadData = async () => {
    try {
      const [s, r] = await Promise.all([fetchSalas(), fetchReservas()]);
      setSalas(s);
      setReservas(r);
    } catch {
      showToast('Erro ao conectar com o servidor.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Envia o formulário de nova reserva
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReserva({
        sala_id: Number(salaId),
        titulo,
        inicio: new Date(inicio).toISOString(),
        fim: new Date(fim).toISOString(),
      });
      showToast('✓ Reserva criada com sucesso!', 'success');
      setIsSheetOpen(false);
      setSalaId(''); setTitulo(''); setInicio(''); setFim('');
      loadData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro ao criar reserva';
      showToast(`✕ ${msg}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Abre modal de confirmação de cancelamento
  const pedirCancelamento = (id: number, nome: string) => {
    setConfirmId(id);
    setConfirmTitulo(nome);
  };

  // Executa o cancelamento (Soft Delete)
  const confirmarCancelamento = async () => {
    if (!confirmId) return;
    try {
      await cancelReserva(confirmId);
      showToast('Reserva cancelada.', 'success');
      loadData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao cancelar';
      showToast(`✕ ${msg}`, 'error');
    } finally {
      setConfirmId(null);
    }
  };

  // Formata data para exibição
  const formatarData = (data: string) =>
    new Date(data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  const nomeSala = (id: number) => salas.find(s => s.id === id)?.nome ?? 'Sala desconhecida';

  return (
    <div className="mobile-layout">

      {/* ---- HEADER ---- */}
      <header className="mobile-header">
        <div className="mobile-logo">
          <div className="logo-icon">🏢</div>
          <h1>CoWork</h1>
        </div>
        <button className="btn-fab" onClick={() => setIsSheetOpen(true)} title="Nova reserva">+</button>
      </header>

      {/* ---- LISTAGEM ---- */}
      <div className="mobile-content">
        <h2>Reservas Ativas</h2>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
          </div>
        ) : reservas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>Nenhuma reserva ativa</h3>
            <p>Toque em + para agendar uma sala.</p>
          </div>
        ) : (
          <div className="reservations-list">
            {reservas.map(r => (
              <div key={r.id} className="mobile-card">
                <p className="mobile-card-title">{r.titulo}</p>
                <div className="mobile-card-info">
                  <span>🚪 {nomeSala(r.sala_id)}</span>
                  <span>🕐 Início: {formatarData(r.inicio)}</span>
                  <span>🕓 Fim: {formatarData(r.fim)}</span>
                </div>
                <div className="mobile-card-footer">
                  <button className="btn-danger" onClick={() => pedirCancelamento(r.id, r.titulo)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- BOTTOM SHEET (FORMULÁRIO) ---- */}
      {isSheetOpen && (
        <div className="mobile-sheet-overlay" onClick={() => setIsSheetOpen(false)}>
          <div className="mobile-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <p className="sheet-title">Nova Reserva</p>
            <form onSubmit={handleSubmit} className="reservation-form">
              <div className="form-group">
                <label htmlFor="m-sala">Sala</label>
                <select id="m-sala" value={salaId} onChange={e => setSalaId(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="m-titulo">Título</label>
                <input id="m-titulo" type="text" placeholder="Ex: Daily Scrum" value={titulo} onChange={e => setTitulo(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="m-inicio">Início</label>
                <input id="m-inicio" type="datetime-local" value={inicio} onChange={e => setInicio(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="m-fim">Fim</label>
                <input id="m-fim" type="datetime-local" value={fim} onChange={e => setFim(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Agendando...' : 'Confirmar Reserva'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---- MODAL DE CONFIRMAÇÃO ---- */}
      {confirmId !== null && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Cancelar Reserva?</h3>
            <p>Cancelar a reserva <strong>"{confirmTitulo}"</strong>?</p>
            <div className="confirm-actions">
              <button className="btn-ghost" onClick={() => setConfirmId(null)}>Voltar</button>
              <button className="btn-danger" onClick={confirmarCancelamento}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ---- TOASTS ---- */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
        ))}
      </div>
    </div>
  );
}
