π - some interesting toys in the beaglebone :)
===

hardware: beaglebone green wireless   
platform: debian jessie   
expand: GPIO/UART0/UART1/I2C/SPI   
requirements: c/c++/python/shell/nginx/nodejs    

各文档单独目录，部分合并或者不再更新后会归档，backup保留归档源文件
* ~/pi 基础文件系统，包含samba/vlc共享本地
* websocket_mediasource websocket推流，前端video blob
* nginx_vod nginx-rtmp推流，nginx代理vod list页面，vlc schemes播放rtmp流
* ayaya nodejs／koa2最小实现登录注册留言，已归档