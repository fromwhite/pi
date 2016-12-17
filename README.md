###beaglebone black lab. 

 * debian on SoC
 * ssh
 * wifi wlan
 * usb-camera

###own & pick
```
git clone git@github.com:shui14/BBLab.git
cd BBLab
```

###Future
* nas
* opencv

###Discussing
* email <shui.14@qq.com>

##快速上手
###查看本机信息
```
lsb_release -a
cat /proc/version
uname -a
df -Th
netstat -lnp
```

###更新
```
sudo apt-get update
sudo apt-get upgrade
sudo reboot
```

###wifi设置

方法一
连接bbb，打开浏览器，输入http://192.168.8.1/login，可以在里面选择要连接的上级路由器并设置相应的密码
ssh连接
ifconfig命令看下网络配置
SoftAP0, 一个usb0，一个wlan0，分别对应的IP为：192.168.8.1，192.168.7.2，192.168.2.104
route命令来查看路由设置
wlan0负责处理192.168.2.0/24及192.168.8.0/24的所有路由转发，
而usb0则负责所有192.168.7.0/24的路由转发，
SoftAP0为ap

方法二
ssh登陆
sudo iwlist wlan0 scan 命令  可以显示周围所有的无线网络  ESSID即为无线网络名
找到自己想连接的那个网络，在最下端输入sudo nano /etc/wpa_supplicant/wpa_supplicant.conf 命令，按回车键，即可进入nano 编辑器，打开wpa_supplicant配置文件
在文件最底部添加
```
network={
ssid="网络名"
psk="密码"
}
```
添加完之后，按ctrl+x，再按y键 最后按回车，wifi网络即可添加完成

###挂载u盘
原理：
在Linux中，插入U盘，系统识别后，则会自动在 /dev 目录增加一个设备文件，  名为 /dev/sda1 或 sda2 或 sdb1...
然后，可以用mount命令把这个设备挂接到一个空的目录中。完成后，该目录即是这个U盘，按权限读写即可。
使用完毕，用umount命令将这个目录卸载，再取出U盘即可

步骤：
1. 插入U盘前先：
```
ls /dev/sd*
```
此时应该会提示No such file or directory
2. 然后插上U盘再：
```
ls /dev/sd*
```
此时就有结果了，我的是：/dev/sda 和 /dev/sda4
3. 开始挂载
```
sudo mkdir /mnt/8g_flash
sudo mount  /dev/sda4 /mnt/8g_flash
```
用完之后卸载
```
sudo umount /mnt/8g_flash
```

如果提示设备在忙
umount: /mnt/usb: device is busy
查找占用目录进程：
```
#lsof |grep /mnt/usb
bash 1971 root cwd DIR 8,1 16384 1 /mnt/usb/
bash 2342 root 3r DIR 8,1 16384 1 /mnt/usb/
```
杀掉进程，再卸载
```
#kill -9 1971
#kill -9 2342
```
记得查看 fdisk -l  或者df -h   less -f查看文件


###从sd卡开机
默认优先引导sd卡的镜像 sd不存在或者没有可运行的系统时就引导板载emmc
从ti下载最新镜像 写入sd卡 reboot

###扩容sd卡
调整分区大小的shell脚本内置到debian系统中，位于/opt/scripts/tools路径下grow_partition.sh
进入tools路径后，可用ls -l命令查看
增加x 
```
chmod u+x hello.sh
```
输入
```
./grow_partition.sh
```
即可执行grow_partition.sh文件
```
reboot 
```
df查看即可 3.3G恢复到了15G



to be continued




