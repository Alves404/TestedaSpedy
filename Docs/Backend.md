# Documentação do Backend ⚙️

Esta pasta de backend utiliza **Python** com **FastAPI** para prover uma API robusta e de alta performance. Além disso, utilizamos **SQLAlchemy** (como ORM) e o banco de dados leve **SQLite**.

Para manter o código simples, legível e direto ao ponto, consolidamos toda a lógica em apenas 2 arquivos. Abaixo detalhamos o que cada página de código faz:

## 1. `database.py`
Este arquivo é o coração da nossa modelagem de dados.
Ele agrupa:
- **A Conexão com o Banco**: Define a string de conexão (`sqlite:///./coworking.db`) e inicializa a engine do SQLAlchemy (`SessionLocal`, `Base`).
- **Os Modelos de Dados (Tabelas)**: Aqui estão mapeadas as estruturas exatas do nosso banco de dados.
  - Classe `Sala`: Representa a tabela `salas`, contendo `id` e `nome`.
  - Classe `Reserva`: Representa a tabela `reservas`, guardando referências para a `Sala`, além dos horários (`inicio`, `fim`), do `titulo` da reserva e um registro de cancelamento (`cancelado_em`) que suporta nosso recurso de **Soft Delete**.

## 2. `main.py`
Este arquivo consolida todo o comportamento da API em si. Se o `database.py` molda os dados, o `main.py` controla o tráfego e dita as regras.
Ele engloba:
- **Iniciação da Aplicação**: Configura o objeto `app = FastAPI(...)` e ativa as proteções de CORS (necessárias para o frontend React se conectar livremente).
- **Esquemas de Validação (Pydantic)**: São as estruturas (`ReservaCriar`, `ReservaResposta`, `SalaResposta`) que validam matematicamente se o que o Frontend mandou está no formato correto (ex: validando se o horário de término da reunião é sempre *depois* do horário de início).
- **Rotas de Acesso (Endpoints)**: O núcleo de comunicação com o navegador.
  - `GET /api/salas`: Lista as salas de reunião disponíveis.
  - `GET /api/reservas`: Lista todas as reservas que **ainda estão ativas** (ignora as canceladas por Soft Delete).
  - `POST /api/reservas`: Rota sensível. Antes de salvar no banco, cruza os horários de início e fim solicitados com todas as outras reservas daquela mesma sala. Se houver sobreposição matemática de horas, recusa a requisição protegendo o negócio.
  - `DELETE /api/reservas/{id}`: Realiza o cancelamento marcando a coluna `cancelado_em` com o momento exato do cancelamento, mantendo o histórico intacto.
- **Evento de Startup (Seeding)**: Garante que toda vez que a aplicação rodar do zero, as 3 salas de reunião principais ("Sala Steve Jobs", "Sala Bill Gates", "Sala Ada Lovelace") existam no banco automaticamente para não iniciar o app vazio.
