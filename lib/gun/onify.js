'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Chain;

var _On = require('./On');

var _On2 = _interopRequireDefault(_On);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Chain(create, opt) {
  opt = opt || {};
  opt.id = opt.id || '#';
  opt.rid = opt.rid || '@';
  opt.uuid = opt.uuid || function () {
    return +new Date() + Math.random();
  };
  var on = _On2.default.scope();

  on.stun = function (chain, fn, as) {
    var res = function res(n) {
      if (1 === n) {
        at.stun.skip = 1;
        return;
      }
      if (at.stun === stun) delete at.stun;
      off = true;
      var i = 0;
      var q = res.queue;
      var l = q.length;
      var c = void 0;
      var v = void 0;
      for (i; i < l; i++) {
        v = q[i];
        c = v[0];
        v = v[1];
        c.on('in', v.get, v);
      }
    },
        at = chain._,
        off,
        stun = at.stun = function (arg) {
      if (off) {
        delete this.stun;
        return false;
      }
      if (at.stun.skip) return at.stun.skip = false;
      res.queue.push([this, arg]);
      return true;
    };
    res.queue = [];
    return res;
  };

  var ask = on.ask = function (cb, as) {
    if (!ask.on) {
      ask.on = _On2.default.scope();
    }
    var id = opt.uuid();
    if (cb) {
      ask.on(id, cb, as);
    }
    return id;
  };
  ask._ = opt.id;
  on.ack = function (at, reply) {
    if (!at || !reply || !ask.on) return;
    var id = at[opt.id] || at;
    ask.on(id, reply);
    return true;
  };
  on.ack._ = opt.rid;
  /*
  on.on('event', function event(act){
    var last = act.on.last, tmp;
    if(last){
      if(last instanceof Array){
        act.fn.apply(act.as, last.concat(act));
      } else {
        act.fn.call(act.as, last, act);
      }
      if(last !== act.on.last){
        event(act);
      }
      return;
    }
  });*/

  on.on('event', function event(act) {
    var last = act.on.last,
        tmp;
    if (last) {
      if (act.on.map) {
        Gun.obj.map(act.on.map, function (v, f) {
          // TODO: BUG! Gun is not available in this module.
          //emit(v[0], act, event, v[1]); // below enables more control
          emit(v[1], act, event, v[2]);
        });
      } else {
        emit(last, act, event);
      }
      if (last !== act.on.last) {
        event(act);
      }
      return;
    }
  });
  function emit(last, act, event, ev) {
    if (last instanceof Array) {
      act.fn.apply(act.as, last.concat(ev || act));
    } else {
      act.fn.call(act.as, last, ev || act);
    }
  }

  on.on('emit', function (ev) {
    if (ev.on.map) {
      /*
      ev.id = ev.id || Gun.text.random(6);
      ev.on.map[ev.id] = ev.arg;
      ev.proxy = ev.arg[1];
      ev.arg = ev.arg[0];
      */ // below gives more control.
      ev.on.map[ev.arg[0]] = ev.arg;
      ev.proxy = ev.arg[2];
      ev.arg = ev.arg[1];
    }
    ev.on.last = ev.arg;
  });
  return on;
}
/*
function backward(scope, ev){ var tmp;
  if(!scope || !scope.on){ return }
  //if(scope.on('back').length){
  if((tmp = scope.ons) && (tmp = tmp[ev]) && tmp.s.length){
    return scope;
  }
  return backward((scope.back||backward)._, ev);
}
*/