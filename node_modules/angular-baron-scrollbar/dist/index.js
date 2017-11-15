(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularBaronScrollbar = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
var qwery = _dereq_('qwery');
var xtend = _dereq_('xtend');
var insertcss = _dereq_('insert-css');

var css = ".scroller_wrapper {\n\tposition: relative;\n\toverflow: hidden;\n}\n.scroller {\n\theight: 100%;\n\toverflow: auto;\n\t/*-webkit-overflow-scrolling: touch;*/\n\t/* uncomment to accelerate scrolling on iOs */\n}\n[class^=\"baron\"] .scroller::-webkit-scrollbar {\n\twidth: 0;\n}\n.scroller__track_v {\n\tdisplay: none;\n\tposition: absolute;\n\tz-index: 3;\n\ttop: 20px;\n\tbottom: 20px;\n\tright: 5px;\n\twidth: 8px;\n\tborder-radius: 5px;\n\tbackground: #ddf;\n\tbackground: rgba(0, 0, 255, .1);\n\tpointer-events: none;\n}\n.scroller__track_h {\n\tdisplay: none;\n\tposition: absolute;\n\tz-index: 3;\n\tleft: 20px;\n\tright: 20px;\n\tbottom: 5px;\n\theight: 8px;\n\tborder-radius: 5px;\n\tbackground: #ddf;\n\tbackground: rgba(0, 0, 255, .1);\n\tpointer-events: none;\n}\n.baron .scroller__track_v {\n\tdisplay: block;\n}\n\n.baron_h .scroller__track_h {\n\tdisplay: block;\n}\n\n.scroller__bar_v {\n\tposition: absolute;\n\tz-index: 1;\n\twidth: 8px;\n\tborder-radius: 3px;\n\tbackground: #987; \n\topacity: 0.5;\n\t-webkit-transition: opacity .2s linear;\n\ttransition: opacity .2s linear;\n\tpointer-events: auto;\n}\n\n.scroller__bar_h {\n\tposition: absolute;\n\tz-index: 1;\n\theight: 8px;\n\tborder-radius: 3px;\n\tbackground: #987; \n\topacity: 0.5;\n\t-webkit-transition: opacity .2s linear;\n\ttransition: opacity .2s linear;\n\tpointer-events: auto;\n}\n\n.baron .scroller__bar {\n\topacity: .5;\n}\n.baron_h .scroller__bar_h {\n\topacity: .6;\n}\n[class^=\"scroller__bar\"]:hover {\n\topacity: 0.8;\n}\n";
insertcss(css, {prepend: true});

_dereq_('baron/baron.min.js');  // creates window.baron object

module.exports = 'angular-baron-scrollbar';

var template =
' <div class="scroller_wrapper" > ' +
'   <div class="scroller" in-view-container  ng-transclude></div>           ' +
'   <div class="scroller__track_v">                                         ' +
'     <div class="scroller__bar_v"></div>                                   ' +
'   </div>                                                                  ' +
'   <div class="scroller__track_h">                                         ' +
'     <div class="scroller__bar_h"></div>                                   ' +
'   </div>                                                                  ' +
' </div>                                                                    ' ;

var defaultOpts = {
  scroller: '.scroller',
  bar: '.scroller__bar_v',
  barOnCls: 'baron',

  // Local copy of jQuery-like utility
  // Default: window.jQuery
  $: function(selector, context) {
    return angular.element(qwery(selector, context));
  },
};

angular.module(module.exports, [])
.directive('baronScrollbar', ['$parse', function ($parse) {
  return {
    restrict: 'EA',
    transclude: true,
    template: template,
    replace: true,
    link: function (scope, elem, attr) {
      var hscroll, vscroll;
      var el = elem[0];
      var opts = $parse(attr['opts'])(scope);
      var hopts = $parse(attr['hopts'])(scope);
      var direction = attr['direction'] || 'y';
      opts = xtend(defaultOpts, {root: el}, opts);

      if (direction.indexOf('x') !== -1) {
        hscroll = baron(xtend(opts, {
          barOnCls: 'baron_h',
          bar: '.scroller__bar_h',
          direction: 'h'
        }, hopts));
      }
      if (direction.indexOf('y') !== -1) {
        vscroll = baron(opts);
      }

      scope.$watch('update', function (n, o) {
        if (n) {
          hscroll && hscroll.update();
          vscroll && vscroll.update();
          scope.update = false;
        }
      });

      scope.$on('destroy', function () {
        hscroll && hscroll.dispose();
        vscroll && vscroll.dispose();
      });
    }
  };
}]);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"baron/baron.min.js":2,"insert-css":3,"qwery":4,"xtend":5}],2:[function(_dereq_,module,exports){
!function(t,i,s){"use strict";function e(){return(new Date).getTime()}function r(i,s,e){i._eventHandlers=i._eventHandlers||[{element:i.scroller,handler:function(t){i.scroll(t)},type:"scroll"},{element:i.root,handler:function(){i.update()},type:"transitionend animationend"},{element:i.scroller,handler:function(){i.update()},type:"keyup"},{element:i.bar,handler:function(t){t.preventDefault(),i.selection(),i.drag.now=1},type:"touchstart mousedown"},{element:document,handler:function(){i.selection(1),i.drag.now=0},type:"mouseup blur touchend"},{element:document,handler:function(t){2!=t.button&&i._pos0(t)},type:"touchstart mousedown"},{element:document,handler:function(t){i.drag.now&&i.drag(t)},type:"mousemove touchmove"},{element:t,handler:function(){i.update()},type:"resize"},{element:i.root,handler:function(){i.update()},type:"sizeChange"}],p(i._eventHandlers,function(t){t.element&&s(t.element,t.type,t.handler,e)})}function o(t,i,s){var e="data-baron-"+i;if("on"==s)t.setAttribute(e,"inited");else{if("off"!=s)return t.getAttribute(e);t.removeAttribute(e)}}function n(t){if(o(t.root,t.direction))throw Error("Second baron initialization");var i=new v.prototype.constructor(t);return r(i,t.event,"on"),o(i.root,t.direction,"on"),i.update(),i}function l(t){var i={};t=t||{};for(var s in t)t.hasOwnProperty(s)&&(i[s]=t[s]);return i}function c(t){var i=l(t);i.direction=i.direction||"v";var s=t.event||function(t,s,e,r){i.$(t)[r||"on"](s,e)};return i.event=function(t,i,e,r){p(t,function(t){s(t,i,e,r)})},i}function a(t){if(this.events&&this.events[t])for(var i=0;i<this.events[t].length;i++){var s=Array.prototype.slice.call(arguments,1);this.events[t][i].apply(this,s)}}if(t){var h=d,u=["left","top","right","bottom","width","height"],f={v:{x:"Y",pos:u[1],oppos:u[3],crossPos:u[0],crossOpPos:u[2],size:u[5],crossSize:u[4],client:"clientHeight",crossClient:"clientWidth",crossScroll:"scrollWidth",offset:"offsetHeight",crossOffset:"offsetWidth",offsetPos:"offsetTop",scroll:"scrollTop",scrollSize:"scrollHeight"},h:{x:"X",pos:u[0],oppos:u[2],crossPos:u[1],crossOpPos:u[3],size:u[4],crossSize:u[5],client:"clientWidth",crossClient:"clientHeight",crossScroll:"scrollHeight",offset:"offsetWidth",crossOffset:"offsetHeight",offsetPos:"offsetLeft",scroll:"scrollLeft",scrollSize:"scrollWidth"}},p=function(i,e){var r=0;for((i.length===s||i===t)&&(i=[i]);i[r];)e.call(this,i[r],r),r++},d=function(i){var s,e,r;i=i||{},r=i.$||r||t.jQuery,s=this instanceof r,s?i.root=e=this:e=r(i.root||i.scroller);var o=new d.fn.constructor(e,i,r);return o.autoUpdate&&o.autoUpdate(),o};d.fn={constructor:function(t,i,s){var e=c(i);e.$=s,p.call(this,t,function(t,i){var s=l(e);e.root&&e.scroller?(s.scroller=e.$(e.scroller,t),s.scroller.length||(s.scroller=t)):s.scroller=t,s.root=t,this[i]=n(s),this.length=i+1}),this.params=e},dispose:function(){var t=this.params;this[0]&&p(this,function(i){i.dispose(t)}),this.params=null},update:function(){for(var t=0;this[t];)this[t].update.apply(this[t],arguments),t++},baron:function(t){return t.root=[],t.scroller=this.params.scroller,p.call(this,this,function(i){t.root.push(i.root)}),t.direction="v"==this.params.direction?"h":"v",t._chain=!0,d(t)}};var v={};v.prototype={_debounce:function(t,i){var r,o,n=this,l=function(){if(n._disposed)return clearTimeout(r),r=n=null,s;var c=e()-o;i>c&&c>=0?r=setTimeout(l,i-c):(r=null,t())};return function(){o=e(),r||(r=setTimeout(l,i))}},constructor:function(t){function i(t,i){return u(t,i)[0]}function r(t){var i=this.barMinSize||20;t>0&&i>t&&(t=i),this.bar&&u(this.bar).css(this.origin.size,parseInt(t,10)+"px")}function o(t){if(this.bar){var i=u(this.bar).css(this.origin.pos),s=+t+"px";s&&s!=i&&u(this.bar).css(this.origin.pos,s)}}function n(){return v[this.origin.client]-this.barTopLimit-this.bar[this.origin.offset]}function l(t){return t*n.call(this)+this.barTopLimit}function c(t){return(t-this.barTopLimit)/n.call(this)}function h(){return!1}var u,p,d,v,g,m,b,C,y,w,$;return w=y=e(),u=this.$=t.$,this.event=t.event,this.events={},this.root=t.root,this.scroller=i(t.scroller),this.bar=i(t.bar,this.root),v=this.track=i(t.track,this.root),!this.track&&this.bar&&(v=this.bar.parentNode),this.clipper=this.scroller.parentNode,this.direction=t.direction,this.origin=f[this.direction],this.barOnCls=t.barOnCls||"_baron",this.scrollingCls=t.scrollingCls,this.barTopLimit=0,C=1e3*t.pause||0,this.cursor=function(t){return t["client"+this.origin.x]||(((t.originalEvent||t).touches||{})[0]||{})["page"+this.origin.x]},this.pos=function(t){var i="page"+this.origin.x+"Offset",e=this.scroller[i]?i:this.origin.scroll;return t!==s&&(this.scroller[e]=t),this.scroller[e]},this.rpos=function(t){var i,s=this.scroller[this.origin.scrollSize]-this.scroller[this.origin.client];return i=t?this.pos(t*s):this.pos(),i/(s||1)},this.barOn=function(t){this.barOnCls&&(t||this.scroller[this.origin.client]>=this.scroller[this.origin.scrollSize]?u(this.root).hasClass(this.barOnCls)&&u(this.root).removeClass(this.barOnCls):u(this.root).hasClass(this.barOnCls)||u(this.root).addClass(this.barOnCls))},this._pos0=function(t){d=this.cursor(t)-p},this.drag=function(t){this.scroller[this.origin.scroll]=c.call(this,this.cursor(t)-d)*(this.scroller[this.origin.scrollSize]-this.scroller[this.origin.client])},this.selection=function(t){this.event(document,"selectpos selectstart",h,t?"off":"on")},this.resize=function(){function i(){var i,r,o,n,l;s.barOn(),r=s.scroller[s.origin.crossClient],o=s.scroller[s.origin.crossOffset],i=o-r,o&&(t.freeze&&!s.clipper.style[s.origin.crossSize]&&(n=u(s.clipper).css(s.origin.crossSize),l=s.clipper[s.origin.crossClient]-i+"px",n!=l&&u(s.clipper).css(s.origin.crossSize,l)),n=u(s.clipper).css(s.origin.crossSize),l=s.clipper[s.origin.crossClient]+i+"px",n!=l&&u(s.scroller).css(s.origin.crossSize,l)),Array.prototype.unshift.call(arguments,"resize"),a.apply(s,arguments),w=e()}var s=this,r=0;e()-w<C&&(clearTimeout(g),r=C),r?g=setTimeout(i,r):i()},this.updatePositions=function(){var t,i=this;i.bar&&(t=(v[i.origin.client]-i.barTopLimit)*i.scroller[i.origin.client]/i.scroller[i.origin.scrollSize],parseInt($,10)!=parseInt(t,10)&&(r.call(i,t),$=t),p=l.call(i,i.rpos()),o.call(i,p)),Array.prototype.unshift.call(arguments,"scroll"),a.apply(i,arguments),y=e()},this.scroll=function(){var t=0,i=this;e()-y<C&&(clearTimeout(m),t=C),e()-y<C&&(clearTimeout(m),t=C),t?m=setTimeout(function(){i.updatePositions()},t):i.updatePositions(),i.scrollingCls&&(b||this.$(this.scroller).addClass(this.scrollingCls),clearTimeout(b),b=setTimeout(function(){i.$(i.scroller).removeClass(i.scrollingCls),b=s},300))},this},update:function(t){return a.call(this,"upd",t),this.resize(1),this.updatePositions(),this},dispose:function(t){r(this,this.event,"off"),o(this.root,t.direction,"off"),this.$(this.scroller).css(this.origin.crossSize,""),this.barOn(!0),a.call(this,"dispose"),this._disposed=!0},on:function(t,i,s){for(var e=t.split(" "),r=0;r<e.length;r++)"init"==e[r]?i.call(this,s):(this.events[e[r]]=this.events[e[r]]||[],this.events[e[r]].push(function(t){i.call(this,t||s)}))}},d.fn.constructor.prototype=d.fn,v.prototype.constructor.prototype=v.prototype,d.noConflict=function(){return t.baron=h,d},d.version="0.7.10",i&&i.fn&&(i.fn.baron=d),t.baron=d,t.module&&module.exports&&(module.exports=d.noConflict())}}(window,window.$),function(t,s){var e=function(t){function e(t,i,e){var r=1==e?"pos":"oppos";l<(c.minView||0)&&(i=s),this.$(n[t]).css(this.origin.pos,"").css(this.origin.oppos,"").removeClass(c.outside),i!==s&&(i+="px",this.$(n[t]).css(this.origin[r],i).addClass(c.outside))}function r(t){try{i=document.createEvent("WheelEvent"),i.initWebKitWheelEvent(t.originalEvent.wheelDeltaX,t.originalEvent.wheelDeltaY),f.dispatchEvent(i),t.preventDefault()}catch(t){}}function o(t){var i;for(var s in t)c[s]=t[s];if(n=this.$(c.elements,this.scroller)){l=this.scroller[this.origin.client];for(var e=0;e<n.length;e++)i={},i[this.origin.size]=n[e][this.origin.offset],n[e].parentNode!==this.scroller&&this.$(n[e].parentNode).css(i),i={},i[this.origin.crossSize]=n[e].parentNode[this.origin.crossClient],this.$(n[e]).css(i),l-=n[e][this.origin.offset],u[e]=n[e].parentNode[this.origin.offsetPos],a[e]=a[e-1]||0,h[e]=h[e-1]||Math.min(u[e],0),n[e-1]&&(a[e]+=n[e-1][this.origin.offset],h[e]+=n[e-1][this.origin.offset]),(0!=e||0!=u[e])&&(this.event(n[e],"mousewheel",r,"off"),this.event(n[e],"mousewheel",r));c.limiter&&n[0]&&(this.track&&this.track!=this.scroller?(i={},i[this.origin.pos]=n[0].parentNode[this.origin.offset],this.$(this.track).css(i)):this.barTopLimit=n[0].parentNode[this.origin.offset],this.scroll()),c.limiter===!1&&(this.barTopLimit=0)}var o={element:n,handler:function(){for(var t,i=d(this)[0].parentNode,s=i.offsetTop,e=0;e<n.length;e++)n[e]===this&&(t=e);var r=s-a[t];c.scroll?c.scroll({x1:v.scroller.scrollTop,x2:r}):v.scroller.scrollTop=r},type:"click"};c.clickable&&(this._eventHandlers.push(o),p(o.element,o.type,o.handler,"on"))}var n,l,c={outside:"",inside:"",before:"",after:"",past:"",future:"",radius:0,minView:0},a=[],h=[],u=[],f=this.scroller,p=this.event,d=this.$,v=this;this.on("init",o,t);var g=[],m=[];this.on("init scroll",function(){var t,i,r;if(n){for(var o,f=0;f<n.length;f++)t=0,u[f]-this.pos()<h[f]+c.radius?(t=1,i=a[f]):u[f]-this.pos()>h[f]+l-c.radius?(t=2,i=this.scroller[this.origin.client]-n[f][this.origin.offset]-a[f]-l):(t=3,i=s),r=!1,(u[f]-this.pos()<h[f]||u[f]-this.pos()>h[f]+l)&&(r=!0),(t!=g[f]||r!=m[f])&&(e.call(this,f,i,t),g[f]=t,m[f]=r,o=!0);if(o)for(f=0;f<n.length;f++)1==g[f]&&c.past&&this.$(n[f]).addClass(c.past).removeClass(c.future),2==g[f]&&c.future&&this.$(n[f]).addClass(c.future).removeClass(c.past),3==g[f]?((c.future||c.past)&&this.$(n[f]).removeClass(c.past).removeClass(c.future),c.inside&&this.$(n[f]).addClass(c.inside)):c.inside&&this.$(n[f]).removeClass(c.inside),g[f]!=g[f+1]&&1==g[f]&&c.before?this.$(n[f]).addClass(c.before).removeClass(c.after):g[f]!=g[f-1]&&2==g[f]&&c.after?this.$(n[f]).addClass(c.after).removeClass(c.before):this.$(n[f]).removeClass(c.before).removeClass(c.after),c.grad&&(m[f]?this.$(n[f]).addClass(c.grad):this.$(n[f]).removeClass(c.grad))}}),this.on("resize upd",function(t){o.call(this,t&&t.fix)})};baron.fn.fix=function(t){for(var i=0;this[i];)e.call(this[i],t),i++;return this}}(window),function(t){var i=t.MutationObserver||t.WebKitMutationObserver||t.MozMutationObserver||null,s=function(){function t(){o.root[o.origin.offset]?e():s()}function s(){r||(r=setInterval(function(){o.root[o.origin.offset]&&(e(),o.update())},300))}function e(){clearInterval(r),r=null}var r,o=this,n=o._debounce(function(){o.update()},300);this._observer=new i(function(){t(),o.update(),n()}),this.on("init",function(){o._observer.observe(o.root,{childList:!0,subtree:!0,characterData:!0}),t()}),this.on("dispose",function(){o._observer.disconnect(),e(),delete o._observer})};baron.fn.autoUpdate=function(t){if(!i)return this;for(var e=0;this[e];)s.call(this[e],t),e++;return this}}(window),function(){var t=function(t){var i,s,e,r,o,n=this;r=t.screen||.9,t.forward&&(i=this.$(t.forward,this.clipper),o={element:i,handler:function(){var i=n.pos()-t.delta||30;n.pos(i)},type:"click"},this._eventHandlers.push(o),this.event(o.element,o.type,o.handler,"on")),t.backward&&(s=this.$(t.backward,this.clipper),o={element:s,handler:function(){var i=n.pos()+t.delta||30;n.pos(i)},type:"click"},this._eventHandlers.push(o),this.event(o.element,o.type,o.handler,"on")),t.track&&(e=t.track===!0?this.track:this.$(t.track,this.clipper)[0],e&&(o={element:e,handler:function(t){var i=t["offset"+n.origin.x],s=n.bar[n.origin.offsetPos],e=0;s>i?e=-1:i>s+n.bar[n.origin.offset]&&(e=1);var o=n.pos()+e*r*n.scroller[n.origin.client];n.pos(o)},type:"mousedown"},this._eventHandlers.push(o),this.event(o.element,o.type,o.handler,"on")))};baron.fn.controls=function(i){for(var s=0;this[s];)t.call(this[s],i),s++;return this}}(window),function(){var t=function(t){function i(){return m.scroller[m.origin.scroll]+m.scroller[m.origin.offset]}function s(){return m.scroller[m.origin.scrollSize]}function e(){return m.scroller[m.origin.client]}function r(t,i){var s=5e-4*t;return Math.floor(i-s*(t+550))}function o(t){h=t,t?(n(),l=setInterval(n,200)):clearInterval(l)}function n(){var n,l,h={},$=i(),z=s(),T=1==b;if(l=0,b>0&&(l=40),n=r(y,l),$>=z-y&&b>-1?T&&(y+=n):y=0,0>y&&(y=0),h[f]=y+"px",e()<=s()){m.$(u).css(h);for(var O=0;O<v.length;O++)m.$(v[O].self).css(v[O].property,Math.min(y/p*100,100)+"%")}g&&y&&m.$(m.root).addClass(g),0==y&&t.onCollapse&&t.onCollapse(),b=0,c=setTimeout(function(){b=-1},w),d&&y>p&&!a&&(d(),a=!0),0==y?C++:C=0,C>1&&(o(!1),a=!1,g&&m.$(m.root).removeClass(g))}var l,c,a,h,u=this.$(t.block),f=t.size||this.origin.size,p=t.limit||80,d=t.onExpand,v=t.elements||[],g=t.inProgress||"",m=this,b=0,C=0,y=0,w=t.waiting||500;this.on("init",function(){o(!0)}),this.on("dispose",function(){o(!1)}),this.event(this.scroller,"mousewheel DOMMouseScroll",function(t){var e=t.wheelDelta<0||t.originalEvent&&t.originalEvent.wheelDelta<0||t.detail>0;e&&(b=1,clearTimeout(c),!h&&i()>=s()&&o(!0))})};baron.fn.pull=function(i){for(var s=0;this[s];)t.call(this[s],i),s++;return this}}(window);
},{}],3:[function(_dereq_,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],4:[function(_dereq_,module,exports){
/*!
  * @preserve Qwery - A selector engine
  * https://github.com/ded/qwery
  * (c) Dustin Diaz 2014 | License MIT
  */

(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('qwery', this, function () {

  var classOnly = /^\.([\w\-]+)$/
    , doc = document
    , win = window
    , html = doc.documentElement
    , nodeType = 'nodeType'
  var isAncestor = 'compareDocumentPosition' in html ?
    function (element, container) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } :
    function (element, container) {
      container = container == doc || container == window ? html : container
      return container !== element && container.contains(element)
    }

  function toArray(ar) {
    return [].slice.call(ar, 0)
  }

  function isNode(el) {
    var t
    return el && typeof el === 'object' && (t = el.nodeType) && (t == 1 || t == 9)
  }

  function arrayLike(o) {
    return (typeof o === 'object' && isFinite(o.length))
  }

  function flatten(ar) {
    for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
    return r
  }

  function uniq(ar) {
    var a = [], i, j
    label:
    for (i = 0; i < ar.length; i++) {
      for (j = 0; j < a.length; j++) {
        if (a[j] == ar[i]) {
          continue label
        }
      }
      a[a.length] = ar[i]
    }
    return a
  }


  function normalizeRoot(root) {
    if (!root) return doc
    if (typeof root == 'string') return qwery(root)[0]
    if (!root[nodeType] && arrayLike(root)) return root[0]
    return root
  }

  /**
   * @param {string|Array.<Element>|Element|Node} selector
   * @param {string|Array.<Element>|Element|Node=} opt_root
   * @return {Array.<Element>}
   */
  function qwery(selector, opt_root) {
    var m, root = normalizeRoot(opt_root)
    if (!root || !selector) return []
    if (selector === win || isNode(selector)) {
      return !opt_root || (selector !== win && isNode(root) && isAncestor(selector, root)) ? [selector] : []
    }
    if (selector && arrayLike(selector)) return flatten(selector)


    if (doc.getElementsByClassName && selector == 'string' && (m = selector.match(classOnly))) {
      return toArray((root).getElementsByClassName(m[1]))
    }
    // using duck typing for 'a' window or 'a' document (not 'the' window || document)
    if (selector && (selector.document || (selector.nodeType && selector.nodeType == 9))) {
      return !opt_root ? [selector] : []
    }
    return toArray((root).querySelectorAll(selector))
  }

  qwery.uniq = uniq

  return qwery
}, this);

},{}],5:[function(_dereq_,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[1])(1)
});