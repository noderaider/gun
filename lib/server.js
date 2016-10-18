'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gun = require('./gun');

var _gun2 = _interopRequireDefault(_gun);

require('./s3');

require('./wsp');

require('./file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('Hello wonderful person! :) I\'m mark@gunDB.io, message me for help or with hatemail. I want to hear from you! <3');
exports.default = _gun2.default;