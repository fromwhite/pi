const fs = require("fs"),
    path = require("path"),
    readline = require('readline'),
    marked = require('marked'),
    formidable = require("formidable");

let key = {
    Id: '01',
    name: 'secret',
    // 123456
    passwd: 'e10adc3949ba59abbe56e057f20f883e'
}

const resultCode = {
    SessionExpired: -1, //session过期
    Fail: 0, //失败
    Success: 1, //成功
    ArgsError: 2, //参数错误
    UserExisted: 10, //用户已经存在
    UsernameOrPasswordError: 11, //用户名或者密码错误      
    UserNotExist: 12, //用户不存在    
};

// 单核套路云 直接写内存
let seed = {
    storage: {},
    get(key, maxAge) {
        return this.storage[key]
    },
    set(key, sess, maxAge) {
        this.storage[key] = sess
    },
    destroy(key) {
        delete this.storage[key]
    }
}

// post目录 --- 文件信息 ---
let ListCache = {
    storage: null,
    get() {
        return this.storage
    },
    set(cache) {
        this.storage = cache
    },
    destroy() {
        this.storage = null
    }
}

class Event {
    constructor() {
        this.subscribers = new Map([
            []
        ]);
    }

    on(type, fn) {
        let subs = this.subscribers;
        if (!subs.get(type)) return subs.set(type, [fn]);
        subs.set(type, (subs.get(type).push(fn)));
    }

    emit(type, content) {
        let handlers = this.subscribers.get(type);
        if (!handlers) return
        for (let fn of handlers) {
            fn.apply(this, [].slice.call(arguments, 1));
        }
    }
}

async function getRetCode() {
    return resultCode
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
/**
 * 上次文件 写到post(md) assets(image)
 * @param {*} ctx 
 * @param {*} next 
 */
async function upfile(ctx, next) {
    let form = new formidable.IncomingForm()
    let result = null
    let filepath = null
    return new Promise((resolve, reject) => {
        form.parse(ctx.req, async function (err, fields, files) {
            if (err) {
                result = err
                throw err;
                reject(err)
            }
            // 获取类型 form name
            let file = files.file.name
            // const ext = filename.split('.').pop()
            if (!(!/.(gif|jpg|jpeg|bmp|png)$/.exec(file))) {
                // 检测文件格式是为gif,jpg,jpeg,bmp,png ture
                filepath = '/assets/images'
            } else if (!(!/.md$/.exec(file))) {
                filepath = '/post'
            } else {
                result = 'filetype error'
            }
            let original_path = files.file.path
            let target_path = __dirname + "/" + filepath + "/" + file
            fs.rename(original_path, target_path, function (err) {
                if (err) throw err
                // fs.unlink(files.file.path, function (err) {
                //     if (err) throw err;
                //     result = 1;
                //     resolve(result)
                //     reject(err)
                // })
                result = resultCode.Success;
                resolve(result)
            })
        })
    })
}
/**
 * 侦听post目录，上传/删除md文件 重置cache
 */
async function mdFileListener(ctx, next) {
    let watch_path = './post'
    fs.watch(watch_path, (err, file) => {
        if (err) console.error(err)
        console.log(file, 'has changed!')
        // caches clear
        ListCache.destroy()
    })
    await next()
}

async function del_post(ctx, next) {
    let result = null
    let form = ctx.request.body
    let target = path.join(form.origin)
    let tmp_origin = path.join('/views/cache' + target.match(/\/.*?\./)[0] + 'html')
    return new Promise((resolve, reject) => {
        fs.unlink(target, function (err) {
            if (err) reject(err);
            fs.unlink(tmp_origin, function (err) {
                console.error(err)
                result = resultCode.Success
                resolve(result)
            })
        })
    })
}

module.exports = {
    seed,
    ListCache,
    getList,
    getRetCode,
    getKey,
    getPost,
    upfile,
    mdFileListener,
    del_post
}