var Router = require('react-router').Router;
var Route = require('react-router').Route;
import './index.styl';
require('./index.styl');
var Test = require('lib').Test;
var angular = require('angular');
require('es6-shim');
import {App} from './app';
module.exports = 1;
class Techs {
  getTechs() {
    return this.http
      .get('app/techs/techs.json')
      .map(response => response.json());
  }
}
angular
  .module('app')
  .component('fountainFooter', {
    templateUrl: 'app/footer.html'
  });
