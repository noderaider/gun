// On event emitter generic javascript utility.
function Scope(){
  function On(tag, arg, as, eas, skip){
    var ctx = this, ons = ctx.ons || (ctx.ons = {}), on = ons[tag] || (ons[tag] = { s: [] }), act, mem, O = On.ons
    if(!arg){
      if(1 === arguments.length){ // Performance drops significantly even though `arguments.length` should be okay to use.
        return on
      }
    }
    if(arg instanceof Function){
      act = new Act(tag, arg, as, on, ctx)
      if(O && O.event && ctx !== On){
        On.on('event', act)
        if(noop === act.fn){
          return act
        }
        if(-1 < act.i){ return act }
      }
      on.s.push(act)
      return act
    }
    var proxy
    if(O && O.emit && ctx !== On){
      var ev = { tag: tag, arg: arg, on: on, ctx: ctx }, u
      On.on('emit', ev)
      if(u === ev.arg){ return }
      arg = ev.arg
      proxy = ev.proxy
    }
    on.arg = arg
    on.end = as
    on.as = eas
    var i = 0, acts = on.s, l = acts.length, arr = (arg instanceof Array), gap, off, act
    for(; i < l; i++) {
      act = acts[i]
      if(skip){
        if(skip === act)
          skip = false
        continue
      }
      var tmp = act.tmp = {}
      if(!arr)
        act.fn.call(act.as, arg, proxy||act)
      else
        act.fn.apply(act.as, arg.concat(proxy||act))
      if(noop === act.fn)
        off = true
      if(tmp.halt){
        if(1 === tmp.halt)
          gap = true
        break
      }
    }
    if(off){
      var still = []
      for(i = 0; i < l; i++) {
        act = acts[i]
        if(noop !== act.fn)
          still.push(act)
      }
      on.s = still
      if(0 === still.length)
        delete ons[tag]
    }
    if(!gap && as && as instanceof Function)
      as.call(eas, arg)
    return
  }
  On.on = On
  On.scope = Scope
  return On
}
function Act(tag, fn, as, on, ctx){
  this.tag = tag
  this.fn = fn
  this.as = as
  this.on = on
  this.ctx = ctx
}
Act.chain = Act.prototype
Act.chain.stun = function(){
  if(!this.tmp)
    this.tmp = {}
  if(!arguments.length)
    return this.tmp.halt = true
  const on = this.on
  const resume = (...args) => {
    /*
      TODO: BUG!
      TODO: BUG!
      TODO: BUG!
      TODO: BUG!
      TODO: BUG!
      Why does our map not get updates?
      Portions do if we do not use .key to save the initial data.
      Which makes me think it relates to pseudo, however it doesn't fully work if I get rid of that.
      Why why why? Probably something to do with map events and memoizing?
    */
    const _args = args.length > 0 ? args : [ on.arg ]
    this.ctx.on(this.tag, args, on.end, on.as, this)
  }
  this.tmp.halt = 1
  return resume
}
Act.chain.off = function(){
  this.fn = noop
}
Act.chain.emit = function(arg){
  var act = this, arr = (arg instanceof Array)
  if(!arr){
    act.fn.call(act.as, arg, act)
  } else {
    act.fn.apply(act.as, arg.concat(act))
  }
}
function noop() {}

export default Scope()
