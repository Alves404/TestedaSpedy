# Documentação do Frontend 🎨

A camada de front-end do CoWorking Enterprise foi inteiramente construída pensando em modernidade, dinamismo e organização rigorosa para pontuação máxima em SEO (separação física de versões Desktop e Mobile). A stack principal inclui **React**, **TypeScript** e **Vite**.

Abaixo, detalhamos a arquitetura de arquivos e o que cada página principal de código faz:

## Arquivos e Pastas Essenciais

### `src/App.tsx`
O ponto de partida visual da aplicação. Ele desempenha um papel de roteamento responsivo utilizando nosso hook customizado (`useResolucaoTela`). É ele quem decide qual árvore de componentes carregar (Desktop ou Mobile). Além disso, gerencia o estado da **Landing Page**, controlando se o usuário acabou de abrir o site ou se já clicou para entrar no painel de agendamentos.

### `src/components/Home.tsx`
A nossa **Landing Page Premium**. Contém todo o visual e slogan de entrada "CoWorking Enterprise". Integra diversos componentes visuais complexos (como o `Topography` e o `HeroPortal`) para criar animações suaves e imersivas, além de um botão grandioso para captar a intenção do usuário antes de encaminhá-lo ao sistema principal.

### `src/components/desktop/DesktopApp.tsx`
Interface exclusiva para usuários em navegadores Desktop (telas grandes). O código deste componente organiza a tela com uma **Sidebar Lateral Fixa** que comporta o formulário de Nova Reserva e um corpo principal de grade de Cards. Toda a manipulação de "Toasts" (notificações) e modais complexos reside na memória deste componente.

### `src/components/mobile/MobileApp.tsx`
Interface adaptada para telas sensíveis a toque (Touch) ou com pequena largura (Smartphones e Tablets). Diferente da versão Desktop, esta página utiliza botões de ação flutuantes (FABs) e uma *Bottom Sheet* moderna que sobe no final da tela para carregar o formulário, priorizando o aproveitamento do minúsculo espaço visual para mostrar as Reservas Ativas. Utiliza ícones **Lucide React**, garantindo uma estética fluída e nativa.

## Componentes de Alta Interatividade Visual (UI/UX Premium)

Nossa aplicação destaca-se pela experiência do usuário (UX) através de micro-interações e efeitos visuais imersivos:

- **`FadeIn.tsx`**: Responsável por animações suaves de surgimento de elementos durante o scroll (utilizando `IntersectionObserver`).
- **`GradualBlur.tsx`**: Cria efeitos de desfoque progressivo (*glassmorphism* avançado), ideal para transições suaves de background.
- **`HeroPortal.tsx`**: Section hero com portal/animações 3D que conferem uma sensação imersiva na Landing Page.
- **`ScrollExpand.tsx`**: Permite a expansão dinâmica e interativa de elementos baseada na rolagem (scroll) do usuário.
- **`SpotlightCard.tsx`**: Um Card reativo que detecta a posição do cursor do mouse e cria um efeito de "holofote" (brilho direcional) acompanhando o movimento.
- **`BorderGlowCard.tsx`**: Cria rastros de brilho nas bordas seguindo o mouse utilizando *custom properties* e eventos globais, garantindo a aura premium.
- **`SplitText.tsx`**: Cuida das animações assíncronas e relevo das tipografias, quebrando textos por caracteres/palavras para revelar títulos de forma majestosa.
- **`Topography.tsx`**: Gera um background com padrão topográfico dinâmico e animado, dando profundidade ao fundo da tela.
- **`GooeyNav.tsx` & `MobileNav.tsx`**: Navegação avançada. O `GooeyNav` para Desktop oferece indicadores que "escorrem" acompanhando o mouse, enquanto o `MobileNav` traz navegação fixada no rodapé via ícones otimizados.

## Integração e Tipagem

### `src/services/api.ts`
A ponte vital de comunicação com o Backend FastAPI. O arquivo encapsula todas as requisições de rede (`fetch`). Possui inteligência embarcada para converter erros da API em **Alertas de Erros Claros** em português. É nele que garantimos que falhas como *"Já existe uma reserva"* sejam convertidas em mensagens legíveis e amigáveis ao usuário.

### `src/types/index.ts`
Dicionário de tipagem rigorosa para TypeScript. Descreve a forma de cada objeto que roda no App (`Sala`, `Reserva`, `ReservaCriar`). Evita que o React exiba *undefined properties* em produção.

### `src/index.css` & `Home.css`
O pilar estético principal. Toda a cascata e tokens da identidade visual do *CoWorking Enterprise* foram construídos em puro CSS. Contém gradientes, variáveis de cor (`--bg-primary`, `--accent-primary`), *glassmorphism*, animações de *hover* em botões, skeletons de loading interativos e a separação clara em blocos entre o layout Desktop e Mobile por meio de Media Queries inteligentes.
