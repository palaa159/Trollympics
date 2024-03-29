/*
 MelonJS Game Engine
 Copyright (C) 2012, Olivier BIOT
 http://www.melonjs.org

 melonJS is licensed under the MIT License.
 http://www.opensource.org/licenses/mit-license.php

 Tween JS
 https://github.com/sole/Tween.js
*/
var me = me || {};
(function(a, d) {
  function b() {
    if (!h) {
      if (!f.body) return setTimeout(b, 13);
      f.removeEventListener ? f.removeEventListener("DOMContentLoaded", b, !1) : a.removeEventListener("load", b, !1);
      h = !0;
      for (var e = 0; e < j.length; e++) j[e].call(a, []);
      j.length = 0
    }
  }
  function c() {
    return {
      xmlDoc: null,
      parseFromString: function(b) {
        a.DOMParser ? this.xmlDoc = (new DOMParser).parseFromString(b, "text/xml") : (this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM"), this.xmlDoc.async = "false", this.xmlDoc.loadXML(b));
        null == this.xmlDoc && console.log("xml " + this.xmlDoc + " not found!")
      },
      getFirstElementByTagName: function(a) {
        return this.xmlDoc ? this.xmlDoc.getElementsByTagName(a)[0] : null
      },
      getAllTagElements: function() {
        return this.xmlDoc ? this.xmlDoc.getElementsByTagName("*") : null
      },
      getStringAttribute: function(a, b, e) {
        return (a = a.getAttribute(b)) ? a.trim() : e
      },
      getIntAttribute: function(a, b, e) {
        return (a = this.getStringAttribute(a, b, e)) ? parseInt(a) : e
      },
      getFloatAttribute: function(a, b, e) {
        return (a = this.getStringAttribute(a, b, e)) ? parseFloat(a) : e
      },
      getBooleanAttribute: function(a, b, e) {
        return (a = this.getStringAttribute(a, b, e)) ? "true" == a : e
      },
      free: function() {
        this.xmlDoc = null
      }
    }
  }
  var f = a.document;
  me = {
    mod: "melonJS",
    nocache: "",
    audio: null,
    video: null,
    timer: null,
    input: null,
    state: null,
    game: null,
    entityPool: null,
    levelDirector: null,
    XMLParser: null,
    loadingScreen: null,
    TMXTileMap: null,
    debug: {
      displayFPS: !1,
      renderHitBox: !1,
      renderCollisionMap: !1,
      renderDirty: !1
    }
  };
  me.sys = {
    ua: navigator.userAgent.toLowerCase(),
    sound: !1,
    localStorage: "object" == typeof a.localStorage,
    gyro: a.DeviceMotionEvent !== d,
    nativeBase64: "function" == typeof a.atob,
    touch: !1,
    fps: 60,
    interpolation: !1,
    scale: 1,
    gravity: d,
    useNativeAnimFrame: !1,
    cacheImage: !1,
    dirtyRegion: !1,
    stopOnAudioError: !0,
    pauseOnBlur: !0,
    preRender: !1
  };
  var e = !1,
      g = !1,
      h = !1,
      j = [];
  a.onReady = function(e) {
    g || (g = !0, "complete" === f.readyState ? b() : (f.addEventListener && f.addEventListener("DOMContentLoaded", b, !1), a.addEventListener("load", b, !1)));
    h ? e.call(a, []) : j.push(function() {
      return e.call(a, [])
    });
    return this
  };
  a.onReady(function() {
    if (!e) {
      var b = f.createElement("audio");
      me.utils.setNocache(f.location.href.match(/\?nocache/) || !1);
      b.canPlayType && (me.audio.capabilities.mp3 = "no" != b.canPlayType("audio/mpeg") && "" != b.canPlayType("audio/mpeg"), me.audio.capabilities.ogg = "no" != b.canPlayType('audio/ogg; codecs="vorbis"') && "" != b.canPlayType('audio/ogg; codecs="vorbis"'), me.audio.capabilities.wav = "no" != b.canPlayType('audio/wav; codecs="1"') && "" != b.canPlayType('audio/wav; codecs="1"'), me.sys.sound = me.audio.capabilities.mp3 || me.audio.capabilities.ogg || me.audio.capabilities.wav);
      if (-1 < me.sys.ua.search("iphone") || -1 < me.sys.ua.search("ipod") || -1 < me.sys.ua.search("ipad") || -1 < me.sys.ua.search("android")) me.sys.sound = !1;
      me.sys.touch = "createTouch" in f || "ontouchstart" in a;
      me.timer.init();
      me.XMLParser = new c;
      me.loadingScreen = new me.DefaultLoadingScreen;
      me.state.init();
      me.entityPool.init();
      me.levelDirector.reset();
      e = !0
    }
  });
  var l = !1,
      r = /xyz/.test(function() {}) ? /\bparent\b/ : /.*/;
  Object.extend = function(a) {
    function b() {
      !l && this.init && this.init.apply(this, arguments)
    }
    var e = this.prototype;
    l = !0;
    var c = new this;
    l = !1;
    for (var d in a) c[d] = "function" == typeof a[d] && "function" == typeof e[d] && r.test(a[d]) ?
    function(a, b) {
      return function() {
        var c = this.parent;
        this.parent = e[a];
        var d = b.apply(this, arguments);
        this.parent = c;
        return d
      }
    }(d, a[d]) : a[d];
    b.prototype = c;
    b.constructor = b;
    b.extend = Object.extend;
    return b
  };
  "function" !== typeof Object.create && (Object.create = function(a) {
    function b() {}
    b.prototype = a;
    return new b
  });
  Function.bind || (Function.prototype.bind = function() {
    var a = this,
        b = Array.prototype.slice.call(arguments),
        e = b.shift();
    return function() {
      return a.apply(e, b.concat(Array.prototype.slice.call(arguments)))
    }
  });
  "undefined" === typeof Date.now && (Date.now = function() {
    return (new Date).getTime()
  });
  "undefined" === typeof console && (console = {
    log: function() {},
    info: function() {},
    error: function() {
      alert(Array.prototype.slice.call(arguments).join(", "))
    }
  });
  Function.prototype.defer = function() {
    var a = this,
        b = Array.prototype.slice.call(arguments);
    return window.setTimeout(function() {
      return a.apply(a, b)
    }, 0.01)
  };
  Object.defineProperty || (Object.defineProperty = function(a, b, e) {
    if (a.__defineGetter__) {
      e.get && a.__defineGetter__(b, e.get);
      e.set && a.__defineSetter__(b, e.set)
    } else throw "melonJS: Object.defineProperty not supported";
  });
  String.prototype.trim || (String.prototype.trim = function() {
    return this.replace(/^\s+/, "").replace(/\s+$/, "")
  });
  String.prototype.isNumeric = function() {
    return this != null && !isNaN(this) && this.trim() != ""
  };
  String.prototype.isBoolean = function() {
    return this != null && ("true" == this.trim() || "false" == this.trim())
  };
  String.prototype.contains = function(a) {
    return this.indexOf(a) > -1
  };
  String.prototype.toHex = function() {
    for (var a = "", b = 0; b < this.length;) a = a + this.charCodeAt(b++).toString(16);
    return a
  };
  Number.prototype.clamp = function(a, b) {
    return this < a ? a : this > b ? b : +this
  };
  Number.prototype.random = function(a, b) {
    return ~~ (Math.random() * (b - a + 1)) + a
  };
  Number.prototype.round = function() {
    var a = arguments.length == 1 ? this : arguments[0],
        b = Math.pow(10, arguments[1] || arguments[0]);
    return Math.round(a * b) / b
  };
  Number.prototype.toHex = function() {
    return "0123456789ABCDEF".charAt(this - this % 16 >> 4) + "0123456789ABCDEF".charAt(this % 16)
  };
  Number.prototype.sign = function() {
    return this < 0 ? -1 : this > 0 ? 1 : 0
  };
  Number.prototype.degToRad = function(a) {
    return (a || this) / 180 * Math.PI
  };
  Number.prototype.radToDeg = function(a) {
    return (a || this) * (180 / Math.PI)
  };
  Array.prototype.remove = function(a) {
    a = Array.prototype.indexOf.call(this, a);
    a !== -1 && Array.prototype.splice.call(this, a, 1);
    return this
  };
  var k = {},
      n = [],
      m, q = [];
  k.isDirty = !1;
  k.reset = function() {
    n.length = 0;
    q.length = 0;
    m = me.game.viewport.getRect();
    k.makeAllDirty()
  };
  k.makeDirty = function(a, b, e) {
    if (b) {
      k.isDirty = true;
      me.sys.dirtyRegion && (e ? n.push(e.union(a)) : a.getRect && n.push(a.getRect()))
    }
    a.visible && q.unshift(a)
  };
  k.makeAllDirty = function() {
    n.length = 0;
    n.push(m);
    k.isDirty = true
  };
  k.remove = function(a) {
    var b = q.indexOf(a);
    if (b != -1) {
      q.splice(b, 1);
      b = a.visible;
      a.visible = false;
      k.makeDirty(a, true);
      a.visible = b
    }
  };
  k.draw = function(a) {
    for (var b = n.length, e; b--, e = n[b];) {
      for (var c = q.length, d; c--, d = q[c];)(!me.sys.dirtyRegion || !d.isEntity || d.overlaps(e)) && d.draw(a, e);
      me.debug.renderDirty && e.draw(a, "white")
    }
  };
  k.flush = function() {
    if (me.sys.dirtyRegion) n.length = 0;
    q.length = 0;
    k.isDirty = false
  };
  var u = me,
      i = {},
      t = null,
      s = [],
      x = !1,
      y = null;
  i.viewport = null;
  i.HUD = null;
  i.collisionMap = null;
  i.currentLevel = null;
  i.NO_OBJECT = 0;
  i.ENEMY_OBJECT = 1;
  i.COLLECTABLE_OBJECT = 2;
  i.ACTION_OBJECT = 3;
  i.onLevelLoaded = null;
  i.init = function(a, b) {
    if (!x) {
      a = a || me.video.getWidth();
      b = b || me.video.getHeight();
      i.viewport = new me.Viewport(0, 0, a, b);
      t = me.video.getScreenFrameBuffer();
      x = true
    }
  };
  i.reset = function() {
    y && clearTimeout(y);
    y = null;
    x || i.init();
    i.removeAll();
    i.viewport && i.viewport.reset();
    k.reset();
    t.setTransform(1, 0, 0, 1, 0, 0);
    i.currentLevel = {
      pos: {
        x: 0,
        y: 0
      }
    }
  };
  i.loadTMXLevel = function(a) {
    i.currentLevel = a;
    i.collisionMap = i.currentLevel.getLayerByName("collision");
    (!i.collisionMap || !i.collisionMap.isCollisionMap) && console.error("WARNING : no collision map detected");
    for (var b = i.currentLevel.getLayers(), e = b.length; e--;) b[e].visible && i.add(b[e]);
    i.viewport.setBounds(Math.max(i.currentLevel.realwidth, i.viewport.width), Math.max(i.currentLevel.realheight, i.viewport.height));
    b = i.currentLevel.getObjectGroups();
    for (e = 0; e < b.length; e++) if (b[e].visible) for (var c = 0; c < b[e].objects.length; c++) i.addEntity(b[e].objects[c], b[e].z);
    i.currentLevel.pos.x != i.currentLevel.pos.y && t.translate(i.currentLevel.pos.x, i.currentLevel.pos.y);
    i.sort();
    i.onLevelLoaded && i.onLevelLoaded.call(i.onLevelLoaded, a.name)
  };
  i.add = function(a, b) {
    a.z = b ? b : a.z;
    s.push(a)
  };
  i.addEntity = function(a, b) {
    var e = me.entityPool.newInstanceOf(a);
    e && i.add(e, b)
  };
  i.getEntityByName = function(a) {
    for (var b = [], a = a.toLowerCase(), e = s.length, c; e--, c = s[e];) c.name == a && b.push(c);
    return b
  };
  i.getEntityByGUID = function(a) {
    for (var b = s.length, e; b--, e = s[b];) if (e.isEntity && e.GUID == a) return e;
    return null
  };
  i.addHUD = function(a, b, e, c, d) {
    if (i.HUD == null) {
      i.HUD = new me.HUD_Object(a, b, e, c, d);
      i.add(i.HUD)
    }
  };
  i.disableHUD = function() {
    if (i.HUD != null) {
      i.remove(i.HUD);
      i.HUD = null
    }
  };
  i.update = function() {
    for (var a = null, b = s.length, e; b--, e = s[b];) {
      var a = me.sys.dirtyRegion && e.isEntity ? e.getRect() : null,
          c = e.update();
      if (e.isEntity) e.visible = i.viewport.isVisible(e.collisionBox);
      k.makeDirty(e, c, c ? a : null)
    }
    i.viewport.update(k.isDirty) && k.makeAllDirty()
  };
  i.remove = function(a, b) {
    a.destroy && a.destroy();
    k.remove(a);
    if (b === true) s.remove(a);
    else {
      a.visible = false;
      if (a.isEntity) a.isEntity = false;
      y = function(a) {
        s.remove(a);
        y = null
      }.defer(a)
    }
  };
  i.removeAll = function() {
    for (var a = s.length; a--;) s[a].isPersistent || i.remove(s[a], true);
    k.flush()
  };
  i.sort = function(a) {
    typeof a !== "function" ? s.sort(function(a, b) {
      return b.z - a.z
    }) : s.sort(a);
    i.repaint()
  };
  i.collide = function(a) {
    for (var b = null, e = s.length, c; e--, c = s[e];) if (c.visible && (c.collidable && c.isEntity && c != a) && (b = c.checkCollision(a))) break;
    return b
  };
  i.repaint = function() {
    k.makeAllDirty()
  };
  i.draw = function() {
    if (k.isDirty) {
      k.draw(t);
      i.viewport.draw(t)
    }
    k.flush()
  };
  u.game = i;
  me.ScreenObject = Object.extend({
    visible: !1,
    addAsObject: !1,
    isPersistent: !1,
    z: 999,
    rect: null,
    init: function(a, b) {
      this.isPersistent = (this.addAsObject = this.visible = a === true || false) && b === true || false;
      this.rect = new me.Rect(new me.Vector2d(0, 0), 0, 0)
    },
    reset: function() {
      me.game.reset();
      this.onResetEvent.apply(this, arguments);
      if (this.addAsObject) {
        this.visible = true;
        this.rect = me.game.viewport.getRect();
        me.game.add(this, this.z)
      }
      me.game.sort()
    },
    getRect: function() {
      return this.rect
    },
    destroy: function() {
      this.onDestroyEvent.apply(this, arguments)
    },
    update: function() {
      return false
    },
    onUpdateFrame: function() {
      me.timer.update();
      me.game.update();
      me.game.draw();
      me.video.blitSurface()
    },
    draw: function() {},
    onResetEvent: function() {},
    onDestroyEvent: function() {}
  });
  for (var u = me, K = function() {
      if (A == -1 && z == -1) {
        me.timer.reset();
        if (me.sys.useNativeAnimFrame) {
          z = window.requestAnimationFrame(I);
          if (z != -1) return;
          me.sys.useNativeAnimFrame = false
        }
        A = setInterval(E, J)
      }
      }, I = function() {
      E();
      z = window.requestAnimationFrame(I)
      }, L = function() {
      if (A != -1) {
        clearInterval(A);
        A = -1
      }
      if (z != -1) {
        window.cancelAnimationFrame(z);
        z = -1
      }
      }, M = function(a) {
      L();
      if (v[w]) {
        v[w].screen.visible && me.game.remove.call(me.game, v[w].screen, true);
        v[w].screen.destroy()
      }
      if (v[a]) {
        w = a;
        v[w].screen.reset.apply(v[w].screen, F);
        E = v[w].screen.onUpdateFrame.bind(v[w].screen);
        K();
        G && G();
        me.game.repaint()
      }
      }, C = ["ms", "moz", "webkit", "o"], B = 0; B < C.length && !window.requestAnimationFrame; ++B) window.requestAnimationFrame = window[C[B] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[C[B] + "CancelAnimationFrame"] || window[C[B] + "CancelRequestAnimationFrame"];
  window.requestAnimationFrame || (window.requestAnimationFrame = function() {
    return -1
  });
  window.cancelAnimationFrame || (window.cancelAnimationFrame = function() {
    return -1
  });
  var o = {},
      w = -1,
      A = -1,
      z = -1,
      v = {},
      H = "",
      D = 0,
      G = null,
      F = null,
      E = null,
      J = null;
  o.LOADING = 0;
  o.MENU = 1;
  o.READY = 2;
  o.PLAY = 3;
  o.GAMEOVER = 4;
  o.GAME_END = 5;
  o.SCORE = 6;
  o.CREDITS = 7;
  o.SETTINGS = 8;
  o.USER = 100;
  o.onPause = null;
  o.onResume = null;
  o.init = function() {
    o.set(o.LOADING, me.loadingScreen);
    a.addEventListener("blur", function() {
      me.sys.pauseOnBlur && w != o.LOADING && o.pause(true);
      if (o.onPause) o.onPause()
    }, false);
    a.addEventListener("focus", function() {
      if (me.sys.pauseOnBlur && w != o.LOADING) {
        o.resume(true);
        me.game.repaint()
      }
      if (o.onResume) o.onResume()
    }, false);
    J = ~~ (1E3 / me.sys.fps)
  };
  o.pause = function(a) {
    L();
    a && me.audio.pauseTrack()
  };
  o.resume = function(a) {
    K(w);
    a && me.audio.resumeTrack()
  };
  o.isRunning = function() {
    return A != -1 || z != -1
  };
  o.set = function(a, b) {
    v[a] = {};
    v[a].screen = b;
    v[a].transition = true
  };
  o.current = function() {
    return v[w].screen
  };
  o.transition = function(a, b, e) {
    if (a == "fade") {
      H = b;
      D = e
    }
  };
  o.setTransition = function(a, b) {
    v[a].transition = b
  };
  o.change = function(a) {
    F = null;
    arguments.length > 1 && (F = Array.prototype.slice.call(arguments, 1));
    if (D && v[a].transition) {
      G = function() {
        me.game.viewport.fadeOut(H, D)
      };
      me.game.viewport.fadeIn(H, D, function() {
        M(a)
      })
    } else M.defer(a)
  };
  o.isCurrent = function(a) {
    return w == a
  };
  u.state = o
})(window);
(function(a, d) {
  me.DefaultLoadingScreen = me.ScreenObject.extend({
    init: function() {
      this.parent(!0);
      this.logo1 = new me.Font("century gothic", 32, "white", "middle");
      this.logo2 = new me.Font("century gothic", 32, "#89b002", "middle");
      this.logo2.bold();
      this.invalidate = !1;
      this.loadPercent = 0;
      me.loader.onProgress = this.onProgressUpdate.bind(this)
    },
    onDestroyEvent: function() {
      this.logo1 = this.logo2 = null
    },
    onProgressUpdate: function(a) {
      this.loadPercent = a;
      this.invalidate = !0
    },
    update: function() {
      return !0 === this.invalidate ? (this.invalidate = !1, !0) : !1
    },
    draw: function(a) {
      var b = this.logo1.measureText(a, "melon").width,
          e = (a.canvas.width - b - this.logo2.measureText(a, "JS").width) / 2,
          c = a.canvas.height / 2;
      me.video.clearSurface(a, "black");
      this.logo1.draw(a, "melon", e, c);
      this.logo2.draw(a, "JS", e + b, c);
      c += this.logo1.measureText(a, "melon").height / 2;
      b = Math.floor(this.loadPercent * a.canvas.width);
      a.strokeStyle = "silver";
      a.strokeRect(0, c, a.canvas.width, 6);
      a.fillStyle = "#89b002";
      a.fillRect(2, c + 2, b - 4, 2)
    }
  });
  var b = me,
      c = function() {
      if (l == j - k) {
        for (var a in g) if (g[a].isTMX && me.levelDirector.addTMXLevel(a)) f.onResourceLoaded();
        f.onload ? (clearTimeout(r), setTimeout(f.onload, 300), k = 0) : console.error("no load callback defined")
      } else r = setTimeout(c, 100)
      },
      f = {},
      e = [],
      g = {},
      h = {},
      j = 0,
      l = 0,
      r = 0,
      k = 0;
  f.onload = d;
  f.onProgress = d;
  f.onResourceLoaded = function() {
    l++;
    if (f.onProgress) f.onProgress(f.getLoadProgress())
  };
  f.onLoadingError = function(a) {
    throw "melonJS: Failed loading resource " + a.src;
  };
  f.preload = function(a) {
    for (var b = 0; b < a.length; b++) j += f.load(a[b], f.onResourceLoaded.bind(f), f.onLoadingError.bind(f, a[b]));
    c()
  };
  f.load = function(b, c, d) {
    b.name = b.name.toLowerCase();
    switch (b.type) {
    case "binary":
      var f = new XMLHttpRequest;
      f.open("GET", b.src + me.nocache, !1);
      f.responseType = "arraybuffer";
      xmlhttp.onerror = d;
      f.onload = function() {
        var a = f.response;
        if (a) {
          var a = new Uint8Array(a),
              e = [];
          h[b.name] = new dataType;
          for (var d = 0; d < a.byteLength; d++) e[d] = String.fromCharCode(a[d]);
          h[b.name].data = e.join("");
          c()
        }
      };
      f.send();
      return 1;
    case "image":
      return e.push(b.name), e[b.name] = new Image, e[b.name].onload = c, e[b.name].onerror = d, e[b.name].src = b.src + me.nocache, 1;
    case "tmx":
      if (a.XMLHttpRequest) {
        var l = new XMLHttpRequest;
        l.overrideMimeType && l.overrideMimeType("text/xml")
      } else l = new ActiveXObject("Microsoft.XMLHTTP");
      l.open("GET", b.src + me.nocache, !1);
      l.onerror = d;
      l.onload = function() {
        g[b.name] = {};
        g[b.name].xml = l.responseText;
        g[b.name].isTMX = !0;
        c()
      };
      l.send();
      k += 1;
      return 2;
    case "audio":
      me.audio.setLoadCallback(c);
      if (me.audio.isAudioEnable()) return me.audio.load(b), 1;
      break;
    default:
      throw "melonJS: me.loader.load : unknow or invalide resource type : %s" + b.type;
    }
    return 0
  };
  f.getXML = function(a) {
    a = a.toLowerCase();
    return null != g ? g[a].xml : null
  };
  f.getBinary = function(a) {
    a = a.toLowerCase();
    return null != h ? h[a] : null
  };
  f.getImage = function(a) {
    a = a.toLowerCase();
    if (null != e[a]) {
      if (!0 === me.sys.cacheImage) {
        var b = me.video.createCanvasSurface(e[a].width, e[a].height);
        b.drawImage(e[a], 0, 0);
        return b.canvas
      }
      return e[a]
    }
    return null
  };
  f.getLoadProgress = function() {
    return l / j
  };
  b.loader = f
})(window);
(function() {
  me.Vector2d = Object.extend({
    x: 0,
    y: 0,
    init: function(a, d) {
      this.x = a || 0;
      this.y = d || 0
    },
    set: function(a, d) {
      this.x = a;
      this.y = d
    },
    setZero: function() {
      this.set(0, 0)
    },
    setV: function(a) {
      this.x = a.x;
      this.y = a.y
    },
    add: function(a) {
      this.x += a.x;
      this.y += a.y
    },
    sub: function(a) {
      this.x -= a.x;
      this.y -= a.y
    },
    scale: function(a) {
      this.x *= a.x;
      this.y *= a.y
    },
    div: function(a) {
      this.x /= a;
      this.y /= a
    },
    abs: function() {
      0 > this.x && (this.x = -this.x);
      0 > this.y && (this.y = -this.y)
    },
    clamp: function(a, d) {
      return new me.Vector2d(this.x.clamp(a, d), this.y.clamp(a, d))
    },
    clampSelf: function(a, d) {
      this.x = this.x.clamp(a, d);
      this.y = this.y.clamp(a, d);
      return this
    },
    minV: function(a) {
      this.x = this.x < a.x ? this.x : a.x;
      this.y = this.y < a.y ? this.y : a.y
    },
    maxV: function(a) {
      this.x = this.x > a.x ? this.x : a.x;
      this.y = this.y > a.y ? this.y : a.y
    },
    floor: function() {
      return new me.Vector2d(~~this.x, ~~this.y)
    },
    floorSelf: function() {
      this.x = ~~this.x;
      this.y = ~~this.y;
      return this
    },
    ceil: function() {
      return new me.Vector2d(Math.ceil(this.x), Math.ceil(this.y))
    },
    ceilSelf: function() {
      this.x = Math.ceil(this.x);
      this.y = Math.ceil(this.y);
      return this
    },
    negate: function() {
      return new me.Vector2d(-this.x, -this.y)
    },
    negateSelf: function() {
      this.x = -this.x;
      this.y = -this.y;
      return this
    },
    copy: function(a) {
      this.x = a.x;
      this.y = a.y
    },
    equals: function(a) {
      return this.x === a.x && this.y === a.y
    },
    length: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    },
    normalize: function() {
      var a = this.length();
      if (a < Number.MIN_VALUE) return 0;
      var d = 1 / a;
      this.x *= d;
      this.y *= d;
      return a
    },
    dotProduct: function(a) {
      return this.x * a.x + this.y * a.y
    },
    distance: function(a) {
      return Math.sqrt((this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y))
    },
    clone: function() {
      return new me.Vector2d(this.x, this.y)
    },
    toString: function() {
      return "x:" + this.x + "y:" + this.y
    }
  });
  me.Rect = Object.extend({
    pos: null,
    colPos: null,
    width: 0,
    height: 0,
    hWidth: 0,
    hHeight: 0,
    init: function(a, d, b) {
      this.pos = a;
      this.colPos = new me.Vector2d;
      this.width = d;
      this.height = b;
      this.hWidth = ~~ (d / 2);
      this.hHeight = ~~ (b / 2);
      Object.defineProperty(this, "left", {
        get: function() {
          return this.pos.x
        },
        configurable: !0
      });
      Object.defineProperty(this, "right", {
        get: function() {
          return this.pos.x + this.width
        },
        configurable: !0
      });
      Object.defineProperty(this, "top", {
        get: function() {
          return this.pos.y
        },
        configurable: !0
      });
      Object.defineProperty(this, "bottom", {
        get: function() {
          return this.pos.y + this.height
        },
        configurable: !0
      })
    },
    set: function(a, d, b) {
      this.pos = a;
      this.width = d;
      this.height = b;
      this.hWidth = ~~ (d / 2);
      this.hHeight = ~~ (b / 2)
    },
    getRect: function() {
      return new me.Rect(this.pos.clone(), this.width, this.height)
    },
    union: function(a) {
      var d = Math.min(this.pos.x, a.pos.x),
          b = Math.min(this.pos.y, a.pos.y);
      this.width = Math.ceil(Math.max(this.pos.x + this.width, a.pos.x + a.width) - d);
      this.height = Math.ceil(Math.max(this.pos.y + this.height, a.pos.y + a.height) - b);
      this.pos.x = ~~d;
      this.pos.y = ~~b;
      return this
    },
    adjustSize: function(a, d, b, c) {
      -1 != a && (this.colPos.x = a, this.width = d, this.hWidth = ~~ (this.width / 2), this.left !== this.pos.x + this.colPos.x && Object.defineProperty(this, "left", {
        get: function() {
          return this.pos.x + this.colPos.x
        },
        configurable: !0
      }), this.right !== this.pos.x + this.colPos.x + this.width && Object.defineProperty(this, "right", {
        get: function() {
          return this.pos.x + this.colPos.x + this.width
        },
        configurable: !0
      })); - 1 != b && (this.colPos.y = b, this.height = c, this.hHeight = ~~ (this.height / 2), this.top !== this.pos.y + this.colPos.y && Object.defineProperty(this, "top", {
        get: function() {
          return this.pos.y + this.colPos.y
        },
        configurable: !0
      }), this.bottom !== this.pos.y + this.colPos.y + this.height && Object.defineProperty(this, "bottom", {
        get: function() {
          return this.pos.y + this.colPos.y + this.height
        },
        configurable: !0
      }))
    },
    flipX: function(a) {
      this.colPos.x = a - this.width - this.colPos.x;
      this.hWidth = ~~ (this.width / 2)
    },
    flipY: function(a) {
      this.colPos.y = a - this.height - this.colPos.y;
      this.hHeight = ~~ (this.height / 2)
    },
    overlaps: function(a) {
      return this.left < a.right && a.left < this.right && this.top < a.bottom && a.top < this.bottom
    },
    within: function(a) {
      return a.left <= this.left && a.right >= this.right && a.top <= this.top && a.bottom >= this.bottom
    },
    contains: function(a) {
      return a.left >= this.left && a.right <= this.right && a.top >= this.top && a.bottom <= this.bottom
    },
    containsPoint: function(a) {
      return a.x >= this.left && a.x <= this.right && a.y >= this.top && a.y <= this.bottom
    },
    collideVsAABB: function(a) {
      var d = new me.Vector2d(0, 0);
      if (this.overlaps(a)) {
        var b = this.left + this.hWidth - a.left - a.hWidth,
            c = this.top + this.hHeight - a.top - a.hHeight;
        d.x = a.hWidth + this.hWidth - (0 > b ? -b : b);
        d.y = a.hHeight + this.hHeight - (0 > c ? -c : c);
        d.x < d.y ? (d.y = 0, d.x = 0 > b ? -d.x : d.x) : (d.x = 0, d.y = 0 > c ? -d.y : d.y)
      }
      return d
    },
    draw: function(a, d) {
      a.strokeStyle = d || "red";
      a.strokeRect(this.left - me.game.viewport.pos.x, this.top - me.game.viewport.pos.y, this.width, this.height)
    }
  })
})(window);
(function() {
  var a = Math.min,
      d = Math.max;
  me.Viewport = me.Rect.extend({
    AXIS: {
      NONE: 0,
      HORIZONTAL: 1,
      VERTICAL: 2,
      BOTH: 3
    },
    limits: null,
    target: null,
    follow_axis: 0,
    _shake: null,
    _fadeIn: null,
    _fadeOut: null,
    _deadwidth: 0,
    _deadheight: 0,
    _limitwidth: 0,
    _limitheight: 0,
    init: function(a, c, d, e, g, h) {
      this.parent(new me.Vector2d(a, c), d - a, e - c);
      this.limits = new me.Vector2d(g || this.width, h || this.height);
      this.target = null;
      this.follow_axis = this.AXIS.NONE;
      this._shake = {
        intensity: 0,
        duration: 0,
        axis: this.AXIS.BOTH,
        onComplete: null
      };
      this._fadeOut = {
        color: 0,
        alpha: 0,
        duration: 0,
        tween: null
      };
      this._fadeIn = {
        color: 0,
        alpha: 1,
        duration: 0,
        tween: null
      };
      this.setDeadzone(this.width / 6, this.height / 6)
    },
    _followH: function(b) {
      return b.x - this.pos.x > this._deadwidth ? (this.pos.x = ~~a(b.x - this._deadwidth, this._limitwidth), !0) : b.x - this.pos.x < this.deadzone.x ? (this.pos.x = ~~d(b.x - this.deadzone.x, 0), !0) : !1
    },
    _followV: function(b) {
      return b.y - this.pos.y > this._deadheight ? (this.pos.y = ~~a(b.y - this._deadheight, this._limitheight), !0) : b.y - this.pos.y < this.deadzone.y ? (this.pos.y = ~~d(b.y - this.deadzone.y, 0), !0) : !1
    },
    reset: function(a, c) {
      this.pos.x = a || 0;
      this.pos.y = c || 0;
      this.follow_axis = this.target = null
    },
    setDeadzone: function(a, c) {
      this.deadzone = new me.Vector2d(~~ ((this.width - a) / 2), ~~ ((this.height - c) / 2 - 0.25 * c));
      this._deadwidth = this.width - this.deadzone.x;
      this._deadheight = this.height - this.deadzone.y;
      this.update(!0)
    },
    setBounds: function(a, c) {
      this.limits.set(a, c);
      this._limitwidth = this.limits.x - this.width;
      this._limitheight = this.limits.y - this.height
    },
    follow: function(a, c) {
      if (a instanceof me.ObjectEntity) this.target = a.pos;
      else if (a instanceof me.Vector2d) this.target = a;
      else throw "melonJS: invalid target for viewport.follow";
      this.follow_axis = c || this.AXIS.BOTH;
      this.update(!0)
    },
    move: function(a, c) {
      var d = ~~ (this.pos.y + c);
      this.pos.x = (~~ (this.pos.x + a)).clamp(0, this._limitwidth);
      this.pos.y = d.clamp(0, this._limitheight)
    },
    update: function(a) {
      if (this.target && a) switch (this.follow_axis) {
      case this.AXIS.HORIZONTAL:
        a = this._followH(this.target);
        break;
      case this.AXIS.VERTICAL:
        a = this._followV(this.target);
        break;
      case this.AXIS.BOTH:
        a = this._followH(this.target), a = this._followV(this.target) || a
      }
      if (0 < this._shake.duration) if (this._shake.duration -= me.timer.tick, 0 > this._shake.duration) {
        if (this._shake.onComplete) this._shake.onComplete()
      } else {
        if (this._shake.axis == this.AXIS.BOTH || this._shake.axis == this.AXIS.HORIZONTAL) a = Math.random() * this._shake.intensity, this.pos.x = this.pos.x + this.width + a < this.limits.x ? this.pos.x + ~~a : this.pos.x - ~~a;
        if (this._shake.axis == this.AXIS.BOTH || this._shake.axis == this.AXIS.VERTICAL) a = Math.random() * this._shake.intensity, this.pos.y = this.pos.y + this.height + a < this.limits.y ? this.pos.y + ~~a : this.pos.y - ~~a;
        a = !0
      }
      if (null != this._fadeIn.tween || null != this._fadeOut.tween) a = !0;
      return a
    },
    shake: function(a, c, d, e) {
      d = d || this.AXIS.BOTH;
      d == this.AXIS.BOTH && (this.width == this.limits.x ? d = this.AXIS.VERTICAL : this.height == this.limits.y && (d = this.AXIS.HORIZONTAL));
      !(d == this.AXIS.HORIZONTAL && this.width == this.limits.x) && !(d == this.AXIS.VERTICAL && this.height == this.limits.y) && (this._shake.intensity = a, this._shake.duration = c, this._shake.axis = d, this._shake.onComplete = e || null)
    },
    fadeOut: function(a, c, d) {
      this._fadeOut.color = a;
      this._fadeOut.duration = c || 1E3;
      this._fadeOut.alpha = 1;
      this._fadeOut.tween = (new me.Tween(this._fadeOut)).to({
        alpha: 0
      }, this._fadeOut.duration).onComplete(d || null);
      this._fadeOut.tween.start()
    },
    fadeIn: function(a, c, d) {
      this._fadeIn.color = a;
      this._fadeIn.duration = c || 1E3;
      this._fadeIn.alpha = 0;
      this._fadeIn.tween = (new me.Tween(this._fadeIn)).to({
        alpha: 1
      }, this._fadeIn.duration).onComplete(d || null);
      this._fadeIn.tween.start()
    },
    getWidth: function() {
      return this.width
    },
    getHeight: function() {
      return this.height
    },
    focusOn: function(a) {
      this.pos.x = a.x - 0.5 * this.width;
      this.pos.y = a.y - 0.5 * this.height
    },
    isVisible: function(a) {
      return a.overlaps(this)
    },
    draw: function(a) {
      this._fadeIn.tween && (a.globalAlpha = this._fadeIn.alpha, me.video.clearSurface(a, me.utils.HexToRGB(this._fadeIn.color)), a.globalAlpha = 1, 1 == this._fadeIn.alpha && (this._fadeIn.tween = null));
      this._fadeOut.tween && (a.globalAlpha = this._fadeOut.alpha, me.video.clearSurface(a, me.utils.HexToRGB(this._fadeOut.color)), a.globalAlpha = 1, 0 == this._fadeOut.alpha && (this._fadeOut.tween = null))
    }
  })
})(window);
(function(a, d) {
  me.ObjectSettings = {
    name: null,
    image: null,
    transparent_color: null,
    spritewidth: null,
    spriteheight: null,
    type: 0,
    collidable: !1
  };
  var b = me,
      c = {},
      f = {};
  c.init = function() {
    c.add("me.LevelEntity", me.LevelEntity);
    c.add("me.ObjectEntity", me.ObjectEntity);
    c.add("me.CollectableEntity", me.CollectableEntity);
    c.add("me.InvisibleEntity", me.InvisibleEntity)
  };
  c.add = function(a, b) {
    f[a.toLowerCase()] = b
  };
  c.newInstanceOf = function(a) {
    var b = a.name ? a.name.toLowerCase() : d;
    return !b ? null : !f[b] ? (console.error("cannot instance entity of type '" + b + "': Class not found!"), null) : new f[b](a.x, a.y, a)
  };
  b.entityPool = c;
  me.SpriteObject = me.Rect.extend({
    scale: null,
    scaleFlag: !1,
    lastflipX: !1,
    lastflipY: !1,
    z: 0,
    offset: null,
    visible: !0,
    angle: 0,
    anchorPoint: null,
    image: null,
    collisionBox: null,
    flickering: !1,
    flickerTimer: -1,
    flickercb: null,
    flickerState: !1,
    vp: null,
    init: function(a, b, c, d, f) {
      this.parent(new me.Vector2d(a, b), d || c.width, f || c.height);
      this.image = c;
      this.scale = new me.Vector2d(1, 1);
      this.collisionBox = new me.Rect(this.pos, this.width, this.height);
      this.vp = me.game.viewport;
      this.offset = new me.Vector2d(0, 0);
      this.anchorPoint = new me.Vector2d(0.5, 0.5);
      this.spritecount = new me.Vector2d(~~ (this.image.width / this.width), ~~ (this.image.height / this.height))
    },
    setTransparency: function(a) {
      a = "#" == a.charAt(0) ? a.substring(1, 7) : a;
      this.image = me.video.applyRGBFilter(this.image, "transparent", a.toUpperCase()).canvas
    },
    isFlickering: function() {
      return this.flickering
    },
    flicker: function(a, b) {
      this.flickerTimer = a;
      0 > this.flickerTimer ? (this.flickering = !1, this.flickercb = null) : this.flickering || (this.flickercb = b, this.flickering = !0)
    },
    flipX: function(a) {
      a != this.lastflipX && (this.lastflipX = a, this.scale.x = -this.scale.x, this.scaleFlag = 1 != this.scale.x || 1 != this.scale.y, this.collisionBox.flipX(this.width))
    },
    flipY: function(a) {
      a != this.lastflipY && (this.lastflipY = a, this.scale.y = -this.scale.y, this.scaleFlag = 1 != this.scale.x || 1 != this.scale.y, this.collisionBox.flipY(this.height))
    },
    resize: function(a) {
      0 < a && (this.scale.x = 0 > this.scale.x ? -a : a, this.scale.y = 0 > this.scale.y ? -a : a, this.scaleFlag = 1 != this.scale.x || 1 != this.scale.y)
    },
    update: function() {
      return this.flickering ? (this.flickerTimer -= me.timer.tick, 0 > this.flickerTimer && (this.flickercb && this.flickercb(), this.flicker(-1)), !0) : !1
    },
    draw: function(a) {
      if (this.flickering && (this.flickerState = !this.flickerState, !this.flickerState)) return;
      var b = ~~ (this.pos.x - this.vp.pos.x),
          c = ~~ (this.pos.y - this.vp.pos.y);
      if (this.scaleFlag || 0 !== this.angle) {
        a.save();
        var d = this.width * this.anchorPoint.x,
            f = this.height * this.anchorPoint.y;
        a.translate(b + d, c + f);
        this.scaleFlag && a.scale(this.scale.x, this.scale.y);
        0 !== this.angle && a.rotate(this.angle);
        b = -d;
        c = -f
      }
      a.drawImage(this.image, this.offset.x, this.offset.y, this.width, this.height, b, c, this.width, this.height);
      (this.scaleFlag || 0 !== this.angle) && a.restore();
      me.debug.renderHitBox && (this.parent(a, "blue"), this.collisionBox.draw(a, "red"))
    },
    destroy: function() {
      this.onDestroyEvent.apply(this, arguments)
    },
    onDestroyEvent: function() {}
  });
  me.AnimationSheet = me.SpriteObject.extend({
    fpscount: 0,
    animationpause: !1,
    animationspeed: 0,
    init: function(a, b, c, d, f) {
      this.anim = [];
      this.current = this.resetAnim = null;
      this.parent(a, b, c, d, f);
      1 == this.spritecount.x * this.spritecount.y && (this.setAnimationFrame = function() {});
      this.animationspeed = me.sys.fps / 10;
      this.addAnimation("default", null);
      this.setCurrentAnimation("default")
    },
    addAnimation: function(a, b) {
      this.anim[a] = {
        name: a,
        frame: [],
        idx: 0,
        length: 0
      };
      if (null == b) for (var b = [], c = 0, d = this.spritecount.x * this.spritecount.y; c < d; c++) b[c] = c;
      c = 0;
      for (d = b.length; c < d; c++) this.anim[a].frame[c] = new me.Vector2d(this.width * (b[c] % this.spritecount.x), this.height * ~~ (b[c] / this.spritecount.x));
      this.anim[a].length = this.anim[a].frame.length
    },
    setCurrentAnimation: function(a, b) {
      this.current = this.anim[a];
      this.resetAnim = b || null;
      this.setAnimationFrame(this.current.idx)
    },
    isCurrentAnimation: function(a) {
      return this.current.name == a
    },
    setAnimationFrame: function(a) {
      this.current.idx = (a || 0) % this.current.length;
      this.offset = this.current.frame[this.current.idx]
    },
    update: function() {
      this.parent();
      return this.visible && !this.animationpause && this.fpscount++ > this.animationspeed ? (this.setAnimationFrame(++this.current.idx), this.fpscount = 0, 0 == this.current.idx && this.resetAnim && ("string" == typeof this.resetAnim ? this.setCurrentAnimation(this.resetAnim) : "function" == typeof this.resetAnim && this.resetAnim()), !0) : !1
    }
  });
  me.ObjectEntity = me.AnimationSheet.extend({
    GUID: null,
    type: 0,
    collidable: !1,
    init: function(a, b, c) {
      this.parent(a, b, "string" == typeof c.image ? me.loader.getImage(c.image) : c.image, c.spritewidth, c.spriteheight);
      c.transparent_color && this.setTransparency(c.transparent_color);
      this.GUID = me.utils.createGUID();
      this.name = c.name ? c.name.toLowerCase() : "";
      this.vel = new me.Vector2d;
      this.accel = new me.Vector2d;
      this.friction = new me.Vector2d;
      this.maxVel = new me.Vector2d(1E3, 1E3);
      this.gravity = me.sys.gravity != d ? me.sys.gravity : 0.98;
      this.alive = this.isEntity = !0;
      this.falling = !1;
      this.jumping = !0;
      this.ducking = !1;
      this.slopeY = 0;
      this.onladder = this.onslope = !1;
      this.collidable = c.collidable || !1;
      this.type = c.type || 0;
      this.collisionMap = me.game.collisionMap;
      this.canBreakTile = !1;
      this.onTileBreak = null
    },
    updateColRect: function(a, b, c, d) {
      this.collisionBox.adjustSize(a, b, c, d)
    },
    checkCollision: function(a) {
      var b = this.collisionBox.collideVsAABB(a.collisionBox);
      return 0 != b.x || 0 != b.y ? (this.onCollision(b, a), b.type = this.type, b.obj = this, b) : null
    },
    onCollision: function() {
      this.collidable && this.type == me.game.COLLECTABLE_OBJECT && me.game.remove(this)
    },
    setVelocity: function(a, b) {
      this.accel.x = 0 != a ? a : this.accel.x;
      this.accel.y = 0 != b ? b : this.accel.y;
      this.setMaxVelocity(a, b)
    },
    setMaxVelocity: function(a, b) {
      this.maxVel.x = a;
      this.maxVel.y = b
    },
    setFriction: function(a, b) {
      this.friction.x = a || 0;
      this.friction.y = b || 0
    },
    doWalk: function(a) {
      this.flipX(a);
      this.vel.x += a ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick
    },
    doClimb: function(a) {
      return this.onladder ? (this.vel.y = a ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick, !0) : !1
    },
    doJump: function() {
      return !this.jumping && !this.falling ? (this.vel.y = -this.maxVel.y * me.timer.tick, this.jumping = !0) : !1
    },
    doDuck: function() {
      return 
    },
    forceJump: function() {
      this.jumping = this.falling = !1;
      this.doJump();
    },
    distanceTo: function(a) {
      var b = this.pos.x + this.hWidth - (a.pos.x + a.hWidth),
          a = this.pos.y + this.hHeight - (a.pos.y + a.hHeight);
      return Math.sqrt(b * b + a * a)
    },
    checkSlope: function(a, b) {
      this.pos.y = a.pos.y - this.height;
      this.slopeY = b ? a.height - (this.collisionBox.right + this.vel.x - a.pos.x) : this.collisionBox.left + this.vel.x - a.pos.x;
      this.vel.y = 0;
      this.pos.y += this.slopeY.clamp(0, a.height)
    },
    computeVelocity: function(a) {
      this.gravity && (a.y += !this.onladder ? this.gravity * me.timer.tick : 0, this.jumping = (this.falling = 0 < a.y) ? !1 : this.jumping);
      this.friction.x && (a.x = me.utils.applyFriction(a.x, this.friction.x));
      this.friction.y && (a.y = me.utils.applyFriction(a.y, this.friction.y));
      0 != a.y && (a.y = a.y.clamp(-this.maxVel.y, this.maxVel.y));
      0 != a.x && (a.x = a.x.clamp(-this.maxVel.x, this.maxVel.x))
    },
    updateMovement: function() {
      this.computeVelocity(this.vel);
      var a = this.collisionMap.checkCollision(this.collisionBox, this.vel);
      this.onslope = a.yprop.isSlope || a.xprop.isSlope;
      this.onladder = !1;
      if (a.y) if (this.onladder = a.yprop.isLadder, 0 < a.y) if (a.yprop.isSolid || a.yprop.isPlatform && this.collisionBox.bottom - 1 <= a.ytile.pos.y) this.pos.y = ~~this.pos.y, this.vel.y = this.falling ? a.ytile.pos.y - this.collisionBox.bottom : 0, this.falling = !1;
      else if (a.yprop.isSlope && !this.jumping) this.checkSlope(a.ytile, a.yprop.isLeftSlope), this.falling = !1;
      else {
        if (a.yprop.isBreakable) if (this.canBreakTile) {
          if (me.game.currentLevel.clearTile(a.ytile.row, a.ytile.col), this.onTileBreak) this.onTileBreak()
        } else this.pos.y = ~~this.pos.y, this.vel.y = this.falling ? a.ytile.pos.y - this.collisionBox.bottom : 0, this.falling = !1
      } else 0 > a.y && (!a.yprop.isPlatform && !a.yprop.isLadder) && (this.falling = !0, this.vel.y = 0);
      if (a.x) if (this.onladder = a.xprop.isLadder, a.xprop.isSlope && !this.jumping) this.checkSlope(a.xtile, a.xprop.isLeftSlope), this.falling = !1;
      else if (!a.xprop.isPlatform && !a.xprop.isLadder) if (a.xprop.isBreakable && this.canBreakTile) {
        if (me.game.currentLevel.clearTile(a.xtile.row, a.xtile.col), this.onTileBreak) this.onTileBreak()
      } else this.vel.x = 0;
      this.pos.add(this.vel);
      return a
    }
  });
  me.CollectableEntity = me.ObjectEntity.extend({
    init: function(a, b, c) {
      this.parent(a, b, c);
      this.collidable = !0;
      this.type = me.game.COLLECTABLE_OBJECT
    }
  });
  me.InvisibleEntity = me.Rect.extend({
    GUID: null,
    z: 0,
    collisionBox: null,
    init: function(a, b, c) {
      this.parent(new me.Vector2d(a, b), c.width, c.height);
      this.collisionBox = new me.Rect(this.pos, c.width, c.height);
      this.GUID = me.utils.createGUID();
      this.name = c.name ? c.name.toLowerCase() : "";
      this.isEntity = this.collidable = this.visible = !0
    },
    updateColRect: function(a, b, c, d) {
      this.collisionBox.adjustSize(a, b, c, d)
    },
    checkCollision: function(a) {
      var b = this.collisionBox.collideVsAABB(a.collisionBox);
      return 0 != b.x || 0 != b.y ? (this.onCollision(b, a), b.type = this.type, b.obj = this, b) : null
    },
    onCollision: function() {},
    destroy: function() {
      this.onDestroyEvent.apply(this, arguments)
    },
    onDestroyEvent: function() {},
    update: function() {
      return !1
    },
    draw: function(a) {
      me.debug.renderHitBox && (a.strokeStyle = "blue", a.strokeRect(this.pos.x - me.game.viewport.pos.x, this.pos.y - me.game.viewport.pos.y, this.width, this.height), this.collisionBox.draw(a))
    }
  });
  me.LevelEntity = me.InvisibleEntity.extend({
    init: function(a, b, c) {
      this.parent(a, b, c);
      this.nextlevel = c.to;
      this.fade = c.fade;
      this.duration = c.duration;
      this.fading = !1;
      this.gotolevel = c.to
    },
    onFadeComplete: function() {
      me.levelDirector.loadLevel(this.gotolevel);
      me.game.viewport.fadeOut(this.fade, this.duration)
    },
    goTo: function(a) {
      this.gotolevel = a || this.nextlevel;
      this.fade && this.duration ? this.fading || (this.fading = !0, me.game.viewport.fadeIn(this.fade, this.duration, this.onFadeComplete.bind(this))) : me.levelDirector.loadLevel(this.gotolevel)
    },
    onCollision: function() {
      this.goTo()
    }
  })
})(window);
(function() {
  me.Font = Object.extend({
    ALIGN: {
      LEFT: "left",
      CENTER: "center",
      RIGHT: "right"
    },
    font: null,
    height: null,
    color: null,
    align: null,
    init: function(a, d, b, c) {
      this.set(a, d, b, c)
    },
    bold: function() {
      this.font = "bold " + this.font
    },
    italic: function() {
      this.font = "italic " + this.font
    },
    set: function(a, d, b, c) {
      this.font = "" + d + "px " + a;
      this.height = d;
      this.color = b;
      this.align = c || "top"
    },
    getRect: function() {
      return new me.Rect(new Vector2d(0, 0), 0, 0)
    },
    measureText: function(a, d) {
      a.font = this.font;
      a.fillStyle = this.color;
      a.textBaseline = this.align;
      var b = a.measureText(d);
      b.height = this.height;
      return b
    },
    draw: function(a, d, b, c) {
      a.font = this.font;
      a.fillStyle = this.color;
      a.textBaseline = this.align;
      a.fillText(d, ~~b, ~~c)
    }
  });
  me.BitmapFont = me.Font.extend({
    size: null,
    sSize: null,
    firstChar: 32,
    charCount: 0,
    init: function(a, d, b, c) {
      this.parent(a, null, null);
      this.size = new me.Vector2d;
      this.sSize = new me.Vector2d;
      this.firstChar = c || 32;
      this.loadFontMetrics(a, d);
      this.align = this.ALIGN.RIGHT;
      b && this.resize(b)
    },
    loadFontMetrics: function(a, d) {
      this.font = me.loader.getImage(a);
      this.size.x = d.x || d;
      this.size.y = d.y || this.font.height;
      this.sSize.copy(this.size);
      this.charCount = ~~ (this.font.width / this.size.x)
    },
    set: function(a, d) {
      this.align = a;
      d && this.resize(d)
    },
    resize: function(a) {
      this.sSize.copy(this.size);
      this.sSize.x *= a;
      this.sSize.y *= a
    },
    measureText: function(a) {
      return {
        width: a.length * this.sSize.x,
        height: this.sSize.y
      }
    },
    draw: function(a, d, b, c) {
      d = new String(d);
      switch (this.align) {
      case this.ALIGN.RIGHT:
        b -= this.measureText(d).width;
        break;
      case this.ALIGN.CENTER:
        b -= 0.5 * this.measureText(d).width
      }
      for (var f = 0, e = d.length; f < e; f++) {
        var g = d.charCodeAt(f) - this.firstChar;
        a.drawImage(this.font, this.size.x * (g % this.charCount), this.size.y * ~~ (g / this.charCount), this.size.x, this.size.y, ~~b, ~~c, this.sSize.x, this.sSize.y);
        b += this.sSize.x
      }
    }
  })
})(window);
(function() {
  me.GUI_Object = me.SpriteObject.extend({
    isClickable: !0,
    updated: !1,
    init: function(a, d, b) {
      this.parent(a, d, "string" == typeof b.image ? me.loader.getImage(b.image) : b.image, b.spritewidth, b.spriteheight);
      me.input.registerMouseEvent("mousedown", this.collisionBox, this.clicked.bind(this))
    },
    update: function() {
      return this.updated ? (this.updated = !1, !0) : !1
    },
    clicked: function() {
      if (this.isClickable) return this.updated = !0, this.onClicked()
    },
    onClicked: function() {
      return !0
    },
    onDestroyEvent: function() {
      me.input.releaseMouseEvent("mousedown", this.collisionBox)
    }
  })
})(window);
(function(a, d) {
  me.HUD_Item = Object.extend({
    init: function(a, c, d) {
      this.pos = new me.Vector2d(a || 0, c || 0);
      this.visible = !0;
      this.defaultvalue = d || 0;
      this.value = d || 0;
      this.updated = !0
    },
    reset: function() {
      this.set(this.defaultvalue)
    },
    set: function(a) {
      this.value = a;
      return this.updated = !0
    },
    update: function(a) {
      return this.set(this.value + a)
    },
    draw: function() {}
  });
  me.HUD_Object = me.Rect.extend({
    init: function(a, c, d, e, g) {
      this.parent(new me.Vector2d(a || 0, c || 0), d || me.video.getWidth(), e || me.video.getHeight());
      this.bgcolor = g;
      this.HUDItems = {};
      this.HUDobj = [];
      this.objCount = 0;
      this.HUD_invalidated = this.visible = !0;
      this.HUDCanvasSurface = me.video.createCanvasSurface(this.width, this.height);
      this.z = 999;
      this.isPersistent = !0
    },
    addItem: function(a, c) {
      this.HUDItems[a] = c;
      this.HUDobj.push(this.HUDItems[a]);
      this.objCount++;
      this.HUD_invalidated = !0
    },
    removeItem: function(a) {
      this.HUDItems[a] && (this.HUDobj.splice(this.HUDobj.indexOf(this.HUDItems[a]), 1), this.HUDItems[a] = null, this.objCount--, this.HUD_invalidated = !0)
    },
    setItemValue: function(a, c) {
      this.HUDItems[a] && !0 == this.HUDItems[a].set(c) && (this.HUD_invalidated = !0)
    },
    updateItemValue: function(a, c) {
      this.HUDItems[a] && !0 == this.HUDItems[a].update(c) && (this.HUD_invalidated = !0)
    },
    getItemValue: function(a) {
      return this.HUDItems[a] ? this.HUDItems[a].value : 0
    },
    update: function() {
      return this.HUD_invalidated
    },
    reset: function(a) {
      a != d ? (this.HUDItems[a] && this.HUDItems[a].reset(), this.HUD_invalidated = !0) : this.resetAll()
    },
    resetAll: function() {
      for (var a = this.objCount, c; a--, c = this.HUDobj[a];) c.reset();
      this.HUD_invalidated = !0
    },
    getRect: function() {
      p = this.pos.clone();
      p.add(me.game.viewport.pos);
      return new me.Rect(p, this.width, this.height)
    },
    draw: function(a) {
      if (this.HUD_invalidated) {
        this.bgcolor ? me.video.clearSurface(this.HUDCanvasSurface, this.bgcolor) : this.HUDCanvasSurface.canvas.width = this.HUDCanvasSurface.canvas.width;
        for (var c = this.objCount, d; c--, d = this.HUDobj[c];) d.visible && (d.draw(this.HUDCanvasSurface, 0, 0), d.updated && (d.updated = !1))
      }
      c = me.game.currentLevel.pos;
      a.drawImage(this.HUDCanvasSurface.canvas, this.pos.x - c.x, this.pos.y - c.y);
      this.HUD_invalidated = !1
    }
  })
})(window);
(function() {
  var a = me,
      d = function() {
      var a = 0;
      if (me.sys.sound) {
        if (-1 != j.search(/mp3/i) && e.capabilities.mp3) return h[a];
        if (-1 != j.search(/ogg/i) && e.capabilities.ogg || -1 != j.search(/wav/i) && e.capabilities.wav) return h[++a];
        n = !1;
        return -1
      }
      n = !1
      },
      b = function(a) {
      for (var a = g[a], b = 0, c; c = a[b++];) if (c.ended || !c.currentTime) return c.currentTime = m, c;
      a[0].pause();
      a[0].currentTime = m;
      return a[0]
      },
      c = function(a, c, d) {
      var e = b(a.toLowerCase());
      e.loop = c || !1;
      e.play();
      d && !c && e.addEventListener("ended", function(a) {
        e.removeEventListener("ended", arguments.callee, !1);
        d()
      }, !1)
      },
      f = function(a, b, c) {
      c && !b && setTimeout(c, 2E3)
      },
      e = {},
      g = [],
      h = ["mp3", "ogg", "wav"],
      j = null,
      l = -1,
      r = null,
      k = null,
      n = !0,
      m = 0,
      q = 0;
  e.capabilities = {
    mp3: !1,
    ogg: !1,
    ma4: !1,
    wav: !1
  };
  e.init = function(a) {
    j = a ? new String(a) : new String("mp3");
    l = d();
    e.play = n ? c : f;
    return n
  };
  e.setLoadCallback = function(a) {
    r = a
  };
  e.isAudioEnable = function() {
    return n
  };
  e.enable = function() {
    n = me.sys.sound;
    e.play = n ? c : f
  };
  e.disable = function() {
    n = !1;
    e.play = f
  };
  e.load = function(a) {
    if (-1 == l) return 0;
    var b = new Audio(a.src + a.name + "." + l + me.nocache);
    b.preload = "auto";
    b.addEventListener("canplaythrough", function(b) {
      this.removeEventListener("canplaythrough", arguments.callee, !1);
      var c = a.name,
          d = a.channel;
      q = 0;
      if (1 < d) for (var e = g[c][0], f = 1; f < d; f++) {
        var l = e.cloneNode(!0);
        0 == l.currentSrc.length && (l.src = e.src);
        g[c][f] = l;
        g[c][f].load()
      }
      r && r()
    }, !1);
    b.addEventListener("error", function() {
      var b = a.name;
      if (3 < q++) if (b = "melonJS: failed loading " + b + "." + l, !1 === me.sys.stopOnAudioError) me.audio.disable(), r && r(), console.log(b + ", disabling audio");
      else throw b;
      else g[b][0].load()
    }, !1);
    b.src = a.src + a.name + "." + l + me.nocache;
    b.load();
    g[a.name] = [b];
    return 1
  };
  e.stop = function(a) {
    if (n) for (var a = g[a.toLowerCase()], b = a.length; b--;) a[b].pause(), a[b].currentTime = m
  };
  e.pause = function(a) {
    if (n) for (var a = g[a.toLowerCase()], b = a.length; b--;) a[b].pause()
  };
  e.playTrack = function(a) {
    if (n && (null != k && e.stopTrack(), k = b(a.toLowerCase()))) k.loop = !0, k.play()
  };
  e.stopTrack = function() {
    n && k && (k.pause(), k = null)
  };
  e.pauseTrack = function() {
    n && k && k.pause()
  };
  e.resumeTrack = function() {
    n && k && k.play()
  };
  a.audio = e
})(window);
(function() {
  var a = me,
      d = {},
      b = null,
      c = !1,
      f = 0,
      e = 0,
      g = 0,
      h = 0,
      j = 0,
      l = Math.ceil(1E3 / me.sys.fps),
      r = 1.25 * (1E3 / me.sys.fps);
  d.tick = 1;
  d.init = function() {
    b = document.getElementById("framecounter");
    c = null !== b;
    d.reset()
  };
  d.reset = function() {
    h = g = Date.now();
    f = e = 0
  };
  d.getTime = function() {
    return h
  };
  d.update = function() {
    g = h;
    h = Date.now();
    j = h - g;
    if (c && (f++, e += j, 0 == f % 10)) {
      var a = (~~ (1E3 * f / e)).clamp(0, me.sys.fps);
      b.replaceChild(document.createTextNode("(" + a + "/" + me.sys.fps + " fps)"), b.firstChild);
      f = e = 0
    }
    d.tick = j > r && me.sys.interpolation ? j / l : 1
  };
  a.timer = d;
  var a = me,
      k = {},
      n = null,
      m = null,
      q = null,
      u = null,
      i = null,
      t = !1,
      s = 0,
      x = 0;
  k.init = function(a, b, c, d, e) {
    t = d || !1;
    me.sys.scale = !0 === t ? e || 1 : 1;
    s = b * me.sys.scale;
    x = c * me.sys.scale;
    n = document.createElement("canvas");
    n.setAttribute("width", s + "px");
    n.setAttribute("height", x + "px");
    n.setAttribute("border", "0px solid black");
    i = a ? document.getElementById(a) : document.body;
    i.appendChild(n);
    if (!n.getContext) return !1;
    m = n.getContext("2d");
    t ? (u = k.createCanvasSurface(b, c), q = u.canvas) : (u = m, q = m.canvas);
    return !0
  };
  k.getWrapper = function() {
    return i
  };
  k.getWidth = function() {
    return q.width
  };
  k.getPos = function(a) {
    for (var a = a || n, b = new me.Vector2d(a.offsetLeft, a.offsetTop); a = a.offsetParent;) b.x += a.offsetLeft, b.y += a.offsetTop;
    return b
  };
  k.getHeight = function() {
    return q.height
  };
  k.createCanvasSurface = function(a, b) {
    var c = document.createElement("canvas");
    c.width = a || q.width;
    c.height = b || q.height;
    return c.getContext("2d")
  };
  k.getScreenCanvas = function() {
    return n
  };
  k.getScreenFrameBuffer = function() {
    return u
  };
  k.updateDisplaySize = function(a) {
    t && (me.sys.scale = a ? a : document.getElementById("screen size").value, s = q.width * me.sys.scale, x = q.height * me.sys.scale, n.width = s, n.height = x)
  };
  k.clearSurface = function(a, b) {
    a.save();
    a.setTransform(1, 0, 0, 1, 0, 0);
    a.fillStyle = b;
    a.fillRect(0, 0, a.canvas.width, a.canvas.height);
    a.restore()
  };
  k.scale = function(a, b) {
    a.translate(-(a.canvas.width * b - a.canvas.width >> 1), -(a.canvas.height * b - a.canvas.height >> 1));
    a.scale(b, b)
  };
  k.setAlpha = function(a, b) {
    a.globalCompositeOperation = b ? "source-over" : "copy"
  };
  k.blitSurface = function() {
    k.blitSurface = t ?
    function() {
      m.drawImage(q, 0, 0, q.width, q.height, 0, 0, s, x)
    } : function() {};
    k.blitSurface()
  };
  k.applyRGBFilter = function(a, b, c) {
    var d = k.createCanvasSurface(a.width, a.height),
        a = me.utils.getPixels(a),
        e = a.data;
    switch (b) {
    case "b&w":
      for (var b = 0, f = e.length; b < f; b += 4) c = 3 * e[b] + 4 * e[b + 1] + e[b + 2] >>> 3, e[b] = c, e[b + 1] = c, e[b + 2] = c;
      break;
    case "brightness":
      c = Math.abs(c).clamp(0, 1);
      b = 0;
      for (f = e.length; b < f; b += 4) e[b] *= c, e[b + 1] *= c, e[b + 2] *= c;
      break;
    case "transparent":
      b = 0;
      for (f = e.length; b < f; b += 4) me.utils.RGBToHex(e[b], e[b + 1], e[b + 2]) === c && (e[b + 3] = 0);
      break;
    default:
      return null
    }
    d.putImageData(a, 0, 0);
    return d
  };
  a.video = k
})(window);
(function(a) {
  var d = me,
      b = function() {
      x || (m.touches.push({
        x: 0,
        y: 0
      }), m.mouse.pos = new me.Vector2d(0, 0), m.mouse.offset = me.video.getPos(), me.sys.touch ? (me.video.getScreenCanvas().addEventListener("touchmove", l, !1), me.video.getScreenCanvas().addEventListener("touchstart", k, !1), me.video.getScreenCanvas().addEventListener("touchend", k, !1)) : (a.addEventListener("mousewheel", j, !1), me.video.getScreenCanvas().addEventListener("mousemove", l, !1), me.video.getScreenCanvas().addEventListener("mousedown", r, !1), me.video.getScreenCanvas().addEventListener("mouseup", r, !1)), x = !0)
      },
      c = function(a) {
      a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0;
      a.preventDefault ? a.preventDefault() : a.returnValue = !1
      },
      f = function(a, b) {
      var d = q[b || a.keyCode || a.which];
      return d ? (t[d] || (u[d] = !0, t[d] = i[d]), c(a), !1) : !0
      },
      e = function(a, b) {
      var d = q[b || a.keyCode || a.which];
      return d ? (u[d] = !1, t[d] = !1, c(a), !1) : !0
      },
      g = function(a) {
      var b = me.game.viewport.pos,
          c = me.game.currentLevel.pos,
          d = m.mouse.handlers[a.type];
      if (d) for (var e = 0, f = m.touches.length; e < f; e++) for (var g = m.touches[e].x, l = m.touches[e].y, k = d.length, j; k--, j = d[k];) {
        var h = !1 === j.floating ? {
          x: g + b.x - c.x,
          y: l + b.y - c.y
        } : {
          x: g,
          y: l
        };
        if ((null === j.rect || j.rect.containsPoint(h)) && !1 === j.cb(a)) break
      }
      },
      h = function(a) {
      m.touches.length = 0;
      if (a.touches) for (var b = m.mouse.offset, c = 0, d = a.changedTouches.length; c < d; c++) {
        var e = a.changedTouches[c],
            f = e.clientX - b.x,
            g = e.clientY - b.y;
        1 != me.sys.scale && (f /= me.sys.scale, g /= me.sys.scale);
        m.touches.push({
          x: f,
          y: g,
          id: e.identifier
        })
      } else {
        var b = m.mouse.offset,
            f = a.pageX - b.x,
            g = a.pageY - b.y;
        1 != me.sys.scale && (f /= me.sys.scale, g /= me.sys.scale);
        m.touches.push({
          x: f,
          y: g,
          id: 0
        })
      }
      m.mouse.pos.set(m.touches[0].x, m.touches[0].y)
      },
      j = function(a) {
      g(a);
      c(a)
      },
      l = function(a) {
      h(a);
      g(a);
      c(a)
      },
      r = function(a) {
      var b = m.mouse.bind[a.button || 0];
      g(a);
      b ? "mousedown" === a.type || "touchstart" === a.type ? f(a, b) : e(a, b) : c(a)
      },
      k = function(a) {
      h(a);
      r(a)
      },
      n = function(a) {
      m.accel = a.accelerationIncludingGravity
      },
      m = {},
      q = {},
      u = {},
      i = {},
      t = {},
      s = !1,
      x = !1,
      y = !1;
  m.accel = {
    x: 0,
    y: 0,
    z: 0
  };
  m.mouse = {
    pos: null,
    offset: null,
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
    bind: [3],
    handlers: {}
  };
  m.touches = [];
  m.KEY = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    ESC: 27,
    SPACE: 32,
    NUM0: 48,
    NUM1: 49,
    NUM2: 50,
    NUM3: 51,
    NUM4: 52,
    NUM5: 53,
    NUM6: 54,
    NUM7: 55,
    NUM8: 56,
    NUM9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90
  };
  m.isKeyPressed = function(a) {
    return u[a] ? (i[a] && (t[a] = !0, u[a] = !1), !0) : !1
  };
  m.keyStatus = function(a) {
    return !0 === t[a] ? !0 : u[a]
  };
  m.triggerKeyEvent = function(a, b) {
    b ? f({}, a) : e({}, a)
  };
  m.bindKey = function(b, c, d) {
    s || (a.addEventListener("keydown", f, !1), a.addEventListener("keyup", e, !1), s = !0);
    q[b] = c;
    u[c] = !1;
    i[c] = d ? d : !1;
    t[c] = !1
  };
  m.unbindKey = function(a) {
    u[q[a]] = !1;
    i[q[a]] = !1;
    q[a] = null
  };
  m.bindMouse = function(a, c) {
    b();
    if (!q[c]) throw "melonJS : no action defined for keycode " + c;
    m.mouse.bind[a] = c
  };
  m.unbindMouse = function(a) {
    m.mouse.bind[a] = null
  };
  m.bindTouch = function() {
    object.bindMouse(me.input.mouse.LEFT, keycode)
  };
  m.unbindTouch = function() {
    m.unbindMouse(me.input.mouse.LEFT)
  };
  m.registerMouseEvent = function(a, c, d, e) {
    b();
    switch (a) {
    case "mousewheel":
    case "mousemove":
    case "mousedown":
    case "mouseup":
    case "touchmove":
    case "touchstart":
    case "touchend":
      me.sys.touch && ("mousemove" == a ? a = "touchmove" : "mousedown" == a ? a = "touchstart" : "mouseup" == a && (a = "touchend"));
      m.mouse.handlers[a] || (m.mouse.handlers[a] = []);
      m.mouse.handlers[a].push({
        rect: c || null,
        cb: d,
        floating: !0 === e ? !0 : !1
      });
      break;
    default:
      throw "melonJS : invalid event type : " + a;
    }
  };
  m.releaseMouseEvent = function(a, b) {
    switch (a) {
    case "mousewheel":
    case "mousemove":
    case "mousedown":
    case "mouseup":
    case "touchmove":
    case "touchstart":
    case "touchend":
      me.sys.touch && ("mousemove" == a ? a = "touchmove" : "mousedown" == a ? a = "touchstart" : "mouseup" == a && (a = "touchend"));
      var c = m.mouse.handlers[a];
      if (c) for (var d = c.length, e; d--, e = c[d];) e.rect === b && (e.rect = e.cb = e.floating = null, m.mouse.handlers[a].splice(d, 1));
      break;
    default:
      throw "melonJS : invalid event type : " + a;
    }
  };
  m.watchAccelerometer = function() {
    return a.sys.gyro ? (y || (a.addEventListener("devicemotion", n, !1), y = !0), !0) : !1
  };
  m.unwatchAccelerometer = function() {
    y && (a.removeEventListener("devicemotion", n, !1), y = !1)
  };
  d.input = m
})(window);
(function(a) {
  var d = {
    decode: function(b) {
      b = b.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      if (me.sys.nativeBase64) return a.atob(b);
      for (var c = [], d, e, f, g, j, h = 0; h < b.length;) d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(h++)), e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(h++)), g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(h++)), j = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(h++)), d = d << 2 | e >> 4, e = (e & 15) << 4 | g >> 2, f = (g & 3) << 6 | j, c.push(String.fromCharCode(d)), 64 != g && c.push(String.fromCharCode(e)), 64 != j && c.push(String.fromCharCode(f));
      return c = c.join("")
    }
  },
      b = me,
      c = {},
      f = {},
      e = "",
      g = 0,
      h = /^.*(\\|\/|\:)/,
      j = /\.[^\.]*$/;
  c.decodeBase64 = function(a) {
    return d.decode(a)
  };
  c.decodeBase64AsArray = function(a, b) {
    var b = b || 1,
        c = d.decode(a),
        e = [],
        f, g, j;
    f = 0;
    for (j = c.length / b; f < j; f++) {
      e[f] = 0;
      for (g = b - 1; 0 <= g; --g) e[f] += c.charCodeAt(f * b + g) << (g << 3)
    }
    return e
  };
  c.decodeCSV = function(a, b) {
    for (var a = a.trim().split("\n"), c = [], d = 0; d < a.length; d++) {
      entries = a[d].split(",", b);
      for (var e = 0; e < entries.length; e++) c.push(+entries[e])
    }
    return c
  };
  c.getBasename = function(a) {
    return a.replace(h, "").replace(j, "")
  };
  c.setNocache = function(a) {
    me.nocache = a ? "?" + parseInt(1E7 * Math.random()) : ""
  };
  c.HexToRGB = function(a, b) {
    if ("#" !== a.charAt(0)) return a;
    a = a.substring(1, a.length);
    if (null == f[a]) {
      if (6 > a.length) var c = a.charAt(0) + a.charAt(0),
          d = a.charAt(1) + a.charAt(1),
          e = a.charAt(2) + a.charAt(2);
      else c = a.substring(0, 2), d = a.substring(2, 4), e = a.substring(4, 6);
      f[a] = parseInt(c, 16) + "," + parseInt(d, 16) + "," + parseInt(e, 16)
    }
    return (b ? "rgba(" : "rgb(") + f[a] + (b ? "," + b + ")" : ")")
  };
  c.RGBToHex = function(a, b, c) {
    return a.toHex() + b.toHex() + c.toHex()
  };
  c.getPixels = function(a) {
    if (a instanceof HTMLImageElement) {
      var b = me.video.createCanvasSurface(a.width, a.height);
      b.drawImage(a, 0, 0);
      return b.getImageData(0, 0, a.width, a.height)
    }
    return a.getContext("2d").getImageData(0, 0, a.width, a.height)
  };
  c.resetGUID = function(a) {
    e = a.toString().toUpperCase().toHex();
    g = 0
  };
  c.createGUID = function() {
    return e + "-" + g++
  };
  c.applyFriction = function(a, b) {
    return 0 > a + b ? a + b * me.timer.tick : 0 < a - b ? a - b * me.timer.tick : 0
  };
  b.utils = c
})(window);
(function(a, d) {
  function b(a) {
    this.defaultvalue = a || 0;
    this.value = a || 0;
    this.updated = !0
  }
  b.prototype.reset = function() {
    this.set(this.defaultvalue)
  };
  b.prototype.update = function(a) {
    return this.set(this.value + a)
  };
  b.prototype.set = function(a) {
    this.value = a;
    return this.updated = !0
  };
  var c = me,
      f = {},
      e = {},
      g = [],
      h = 0;
  f.add = function(a, c) {
    if (a.constructor === Object) for (var d in a) {
      var f = d;
      e[f] = new b(a[d]);
      g.push(e[f]);
      h++
    } else e[a] = new b(c), g.push(e[a]), h++
  };
  f.updateValue = function(a, b) {
    if (a.constructor === Object) for (var c in a) e[c] && e[c].update(a[c]);
    else e[a] && e[a].update(b)
  };
  f.setValue = function(a, b) {
    if (a.constructor === Object) for (var c in a) e[c] && e[c].set(a[c]);
    else e[a] && e[a].set(b)
  };
  f.getItemValue = function(a) {
    return e[a] ? e[a].value : 0
  };
  f.reset = function(a) {
    a != d ? e[a] && e[a].reset() : f.resetAll()
  };
  f.resetAll = function() {
    for (var a = h, b; a--, b = g[a];) b.reset()
  };
  c.gamestat = f
})(window);
(function() {
  me.LevelConstants = {
    COLLISION_MAP: "collision",
    PARALLAX_MAP: "parallax"
  };
  me.TMX_TAG_MAP = "map";
  me.TMX_TAG_NAME = "name";
  me.TMX_TAG_VALUE = "value";
  me.TMX_TAG_VERSION = "version";
  me.TMX_TAG_ORIENTATION = "orientation";
  me.TMX_TAG_WIDTH = "width";
  me.TMX_TAG_HEIGHT = "height";
  me.TMX_TAG_OPACITY = "opacity";
  me.TMX_TAG_TRANS = "trans";
  me.TMX_TAG_TILEWIDTH = "tilewidth";
  me.TMX_TAG_TILEHEIGHT = "tileheight";
  me.TMX_TAG_TILEOFFSET = "tileoffset";
  me.TMX_TAG_FIRSTGID = "firstgid";
  me.TMX_TAG_GID = "gid";
  me.TMX_TAG_TILE = "tile";
  me.TMX_TAG_ID = "id";
  me.TMX_TAG_DATA = "data";
  me.TMX_TAG_COMPRESSION = "compression";
  me.TMX_TAG_ENCODING = "encoding";
  me.TMX_TAG_ATTR_BASE64 = "base64";
  me.TMX_TAG_CSV = "csv";
  me.TMX_TAG_SPACING = "spacing";
  me.TMX_TAG_MARGIN = "margin";
  me.TMX_TAG_PROPERTIES = "properties";
  me.TMX_TAG_PROPERTY = "property";
  me.TMX_TAG_IMAGE = "image";
  me.TMX_TAG_SOURCE = "source";
  me.TMX_TAG_VISIBLE = "visible";
  me.TMX_TAG_TILESET = "tileset";
  me.TMX_TAG_LAYER = "layer";
  me.TMX_TAG_IMAGE_LAYER = "imagelayer";
  me.TMX_TAG_OBJECTGROUP = "objectgroup";
  me.TMX_TAG_OBJECT = "object";
  me.TMX_TAG_X = "x";
  me.TMX_TAG_Y = "y";
  me.TMX_TAG_WIDTH = "width";
  me.TMX_TAG_HEIGHT = "height";
  me.TMX_TAG_POLYGON = "polygon";
  me.TMX_TAG_POLYLINE = "polyline";
  me.TMX_TAG_POINTS = "points";
  me.TMX_BACKGROUND_COLOR = "backgroundcolor"
})(window);
(function(a, d) {
  me.TMXUtils = {
    setTMXProperties: function(a, c) {
      var d = c.getElementsByTagName(me.TMX_TAG_PROPERTIES)[0];
      if (d) for (var d = d.getElementsByTagName(me.TMX_TAG_PROPERTY), e = 0; e < d.length; e++) {
        var g = me.XMLParser.getStringAttribute(d[e], me.TMX_TAG_NAME),
            h = me.XMLParser.getStringAttribute(d[e], me.TMX_TAG_VALUE);
        !h || h.isBoolean() ? h = h ? "true" == h : !0 : h.isNumeric() && (h = Number(h));
        a[g] = h
      }
    },
    mergeProperties: function(a, c, f) {
      for (var e in c) if (f || a[e] === d) a[e] = c[e];
      return a
    }
  }
})(window);
(function() {
  me.TMXOBjectGroup = Object.extend({
    init: function(a, d, b, c) {
      this.objects = [];
      this.name = a;
      this.width = me.XMLParser.getIntAttribute(d, me.TMX_TAG_WIDTH);
      this.height = me.XMLParser.getIntAttribute(d, me.TMX_TAG_HEIGHT);
      this.visible = 1 == me.XMLParser.getIntAttribute(d, me.TMX_TAG_VISIBLE, 1);
      this.z = c;
      d.firstChild && d.firstChild.nextSibling.nodeName === me.TMX_TAG_PROPERTIES && me.TMXUtils.setTMXProperties(this, d);
      a = d.getElementsByTagName(me.TMX_TAG_OBJECT);
      for (d = 0; d < a.length; d++) this.objects.push(new me.TMXOBject(a[d], b, c))
    },
    reset: function() {
      this.objects = null
    },
    getObjectCount: function() {
      return this.objects.length
    },
    getObjectByIndex: function(a) {
      return this.objects[a]
    }
  });
  me.TMXOBject = Object.extend({
    init: function(a, d, b) {
      this.name = me.XMLParser.getStringAttribute(a, me.TMX_TAG_NAME);
      this.x = me.XMLParser.getIntAttribute(a, me.TMX_TAG_X);
      this.y = me.XMLParser.getIntAttribute(a, me.TMX_TAG_Y);
      this.z = b;
      this.width = me.XMLParser.getIntAttribute(a, me.TMX_TAG_WIDTH, 0);
      this.height = me.XMLParser.getIntAttribute(a, me.TMX_TAG_HEIGHT, 0);
      if (this.gid = me.XMLParser.getIntAttribute(a, me.TMX_TAG_GID, null)) d = d.getTilesetByGid(this.gid), this.width = d.tilewidth, this.height = d.tileheight, this.spritewidth = this.width, this.y -= this.height, b = new me.Tile(this.x, this.y, d.tilewidth, d.tileheight, this.gid), this.image = d.getTileImage(b);
      else if (d = a.getElementsByTagName(me.TMX_TAG_POLYGON), this.isPolygon = !0, d.length || (d = a.getElementsByTagName(me.TMX_TAG_POLYLINE), this.isPolygon = !1), d.length) {
        this.points = [];
        for (var d = me.XMLParser.getStringAttribute(d[0], me.TMX_TAG_POINTS).split(" "), b = 0, c; b < d.length; b++) c = d[b].split(","), this.points[b] = new me.Vector2d(+c[0], +c[1])
      }
      me.TMXUtils.setTMXProperties(this, a)
    },
    getObjectPropertyByName: function(a) {
      return this[a]
    }
  })
})(window);
(function() {
  me.Tile = me.Rect.extend({
    tileId: null,
    init: function(a, d, b, c, f) {
      this.parent(new me.Vector2d(a * b, d * c), b, c);
      this.row = a;
      this.col = d;
      this.tileId = f;
      this.flipX = 0 !== (this.tileId & 2147483648);
      this.flipY = 0 !== (this.tileId & 1073741824);
      this.flipAD = 0 !== (this.tileId & 536870912);
      this.flipped = this.flipX || this.flipY || this.flipAD;
      this.tileId &= 536870911
    }
  });
  me.Tileset = Object.extend({
    init: function(a, d, b, c, f, e) {
      this.name = a;
      this.tilewidth = d;
      this.tileheight = b;
      this.spacing = c;
      this.margin = f;
      (this.image = e ? me.loader.getImage(me.utils.getBasename(e)) : null) || console.log("melonJS: '" + e + "' file for tileset '" + this.name + "' not found!");
      this.type = {
        SOLID: "solid",
        PLATFORM: "platform",
        L_SLOPE: "lslope",
        R_SLOPE: "rslope",
        LADDER: "ladder",
        BREAKABLE: "breakable"
      };
      this.TileProperties = [];
      this.tileXOffset = [];
      this.tileYOffset = [];
      this.image && (this.hTileCount = ~~ ((this.image.width - this.margin) / (this.tilewidth + this.spacing)), this.vTileCount = ~~ ((this.image.height - this.margin) / (this.tileheight + this.spacing)))
    },
    getPropertyList: function() {
      return {
        isCollidable: !1,
        isSolid: !1,
        isPlatform: !1,
        isSlope: !1,
        isLeftSlope: !1,
        isRightSlope: !1,
        isLadder: !1,
        isBreakable: !1
      }
    },
    getTileProperties: function(a) {
      return this.TileProperties[a]
    },
    isTileCollidable: function(a) {
      return this.TileProperties[a].isCollidable
    },
    getTileOffsetX: function(a) {
      null == this.tileXOffset[a] && (this.tileXOffset[a] = this.margin + (this.spacing + this.tilewidth) * (a % this.hTileCount));
      return this.tileXOffset[a]
    },
    getTileOffsetY: function(a) {
      null == this.tileYOffset[a] && (this.tileYOffset[a] = this.margin + (this.spacing + this.tileheight) * ~~ (a / this.hTileCount));
      return this.tileYOffset[a]
    }
  });
  me.TMXTileset = me.Tileset.extend({
    init: function(a) {
      this.firstgid = me.XMLParser.getIntAttribute(a, me.TMX_TAG_FIRSTGID);
      this.parent(me.XMLParser.getStringAttribute(a, me.TMX_TAG_NAME), me.XMLParser.getIntAttribute(a, me.TMX_TAG_TILEWIDTH), me.XMLParser.getIntAttribute(a, me.TMX_TAG_TILEHEIGHT), me.XMLParser.getIntAttribute(a, me.TMX_TAG_SPACING, 0), me.XMLParser.getIntAttribute(a, me.TMX_TAG_MARGIN, 0), a.getElementsByTagName(me.TMX_TAG_IMAGE)[0].getAttribute(me.TMX_TAG_SOURCE));
      this.lastgid = this.firstgid + (this.hTileCount * this.vTileCount - 1 || 0);
      this.trans = a.getElementsByTagName(me.TMX_TAG_IMAGE)[0].getAttribute(me.TMX_TAG_TRANS);
      null !== this.trans && this.image && (this.image = me.video.applyRGBFilter(this.image, "transparent", this.trans.toUpperCase()).canvas);
      this.tileoffset = new me.Vector2d(0, 0);
      var d = a.getElementsByTagName(me.TMX_TAG_TILEOFFSET);
      0 < d.length && (this.tileoffset.x = me.XMLParser.getIntAttribute(d[0], me.TMX_TAG_X), this.tileoffset.y = me.XMLParser.getIntAttribute(d[0], me.TMX_TAG_Y));
      a = a.getElementsByTagName(me.TMX_TAG_TILE);
      for (d = 0; d < a.length; d++) {
        var b = me.XMLParser.getIntAttribute(a[d], me.TMX_TAG_ID) + this.firstgid;
        this.TileProperties[b] = {};
        b = this.TileProperties[b];
        me.TMXUtils.setTMXProperties(b, a[d]);
        b.isSolid = b.type ? b.type.toLowerCase() === this.type.SOLID : !1;
        b.isPlatform = b.type ? b.type.toLowerCase() === this.type.PLATFORM : !1;
        b.isLeftSlope = b.type ? b.type.toLowerCase() === this.type.L_SLOPE : !1;
        b.isRightSlope = b.type ? b.type.toLowerCase() === this.type.R_SLOPE : !1;
        b.isBreakable = b.type ? b.type.toLowerCase() === this.type.BREAKABLE : !1;
        b.isLadder = b.type ? b.type.toLowerCase() === this.type.LADDER : !1;
        b.isSlope = b.isLeftSlope || b.isRightSlope;
        b.isCollidable = b.isSolid || b.isPlatform || b.isSlope || b.isLadder || b.isBreakable
      }
    },
    contains: function(a) {
      return a >= this.firstgid && a <= this.lastgid
    },
    getTileImage: function(a) {
      var d = me.video.createCanvasSurface(this.tilewidth, this.tileheight);
      this.drawTile(d, 0, 0, a);
      return d.canvas
    },
    drawTile: function(a, d, b, c) {
      if (c.flipped) {
        var f = 1,
            e = 0,
            g = 0,
            h = 1,
            j = d,
            l = b,
            d = b = 0;
        a.save();
        c.flipAD && (f = 0, g = e = 1, h = 0, l += this.tileheight - this.tilewidth);
        c.flipX && (f = -f, g = -g, j += c.flipAD ? this.tileheight : this.tilewidth);
        c.flipY && (e = -e, h = -h, l += c.flipAD ? this.tilewidth : this.tileheight);
        a.transform(f, e, g, h, j, l)
      }
      f = c.tileId - this.firstgid;
      a.drawImage(this.image, this.getTileOffsetX(f), this.getTileOffsetY(f), this.tilewidth, this.tileheight, d, b, this.tilewidth, this.tileheight);
      c.flipped && a.restore()
    }
  });
  me.TMXTilesetGroup = Object.extend({
    init: function() {
      this.tilesets = []
    },
    add: function(a) {
      this.tilesets.push(a)
    },
    getTilesetByIndex: function(a) {
      return this.tilesets[a]
    },
    getTilesetByGid: function(a) {
      for (var d = -1, b = 0, c = this.tilesets.length; b < c; b++) {
        if (this.tilesets[b].contains(a)) return this.tilesets[b];
        this.tilesets[b].firstgid == this.tilesets[b].lastgid && a >= this.tilesets[b].firstgid && (d = b)
      }
      if (-1 != d) return this.tilesets[d];
      throw "no matching tileset found for gid " + a;
    }
  })
})(window);
(function() {
  me.TMXOrthogonalRenderer = Object.extend({
    init: function(a, d, b, c) {
      this.width = a;
      this.height = d;
      this.tilewidth = b;
      this.tileheight = c
    },
    pixelToTileCoords: function(a, d) {
      return new me.Vector2d(a / this.tilewidth, d / this.tileheight)
    },
    tileToPixelCoords: function(a, d) {
      return new me.Vector2d(a * this.tilewidth, d * this.tileheight)
    },
    drawTile: function(a, d, b, c, f) {
      f.drawTile(a, f.tileoffset.x + d * this.tilewidth, f.tileoffset.y + (b + 1) * this.tileheight - f.tileheight, c)
    },
    drawTileLayer: function(a, d, b, c) {
      var f = this.pixelToTileCoords(b.x + c.pos.x, b.y + c.pos.y).floorSelf(),
          b = this.pixelToTileCoords(b.x + c.pos.x + c.width + this.tilewidth, b.y + c.pos.y + c.height + this.tileheight).ceilSelf();
      b.x = b.x > this.width ? this.width : b.x;
      b.y = b.y > this.height ? this.height : b.y;
      for (c = f.y; c < b.y; c++) for (var e = f.x; e < b.x; e++) {
        var g = d.layerData[e][c];
        g && (d.tileset.contains(g.tileId) || (d.tileset = d.tilesets.getTilesetByGid(g.tileId)), this.drawTile(a, e, c, g, d.tileset))
      }
    }
  });
  me.TMXIsometricRenderer = Object.extend({
    init: function(a, d, b, c) {
      this.width = a;
      this.height = d;
      this.tilewidth = b;
      this.tileheight = c;
      this.hTilewidth = b / 2;
      this.hTileheight = c / 2;
      this.ratio = this.tilewidth / this.tileheight;
      this.originX = this.height * this.hTilewidth
    },
    pixelToTileCoords: function(a, d) {
      a -= this.originX;
      return new me.Vector2d((d + a / this.ratio) / this.tileheight, (d - a / this.ratio) / this.tileheight)
    },
    tileToPixelCoords: function(a, d) {
      return new me.Vector2d((a - d) * this.hTilewidth + this.originX, (a + d) * this.hTileheight)
    },
    drawTile: function(a, d, b, c, f) {
      f.drawTile(a, (this.width - 1) * f.tilewidth + (d - b) * f.tilewidth >> 1, -f.tilewidth + (d + b) * f.tileheight >> 2, c)
    },
    drawTileLayer: function(a, d, b, c) {
      var f = d.tileset,
          e = f.tileoffset,
          g = this.pixelToTileCoords(b.x + c.pos.x - f.tilewidth, b.y + c.pos.y - f.tileheight).floorSelf(),
          h = this.pixelToTileCoords(b.x + c.pos.x + c.width + f.tilewidth, b.y + c.pos.y + c.height + f.tileheight).ceilSelf(),
          h = this.tileToPixelCoords(h.x, h.y),
          j = this.tileToPixelCoords(g.x, g.y);
      j.x -= this.hTilewidth;
      j.y += this.tileheight;
      var l = j.y - c.pos.y + b.y > this.hTileheight,
          b = c.pos.x + b.x - j.x < this.hTilewidth;
      l && (b ? (g.x--, j.x -= this.hTilewidth) : (g.y--, j.x += this.hTilewidth), j.y -= this.hTileheight);
      b ^= l;
      c = g.clone();
      for (l = j.y; l - this.tileheight < h.y; l += this.hTileheight) {
        c.setV(g);
        for (var r = j.x; r < h.x; r += this.tilewidth) {
          if (0 <= c.x && 0 <= c.y && c.x < this.width && c.y < this.height) {
            var k = d.layerData[c.x][c.y];
            k && (f.contains(k.tileId) || (f = d.tileset = d.tilesets.getTilesetByGid(k.tileId), e = f.tileoffset), f.drawTile(a, e.x + r, e.y + l - f.tileheight, k))
          }
          c.x++;
          c.y--
        }
        b ? (g.y++, j.x -= this.hTilewidth, b = !1) : (g.x++, j.x += this.hTilewidth, b = !0)
      }
    }
  })
})(window);
(function(a, d) {
  me.ColorLayer = Object.extend({
    init: function(a, c, d) {
      this.name = a;
      this.color = me.utils.HexToRGB(c);
      this.z = d;
      this.visible = !0;
      this.opacity = 1
    },
    reset: function() {},
    update: function() {
      return !1
    },
    draw: function(a, c) {
      a.fillStyle = this.color;
      var f = d.currentLevel.pos;
      a.fillRect(c.left - f.x, c.top - f.y, c.width, c.height)
    }
  });
  me.ImageLayer = Object.extend({
    init: function(a, c, f, e, g, h) {
      this.name = a;
      (this.image = e ? me.loader.getImage(me.utils.getBasename(e)) : null) || console.log("melonJS: '" + e + "' file for Image Layer '" + this.name + "' not found!");
      this.imagewidth = this.image.width;
      this.imageheight = this.image.height;
      this.z = g;
      this.ratio = h || 0;
      this.lastpos = d.viewport.pos.clone();
      this.offset = new me.Vector2d(0, 0);
      this.width = c ? Math.min(d.viewport.width, c) : d.viewport.width;
      this.height = f ? Math.min(d.viewport.height, f) : d.viewport.height;
      this.visible = !0;
      this.opacity = 1
    },
    reset: function() {
      this.offset = this.viewport = this.lastpos = this.image = null
    },
    update: function() {
      if (0 !== this.ratio) {
        var a = d.viewport.pos;
        if (!this.lastpos.equals(a)) return this.offset.x = (this.imagewidth + this.offset.x + (a.x - this.lastpos.x) * this.ratio) % this.imagewidth, this.offset.y = (this.imageheight + this.offset.y + (a.y - this.lastpos.y) * this.ratio) % this.imageheight, this.lastpos.setV(a), !0
      }
      return !1
    },
    draw: function(a, c) {
      1 > this.opacity && (a.globalAlpha = this.opacity);
      if (0 === this.ratio) j = Math.min(c.width, this.imagewidth), l = Math.min(c.height, this.imageheight), a.drawImage(this.image, c.left, c.top, j, l, c.left, c.top, j, l);
      else {
        var d = ~~this.offset.x,
            e = ~~this.offset.y,
            g = 0,
            h = 0,
            j = Math.min(this.imagewidth - ~~this.offset.x, this.width),
            l = Math.min(this.imageheight - ~~this.offset.y, this.height);
        do {
          do a.drawImage(this.image, d, e, j, l, g, h, j, l), e = 0, h += l, l = Math.min(this.imageheight, this.height - h);
          while (h < this.height);
          g += j;
          if (g >= this.width) break;
          d = 0;
          j = Math.min(this.imagewidth, this.width - g);
          e = ~~this.offset.y;
          h = 0;
          l = Math.min(this.imageheight - ~~this.offset.y, this.height)
        } while (1)
      }
      a.globalAlpha = 1
    }
  });
  CollisionTiledLayer = Object.extend({
    init: function(a, c) {
      this.realwidth = a;
      this.realheight = c;
      this.isCollisionMap = !0
    },
    reset: function() {},
    checkCollision: function(a, c) {
      var d = 0 > c.x ? a.left + c.x : a.right + c.x,
          e = 0 > c.y ? a.top + c.y : a.bottom + c.y,
          g = {
          x: 0,
          y: 0,
          xprop: {},
          yprop: {}
          };
      if (0 >= d || d >= this.realwidth) g.x = c.x;
      if (0 >= e || e >= this.realheight) g.y = c.y;
      return g
    }
  });
  me.TiledLayer = Object.extend({
    init: function(a, c, d, e, g, h) {
      this.width = a;
      this.height = c;
      this.tilewidth = d;
      this.tileheight = e;
      this.realwidth = this.width * this.tilewidth;
      this.realheight = this.height * this.tileheight;
      this.z = h;
      this.name = null;
      this.visible = !1;
      this.layerData = null;
      this.tileset = (this.tilesets = g) ? this.tilesets.getTilesetByIndex(0) : null
    },
    reset: function() {
      this.tilesets = this.tileset = this.layerData = null
    },
    initArray: function() {
      this.layerData = [];
      for (var a = 0; a < this.width; a++) {
        this.layerData[a] = [];
        for (var c = 0; c < this.height; c++) this.layerData[a][c] = null
      }
    },
    getTileId: function(a, c) {
      var d = this.getTile(a, c);
      return d ? d.tileId : null
    },
    getTile: function(a, c) {
      return this.layerData[~~ (a / this.tilewidth)][~~ (c / this.tileheight)]
    },
    setTile: function(a, c, d) {
      this.layerData[a][c] = new me.Tile(a, c, this.tilewidth, this.tileheight, d)
    },
    clearTile: function(a, c) {
      this.layerData[a][c] = null
    },
    checkCollision: function(a, c) {
      var d = 0 > c.x ? ~~ (a.left + c.x) : Math.ceil(a.right - 1 + c.x),
          e = 0 > c.y ? ~~ (a.top + c.y) : Math.ceil(a.bottom - 1 + c.y),
          g = {
          x: 0,
          xtile: void 0,
          xprop: {},
          y: 0,
          ytile: void 0,
          yprop: {}
          };
      0 >= d || d >= this.realwidth ? g.x = c.x : 0 != c.x && (g.xtile = this.getTile(d, Math.ceil(a.bottom - 1)), g.xtile && this.tileset.isTileCollidable(g.xtile.tileId) ? (g.x = c.x, g.xprop = this.tileset.getTileProperties(g.xtile.tileId)) : (g.xtile = this.getTile(d, ~~a.top), g.xtile && this.tileset.isTileCollidable(g.xtile.tileId) && (g.x = c.x, g.xprop = this.tileset.getTileProperties(g.xtile.tileId))));
      0 != c.y && (g.ytile = this.getTile(0 > c.x ? ~~a.left : Math.ceil(a.right - 1), e), g.ytile && this.tileset.isTileCollidable(g.ytile.tileId) ? (g.y = c.y || 1, g.yprop = this.tileset.getTileProperties(g.ytile.tileId)) : (g.ytile = this.getTile(0 > c.x ? Math.ceil(a.right - 1) : ~~a.left, e), g.ytile && this.tileset.isTileCollidable(g.ytile.tileId) && (g.y = c.y || 1, g.yprop = this.tileset.getTileProperties(g.ytile.tileId))));
      return g
    },
    update: function() {
      return !1
    }
  });
  me.TMXLayer = me.TiledLayer.extend({
    init: function(a, c, d, e, g, h) {
      this.parent(me.XMLParser.getIntAttribute(a, me.TMX_TAG_WIDTH), me.XMLParser.getIntAttribute(a, me.TMX_TAG_HEIGHT), c, d, g, h);
      this.orientation = e;
      this.name = me.XMLParser.getStringAttribute(a, me.TMX_TAG_NAME);
      this.visible = 1 == me.XMLParser.getIntAttribute(a, me.TMX_TAG_VISIBLE, 1);
      this.opacity = me.XMLParser.getFloatAttribute(a, me.TMX_TAG_OPACITY, 1).clamp(0, 1);
      me.TMXUtils.setTMXProperties(this, a);
      void 0 === this.preRender && (this.preRender = me.sys.preRender);
      if ((this.isCollisionMap = this.name.toLowerCase().contains(me.LevelConstants.COLLISION_MAP)) && !me.debug.renderCollisionMap) this.visible = !1;
      a = a.getElementsByTagName(me.TMX_TAG_DATA)[0];
      c = me.XMLParser.getStringAttribute(a, me.TMX_TAG_ENCODING, null);
      d = me.XMLParser.getStringAttribute(a, me.TMX_TAG_COMPRESSION, null);
      "" == c && (c = null);
      "" == d && (d = null);
      if (this.visible) {
        switch (this.orientation) {
        case "orthogonal":
          this.renderer = new me.TMXOrthogonalRenderer(this.width, this.height, this.tilewidth, this.tileheight);
          break;
        case "isometric":
          this.renderer = new me.TMXIsometricRenderer(this.width, this.height, this.tilewidth, this.tileheight);
          break;
        default:
          throw "melonJS: " + this.orientation + " type TMX Tile Map not supported!";
        }
        this.preRender && (this.layerSurface = me.video.createCanvasSurface(this.width * this.tilewidth, this.height * this.tileheight), this.layerCanvas = this.layerSurface.canvas, this.layerSurface.globalAlpha = this.opacity)
      }
      if (this.visible || this.isCollisionMap) this.initArray(), this.fillArray(a, c, d)
    },
    reset: function() {
      this.preRender && (this.layerSurface = this.layerCanvas = null);
      this.renderer = null;
      this.parent()
    },
    fillArray: function(a, c, d) {
      switch (d) {
      case null:
        switch (c) {
        case null:
          a = a.getElementsByTagName(me.TMX_TAG_TILE);
          break;
        case me.TMX_TAG_CSV:
        case me.TMX_TAG_ATTR_BASE64:
          for (var d = "", e = 0, g = a.childNodes.length; e < g; e++) d += a.childNodes[e].nodeValue;
          a = c == me.TMX_TAG_ATTR_BASE64 ? me.utils.decodeBase64AsArray(d, 4) : me.utils.decodeCSV(d, this.width);
          break;
        default:
          throw "melonJS: TMX Tile Map " + c + " encoding not supported!";
        }
        break;
      default:
        throw "melonJS: " + d + " compressed TMX Tile Map not supported!";
      }
      for (e = d = 0; e < this.height; e++) for (g = 0; g < this.width; g++) {
        var h = null == c ? me.XMLParser.getIntAttribute(a[d++], me.TMX_TAG_GID) : a[d++];
        0 !== h && (h = new me.Tile(g, e, this.tilewidth, this.tileheight, h), this.layerData[g][e] = h, this.tileset.contains(h.tileId) || (this.tileset = this.tilesets.getTilesetByGid(h.tileId)), this.visible && this.preRender && this.renderer.drawTile(this.layerSurface, g, e, h, this.tileset))
      }
    },
    clearTile: function(a, c) {
      this.parent(a, c);
      this.visible && this.preRender && this.layerSurface.clearRect(a * this.tilewidth, c * this.tileheight, this.tilewidth, this.tileheight)
    },
    draw: function(a, c) {
      var f = d.viewport.pos;
      if (this.preRender) {
        var e = Math.min(c.width, this.realwidth),
            g = Math.min(c.height, this.realheight);
        a.drawImage(this.layerCanvas, f.x + c.pos.x, f.y + c.pos.y, e, g, c.pos.x, c.pos.y, e, g)
      } else a.save(), 1 > this.opacity && (a.globalAlpha = this.opacity), a.translate(-f.x, -f.y), this.renderer.drawTileLayer(a, this, f, c), a.restore()
    }
  })
})(window, me.game);
(function() {
  me.TileMap = Object.extend({
    init: function(a, d) {
      this.pos = new me.Vector2d(a, d);
      this.z = 0;
      this.name = null;
      this.height = this.width = 0;
      this.realheight = this.realwidth = -1;
      this.tileheight = this.tilewidth = 0;
      this.tilesets = null;
      this.mapLayers = [];
      this.objectGroups = [];
      this.initialized = !1
    },
    reset: function() {
      this.tilesets = null;
      this.mapLayers.length = 0;
      this.objectGroups.length = 0;
      this.pos.set(0, 0);
      this.initialized = !1
    },
    getObjectGroupByName: function(a) {
      return this.objectGroups[a]
    },
    getObjectGroups: function() {
      return this.objectGroups
    },
    getLayers: function() {
      return this.mapLayers
    },
    getLayerByName: function(a) {
      for (var d = null, a = a.trim().toLowerCase(), b = this.mapLayers.length; b--;) if (this.mapLayers[b].name.toLowerCase().contains(a)) {
        d = this.mapLayers[b];
        break
      }
      a.toLowerCase().contains(me.LevelConstants.COLLISION_MAP) && null == d && (d = new CollisionTiledLayer(me.game.currentLevel.realwidth, me.game.currentLevel.realheight));
      return d
    },
    clearTile: function(a, d) {
      for (var b = this.mapLayers.length; b--;) this.mapLayers[b].visible && this.mapLayers[b] instanceof
      me.TiledLayer && this.mapLayers[b].clearTile(a, d)
    }
  });
  me.TMXTileMap = me.TileMap.extend({
    init: function(a, d, b) {
      this.parent(d, b);
      this.xmlMap = me.loader.getXML(a);
      if (!this.xmlMap) throw "melonJS:" + a + " TMX map not found";
      this.orientation = this.version = "";
      this.tilesets = null
    },
    reset: function() {
      if (!0 === this.initialized) {
        for (var a = this.mapLayers.length; a--;) this.mapLayers[a].reset(), this.mapLayers[a] = null;
        for (a = this.objectGroups.length; a--;) this.objectGroups[a].reset(), this.objectGroups[a] = null;
        this.parent();
        this.initialized = !1
      }
    },
    load: function() {
      if (!this.initialized) {
        var a = 0,
            d = 0.25;
        me.XMLParser.parseFromString(this.xmlMap);
        for (var b = me.XMLParser.getAllTagElements(), c = 0; c < b.length; c++) switch (b.item(c).nodeName) {
        case me.TMX_TAG_MAP:
          var f = b.item(c);
          this.version = me.XMLParser.getStringAttribute(f, me.TMX_TAG_VERSION);
          this.orientation = me.XMLParser.getStringAttribute(f, me.TMX_TAG_ORIENTATION);
          this.width = me.XMLParser.getIntAttribute(f, me.TMX_TAG_WIDTH);
          this.height = me.XMLParser.getIntAttribute(f, me.TMX_TAG_HEIGHT);
          this.tilewidth = me.XMLParser.getIntAttribute(f, me.TMX_TAG_TILEWIDTH);
          this.tileheight = me.XMLParser.getIntAttribute(f, me.TMX_TAG_TILEHEIGHT);
          this.realwidth = this.width * this.tilewidth;
          this.realheight = this.height * this.tileheight;
          this.backgroundcolor = me.XMLParser.getStringAttribute(f, me.TMX_BACKGROUND_COLOR);
          this.z = a++;
          if (this.realwidth < me.game.viewport.width || this.realheight < me.game.viewport.height) {
            var e = ~~ ((me.game.viewport.width - this.realwidth) / 2),
                g = ~~ ((me.game.viewport.height - this.realheight) / 2);
            this.pos.add({
              x: 0 < e ? e : 0,
              y: 0 < g ? g : 0
            })
          }
          me.TMXUtils.setTMXProperties(this, f);
          (this.background_color = this.backgroundcolor ? this.backgroundcolor : this.background_color) && this.mapLayers.push(new me.ColorLayer("background_color", this.background_color, a++));
          this.background_image && this.mapLayers.push(new me.ImageLayer("background_image", this.width, this.height, this.background_image, a++));
          break;
        case me.TMX_TAG_TILESET:
          this.tilesets || (this.tilesets = new me.TMXTilesetGroup);
          this.tilesets.add(new me.TMXTileset(b.item(c)));
          break;
        case me.TMX_TAG_IMAGE_LAYER:
          var g = me.XMLParser.getStringAttribute(b.item(c), me.TMX_TAG_NAME),
              f = me.XMLParser.getIntAttribute(b.item(c), me.TMX_TAG_WIDTH),
              e = me.XMLParser.getIntAttribute(b.item(c), me.TMX_TAG_HEIGHT),
              h = b.item(c).getElementsByTagName(me.TMX_TAG_IMAGE)[0].getAttribute(me.TMX_TAG_SOURCE),
              f = new me.ImageLayer(g, f * this.tilewidth, e * this.tileheight, h, a++);
          f.visible = 1 == me.XMLParser.getIntAttribute(b.item(c), me.TMX_TAG_VISIBLE, 1);
          f.opacity = me.XMLParser.getFloatAttribute(b.item(c), me.TMX_TAG_OPACITY, 1);
          me.TMXUtils.setTMXProperties(f, b.item(c));
          this.mapLayers.push(f);
          break;
        case me.TMX_TAG_LAYER:
          h = me.XMLParser.getStringAttribute(b.item(c), me.TMX_TAG_NAME);
          h.toLowerCase().contains(me.LevelConstants.PARALLAX_MAP) ? (f = me.XMLParser.getIntAttribute(b.item(c), me.TMX_TAG_WIDTH), e = me.XMLParser.getIntAttribute(b.item(c), me.TMX_TAG_HEIGHT), g = {}, me.TMXUtils.setTMXProperties(g, b.item(c)), g.ratio && (d = g.ratio), f = new me.ImageLayer(h, f * this.tilewidth, e * this.tileheight, g.imagesrc, a++, d), f.visible = 1 == me.XMLParser.getIntAttribute(b.item(c), me.TMX_TAG_VISIBLE, 1), f.opacity = me.XMLParser.getFloatAttribute(b.item(c), me.TMX_TAG_OPACITY, 1), me.TMXUtils.mergeProperties(f, g, !1), d += d * d, this.mapLayers.push(f)) : this.mapLayers.push(new me.TMXLayer(b.item(c), this.tilewidth, this.tileheight, this.orientation, this.tilesets, a++));
          break;
        case me.TMX_TAG_OBJECTGROUP:
          f = me.XMLParser.getStringAttribute(b.item(c), me.TMX_TAG_NAME), this.objectGroups.push(new me.TMXOBjectGroup(f, b.item(c), this.tilesets, a++))
        }
        me.XMLParser.free();
        this.initialized = !0
      }
    }
  })
})(window);
(function(a, d) {
  var b = me,
      c = {},
      f = {},
      e = [],
      g = 0;
  c.reset = function() {};
  c.addLevel = function() {
    throw "melonJS: no level loader defined";
  };
  c.addTMXLevel = function(a, b) {
    if (null == f[a]) f[a] = new me.TMXTileMap(a, 0, 0), f[a].name = a, e[e.length] = a;
    else return !1;
    b && b();
    return !0
  };
  c.loadLevel = function(a) {
    a = a.toString().toLowerCase();
    if (f[a] === d) throw "melonJS: level " + a + " not found";
    if (f[a] instanceof me.TMXTileMap) {
      var b = me.state.isRunning();
      b && me.state.pause();
      me.game.reset();
      me.utils.resetGUID(a);
      f[c.getCurrentLevelId()] && f[c.getCurrentLevelId()].reset();
      f[a].load();
      g = e.indexOf(a);
      me.game.loadTMXLevel(f[a]);
      b && me.state.resume()
    } else throw "melonJS: no level loader defined";
    return !0
  };
  c.getCurrentLevelId = function() {
    return e[g]
  };
  c.reloadLevel = function() {
    return c.loadLevel(c.getCurrentLevelId())
  };
  c.nextLevel = function() {
    return g + 1 < e.length ? c.loadLevel(e[g + 1]) : !1
  };
  c.previousLevel = function() {
    return 0 <= g - 1 ? c.loadLevel(e[g - 1]) : !1
  };
  b.levelDirector = c
})(window);
(function() {
  me.Tween = function(a) {
    var d = {},
        b = {},
        c = {},
        f = 1E3,
        e = 0,
        g = null,
        h = me.Tween.Easing.Linear.EaseNone,
        j = null,
        l = null,
        r = null;
    this.to = function(b, d) {
      null !== d && (f = d);
      for (var e in b) null !== a[e] && (c[e] = b[e]);
      return this
    };
    this.start = function() {
      me.game.add(this, 999);
      g = me.timer.getTime() + e;
      for (var f in c) null !== a[f] && (d[f] = a[f], b[f] = c[f] - a[f]);
      return this
    };
    this.stop = function() {
      me.game.remove(this);
      return this
    };
    this.delay = function(a) {
      e = a;
      return this
    };
    this.easing = function(a) {
      h = a;
      return this
    };
    this.chain = function(a) {
      j = a;
      return this
    };
    this.onUpdate = function(a) {
      l = a;
      return this
    };
    this.onComplete = function(a) {
      r = a;
      return this
    };
    this.update = function() {
      var c, e, m;
      e = me.timer.getTime();
      if (e < g) return !0;
      if (1 <= (e = (e - g) / f)) e = 1;
      m = h(e);
      for (c in b) a[c] = d[c] + b[c] * m;
      null !== l && l.call(a, m);
      return 1 === e ? (me.game.remove(this), null !== r && r.call(a), null !== j && j.start(), !1) : !0
    };
    this.destroy = function() {
      return !0
    }
  };
  me.Tween.Easing = {
    Linear: {},
    Quadratic: {},
    Cubic: {},
    Quartic: {},
    Quintic: {},
    Sinusoidal: {},
    Exponential: {},
    Circular: {},
    Elastic: {},
    Back: {},
    Bounce: {}
  };
  me.Tween.Easing.Linear.EaseNone = function(a) {
    return a
  };
  me.Tween.Easing.Quadratic.EaseIn = function(a) {
    return a * a
  };
  me.Tween.Easing.Quadratic.EaseOut = function(a) {
    return a * (2 - a)
  };
  me.Tween.Easing.Quadratic.EaseInOut = function(a) {
    return 1 > (a *= 2) ? 0.5 * a * a : -0.5 * (--a * (a - 2) - 1)
  };
  me.Tween.Easing.Cubic.EaseIn = function(a) {
    return a * a * a
  };
  me.Tween.Easing.Cubic.EaseOut = function(a) {
    return --a * a * a + 1
  };
  me.Tween.Easing.Cubic.EaseInOut = function(a) {
    return 1 > (a *= 2) ? 0.5 * a * a * a : 0.5 * ((a -= 2) * a * a + 2)
  };
  me.Tween.Easing.Quartic.EaseIn = function(a) {
    return a * a * a * a
  };
  me.Tween.Easing.Quartic.EaseOut = function(a) {
    return 1 - --a * a * a * a
  };
  me.Tween.Easing.Quartic.EaseInOut = function(a) {
    return 1 > (a *= 2) ? 0.5 * a * a * a * a : -0.5 * ((a -= 2) * a * a * a - 2)
  };
  me.Tween.Easing.Quintic.EaseIn = function(a) {
    return a * a * a * a * a
  };
  me.Tween.Easing.Quintic.EaseOut = function(a) {
    return --a * a * a * a * a + 1
  };
  me.Tween.Easing.Quintic.EaseInOut = function(a) {
    return 1 > (a *= 2) ? 0.5 * a * a * a * a * a : 0.5 * ((a -= 2) * a * a * a * a + 2)
  };
  me.Tween.Easing.Sinusoidal.EaseIn = function(a) {
    return 1 - Math.cos(a * Math.PI / 2)
  };
  me.Tween.Easing.Sinusoidal.EaseOut = function(a) {
    return Math.sin(a * Math.PI / 2)
  };
  me.Tween.Easing.Sinusoidal.EaseInOut = function(a) {
    return 0.5 * (1 - Math.cos(Math.PI * a))
  };
  me.Tween.Easing.Exponential.EaseIn = function(a) {
    return 0 === a ? 0 : Math.pow(1024, a - 1)
  };
  me.Tween.Easing.Exponential.EaseOut = function(a) {
    return 1 === a ? 1 : 1 - Math.pow(2, -10 * a)
  };
  me.Tween.Easing.Exponential.EaseInOut = function(a) {
    return 0 === a ? 0 : 1 === a ? 1 : 1 > (a *= 2) ? 0.5 * Math.pow(1024, a - 1) : 0.5 * (-Math.pow(2, -10 * (a - 1)) + 2)
  };
  me.Tween.Easing.Circular.EaseIn = function(a) {
    return 1 - Math.sqrt(1 - a * a)
  };
  me.Tween.Easing.Circular.EaseOut = function(a) {
    return Math.sqrt(1 - --a * a)
  };
  me.Tween.Easing.Circular.EaseInOut = function(a) {
    return 1 > (a *= 2) ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
  };
  me.Tween.Easing.Elastic.EaseIn = function(a) {
    var d, b = 0.1;
    if (0 === a) return 0;
    if (1 === a) return 1;
    !b || 1 > b ? (b = 1, d = 0.1) : d = 0.4 * Math.asin(1 / b) / (2 * Math.PI);
    return -(b * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - d) * 2 * Math.PI / 0.4))
  };
  me.Tween.Easing.Elastic.EaseOut = function(a) {
    var d, b = 0.1;
    if (0 === a) return 0;
    if (1 === a) return 1;
    !b || 1 > b ? (b = 1, d = 0.1) : d = 0.4 * Math.asin(1 / b) / (2 * Math.PI);
    return b * Math.pow(2, -10 * a) * Math.sin((a - d) * 2 * Math.PI / 0.4) + 1
  };
  me.Tween.Easing.Elastic.EaseInOut = function(a) {
    var d, b = 0.1;
    if (0 === a) return 0;
    if (1 === a) return 1;
    !b || 1 > b ? (b = 1, d = 0.1) : d = 0.4 * Math.asin(1 / b) / (2 * Math.PI);
    return 1 > (a *= 2) ? -0.5 * b * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - d) * 2 * Math.PI / 0.4) : 0.5 * b * Math.pow(2, -10 * (a -= 1)) * Math.sin((a - d) * 2 * Math.PI / 0.4) + 1
  };
  me.Tween.Easing.Back.EaseIn = function(a) {
    return a * a * (2.70158 * a - 1.70158)
  };
  me.Tween.Easing.Back.EaseOut = function(a) {
    return --a * a * (2.70158 * a + 1.70158) + 1
  };
  me.Tween.Easing.Back.EaseInOut = function(a) {
    return 1 > (a *= 2) ? 0.5 * a * a * (3.5949095 * a - 2.5949095) : 0.5 * ((a -= 2) * a * (3.5949095 * a + 2.5949095) + 2)
  };
  me.Tween.Easing.Bounce.EaseIn = function(a) {
    return 1 - me.Tween.Easing.Bounce.EaseOut(1 - a)
  };
  me.Tween.Easing.Bounce.EaseOut = function(a) {
    return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375
  };
  me.Tween.Easing.Bounce.EaseInOut = function(a) {
    return 0.5 > a ? 0.5 * me.Tween.Easing.Bounce.EaseIn(2 * a) : 0.5 * me.Tween.Easing.Bounce.EaseOut(2 * a - 1) + 0.5
  }
})(window);
