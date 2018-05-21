#!/usr/bin/env node

'use strict';
const
        http = require('http'),
        url = require('url'),
        path = require('path'),
        fs = require('fs'),
        mime = {
                '.html': ['text/html', 86400],
                '.htm': ['text/html', 86400],
                '.css': ['text/css', 86400],
                '.js': ['application/javascript', 86400],
                '.json': ['application/json', 86400],
                '.jpg': ['image/jpeg', 0],
                '.jpeg': ['image/jpeg', 0],
                '.png': ['image/png', 0],
                '.gif': ['image/gif', 0],
                '.ico': ['image/x-icon', 0],
                '.svg': ['image/svg+xml', 0],
                '.txt': ['text/plain', 86400],
                'err': ['text/plain', 30]
        };

const port = parseInt(process.argv[2] || 80, 10);

// 文件服务器
class Server {
        constructor(port) {
                this.port = port || 8888;
                this.create(this.port);
        }
        create(port = 8080) {
                // new server
                http.createServer(function (req, res) {

                        let uri = url.parse(req.url).pathname,
                                filename = path.join(process.cwd(), uri);
                        // file available?
                        fs.access(filename, fs.constants.R_OK, (err) => {
                                // not found
                                if (err) {
                                        serve(404, '404 Not Found\n');
                                        return;
                                }

                                // index.html default
                                if (fs.statSync(filename).isDirectory()) filename += '/index.html';

                                // read file
                                fs.readFile(filename, (err, file) => {

                                        if (err) {
                                                // error reading
                                                serve(500, err + '\n');
                                        } else {
                                                // return file
                                                serve(200, file, path.extname(filename));
                                        }

                                });
                        });

                        // serve content
                        function serve(code, content, type) {
                                let head = mime[type] || mime['err'];

                                res.writeHead(code, {
                                        'Content-Type': head[0],
                                        'Cache-Control': 'must-revalidate, max-age=' + (head[1] || 2419200),
                                        'Content-Length': Buffer.byteLength(content)
                                });
                                res.write(content);
                                res.end();
                        }

                }).listen(port);
                console.log('Server running at http://localhost:' + port, 'wsocket on:' + '1999');
        }
}


const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const Splitter = require('stream-split');
const Throttle = require('stream-throttle').Throttle;
const uuid = require('node-uuid');

//NAL break
//const NALseparator    = new Buffer([0,0,0,1]);
const NALseparator = new Buffer.alloc(16);


class WSocket {
        constructor(port) {
                this.store = [];
                this.wss = new WebSocketServer({
                        host: '192.168.1.113',
                        port: 1999
                });

                this.new_client = this.new_client.bind(this);
                this.getStream = this.getStream.bind(this);
                this.wss.on('connection', this.new_client);
        }

        new_client(ws) {
                let self = this;

                let client_uuid = uuid.v4();
                this.store.push({
                        "id": client_uuid,
                        "ws": ws
                });
                console.log('client [%s] connected', client_uuid);
                ws.send(JSON.stringify({
                        action: "connected",
                        uuid: client_uuid
                }));

                ws.on("message", function (data) {
                        var action = '' + JSON.parse(data).action;
                        console.log("Incomming action '%s'", action);
                        switch (action) {
                                case 'NEW':
                                        self.getStream(client_uuid, source)
                                case 'REQUESTSTREAM':
                                        self.getStream(client_uuid);
                                        break;
                                case 'STOPSTREAM':
                                        self.readStream.pause();
                        }
                });

                ws.on('close', function () {
                        self.readStream = null;
                        for (let i = 0; i < self.store.length; i++) {
                                if (self.store[i].id == client_uuid) {
                                        self.store.splice(i, 1);
                                }
                        }
                        console.log('stopping client interval');
                });


                process.on('SIGINT', function () {
                        console.log("Closing things");
                        process.exit();
                })
        }

        getStream(uid, s) {
                var readStream = this.get_feed(s);
                this.readStream = readStream;

                //readStream = readStream.pipe(new Splitter(NALseparator));
                //readStream.on("data", this.sendFM(uid));
                var self = this;
                readStream.on("data", function (data, uid) {
                        for (let i = 0; i < self.store.length; i++) {

                                if (self.store[i].ws.readyState === WebSocket.OPEN) {
                                        self.store[i].ws.send(data);
                                }

                        }
                });
        }

        get_feed(s = 'dota.mp4') {
                var source = s;

                var sourceThrottleRate = Math.floor(fs.statSync(source)['size'] / 58);
                console.log("Generate a throttle rate of %s kBps", Math.floor(sourceThrottleRate / 1024));

                var readStream = fs.createReadStream(source);
                //readStream = readStream.pipe(new Throttle({rate: sourceThrottleRate}));

                return readStream;
        }

}

new Server(port);
new WSocket();