window._ = new function () {
    this.define = function (list) {
        var ret = {};
        for (var p in list) {
            ret[p] = {
                writable: false,
                enumerable: false,
                configurable: true
            };
            ret[p]['value'] = list[p]
        }
        Object.defineProperties(this, ret);
    }

    Object.defineProperties(this, {
        cache: {

        }
    })

    this.define({
        $: function (s) {
            return document.querySelector(s)
        },
        log: function () {
            console.log.apply(console, arguments);
            return this
        },
        queue: function (funcs, scope) {
            return (function next() {
                if (funcs.length > 0) {
                    funcs.shift().apply(scope || {}, [next].concat(Array.prototype.slice.call(arguments, 0)));
                } else {
                    return this;
                }
            })();
        },
        adler32: function (data) {
            var MOD = 65521;
            var a = 1;
            var b = 0;
            for (var i = 0; i < data.length >>> 0; i++) {
                a = (a + data.charCodeAt(i)) % MOD;
                b = (b + a) % MOD;
            }
            return a | (b << 16);
        },
        pull: function (url, fn) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                    fn.call(this, xhr.responseText);
                }
            };
            xhr.send(null);
        },
        push: function (url, data, fn) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
                    fn.call(this, xhr.responseText);
                }
            };
            xhr.send(data);
        },
        watch: function (obj, callback) {
            for (var i in obj) {
                if (typeof obj != 'object') return;
                (function (value, o, attr) {
                    var v = value;
                    var oldValue = value;
                    Object.defineProperty(o, attr, {
                        get: function () {
                            return v;
                        },
                        set: function (newValue) {
                            oldValue = v;
                            v = newValue;
                            callback(newValue, oldValue);
                        }
                    });
                })(obj[i], obj, i)
            }
        }
    });

    delete this.define
}