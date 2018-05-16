const router = require('koa-router')()
const Bll = require('./../dll/interface.js')

const userBll = Bll.userinfo

const title = '登录'

router.prefix('/login')

router.get('/', async (ctx, next) => {
    await ctx.render('login', {
        title
    })
})

router.post('/', async (ctx, next) => {

    let result = await userBll.login(ctx);

    ctx.body = result;

})

module.exports = router