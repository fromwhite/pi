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


let index = async (ctx, next) => {
    //console.log(ctx, ctx.request.method, 11)
    const title = '首页'
    const id = 1;
    const result = 1;
    await ctx.render('index', {
        title,
        id,
        result
    })
}

let lab = async (ctx, next) => {

    // 测试页面 lab路由重定向sprite
    const title = 'h5test'
    const id = 1;
    const papa = 1;
    await ctx.render('sprite', {
        title,
        id,
        papa
    })
}

// let login = async (ctx, netx) => {
//     const title = '首页'
//     const id = 1;
//     const result = 1;
//     await ctx.render('login', {
//         title,
//         id,
//         result
//     })
// }

let login = async (ctx, next) => {
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

    //console.log(ctx.session, 1)
    // 存入Session中
    ctx.session = {
        id: key.Id,
        name: key.name,
    }

    next();

    ctx.body = result;
}

module.exports = {
    index,
    lab,
    login
}