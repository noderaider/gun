'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _peer = require('../polyfill/peer');

var _peer2 = _interopRequireDefault(_peer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if ((typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) === 'object') {
  if (typeof JSON === 'undefined') throw new Error('Include JSON first: ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js'); // for old IE use

  var noop = function noop() {};
  var root = void 0;
  if (typeof window !== 'undefined') root = window;

  var Tab = {};
  Tab.on = _2.default.on; //Gun.on.create();
  Tab.peers = _peer2.default;
  _2.default.on('get', function (at) {
    var gun = at.gun,
        opt = gun.Back('opt') || {},
        peers = opt.peers;
    if (!peers || _2.default.obj.empty(peers)) {
      //setTimeout(function(){
      _2.default.log.once('peers', 'Warning! You have no peers to connect to!');
      at.gun.Back(-1).on('in', { '@': at['#'] });
      //},100);
      return;
    }
    var msg = {
      '#': at['#'] || _2.default.text.random(9) // msg ID
      , '$': at.get // msg BODY
    };
    Tab.on(msg['#'], function (err, data) {
      // TODO: ONE? PERF! Clear out listeners, maybe with setTimeout?
      if (data) {
        at.gun.Back(-1).on('out', { '@': at['#'], err: err, put: data });
      } else {
        at.gun.Back(-1).on('in', { '@': at['#'], err: err, put: data });
      }
    });
    Tab.peers(peers).send(msg, { headers: { 'gun-sid': Tab.server.sid } });
  });
  _2.default.on('put', function (at) {
    if (at['@']) {
      return;
    }
    var opt = at.gun.Back('opt') || {},
        peers = opt.peers;
    if (!peers || _2.default.obj.empty(peers)) {
      _2.default.log.once('peers', 'Warning! You have no peers to save to!');
      at.gun.Back(-1).on('in', { '@': at['#'] });
      return;
    }
    if (false === opt.websocket || at.opt && false === at.opt.websocket) {
      return;
    }
    var msg = {
      '#': at['#'] || _2.default.text.random(9) // msg ID
      , '$': at.put // msg BODY
    };
    Tab.on(msg['#'], function (err, ok) {
      // TODO: ONE? PERF! Clear out listeners, maybe with setTimeout?
      at.gun.Back(-1).on('in', { '@': at['#'], err: err, ok: ok });
    });
    Tab.peers(peers).send(msg, { headers: { 'gun-sid': Tab.server.sid } });
  });
  // browser/client side Server!
  _2.default.on('opt', function (at) {
    // TODO: BUG! Does not respect separate instances!!!
    if (Tab.server) {
      return;
    }
    var gun = at.gun,
        server = Tab.server = {},
        tmp;
    server.sid = _2.default.text.random();
    Tab.peers.request.createServer(function (req, res) {
      if (!req || !res || !req.body || !req.headers) {
        return;
      }
      var msg = req.body;
      // AUTH for non-replies.
      if (server.msg(msg['#'])) {
        return;
      }
      //server.on('network', Gun.obj.copy(req)); // Unless we have WebRTC, not needed.
      if (msg['@']) {
        // no need to process.
        if (Tab.ons[tmp = msg['@'] || msg['#']]) {
          Tab.on(tmp, [msg['!'], msg['$']]);
        }
        return;
      }
      return msg['$'] && msg['$']['#'] ? server.get(req, res) : server.put(req, res);
    });
    server.get = function (req, cb) {
      var body = req.body,
          lex = body['$'],
          opt;
      var graph = gun._.root._.graph,
          node;
      if (!(node = graph[lex['#']])) {
        return;
      } // Don't reply to data we don't have it in memory. TODO: Add localStorage?
      cb({ body: {
          '#': server.msg(),
          '@': body['#'],
          '$': node
        } });
    };
    server.put = function (req, cb) {
      var body = req.body,
          graph = body['$'];
      var __ = gun._.root._;
      if (!(graph = _2.default.obj.map(graph, function (node, soul, map) {
        // filter out what we don't have in memory.
        if (!__.path[soul]) {
          return;
        }
        map(soul, node);
      }))) {
        return;
      }
      gun.on('out', { gun: gun, opt: { websocket: false }, put: graph, '#': _2.default.on.ask(function (ack, ev) {
          if (!ack) {
            return;
          }
          ev.off();
          return cb({ body: {
              '#': server.msg(),
              '@': body['#'],
              '$': ack,
              '!': ack.err
            } });
        }) });
    };
    server.msg = function (id) {
      if (!id) {
        return server.msg.debounce[id = _2.default.text.random(9)] = _2.default.time.is(), id;
      }
      clearTimeout(server.msg.clear);
      server.msg.clear = setTimeout(function () {
        var now = _2.default.time.is();
        _2.default.obj.map(server.msg.debounce, function (t, id) {
          if (now - t < 1000 * 60 * 5) {
            return;
          }
          _2.default.obj.del(server.msg.debounce, id);
        });
      }, 500);
      if (server.msg.debounce[id]) {
        return server.msg.debounce[id] = _2.default.time.is(), id;
      }
      server.msg.debounce[id] = _2.default.time.is();
      return;
    };
    server.msg.debounce = server.msg.debounce || {};
  });
}