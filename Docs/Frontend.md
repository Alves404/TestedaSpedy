# Documentação do Frontend 🎨

A camada de front-end do CoWorking Enterprise foi inteiramente construída pensando em modernidade, dinamismo e organização rigorosa para pontuação máxima em SEO (separação física de versões Desktop e Mobile). A stack principal inclui **React**, **TypeScript** e **Vite**.

Abaixo, detalhamos a arquitetura de arquivos e o que cada página principal de código faz:

## Arquivos e Pastas Essenciais

### `src/App.tsx`
O ponto de partida visual da aplicação. Ele desempenha um papel de roteamento de hardware utilizando nosso hook customizado (`useResolucaoTela`). É ele quem decide qual árvore de componentes carregar (Desktop ou Mobile). Além disso, gerencia o estado da **Landing Page**, controlando se o usuário acabou de abrir o site ou se já clicou para entrar no painel de agendamentos.

### `src/components/Home.tsx`
A nossa **Landing Page Premium**. Contém todo o visual e slogan de entrada "CoWorking Enterprise". Tem animações suaves e um botão grandioso para captar a intenção do usuário antes de encaminhá-lo ao sistema pesado.

### `src/components/desktop/DesktopApp.tsx`
Interface exclusiva para usuários em navegadores Desktop (telas grandes). O código deste componente organiza a tela com uma **Sidebar Lateral Fixa** que comporta o formulário de Nova Reserva e um corpo principal de grade de Cards. Toda a manipulação de "Toasts" (aquelas notificações bonitinhas no canto da tela) ou modais complexos reside na memória deste componente.

### `src/components/mobile/MobileApp.tsx`
Interface adaptada para telas sensíveis a toque (Touch) ou com pequena largura (Smartphones e Tablets). Diferente da versão Desktop, esta página utiliza botões de ação flutuantes (FABs) e uma *Bottom Sheet* moderna que sobe no final da tela para carregar o formulário, priorizando o aproveitamento do minúsculo espaço visual para mostrar as Reservas Ativas. O componente foi inteiramente refatorado para utilizar ícones **Lucide React**, garantindo uma estética fluída e nativa, livre da poluição visual de emojis.

### `src/components/GooeyNav.tsx` & `MobileNav.tsx`
Componentes avançados de Navegação. O `GooeyNav` para Desktop oferece indicadores dinâmicos que "escorrem" acompanhando o mouse, enquanto o `MobileNav` traz navegação fixada no rodapé via ícones Lucide otimizados.

### `src/components/BorderGlowCard.tsx` & `SplitText.tsx`
Componentes de altíssima interação visual. O `BorderGlowCard` cria rastros de brilho seguindo o mouse utilizando custom properties e eventos globais, garantindo a aura premium das Salas. O `SplitText` cuida das animações e relevo das tipografias de título.

### `src/services/api.ts`
A ponte vital de comunicação com o Backend FastAPI. O arquivo encapsula todas as requisições nativas de rede (`fetch`). Possui inteligência embarcada para converter os erros bizarros que a API envia em **Alertas de Erros Claros** em português. É nele que garantimos que falhas como *"Já existe uma reserva"* sejam convertidas na mensagem legível e técnica ao usuário, evitando a quebra da tela por objetos inacessíveis como o velho `[object Object]`.

### `src/types/index.ts`
Um pequeno e vital dicionário de tipagem rigorosa para TypeScript. Ele descreve a forma geométrica de cada objeto que roda no App (o que é uma "Sala", o que é uma "Reserva", como construir uma "ReservaCriar"). Com esse arquivo, evitamos que o React exiba undefined properties em produção.

### `src/index.css` & `Home.css`
O grande pilar estético. Abandonamos as restrições brutas do Tailwind para construir do zero toda a cascata e tokens da identidade visual do *CoWorking Enterprise* no puro CSS. Contém os gradientes *glassmorphism*, variáveis de cor (`--bg-primary`, `--accent-primary`), regras globais de Reset, animações de elevação/hover em botões, skeletons de loading interativos e a separação clara em blocos como `/* --- Layout Desktop --- */` e `/* --- Layout Mobile --- */`, além de Media Queries inteligentes que ajustam os componentes como o `app-wrapper` para fluírem suavemente da versão Desktop para a Tela Cheia Mobile.
