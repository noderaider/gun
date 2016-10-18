'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gun = require('./gun');

var _gun2 = _interopRequireDefault(_gun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function meta(v, f) {
  if (obj_has(_gun2.default.__, f)) {
    return;
  }
  obj_put(this._, f, v);
} //console.log("!!!!!!!!!!!!!!!! WARNING THIS IS GUN 0.5 !!!!!!!!!!!!!!!!!!!!!!");

function map(value, field) {
  if (_gun2.default._.meta === field) return;
  var node = this.node;
  var vertex = this.vertex;
  var union = this.union;
  var machine = this.machine;
  var is = state_is(node, field);
  var cs = state_is(vertex, field);
  if (u === is || u === cs) return true; // it is true that this is an invalid HAM comparison.
  var iv = rel_is(value) || value;
  var cv = rel_is(vertex[field]) || vertex[field];
  // TODO: BUG! Need to compare relation to not relation, and choose the relation if there is a state conflict.

  if (!val_is(iv) && u !== iv) return true; // Undefined is okay since a value might not exist on both nodes. // it is true that this is an invalid HAM comparison.
  if (!val_is(cv) && u !== cv) return true; // Undefined is okay since a value might not exist on both nodes. // it is true that this is an invalid HAM comparison.
  var HAM = _gun2.default.HAM(machine, is, cs, iv, cv);
  if (HAM.err) {
    console.log('.!HYPOTHETICAL AMNESIA MACHINE ERR!.', HAM.err); // this error should never happen.
    return;
  }
  if (HAM.state || HAM.historical || HAM.current) {
    // TODO: BUG! Not implemented.
    //opt.lower(vertex, {field: field, value: value, state: is});
    return;
  }
  if (HAM.incoming) {
    union[field] = value;
    state_ify(union, field, is);
    return;
  }
  if (HAM.defer) {// TODO: BUG! Not implemented.
    /*upper.wait = true;
    opt.upper.call(state, vertex, field, incoming, ctx.incoming.state); // signals that there are still future modifications.
    Gun.schedule(ctx.incoming.state, function(){
      update(incoming, field);
      if(ctx.incoming.state === upper.max){ (upper.last || function(){})() }
    }, gun.__.opt.state);*/
  }
}
_gun2.default.HAM.union = function (vertex, node, opt) {
  if (!node || !vertex || !node._ || !vertex._) {
    return;
  }
  opt = num_is(opt) ? { machine: opt } : { machine: +new Date() };
  opt.union = _gun2.default.obj.copy(vertex);
  opt.vertex = vertex;
  opt.node = node;
  obj_map(node._, meta, opt.union);
  if (obj_map(node, map, opt)) {
    // if this returns true then something was invalid.
    return;
  }
  return opt.union;
};
var Type = _gun2.default;
var num = Type.num,
    num_is = num.is;
var obj = Type.obj,
    obj_has = obj.has,
    obj_put = obj.put,
    obj_map = obj.map;
var node = _gun2.default.node,
    node_soul = node.soul,
    node_is = node.is,
    node_ify = node.ify;
var state = _gun2.default.state,
    state_is = state.is,
    state_ify = state.ify;
var val = _gun2.default.val,
    val_is = val.is,
    rel_is = val.rel.is;
var u;

exports.default = _gun2.default;