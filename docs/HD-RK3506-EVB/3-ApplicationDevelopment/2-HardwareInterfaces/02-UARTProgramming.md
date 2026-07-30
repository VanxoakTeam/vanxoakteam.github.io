---
sidebar_position: 2
---

# 串口(UART)应用编程

:::tip 提示

本指南将指导您如何通过代码程序**使用串口**。

:::

## 1. 硬件特性概述

本平台支持多个 UART 接口（UART0 ~ UART7），典型特性如下：

-   FIFO 深度：收发各 64 字节
-   支持硬件流控（RTS/CTS）
-   支持多种波特率：115.2Kbps、460.8Kbps、921.6Kbps、1.5Mbps、3Mbps、4Mbps
-   支持可编程任意波特率（非标准时钟分频）
-   数据位支持：5～8 位
-   支持中断与 DMA 两种工作模式
-   标准异步通信格式（起始位、停止位、奇偶校验）

## 2. 串口设备文件

  在 Linux 中，串口以设备文件形式存在，通常位于 `/dev/` 目录下：

| **设备类型** | **设备文件命名** | **说明** |
| --- | --- | --- |
| 内置串口 | /dev/ttyS0~ /dev/ttyS7 | RK3506 平台使用此命名 |
| USB 转串口 | /dev/ttyUSB0~ /dev/ttyUSBn | 如 CP2102、CH340 等芯片 |

> **注意**：不同平台命名规则可能不同，请根据实际系统确认设备节点​

## 3. 串口基本操作

  Linux的串口表现为设备文件。Linux的串口设备文件命名一般为`/dev/ttySn`（n=0、1、2……），若串口是USB扩展的，则串口设备文件命名多为/dev/ttyUSBn（n=0、1、2……）。当然这种命名规则不是绝对的，不同的硬件平台对串口设备文件的命名可能有所区别。HD-RK3506-IOT串口设备文件为/dev/ttySn（n=0、1、2……7）。
在编写Linux串口的C程序代码时，需要包含termios.h头文件：

```c
#include <termios.h>
```

### 3.1 打开串口

  在使用某个串口前，必须用open()函数打开它所对应的设备文件。打开“`/dev/ttyS1`”的代码如下所示。

```c
int fd;
fd = open("/dev/ttyS1", O_RDWR | O_NOCTTY );
if (fd < 0) {
    perror("open uart device error\n");
}
```

  当open调用成功后，将返回文件描述符，并作为其它操作函数的参数；如果失败返回负数。
在打开串口时，除了需要用到`O_RDWR`选项标志外，通常还需要使用`O_NOCTTY`，目的是告诉Linux“本程序不作为串口的‘控制终端’”。如果不使用该选项，会有一些输入字符影响进程运行（如一些产生中断信号的键盘输入字符等）。

### 3.2 关闭串口

  当不再使用某个串口时，可用close()函数关闭串口：

```c
close(fd);
```

  参数fd为打开串口时得到的文件描述符。

### 3.3 发送数据

  往串口发送数据可通过`write()`函数完成。往串口发送字符串“hello vanxoak!”的代码如下所示：

```c
int len;
char buf[] = "hello vanxoak!";
len =write(fd, buf, sizeof(buf));
if (len< 0) {
    printf("write data to serial failed! \n");
}
```

  字符串的长度为`sizeof(buf)`，作为write()函数的发送数据长度参数。写操作完成后，返回值为成功发送数据的长度；如果发送失败，返回负数。

### 3.4 读取数据

  使用`read()`函数可以读取串口接收到的数据。从串口读取11字节数据到数组buf[11]的代码如下所示：

```c
int len;
unsigned char buf[11];
len = read(fd, buf, 11);
if (len < 0){
    printf("reading data failed \n");
}
```

  读取成功，函数返回所读数据长度；失败返回负数。

### 3.5 串口范例(1)

  如下所示的代码为简单的串口数据收发示例代码。该代码打开串口ttyS1后，在串口发送字符串“hello vanxoak”，然后准备接收字符串。在接收了字符串之后，把接收的字符打印出来。

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <termios.h>

#define DEV_NAME  "/dev/ttyS1"

int main (int argc, char *argv[])
{
    int fd;
    int len, i,ret;
    char buf[] = "hello vanxoak";

    fd = open(DEV_NAME, O_RDWR | O_NOCTTY);
    if(fd < 0) {
        perror(DEV_NAME);
        return -1;
    }
    len = write(fd, buf, sizeof(buf));                /* 向串口写入字符串       */
    if (len < 0) {
        printf("write data error \n");
    }

    len = read(fd, buf, sizeof(buf));                 /* 在串口读入字符串       */
    if (len < 0) {
        printf("read error \n");
        return -1;
    }

    printf("%s", buf);                                /* 打印从串口读出的字符串  */

    return(0);
}
```

该示例代码可用如下方法测试：

1.  把示例代码在Linux主机上作本地编译，生成`uart_test`程序文件；
2.  使用另外一台Windows电脑和Linux主机建立串口连接；
3.  在Windows电脑打开串口助手软件（如SSCOM，网上可以搜索下载），设置串口属性为“9600，8n1，无流控”，如下图所示。

<img src={require('./images/02-uartprogramming-01.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

4. 在Linux主机运行`uart_test`程序

```shell
root@rk3506-buildroot:/# ./uart_test
```

  这时串口助手软件接收到“hello vanxoak”字符串，如下所示。


<img src={require('./images/02-uartprogramming-02.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

5. 在串口助手向板端发送“hello vanxoak”字符，这时Linux主机的`uart_test`程序打印从串口接收到的字符串：

```shell
root@rk3506-buildroot:/# ./uart_test
hello vanxoak
```

## 4. 串口属性设置

  上一节的串口基本操作虽然可以进行基本的串口数据收发，但只能使用串口驱动默认的属性（9600，8n1，无流控），而在实际应用中，往往要设置串口属性如波特率、数据位、奇偶校验、停止位等。

### 4.1 终端属性描述

  进行串口编程时需要包含`<termios.h>`头文件。该文件包含了POSIX终端属性描述结构`struct termios`，该结构如程序如下所示。

```c
struct termios {
    tcflag_t  c_cflag;    /* 控制标志    */
    tcflag_t  c_iflag;    /* 输入标志    */
    tcflag_t  c_oflag;    /* 输出标志    */
    tcflag_t  c_lflag;    /* 本地标志    */
    tcflag_t  c_cc[NCCS]; /* 控制字符    */
};
```

  `tcflag_t`的定义为：

```c
typedef unsigned int tcflag_t;
```

下面对`termios`结构各成员进行简单介绍。

- **控制标志**

  通过`termios`结构的`c_cflag`成员可设置串口的波特率、数据位、奇偶校验、停止位以及流控制，详见后续对应部分的描述。

- **输入标志**

  c\_iflag成员负责控制串口输入数据的处理，它的部分可用标志如下表所列。

| **标志** | **说明** | **标志** | **说明** |
| --- | --- | --- | --- |
| INPCK | 打开输入奇偶校验 | IXOFF | 启用/停止输入控制流起作用 |
| IGNPAR | 忽略奇偶错字符 | IGNBRK | 忽略BREAK条件 |
| PARMRK | 标记奇偶错 | INLCR | 将输入的NL转换为CR |
| ISTRIP | 剥除字符第8位 | IGNCR | 忽略CR |
| IXON | 启用/停止输出控制流起作用 | ICRNL | 将输入的CR转换为NL |

  使用软件流控制是启用`IXON`、`IXOFF`和`IXANY`选项：

```c
options.c_iflag |= (IXON | IXOFF | IXANY);
```

  相反，要禁用软件流控制是禁止上面的选项：

```c
options.c_iflag &= ~(IXON | IXOFF | IXANY);
```

- **输出标志**

  `termios`结构的`c_oflag`成员管理输出过滤，它的部分选项标志如下表所列。

| **标志** | **说明** | **标志** | **说明** |
| --- | --- | --- | --- |
| BSDLY | 退格延迟屏蔽 | OLCUC | 将输出的小写字符转换为大写字符 |
| CMSPAR | 标志或空奇偶性 | ONLCR | 将NL转换为CR-NL |
| CRDLY | CR延迟屏蔽 | ONLRET | NL执行CR功能 |
| FFDLY | 换页延迟屏蔽 | ONOCR | 在0列不输出CR |
| OCRNL | 将输出的CR转换为NL | OPOST | 执行输出处理 |
| OFDEL | 填充符为DEL，否则为NULL | OXTABS | 将制表符扩充为空格 |
| OFILL | 对于延迟使用填充符 | — | — |

  1. 启用输出处理

  启用输出处理需要在`c_oflag`成员中启用`OPOST`选项，其操作方法如下：

```c
options.c_oflag |= OPOST;
```

  2. 使用原始输出

  使用原始输出，就是禁用输出处理，使数据能不经过处理、过滤地完整地输出到串口。当`OPOST`被禁止，`c_oflag`其它选项也被忽略，其操作方法如下：

```c
options.c_oflag &= ~OPOST;
```

- **本地标志**

  termios结构的c\_lflag成员影响驱动和用户之间的接口，它的部分可用标志如下表所列。

| **标志** | **说明** | **标志** | **说明** |
| --- | --- | --- | --- |
| ISIG | 启用终端产生的信号 | NOFLSH | 在中断或退出键后禁用刷清 |
| ICANON | 启用规范输入 | IEXTEN | 启用扩充的输入字符处理 |
| XCASE | 规范大/小写表示 | ECHOCTL | 回送控制字符为(char) |
| ECHO | 进行回送 | ECHOPRT | 硬拷贝的可见擦除方式 |
| ECHOE | 可见擦除字符 | ECHOKE | Kill的可见擦除 |
| ECHOK | 回送kill符 | PENDIN | 重新打印未决输入 |
| ECHONL | 回送NL | TOSTOP | 对于后台输出发送SIGTTOU |

  1. 选择规范模式

  规范模式是行处理的。调用`read`读取串口数据时，每次返回一行数据。当选择规范模式时，需要启用`ICANON`、`ECHO`和`ECHOE`选项：

```c
options.c_lflag |= (ICANON | ECHO | ECHOE);
```

  当串口设备作为用户终端时，通常要把串口设备配置成规范模式。

  2. 选择原始模式

  在原始模式下，串口输入数据是不经过处理的，在串口接口接收的数据被完整保留。要使串口设备工作在原始模式，需要关闭`ICANON`、`ECHO`、`ECHOE`和ISIG选项，其操作方法如下：

```c
options.c_lflag &= ~(ICANON | ECHO | ECHOE | ISIG);
```

- **控制字符组**

  `termios`结构的`c_cc`成员是一个数组，其长度是NCCS，一般介于15-20之间。`c_cc`数组的每个元素的下标都用一个宏表示，它的部分下标标志名及说明如下表所列。

| **标 志** | **说 明** | **标 志** | **说 明** |
| --- | --- | --- | --- |
| VINTR | 中断 | VEOL | 行结束 |
| VQUIT | 退出 | VMIN | 需读取的最小字节数 |
| VERASE | 擦除 | VTIME | 与“VMIN”配合使用，是指限定的传输或等待的最长时间 |
| VEOF | 行结束 | — | — |

### 4.2 获取和设置终端属性

  使用函数tcgetattr()可以获取串口设备的termios结构。该函数原型如下：

```c
int tcgetattr(int fd, struct termios *termptr);
```

  函数执行成功返回0，串口设备的termios结构由temptr参数返回；若出错则返回-1。
  获得termios结构后，可以把串口的属性设置到termios结构中。串口属性设置完成后，可通过tcsetattr()函数原型如下：

```c
int tcsetattr(int fd, int opt, const struct termios *termptr);
```

  在串口驱动程序里有输入缓冲区和输出缓冲区。在改变串口属性时，缓冲区可能有数据存在，如何处理缓冲区中的数据，可通过opt参数实现：

-   TCSANOW： 更改立即发生；
-   TCSADRAIN： 发送了所有输出后更改才发生，若更改输出参数则应用此选项；
-   TCSAFLUSH： 发送了所有输出后更改才发生，在更改发生时未读的所有输入数据被删除（Flush）。

  上述两函数执行时，若成功则返回0，若出错则返回-1。

### 4.3 设置波特率

  串口的波特率分输入波特率和输出波特率，可分别通过`cfsetispeed()`和`cfsetospeed()`函数设置。这两个函数原型为：

```c
int cfsetispeed(struct termios *termptr, speed_t speed);
int cfsetospeed(struct termios *termptr, speed_t speed);
```

  这两个函数若执行成功返回0，若出错则返回-1。speed参数为需要设置的波特率，可选择的常量如下表所列。

| **标志** | **说明** | **标志** | **说明** |
| --- | --- | --- | --- |
| B0 | 0位/秒（挂起） | B9600 | 9600位/秒 |
| B110 | 100位/秒 | B19200 | 19200位/秒 |
| B134 | 134位/秒 | B57600 | 57600位/秒 |
| B1200 | 1200位/秒 | B115200 | 115200位/秒 |
| B2400 | 2400位/秒 | B460800 | 460800位/秒 |
| B4800 | 4800位/秒 | — | — |

  通常来说，串口的输入和输出波特率都设置为同一个值，如将波特率设置为115200的代码为：

```c
cfsetispeed(&opt, B115200);
cfsetospeed(&opt, B115200);
```

  如下所示的`set_baudrate()`函数实现了波特率设置操作。该函数将串口输入/输出设置为相同的波特率，使用时只需填写所需波特率即可。

```c
static void set_baudrate (struct termios *opt, unsigned int baudrate)
{
    cfsetispeed(opt, baudrate);
    cfsetospeed(opt, baudrate);
}
```

  使用`set_baudrate()`函数设置串口输入/输出波特率为115200的代码为：

```c
set_baudrate(&opt, B115200));
```

### 4.4 设置数据位

  设置串口数据位是在`termios`结构的`c_cflag`成员上设置，可用的选项标志如下表所列。

| **标志** | **说明** | **标志** | **说明** |
| --- | --- | --- | --- |
| CSIZE | 数据位屏蔽 | CS7 | 7位数据位 |
| CS5 | 5位数据位 | CS8 | 8位数据位 |
| CS6 | 6位数据位 | — | — |

  设置串口的数据位为8位的代码为：

```c
opt.c_cflag &= ~CSIZE;
opt.c_cflag |= CS8;
```

  在该代码中，把`CS8`改成`CS5`、`CS6`或`CS7`，分别可以把串口的数据位设置为5位、6位或7位。

  如下代码所示的`set_data_bit()`函数实了串口数据位的设置。

```c
static void set_data_bit (struct termios *opt, unsigned int databit)
{
    opt->c_cflag &= ~CSIZE;
    switch (databit) {
        case 8:
            opt->c_cflag |= CS8;
            break;
        case 7:
            opt->c_cflag |= CS7;
            break;
        case 6:
            opt->c_cflag |= CS6;
            break;
        case 5:
            opt->c_cflag |= CS5;
            break;
        default:
            opt->c_cflag |= CS8;
            break;
    }
}
```

  在`set_data_bit()`函数中，databit参数可以取值为8、7、6、5，分别表示把数据位设置为8位、7位、6位、5位。
  使用`set_data_bit()`函数设置8位数据位的代码如下：

```c
set_data_bit(8)
```

### 4.5 设置奇偶校验

  设置串口的奇偶校验是在termios结构的c\_cflag成员上设置，可用的选项标志如下表所列。

| **标志** | **说明** |
| --- | --- |
| PARENB | 进行奇偶校验 |
| PARODD | 奇校验，否则为偶校验 |

Linux的串口驱动支持无校验（‘N’）、偶校验（‘E’）和奇校验（‘O’）。

-   设置无校验的方法为：

```c
opt->c_cflag &= ~PARENB;
```

-   设置偶校验的方法为：

```c
opt->c_cflag |= PARENB;
opt->c_cflag &= ~PARODD;
```

-   设置奇校验的方法为：

```c
opt->c_cflag |= PARENB;
opt->c_cflag |= ~PARODD;
```

  `set_parity()`函数实现了串口奇偶校验设置。

```c
static void set_parity (struct termios *opt, char parity)
{
    switch (parity) {
        case 'N':                         /* 无校验  */
        case 'n':
            opt->c_cflag &= ~PARENB;
            break;
        case 'E':                        /* 偶校验  */
        case ‘e‘:
            opt->c_cflag |= PARENB;
            opt->c_cflag &= ~PARODD;
            break;
        case 'O':                         /* 奇校验  */
        case ‘o‘:
            opt->c_cflag |= PARENB;
            opt->c_cflag |= ~PARODD;
            break;
        default:                          /* 其它选择为无校验 */
            opt->c_cflag &= ~PARENB;
            break;
    }
}
```

  在`set_parity`函数中，`parity`参数可以取值为：‘N’和‘n’（无奇偶校验）、‘E’和‘e’（表示偶校验）、‘O’和‘o’（表示奇校验）。
设置串口为无校验的代码如下（两种方式）：

```c
static void set_parity (&opt, ‘N’);
```

```c
static void set_parity (&opt, ‘n’);
```

### 4.6 设置停止位

  设置串口停止位是在termios对象的c\_cflag成员上设置，需要用到的选项标志为`CSTOPB`（2位停止位，否则为1位）。
例如，设置1位停止位的方法为：

```c
opt->c_cflag &= ~CSTOPB;
```

  set\_stopbit()函数实现串口停止位的设置，函数如下：

```c
static void set_stopbit (struct termios *opt, const char *stopbit)
{
    if (0 == strcmp (stopbit, "1")) {
        opt->c_cflag &= ~CSTOPB;                   /* 1位停止位t     */
    }  else if (0 == strcmp (stopbit, "1.5")) {
        opt->c_cflag &= ~CSTOPB;                   /* 1.5位停止位    */
    }  else if (0 == strcmp (stopbit, "2")) {
        opt->c_cflag |= CSTOPB; 
    }  else {
        opt->c_cflag &= ~CSTOPB;                   /* 1 位停止位     */
    }
}
```

  在set\_stopbit()函数中，stopbit参数可以取值为：“1”（1位停止位）、“1.5”（1.5位停止位）和“2”（2位停止位）。
设置串口为1位停止位的代码如下：

```c
set_stopbit(&opt, "1");
```

### 4.7 其它设置

  调用read()函数读取串口数据时，返回读取数据的数量需要考虑两个变量：`MIN`和`TIME`。`MIN`和`TIME`在termios结构的c\_cc成员的数组下标名为`VMIN`和`VTIME`。
  `MIN`是指一次read调用期望返回的最小字节数。`VTIME`说明等待数据到达的分秒数（秒的1/10为分秒）。TIME与MIN组合使用的具体含义分为以下四种情形：

> -   当MIN > 0，TIME > 0时
> 
> 计时器在收到第一个字节后启动，在计时器超时之前（TIME的时间到），若已收到MIN个字节，则read返回MIN个字节，否则，在计时器超时后返回实际接收到的字节。
> 
> *注意：因为只有在接收到第一个字节时才开始计时，所以至少可以返回1个字节。这种情形中，在接到第一个字节之前，调用者阻塞。如果在调用read时数据已经可用，则如同在read后数据立即被接到一样。*
> -   当MIN > 0，TIME = 0时
> 
> MIN个字节完整接收后，read才返回，这可能会造成read无限期地阻塞。
> -   当MIN = 0, TIME > 0时
> 
> TIME为允许等待的最大时间，计时器在调用read时立即启动，在串口接到1字节数据或者计时器超时后即返回，如果是计时器超时，则返回0。
> -   当MIN = 0，TIME = 0时
> 
> 如果有数据可用，则read最多返回所要求的字节数，如果无数据可用，则read立即返回0。

  设置`TIME`为150、`MIN`为255的方法如下：

```c
opt.c_cc[VTIME]    = 150;        
opt.c_cc[VMIN]     = 255;
```

### 4.8 串口属性设置函数

  set\_port\_attr函数实现了串口属性的设置。

```c
int  set_port_attr (int fd,int  baudrate, int  databit, const char *stopbit, char parity, int vtime,int vmin )
{
    struct termios opt;

    tcgetattr(fd, &opt);
    set_baudrate(&opt, baudrate);
    opt.c_cflag          |= CLOCAL | CREAD;      /* | CRTSCTS */
    set_data_bit(&opt, databit);
    set_parity(&opt, parity);
    set_stopbit(&opt, stopbit);
    opt.c_oflag          = 0;
    opt.c_lflag           |= 0;
    opt.c_oflag          &= ~OPOST;
    opt.c_cc[VTIME]     = vtime;        
    opt.c_cc[VMIN]      = vmin; 
    tcflush (fd, TCIFLUSH);

    return (tcsetattr (fd, TCSANOW, &opt));
}
```

  `set_port_attr`函数调用成功时，返回0；调用失败时，返回-1。

  设置串口属性为“115200、8n1”的代码如下：

```c
ret = set_port_attr (fd, B115200, 8, "1", 'N',  150,    255 );
if(ret < 0) {
    printf("set uart arrt failed \n");
    exit(-1);
}
```

### 4.9 串口范例(2)

  如下所示代码可以设置串口属性后，作数据收发操作。在该代码中，程序在打开串口设备后，把串口属性设置为“115200 8n1”；然后在串口发送“hello vanxoak”的字符串，然后准备接收字符串；在接收了字符串之后，把接收的字符打印出来。

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <termios.h>

#include "serial.h"

#define DEV_NAME  "/dev/ttyS1"

int main (int argc, char *argv[])
{
    int fd;
    int len, i,ret;
    char buf[] = "hello vanxoak";

    fd = open(DEV_NAME, O_RDWR | O_NOCTTY);
    if(fd < 0) {
        perror(DEV_NAME);
        return -1;
    }

    ret = set_port_attr (fd, B115200, 8, "1", 'N',150,255 ); /* 115200 8n1               */
    if(ret < 0) {
        printf("set uart arrt failed \n");
        exit(-1);
    }

    len = write(fd, buf, sizeof(buf));                        /* 向串口发送字符串          */
    if (len < 0) {
        printf("write data error \n");
        return -1;
    }

    len = read(fd, buf, sizeof(buf));                         /* 在串口读取字符串          */
    if (len < 0) {
        printf("read error \n");
        return -1;
    }

    printf("%s \n", buf);                                     /* 打印在串口读取的字符串    */

    return(0);
}
```

串口范例2代码可用的测试方法如下：  

- 把示例代码在Linux主机上作本地编译，生成test\_uart\_2程序文件；
- 使用另外一台Windows电脑和Linux主机建立串口连接；
- 在Windows电脑打开串口助手软件，设置串口属性为“115200，8n1,无流控”；
- 在Linux主机运行uart\_test\_2程序：

```shell
root@rk3506-buildroot:/# ./uart_test_2
```

  这时串口助手软件接收到“hello vanxoak”字符串，如图4所示。

<img src={require('./images/02-uartprogramming-03.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

- 在串口助手的发送“hello vanxoak”的字符串。这时Linux主机的`uart_test_2`程序打印“hello vanxoak”的字符串。


```shell
root@rk3506-buildroot:/# ./uart_test_2
hello vanxoak
```

## 5. 常见问题与建议

| **问题** | **原因** | **解决方案** |
| --- | --- | --- |
| 打开设备失败 | 权限不足 | 使用 `sudo`或添加用户到 `dialout`组 |
| 数据乱码 | 波特率不匹配 | 确保两端波特率一致 |
| 无法接收数据 | 未设置原始模式 | 关闭 `ICANON`、`ECHO`等标志 |
| 接收阻塞 | `VMIN`设置过大 | 建议 `VMIN=0`, `VTIME>0` 实现超时读取 |
| 数据丢失 | 未启用 FIFO 或 DMA | 检查驱动配置 |