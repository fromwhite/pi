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

// 路由
async function index(ctx, next) {
    //   console.log(ctx, ctx.request.method, 'index.get')
    let title = '首页'
    let id = ctx.session.id || null;

    let tag = 'index'

    await ctx.render('default', {
        title,
        id,
        tag,
        cache
    })
}
async function lab(ctx, next) {
    // 测试页面 lab路由重定向sprite
    let title = 'h5test'
    let id = ctx.session.id || null;

    let tag = 'lab'
    await ctx.render('default', {
        title,
        id,
        tag
    })
}
async function login(ctx, next) {
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
}
async function loginEvt(ctx, next) {

    let form = ctx.request.body

    let args = {
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
let cache = {};
async function file(ctx, next) {
    let base = './post/';
    let files = fs.readdirSync(base);
    files.sort(function (a, b) {
        let astat = fs.lstatSync(base + a);
        let bstat = fs.lstatSync(base + b);
        return bstat.atime - astat.atime;
    });
    files.forEach(function (filename) {
        if (!/\.md$/.test(filename)) {
            return;
        }
        let tag = /#(.*)\./.test(filename) ? RegExp.$1 : 'null';
        let filepath = path.resolve(base, filename);
        let timeline = fs.lstatSync(filepath).atime;
        let time = timeline.getFullYear() + '-' + timeline.getMonth() + '-' + timeline.getDay();
        cache[time] = filepath;

        let source = fs.readFileSync(filepath, "utf-8").toString();
        let title = /--- (.*) ---/.test(source) ? RegExp.$1 : 'null';

    });

    await next()

}

async function post(ctx, next) {
    let title = ctx.params.name;
    let id = ctx.session.id || 1;
    let tag = 'post'
    // 获取缓存文件
    let base = './cache/';
    let files = fs.readdirSync(base);
    console.log(title, files, 0)

    if (files.includes(title + '.html')) {
        // 已缓存直接读取
        await ctx.redirect('/cache/' + title + '.html');
    } else {
        // 未缓存 md2html

    }


    // await ctx.render('default', {
    //     title,
    //     id,
    //     tag,
    //     cache
    // })
}



module.exports = {
    index,
    lab,
    login,
    loginEvt,
    file,
    post
}