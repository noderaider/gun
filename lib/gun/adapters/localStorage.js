'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if ((typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) === 'object') {
  var put = function put(at) {
    var err = void 0;
    var id = void 0;
    var opt = void 0;
    var root = at.gun._.root;(opt = at.opt || {}).prefix = opt.prefix || at.gun.Back('opt.prefix') || 'gun/';
    _2.default.graph.is(at.put, function (node, soul) {
      //try{store.setItem(opt.prefix + soul, Gun.text.ify(node));
      try {
        store.setItem(opt.prefix + soul, _2.default.text.ify(root._.graph[soul] || node));
      } catch (e) {
        err = e || 'localStorage failure';
      }
    });
    //console.log('@@@@@@@@@@local put!');
    _2.default.on.ack(at, { err: err, ok: 0 }); // TODO: Reliability! Are we sure we want to have localStorage ack?
  };

  var get = function get(at) {
    var gun = at.gun,
        lex = at.get,
        soul,
        data,
        opt,
        u;
    //setTimeout(function(){
    (opt = at.opt || {}).prefix = opt.prefix || at.gun.Back('opt.prefix') || 'gun/';
    if (!lex || !(soul = lex[_2.default._.soul])) {
      return;
    }
    data = _2.default.obj.ify(store.getItem(opt.prefix + soul) || null);
    if (!data) {
      return;
    } // localStorage isn't trustworthy to say "not found".
    if (_2.default.obj.has(lex, '.')) {
      var tmp = data[lex['.']];data = { _: data._ };if (u !== tmp) {
        data[lex['.']] = tmp;
      }
    }
    //console.log('@@@@@@@@@@@@local get', data, at);
    gun.Back(-1).on('in', { '@': at['#'], put: _2.default.graph.node(data) });
    //},100);
  };

  if (typeof JSON === 'undefined') throw new Error('Include JSON first: ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js'); // for old IE use

  var noop = function noop() {};
  var root = void 0;
  if (typeof window !== 'undefined') root = window;
  var store = root.localStorage || { setItem: noop, removeItem: noop, getItem: noop };

  _2.default.on('put', put);
  _2.default.on('get', get);
}