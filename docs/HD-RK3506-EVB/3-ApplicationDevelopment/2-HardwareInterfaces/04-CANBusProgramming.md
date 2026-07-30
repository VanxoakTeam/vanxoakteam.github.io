---
sidebar_position: 4
---

# CAN总线应用编程

:::tip 提示

本指南将指导您如何编写 **CAN 的收发**程序。


:::

HD-RK3506-EVB评估版上通过排针拓展出接口，其中包含CAN接口。

## 1. 初始化 CAN 网络接口

  在使用socket can之前，需要先通过命令设置 can 的波特率和打开 can 接口：

```c
root@rk3506-buildroot:/# ip link set can0 down
root@rk3506-buildroot:/# ip link set can0 type can restart-ms 100
root@rk3506-buildroot:/# ip link set can0 up type can bitrate 125000 dbitrate 2000000 fd on
[ 1214.181520] rk3576_canfd ff320000.can can0: bitrate error 0.0%
root@rk3506-buildroot:/# ip link set can0 up
```

  设置完成后，可以用 ifconfig 或者 ip 命令查看新添加的 can 接口：

```c
root@rk3506-buildroot:/# ifconfig can0
can0      Link encap:UNSPEC  HWaddr 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00
    UP RUNNING NOARP  MTU:72  Metric:1
        RX packets:0 errors:0 dropped:0 overruns:0 frame:0
            TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
                collisions:0 txqueuelen:10
                    RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
                        Interrupt:52

                            root@rk3506-buildroot:/# ip -d -s link show can0
2: can0: <NOARP,UP,LOWER_UP,ECHO> mtu 72 qdisc pfifo_fast state UP mode DEFAULT group default qlen 10
    link/can  promiscuity 0 allmulti 0 minmtu 0 maxmtu 0
    can <FD> state ERROR-ACTIVE (berr-counter tx 0 rx 0) restart-ms 100
    bitrate 125068 sample-point 0.870
    tq 61 prop-seg 56 phase-seg1 57 phase-seg2 17 sjw 1 brp 12
    rk3576_canfd: tseg1 1..128 tseg2 1..128 sjw 1..128 brp 1..256 brp_inc 2
        dbitrate 2006204 dsample-point 0.714
        dtq 71 dprop-seg 2 dphase-seg1 2 dphase-seg2 2 dsjw 1 dbrp 14
        rk3576_canfd: dtseg1 1..32 dtseg2 1..16 dsjw 1..16 dbrp 1..256 dbrp_inc 2
            clock 196608000
            re-started bus-errors arbit-lost error-warn error-pass bus-off
          0          0          0          0          0          0         numtxqueues 1 numrxqueues 1 gso_max_size 65536 gso_max_segs 65535 tso_max_size 65536 tso_max_segs 65535 gro_max_size 65536 parentbus platform parentdev ff320000.can
    RX:  bytes packets errors dropped  missed   mcast
             0       0      0       0       0       0
        TX:  bytes packets errors dropped carrier collsns
             0       0      0       0       0       0

```

## 2. socket can 编程

### 2.1 创建套接字

  就像TCP/IP协议一样，在使用CAN网络之前需要先打开一个套接字。CAN的套接字使用到了一个新的协议族，所以在调用socket(2)这个系统函数的时候需要将PF\_CAN作为第一个参数。当前有两个CAN的协议可以选择：一个是原始套接字协议；另一个是广播管理协议。可以这样来打开一个套接字（两种方式）：

```c
s = socket(PF_CAN, SOCK_RAW, CAN_RAW);
```

```c
s = socket(PF_CAN, SOCK_DGRAM, CAN_BCM);
```

### 2.2 绑定CAN接口

  在成功创建一个套接字之后，通常需要使用 bin() 函数将套接字绑定在某个指定的CAN接口上（这和TCP/IP使用不同的IP地址不同）。在绑定（CAN\_RAW）或连接（CAN\_BCM）套接字之后，就可以在套接字上使用 read()/write()函数，也可以使用 send()/sendmsg() 和对应的 recv() 函数。

  基本的CAN帧结构和套接字地址结构定义在/include/linux/can.h 头文件中：

```c
/*
* 扩展格式识别符由 29位组成。其格式包含两个部分：11 位基本 ID、18 位扩展 ID。
* Controller Area Network Identifier structure
*
* bit 0-28     : CAN识别符 (11/29 bit)
* bit 29       : 错误帧标志 (0 = data frame, 1 = error frame)
* bit 30       : 远程发送请求标志 (1 = rtr frame)
* bit 31       : 帧格式标志 (0 = standard 11 bit, 1 = extended 29 bit)
*/
typedef __u32 canid_t;
struct can_frame {
    canid_t can_id;           /* 32 bit CAN_ID + EFF/RTR/ERR flags */
    __u8    can_dlc;         /* 数据长度: 0 .. 8 */
    __u8    data[8] __attribute__((aligned(8)));
};
```

  结构体的有效数据在data数组中，它的字节对齐是64bit的，所以用户可以比较方便的在data中传输自己定义的结构和共用体。CAN总线中没有默认的字节序。在CAN\_RAW套接字上调用read()函数，返回给用户空间的数据是一个struct can\_frame的结构体。就像 PF\_PACKET 套接字一样，sockaddr\_can 结构体也有接口的索引，这个索引绑定了特定接口，如下所示：

```c
struct sockaddr_can {
    sa_family_t can_family;
    int        can_ifindex;
    union {
        /* transport protocol class address info (e.g. ISOTP) */
        struct { canid_t rx_id, tx_id; } tp;
        /* reserved for future CAN protocols address information */
    } can_addr;
};
```

  指定接口索引则需要调用ioctl()函数：

```c
int s;
struct sockaddr_can addr;
struct ifreq ifr;
s = socket(PF_CAN, SOCK_RAW, CAN_RAW);
strcpy(ifr.ifr_name, "can0" );
ioctl(s, SIOCGIFINDEX, &ifr);
addr.can_family = AF_CAN;
addr.can_ifindex = ifr.ifr_ifindex;
bind(s, (struct sockaddr *)&addr, sizeof(addr));
……
```

  为了将套接字和所有的CAN接口绑定，接口索引必须是0。这样套接字就可以从所有使用的CAN接口接收CAN帧。revfrom()函数可以指定从哪个接口接收。在一个已经和所有CAN接口绑定的套接字上，sendto()函数可以指定从哪个接口发送。

### 2.3 接收/发送帧

  从一个CAN\_RAW套接字上读取CAN帧也就是读取struct can\_frame结构体：

```c
struct can_frame frame;
nbytes = read(s, &frame, sizeof(struct can_frame));
if (nbytes < 0) {
    perror("can raw socket read");
    return 1;
}
/* paranoid check ... */
if (nbytes < sizeof(struct can_frame)) {
    fprintf(stderr, "read: incomplete CAN frame\n");
    return 1;
}
/* do something with the received CAN frame */
```

  写CAN帧也是类似的用到write()函数：

```c
nbytes = write(s, &frame, sizeof(struct can_frame));
```

  如果套接字跟所有的CAN接口都绑定了（addr.can\_index = 0），推荐使用recvfrom()函数获取数据源接口信息：

```c
struct sockaddr_can addr;
struct ifreq ifr;
socklen_t len = sizeof(addr);
struct can_frame frame;
nbytes = recvfrom(s, &frame, sizeof(struct can_frame),
                   0, (struct sockaddr*)&addr, &len);
/* get interface name of the received CAN frame */
ifr.ifr_ifindex = addr.can_ifindex;
ioctl(s, SIOCGIFNAME, &ifr);
printf("Received a CAN frame from interface %s", ifr.ifr_name);
```

对于绑定了所有接口的套接字，向某个端口发送数据必须指定接口的详细信息：

```c
strcpy(ifr.ifr_name, "can0");
ioctl(s, SIOCGIFINDEX, &ifr);
addr.can_ifindex = ifr.ifr_ifindex;
addr.can_family  = AF_CAN;
nbytes = sendto(s, &frame, sizeof(struct can_frame),
                 0, (struct sockaddr*)&addr, sizeof(addr));
```

### 2.4 使用过滤器

  在上面的介绍中，我们从CAN接口中接收所有的数据帧，也不管我们是不是感兴趣。如果我们只想要指定ID的数据帧，那我们需要使用过虑器。

- 原始套接字选项CAN\_RAW\_FILTER

  CAN\_RAW套接字的接收可以使用CAN\_RAW\_FILTER套接字选项指定的多个过滤规则。过滤规则定义在/include/linux/can.h 头文件中：

```c
struct can_filter {
    canid_t can_id;
    canid_t can_mask;
};
```

  过滤规则的匹配如下所示：

```c
<接收帧id>& mask == can_id & mask
```
```c
/* valid bits in CAN ID for frame formats */
#define CAN_SFF_MASK 0x000007FFU /* 标准帧格式 (SFF) */
#define CAN_EFF_MASK 0x1FFFFFFFU /* 扩展帧格式 (EFF) */
#define CAN_ERR_MASK 0x1FFFFFFFU /* 忽略EFF, RTR, ERR标志 */
struct can_filter rfilter[2];
rfilter[0].can_id   = 0x123;
rfilter[0].can_mask = CAN_SFF_MASK;
rfilter[1].can_id   = 0x200;
rfilter[1].can_mask = 0x700;
setsockopt(s, SOL_CAN_RAW, CAN_RAW_FILTER, &rfilter, sizeof(rfilter));
```

  为了在指定的CAN\_RAW套接字上禁用接收过滤规则，可以这样：

```c
setsockopt(s, SOL_CAN_RAW, CAN_RAW_FILTER, NULL, 0);
```

  在一些极端情况下不需要读取数据，可以把过滤规则清零（所有成员为0），这样原始套接字就会忽略接到的CAN帧。

- 原始套接字选项CAN\_RAW\_ERR\_FILTER

  CAN接口驱动可以选择性的产生错误帧，错误帧和正常帧以相同的方式传给应用程序，可能产生的错误被分为不同的种类，使用适当的错误掩码可以过滤它们。为了注册所有可能的错误情况，CAN\_ERR\_MASK这个宏可以用来作为错误掩码，这个错误掩码定义在 linux/can/error.h 头文件中。

  使用示例如下：

```c
an_err_mask_t err_mask = ( CAN_ERR_TX_TIMEOUT | CAN_ERR_BUSOFF );
setsockopt(s, SOL_CAN_RAW, CAN_RAW_ERR_FILTER,&err_mask, sizeof(err_mask));
```

## 3. 示例程序

  socket can的示例程序如下所示。该程序是把接收到的指定ID的数据帧打印出来，然后把接收到的数据帧发送出去。

```c
#include <stdio.h>
#include <sys/ioctl.h>
#include <arpa/inet.h>
#include <net/if.h>
#include <linux/socket.h>
#include <linux/can.h>
#include <linux/can/error.h>
#include <linux/can/raw.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <time.h>
#ifndef AF_CAN
#define AF_CAN 29
#endif
#ifndef PF_CAN
#define PF_CAN AF_CAN
#endif
static void print_frame(struct can_frame *fr)
{
    int i;
    printf("%08x\n", fr->can_id & CAN_EFF_MASK);
    //printf("%08x\n", fr->can_id);
    printf("dlc = %d\n", fr->can_dlc);
    printf("data = ");
    for (i = 0; i < fr->can_dlc; i++)
        printf("%02x ", fr->data[i]);
    printf("\n");
}
#define errout(_s)    fprintf(stderr, "error class: %s\n", (_s))
#define errcode(_d) fprintf(stderr, "error code: %02x\n", (_d))
static void handle_err_frame(const struct can_frame *fr)
{
    if (fr->can_id & CAN_ERR_TX_TIMEOUT) {
        errout("CAN_ERR_TX_TIMEOUT");
    }
    if (fr->can_id & CAN_ERR_LOSTARB) {
        errout("CAN_ERR_LOSTARB");
        errcode(fr->data[0]);
    }
    if (fr->can_id & CAN_ERR_CRTL) {
        errout("CAN_ERR_CRTL");
        errcode(fr->data[1]);
    }
    if (fr->can_id & CAN_ERR_PROT) {
        errout("CAN_ERR_PROT");
        errcode(fr->data[2]);
        errcode(fr->data[3]);
    }
    if (fr->can_id & CAN_ERR_TRX) {
        errout("CAN_ERR_TRX");
        errcode(fr->data[4]);
    }
    if (fr->can_id & CAN_ERR_ACK) {
        errout("CAN_ERR_ACK");
    }
    if (fr->can_id & CAN_ERR_BUSOFF) {
        errout("CAN_ERR_BUSOFF");
    }
    if (fr->can_id & CAN_ERR_BUSERROR) {
        errout("CAN_ERR_BUSERROR");
    }
    if (fr->can_id & CAN_ERR_RESTARTED) {
        errout("CAN_ERR_RESTARTED");
    }
}
#define myerr(str)    fprintf(stderr, "%s, %s, %d: %s\n", __FILE__, __func__, __LINE__, str)
static int test_can_rw(int fd, int master)
{
    int ret, i;
    struct can_frame fr, frdup;
    struct timeval tv;
    fd_set rset;
    while (1) {
        tv.tv_sec = 1;
        tv.tv_usec = 0;
        FD_ZERO(&rset);
        FD_SET(fd, &rset);
        ret = select(fd+1, &rset, NULL, NULL, NULL);
        if (ret == 0) {
            myerr("select time out");
            return -1;
        }
        /* select调用无错返回时，表示有符合规则的数据帧到达 */
        ret = read(fd, &frdup, sizeof(frdup));
        if (ret < sizeof(frdup)) {
            myerr("read failed");
            return -1;
        }
        if (frdup.can_id & CAN_ERR_FLAG) {              /* 检查数据帧是否错误 */
            handle_err_frame(&frdup);
            myerr("CAN device error");
            continue;
        }
        print_frame(&frdup);                            /* 打印数据帧信息 */
        ret = write(fd, &frdup, sizeof(frdup));         /* 把接收到的数据帧发送出去 */
        if (ret < 0) {
            myerr("write failed");
            return -1;
        }
    }
    return 0;
}
int main(int argc, char *argv[])
{
    int s;
    int ret;
    struct sockaddr_can addr;
    struct ifreq ifr;
    int master;
    srand(time(NULL));
    s = socket(PF_CAN, SOCK_RAW, CAN_RAW);              /* 创建套接字 */
    if (s < 0) {
        perror("socket PF_CAN failed");
        return 1;
    }
    /* 把套接字绑定到can0接口  */
    strcpy(ifr.ifr_name, "can0");
    ret = ioctl(s, SIOCGIFINDEX, &ifr);
    if (ret < 0) {
        perror("ioctl failed");
        return 1;
    }
    addr.can_family = PF_CAN;
    addr.can_ifindex = ifr.ifr_ifindex;
    ret = bind(s, (struct sockaddr *)&addr, sizeof(addr));
    if (ret < 0) {
       perror("bind failed");
       return 1;
    }
    /* 设置过滤规则 */
    if (1) {
            struct can_filter filter[2];
            /* 第1个规则是可以接收ID为0x200 & 0xFFF的数据帧 */
            filter[0].can_id = 0x200 | CAN_EFF_FLAG;
            filter[0].can_mask = 0xFFF;
            /* 第2个规则是可以接收ID为0x20F& 0xFFF的数据帧 */
            filter[1].can_id = 0x20F | CAN_EFF_FLAG;        
            filter[1].can_mask = 0xFFF;
            /* 启用过滤规则，只要CAN0接收到的数据帧满足上面2个规则中的任何一个也被接受*/
            ret = setsockopt(s, SOL_CAN_RAW, CAN_RAW_FILTER, &filter, sizeof(filter));
            if (ret < 0) {
                   perror("setsockopt failed");
                   return 1;
            }
    }
    test_can_rw(s, master);                               /* 进入测试 */
    close(s);
    return 0;
}
```
