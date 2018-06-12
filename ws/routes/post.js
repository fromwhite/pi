const router = require('koa-router')()
const helper = require('./../interface.js')

router.get('/post/:name', async (ctx, next) => {
    let title = ctx.params.name;
    let id = ctx.session.id;
    let tag = 'post'
    await helper.getPost(ctx, next, title)
    await ctx.render('./cache/' + title + '.html', {
        map: {
            html: 'nunjucks'
        }
    });
})

module.exports = router