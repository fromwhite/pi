const Router = require('koa-router');
const router = Router();

async function logger(ctx, next) {

}

router.get('/', async (ctx, next) => {
    const title = '首页'
    const id = 1;
    const result = 1;
    await ctx.render('index', {
        title,
        id,
        result
    })

})

router.get('/lab', async (ctx, next) => {

    // 测试页面 lab路由重定向sprite
    const title = 'h5test'
    const id = 1;
    const papa = 1;
    await ctx.render('sprite', {
        title,
        id,
        papa
    })

})

module.exports = router