# Vite TypeScript Imports Rule

- **Motivo:** O Vite utiliza o `esbuild`, que ignora tipagens. Importar tipos sem `type` causa o erro `does not provide an export named X`.
- **Regra:** Sempre que importar tipos/interfaces em TypeScript no Vite, utilize a sintaxe: `import type { X } from '...';`
