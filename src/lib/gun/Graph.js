import Type from './Type'
import Val from './Val'
import Node from './node'
const Graph = {}

  Graph.is = function(g, cb, fn, as){ // checks to see if an object is a valid graph.
    if(!g || !obj_is(g) || obj_empty(g)){ return false } // must be an object.
    return !obj_map(g, map, { fn: fn, cb: cb, as: as }) // makes sure it wasn't an empty object.
  }
  function nf(fn){ // optional callback for each node.
    if(fn){ Node.is(nf.n, fn, nf.as) } // where we then have an optional callback for each field/value.
  }
  function map(n, s){ // we invert this because the way we check for this is via a negation.
    if(!n || s !== Node.soul(n) || !Node.is(n, this.fn)){ return true } // it is true that this is an invalid graph.
    if(!fn_is(this.cb)){ return }
    nf.n = n; nf.as = this.as
    this.cb.call(nf.as, n, s, nf)
  }
  Graph.ify = function(obj, env, as){
    let at = { path: [], obj: obj }
    if(!env)
      env = {}
    else if(typeof env === 'string')
      env = { soul: env }
    else if(env instanceof Function)
      env.map = env
    if(env.soul)
      at.rel = Val.rel.ify(env.soul)
    env.graph = env.graph || {}
    env.seen = env.seen || []
    env.as = env.as || as
    node(env, at)
    env.root = at.node
    return env.graph
  }
  function node(env, at) {
    let tmp
    if(tmp = seen(env, at))
      return tmp
    at.env = env
    at.soul = soul
    if(Node.ify(at.obj, map, at)) {
      at.rel = at.rel || Val.rel.ify(Node.soul(at.node))
      env.graph[Val.rel.is(at.rel)] = at.node
    }
    return at
  }
  function map(v, f, n){
    var at = this, env = at.env, is, tmp
    if(Node._ === f && obj_has(v, Val.rel._)){
      return n._ // TODO: Bug?
    }
    if(!(is = valid(v, f, n, at, env))){ return }
    if(!f){
      at.node = at.node || n || {}
      if(obj_has(v, Node._)){
        at.node._ = Gun.obj.copy(v._)
      }
      at.node = Node.soul.ify(at.node, Val.rel.is(at.rel))
    }
    if(tmp = env.map){
      tmp.call(env.as || {}, v, f, n, at)
      if(obj_has(n, f)){
        v = n[f]
        if(u === v){
          obj_del(n, f)
          return
        }
        if(!(is = valid(v, f, n, at, env))){ return }
      }
    }
    if(!f){ return at.node }
    if(true === is){
      return v
    }
    tmp = node(env, { obj: v, path: at.path.concat(f) })
    if(!tmp.node){ return }
    return tmp.rel //{'#': Node.soul(tmp.node)};
  }
  function soul(id) {
    let at = this
    let prev = Val.rel.is(at.rel), graph = at.env.graph
    at.rel = at.rel || Val.rel.ify(id)
    at.rel[Val.rel._] = id
    if(at.node && at.node[Node._]){
      at.node[Node._][Val.rel._] = id
    }
    if(obj_has(graph, prev)){
      graph[id] = graph[prev]
      obj_del(graph, prev)
    }
  }
  function valid(v, f, n, at, env) {
    let tmp
    if(Val.is(v)){ return true }
    if(obj_is(v)){ return 1 }
    if(tmp = env.invalid){
      v = tmp.call(env.as || {}, v, f, n)
      return valid(v, f, n, at, env)
    }
    env.err = 'Invalid value at \'' + at.path.concat(f).join('.') + '\'!'
  }
  function seen(env, at){
    let arr = env.seen
    let i = arr.length
    let has
    while(i--) {
      has = arr[i]
      if(at.obj === has.obj)
        return has
    }
    arr.push(at)
  }
Graph.node = function(node){
  var soul = Node.soul(node)
  if(!soul){ return }
  return obj_put({}, soul, node)
}
  Graph.to = function(graph, root, opt){
    if(!graph){ return }
    var obj = {}
    opt = opt || { seen: {} }
    obj_map(graph[root], map, { obj: obj, graph: graph, opt: opt })
    return obj
  }
  function map(v, f) {
    let tmp
    let obj
    if(Node._ === f) {
      if(obj_empty(v, Val.rel._))
        return
      this.obj[f] = obj_copy(v)
      return
    }
    if(!(tmp = Val.rel.is(v))) {
      this.obj[f] = v
      return
    }
    if(obj = this.opt.seen[tmp]) {
      this.obj[f] = obj
      return
    }
    this.obj[f] = this.opt.seen[tmp] = Graph.to(this.graph, tmp, this.opt)
  }
var fn_is = Type.fn.is
var obj = Type.obj, obj_is = obj.is, obj_del = obj.del, obj_has = obj.has, obj_empty = obj.empty, obj_put = obj.put, obj_map = obj.map, obj_copy = obj.copy

export default Graph
