##### nginx_vod：nginx-rtmp模块推流，nginx代理一个web服务 在浏览器呈现vod list，通过url schemes打开 使用vlc播放rtmp视频流

##### 基础工具和库
* nginx
* nginx-rtmp-module 
* vlc player for ios
```
sudo apt-get install build-essential libpcre3 libpcre3-dev openssl libssl-dev zlib1g-dev 
```

##### 配置流程 下载nginx与nginx-rtmp-module源码，编译并安装
```
wget http://nginx.org/download/nginx-1.11.8.tar.gz
wget https://github.com/arut/nginx-rtmp-module/archive/master.zip
tar -zxvf nginx-1.11.8.tar.gz
unzip master.zip
cd nginx-1.11.8
./configure --with-http_ssl_module --add-module=../nginx-rtmp-module-master
make -j4 && make install
/* 为了方便全局使用 做一个软连接 */
sudo ln -s /usr/local/nginx/sbin/nginx /usr/sbin/nginx
/* 查看版本信息 */
nginx -v
```

##### 开启一个点播服务    
```
nginx conf在/usr/local/nginx/conf 
将原conf备份conf.bak 
在nginx.conf最后 加上rtmp规则(本文档内nginx.conf) pi为我自己的关联目录 
完整地址 rtmp://192.168.1.100/vod/xx.mp4
```

##### vod list服务与模块启动方式
```
python server.py app:app
```
