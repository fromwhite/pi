const router = require('koa-router')()
const Bll = require('./../dll/interface.js')

const userBll = Bll.userinfo

const title = '注册'

router.prefix('/reg')

router.get('/', async (ctx, next) => {
  let id = null;
  await ctx.render('reg', {
    title,
    id
  })
})

router.post('/', async (ctx, next) => {

  let result = await userBll.register(ctx)

  ctx.body = result;

})

module.exports = router