'use strict';

const path = require('path');

module.exports = function transforms() {
  this.replaceInFiles('src/**/*.{js,ts,tsx}', (content, fileName) => {
    const baseName = path.basename(fileName, '.js');
    const componentName = baseName.substr(0, 1).toUpperCase() + baseName.substr(1);
    // remove es2015 webpack styles imports
    let result = content.replace(/import '.*ss';\n\n?/g, '');
    // remove commonjs webpack styles requires
    result = result.replace(/require\('.*ss'\);\n\n?/g, '');
    // replace commonjs with es2015 lib imports
    result = result.replace(
      /var (.*) = require\(('[^\.].*')\);/g,
      'import $1 from $2;'
    );
    // replace commonjs with es2015 local imports
    result = result.replace(
      /var (.*) = require\(('\..*')\);/g,
      'import { $1 } from $2;'
    );
    // replace commonjs with es2015 exports of createClass React components
    result = result.replace(
      /module\.exports = React\.createClass/,
      `export const ${componentName} = React.createClass`
    );
    // replace xhr urls to add src directory
    result = result.replace(
      /\.get\('app/,
      '.get(\'src/app'
    );
    return result;
  });
};
