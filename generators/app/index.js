'use strict';

const fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  prompting() {
    this.options.modules = 'inject';
    this.fountainPrompting();
  },

  configuring: {
    pkg() {
      let dependencies;
      let devDependencies = {};

      this.updateJson('package.json', function (packageJson) {
        dependencies = packageJson.dependencies;
        delete packageJson.dependencies;
        return packageJson;
      });

      const pkg = {
        devDependencies: {
          'gulp-inject': '^3.0.0',
          'main-bower-files': '^2.9.0',
          wiredep: '^2.2.2'
        }
      };

      if (this.props.framework === 'angular1') {
        pkg.devDependencies['gulp-angular-filesort'] = '^1.1.1';
      }

      if (this.props.js === 'babel' || this.props.js === 'js' && this.props.framework === 'react') {
        pkg.devDependencies['gulp-babel'] = '^6.1.0';
      }

      if (this.props.js === 'typescript') {
        pkg.devDependencies['gulp-typescript'] = '^2.10.0';
      }

      this.mergeJson('package.json', pkg);

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
    gulp() {
      this.copyTemplate(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        { css: this.props.css }
      );
    },

    indexHtml() {
      this.replaceInFile('src/index-head.html', 'src/index.html', /<\/head>/);
      this.replaceInFile('src/index-footer.html', 'src/index.html', /<\/html>/);
    }
  },

  installing() {
    this.bowerInstall();
  }
});
