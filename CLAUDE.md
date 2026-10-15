# Observa — frontend

Repo git independiente con la web de Observa. Las reglas comunes del proyecto (forma de trabajar, alcance del MVP, principios de diseño) están en el `CLAUDE.md` de la carpeta de trabajo superior.

## Reglas del repo

- Este repo no importa, lee ni referencia por ruta archivos del backend. Solo se comunica con él por HTTP.
- Los tipos de la API se generan desde la URL del OpenAPI del backend (`<backend>/openapi.json`) con openapi-typescript u Orval; no se escriben a mano.
- No calcula números (totales, medias): solo muestra y formatea lo que devuelve el backend.

## Stack

React, Vite, TypeScript (strict), TanStack Query (caché, reintentos, estados), Axios (peticiones HTTP), Zustand (solo estado de interfaz), Tailwind CSS con shadcn/ui, Vitest, ESLint, Prettier, TypeDoc.

## Estructura

```
frontend/src/
├── app/                 # providers (QueryClient) y montaje
├── config/              # env.ts (validado), constants.ts
├── api/
│   ├── http-client.ts   # instancia única de Axios
│   └── generated/       # tipos generados desde el OpenAPI del backend
├── features/
│   └── traces/
│       ├── services/    # getTraces, getSummary (Axios)
│       ├── hooks/       # useTraces, useTraceSummary (TanStack Query)
│       ├── store/       # filtros de interfaz (Zustand)
│       └── components/  # tabla, tarjetas, selector de rango
├── shared/
│   ├── components/      # estados de carga, vacío y error
│   └── utils/           # formateo de coste, latencia, tokens
└── test/                # configuración de Vitest
```

- Organización por funcionalidades.
- `services`, `hooks` y `store` no dependen de nada visual (se reutilizarán en React Native).

## Seguridad y configuración

- `.env` solo contiene configuración NO secreta (URL del backend). Las variables `VITE_*` acaban en el código del navegador: nunca poner secretos ahí.
- Constantes centralizadas en `src/config/constants.ts`.

## Calidad

- `npm run lint`, `npm run format:check`, `npm run typecheck` y `npm test` en verde.
- pre-commit propio del repo (`uvx pre-commit install`) con ESLint y Prettier.
- Tests de componentes y hooks con Vitest.
