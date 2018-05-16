/*
 * 返回码
 */
const RetCode = {
    SessionExpired: -1, //session过期
    Fail: 0, //失败
    Success: 1, //成功
    ArgsError: 2, //参数错误
    UserExisted: 10, //用户已经存在
    UsernameOrPasswordError: 11, //用户名或者密码错误      
    UserNotExist: 12, //用户不存在    
};

module.exports = RetCode