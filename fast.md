## 快速上手
目前主要玩的板子是BeagleBone,树莓派玩家注意,部分传感器和gpio硬件不同,纯软件部分标准兼容,所有目录都会单独描述版本和库依赖
BB最新debian image 默认账户debian temppwd
ssh登陆之后 增加sudo passwd root密码 然后重置debian账户

### 更新
```
sudo sed -i 's/httpredir.debian.org/mirrors4.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
sudo apt-get update
sudo apt-get upgrade
sudo reboot
```

更改时区
```
timedatectl set-timezone Asia/Shanghai
```

### wifi设置
BB默认开启一个SoftAp  通过ifonfig可以看到4个不同的网络 SoftAp0 lo usb0 wlan0
SoftAp0 ssid为beagleboneXXXX,通过这个ap连接，转发到固定192.168.8.1一个wificonfig页面,在此页面选择wifi,成功连接后会生成配置文件下次开机自连
SoftAp0的配置文件在/etc/default/bb-wl18xx,修改TETHER_ENABLED=yes为TETHER_ENABLED=no,reboot后就会发现ap已关闭，这样就不怕好奇宝宝挟持流量了
假如经常变动wifi环境,通过开关softap比较麻烦,那么还有一个ConnMan,这是一个非常小巧且可靠的工具,通过connmanctl添加网络连接成功后，会在/var/lib/connman生成配置文件,并且下次自动连接.
我们可以添加一个默认wifi配置,当陌生环境时，通过这样一个默认热点给BB连接,在ssh修改wifi
```
connmanctl
> enable wifi # 启用无线网卡
> scan wifi # 扫描无线网络
> services # 列举扫描到的无线网络 connect后面的参数是wifi_开头的而不是你的无线网名称。managed代表AP模式 (非Ad-Hoc),psk为加密方式。开放网络是none，此时不需要agent on
> services wifi_*_psk # [optional] 查看某个无线网络的具体信息
> agent on # [ptional] 无密码的可以不需要这句
> connect wifi_*_psk # 不是SSID，二是后面对应的wifi_*，根据自己情况修改此时会要求你输入网络密码
> state # 成功连接状态为ready，已连上网是online
> help # 显示帮助文件
> quite # 退出
```

### 挂载u盘
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

### 从sd卡开机
默认优先引导sd卡的镜像 sd不存在或者没有可运行的系统时就引导板载emmc
从ti下载最新镜像 写入sd卡 reboot

### 扩容sd卡
调整分区大小的shell脚本内置到debian系统中，cd /opt/scripts/tools,路径下grow_partition.sh
进入tools路径后，可用ls -l命令查看
增加权限 
```
chmod u+x grow_partition.sh
```  
执行
```
./grow_partition.sh
```
即可执行grow_partition.sh文件
```
reboot 
```
df查看即可 3.3G恢复到了15G

关闭不常用的蓝牙服务 在/etc/rc.local加入命令
```
rfkill block bluetooth
```
### 屏蔽登陆信息
```
#vi /etc/issue
#vi /etc/issue.net
#rm -rf /etc/motd
```

### 移除apache2
```
#apt-get --purge remove apache2
#apt-get --purge remove apache2-utils

#rm -rf /etc/apache2
#rm -rf /var/www
#rm -rf /etc/libapache2-mod-jk
```
### 设置samba
```
首选安装
apt-get install samba
//如果有依赖警告，先更新再安装
创建共享目录 /xx
mkdir /home/pi
chmod 777 pi //权限自己看需求
adduser pi //增加共享用户
touch /etc/samba/smbpasswd //创建samba账户
smbpasswd -a pi //添加分享账户
vim /etc/samba/smb.conf
在smb.conf最后添加上,
[pi] //share 共享两个目录 一个为path描述 一个为共享用户目录 此处改为pi path为共享用户pi目录.只要一个共享目录，省略创建新的共享分区
　　path = /home/pi //需要共享的本地路径，必须使用绝对路径 第二个共享目录 /xx 忽略 只共享pi用户目录
　　available = yes
　　browsealbe = yes
　　valid users = pi //在这里添加前面创建的一个用户叫 pi
　　public = yes
　　writable = yes
  
完成退出，/etc/init.d/samba restart
设置开机启动，在/etc/init.d/新建脚本 start_smb
#！/bin/bash
### BEGIN INIT INFO
# Provides:          start_samba
# Required-Start:    $all
# Required-Stop:
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Run /etc/init.d/start_samba if it exist
### END INIT INFO
sudo  /etc/init.d/samba start

完成退出，编辑/etc/sudoers，给予无密码权限，在最后一行添加
user debian=NOPASSWD:/etc/init.d/samba
完成退出，
chmod +x /etc/init.d/start_smb.sh   //加可执行权限
设置开机启动
sudo update-rc.d start_smb.sh defaults 99
取消
sudo update-rc.d -f start_smb remove

reboot
```

### 从进程查找启动脚本
经常写的脚本忘了放在那里了
1.通过ps -ef |grep xxxxx 或者htop得到该进程的pid   
2.输入ls -l /proc/N ,结果中 exe链接对应的就是可执行文件的路径   
/proc/N pid为N的进程信息   
/proc/N/cmdline 进程启动命令   
/proc/N/cwd 链接到进程当前工作目录   
/proc/N/environ 进程环境变量列表   
/proc/N/exe 链接到进程的执行命令文件   
/proc/N/fd 包含进程相关的所有的文件描述符   
/proc/N/maps 与进程相关的内存映射信息   
/proc/N/mem 指代进程持有的内存，不可读   
/proc/N/root 链接到进程的根目录   
/proc/N/stat 进程的状态   
/proc/N/statm 进程使用的内存的状态   
/proc/N/status 进程状态信息，比stat/statm更具可读性   

htop默认线程计算 f2选择display options 右侧选择hide userland threads过滤重复 f5树形展开
grep -rl 'abc' / 在根目录(/)下递归(r)查找包含'abc'的文件 列出文件名(参数l)
to be continued




