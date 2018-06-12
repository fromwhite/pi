const router = require('koa-router')()
const helper = require('./../interface.js')

router.prefix('/center')

router.get('/', async (ctx, next) => {
    if (!ctx.session.id) {
        await ctx.redirect('/login');
    }

    let title = 'top'
    let id = 0;
    let tag = 'center'
    await ctx.render('default', {
        title,
        id,
        tag
    })
})

module.exports = router