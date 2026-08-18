# Node Zombie Processes on Windows Rule

- **Motivo:** Ao reiniciar servidores do Vite no Windows, processos antigos travam a porta 5173.
- **Regra:** Antes de reiniciar `npm run dev`, assegure-se de matar os processos Node zumbis rodando `Stop-Process -Name node -Force -ErrorAction SilentlyContinue` no PowerShell.
