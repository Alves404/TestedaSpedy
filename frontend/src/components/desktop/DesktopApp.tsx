import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Sala, Reserva } from '../../types';
import { fetchSalas, fetchReservas, createReserva, cancelReserva } from '../../services/api';

/* --- Tipagem interna para Toast --- */
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

/* --- Tipagem para o modal de confirmação --- */
interface ConfirmState {
  visible: boolean;
  reservaId: number | null;
  titulo: string;
}

export default function DesktopApp() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirm, setConfirm] = useState<ConfirmState>({ visible: false, reservaId: null, titulo: '' });

  // Campos do formulário
  const [salaId, setSalaId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Exibe uma mensagem toast temporária (sucesso ou erro)
  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Busca salas e reservas do back-end
  const loadData = async () => {
    try {
      const [s, r] = await Promise.all([fetchSalas(), fetchReservas()]);
      setSalas(s);
      setReservas(r);
    } catch {
      showToast('Erro ao conectar com o servidor. Verifique se o back-end está rodando.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Envia o formulário de criação de reserva
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReserva({
        sala_id: Number(salaId),
        titulo,
        inicio: inicio.length === 16 ? inicio + ':00' : inicio,
        fim: fim.length === 16 ? fim + ':00' : fim,
      });
      showToast('✓ Reserva criada com sucesso!', 'success');
      setSalaId(''); setTitulo(''); setInicio(''); setFim('');
      loadData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro ao criar reserva';
      showToast(`✕ ${msg}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Abre o modal de confirmação de cancelamento
  const pedirCancelamento = (id: number, nome: string) => {
    setConfirm({ visible: true, reservaId: id, titulo: nome });
  };

  // Confirma o cancelamento (Soft Delete) com Atualização Otimista
  const confirmarCancelamento = async () => {
    if (!confirm.reservaId) return;
    
    const idParaCancelar = confirm.reservaId;
    
    // Atualização Otimista: Remove da tela imediatamente
    setReservas(prev => prev.filter(r => r.id !== idParaCancelar));
    setConfirm({ visible: false, reservaId: null, titulo: '' });
    
    try {
      await cancelReserva(idParaCancelar);
      showToast('Reserva cancelada.', 'success');
      // Traz os dados oficiais em background
      loadData();
    } catch (e: unknown) {
      // Em caso de erro, avisa e recarrega para restaurar o estado original
      const msg = e instanceof Error ? e.message : 'Erro ao cancelar';
      showToast(`✕ ${msg}`, 'error');
      loadData();
    }
  };

  // Formata data para exibição em pt-BR
  const formatarData = (data: string) =>
    new Date(data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  // Retorna o nome da sala pelo ID
  // Retorna o nome da sala pelo ID
  const nomeSala = (id: number) => salas.find(s => s.id === id)?.nome ?? 'Sala desconhecida';

  return (
    <div className="desktop-layout">
      {/* ---- SIDEBAR / FORMULÁRIO ---- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <h1>CoWork</h1>
          </div>
          <p className="sidebar-subtitle">Sistema de Reservas</p>
        </div>

        <div className="sidebar-form-area">
          <p className="form-section-title">Nova Reserva</p>
          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-group">
              <label htmlFor="sala">Sala de Reunião</label>
              <select
                id="sala"
                value={salaId}
                onChange={e => setSalaId(e.target.value)}
                required
              >
                <option value="">Selecione uma sala...</option>
                {salas.map(s => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="titulo">Título da Reunião</label>
              <input
                id="titulo"
                type="text"
                placeholder="Ex: Reunião de Sprint"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="inicio">Horário de Início</label>
              <input
                id="inicio"
                type="datetime-local"
                value={inicio}
                onChange={e => setInicio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fim">Horário de Fim</label>
              <input
                id="fim"
                type="datetime-local"
                value={fim}
                onChange={e => setFim(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Agendando...' : '+ Agendar Sala'}
            </button>
          </form>
        </div>
      </aside>

      {/* ---- ÁREA PRINCIPAL / LISTAGEM ---- */}
      <main className="main-content">
        <div className="main-header">
          <div className="main-header-info">
            <h2>Reservas Ativas</h2>
            <p>Gerencie os agendamentos das salas</p>
          </div>
          {!loading && (
            <span className="badge">{reservas.length} reserva{reservas.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        <div className="reservations-area">
          {loading ? (
            <div className="reservations-grid">
              {[1, 2, 3].map(i => <div key={i} className="skeleton" />)}
            </div>
          ) : reservas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>Nenhuma reserva ativa</h3>
              <p>Use o formulário ao lado para agendar uma sala.</p>
            </div>
          ) : (
            <div className="reservations-grid">
              {reservas.map(r => (
                <div key={r.id} className="reservation-card">
                  <p className="card-title">{r.titulo}</p>
                  <span className="card-sala">🚪 {nomeSala(r.sala_id)}</span>
                  <div className="card-horarios">
                    <div className="card-horario-item">
                      <span className="horario-dot" />
                      <span>Início: {formatarData(r.inicio)}</span>
                    </div>
                    <div className="card-horario-item">
                      <span className="horario-dot" style={{ background: 'var(--accent-secondary)' }} />
                      <span>Fim: {formatarData(r.fim)}</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn-danger" onClick={() => pedirCancelamento(r.id, r.titulo)}>
                      Cancelar Reserva
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ---- MODAL DE CONFIRMAÇÃO ---- */}
      {confirm.visible && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Cancelar Reserva?</h3>
            <p>Você está prestes a cancelar a reserva <strong>"{confirm.titulo}"</strong>. Esta ação não pode ser desfeita na interface.</p>
            <div className="confirm-actions">
              <button className="btn-ghost" onClick={() => setConfirm({ visible: false, reservaId: null, titulo: '' })}>
                Voltar
              </button>
              <button className="btn-danger" onClick={confirmarCancelamento}>
                Sim, cancelar
              </button>
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
