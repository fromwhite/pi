const router = require('koa-router')()

router.prefix('/h5test')

router.get('/', async (ctx, next) => {
    // 测试页面 lab路由重定向sprite
    let title = 'h5test'
    let id = ctx.session.id || null;

    let tag = 'lab'
    await ctx.render('default', {
        title,
        id,
        tag
    })
})

module.exports = router