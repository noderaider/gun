import Gun from '../'
if(typeof window === 'object') {
  if(typeof JSON === 'undefined')
    throw new Error('Include JSON first: ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js') // for old IE use

  const noop = () => {}
  let root
  if(typeof window !== 'undefined')
    root = window
  var store = root.localStorage || { setItem: noop, removeItem: noop, getItem: noop }

  function put(at) {
    let err
    let id
    let opt
    let root = at.gun._.root
    ;(opt = at.opt || {}).prefix = opt.prefix || at.gun.Back('opt.prefix') || 'gun/'
    Gun.graph.is(at.put, function(node, soul){
      //try{store.setItem(opt.prefix + soul, Gun.text.ify(node));
      try {
        store.setItem(opt.prefix + soul, Gun.text.ify(root._.graph[soul]||node))
      } catch(e) {
        err = e || 'localStorage failure'
      }
    })
    //console.log('@@@@@@@@@@local put!');
    Gun.on.ack(at, { err: err, ok: 0 }) // TODO: Reliability! Are we sure we want to have localStorage ack?
  }
  function get(at){
    var gun = at.gun, lex = at.get, soul, data, opt, u;
    //setTimeout(function(){
    (opt = at.opt || {}).prefix = opt.prefix || at.gun.Back('opt.prefix') || 'gun/'
    if(!lex || !(soul = lex[Gun._.soul])){ return }
    data = Gun.obj.ify(store.getItem(opt.prefix + soul) || null)
    if(!data){ return } // localStorage isn't trustworthy to say "not found".
    if(Gun.obj.has(lex, '.')){var tmp = data[lex['.']];data = { _: data._ };if(u !== tmp){data[lex['.']] = tmp}}
    //console.log('@@@@@@@@@@@@local get', data, at);
    gun.Back(-1).on('in', { '@': at['#'], put: Gun.graph.node(data) })
    //},100);
  }

  Gun.on('put', put)
  Gun.on('get', get)
}
