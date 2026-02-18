# Online and offline scientific dictionary
## Overview
Built with Vite, React, and npm, this project is a single-page dictionary application. It is designed to work both online and offline, providing reliable access to content at all times — on any device with HTTP support.

## Description of the functionality
When the application starts, a hash table is constructed over the entire dictionary. This hash table stores the indexes of all dictionary entries, sorted by category, and serves as the backbone of the search functionality.<br>
When the user enters a search query, it is passed to the search() function, which accepts an English word, a German word, and a category. Each word is then forwarded — together with its corresponding language and category — to a dedicated helper function responsible for the core processing: filterDict().<br>
filterDict() begins by normalizing the input, converting both the search string and the category to lowercase and stripping all whitespace to ensure consistent matching. It then queries the hash table for entries whose first letter matches that of the input word, narrowing the results to the specified category and language. Any matching entries are collected into a set.<br>
If the input is longer than a single character, each entry in the result set is trimmed to the length of the input string and evaluated using the Levenshtein algorithm. Entries with a similarity below 50% are discarded. The two resulting sets — one for the English query, one for the German — are finally merged by search() and rendered on the screen.<br>
The dictionary itself is stored as a JSON file, which is periodically fetched from the server to stay up to date. Given that dictionary content rarely changes, the StaleWhileRevalidate caching strategy was chosen as an efficient and appropriate solution. The UI uses a responsive layout, keeping the interface clean and accessible across all screen sizes.

# since this project is still in progress there may be some errors and bugs!!!

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
