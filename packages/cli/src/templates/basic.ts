import { Template } from './template';

const basicTemplate: Template = {
  name: 'basic',
  dependencies: ['@types/jest', 'typescript'],
  packageJson: {
    // name: safeName,
    version: '0.1.0',
    license: 'MIT',
    // author: author,
    main: 'dist/bundle.cjs.js',
    module: 'dist/bundle.esm.js',
    'jsnext:main': 'dist/bundle.esm.js',
    types: 'dist/publicApi.d.ts',
    scripts: {
      start: 'npx rollup -cw',
      build: 'npx rollup -c',
      test: 'jest --passWithNoTests',
      docz: 'docz dev -p 6010',
      'lint:es': 'eslint src/**/*.{js,jsx,ts,tsx}',
      'lint:css': 'stylelint src/**/*.{css,sass,scss}'
    },
    publishConfig: {
      access: 'public'
    }
  }
};

export default basicTemplate;
