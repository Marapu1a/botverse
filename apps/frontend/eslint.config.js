// eslint.config.js
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  extends: [
    ...tseslint.configs.strictTypeChecked, // строгие типизированные правила
  ],
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
    // можешь добавить свои правила сюда, например:
    'no-console': 'warn',
    'react/jsx-key': 'error',
  },
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.json'], // путь к твоему tsconfig
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
