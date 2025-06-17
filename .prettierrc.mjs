export default {
  plugins: [],
  overrides: [
    {
      files: '*.{js,ts,mjs,mts,cjs,cts}',
      options: {
        singleQuote: true,
      },
    },
    {
      files: '*.{gjs,gts}',
      options: {
        singleQuote: true,
        templateSingleQuote: false,
      },
    },
  ],
};
