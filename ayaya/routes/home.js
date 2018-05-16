const router = require('koa-router')()
const title = '首页'

const Bll = require('./../dll/interface.js')
const postBll = Bll.post

router.get('/', async (ctx, next) => {

    // 获取 10 条帖子
    let result = await postBll.getPosts(0, 9);
    // moment 处理result时间 2个月以前

    //判断登录 未登录
    if (!ctx.session || !ctx.session.id) {
        //await ctx.redirect('/login')
        let id = null;
        await ctx.render('index', {
            title,
            id,
            result
        })
    } else {
        const id = ctx.session.id;
        const papa = ctx.session.last;

        await ctx.render('index', {
            title,
            id,
            papa,
            result
        })
    }
})

module.exports = router