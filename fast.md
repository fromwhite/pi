## 快速上手
目前主要玩的板子是BeagleBone,树莓派玩家注意,部分传感器和gpio硬件不同,纯软件部分标准兼容,所有目录都会单独描述版本和库依赖
BB最新debian image 默认账户debian temppwd
ssh登陆之后 增加sudo passwd root密码 然后重置debian账户
区别于README,本文档主要记录系统修改和配置工具,格式就比较随意了

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

### 添加公共用户pi
```
useradd -g root -d/home/pi -m pi -s /bin/bash
passwd pi
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
可能提示异常 /mnt/8g_flash target is busy
则查找与/mnt/8g_flash相关进程 lsof /mnt/8g_flash 并kill %%
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
```

### 修改hostname
```
sudo nano /etc/hostname
// sudo nano /etc/hosts
```


### 从进程查找启动脚本
经常写的脚本忘了放在那里了
1.通过ps -ef |grep xxxxx 或者htop得到该进程的pid   
2.输入ls -l /proc/N ,结果中 exe链接对应的就是可执行文件的路径   
```
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
```
### 备份系统（文件备份）
```
// 备份前先切换到root用户，避免权限问题，然后切换到/（根目录）
sudo su
cd /
tar -cvpzf /pi_backup@`date +%Y-%m+%d`.tar.gz --exclude=/proc --exclude=/sys --exclude=/tmp --exclude=/var/cache/apt/archives --exclude=/boot --exclude=/home --exclude=/lost+found --exclude=/media --exclude=/mnt --exclude=/run /
参数：
-c： 新建一个备份文档 
-v： 显示详细信息 
-p： 保存权限，并应用到所有文件 
-z： 用gzip压缩备份文档，减小空间 
-f： 指定备份文件的路径 
–exclude： 排除指定目录，不进行备份
目录说明：
/proc：一个虚拟文件系统，系统运行的每一个进程都会自动在这个目录下面创建一个进程目录。既然是系统自动创建，也就没必要备份的必要了。 
/tmp：一个临时文件夹，系统的一些临时文件会放在这里。 
/lost+found：系统发生错误时（比如非法关机），可以在这里找回一些丢失文件。 
/media：多媒体挂载点，像u盘、移动硬盘、windons分区等都会自动挂载到这个目录下。 
/mnt：临时挂载点，你可以自己挂载一些文件系统到这里。 
/run：系统从启动以来产生的一些信息文件。 
/home：用户目录，存放用户个人文件和应用程序。 
/boot：和系统启动相关的文件，像grub相关文件都放在这里，这个目录很重要！

// 系统还原 操作前切换到root，并且换到/根目录
tar -xvpzf /pi_backup@2018-5-4.tar.gz -C /
```
### git专栏
```
git丢弃本地修改的所有文件（新增、删除、修改）
git checkout . #本地所有修改的。没有的提交的，都返回到原来的状态
git stash #把所有没有提交的修改暂存到stash里面。可用git stash pop回复。
git reset --hard HASH #返回到某个节点，不保留修改。
git reset --soft HASH #返回到某个节点。保留修改

git clean -df #返回到某个节点
git clean 参数
    -n 显示 将要 删除的 文件 和  目录
    -f 删除 文件
    -df 删除 文件 和 目录

Git出现Unable to create 'E:/xxx/.git/index.lock': File exists.的解决办法(注意路径)
rm -f .git/index.lock
```

### 正则笔记
```
* 匹配img自定义属性data <img data="/home" class="" src="" />
var reg=/<img[^>]+data[=\'\"\s]+([^\'\"]*)[\'\"]?[\s\S]*/i;
str = str.replace(reg,"$1");
* 一编文章里有很多<img src=""><img src="">向里边加width="100%"
var reg = /(<img[^>]*)(\/?>)/gi;
var html = "";
html = html.replace(reg, "$1width='100%' $2");
```

************************************
##### bonebeagle
```
* 在sd引导的是ti iot版本的debian9
*.1 systemd socket启动一个nodejs server给嵌入式板子提供服务，暂时用不上，先修改这个server为推流服务器
可能存在端口占用 lsof -i:80
使用systemd禁用多余得socket服务
显示所有已启动的服务 systemctl list-units --type=service
检查服务状态 systemctl status xx.service
停止某服务 systemctl stop xx.service
启动某服务 systemctl start xx.service
重启某服务 systemctl restart xx.service
使某服务不自动启动 systemctl disable xx.service
使某服务自动启动 systemctl enable xx.service
在debian9的位置 /lib/systemd/system/ bak备存强制中止服务

访问bb.local:80 激活bonescript服务， systemctl status bonescript.service查看服务配置
 Loaded: loaded (/lib/systemd/system/bonescript.service; disabled; vendor preset: enabled)
   Active: failed (Result: exit-code) since Wed 2018-09-05 11:22:07 CST; 18s ago

阮胖子这里有一个较全的文章说明systemd http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html
备份 先关闭自启动 有三个文件，来分析一下
先disble socket 再处理service
增加一个ws service socket
unit 连接描述 ws server
Environment 指定环境变量到 root
WorkingDirectory 指定目录 /home/pi/ws
RemainAfterExit 关联状态与连接符unit 这里先去掉这个参数 对进程控制手动grep
install WantedBy 设置target 这里保持原本的multi-user.target systemctl list-unit-files所有文件中的target与wants配置 level修改参考胖子文章
socket 默认80端口与socket.target
在/usr/bin创建 ws.sh脚本 文件备份在ws目录
保存后
先载入socket再enable service
sudo systemctl daemon-reload
sudo systemctl restart ws.service
socket激活服务 
先systemctl disable ws.service 
systemctl enable ws.socket 
systemctl daemon-reload
最后重启
```
to be continued