const Koa = require('koa');
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');

const Router = require('koa-router');
const router = Router();
router
    .get('/', async (ctx, next) => {
        const title = '首页'
        const id = 1;
        const result = 1;
        await ctx.render('index', {
            title,
            id,
            result
        })

    })
    .get('/lab', async (ctx, next) => {

        // 测试页面 lab路由重定向sprite
        const title = 'h5test'
        const id = 1;
        const papa = 1;
        await ctx.render('sprite', {
            title,
            id,
            papa
        })

    });

async function logger(ctx, next) {

}

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