import request from './request'

function P(p){
  if(!P.is(this)){ return new P(p) }
  this.peers = p
}
P.request = require('./request')
P.is = function(p){ return (p instanceof P) }
P.chain = P.prototype
function map(peer, url){
  var msg = this.msg
  var opt = this.opt || {}
  opt.out = true
  P.request(url, msg, null, opt)
}
P.chain.send = function(msg, opt){
  P.request.each(this.peers, map, { msg: msg, opt: opt })
}
export default P
