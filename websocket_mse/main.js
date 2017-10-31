#!/usr/bin/env node

const   fs           = require('fs');
const   port         = parseInt(process.argv[2] || 8080, 10);
const   Server = require('./server'),
        WS = require('./ws.js');

const   serv = new Server(port);
const   ws = new WS();

