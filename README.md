# muckChallengePokedex

Pokédex en React Native: lista los Pokémon de [PokéAPI](https://pokeapi.co), abre una ficha de detalle y funciona de forma parcial sin red una vez cacheada.

## Arquitectura

Clean Architecture justificada por motivos de cambio distintos:

- `src/domain` — entidades y puertos (`PokemonRepository`, `HttpClient`, `CacheStore`, `AppError`). Sin React ni fetch.
- `src/application` — casos de uso (`ListPokemon`, `GetPokemon`). Reciben el repositorio por constructor.
- `src/infrastructure` — adapters: HTTP, caché persistente y mapeo de PokéAPI.
- `src/presentation` — UI, hooks y pantallas. Sin URLs de API.
- `src/di` — composition root. Instancia concreta; los hooks piden casos de uso por context, no importan el container.
- `src/navigation` — stack propio y señal de recarga.

```
presentation / navigation  →  application  →  domain
         ↑                         ↑
         └── di (composition) ─────┘
                   ↓
            infrastructure
```

`App.tsx` arma providers (casos de uso, navegación, ErrorBoundary) y deja el navigator montar pantallas.

## Caché (dos capas a propósito)

1. **HTTP de sesión** (`CachingHttpClient`): el listado ya pidió `/pokemon/{id}` y la ficha lo vuelve a necesitar; varias fichas comparten `/ability/{name}`. Vive en memoria y muere al cerrar la app.
2. **Agregado persistente** (`CachedPokemonRepository` + `AsyncStorage`): listados y fichas ya mapeados, TTL 24 h. Si la red falla, se sirve el dato previo aunque esté vencido (offline parcial).

No se unifican: una cachea JSON crudo por URL; la otra cachea el modelo de dominio con política de TTL y fallback.

Los **sprites no se persisten**: salen del CDN de GitHub. Sin red, los textos de una ficha ya vista siguen disponibles y la UI muestra una Pokébola si la imagen no carga.

## Navigator propio

No hay React Navigation: el stack vive en memoria (`Home` → `ficha` → `Error`) y las pantallas previas quedan montadas con `display: none`. Así, volver desde la ficha no re-pide las 20 cards ni pierde el scroll. El hardware back en Android está cableado a `goBack` / `retry`.

La recarga de datos no es navegación: `ReloadProvider` incrementa un contador; los hooks de listado y ficha lo escuchan. Un error de ficha no vacía el listado ya visible.

## Requisitos

Completa la [guía de entorno](https://reactnative.dev/docs/set-up-your-environment).

## Ejecutar

```sh
npm start
```

En otra terminal:

```sh
npm run android
# o
npm run ios
```

En iOS, la primera vez:

```sh
bundle install
bundle exec pod install
```

```sh
npm test
npm run lint
npm run typecheck
```

CI (GitHub Actions) corre lint, `tsc --noEmit` y Jest en cada push/PR.

## Accesibilidad

Checklist rápido con TalkBack (Android) o VoiceOver (iOS):

- El listado anuncia cada card (“Ver ficha de …”) y el hint de abrir ficha.
- Carga inicial: “Cargando Pokédex…”. Carga de ficha: “Cargando ficha…”.
- Error y vacío se anuncian como alerta; Reintentar es un botón de 44 dp.
- Volver desde la ficha: “Volver al listado”.
- Las pantallas detrás del stack quedan ocultas al lector.
- Los colores de tipo están oscurecidos para contraste AA del texto blanco.
- Reduce Motion desactiva el pulse del skeleton y el fade del listado.
