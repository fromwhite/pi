#!/bin/sh 

echo "* Sure you want to backup?(file)"
while :
do
read input
case $input in
# 匹配模式
*)
echo "get file \033[31m $input \033[0m"

# 判断文件夹是否存在
if [ ! -d "$input" ]
then
echo "\033[31m 检查文档,找不到 $input  \033[0m"
exit 1
else
# echo "已存在"
# 打包
# cd $pwd/$input
# tar -cvf backup/$input@`date +%Y-%m+%d`.tar.gz * .[!.]* 
tar -cvpzf backup/${input}@`date +%Y-%m+%d`.tar.gz --exclude=  $input
    if [ $? -eq 0 ]    
    then    
        echo "\033[32m 备份成功! \033[0m"
        # 移除归档源文件
        # rm -Rv $input
        exit 0    
    else    
        echo "\033[31m 备份失败! \033[0m"      
        exit 1    
    fi
fi
# command...
#tar
exit
# 退出本次case
;;
#case语句的结束
esac
# while
done
# 退出shell
exit 0 