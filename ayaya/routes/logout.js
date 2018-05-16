const router = require('koa-router')()
const Bll = require('./../dll/interface.js')

const userBll = Bll.userinfo

const retCode = require('../dll/retcode')

router.prefix('/logout')

router.get('/', async (ctx, next) => {
    await ctx.render('logout', {})
})

router.post('/', async (ctx, next) => {

    ctx.session = null;

    let result = {
        code: retCode.Success,
        data: null
    }

    ctx.body = result;

})

module.exports = router