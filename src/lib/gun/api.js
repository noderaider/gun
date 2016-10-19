function applyBack (Gun) {
  let obj = {}
  let u
  Gun.chain.Back = function(n, opt) {
    let tmp
    if(-1 === n || Infinity === n)
      return this._.root
    else if(1 === n)
      return this._.back
    let gun = this
    let at = gun._
    if(typeof n === 'string')
      n = n.split('.')
    if(n instanceof Array){
      let i = 0
      let l = n.length
      let tmp = at
      for(i; i < l; i++){
        tmp = (tmp||obj)[n[i]]
      }
      if(u !== tmp)
        return opt ? gun : tmp
      else if(tmp = at.back)
        return tmp.Back(n, opt)
      return
    }
    if(n instanceof Function){
      let yes
      tmp = { _: { back: gun } }
      while((tmp = tmp._) && (tmp = tmp.back) && !(yes = n(tmp, opt))){}
      return yes
    }
  }
}

function applyPut (Gun) {
  Gun.chain.put = function(data, cb, opt, as){
    // TODO: BUG! Put probably cannot handle plural chains!
    var gun = this, root = gun.Back(-1), tmp
    opt = (opt && typeof opt === 'string')? { soul: opt } : opt || {}
    as = as || { opt: opt, soul: opt.soul }
    as.gun = gun
    as.data = data
    opt.any = opt.any || cb
    if(root === gun || as.soul){
      if(!obj_is(as.data)){
        (opt.any||noop).call(opt.as || gun, as.out = { err: Gun.log('No field to put', (typeof as.data), '"' + as.data + '" on!') })
        if(as.res){ as.res() }
        return gun
      }
      if(!as.soul){
        if(opt.init || as.gun.Back('opt.init')){
          return gun
        }
      }
      as.gun = gun = root.get(as.soul = as.soul || (as.not = Gun.node.soul(as.data) || (opt.uuid || root.Back('opt.uuid') || Gun.text.random)()))
      as.ref = as.ref || as.gun
      ify(as)
      return gun
    }
    if(Gun.is(data)){
      data.any(function(e, d, k, at, ev){
        ev.off()
        var s = Gun.node.soul(d)
        if(!s){Gun.log('Can only save a node, not a property.');return}
        gun.put(Gun.val.rel.ify(s), cb, opt)
      })
      return gun
    }
    as.ref = as.ref || (root === (tmp = gun.Back(1)))? gun : tmp
    as.ref.any(any, { as: as, '.': null })
    if(!as.out){
      as.res = as.res || Gun.on.stun(as.ref)
      as.gun._.stun = as.ref._.stun // TODO: BUG! These stuns need to be attached all the way down, not just one level.
    }
    return gun
  }

  function ify(as){
    as.batch = batch
    var opt = as.opt, env = as.env = Gun.state.map(map, opt.state)
    env.soul = as.soul
    as.graph = Gun.graph.ify(as.data, env, as)
    if(env.err){
      (opt.any||noop).call(opt.as || as.gun, as.out = { err: Gun.log(env.err) })
      if(as.res){ as.res() }
      return
    }
    as.batch()
  }

  function batch() {
    var as = this
    if(!as.graph || obj_map(as.stun, no)){ return }
    as.ref.on('out'
      , { gun: as.ref
        , put: as.out = as.env.graph
        , opt: as.opt
        , '#': Gun.on.ask(function(ack, ev){
          if(ack && 0 === ack.ok){ return }
          ev.off() // One response is good enough for us currently. Later we may want to adjust this.
          if(!as.opt.any){ return }
          as.opt.any.call(as.opt.as || as.gun, ack.err, ack.ok)
        }
      , as.opt
      )
    })
    if(as.res){ as.res() }
  } function no(v, f){ if(v){ return true } }

  function map(v, f, n, at) {
    var as = this
    if(f || !at.path.length){ return }
    var path = at.path, ref = as.ref, opt = as.opt
    var i = 0, l = path.length
    for(i; i < l; i++){
      ref = ref.get(path[i], null, { path: true }) // TODO: API change! We won't need 'path: true' anymore.
    }
    if(as.not || Gun.node.soul(at.obj)){
      at.soul(Gun.node.soul(at.obj) || (as.opt.uuid || as.gun.Back('opt.uuid') || Gun.text.random)())
      return
    }
    (as.stun = as.stun || {})[path] = true
    if(as.res){
      as.res(1)
    }
    ref.any(soul, { as: { at: at, as: as }, '.': null })
  }

  function soul(at, ev) {
    var as = this.as, cat = this.at
    ev.stun() // TODO: BUG!?
    ev.off()
    cat.soul(Gun.node.soul(cat.obj) || Gun.node.soul(at.put) || Gun.val.rel.is(at.put) || (as.opt.uuid || as.gun.Back('opt.uuid') || Gun.text.random)()) // TODO: BUG!? Do we really want the soul of the object given to us? Could that be dangerous?
    as.stun[cat.path] = false
    as.batch()
  }

  function any(at, ev) {
    function implicit(at){ // TODO: CLEAN UP!!!!!
      if(!at || !at.get){ return } // TODO: CLEAN UP!!!!!
      as.data = obj_put({}, tmp = at.get, as.data) // TODO: CLEAN UP!!!!!
      at = at.via // TODO: CLEAN UP!!!!!
      if(!at){ return } // TODO: CLEAN UP!!!!!
      tmp = at.get // TODO: CLEAN UP!!!!!
      if(!at.via || !at.via.get){ return } // TODO: CLEAN UP!!!!!
      implicit(at)  // TODO: CLEAN UP!!!!!
    } // TODO: CLEAN UP!!!!!
    var as = this
    if(at.err) {
      console.log('Please report this as an issue! Put.any.err')
      return
    }
    var cat = as.ref._, data = at.put, opt = as.opt, root, tmp
    if(u === data) {
      if(opt.init || as.gun.Back('opt.init'))
        return
      /*
        TODO: THIS WHOLE SECTION NEEDS TO BE CLEANED UP!
        Implicit behavior should be much cleaner. Right no it is hacky.
      */
      // TODO: BUG!!!!!!! Apparently Gun.node.ify doesn't produce a valid HAM node?
      if(as.ref !== as.gun){ // TODO: CLEAN UP!!!!!
        tmp = as.gun._.get // TODO: CLEAN UP!!!!!
        if(!tmp){ return } // TODO: CLEAN UP!!!!!
        as.data = obj_put({}, tmp, as.data)
        tmp = u
      }
      if(as.gun.Back(-1) !== cat.back)
        implicit(at)
      tmp = tmp || at.get
      any.call(as, {
        put: as.data
        , get: as.not = as.soul = tmp
      }, ev)
      return
    }
    ev.off(ev.stun())
    if(!as.not && !(as.soul = Gun.node.soul(data))){
      if(as.path && obj_is(as.data)){ // Apparently necessary
        as.soul = (opt.uuid || as.gun.Back('opt.uuid') || Gun.text.random)()
      } else {
        /*
          TODO: CLEAN UP! Is any of this necessary?
        */
        if(!at.get){
          console.log('Please report this as an issue! Put.any.no.soul')
          return
        }
        (as.next = as.next || Gun.on.next(as.ref))(function(next){
          // TODO: BUG! Maybe don't go back up 1 because .put already does that if ref isn't already specified?
          (root = as.ref.Back(1)).put(data = obj_put({}, at.get, as.data), opt.any, opt, {
            opt: opt
            , ref: root
          })
          //Gun.obj.to(opt, {
          //  ref: null,
          //  gun: null,
          //  next: null,
          //  data: data
          //}));
          //next(); // TODO: BUG! Needed? Not needed?
        })
        return
      }
    }
    if(as.ref !== as.gun && !as.not) {
      tmp = as.gun._.get
      if(!tmp){
        console.log('Please report this as an issue! Put.no.get') // TODO: BUG!??
        return
      }
      as.data = obj_put({}, tmp, as.data)
    }
    as.ref.put(as.data, opt.any, opt, as)
  }
  var obj = Gun.obj, obj_has = obj.has, obj_put = obj.put
  var u, noop = function(){}

}




function applyGet (Gun) {
  Gun.chain.get = function(lex, cb, opt){
    if(!opt || !opt.path){ var back = this.Back(-1) } // TODO: CHANGING API! Remove this line!
    var gun, back = back || this, cat = back._
    var path = cat.path || empty, tmp
    if(typeof lex === 'string'){
      if(!(gun = path[lex])){
        gun = cache(lex, back)
      }
    } else
    if(!lex && 0 != lex){
      (gun = back.chain())._.err = { err: Gun.log('Invalid get request!', lex) }
      if(cb){ cb.call(gun, gun._.err) }
      return gun
    } else
    if(num_is(lex)){
      return back.get(''+lex, cb, opt)
    } else
    if(tmp = lex.soul){
      if(!(gun = path[tmp])){
        gun = cache(tmp, back)
      }
      if(tmp = lex.field){
        (opt = opt || {}).path = true
        return gun.get(tmp, cb, opt)
      }
    } else
    if(tmp = lex[_soul]){
      if(!(gun = path[tmp])){
        gun = cache(tmp, back)
      }
      if(tmp = lex[_field]){
        (opt = opt || {}).path = true
        return gun.get(tmp, cb, opt)
      }
    }
    if(tmp = cat.stun){
      gun._.stun = gun._.stun || tmp
    }
    if(cb && cb instanceof Function){
      ((opt = opt || {}).gun = opt.gun || gun).any(cb, opt)
    }
    return gun
  }
  function cache(key, back){
    var cat = back._, path = cat.path, gun = back.chain(), at = gun._
    if(!path){ path = cat.path = {} }
    path[at.get = key] = gun
    at.stun = at.stun || cat.stun // TODO: BUG! Clean up! This is kinda ugly. These need to be attached all the ay down regardless of whether a gun chain has been cached or not for the first time.
    Gun.on('path', at)
    //gun.on('in', input, at); // For 'in' if I add my own listeners to each then I MUST do it before in gets called. If I listen globally for all incoming data instead though, regardless of individual listeners, I can transform the data there and then as well.
    gun.on('out', output, at) // However for output, there isn't really the global option. I must listen by adding my own listener individually BEFORE this one is ever called.
    return gun
  }
  function output(at){
    var cat = this, gun = cat.gun, root = gun.Back(-1), put, get, tmp
    if(!at.gun){
      at.gun = gun
    }
    console.debug(10, 'out', cat.get, at.get)
    if(at.get && !at.get[_soul]){
      if(typeof at.get === 'string'){ // request for soul!
        if(cat.ask){
          if(cat.ask[at.get]){
            return
          }
          cat.ask[at.get] = at['#'] || 1
          cat.on('in', function(tac, ev) {
            ev.off()
            var tmp = tac.put
            if(tmp && u !== tmp[at.get] && (tmp = (cat.path||empty)[at.get])){
              tmp = tmp._
              tmp.change = tac.put[at.get]
              tmp.put = tac.put[at.get]
              // TODO: Could we pass it to input/map function since they already do this?
              tmp.on('in', {
                get: at.get
                , put: tac.put[at.get]
                , gun: tmp.gun
                , via: tac
              })
              return
            }
            if(!(tmp = Gun.node.soul(tmp = tac.put) || Gun.val.rel.is(tmp))){
              tmp = (cat.path||empty)[at.get]
              if(!tmp){ return }
              tmp.on('in', { get: at.get, gun: tmp, via: tac })
              return
            }
            cat.ask[at.get] = 0
            tmp = { '#': tmp, '.': at.get }
            tmp = { gun: at.gun, get: tmp }
            tmp['#'] = Gun.on.ask(ack, tmp)
            at.gun.on('out', tmp)
          }).off()
          return
        }
        cat.ask = obj_put({}, at.get, at['#'] || 1)
        gun.on('in', input, cat)
        if(root === cat.back){
          cat.ask[at.get] = 0
          tmp = { '#': cat.get, '.': at.get }
          tmp = { gun: at.gun, get: tmp }
          tmp['#'] = Gun.on.ask(ack, tmp)
          at.gun.on('out', tmp)
          return
        }
        console.debug(7, 'out', cat.get, at.get, cat.ask)
        cat.back.on('out', {
          gun: cat.gun
          , get: cat.get
        })
        return
      } else
      if(at.get instanceof Function) {
        if(!cat.ask){
          var opt = at.opt || {}
          tmp = obj_has(opt, '.') // TODO: CLEAN UP!
          cat.ask = tmp? {} : { _: 1 } // TODO: CLEAN UP!
          gun.on('in', input, cat)
          if(root === cat.back){
            if(cat.ask && cat.ask._){ cat.ask._ = 0 } // TODO: CLEAN UP!
            if(tmp && opt['.']){ cat.ask[opt['.']] = 0 } // TODO: CLEAN UP!
            tmp = tmp? { '#': cat.get, '.': opt['.'] } : { '#': cat.get } // TODO: CLEAN UP!
            tmp = { gun: at.gun, get: tmp }
            tmp['#'] = Gun.on.ask(ack, tmp)
            cat.back.on('out', tmp)
          } else {
            console.debug(6, 'out', cat.get)
            cat.back.on('out', {
              gun: cat.gun
              , get: cat.get
            })
          }
        }
        console.debug(9, 'out', cat.get)
        if(cat.stun && cat.stun(at)){ return }
        gun.on('in', at.get, at)
        return
      }
    }
    cat.back.on('out', at)
  }
  function input(at, ev) {
    var cat = this, tmp
    cat.id = cat.id || Gun.text.random(5) // TOD: BUG! This allows for 1B item entropy in memory. In the future, people might want to expand this to be larger.
    if(at.err){
      console.log('Please report this as an issue! In.err') // TODO: BUG!
      return
    }
    console.debug(10, 'input', at, cat.get)
    if(value.call(cat, at, ev))
      return
    if(tmp = cat.link){
      if(tmp = tmp.res){
        // TODO: BUG! Ordering of the change set? What if the proxied object has a change but the parent has a happened too. Pretend that the parent changed the field such that it no longer point to the proxy. But in the changeset it might get iterated over last, thus it the update will get triggered here now for the proxy, even though this update is suppose to unsubscribe itself. Or what if this ordering is inconsistent? Or is this just basically impossible from the API's put perspective?
        tmp(cat) // TODO: BUG! What about via? Do we need to clone this?
      }
    }
    obj_map(cat.change, map, { at: at, cat: cat })
  }
  Gun.chain.get.input = input
  function value(at, ev){
    //var cat = this, is = (u === at.put) || Gun.val.is(at.put), rel = Gun.val.rel.is(at.put), tmp, u;
    var cat = this, put = cat.change, rel, tmp, u
    if(u === put){
      not(cat, at)
      return true
    }
    if(!cat.link && Gun.node.soul(put) && (rel = Gun.node.soul(at.put))) {
      console.debug(11, 'value', put)
      ask(cat, rel)
      return false
    }
    if(!(rel = Gun.val.rel.is(put))){
      if(!Gun.val.is(put))
        return false
      not(cat, at)
      return true
    }
    //cat.change = at.put;
    if(cat.link){
      if(rel === cat.link.rel){
        ev.stun()
        tmp = cat.link.ref._
        cat.change = tmp.change
        cat.put = at.put = tmp.put // TODO: BUG! Mutating at event? Needed for certain tests, but is this bad?
        return false
      }
      not(cat, at)
    }
    tmp = ev.stun(tmp)
    //cat.put = u; // For performance sake, do this now to prevent `.val` from firing.
    tmp = cat.link = { rel: rel, ref: cat.gun.Back(-1).get(rel), res: tmp, as: cat }
    // TODO: BUG???? Below allows subscriptions to happen without the soul itself being subscribed. Will this cause problems? I think it should be okay. Not sure what test is necessary.
    tmp.sub = tmp.ref._.on('in', proxy, tmp) // TODO: BUG! If somebody does `.off` how do we clean up these things from memory?
    if(tmp.ran){ return }
    ask(cat, rel)
    if(!tmp.ran)
      tmp.res() // This is necessary for things that listen for a soul or relation only.
    return true
  }
  function map(data, key){ // Map over only the changes on every update.
    if(Gun._.meta === key){ return }
    var cat = this.cat, path = cat.path || {}, gun, at, tmp
    if(!(gun = path[key])){ return }
    if(cat.put && obj_has(cat.put, key)){ data = cat.put[key] } // But use the actual data.
    (at = gun._).change = cat.change[key]
    at.put = data
    if(tmp = Gun.val.rel.is(at.put)){ // PERFORMANCE HACK!
      if(tmp = gun.Back(-1).get(tmp)._.put){ // PERFORMANCE HACK!
        at.put = data = tmp // PERFORMANCE HACK!
      }
    }
    gun.on('in', {
      put: data
      , get: key
      , gun: gun
      , via: this.at
    })
  }
  function not(cat, at){
    var tmp, u
    tmp = cat.link
    if(u !== cat.put){ cat.link = null } // TODO: BUG! This may mean `not` will be fired multiple times until data is found. Is this okay?
    if(null === tmp){ return }
    if(tmp){
      if(tmp.sub){
        tmp.sub.off()
      }
      tmp.sub = false
    }
    obj_map(cat.ask, function(v, key){
      cat.ask[key] = 1
      if(!(v = (cat.path||empty)[key])){ return }
      (tmp = v._).put = tmp.change = u
      v.on('in', { get: key, put: u, gun: v, via: at })
    })
  }
  function ask(cat, soul){
    if(!cat.ask){ return }
    var tmp = cat.ask, lex
    if(obj_has(tmp, '_')){
      if(!tmp._){ return }
      tmp._ = 0
      lex = { gun: cat.gun, get: { '#': soul } }
      lex['#'] = Gun.on.ask(ack, lex)
      cat.gun.on('out', lex)
      return
    }
    // TODO: PERF! Make it so we do not have to iterate through this every time?
    obj_map(tmp, function(v, key){
      if(!v || (cat.put && cat.put[key])){ return } // TODO: This seems like an optimization? But does it have side effects? Probably not without the tmp[key] = 0;
      if(!(v = (cat.path||empty)[key])){ return }
      tmp[key] = 0
      lex = { gun: v, get: { '#': soul, '.': key } }
      lex['#'] = Gun.on.ask(ack, lex)
      v.on('out', lex)
    })
  }
  function proxy(at, ev) {
    var link = this
    link.ran = true
    if(false === link.sub){ return ev.off() } // will this auto clean itself up?
    link.as.change = link.ref._.change
    link.as.put = at.put
    input.call(link.as, at, ev) // TODO: BUG! What about via? Do we need to clone this?
  }
}




function applyKey (Gun) {
  let obj = Gun.obj
  let obj_has = obj.has
  let obj_to = obj.to
  let empty = {}
  let u

  Gun.chain.key = function(index, cb, opt){
    let _soul = Gun._.soul
    let _field = Gun._.field
    let _sid = Gun.on.ask._
    let _rid = Gun.on.ack._
    if(!index){
      if(cb){
        cb.call(this, { err: Gun.log('No key!') })
      }
      return this
    }
    var gun = this
    if(typeof opt === 'string'){
      console.log('Please report this as an issue! key.opt.string')
      return gun
    }
    if(gun === gun._.root){if(cb){cb({ err: Gun.log('Can\'t do that on root instance.') })}return gun}
    opt = opt || {}
    opt.key = index
    opt.any = cb || function(){}
    opt.ref = gun.Back(-1).get(opt.key)
    opt.gun = opt.gun || gun
    gun.on(key, { as: opt })
    if(!opt.data){
      opt.res = Gun.on.stun(opt.ref)
    }
    return gun
  }
  function key(at, ev) {
    var opt = this
    ev.off()
    opt.soul = Gun.node.soul(at.put)
    if(!opt.soul || opt.key === opt.soul){ return opt.data = {} }
    opt.data = obj_put({}, keyed._, Gun.node.ify(obj_put({}, opt.soul, Gun.val.rel.ify(opt.soul)), '#'+opt.key+'#'))
    if(opt.res)
      opt.res(1)
    opt.ref.put(opt.data, opt.any, { soul: opt.key, key: opt.key })
    if(opt.res)
      opt.res()
  }
  function keyed(f){
    if(!f || !('#' === f[0] && '#' === f[f.length-1])){ return }
    var s = f.slice(1, -1)
    if(!s){ return }
    return s
  }
  keyed._ = '##'
  Gun.on('path', function(at){
    var gun = at.gun
    if(gun.Back(-1) !== at.back){ return }
    gun.on('in', pseudo, gun._)
    gun.on('out', normalize, gun._)
  })
  function normalize(at) {
    var cat = this
    if(!at.put) {
      if(at.get)
        search.call(cat, at)
      return
    }
    if(at.opt && at.opt.key)
      return
    var put = at.put, graph = cat.gun.Back(-1)._.graph
    Gun.graph.is(put, function(node, soul){
      if(!Gun.node.is(graph['#'+soul+'#'], function each(rel, id){
        if(id !== Gun.val.rel.is(rel)){ return }
        if(rel = graph['#'+id+'#']){
          Gun.node.is(rel, each)
          return
        }
        Gun.node.soul.ify(rel = put[id] = Gun.obj.copy(node), id)
      })){ return }
      Gun.obj.del(put, soul)
    })
  }
  function search(at) {
    var cat = this
    var tmp
    if(!Gun.obj.is(at.get)){ return }
    if(cat.pseudo){

    }
    if((tmp = at.opt) && (null === tmp['.'])){
      tmp['.'] = '##'
      return
    }
    if((tmp = at.get) && Gun.obj.has(tmp, '.')){
      tmp = at['#']
      at['#'] = Gun.on.ask(proxy)
    }
    var tried = {}
    function proxy(ack, ev){
      ev.off()
      var put = ack.put, lex = at.get
      if(!cat.pseudo){ return Gun.on.ack(tmp, ack) }
      if(ack.put){
        if(!lex['.']){
          return Gun.on.ack(tmp, ack)
        }
        if(obj_has(ack.put[lex['#']], lex['.'])){
          return Gun.on.ack(tmp, ack)
        }
      }
      Gun.obj.map(cat.seen, function(ref, id){ // TODO: BUG! In-memory versus future?
        if(tried[id]){
          return Gun.on.ack(tmp, ack)
        }
        tried[id] = true
        ref.on('out', {
          gun: ref
          , get: id = { '#': id, '.': at.get['.'] }
          , '#': Gun.on.ask(proxy)
        })
      })
    }
  }
  function pseudo(at, ev) {
    var cat = this
    if(cat.pseudo){
      ev.stun()
      if(cat.pseudo === at.put){ return }
      cat.change = cat.changed || cat.pseudo
      cat.on('in', Gun.obj.to(at, { put: cat.put = cat.pseudo }))
      return
    }
    if(!at.put){ return }
    var rel = Gun.val.rel.is(at.put[keyed._])
    if(!rel){ return }
    var soul = Gun.node.soul(at.put), resume = ev.stun(resume), root = cat.gun.Back(-1), seen = cat.seen = {}
    cat.pseudo = cat.put = Gun.state.ify(Gun.node.ify({}, soul))
    root.get(rel).on(each, true)
    function each(change){
      Gun.node.is(change, map)
    }
    function map(rel, soul){
      if(soul !== Gun.val.rel.is(rel)){ return }
      if(seen[soul]){ return }
      seen[soul] = root.get(soul).on(on, true)
    }
    function on(put){
      cat.pseudo = Gun.HAM.union(cat.pseudo, put) || cat.pseudo
      cat.change = cat.changed = put
      cat.put = cat.pseudo
      resume({
        gun: cat.gun
        , put: cat.pseudo
        , get: soul
        //via: this.at
      })
    }
  }


}


function applyMap (Gun) {
  let obj = Gun.obj
  let obj_has = obj.has
  Gun.chain.map = function(cb, opt, t){
    var gun = this, cat = gun._, chain = cat.map
    if(!chain){
      chain = cat.map = gun.chain()
      var list = (cat = chain._).list = cat.list || {}
      chain.on('in').map = {}
      chain.on('out', function(at){
        console.debug(8, 'map out', at)
        if(at.get instanceof Function){
          chain.on('in', at.get, at)
          return
        } else {
          console.debug(9, 'map out', at)
          chain.on('in', gun.get.input, at.gun._)
        }
      })
      if(opt !== false){
        gun.on(map, { change: true, as: cat })
        console.debug(1, 'map')
      }
    }
    if(cb){
      chain.on(cb)
    }
    return chain
  }
  function map(at, ev){
    var cat = this, gun = at.gun || this.back, tac = gun._
    obj_map(at.put, each, { gun: gun, cat: cat, id: tac.id||at.get })
  }
  function each(v, f){
    if(n_ === f){ return }
    var gun = this.gun, cat = this.cat, id = this.id
    if(cat.list[id+f]){ return }
    // TODO: BUG! Ghosting!
    cat.list[id+f] = gun.path(f).on(function(v, f, a, ev){
      //cat.on('in',[{gun:this,get:f,put:v},ev]);
      cat.on('in', [ id+f, { gun: this, get: f, put: v }, ev ])
    })
  }
}


function applyOff (Gun) {
  Gun.chain.off = function() {
    var gun = this, at = gun._, tmp
    var back = at.back || {}, cat = back._
    if(!cat){ return }
    if(tmp = cat.path){
      if(tmp[at.get]){
        obj_del(tmp, at.get)
      } else {
        obj_map(tmp, function(path, key){
          if(gun !== path){ return }
          obj_del(tmp, key)
        })
      }
    }
    if((tmp = gun.Back(-1)) === back){
      obj_del(tmp.graph, at.get)
    }
    if(at.ons && (tmp = at.ons['@$'])){
      obj_map(tmp.s, function(ev){
        ev.off()
      })
    }
    return gun
  }

}

function applyNot(Gun) {
  let obj = Gun.obj
  let obj_has = obj.has
  let obj_del = obj.del
  let obj_to = obj.to
  let val_rel_is = Gun.val.rel.is
  let empty = {}
  let u

  Gun.chain.not = function(cb, opt, t){
    var gun = this, at = Gun.obj.to(gun._, { not: { not: cb } })
    gun.any(ought, { as: at })
    return gun
  }
  function ought(cat, ev) {
    ev.off(); var at = this // TODO: BUG! Is this correct?
    if(cat.err || cat.put){ return }
    if(!at.not || !at.not.not){ return }
    //ev.stun(); // TODO: BUG? I think this is correct. NOW INCORRECT because as things mutate we might want to retrigger!
    at.not.not.call(at.gun, at.get, function(){ console.log('Please report this bug on https://gitter.im/amark/gun and in the issues.'); need.to.implement })
  }
}


function applyInit(Gun) {
  let obj_map = Gun.obj.map
  let noop = function(){}
  let event = { stun: noop, off: noop }
  let n_ = Gun.node._

  Gun.chain.init = function(){ // TODO: DEPRECATE?
    (this._.opt = this._.opt || {}).init = true
    return this.Back(-1).put(Gun.node.ify({}, this._.get), null, this._.get)
  }

}

function applyOn (Gun) {
  Gun.chain.on = function(tag, arg, eas, as){
    var gun = this, at = gun._, tmp
    if(!at.on){ at.on = Gun.on }
    if(typeof tag === 'string'){
      if(!arg){ return at.on(tag) }
      at.on(tag, arg, eas || at, as)
      return gun
    }
    var opt = arg
    opt = (true === opt)? { change: true } : opt || {}
    opt.ok = tag
    gun.any(ok, { as: opt, change: opt.change }) // TODO: PERF! Event listener leak!!!????
    return gun
  }

  function ok(cat, ev) {
    var opt = this
    var data = cat.put, tmp
    // TODO: BUG! Need to use at.put > cat.put for merged cache?
    if(u === data){ return }
    if(opt.as){
      //console.log("BANANA CREAM PIE", opt);
      opt.ok.call(opt.as, cat, ev)
    } else {
      //console.log("HICADOO DAAH", cat, opt);
      opt.ok.call(cat.gun, data, cat.get, cat, ev)
    }
  }

      //if(obj_empty(value, Gun._.meta) && !(opt && opt.empty)){ // TODO: PERF! Deprecate!???

      //} else {
        //console.log("value", value);
        //if(!(value||empty)['#']/* || !val_rel_is(value)*/){ // TODO: Performance hit!???? // TODO: BUG! WE should avoid this. So that way it is usable with gun plugin chains.
          //cb.call(gun, value, at.get); // TODO: BUG! What about stun?
          //return gun;
        //}
      //}

}





function applyAny (Gun) {

  Gun.chain.any = function(any, opt){
    if(!any){ return this }
    var chain = this, cat = chain._, opt = opt || {}, last = {}//function(){};
    if(opt.change){ opt.change = 1 }
    console.debug(5, 'any')
    chain.on('out', { get: function(at, ev){
        //console.log("any!", at);
        if(!at.gun){ console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%EXPLODE%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', at) }
        var gun = at.gun || chain, cat = gun._
        var data = cat.put || at.put, tmp
        if((tmp = at.put) && tmp[Gun.val.rel._] && (tmp = Gun.val.rel.is(tmp))){
          if(null !== opt['.']){
            return
          }
          at = obj_to(at, { put: data = cat.change = cat.put = Gun.state.ify(Gun.node.ify({}, tmp)) })
        }
        // TODO: BUG! Need to use at.put > cat.put for merged cache?
        if(tmp = opt.change){ // TODO: BUG! Opt is outer scope, gun/cat/data might be iterative and thus only inner scope? Aka, we can't use it for all of them.
          if(1 === tmp){
            opt.change = true
          } else {
            data = cat.change
            at = obj_to(at, { put: data })
          }
        }
        var id = cat.id+at.get
        /*
        if(last[id] == data && obj_has(last, id)){ return }
        last[id] = data; // TODO: PERF! Memory optimizaiton? Can we avoid this.
        */

        if(last.put === data && last.get === id){ return }
        last.get = id
        last.put = data

        cat.last = data
        if(opt.as){
          any.call(opt.as, at, ev)
        } else {
          any.call(gun, at.err, data, at.get, cat, ev)
        }
      }
      , opt
    })
    return chain
  }
  function ack(at, ev) {
    var lex = this.get, chain = this.gun
    var s = lex['#'], f = lex['.'], root = at.gun.Back(-1), gun = root.get(s), tmp
    if(tmp = at.put){
      if(!f || obj_has(tmp[s], f)) {
        ev.off()
        at['@'] = 0
        return root.on('in', at)
      }
      /*
      if(!tmp[s] && !obj_empty(tmp)){ // TODO: BUG! Seems like it just causes unnecessary data/event to be triggered. Nothing genuinely useful.
        ev.off(); // TODO: BUG!? It isn't matching data by lex means, but it IS a reply?
        at['@'] = 0;
        return root.on('in', at);
      }
      */
      if(f && gun._.put){
        gun = gun.get(f, null, { path: true })
        if(!chain){
          console.log('Please report this as an issue! ack.chain')
          return
        }
        chain.on('in', {
          err: at.err
          , get: f
          , gun: chain
          , via: { get: s, via: at }
        })
        return
      }
    }
    if(gun._.put){
      gun = gun.get(f, null, { path: true })
      gun.on('in', {
        err: at.err
        , get: f
        , gun: gun
        , via: { get: s, via: at }
      })
      return
    }
    gun.on('in', {
      err: at.err
      , put: at.put? at.put[s] || at.put : at.put
      , get: s
      , gun: gun
      , via: at
    })
  }
}

function applyPath (Gun) {
  Gun.chain.path = function(field, cb, opt){
    var back = this, gun = back, tmp
    opt = opt || {}; opt.path = true
    if(gun === gun._.root){if(cb){cb({ err: Gun.log('Can\'t do that on root instance.') })}return gun}
    if(typeof field === 'string'){
      tmp = field.split(opt.split || '.')
      if(1 === tmp.length){
        gun = back.get(field, cb, opt)
        gun._.opt = opt
        return gun
      }
      field = tmp
    }
    if(field instanceof Array){
      if(field.length > 1){
        gun = back
        var i = 0, l = field.length
        for(i; i < l; i++){
          console.debug(3, 'path', field[i])
          console.debug(2, 'path', field[i])
          gun = gun.get(field[i], (i+1 === l)? cb : null, opt)
        }
        gun.back = back // TODO: API change!
      } else {
        gun = back.get(field[0], cb, opt)
      }
      gun._.opt = opt
      return gun
    }
    if(!field && 0 != field){
      return back
    }
    gun = back.get(''+field, cb, opt)
    gun._.opt = opt
    return gun
  }

}

function applyVal (Gun) {
  // TODO: BUG! What about stun?
  Gun.chain.val = function(cb, opt){
    var gun = this, at = gun._, value = at.put
    if(!at.stun && u !== value){
      cb.call(gun, value, at.get)
      return gun
    }
    if(cb){
      (opt = opt || {}).ok = cb
      opt.cat = at
      console.debug(4, 'val', at)
      gun.any(val, { as: opt })
      opt.async = true
    }
    return gun
  }

  function val(at, ev, to) {
    var opt = this
    var cat = opt.cat, data = at.put
    if(u === data){
      return
    }
    clearTimeout(ev.to)
    if(!to && opt.async){
      ev.to = setTimeout(function(){
        val.call(opt, at, ev, ev.to || 1)
      }, opt.wait || 99)
      return
    }
    ev.off()
    opt.ok.call(at.gun || opt.gun, data, at.get) // TODO: BUG! opt.gun?
  }

}


function applySet (Gun) {
  Gun.chain.set = function(item, cb, opt){
    var gun = this
    cb = cb || function(){}
    return item.val(function(node){
      var put = {}, soul = Gun.node.soul(node)
      if(!soul){ return cb.call(gun, { err: Gun.log('Only a node can be linked! Not "' + node + '"!') }) }
      gun.put(Gun.obj.put(put, soul, Gun.val.rel.ify(soul)), cb, opt)
    })
  }
}


export default function api (Gun) {
  const applyFNs = [ applyBack, applyPut, applyGet, applyAny, applyOn, applyKey, applyPath, applyVal, applyOff, applyNot, applyMap, applyInit, applySet ]
  return applyFNs.reduce((_, applyFN) => {
    applyFN(_)
    return _
  }, Gun)
}
