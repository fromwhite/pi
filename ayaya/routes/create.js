const router = require('koa-router')()
const moment = require('moment')

const Bll = require('./../dll/interface.js')
const postBll = Bll.post

const title = '发帖'
router.prefix('/create')

router.get('/', async (ctx, next) => {
    //判断登录 未登录
    if (!ctx.session || !ctx.session.id) {
        await ctx.redirect('/')
    } else {
        // 已登陆木偶
        const id = ctx.session.id;
        const papa = ctx.session.last;

        await ctx.render('create', {
            title,
            id,
            papa
        })
    }
})

// 发布新帖
router.post('/', async (ctx, next) => {
    let createTime = moment().format("MMM Do YYYY");
    let result = await postBll.create(ctx, createTime);

    ctx.body = result;
})

module.exports = router