'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ws;

var _gun = require('./gun');

var _gun2 = _interopRequireDefault(_gun);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ws(wss, server, opt) {
  wss.on('connection', function (ws) {
    var req = {};
    ws.upgradeReq = ws.upgradeReq || {};
    req.url = _url2.default.parse(ws.upgradeReq.url || '');
    req.method = (ws.upgradeReq.method || '').toLowerCase();
    req.headers = ws.upgradeReq.headers || {};
    //Gun.log("wsReq", req);
    ws.on('message', function (msg) {
      msg = _gun2.default.obj.ify(msg);
      msg.url = msg.url || {};
      msg.url.pathname = (req.url.pathname || '') + (msg.url.pathname || '');
      _gun2.default.obj.map(req.url, function (val, i) {
        msg.url[i] = msg.url[i] || val; // reattach url
      });
      msg.method = msg.method || msg.body ? 'put' : 'get';
      msg.headers = msg.headers || {};
      _gun2.default.obj.map(opt.headers || req.headers, function (val, i) {
        msg.headers[i] = msg.headers[i]; // reattach headers
      });
      server.call(ws, msg, function (reply) {
        if (!ws || !ws.send || !ws._socket || !ws._socket.writable) {
          return;
        }
        reply = reply || {};
        if (msg && msg.headers && msg.headers['ws-rid']) {
          (reply.headers = reply.headers || {})['ws-rid'] = msg.headers['ws-rid'];
        }
        try {
          ws.send(_gun2.default.text.ify(reply));
        } catch (e) {
          // juuuust in case.
          console.error('SWALLOWING', e);
        }
      });
    });
    ws.off = function (m) {
      //Gun.log("ws.off", m);
      ws.send = null;
    };
    ws.on('close', ws.off);
    ws.on('error', ws.off);
  });
}