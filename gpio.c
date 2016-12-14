#include <stdlib.h>  
#include <stdio.h>  
#include <string.h>  
#include <fcntl.h> 
//define O_WRONLY and O_RDONLY  
#define SYSFS_GPIO_DIR "/sys/class/gpio"  
#define MAX_BUF 64  

#define SLOTS "/sys/devices/bone_capemgr.9/slots"
#define UART1 "/dev/ttyO1"
  
void main()  
{  
    int fd, fdu, len;  
    char buf[MAX_BUF];  
    char ch;  
    int i;  
  
    //export gpio66 
    fd = open(SYSFS_GPIO_DIR "/export", O_WRONLY);  
    len = snprintf(buf,sizeof(buf),"66");  
    write(fd,buf,len);  
    close(fd);  
  
    //set direction  
    snprintf(buf,sizeof(buf),SYSFS_GPIO_DIR"/gpio44/direction");  
    fd = open(buf, O_WRONLY);  
    write(fd, "in", 3);  
    close(fd);  
    
    //open uart1
    fdu = open(SLOTS,O_WRONLY);
    len = snprintf(buf,sizeof(buf),"BB-UART1");
    write(fdu,buf,len);
    close(fdu);
    fdu = open(UART1,O_WRONLY);
    len = snprintf(buf,sizeof(buf),"iysheng");
    write(fdu,buf,len);
    close(fdu);

    //read and print value 10 times  
    snprintf(buf,sizeof(buf),SYSFS_GPIO_DIR"/gpio66/value");  
    for(i=0;i<10;i++)  
    {  
    fd = open(buf, O_RDONLY);  
        read(fd,&ch,1);  
        printf("%c\n",ch);  
        usleep(1000000);  
   close(fd);  
    }  
}  