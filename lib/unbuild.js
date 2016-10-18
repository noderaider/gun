'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dir = __dirname + '/../';

var read = function read(path) {
  return _fs2.default.readFileSync(_path2.default.join(dir, path)).toString();
};

var write = function write(path, data) {
  return _fs2.default.writeFileSync(_path2.default.join(dir, path), data);
};

var rm = function rm(path, full) {
  path = full || _path2.default.join(dir, path);
  if (!_fs2.default.existsSync(path)) {
    return;
  }
  _fs2.default.readdirSync(path).forEach(function (file, index) {
    var curPath = path + '/' + file;
    if (_fs2.default.lstatSync(curPath).isDirectory()) {
      // recurse
      rm(null, curPath);
    } else {
      // delete file
      _fs2.default.unlinkSync(curPath);
    }
  });
  _fs2.default.rmdirSync(path);
};

var mk = function mk(path) {
  path = _path2.default.join(dir, path);
  if (_fs2.default.existsSync(path)) {
    return;
  }
  _fs2.default.mkdirSync(path);
};

var between = function between(text, start, end) {
  end = end || start;
  var s = text.indexOf(start);
  if (s < 0) {
    return '';
  }
  s += start.length;
  var e = text.indexOf(end, s);
  if (e < 0) {
    return '';
  }
  var code = text.slice(s, e);
  return { s: s, t: code, e: e };
};

var next = function next(start, end) {
  end = end || start;
  if (!next.text) {
    next.text = start;
    return;
  }
  var code = between(next.text, start, end);
  next.text = next.text.slice(code.e + end.length);
  return code.t;
};

var path = function path() {
  var code = next(',', ')');
  var path;
  try {
    path = eval(code);
  } catch (e) {
    console.log('fail', e);
  }
  if (!path) {
    return;
  }
  if ('.js' !== path.slice(-3)) {
    path += '.js';
  }
  return _path2.default.join('./src', path);
};

var undent = function undent(code, n) {
  var regex = /\n\t\t/g;
  if (1 === n) {
    regex = /\n\t/g;
  }
  return code.replace(regex, '\n');
};(function () {

  rm('./src');
  mk('./src');
  mk('./src/polyfill');
  mk('./src/adapters');

  var gun = read('gun.js');
  var code = next(gun);

  code = next('/* UNBUILD */');
  write('src/polyfill/unbuild.js', undent(code, 1));

  (function recurse(c) {
    code = next(';require(function(module){', '})(require');
    if (!code) {
      return;
    }
    var file = path();
    if (!file) {
      return;
    }
    write(file, undent(code));
    recurse();
  })();
})();