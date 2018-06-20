const router = require('koa-router')()
const helper = require('../store')
const store = helper.ListCache
router.prefix('/del')

router.get('/', async (ctx, next) => {
    ctx.status = 404
    ctx.body = 404
})

router.post('/', async (ctx, next) => {
    let result = await helper.del_post(ctx, next)
    ctx.body = result
})

module.exports = router