const router = require('koa-router')()
router.prefix('/archive')
const helper = require('../store')
const store = helper.ListCache

router.get('/', async (ctx, next) => {
    let title = '首页'
    let id = ctx.session.id || null;
    let tag = 'archive'
    // 写入store todo：map重构，上传distory
    if (!store.get()) {
        store.set(await helper.getList())
    }
    let cache = store.get()
    await ctx.render('default', {
        title,
        id,
        tag,
        cache
    })
})

module.exports = router