'use strict';

var fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  prompting: function () {
    this.options.modules = 'inject';
    this.fountainPrompting();
  },

  configuring: {
    package: function () {
      let dependencies;
      let devDependencies = {};

      this.updateJson('package.json', function (packageJson) {
        dependencies = packageJson.dependencies;
        delete packageJson.dependencies;
        return packageJson;
      });

      this.mergeJson('package.json', {
        devDependencies: {
          'gulp-babel': '^6.1.0',
          'gulp-inject': '^3.0.0',
          'main-bower-files': '^2.9.0',
          wiredep: '^2.2.2',
          'gulp-angular-filesort': '^1.1.1'
        }
      });

      if (this.props.framework === 'react') {
        delete dependencies['react-dom'];
      }

      if (this.props.framework === 'angular1') {
        devDependencies['angular-mocks'] = dependencies.angular;
      }

      this.mergeJson('bower.json', {
        name: 'fountain-inject',
        version: '0.0.1',
        dependencies: dependencies,
        devDependencies: devDependencies
      });
    }
  },

  writing: {
    gulp: function () {
      this.fs.copyTpl(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        { css: this.props.css }
      );
    },

    indexHtml: function () {
      const props = Object.assign({ head: true }, this.props);
      this.replaceInFile('src/index.html', /<\/head>/, props);
      props.head = false;
      this.replaceInFile('src/index.html', /<\/html>/, props);
    }
  },

  installing: function () {
    this.bowerInstall();
  }
});
