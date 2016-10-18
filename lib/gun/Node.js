'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Type = require('./Type');

var _Type2 = _interopRequireDefault(_Type);

var _Val = require('./Val');

var _Val2 = _interopRequireDefault(_Val);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Node = { _: '_' };
Node.soul = function (n, o) {
  return n && n._ && n._[o || _soul];
}; // convenience function to check to see if there is a soul on a node and return it.
Node.soul.ify = function (n, o) {
  // put a soul on an object.
  o = typeof o === 'string' ? { soul: o } : o || {};
  n = n || {}; // make sure it exists.
  n._ = n._ || {}; // make sure meta exists.
  n._[_soul] = o.soul || n._[_soul] || text_random(); // put the soul on it.
  return n;
};(function () {
  Node.is = function (n, cb, o) {
    var s = void 0; // checks to see if an object is a valid node.
    if (!obj_is(n)) return false; // must be an object.
    if (s = Node.soul(n)) // must have a soul on it.
      return !obj_map(n, map, { o: o, n: n, cb: cb });
    return false; // nope! This was not a valid node.
  };
  function map(v, f) {
    // we invert this because the way we check for this is via a negation.
    if (f === Node._) {
      return;
    } // skip over the metadata.
    if (!_Val2.default.is(v)) {
      return true;
    } // it is true that this is an invalid node.
    if (this.cb) {
      this.cb.call(this.o, v, f, this.n);
    } // optionally callback each field/value.
  }
})();(function () {
  Node.ify = function (obj, o, as) {
    // returns a node from a shallow object.
    if (!o) o = {};else if (typeof o === 'string') o = { soul: o };else if (o instanceof Function) o = { map: o };
    if (o.map) o.node = o.map.call(as, obj, u, o.node || {});
    if (o.node = Node.soul.ify(o.node || {}, o)) obj_map(obj, map, { opt: o, as: as });
    return o.node; // This will only be a valid node if the object wasn't already deep!
  };
  function map(v, f) {
    var o = this.opt,
        tmp = void 0,
        u = void 0; // iterate over each field/value.
    if (o.map) {
      tmp = o.map.call(this.as, v, '' + f, o.node);
      if (u === tmp) {
        obj_del(o.node, f);
      } else if (o.node) {
        o.node[f] = tmp;
      }
      return;
    }
    if (_Val2.default.is(v)) {
      o.node[f] = v;
    }
  }
})();
var obj = _Type2.default.obj,
    obj_is = obj.is,
    obj_del = obj.del,
    obj_map = obj.map;
var text = _Type2.default.text,
    text_random = text.random;
var _soul = _Val2.default.rel._;
exports.default = Node;