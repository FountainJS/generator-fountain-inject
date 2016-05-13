'use strict';

const fountain = require('fountain-generator');
const transforms = require('./transforms');

module.exports = fountain.Base.extend({
  configuring: {
    pkg() {
      let dependencies;
      const devDependencies = {};

      this.updateJson('package.json', packageJson => {
        dependencies = packageJson.dependencies;
        delete packageJson.dependencies;
        return packageJson;
      });

      const pkg = {
        devDependencies: {
          'bower': '^1.7.9',
          'gulp-inject': '^3.0.0',
          'main-bower-files': '^2.9.0',
          'wiredep': '^2.2.2'
        },
        scripts: {
          bower: 'bower'
        }
      };

      if (this.options.framework === 'angular1') {
        pkg.devDependencies['gulp-angular-filesort'] = '^1.1.1';
      }

      if (this.options.js === 'typescript') {
        pkg.devDependencies['gulp-typescript'] = '^2.10.0';
      }

      this.mergeJson('package.json', pkg);

      if (this.options.framework === 'react') {
        delete dependencies['react-dom'];
      }

      if (this.options.framework === 'angular1') {
        devDependencies['angular-mocks'] = dependencies.angular;
      }

      this.mergeJson('bower.json', {
        name: 'fountain-inject',
        version: '0.0.1',
        dependencies,
        devDependencies
      });
    }
  },

  writing: {
    transforms,

    gulp() {
      this.copyTemplate(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        {css: this.options.css}
      );
    },

    indexHtml() {
      this.replaceInFileWithTemplate(
        this.templatePath('conf/gulp.conf.js'),
        this.destinationPath('conf/gulp.conf.js'),
        /$/
      );

      this.replaceInFileWithTemplate(
        'src/index-head.html',
        'src/index.html',
        /<\/head>/
      );
      this.replaceInFileWithTemplate(
        'src/index-footer.html',
        'src/index.html',
        /<\/html>/
      );
    }
  },

  install() {
    this.runInstall('./node_modules/.bin/bower');
  }
});
