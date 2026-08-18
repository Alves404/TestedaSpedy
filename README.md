# CoWorking Enterprise 🏢

O CoWorking Enterprise é um sistema de agendamento de salas de reunião de alto desempenho construído com uma arquitetura dividida em Backend (Python/FastAPI) e Frontend (React/TypeScript).

O projeto é capaz de verificar colisões de horário automaticamente e possui uma interface "Premium" com modo escuro que se adapta completamente à resolução do usuário (separação explícita de componentes para Desktop e Mobile).

---

## 🛠️ Arquitetura e Decisão Técnica (Cancelamento de Reservas)

Ao desenvolver a funcionalidade de "Cancelamento de Reserva", optamos ativamente pela abordagem de **Soft Delete** em vez do clássico *Hard Delete* (onde a linha desaparece totalmente do banco com `DELETE FROM`).

**Justificativa Técnica (Soft Delete):**
- **Prós:** 
  1. Mantém uma auditoria temporal perfeita. Podemos saber *quantas* reservas foram canceladas no final de um mês para cruzar relatórios gerenciais e de marketing (ex: qual sala as pessoas mais desistem de usar).
  2. Proteção extrema contra perda de dados. Nenhuma exclusão acidental apagará de fato o dado histórico, ele apenas some da visualização do usuário.
  3. Integridade referencial. Podemos ter tabelas futuras de faturamento conectadas àquela reserva cancelada sem corromper as FKs (Foreign Keys).
- **Contras:**
  1. Aumenta ligeiramente a complexidade das consultas. Todos os `SELECT`s (ou consultas do SQLAlchemy) no backend devem incluir ativamente um filtro constante de `.filter(cancelado_em == None)`.
  2. Uso microscópico contínuo de disco para armazenar linhas que "não deveriam estar lá", algo irrelevante para um SQLite em estágio de MVP, mas que precisa ser arquivado e gerido em bancos Enterprise maiores.

---

## 🚀 Como Executar o Projeto Localmente

O aplicativo foi feito de maneira simplificada, sendo *apenas rodável de forma local* (nada de Docker, ou containers na Nuvem, tudo acontece na sua máquina em segundos).

### 1. Iniciar a API (Backend)
1. Abra um terminal e vá para a pasta `/backend`.
2. (Opcional) Instale as dependências com `pip install -r requirements.txt`.
3. Inicie o servidor FastAPI:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   > O Banco de dados (`coworking.db`) será criado sozinho, populado com 3 Salas Padrão automaticamente.

### 2. Iniciar a Interface (Frontend)
1. Abra um novo terminal e vá para a pasta `/frontend`.
2. (Opcional) Instale os pacotes com `npm install`.
3. Inicie o servidor em modo de desenvolvimento (Vite):
   ```bash
   npm run dev -- --port 5173 --strictPort
   ```
4. Navegue até http://localhost:5173 para acessar o sistema.

---

## 📖 Documentação do Código (Docs)

Caso precise se aprofundar em como o sistema funciona ou queira escalar a aplicação, preparamos duas documentações detalhadas que explicam linha a linha o que cada arquivo das nossas pastas faz:
- Acesse 👉 **[Docs/Backend.md](Docs/Backend.md)**
- Acesse 👉 **[Docs/Frontend.md](Docs/Frontend.md)**
