const Koa = require('koa');
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');

const router = require('./helper/router');

const app = new Koa();
app.keys = ['Ayaya'];

app.use(bodyParser());
app.use(require('koa-static')(__dirname + '/assets/'));
app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));

app.use(router.routes(), router.allowedMethods());

app.listen(80, () => {
    console.log(`Starting..`)
});

module.exports = app;