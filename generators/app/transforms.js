'use strict';

const path = require('path');

module.exports = function transforms() {
  this.replaceInFiles('src/**/*.{js,ts,tsx}', (content, fileName) => {
    const baseName = path.basename(fileName, path.extname(fileName));
    const componentName = baseName.substr(0, 1).toUpperCase() + baseName.substr(1);
    // remove es2015 imports
    let result = content.replace(/import .*\n\n?/g, '');
    // remove commonjs requires
    result = result.replace(/.*require\(.*\);\n\n?/g, '');
    // add TS reference in files which doesn't have one
    result = result.replace(
      /^(?!\/\/\/ <reference path=)/g,
      '/// <reference path="../../typings/tsd.d.ts" />\n\n'
    );
    // remove exports of es2015 or typescript
    result = result.replace(/(\n?\s*)export /g, '$1');
    // remove exports of es2015 React components
    result = result.replace(
      /extends Component/g,
      'extends React.Component'
    );
    // remove exports of createClass React components
    result = result.replace(
      /module\.exports = React\.createClass/,
      `window.${componentName} = React.createClass`
    );
    // rename styles var for React inline style
    result = result.replace(
      /(var|const) styles =/g,
      `$1 ${componentName}Styles =`
    );
    result = result.replace(
      /style={styles\.(.*)}/g,
      `style={${componentName}Styles.$1}`
    );
    return result;
  });
};
