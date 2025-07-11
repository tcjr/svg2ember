import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import svg2ember from 'svg2ember/vite';
import Inspect from 'vite-plugin-inspect';

export default defineConfig({
  plugins: [
    Inspect(),
    svg2ember(),
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
    tailwindcss(),
  ],
});
