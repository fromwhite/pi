const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    let title = '首页'
    let id = ctx.session.id || null;
    let tag = 'index'
    await ctx.render('default', {
        title,
        id,
        tag
    })
})

module.exports = router