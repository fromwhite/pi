#### 在beaglebone black wireless上面运行一个完整debian jessie 做过的一些有趣玩法 

 * debian samba + vlc，为文件系统基础，建立一个共享文件区
 * websocket_mediasource，websocket推流，前端把MP4fragement喂给video blob
 * nginx_vod，使用nginx-rtmp模块推流，nginx代理一个web服务向前端呈现vod list，前端url schemes打开vlc播放rtmp视频流
