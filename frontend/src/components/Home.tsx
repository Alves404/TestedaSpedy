export default function Home({ onStart }: { onStart: () => void }) {
  return (
    <div className="home-layout">
      <div className="home-container">
        <div className="home-logo">
          <span>🏢</span>
        </div>
        <h1 className="home-title">CoWorking Enterprise</h1>
        <p className="home-subtitle">O melhor ambiente para as reuniões estratégicas do seu negócio. Agende uma sala e leve sua equipe para o próximo nível.</p>
        <button className="btn-primary home-btn" onClick={onStart}>
          Acessar Sistema de Agendamento
        </button>
      </div>
    </div>
  );
}
