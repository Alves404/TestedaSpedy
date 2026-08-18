# Documentação do Backend ⚙️

Esta pasta de backend utiliza **Python** com **FastAPI** para prover uma API robusta e de alta performance. Além disso, utilizamos **SQLAlchemy** (como ORM) e o banco de dados leve **SQLite**.

Para manter o código simples, legível e direto ao ponto, dividimos a lógica em 3 arquivos principais seguindo o padrão MVC. Abaixo detalhamos o que cada página de código faz:

## 1. `database.py`
Este arquivo é o coração da nossa modelagem de dados.
Ele agrupa:
- **A Conexão com o Banco**: Define a string de conexão (`sqlite:///./coworking.db`) e inicializa a engine do SQLAlchemy (`SessionLocal`, `Base`).
- **Os Modelos de Dados (Tabelas)**: Aqui estão mapeadas as estruturas exatas do nosso banco de dados.
  - Classe `Sala`: Representa a tabela `salas`, contendo `id` e `nome`.
  - Classe `Reserva`: Representa a tabela `reservas`, guardando referências para a `Sala`, além dos horários (`inicio`, `fim`), do `titulo` da reserva e um registro de cancelamento (`cancelado_em`) que suporta nosso recurso de **Soft Delete**.

## 2. `crud.py`
Este arquivo abstrai a **lógica direta de organização no banco de dados**. Separar a lógica das rotas deixa o código muito mais testável e limpo.
- Contém as funções (`get_salas`, `get_reservas_ativas`, `criar_reserva_db`, `cancelar_reserva_db`) que fazem as consultas complexas com o SQLAlchemy.
- É aqui que a checagem matemática de colisão de horários ocorre, protegendo as inserções simultâneas.

## 3. `main.py`
Este arquivo consolida o roteamento e a iniciação da API (Controlador).
Ele engloba:
- **Iniciação da Aplicação**: Configura o objeto `app = FastAPI(...)` e ativa as proteções de CORS (necessárias para o frontend React se conectar livremente).
- **Esquemas de Validação (Pydantic)**: São as estruturas (`ReservaCriar`, `ReservaResposta`, `SalaResposta`) que validam matematicamente se o que o Frontend mandou está no formato correto (ex: validando se o horário de término da reunião é sempre *depois* do horário de início).
- **Rotas de Acesso (Endpoints)**: O núcleo de comunicação com o navegador.
  - `GET /api/salas`: Lista as salas de reunião disponíveis.
  - `GET /api/reservas`: Lista todas as reservas que **ainda estão ativas** (ignora as canceladas por Soft Delete).
  - `POST /api/reservas`: Recebe o payload do frontend e delega para o `crud.py` realizar as checagens e salvação.
  - `DELETE /api/reservas/{id}`: Aciona o Soft Delete contido na lógica do banco.
- **Evento de Startup (Seeding)**: Garante que toda vez que a aplicação rodar do zero, as 3 salas de reunião principais ("Sala Steve Jobs", "Sala Bill Gates", "Sala Ada Lovelace") existam no banco automaticamente para não iniciar o app vazio.
