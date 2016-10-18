import Type from './type'
import Node from './node'

function State(){
  var t = time()
  if(last < t){
    n = 0
    return last = t
  }
  return last = t + ((n += 1) / d)
}
State._ = '>'
var time = Type.time.is, last = -Infinity, n = 0, d = 1000
State.ify = function(n, f, s){ // put a field's state on a node.
  if(!n || !n[N_]){ return } // reject if it is not node-like.
  var tmp = obj_as(n[N_], State._) // grab the states data.
  if(u !== f && num_is(s)){ tmp[f] = s } // add the valid state.
  return n
}
State.is = function(n, f){ // convenience function to get the state on a field on a node and return it.
  var tmp = f && n && n[N_] && n[N_][State._]
  if(!tmp){ return }
  return num_is(tmp[f])? tmp[f] : -Infinity
}
;(function(){
  State.map = function(cb, s, as) {
    let u // for use with Node.ify
    let o = obj_is(o = cb || s)? o : null
    cb = fn_is(cb = cb || s)? cb : null
    if(o && !cb) {
      s = num_is(s)? s : State()
      o[N_] = o[N_] || {}
      obj_map(o, map, { o: o, s: s })
      return o
    }
    as = as || obj_is(s)? s : u
    s = num_is(s)? s : State()
    return function(v, f, o, opt) {
      if(!cb){
        map.call({ o: o, s: s }, v, f)
        return v
      }
      cb.call(as || this || {}, v, f, o, opt)
      if(obj_has(o, f) && u === o[f]){ return }
      map.call({ o: o, s: s }, v, f)
    }
  }
  function map(v, f){
    if(N_ === f)
      return
    State.ify(this.o, f, this.s)
  }
}())
var obj = Type.obj, obj_as = obj.as, obj_has = obj.has, obj_is = obj.is, obj_map = obj.map
var num = Type.num, num_is = num.is
var fn = Type.fn, fn_is = fn.is
var N_ = Node._, u
export default State
