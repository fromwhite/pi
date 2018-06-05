const router = require('koa-router')()
const helper = require('./../interface.js')

router.prefix('/login')

router.get('/', async (ctx, next) => {
    //判断登录 未登录选择路由 已登陆重定向首页
    if (!!ctx.session && ctx.session.id) {
        await ctx.redirect('/');
    }

    let title = '登录'
    let id = 1;
    let tag = 'login'
    await ctx.render('default', {
        title,
        id,
        tag
    })
})

router.post('/', async (ctx, next) => {
    let form = ctx.request.body

    let args = {
        name: form.username,
        passwd: form.userpass
    }
    let retCode = await helper.getRetCode()
    let result = {
        code: retCode.Success,
        data: null
    }
    // 验证非空
    if (!args.name || !args.passwd) {
        result.code = retCode.ArgsError
    }

    let key = await helper.getKey()

    // key 用户名或密码错误
    if (key.name != args.name || key.passwd != args.passwd) {
        result.code = retCode.UsernameOrPasswordError
    }
    // 存入Session中
    ctx.session = {
        id: key.Id,
        name: key.name,
    }
    ctx.body = result;
})

module.exports = router