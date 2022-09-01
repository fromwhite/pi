#!/bin/sh

echo "* 确认备份文档? "
while :; do
    read input
    case $input in
    *)
        echo "get file \033[31m $input \033[0m"

        if [ ! -d "$input" ]; then
            echo "\033[31m 检查文档,找不到 $input  \033[0m"
            exit 1
        else
            # cd $pwd/$input
            # tar -cvf backup/$input@`date +%Y-%m+%d`.tar.gz * .[!.]*
            tar -cvpzf backup/${input}@$(date +%Y-%m+%d).tar.gz --exclude= $input
            if [ $? -eq 0 ]; then
                echo "\033[32m 备份成功! \033[0m"
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
        ;;
    esac
    # while
done

exit 0
