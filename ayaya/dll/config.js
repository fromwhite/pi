const production = {
    // ws 1999
    SERVER_PORT: 80,

    MYSQL: {
        host: "localhost",
        user: "root",
        password: "shui1567",
        port: "3306",
        database: "ayaya",
        supportBigNumbers: true,
        multipleStatements: true,
        timezone: 'utc'
    }

}

const development = {

    //服务器端口
    SERVER_PORT: 3000,

    //MYSQL数据库配置
    MYSQL: {
        host: "localhost",
        user: "root",
        password: "shui1567",
        port: "3306",
        database: "ayaya",
        supportBigNumbers: true,
        multipleStatements: true,
        timezone: 'utc'
    }

}

const config = {
    DEV: development,
    PROD: production
}

module.exports = config