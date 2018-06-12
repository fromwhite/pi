const fs = require("fs"),
    path = require("path"),
    readline = require('readline')
    marked = require('marked');

let key = {
    Id: '01',
    name: 'secret',
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

async function getRetCode() {
    return retCode
}
async function getKey() {
    return key
}

/**
 * 获取post目录 md文件列表 读取文件头 title/date/tag 返回list对象
 */
async function getList() {
    let cache = []
    let base = 'post/'
    let files = fs.readdirSync(base);
    await files.reduce((Promise, item) => {
        return Promise.then(() => getSource(base + item, /---title:(.*?)date:(.*?)tag:(.*?)---/, 5).then(data => {
            cache.push(data)
        }))
    }, Promise.resolve())
    // 排序
    // cache.sort((a, b) => {
    //     a = Number(a.date.replace(/-/g, ""))
    //     b = Number(b.date.replace(/-/g, ""))
    //     return a - b < 0
    // })
    cache.reverse()
    // 插入年份date title为空
    let result = []
    let year = null
    cache.map((value, index) => {
        let item = value.date.match(/^(.*?)-/)[1];
        if (!!year) {
            // 去年
            let then = Number(item)
            if (year == then + 1) {
                year = then
                result.push({
                    title: null,
                    date: year
                })
            }
            if (!result.includes(value)) {
                result.push(value)
            }
        } else {
            // 第一项 初始化year
            year = Number(item)
            result.push(value)
            result.unshift({
                title: null,
                date: year
            })
        }
    })
    return result
}

/**
 * 工具方法 获取文件源 读取文件字符串
 * @param {*} name 文件名 path+name
 * @param {*} reg 字符匹配规则 默认完整字符串 不进行匹配
 * @param {*} line 读取行数 默认全部
 */
function getSource(name, reg = null, line = null) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(name),
            crlfDelay: Infinity
        });
        let lineCount = 0
        let fileContent = ''
        rl.on('line', (line) => {
            lineCount += 1
            fileContent = fileContent + line
            line ? function () {
                if (lineCount >= 5) {
                    rl.close()
                    console.log('close')
                }
            } : 0;
            // console.log(`文件的单行内容：${line}`);
        });
        rl.on('close', () => {
            let result = reg ? fileContent.match(reg) : fileContent;
            // getList 增加path
            resolve({
                title: result[1],
                date: result[2],
                tag: result[3],
                path: name
            })
            lineCount = null
            fileContent = null
        });
    })
}

async function logger(ctx, next) {
    const start = new Date();
    await next()
    console.log(`method: ${ctx.method} code: ${ctx.status} time:${new Date - start}ms`);
}

async function getPost(ctx, next, title) {
    // 获取缓存文件
    let base = './views/cache';
    let files = fs.readdirSync(base);
    if (!files.includes(title + '.html')) {
        // md2html
        let template = fs.readFileSync('./views/template.html', 'utf8').toString()

        // return new Promise((resolve, reject) => {
        //     const rl = readline.createInterface({
        //         input: fs.createReadStream('./post/' + title + '.md'),
        //         crlfDelay: Infinity
        //     });
        //     let mdContent = ''
        //     rl.on('line', (line) => {
        //             mdContent = mdContent + line
        //         })
        //         .on('close', () => {
        //             let result = mdContent.match(/---(.*?)---(.*?)$/)
        //             mdContent = result[2]
        //             let tl = result[1]
        //             let titleResult = tl.match(/^title:(.*?)date:(.*?)tag:(.*?)$/)
        //             let time = titleResult[2]
        //             let tags = titleResult[3]
        //             let tagTemplate = '<a href="/archive#{{tag}}" title="linux">#{{tag}}</a>'
        //             let regTesmplate = ''
        //             if (tags.includes(',')) {
        //                 tags = tags.split(',')
        //                 tags.map(value => {
        //                     // 去掉前后空格   去掉中间空格replace(/\s/g,"") 去掉所有html标签replace(/<\/?[^>]*>/gim,"")
        //                     regTesmplate += tagTemplate.replace(/{{tag}}/g, value.replace(/(^\s+)|(\s+$)/g, ""))
        //                 })
        //             } else {
        //                 regTesmplate = tagTemplate.replace(/{{tag}}/g, tags.replace(/(^\s+)|(\s+$)/g, ""))
        //             }
        //             let htmlStr = marked(mdContent);
        //             template = template.replace(/{{title}}/g, title);
        //             template = template.replace(/{{markContext}}/g, htmlStr);
        //             template = template.replace(/{{time}}/, time)
        //             template = template.replace(/{{tag}}/g, regTesmplate)
        //             fs.writeFileSync('./views/cache/' + title + '.html', template);
        //             resolve()
        //         });

        // })

        let mdContent = fs.readFileSync('./post/' + title + '.md', 'utf8').toString()
        let result = mdContent.split('---')
        let tl = result[1].replace(/\n/g, '').match(/^title:(.*?)date:(.*?)tag:(.*?)$/)
        let time = tl[2]
        let tags = tl[3]
        let tagTemplate = '<a href="/archive#{{tag}}" title="{{tag}}">#{{tag}}</a>'
        let regTesmplate = ''
        if (tags.includes(',')) {
            tags = tags.split(',')
            tags.map(value => {
                // 去掉前后空格   去掉中间空格replace(/\s/g,"") 去掉所有html标签replace(/<\/?[^>]*>/gim,"")
                regTesmplate += tagTemplate.replace(/{{tag}}/g, value.replace(/(^\s+)|(\s+$)/g, ""))
            })
        } else {
            regTesmplate = tagTemplate.replace(/{{tag}}/g, tags.replace(/(^\s+)|(\s+$)/g, ""))
        }
        let md = result[2]
        let htmlStr = marked(md);
        template = template.replace(/{{title}}/g, title);
        template = template.replace(/{{markContext}}/g, htmlStr);
        template = template.replace(/{{time}}/, time)
        template = template.replace(/{{tag}}/g, regTesmplate)
        // 在img后加入图片最大宽度 width=400
        template = template.replace(/(<img[^>]*)(\/?>)/gi, "$1 width=400 $2")
        fs.writeFileSync('./views/cache/' + title + '.html', template);
    }
    await next()
}

module.exports = {
    getList,
    getRetCode,
    getKey,
    getPost
}