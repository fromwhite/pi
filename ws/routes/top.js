const router = require('koa-router')()
const helper = require('../store')
const store = helper.ListCache
router.prefix('/center')

router.get('/', async (ctx, next) => {
    if (!ctx.session.id) {
        await ctx.redirect('/login');
    }
    let title = 'top'
    let id = ctx.session.id;
    let tag = 'center'

    if (!store.get()) {
        store.set(await helper.getList())
    }
    let list = store.get()

    await ctx.render('default', {
        title,
        id,
        tag,
        list
    })
})

router.post('/', async (ctx, next) => {
    let result = await helper.upfile(ctx, next)
    ctx.body = result
})

module.exports = router