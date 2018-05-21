const fs = require("fs"),
    path = require("path");

// 常量配置
let key = {
    Id: '01',
    name: 'root',
    // 123456
    passwd: 'e10adc3949ba59abbe56e057f20f883e'
}
const retCode = {
    SessionExpired: -1, //session过期
    Fail: 0, //失败
    Success: 1, //成功
    ArgsError: 2, //参数错误
    UserExisted: 10, //用户已经存在
    UsernameOrPasswordError: 11, //用户名或者密码错误      
    UserNotExist: 12, //用户不存在    
};

// tools
function isEmpty(obj) {
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}


// 路由
async function index(ctx, next) {
    //   console.log(ctx, ctx.request.method, 'index.get')
    const title = '首页'
    const id = 1;
    const result = 1;
    await ctx.render('index', {
        title,
        id,
        result
    })
}
async function lab(ctx, next) {
    // 测试页面 lab路由重定向sprite
    const title = 'h5test'
    const id = 1;
    const papa = 1;
    await ctx.render('lab', {
        title,
        id,
        papa
    })
}
async function login(ctx, next) {

    //判断登录 未登录选择路由 已登陆重定向首页
    if (!!ctx.session && ctx.session.id) {
        await ctx.redirect('/');
    }

    const title = '首页'
    const id = 1;
    const result = 1;
    await ctx.render('login', {
        title,
        id,
        result
    })
}
async function loginEvt(ctx, next) {

    let form = ctx.request.body

    const args = {
        name: form.username,
        passwd: form.userpass
    }

    let result = {
        code: retCode.Success,
        data: null
    }
    // 验证非空
    if (!args.name || !args.passwd) {
        result.code = retCode.ArgsError
    }

    // key 用户名或密码错误
    if (key.name != args.name || key.passwd != args.passwd) {
        result.code = retCode.UsernameOrPasswordError
    }
    // 存入Session中
    ctx.session = {
        id: key.Id,
        name: key.name,
    }

    next();
    ctx.body = result;
}

// 路由表映射
// async function action(ctx, next) {
//     let method = ctx.request.method;
//     //let url = ctx.request.url.replace(/\//, '') || '/';
//     let url = ctx.request.url.replace(/^[1-9]\d*$/,'')
//     await Router[url][method](ctx, next)
//}

// POST:markdown目录 文件改动重写cache
let cache = {}
// 按时间排序 读取文件到目录
async function file(ctx, next) {

    if (isEmpty(cache)) {
        const base = './post/';
        const files = fs.readdirSync(base);
        files.sort(function (a, b) {
            let astat = fs.lstatSync(base + a);
            let bstat = fs.lstatSync(base + b);
            return bstat.mtime - astat.mtime;
        });

        await next()
    } else {
        // 不为空
        await next()
    }

}
// 逻辑开关 todo



module.exports = {
    index,
    lab,
    login,
    loginEvt,
    file
}