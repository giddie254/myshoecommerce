import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

/** @type {import('postcss').PluginCreator} */
export default {
  plugins: [
    tailwindcss(),
    autoprefixer()
  ],
};
