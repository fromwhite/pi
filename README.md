π - some interesting toys in the beaglebone :)
===

hardware: beaglebone green wireless   
platform: debian jessie   
expand: GPIO/UART0/UART1/I2C/SPI   
requirements: c/c++/python/shell/nginx/nodejs    

* ~/pi.文件系统基础，包含samba共享本地网络／vlc本地媒体资源
* websocket_mediasource，websocket推流，前端把MP4fragement喂给video blob
* nginx_vod，使用nginx-rtmp模块推流，nginx代理一个web服务向前端呈现vod list，前端url schemes打开vlc播放rtmp视频流