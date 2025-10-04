# 🍤 super-configs

Configuracion centralizada para ESLint, Prettier, TypeScript y configuraciones de test (Jest, Vitest, Bun) para JS/TS projects.

## 📋 Contenido
- Configuraciôn para ESLint (JS, React, TS, TS+React) en `eslint/`
- Configuraciôn para Prettier en `prettier/`
- Configuraciôn para TSConfig presets en `tsconfig/`
- Configuraciôn para tests (pruebas unitarias) `test/`
- `index.ts` exporta toda la configuraciôn

## 📦 Instalaciôn
```bash
bun add -d super-configs
# or npm
npm i -D super-configs
```

## 🚀 Uso y Ejemplos

### ESLint
Create `.eslintrc.cjs` with:
```js
// JS + React + TS examples:
export { default } from "super-configs/dist/eslint/ts-react.js";
```

Or for JS React:
```js
export { default } from "super-configs/dist/eslint/react.js";
```

### Prettier
Add `.prettierrc`:
```json
"super-configs/prettier"
```

### TypeScript
`tsconfig.json`
```json
{
  "extends": "super-configs/tsconfig/react.json"
}
```

### Jest
```js
import config from "super-configs/test/jest.config.js";
export default config;
```

## Build & Publish (with Bun)
```bash
bun run build
bun publish
```

---

## 🤝 Contribución
¡Las contribuciones son bienvenidas! Si encuentras un bug o tienes una sugerencia, por favor, abre un issue o un pull request.

---

### 📜 Licencia
Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo LICENSE.

---
### 👨‍💻 Autor
Ivan - @ElJijuna
