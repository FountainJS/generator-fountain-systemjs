'use strict';

module.exports = function transforms() {
  this.replaceInFiles('src/**/*.{js,ts,tsx}', content => {
    // remove es2015 webpack styles imports
    let result = content.replace(/import '.*(styl|.*ss)';\n\n?/g, '');
    // remove commonjs webpack styles requires
    result = result.replace(/require\('.*(styl|.*ss)'\);\n\n?/g, '');
    // replace commonjs function imports with es2015 imports
    result = result.replace(
      /var (.*) = require\(('.*')\).(.*);/g,
      'import {$1} from $2;'
    );
    // replace commonjs with es2015 imports
    result = result.replace(
      /var (.*) = require\(('.*')\);/g,
      'import $1 from $2;'
    );
    result = result.replace(
      /require\(('.*')\);/g,
      'import $1;'
    );
    // replace imports to add extension
    result = result.replace(
      /import (.*) from '.\/(.*)'/g,
      `import $1 from \'.\/$2.${this.getExtensions(this.options).js}\'`
    );
    // replace commonjs with es2015 exports
    result = result.replace(
      /module\.exports =/,
      `export default`
    );
    // add src prefix to app/techs/techs.json
    result = result.replace(
      /'GET', 'app\//,
      '\'GET\', \'src/app/'
    );
    // replace xhr urls to add src directory
    result = result.replace(
      /\.get\('app/,
      '.get(\'src/app'
    );
    result = result.replace(
      /templateUrl: 'app/,
      'templateUrl: \'src/app'
    );

    return result;
  });
};
