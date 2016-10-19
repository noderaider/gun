import Type from './Type'
import HAM from './HAM'
import Val from './Val'
import Node from './node'
import State from './State'
import Graph from './Graph'
import Chain from './Chain'
import api from './api'

function Gun(o) {
  if(!(this instanceof Gun))
    return Gun.create(o)
  this._ = { gun: this }
  /*
  this._opt = o
  this.opt = (_o) => this._opt = _o
  */
}

Gun.create = function(o) {
  return new Gun().opt(o)
}

Gun._ = { // some reserved key words, these are not the only ones.
  meta: '_' // all metadata of the node is stored in the meta property on the node.
  , soul: '#' // a soul is a UUID of a node but it always points to the "latest" data known.
  , field: '.' // a field is a property on a node which points to a value.
  , state: '>' // other than the soul, we store HAM metadata.
  , value: '=' // the primitive value.
}

Gun.__ = {
  '_': 'meta'
  , '#': 'soul'
  , '.': 'field'
  , '=': 'value'
  , '>': 'state'
}

Gun.version = 0.4

Gun.is = function(gun){ return (gun instanceof Gun) } // check to see if it is a GUN instance.

Type.obj.map(Type, function(v, f){
  Gun[f] = v
})
Gun.HAM = HAM
Gun.val = Val
Gun.node = Node
Gun.state = State
Gun.graph = Graph

Gun.on = Chain.apply(Gun.prototype)
/*
var opt = {chain: 'in', back: 'out', extend: 'root', id: Gun._.soul};
Gun.chain = require('./chain')(Gun, opt);
Gun.chain.chain.opt = opt;
*/
//Gun.chain = Gun.prototype
/*
Gun.prototype.chain = function(...args) {
  return Chain.apply(this, args)
}
*/
/*
function (...args) {
  return Chain.apply(this, args)
}
*/
;(Gun.chain = Gun.prototype).chain = function(){
  let chain = new this.constructor()
  let _ = chain._ || (chain._ = {})
  _.root = this._.root
  _.back = this
  return chain
}
Gun.chain.toJSON = function(){}
Gun.chain.opt = function(opt) {
  opt = opt || {}
  let gun = this
  let at = gun._
  let tmp
  let u
  if(!at.root)
    root(at)
  at.opt = at.opt || {}
  if(text_is(opt))
    opt = { peers: opt }
  else if(list_is(opt))
    opt = { peers: opt }
  if(text_is(opt.peers))
    opt.peers = [ opt.peers ]
  if(list_is(opt.peers))
    opt.peers = obj_map(opt.peers, function(n, f, m){m(n, {})})
  obj_map(opt, function map(v, f) {
    if(obj_is(v)){
      console.info('OBJ_MAP', this, v, f, map)
      obj_map(v, map, this[f] || (this[f] = {})) // TODO: Bug? Be careful of falsey values getting overwritten?
      return
    }
    this[f] = v
  }, at.opt)
  Gun.on('opt', at)
  return gun
}
function root(at){
  var gun = at.gun
  at.root = gun
  at.graph = {}
  gun.on('in', input, at)
  gun.on('out', output, at)
}
function output(at){
  var cat = this, gun = cat.gun, tmp
  if(at.put)
    cat.on('in', obj_to(at, { gun: cat.gun }))
  if(!at.gun)
    at = Gun.obj.to(at, { gun: gun })
  if(at.put)
    Gun.on('put', at)
  if(at.get)
    get(at, cat)
  Gun.on('out', at)
  if(!cat.back)
    return
  cat.back.on('out', at)
}
function get(at, cat){
  var soul = at.get[_soul], node = cat.graph[soul], field = at.get[_field]
  if(node && (!field || obj_has(node, field))){
    // TODO: BUG!!! Shouldn't this ack?????
    if(field)
      node = Gun.obj.put({ _: node._ }, field, node[field])
    cat.on('in'
    , { '@': at.req? at['#'] : 0 // temporary hack
      , put: Gun.graph.node(node) // TODO: BUG! Clone node!
      }
    )
    return
  }
  Gun.on('get', at)
}
function input(at) {
  let cat = this
  if(at['@'] || at.err || u === at.put){
    at.gun = at.gun || cat.gun
    Gun.on.ack(at['@'], at)
    return
  }
  if(cat.graph)
    Gun.obj.map(at.put, ham, { at: at, cat: this }) // all unions must happen first, sadly.
  Gun.obj.map(at.put, map, { at: at, cat: this })
}
function ham(data, key){
  var cat = this.cat, graph = cat.graph
  graph[key] = Gun.HAM.union(graph[key] || data, data) || graph[key]
}
function map(data, key){
  var cat = this.cat, graph = cat.graph, path = cat.path || (cat.path = {}), gun, at
  gun = path[key] || (path[key] = cat.gun.get(key));
  (at = gun._).change = data
  if(graph)
    data = graph[key] // TODO! BUG/PERF! COPY!?
  at.put = data
  gun.on('in', {
    put: data
    , get: key
    , gun: gun
    , via: this.at
  })
}
var text = Type.text, text_is = text.is, text_random = text.random
var list = Type.list, list_is = list.is
var obj = Type.obj, obj_is = obj.is, obj_has = obj.has, obj_to = obj.to, obj_map = obj.map
var _soul = Gun._.soul, _field = Gun._.field
export default api(Gun)
