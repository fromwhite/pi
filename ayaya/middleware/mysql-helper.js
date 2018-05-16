const mysql = require("mysql")
const _config = require('./../dll/config.js')

let DEV = process.env.NODE_ENV === 'development'; //开发
let PROD = process.env.NODE_ENV === 'production'; //生产

const config = DEV ? _config['DEV'] : _config['PROD'];

const pool = mysql.createPool(config.MYSQL)

let query = (sql, args) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, args, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })

}

module.exports = {
    query
}