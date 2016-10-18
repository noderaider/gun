import Gun from '../'
if(typeof window === 'object') {
  if(typeof JSON === 'undefined')
    throw new Error('Include JSON first: ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js') // for old IE use

  const noop = () => {}
  let root
  if(typeof window !== 'undefined')
    root = window

  var Tab = {}
  Tab.on = Gun.on//Gun.on.create();
  Tab.peers = require('../polyfill/peer')
  Gun.on('get', function(at){
    var gun = at.gun, opt = gun.Back('opt') || {}, peers = opt.peers
    if(!peers || Gun.obj.empty(peers)){
      //setTimeout(function(){
      Gun.log.once('peers', 'Warning! You have no peers to connect to!')
      at.gun.Back(-1).on('in', { '@': at['#'] })
      //},100);
      return
    }
    var msg = {
      '#': at['#'] || Gun.text.random(9) // msg ID
      , '$': at.get // msg BODY
    }
    Tab.on(msg['#'], function(err, data){ // TODO: ONE? PERF! Clear out listeners, maybe with setTimeout?
      if(data){
        at.gun.Back(-1).on('out', { '@': at['#'], err: err, put: data })
      } else {
        at.gun.Back(-1).on('in', { '@': at['#'], err: err, put: data })
      }
    })
    Tab.peers(peers).send(msg, { headers: { 'gun-sid': Tab.server.sid } })
  })
  Gun.on('put', function(at){
    if(at['@']){ return }
    var opt = at.gun.Back('opt') || {}, peers = opt.peers
    if(!peers || Gun.obj.empty(peers)){
      Gun.log.once('peers', 'Warning! You have no peers to save to!')
      at.gun.Back(-1).on('in', { '@': at['#'] })
      return
    }
    if(false === opt.websocket || (at.opt && false === at.opt.websocket)){ return }
    var msg = {
      '#': at['#'] || Gun.text.random(9) // msg ID
      , '$': at.put // msg BODY
    }
    Tab.on(msg['#'], function(err, ok){ // TODO: ONE? PERF! Clear out listeners, maybe with setTimeout?
      at.gun.Back(-1).on('in', { '@': at['#'], err: err, ok: ok })
    })
    Tab.peers(peers).send(msg, { headers: { 'gun-sid': Tab.server.sid } })
  })
  // browser/client side Server!
  Gun.on('opt', function(at){ // TODO: BUG! Does not respect separate instances!!!
    if(Tab.server){ return }
    var gun = at.gun, server = Tab.server = {}, tmp
    server.sid = Gun.text.random()
    Tab.peers.request.createServer(function(req, res){
      if(!req || !res || !req.body || !req.headers){ return }
      var msg = req.body
      // AUTH for non-replies.
      if(server.msg(msg['#'])){ return }
      //server.on('network', Gun.obj.copy(req)); // Unless we have WebRTC, not needed.
      if(msg['@']){ // no need to process.
        if(Tab.ons[tmp = msg['@'] || msg['#']]){
          Tab.on(tmp, [ msg['!'], msg['$'] ])
        }
        return
      }
      if(msg['$'] && msg['$']['#']){ return server.get(req, res) }
      else { return server.put(req, res) }
    })
    server.get = function(req, cb){
      var body = req.body, lex = body['$'], opt
      var graph = gun._.root._.graph, node
      if(!(node = graph[lex['#']])){ return } // Don't reply to data we don't have it in memory. TODO: Add localStorage?
      cb({ body: {
        '#': server.msg()
        , '@': body['#']
        , '$': node
      } })
    }
    server.put = function(req, cb){
      var body = req.body, graph = body['$']
      var __ = gun._.root._
      if(!(graph = Gun.obj.map(graph, function(node, soul, map){ // filter out what we don't have in memory.
        if(!__.path[soul]){ return }
        map(soul, node)
      }))){ return }
      gun.on('out', { gun: gun, opt: { websocket: false }, put: graph, '#': Gun.on.ask(function(ack, ev){
        if(!ack){ return }
        ev.off()
        return cb({ body: {
          '#': server.msg()
          , '@': body['#']
          , '$': ack
          , '!': ack.err
        } })
      }) })
    }
    server.msg = function(id){
      if(!id){
        return server.msg.debounce[id = Gun.text.random(9)] = Gun.time.is(), id
      }
      clearTimeout(server.msg.clear)
      server.msg.clear = setTimeout(function(){
        var now = Gun.time.is()
        Gun.obj.map(server.msg.debounce, function(t, id){
          if((now - t) < (1000 * 60 * 5)){ return }
          Gun.obj.del(server.msg.debounce, id)
        })
      }, 500)
      if(server.msg.debounce[id]){
        return server.msg.debounce[id] = Gun.time.is(), id
      }
      server.msg.debounce[id] = Gun.time.is()
      return
    }
    server.msg.debounce = server.msg.debounce || {}
  })
}
