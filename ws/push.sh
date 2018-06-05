#!/bin/bash
# rsync -vazu --exclude 'node_modules/*' -progress --rsh=ssh ./ayaya pi@118.25.4.216:./
# echo "********** These files will be sync **********"
# rsync -avn -e 'ssh -p22' --rsh=ssh  ./* pi@118.25.4.216:./ayaya --exclude 'node_modules/*'
echo "********** Sure you want to sync?(y/n)"
while :
do
read input
case $input in
Y|y)
echo  "Start sync"
#rsync -avn -e 'ssh -p22' --rsh=ssh  ./* pi@118.25.4.216:./ayaya --exclude 'node_modules/*'
rsync -vazu --exclude 'node_modules/*' -progress --rsh=ssh ./ pi@118.25.4.216:./ayaya/
exit
;;
N|n)
echo "Quit"
exit
;;
*)
echo "Please input y/n"
;;
esac
done