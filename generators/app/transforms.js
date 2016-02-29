'use strict';

const path = require('path');

module.exports = function transforms() {
  this.replaceInFiles('src/**/*.{js,ts,tsx}', (content, fileName) => {
    const baseName = path.basename(fileName, path.extname(fileName));
    const reactComponentName = baseName.substr(0, 1).toUpperCase() + baseName.substr(1);
    const angular1ComponentName = baseName === 'main' ? 'app' : 'techs' + reactComponentName;
    // remove es2015 imports
    let result = content.replace(/import .*\n\n?/g, '');
    // remove commonjs requires
    result = result.replace(/.*require\(.*\);\n\n?/g, '');
    // add TS reference in files which doesn't have one
    if (this.props.js === 'typescript') {
      const relativeFilePath = path.relative(this.destinationPath('src'), fileName);
      const relativePath = relativeFilePath.split('/').map(() => '../').join('');
      result = result.replace(
        /^(?!\/\/\/ <reference path=)/g,
        `/// <reference path="${relativePath}typings/tsd.d.ts" />\n\n`
      );
    }
    // remove exports of es2015 or typescript
    result = result.replace(/export /g, '');
    // remove exports of es2015 React components
    result = result.replace(
      /extends Component/g,
      'extends React.Component'
    );
    // remove exports of createClass React components
    result = result.replace(
      /module\.exports = React\.createClass/g,
      `window.${reactComponentName} = React.createClass`
    );
    // rename styles var for React inline style
    result = result.replace(
      /(var|const) styles =/g,
      `$1 ${reactComponentName}Styles =`
    );
    result = result.replace(
      /style={styles\.(.*)}/g,
      `style={${reactComponentName}Styles.$1}`
    );
    // remove centralized Angular 1 component declaration
    if (baseName === 'index') {
      result = result.replace(/\n\s+\.component[^;]*/g, '');
      result = result.replace(/(\.module.*\[).*(\])/g, '$1$2');
    } else {
      result = result.replace(
        /(const .*|module\.exports) = ([\s\S]*?\n\})/g, // ok, this one is ugly...
        `angular.module('app').component('${angular1ComponentName}', $2)`
      );
    }
    return result;
  });
};
