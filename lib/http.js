'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = http;

var _gun = require('./gun');

var _gun2 = _interopRequireDefault(_gun);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function http(req, res, next) {
  next = next || function () {}; // if not next, and we don't handle it, we should res.end
  if (!req || !res) {
    return next();
  }
  if (!req.url) {
    return next();
  }
  if (!req.method) {
    return next();
  }
  var msg = {};
  msg.url = _url2.default.parse(req.url, true);
  msg.method = (req.method || '').toLowerCase();
  msg.headers = req.headers;
  var u,
      body,
      form = new _formidable2.default.IncomingForm(),
      post = function post(err, body) {
    if (u !== body) {
      msg.body = body;
    }
    next(msg, function (reply) {
      if (!res) {
        return;
      }
      if (!reply) {
        return res.end();
      }
      if (_gun2.default.obj.has(reply, 'statusCode') || _gun2.default.obj.has(reply, 'status')) {
        res.statusCode = reply.statusCode || reply.status;
      }
      if (reply.headers) {
        if (!(res.headersSent || res.headerSent || res._headerSent || res._headersSent)) {
          _gun2.default.obj.map(reply.headers, function (val, field) {
            if (val !== 0 && !val) {
              return;
            }
            res.setHeader(field, val);
          });
        }
      }
      if (_gun2.default.obj.has(reply, 'chunk') || _gun2.default.obj.has(reply, 'write')) {
        res.write(_gun2.default.text.ify(reply.chunk || reply.write) || '');
      }
      if (_gun2.default.obj.has(reply, 'body') || _gun2.default.obj.has(reply, 'end')) {
        res.end(_gun2.default.text.ify(reply.body || reply.end) || '');
      }
    });
  };
  form.on('field', function (k, v) {
    (body = body || {})[k] = v;
  }).on('file', function (k, v) {
    return; // files not supported in gun yet
  }).on('error', function (e) {
    if (form.done) {
      return;
    }
    post(e);
  }).on('end', function () {
    if (form.done) {
      return;
    }
    post(null, body);
  });
  form.parse(req);
}