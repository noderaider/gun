'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _gun = require('./gun');

var _gun2 = _interopRequireDefault(_gun);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var file = {};

// queue writes, adapted from https://github.com/toolness/jsondown/blob/master/jsondown.js
// This was written by the wonderful Forrest Tait
// modified by Mark to be part of core for convenience
// twas not designed for production use
// only simple local development.
var isWriting = false,
    queuedWrites = [];
function writeFile(path, disk, at) {
  if (isWriting) return queuedWrites.push(at);
  isWriting = true;
  var contents = (0, _stringify2.default)(disk, null, 2);
  _fs2.default.writeFile(String(path), contents, function (err) {
    var batch = queuedWrites.splice(0);
    isWriting = false;
    at.gun.Back(-1).on('in', { '@': at['#'], err: err, ok: err ? false : 1 });
    if (!batch.length) {
      return;
    }
    batch.forEach(function (at) {
      at.gun.Back(-1).on('in', { '@': at['#'], err: err, ok: err ? false : 1 });
    });
  });
}

_gun2.default.on('put', function (at) {
  var gun = at.gun,
      graph = at.put,
      opt = at.opt || {};
  var __ = gun._.root._;
  _gun2.default.obj.map(graph, function (node, soul) {
    /*
    if(!file.disk) {
      console.warn(`file.disk DNE => file: ${util.inspect(file)}\ngraph: ${util.inspect(graph)}\nnode: ${util.inspect(node)}\nsoul: ${util.inspect(soul)}`)
      return
    }
    */
    file.disk.graph[soul] = __.graph[soul] || graph[soul];
  });
  writeFile(opt.file || file.file, file.disk, at);
});
_gun2.default.on('get', function (at) {
  var gun = at.gun,
      lex = at.get,
      opt = at.opt;
  if (!lex) {
    return;
  }
  gun.Back(-1).on('in', { '@': at['#'], put: _gun2.default.graph.node(file.disk.graph[lex['#']]) });
  //at.cb(null, file.disk.graph[lex['#']]);
});

_gun2.default.on('opt', function (at) {
  var gun = at.gun,
      opts = at.opt;
  if (opts.file === false || opts.s3 && opts.s3.key) {
    return; // don't use this plugin if S3 is being used.
  }
  console.log('WARNING! This `file.js` module for gun is intended only for local development testing!');
  file.file = opts.file || file.file || 'data.json';
  file.raw = file.raw || (_fs2.default.existsSync || require('path').existsSync)(opts.file) ? _fs2.default.readFileSync(opts.file).toString() : null;
  file.disk = file.disk || _gun2.default.obj.ify(file.raw || { graph: {} });
  file.disk.graph = file.disk.graph || {};
});