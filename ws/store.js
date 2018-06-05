// 单核套路云 直接写内存
let seed = {
    storage: {},
    get(key, maxAge) {
        return this.storage[key]
    },
    set(key, sess, maxAge) {
        this.storage[key] = sess
    },
    destroy(key) {
        delete this.storage[key]
    }
}
// post目录 --- 文件信息 ---
let ListCache = {
    storage: null,
    get() {
        return this.storage
    },
    set(cache) {
        this.storage = cache
    },
    destroy() {
        this.storage = null
    }
}

class Event {
    constructor() {
        this.subscribers = new Map([
            []
        ]);
    }

    on(type, fn) {
        let subs = this.subscribers;
        if (!subs.get(type)) return subs.set(type, [fn]);
        subs.set(type, (subs.get(type).push(fn)));
    }

    emit(type, content) {
        let handlers = this.subscribers.get(type);
        if (!handlers) return
        for (let fn of handlers) {
            fn.apply(this, [].slice.call(arguments, 1));
        }
    }
}

module.exports = {
    seed,
    ListCache
}