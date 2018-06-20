const Koa = require('koa');
const views = require('koa-views');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const router = require('./routes/default');

const app = new Koa();
app.keys = ['ws'];

const store = require('./store')
app.use(store.mdFileListener)

app.use(session({
    key: 'ws .*?%',
    maxAge: 3600000 * 24 * 30,
    overwrite: true,
    httpOnly: true,
    rolling: false,
    sign: true,
    store: store.seed
}, app))
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    limit: '10mb'
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