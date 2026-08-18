# API Error Handling Frontend Rule

- **Motivo:** O FastAPI retorna exceções 400 sob a chave `detail`. Usar `throw new Error(err.detail)` diretamente pode cuspir `[object Object]` no frontend se o erro for um array do Pydantic.
- **Regra:** Sempre faça parse de `err.detail` (tratando strings, arrays e objetos) antes de exibir o erro ao usuário.
