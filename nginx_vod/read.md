#### nginx_vod：nginx-rtmp模块推流，nginx代理一个web服务向前端呈现vod list，前端通过url schemes打开vlc播放rtmp视频流
##### 前置依赖条件
* nginx-1.9.9
* nginx-rtmp-module 
* vlc player for ios

##### 配置流程
* 下载nginx与nginx-rtmp-module源码，编译并安装
```
/* home作为主目录 */
cd /home
/* 下载nginx-1.9.9源码 */
wget http://nginx.org/download/nginx-1.9.9.tar.gz
/* 解压nginx */
tar -zxvf nginx-1.9.9.tar.gz
/* 获取nginx-rtmp-module */
git clone https://github.com/arut/nginx-rtmp-module.git
/* 编译nginx 并安装 */
cd nginx-1.9.9
./configure
make -j4 && make install
/*新建/nginx-1.9.9/extra目录 并将nginx-rtmp-module移入 */
cd /nginx-1.9.9/extra
mkdir extra
mv ../nginx-rtmp-module ./extra
/* 编译 并安装 */
./configure --with-http_ssl_module --add-module=./extra/nginx-rtmp-module
make -j4 && make install
make clean
/* 至此 没异常就完成 nginx依赖一些基础库，如果编译过程发现缺库，就升级 或者手动添加依赖库 */
/* 默认编译nginx 没有手动指定 ./configure ----prefix=/usr/local/nginx 默认安装在/usr/local/nginx */
/* 执行 test 测试默认安装 */
/usr/local/nginx
/* 成功说明已安装 可能存在端口占用 libc异常等等 */
/* 为了方便全局使用 做一个软连接 */
sudo ln -s /usr/local/nginx/sbin/nginx /usr/sbin/nginx
/* 执行 test 查看版本信息 */
nginx -v
```
* 开启一个点播服务 nginx conf在/usr/local/nginx/conf 将原conf备份conf.bak 在nginx.conf最后加上rtmp规则 pi为我自己的关联目录 rtmp://192.168.1.100/vod/xx.mp4

