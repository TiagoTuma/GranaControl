# GranaControl

Protótipo de fintech SaaS de Crédito Consignado Privado (React + Vite + Tailwind).

## Rodar localmente

Pré-requisito: Node.js 18+ instalado.

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Subir no GitHub

```bash
git init
git add .
git commit -m "GranaControl: protótipo inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/granacontrol.git
git push -u origin main
```

## Publicar (deploy)

### Opção A — Vercel (mais fácil, recomendado)
1. Acesse vercel.com e conecte sua conta do GitHub.
2. "Add New Project" → selecione o repositório `granacontrol`.
3. Framework: **Vite** (detectado automaticamente). Clique em **Deploy**.
4. Cada `git push` gera um novo deploy automático.

> Deixe `base: "/"` no `vite.config.js` para Vercel/Netlify.

### Opção B — GitHub Pages
1. No `vite.config.js`, troque `base: "/"` por `base: "/granacontrol/"` (o nome do repositório).
2. Gere o build e publique:
```bash
npm run build
npm install -D gh-pages
npx gh-pages -d dist
```
3. No GitHub: Settings → Pages → Branch `gh-pages`.
4. URL final: `https://SEU-USUARIO.github.io/granacontrol/`

## Estrutura

```
index.html            # ponto de entrada
src/main.jsx          # monta o app
src/GranaControl.jsx  # o app inteiro (landing, plataforma, portais por CNPJ, mobile)
src/index.css         # Tailwind
```
