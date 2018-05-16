const model = require('./../dll/model.js')
const retCode = require('./retcode.js')

const moment = require('moment')

const usermodel = model.userinfo;
const postmodel = model.post
const commentmodel = model.comment

const userinfo = {
    /**
     * 注册
     * @param  {object} ctx   上下文
     * @return {object}       结果
     */
    async register(ctx) {
        let form = ctx.request.body

        const args = {
            username: form.username,
            userpass: form.userpass
        }

        let result = {
            code: retCode.Success,
            data: null
        }

        //验证非空
        if (!args.username || !args.userpass) {
            result.code = retCode.ArgsError
            return result
        }

        //根据用户名得到用户数量
        let userNumResult = await usermodel.getCountByUserName(args)

        //用户名已被注册
        if (userNumResult[0].UserNum > 0) {
            result.code = retCode.UserExisted
            return result
        }

        //插入注册数据
        let userResult = await usermodel.add(args)

        if (userResult.insertId <= 0) {
            result.code = retCode.Fail
            return result
        }

        return result
    },

    /**
     * 登录
     * @param  {object} ctx   上下文
     * @return {object}       结果
     */
    async login(ctx) {
        let form = ctx.request.body

        const args = {
            username: form.username,
            userpass: form.userpass
        }

        let result = {
            code: retCode.Success,
            data: null
        }

        //验证非空
        if (!args.username || !args.userpass) {
            result.code = retCode.ArgsError
            return result
        }

        //根据用户名得到用户信息
        let userResult = await usermodel.getByUserName(args)

        //用户不存在
        if (userResult.length == 0) {
            result.code = retCode.UserNotExist
            return result
        }

        //用户名或密码错误
        if (userResult[0].UserName != args.username || userResult[0].UserPass != args.userpass) {
            result.code = retCode.UsernameOrPasswordError
            return result
        }

        //将用户ID存入Session中
        let flag;
        if (!userResult[0].Last) {
            userResult[0].Last = undefined;
        } else {
            flag = moment(userResult[0].Last).format("MMM Do YY,h:mm");
        }
        ctx.session = {
            id: userResult[0].Id,
            name: userResult[0].UserName,
            last: flag
        }
        //将最后一次登录时间写入
        //登录时间 
        let laster = moment().format();

        await usermodel.setLast({
            userid: userResult[0].Id,
            last: laster
        })

        return result
    },

}

const post = {
    // 发帖
    async create(ctx, time) {
        let form = ctx.request.body

        const args = {
            name: ctx.session.name,
            title: form.title,
            content: form.content,
            uid: ctx.session.id,
            moment: time,
            comments: 0,
            pv: 0,
            type: form.type
        }

        let result = {
            code: retCode.Success,
            data: null
        }

        //验证非空
        if (!args.title || !args.content) {
            result.code = retCode.ArgsError
            return result
        }

        //插入注册数据
        let postResult = await postmodel.add(args)

        if (postResult.insertId <= 0) {
            result.code = retCode.Fail
            return result
        }

        return result

    },
    async getPosts(n, m) {
        let result = await postmodel.getAllPosts(n, m);
        return result
    }
}

const comment = {}

module.exports = {
    userinfo: userinfo,
    post: post,
    comment: comment
}