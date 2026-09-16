# muckChallengePokedex

Pokédex en React Native: lista los Pokémon de [PokéAPI](https://pokeapi.co), abre una ficha de detalle y funciona de forma parcial sin red una vez cacheada.

## Persistencia

Los listados y las fichas se guardan en **AsyncStorage** (sobrevive al cierre de la app) con un **TTL de 24 h**. PokéAPI casi no cambia esos recursos: el TTL evita pegarle a la red en cada visita y, si la petición falla, se sirve el dato previo aunque esté vencido (offline parcial).

En sesión hay además una caché HTTP en memoria para no repetir `/pokemon/{id}` ni `/ability/{name}` entre el listado y la ficha.

Los **sprites no se persisten**: salen del CDN de GitHub. Sin red, los textos de una ficha ya vista siguen disponibles y la UI muestra una Pokébola si la imagen no carga.

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
```
