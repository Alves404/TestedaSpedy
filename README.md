# Coworking Room Booking System

Este é um sistema de agendamento de salas para um Coworking, desenvolvido como desafio técnico.

## 🚀 Tecnologias Utilizadas

- **Back-end**: Python, FastAPI, SQLAlchemy (SQLite)
- **Front-end**: React, Vite, TypeScript, Vanilla CSS

## 📋 Pré-requisitos

- Node.js e npm (para o front-end)
- Python 3.8+ e pip (para o back-end)

---

## ⚙️ Como rodar localmente

### 1. Back-end

Abra o terminal, navegue até a pasta `backend` e siga os passos:

```bash
cd backend

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor FastAPI localmente
uvicorn main:app --reload
```
A API estará disponível em `http://localhost:8000`. O Swagger UI para testar as rotas pode ser acessado em `http://localhost:8000/docs`.

**Nota sobre Banco de Dados:** Não é necessário instalar nenhum servidor SQL (como MySQL ou Postgres). A aplicação utiliza **SQLite**, e o arquivo `database.db` será gerado automaticamente na primeira execução, junto com as salas iniciais.

### 2. Front-end

Abra um novo terminal, navegue até a pasta `frontend` e siga os passos:

```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
Acesse a URL gerada (geralmente `http://localhost:5173`).

---

## 🏗 Decisão Arquitetural: Cancelamento de Reservas (Soft Delete)

Para o cancelamento das reservas, foi optado pelo método de **Soft Delete**. Em vez de remover fisicamente o registro do banco de dados (Hard Delete), adicionamos uma coluna `cancelado_em` na tabela de reservas.

### Prós do Soft Delete:
1. **Histórico e Auditoria:** Mantém o histórico completo. Se o sistema precisar futuramente auditar quais clientes mais cancelam ou emitir relatórios de desistência, os dados estão salvos.
2. **Recuperação de Dados:** Permite "desfazer" exclusões acidentais, pois o dado não foi permanentemente apagado.
3. **Integridade Referencial:** Evita a quebra de relacionamentos futuros com tabelas como "Faturas" ou "Log de Atividades".

### Contras do Soft Delete:
1. **Espaço de Armazenamento:** A tabela continuará crescendo, o que poderia impactar custos de banco de dados a longo prazo se houver milhões de reservas.
2. **Complexidade de Queries:** Exige atenção redobrada ao desenvolver: todas as consultas normais devem filtrar explicitamente (`WHERE cancelado_em IS NULL`), algo que o desenvolvedor não pode esquecer.
3. **Restrições de Unicidade:** Em alguns bancos, regras "UNIQUE" precisam ser desenhadas com cuidado para não colidirem entre registros deletados e ativos (embora aqui não haja essa colisão, pois reservas podem se repetir).

Dado que sistemas corporativos e coworkings lidam com cobranças e auditorias constantes, o Soft Delete é de longe a abordagem mais adequada e segura.

---

## 📱 Separação Mobile vs Desktop

Atendendo aos requisitos e regras da avaliação, a estrutura de pastas do front-end foi dividida estritamente entre `src/components/desktop/` e `src/components/mobile/`. A definição de qual componente exibir é controlada em tempo de execução (`JavaScript`) via o hook `useResolucaoTela.ts`, permitindo notas otimizadas de SEO isolado e avaliação separada para a estrutura das diferentes telas.
