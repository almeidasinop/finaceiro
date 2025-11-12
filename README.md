# Financeiro

Aplicação web de finanças pessoais construída com React, Vite e Tailwind CSS.

## Requisitos
- Node.js 18+
- npm 9+

## Instalação
```bash
npm install
```

## Desenvolvimento
```bash
# Porta fixa 5174
npm run dev
```
Abra `http://localhost:5174/`.

### Navegação e Sidebar
- A navegação do header foi migrada para uma Sidebar (padrões shadcn/ui + Radix).
- No desktop, a sidebar fica fixa à esquerda; no mobile, abre como menu deslizante com overlay.
- Itens ativos são destacados e a hierarquia original foi preservada (Dashboard, Transações, Contas, Assinaturas).
- Acessibilidade: roles ARIA, foco gerenciado no modal móvel e navegação por teclado.

### Sistema de Tema, Botões e Acessibilidade
- Tema claro/escuro com persistência: a preferência é salva em `localStorage` e aplicada cedo via script inline no `index.html` para evitar FOUC. Toggle disponível no cabeçalho da sidebar.
- Tokens de tema por variáveis CSS (`src/index.css`):
  - Cores: `--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--accent`, `--accent-hover`, `--on-accent`, `--brand`.
  - Botões: `--btn-*` para estados normal/hover/active e variantes `--danger`, `--on-danger`. Classes globais: `.btn`, `.btn-muted`, `.btn-danger` em `@layer components`.
- Contraste WCAG 2.1 AA: paleta ajustada para manter ratio adequado em claro/escuro (p. ex. `--accent` no dark usa `sky-500` com `--on-accent` escuro para legibilidade).
- Transições suaves: `color`, `background-color` e `border-color` com respeito ao `prefers-reduced-motion`.
- Acessibilidade:
  - Estados de foco visíveis (`--focus-ring`); botões exibem `box-shadow` ao foco.
  - `aria-live` no banner de status de rede e loader inicial.
  - Error Boundary captura falhas e disponibiliza ação de recarregar.

### Acesso pela rede local (LAN)
- O servidor agora expõe endereço de rede: rode `npm run dev` e acesse `http://SEU_IP:5174/` (ex.: `http://192.168.0.82:5174/`).
- Caso não abra em outro dispositivo:
  - Verifique o IP do seu PC: `ipconfig` (Windows) e use o IPv4 da rede.
  - Confirme que ambos os dispositivos estão na mesma rede (mesmo SSID/segmento).
  - Permita o Node/Vite no Firewall do Windows quando for solicitado (Rede Privada).
  - Se necessário, abra manualmente a exceção inbound para a porta `5174` (TCP) na Rede Privada.
  - Evite VPNs ou firewalls corporativos que bloqueiem conexões locais.

## Build e Preview (Produção)
```bash
npm run start:prod
# ou
npm run build && npm run preview -- --strictPort --port 4173
```
Abra `http://localhost:4173/`.

### Preview acessível pela rede local
- O preview também expõe endereço de rede com `--host`: acesse `http://SEU_IP:4173/` na LAN.

### Correções de UI e Rede
- Botões no tema escuro: legibilidade mantida em `hover` e `active`, com texto usando `--btn-hover-text` e `--btn-active-text`. Variantes de perigo usam `--on-danger` escuro para contraste em fundo vermelho.
- Loader inicial e melhoria de acesso via LAN: overlay inline `#app-loader` adicionado no `index.html` com spinner e texto; removido após a montagem em `src/main.jsx`. Evita tela preta em conexões mais lentas ou restrições de CSP.
- Banner de status de rede: `src/components/ui/NetworkStatusBanner.jsx` exibe aviso quando offline.

### Páginas atualizadas
- `Dashboard.jsx`: botões `+ Receita` (`.btn`) e `+ Despesa` (`.btn-danger`), cartões com tokens de tema.
- `Transactions.jsx`: inputs, selects e tabela usam `--surface`, `--text`, `--border`, botão `Salvar` com `.btn`.
- `Accounts.jsx` e `Subscriptions.jsx`: superfícies e textos com tokens; botões com `.btn`, `.btn-muted`, `.btn-danger`.

### Testes
- Unit: `src/__tests__/theme.test.js` valida inicialização (`initTheme`), alternância (`toggleTheme`) e persistência.
- E2E/Manual: validar em Chrome, Firefox e Safari/Edge, testando tema, botões (hover/active), loader inicial e banner offline.

### Preview acessível pela rede local
- O preview também expõe endereço de rede com `--host`: acesse `http://SEU_IP:4173/` na LAN.

## Compatibilidade com Navegadores Antigos
- Habilitamos `@vitejs/plugin-legacy` no build de produção para suportar navegadores sem `type="module"`.
- Isso cria bundles adicionais com sufixo `-legacy` e injeta polyfills quando necessário.
- Caso a aplicação apareça “em branco” em um dispositivo da rede, use o preview de produção (`npm run start:prod`) e acesse `http://SEU_IP:4173/`.
- Se persistir, provavelmente o navegador é muito antigo ou uma WebView corporativa restritiva; o build legacy melhora a compatibilidade.

## Variáveis de Ambiente
Crie um arquivo `.env.local` (não será versionado). Baseie-se em `.env.example`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```
As variáveis são consumidas em `src/lib/firebase.js`.

## Segurança
- CSP dinâmica por ambiente via plugin do Vite:
  - Dev: permite HMR (`ws:`) e `'unsafe-eval'` estritamente para o runtime do Vite.
  - Prod: remove `'unsafe-eval'` e `ws:`; `default-src 'self'` e conexões apenas para Firebase.
- `.gitignore` evita versionar `node_modules`, builds, logs e secrets (`.env*`).
- `Referrer-Policy: no-referrer`, `frame-ancestors 'none'`, `form-action 'self'` e `upgrade-insecure-requests` aplicados.

### 🔒 Proteção de Credenciais Firebase (Medidas Avançadas)
Implementamos um sistema completo de segurança para proteger credenciais sensíveis, especialmente arquivos de conta de serviço Firebase:

#### **Prevenção de Commits Acidentais**
- **Arquivos de Conta de Serviço Firebase**: Padrões específicos bloqueiam arquivos `*firebase-adminsdk*.json` e `*service-account*.json`
- **Chaves Privadas**: Bloqueia arquivos `*.pem`, `*.key`, `*.p12`, `*.pfx`
- **Verificação Automática**: Script `scripts/security-check.cjs` valida todo código antes de commits
- **Hooks Pré-commit**: Configurados para Windows via `scripts/pre-commit.bat`

#### **Validação de Segurança Automática**
Execute os testes de segurança a qualquer momento:
```bash
node src/tests/security-validation.cjs
```

Os testes verificam:
- ✅ Detecção de chaves privadas no código
- ✅ Detecção de chaves de API Firebase (padrão `AIzaSy`)
- ✅ Bloqueio de emails de conta de serviço
- ✅ Validação de padrões sensíveis no .gitignore
- ✅ Existência de .env.example com template seguro
- ✅ Funcionamento dos hooks pré-commit

#### **Configuração para Novos Desenvolvedores**
1. **Instalar hooks de segurança** (Windows):
   ```bash
   setup-hooks.bat
   ```

2. **Configurar variáveis de ambiente**:
   - Copie `.env.example` para `.env.local`
   - Preencha com suas credenciais Firebase (sem espaços ou aspas)
   - **Nunca commite o arquivo `.env.local`**

3. **Verificar segurança antes de commits**:
   ```bash
   git add .
   git commit -m "sua mensagem"
   # O hook pré-commit executará validações automaticamente
   ```

#### **Sistema de Fallback para Permissões Firebase**
- Quando o Firestore rejeitar por permissões insuficientes, o sistema automaticamente:
  - Salva dados no `localStorage` do navegador
  - Exibe notificação amigável ao usuário
  - Sincroniza dados quando as permissões forem restauradas
- **Arquivo de configuração**: `src/utils/firebaseFallback.js`

#### **Documentação de Segurança Detalhada**
Para informações completas sobre configuração Firebase e segurança, consulte:
- `FIREBASE_SETUP.md` - Guia completo de configuração
- `scripts/security-check.cjs` - Código fonte do validador
- `src/tests/security-validation.cjs` - Suite de testes

#### **Práticas Recomendadas para a Equipe**
1. **Sempre** execute `setup-hooks.bat` após clonar o repositório
2. **Nunca** commite arquivos com padrões: `*firebase-adminsdk*.json`, `*.pem`, `*.key`
3. **Sempre** use `.env.local` para credenciais (nunca `.env` ou `.env.production`)
4. **Verifique** se seu código passa nos testes de segurança antes de fazer push
5. **Reporte** imediatamente se encontrar credenciais expostas no histórico de commits

#### **Resolução de Problemas de Segurança**
Se encontrar erros de "permissão negada" no Firebase:
1. Verifique as regras de segurança do Firestore
2. Confirme que está usando a chave correta (Web API Key, não Service Account)
3. O sistema automaticamente ativa o fallback para localStorage
4. Consulte `FIREBASE_SETUP.md` para configuração detalhada das regras

## Performance
- Divisão de bundle com `manualChunks` (React, Router, Recharts, Firebase) para melhorar carregamento inicial.

## Scripts
- `dev`: inicia Vite na porta `5174`.
- `dev:lan`: inicia Vite fixo na porta `5174` expondo explicitamente em `0.0.0.0`.
- `build`: gera artefatos em `dist/`.
- `preview`: serve `dist/`.
- `start:prod`: build + preview com porta `4173`.
- `test`: executa a suíte de testes com Vitest.

## Primeiro Commit
1. Verifique que `npm run dev` abre em `http://localhost:5174/`.
2. Execute `npm run start:prod` e abra `http://localhost:4173/`.
3. Confirme que `.env` não está versionado (apenas `.env.example`).
4. Faça o commit inicial:
   - Mensagem sugerida: `chore: setup vite + tailwind, csp dinâmica e docs`

## Licença
Sem licença definida. Ajuste conforme necessidade.
