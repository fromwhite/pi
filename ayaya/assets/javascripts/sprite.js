webpackJsonp([0], {
    3: function (t, e, n) {
        "use strict";

        function a(t) {
            return t && t.__esModule ? t : {
                default: t
            }
        }

        function r(t, e, n) {
            return e in t ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : t[e] = n, t
        }

        function o(t) {
            return function () {
                var e = t.apply(this, arguments);
                return new Promise(function (t, n) {
                    function a(r, o) {
                        try {
                            var i = e[r](o),
                                u = i.value
                        } catch (t) {
                            return void n(t)
                        }
                        if (!i.done) return Promise.resolve(u).then(function (t) {
                            a("next", t)
                        }, function (t) {
                            a("throw", t)
                        });
                        t(u)
                    }
                    return a("next")
                })
            }
        }
        var i = n(0),
            u = a(i),
            h = function () {
                var t = o(u.default.mark(function t() {
                    var e, n, a, o, i, h, f, c, s, x, m, l, v;
                    return u.default.wrap(function (t) {
                        for (;;) switch (t.prev = t.next) {
                            case 0:
                                return v = function t(e) {
                                    var n = .001 * e,
                                        a = Math.min(.1, n - l);
                                    l = n, x(a), m(), requestAnimationFrame(t)
                                }, m = function () {
                                    a.viewport(0, 0, a.canvas.width, a.canvas.height), a.clear(a.COLOR_BUFFER_BIT), o.forEach(function (t, n) {
                                        var a = t.x,
                                            r = t.y,
                                            o = t.textureInfo.width * t.xScale,
                                            i = t.textureInfo.height * t.yScale,
                                            u = t.textureInfo.width * t.offX,
                                            h = t.textureInfo.height * t.offY,
                                            f = t.textureInfo.width * t.width,
                                            d = t.textureInfo.height * t.height;
                                        e.im.drawImage(t.textureInfo.texture, t.textureInfo.width, t.textureInfo.height, u, h, f, d, a, r, o, i, t.rotation)
                                    })
                                }, x = function (t) {
                                    o.forEach(function (e) {
                                        e.x += e.dx * h * t, e.y += e.dy * h * t, e.x < 0 && (e.dx = 1), e.x >= a.canvas.width && (e.dx = -1), e.y < 0 && (e.dy = 1), e.y >= a.canvas.height && (e.dy = -1), e.rotation += e.deltaRotation * t
                                    })
                                }, e = d.default.create(document.getElementById("gl")), t.next = 6, e.im.loadTex(["/images/tex.jpg", "/images/hero.jpg", "/images/ji.jpg"]);
                            case 6:
                                for (n = t.sent, a = e.gl, o = [], i = 3, h = 60, f = 0; f < i; ++f) c = {
                                    x: Math.random() * a.canvas.width,
                                    y: Math.random() * a.canvas.height,
                                    dx: Math.random() > .5 ? -1 : 1,
                                    dy: Math.random() > .5 ? -1 : 1,
                                    xScale: .25 * Math.random() + .25,
                                    yScale: .25 * Math.random() + .25,
                                    offX: .75 * Math.random(),
                                    offY: .75 * Math.random()
                                }, r(c, "offX", 0), r(c, "offY", 0), r(c, "rotation", Math.random() * Math.PI * 2), r(c, "deltaRotation", (.5 + .5 * Math.random()) * (Math.random() > .5 ? -1 : 1)), r(c, "width", 1), r(c, "height", 1), r(c, "textureInfo", n[Math.random() * n.length | 0]), s = c, o.push(s);
                                l = 0, requestAnimationFrame(v);
                            case 14:
                            case "end":
                                return t.stop()
                        }
                    }, t, this)
                }));
                return function () {
                    return t.apply(this, arguments)
                }
            }(),
            f = n(1),
            d = a(f);
        document.addEventListener("DOMContentLoaded", h, !1)
    }
}, [3]);