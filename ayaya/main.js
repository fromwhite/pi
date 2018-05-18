const Koa = require('koa');
const views = require('koa-views');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');

const action = require('./interface');

const Router = require('koa-router');
const router = Router();
router.get('/', action.index)
    .get('/lab', action.lab)
    .get('/login', async (ctx, next) => {
        const title = '首页'
        const id = 1;
        const result = 1;
        await ctx.render('login', {
            title,
            id,
            result
        })
    })
    .post('/login', action.login)
    .get('*', async (ctx, next) => {
        ctx.status = 404
        await ctx.render('404');
    });

async function logger(ctx, next) {
    const startDate = new Date();
    next();
    console.log(`method: ${ctx.method} code: ${ctx.status} time:${new Date() -startDate}ms`);
}
//app.use(logger);

const app = new Koa();
app.keys = ['Ayaya'];

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
    key: 'Aayaya .sO*19?96%jk$zx',
    maxAge: 3600000 * 24 * 30,
    overwrite: true,
    httpOnly: true,
    rolling: false,
    sign: true,
    store: store
}, app))


app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(require('koa-static')(__dirname + '/assets/'));
app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));

app.use(router.routes(), router.allowedMethods());

app.listen(80, () => {
    console.log(`Starting..`)
});

module.exports = app;