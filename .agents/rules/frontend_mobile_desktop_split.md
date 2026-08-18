---
description: Regra para estruturação de projetos front-end envolvendo versões Mobile e Desktop e uso de banco de dados leve.
---

# Regras de Preferência de Desenvolvimento

Ao desenvolver projetos front-end e back-end (especialmente testes técnicos ou avaliações):

1. **Separação de Mobile/Desktop**: 
   - NÃO use apenas CSS Responsivo (Media Queries) com uma única árvore de componentes.
   - CRIE pastas separadas para as duas versões (ex: `src/components/desktop/` e `src/components/mobile/`).
   - Gerencie a Exibição via lógica JavaScript/React (ex: um hook de detecção de resolução).
2. **Banco de Dados Local**: 
   - Se o usuário mencionar que "SQL não está instalado no PC" ou não houver Docker, assuma o uso imediato de **SQLite**, que não necessita de instalações adicionais no sistema e roda localmente via arquivos.
