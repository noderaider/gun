'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Type = require('./Type');

var _Type2 = _interopRequireDefault(_Type);

var _Val = require('./Val');

var _Val2 = _interopRequireDefault(_Val);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Graph = {};

Graph.is = function (g, cb, fn, as) {
  // checks to see if an object is a valid graph.
  if (!g || !obj_is(g) || obj_empty(g)) {
    return false;
  } // must be an object.
  return !obj_map(g, map, { fn: fn, cb: cb, as: as }); // makes sure it wasn't an empty object.
};
function nf(fn) {
  // optional callback for each node.
  if (fn) {
    _node2.default.is(nf.n, fn, nf.as);
  } // where we then have an optional callback for each field/value.
}
function map(n, s) {
  // we invert this because the way we check for this is via a negation.
  if (!n || s !== _node2.default.soul(n) || !_node2.default.is(n, this.fn)) {
    return true;
  } // it is true that this is an invalid graph.
  if (!fn_is(this.cb)) {
    return;
  }
  nf.n = n;nf.as = this.as;
  this.cb.call(nf.as, n, s, nf);
}
Graph.ify = function (obj, env, as) {
  var at = { path: [], obj: obj };
  if (!env) env = {};else if (typeof env === 'string') env = { soul: env };else if (env instanceof Function) env.map = env;
  if (env.soul) at.rel = _Val2.default.rel.ify(env.soul);
  env.graph = env.graph || {};
  env.seen = env.seen || [];
  env.as = env.as || as;
  node(env, at);
  env.root = at.node;
  return env.graph;
};
function node(env, at) {
  var tmp = void 0;
  if (tmp = seen(env, at)) return tmp;
  at.env = env;
  at.soul = soul;
  if (_node2.default.ify(at.obj, map, at)) {
    at.rel = at.rel || _Val2.default.rel.ify(_node2.default.soul(at.node));
    env.graph[_Val2.default.rel.is(at.rel)] = at.node;
  }
  return at;
}
function map(v, f, n) {
  var at = this,
      env = at.env,
      is,
      tmp;
  if (_node2.default._ === f && obj_has(v, _Val2.default.rel._)) {
    return n._; // TODO: Bug?
  }
  if (!(is = valid(v, f, n, at, env))) {
    return;
  }
  if (!f) {
    at.node = at.node || n || {};
    if (obj_has(v, _node2.default._)) {
      at.node._ = Gun.obj.copy(v._);
    }
    at.node = _node2.default.soul.ify(at.node, _Val2.default.rel.is(at.rel));
  }
  if (tmp = env.map) {
    tmp.call(env.as || {}, v, f, n, at);
    if (obj_has(n, f)) {
      v = n[f];
      if (u === v) {
        obj_del(n, f);
        return;
      }
      if (!(is = valid(v, f, n, at, env))) {
        return;
      }
    }
  }
  if (!f) {
    return at.node;
  }
  if (true === is) {
    return v;
  }
  tmp = node(env, { obj: v, path: at.path.concat(f) });
  if (!tmp.node) {
    return;
  }
  return tmp.rel; //{'#': Node.soul(tmp.node)};
}
function soul(id) {
  var at = this;
  var prev = _Val2.default.rel.is(at.rel),
      graph = at.env.graph;
  at.rel = at.rel || _Val2.default.rel.ify(id);
  at.rel[_Val2.default.rel._] = id;
  if (at.node && at.node[_node2.default._]) {
    at.node[_node2.default._][_Val2.default.rel._] = id;
  }
  if (obj_has(graph, prev)) {
    graph[id] = graph[prev];
    obj_del(graph, prev);
  }
}
function valid(v, f, n, at, env) {
  var tmp = void 0;
  if (_Val2.default.is(v)) {
    return true;
  }
  if (obj_is(v)) {
    return 1;
  }
  if (tmp = env.invalid) {
    v = tmp.call(env.as || {}, v, f, n);
    return valid(v, f, n, at, env);
  }
  env.err = 'Invalid value at \'' + at.path.concat(f).join('.') + '\'!';
}
function seen(env, at) {
  var arr = env.seen;
  var i = arr.length;
  var has = void 0;
  while (i--) {
    has = arr[i];
    if (at.obj === has.obj) return has;
  }
  arr.push(at);
}
Graph.node = function (node) {
  var soul = _node2.default.soul(node);
  if (!soul) {
    return;
  }
  return obj_put({}, soul, node);
};
Graph.to = function (graph, root, opt) {
  if (!graph) {
    return;
  }
  var obj = {};
  opt = opt || { seen: {} };
  obj_map(graph[root], map, { obj: obj, graph: graph, opt: opt });
  return obj;
};
function map(v, f) {
  var tmp = void 0;
  var obj = void 0;
  if (_node2.default._ === f) {
    if (obj_empty(v, _Val2.default.rel._)) return;
    this.obj[f] = obj_copy(v);
    return;
  }
  if (!(tmp = _Val2.default.rel.is(v))) {
    this.obj[f] = v;
    return;
  }
  if (obj = this.opt.seen[tmp]) {
    this.obj[f] = obj;
    return;
  }
  this.obj[f] = this.opt.seen[tmp] = Graph.to(this.graph, tmp, this.opt);
}
var fn_is = _Type2.default.fn.is;
var obj = _Type2.default.obj,
    obj_is = obj.is,
    obj_del = obj.del,
    obj_has = obj.has,
    obj_empty = obj.empty,
    obj_put = obj.put,
    obj_map = obj.map,
    obj_copy = obj.copy;

exports.default = Graph;