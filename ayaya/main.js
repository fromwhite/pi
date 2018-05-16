const Koa = require('koa');
const views = require('koa-views');
const convert = require('koa-convert');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');

const session = require('koa-session');
const _config = require('./dll/config');
const router = require('./routes/index');


let DEV = process.env.NODE_ENV === 'development'; //开发
let PROD = process.env.NODE_ENV === 'production'; //生产

const config = DEV ? _config['DEV'] : _config['PROD'];

const app = new Koa();
app.keys = ['Ayaya'];

async function logger(ctx, next) {
    const startDate = new Date();
    next();
    console.log(`method: ${ctx.method} code: ${ctx.status} time:${new Date() -startDate}ms`);
}

//app.use(logger);

// 单核套路云 直接写内存
let store = {
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
app.use(session({
    key: 'Ayayadw kdwadd1kkdwa2mmkdwadjwa1kjj3297nn2n3kp102qmmd92mmdwa03nyq61k*h16&jm?dwawk1idlw*.jdjwaj?aq108klczw',
    maxAge: 3600000 * 24 * 30,
    overwrite: true,
    httpOnly: true,
    rolling: false,
    sign: true,
    store: store
}, app))

// middlewares
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}));

app.use(json());
app.use(require('koa-static')(__dirname + '/assets/'));
app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));

app.use(router.routes(), router.allowedMethods());

app.listen(config.SERVER_PORT, () => {
    console.log(`Starting at port ${config.SERVER_PORT}!`)
});

module.exports = app;