// ws server
const server            = require('./server.js');
const fs                = require('fs');

const WebSocketServer   = require('ws').Server;

const Splitter          = require('stream-split');
const Throttle          = require('stream-throttle').Throttle;

const serv = new server(8080);

//处理buffer分片，防止视频大文件  小文件注释NAL
//const NALseparator    = new Buffer([0,0,0,1]);
const NALseparator    = new Buffer(16);

wss = new WebSocketServer({ host:'localhost',port: 8181 });

wss.on('connection', function (ws) {
    console.log('client connected');
    //get video target 
    var ss = 'dota.mp4';

    fs.exists(ss,function(exists){
        if (!ss || !exists) {  
            ws.send('404');  
            ws.end();  
            return;  
        }  
        var readStream = fs.createReadStream(ss);
        this.readStream = readStream;
        //pipe增加buffer分片
        var sourceThrottleRate = Math.floor(fs.statSync(ss)['size'] / 58);
       
        readStream = readStream.pipe(new Throttle({rate: sourceThrottleRate}));
        readStream = readStream.pipe(new Splitter(NALseparator));
       
        readStream.on('data',function(data){
            console.log(data)
            console.log('isBuffer: ' + Buffer.isBuffer(data)) // isBuffer: true
            //处理buffer分片
            ws.send(Buffer.concat([NALseparator, data]), { binary: true})
            //ws.send(data);
        });
        
        readStream.on('close', function(data) {  
            ws.send(JSON.stringify({
                         action : "end",
                         width  : 'xx.mp4'
            }));
            console.log("Stream finished.");  
        });

    })

    process.on('SIGINT', function () {
        console.log("Closing things");
        process.exit();
    });

});