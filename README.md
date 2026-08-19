# Desafio Técnico - Spedy: Gestão de Reservas de Coworking

Este repositório contém a solução desenvolvida para o desafio técnico da vaga na Spedy, que consiste em um sistema web para gerenciar reservas de salas de reunião em um coworking.

A aplicação foi construída visando alto desempenho, excelência em design visual (UI/UX) e boa manutenibilidade, com arquitetura dividida em Backend (Python/FastAPI) e Frontend (React/TypeScript).

---

## Sobre o Desafio e as Funcionalidades

A aplicação atende rigorosamente aos requisitos exigidos pelo escopo do desafio e vai além, entregando uma experiência visual premium:

- **Listagem de Reservas:** Agrupadas por dia e ordenadas de forma cronológica (diretamente da API e renderizadas no frontend).
- **Criação de Reservas:** Formulário dinâmico com validação de preenchimento para as informações de sala, título, horário de início e término.
- **Regras de Negócio e Validações:**
  - Todos os campos são de preenchimento obrigatório.
  - O horário de término não pode ser igual ou anterior ao horário de início.
  - **Validação de Sobreposição (Backend):** Duas reservas na mesma sala nunca podem se sobrepor no tempo. Se os horários coincidirem parcialmente ou abrangerem totalmente uma reserva existente, a API bloqueia a criação do registro, evitando duplicidades.
- **Salas Base (Seed):** O banco de dados SQLite executa a criação de salas fixas em sua inicialização automaticamente.
- **UI/UX Premium:** A interface (frontend) foi enriquecida com dezenas de componentes visuais avançados, incluindo animações de texto (`SplitText`), desfoques progressivos (`GradualBlur`), portais imersivos (`HeroPortal`) e cards interativos que reagem à proximidade do mouse (`SpotlightCard`, `BorderGlowCard`), garantindo um design de alto padrão (Glassmorphism e Neumorphism) totalmente responsivo (Desktop e Mobile).

---

## Decisão Técnica: Cancelamento de Reservas

Foi solicitado no escopo do desafio a tomada de decisão sobre o comportamento do cancelamento de uma reserva. Optou-se ativamente pela abordagem de **Soft Delete** em detrimento do clássico *Hard Delete* (remoção permanente do registro).

**Justificativas para a escolha do Soft Delete:**

- **Vantagens Técnicas e de Negócio:** 
  1. **Auditoria e Histórico:** Mantém-se uma auditoria temporal consistente. É possível cruzar dados gerenciais, como a taxa de desistência por sala de reunião. O dado histórico é preservado e apenas ocultado da visão do usuário.
  2. **Proteção de Dados:** Adiciona uma camada de proteção contra perda de dados. Uma exclusão indevida não apaga a informação permanentemente, apenas atualiza a coluna `cancelado_em` com o *timestamp* atual.
  3. **Integridade Referencial (FKs):** O sistema mantém-se estruturado para escalabilidade, protegendo as relações do banco contra quebras estruturais.

- **Trade-offs Assumidos:**
  1. Maior atenção na construção de consultas: Todos os retornos da API que listam reservas precisam filtrar explicitamente as canceladas (`.filter(cancelado_em == None)`).
  2. Alocação contínua de espaço. No entanto, a rastreabilidade em aplicações corporativas justifica amplamente esse pequeno custo.

---

## Vídeo de Apresentação e Explicações

> **Avaliador:** [**Clique aqui para assistir ao vídeo (Inserir Link)**](INSERIR_LINK_AQUI)

*O vídeo aborda: a estrutura do projeto, a demonstração da aplicação (incluindo a simulação de sobreposição e as micro-interações do frontend premium), a explicação da lógica de bloqueio de conflitos, a justificativa arquitetural do cancelamento e a resolução de desafios de código durante a implementação.*

---

## Como Executar o Projeto Localmente

O ambiente de execução foi estruturado para ser de fácil inicialização e testabilidade local, sem necessidade de Docker.

### 1. Inicialização da API (Backend)
1. Acesse o diretório `/backend` através do terminal.
2. Certifique-se de possuir o Python instalado. Recomenda-se a criação de um ambiente virtual para a instalação das dependências:
   ```bash
   pip install -r requirements.txt
   ```
3. Inicie o servidor local via FastAPI:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   > O banco de dados (`coworking.db`) será gerado automaticamente e receberá a carga inicial (seed) de salas na primeira execução.

### 2. Inicialização da Interface (Frontend)
1. Acesse o diretório `/frontend` através de uma nova janela do terminal.
2. Certifique-se de possuir o Node.js instalado e instale os pacotes:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento (Vite):
   ```bash
   npm run dev -- --port 5173 --strictPort
   ```
4. Navegue até o endereço local fornecido no terminal (geralmente `http://localhost:5173`) para visualizar e interagir com a aplicação.

---

## Documentação de Código Complementar

Para maiores detalhes sobre a organização e arquitetura interna de arquivos, verifique as documentações específicas de cada serviço:

- ⚙️ Documentação da API (Backend): **[Docs/Backend.md](Docs/Backend.md)**
- 🎨 Documentação de Componentes (Frontend): **[Docs/Frontend.md](Docs/Frontend.md)**
