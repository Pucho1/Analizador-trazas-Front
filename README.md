# Observa — frontend

Web de Observa: muestra las trazas y los agregados que calcula el backend. Stack: React, Vite, TypeScript.

## Requisitos

- Node.js 22+ y npm
- [uv](https://docs.astral.sh/uv/) para ejecutar pre-commit (`uvx`)
- El backend de Observa en marcha (su OpenAPI es el contrato de la API)

## Puesta en marcha

```bash
cp .env.example .env      # URL del backend (nunca secretos)
npm install
npm run dev
```

## Calidad

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
```

Hooks de pre-commit:

```bash
uvx pre-commit install
uvx pre-commit run --all-files
```
