'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _localStorage = require('./localStorage');

Object.defineProperty(exports, 'localStorage', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_localStorage).default;
  }
});

var _wsp = require('./wsp');

Object.defineProperty(exports, 'wsp', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_wsp).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }