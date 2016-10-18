'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jsonp;

var _gun = require('./gun');

var _gun2 = _interopRequireDefault(_gun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function jsonp(req, cb) {
  if (!req.url || !req.url.query || !req.url.query.jsonp) {
    return cb;
  }
  cb.jsonp = req.url.query.jsonp;
  delete req.url.query.jsonp;
  _gun2.default.obj.map(_gun2.default.obj.ify(req.url.query['`']), function (val, i) {
    req.headers[i] = val;
  });
  delete req.url.query['`'];
  if (req.url.query.$) {
    req.body = req.url.query.$;
    if (!_gun2.default.obj.has(req.url.query, '^') || 'json' == req.url.query['^']) {
      req.body = _gun2.default.obj.ify(req.body); // TODO: BUG! THIS IS WRONG! This doesn't handle multipart chunking, and will fail!
    }
  }
  delete req.url.query.$;
  delete req.url.query['^'];
  delete req.url.query['%'];
  var reply = { headers: {} };
  return function (res) {
    if (!res) {
      return;
    }
    if (res.headers) {
      _gun2.default.obj.map(res.headers, function (val, field) {
        reply.headers[field] = val;
      });
    }
    reply.headers['Content-Type'] = 'text/javascript';
    if (_gun2.default.obj.has(res, 'chunk') && (!reply.body || _gun2.default.list.is(reply.chunks))) {
      (reply.chunks = reply.chunks || []).push(res.chunk);
    }
    if (_gun2.default.obj.has(res, 'body')) {
      reply.body = res.body; // self-reference yourself so on the client we can get the headers and body.
      reply.body = ';' + cb.jsonp + '(' + _gun2.default.text.ify(reply) + ');'; // javascriptify it! can't believe the client trusts us.
      cb(reply);
    }
  };
}