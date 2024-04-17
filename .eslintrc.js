module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
