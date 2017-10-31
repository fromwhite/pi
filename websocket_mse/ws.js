"use strict";
const fs                = require('fs');
const WebSocket         = require('ws');
const WebSocketServer   = WebSocket.Server;
const Splitter          = require('stream-split');
const Throttle          = require('stream-throttle').Throttle;
const uuid              = require('node-uuid');

//NAL break
//const NALseparator    = new Buffer([0,0,0,1]);
const NALseparator      = new Buffer(16);


class WSocket {
    constructor (port) {
        this.clients = [];
        this.wss = new WebSocketServer({ host:'localhost',port: 8181 });

        this.new_client = this.new_client.bind(this);
        this.getStream = this.getStream.bind(this);
        this.wss.on('connection', this.new_client);
    }

    new_client (ws) {
        let self = this;

        let client_uuid = uuid.v4();
        this.clients.push({"id":client_uuid,"ws":ws});
        console.log('client [%s] connected', client_uuid);
        ws.send(JSON.stringify({
            action : "connected",
            uuid : client_uuid
        }));

        ws.on("message",function(data){
            var action = '' + JSON.parse(data).action;
            console.log("Incomming action '%s'", action);
            switch(action){
                case 'NEW':
                    self.getStream(client_uuid,source)
                case 'REQUESTSTREAM':
                    self.getStream(client_uuid);
                    break;
                case 'STOPSTREAM':
                    self.readStream.pause();
            }
        });

        ws.on('close', function() {
            self.readStream = null;
            for(let i=0;i<self.clients.length;i++){
                if (self.clients[i].id == client_uuid ){
                    self.clients.splice(i,1);
                }
            }
            console.log('stopping client interval');
          });

        
        process.on('SIGINT', function () {
            console.log("Closing things");
            process.exit();
        })
    }

    getStream (uid,s) {
        var readStream = this.get_feed(s);
        this.readStream = readStream;
    
        //readStream = readStream.pipe(new Splitter(NALseparator));
        //readStream.on("data", this.sendFM(uid));
        var self = this;
        readStream.on("data", function(data,uid){
            for (let i = 0; i < self.clients.length; i++) {
                
                if ( self.clients[i].ws.readyState === WebSocket.OPEN ){
                    self.clients[i].ws.send(data);
                }
                
            }
        });
    }

    get_feed(s = 'dota.mp4') {
            var source = s;
        
            var sourceThrottleRate = Math.floor(fs.statSync(source)['size'] / 58);
            console.log("Generate a throttle rate of %s kBps", Math.floor(sourceThrottleRate/1024));
        
            var readStream = fs.createReadStream(source);
            //readStream = readStream.pipe(new Throttle({rate: sourceThrottleRate}));
        
            return readStream;
    }

}

module.exports = WSocket;