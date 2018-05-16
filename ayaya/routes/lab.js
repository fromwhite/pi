const router = require('koa-router')()
const title = 'h5test'

router.prefix('/lab')

router.get('/', async (ctx, next) => {
    //判断登录 未登录  为空

    // 测试页面 lab路由重定向sprite
    const id = ctx.session.id || null;
    const papa = ctx.session.last || null;
    await ctx.render('sprite', {
        title,
        id,
        papa
    })
    // if (!ctx.session || !ctx.session.id) {
    //     let id = null;
    //     //await ctx.redirect('/sprite')
    //     await ctx.render('Lab', {
    //         title,
    //         id
    //     })
    // } else {
    //     // 已登陆木偶 
    //     const id = ctx.session.id;
    //     const papa = ctx.session.last;

    //     await ctx.render('Lab', {
    //         title,
    //         id,
    //         papa
    //     })
    // }
})

module.exports = router