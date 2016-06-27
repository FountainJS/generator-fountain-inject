'use strict';

const path = require('path');

module.exports = function transforms() {
  this.replaceInFiles('src/**/*.{js,ts,tsx}', (content, fileName) => {
    const baseName = path.basename(fileName, path.extname(fileName));
    const reactComponentName = baseName.substr(0, 1).toUpperCase() + baseName.substr(1);
    // replace es2015 import of react-router
    const identifier = this.options.js === 'js' ? 'var' : 'const';
    let result = content.replace(/import {Router, Route, browserHistory} from 'react-router';/g, `${identifier} Router = ReactRouter.Router;\n${identifier} Route = ReactRouter.Route;\n${identifier} browserHistory = ReactRouter.browserHistory;`);
    // replace commonjs require of react-router
    result = result.replace(/(var|const) (.*) = require\(('react-router')\).(.*);/g, `$1 $2 = ReactRouter.$2;`);
    // remove es2015 imports
    result = result.replace(/import .*\n\n?/g, '');
    // remove commonjs requires
    result = result.replace(/.*require\(.*\);\n\n?/g, '');
    // add TS reference in files which doesn't have one
    if (this.options.js === 'typescript') {
      const relativeFilePath = path.relative(this.destinationPath('src'), fileName);
      const relativePath = relativeFilePath.split('/').map(() => '../').join('');
      result = result.replace(
        /^(?!\/\/\/ <reference path=)/g,
        `/// <reference path="${relativePath}typings/index.d.ts" />\n\n`
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
      `var ${reactComponentName} = React.createClass`
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
    return result;
  });
};
