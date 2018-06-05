const fs = require('fs');
const path = require('path');
const Router = require('koa-router');

const basename = path.basename(module.filename);
const router = Router();

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        let route = require(path.join(__dirname, file));
        router.use(route.routes(), route.allowedMethods());
    });

router.get('*', async (ctx, next) => {
    ctx.status = 404
    ctx.body = 404
    // await ctx.render('404');
})

module.exports = router;