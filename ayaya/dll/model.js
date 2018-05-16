const mysqlHelper = require('./../middleware/mysql-helper.js')

const userinfo = {

    /**
     * 增加一条数据
     * @param  {object} args  参数
     * @return {object}       结果
     */
    async add(args) {
        let sql = 'INSERT INTO users(UserName, UserPass) VALUES(?, ?)'
        let params = [args.username, args.userpass]
        let result = await mysqlHelper.query(sql, params)
        return result
    },

    /**
     * 根据UserName得到一条数据
     * @param  {object} args  参数
     * @return {object}       结果
     */
    async getByUserName(args) {
        let sql = 'SELECT Id, UserName, UserPass,Last FROM users WHERE UserName = ?'
        let params = [args.username]
        let result = await mysqlHelper.query(sql, params)
        return result
    },

    /**
     * 根据UserName得到数量
     * @param  {object} args  参数
     * @return {object}       结果
     */
    async getCountByUserName(args) {
        let sql = 'SELECT COUNT(1) AS UserNum FROM users WHERE UserName = ?'
        let params = [args.username]
        let result = await mysqlHelper.query(sql, params)
        return result
    },

    // 写入 上次登录时间
    async setLast(args) {
        let sql = 'UPDATE users SET Last = ? WHERE id = ?';
        let params = [args.last, args.userid];
        let result = await mysqlHelper.query(sql, params);
    }

}

const post = {
    // 增加一条帖子
    async add(args) {
        let sql = 'INSERT INTO posts(name, title,content,uid,moment,comments,pv,type) VALUES(?,?,?,?,?,?,?,?)'
        let params = [args.name, args.title, args.content, args.uid, args.moment, args.comments, args.pv, args.type]
        let result = await mysqlHelper.query(sql, params)
        return result
    },

    // 获取帖子
    async getAllPosts(n, m) {
        let sql = 'select * from posts limit ?,?'
        let params = [n, m]
        let result = await mysqlHelper.query(sql, params)
        return result
    }
}

const comment = {

}

module.exports = {
    userinfo: userinfo,
    post: post,
    comment: comment
}