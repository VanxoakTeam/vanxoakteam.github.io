---
sidebar_position: 5
---

# 输入系统应用编程

:::tip 提示

本指南将指导您如何编写**输入系统**代码。


:::

## 1. 输入系统概述

### 1.1 什么是输入系统

-   先来了解什么是输入设备？

常见的输入设备有键盘、鼠标、遥控杆、书写板、触摸屏等等,用户通过这些输入设备与Linux系统进行数据交换。

-   什么是输入系统？

输入设备种类繁多，能否统一它们的接口？既在驱动层面统一，也在应用程序层面统一？可以的。

Linux系统为了统一管理这些输入设备，实现了一套能兼容所有输入设备的框架：输入系统。驱动开发人员基于这套框架开发出程序，应用开发人员就可以使用统一的API去使用设备。

### 1.2 输入系统框架及调试

#### 1）框架概述

作为应用开发人员，可以只基于API使用输入子系统。但是了解内核中输入子系统的框架、了解数据流程，有助于解决开发过程中碰到的硬件问题、驱动问题。

输入系统框架如图所示：

<img src={require('./images/04-inputsystemprogramming-01.png').default} alt="image.png" className="doc-image--80" />

假设用户程序直接访问/dev/input/event0设备节点，或者使用tslib访问设备节点，数据的流程如下：

① APP发起读操作，若无数据则休眠；

② 用户操作设备，硬件上产生中断；

③ 输入系统驱动层对应的驱动程序处理中断：

读取到数据，转换为标准的输入事件，向核心层汇报。

所谓输入事件就是一个“struct input\_event”结构体。

④ 核心层可以决定把输入事件转发给上面哪个handler来处理：

从handler的名字来看，它就是用来处输入操作的。有多种handler，比如：evdev\_handler、kbd\_handler、joydev\_handler等等。

最常用的是evdev\_handler：它只是把input\_event结构体保存在内核buffer等，APP来读取时就原原本本地返回。它支持多个APP同时访问输入设备，每个APP都可以获得同一份输入事件。

当APP正在等待数据时，evdev\_handler会把它唤醒，这样APP就可以返回数据。

⑤ APP对输入事件的处理：

APP获得数据的方法有2种：直接访问设备节点(比如/dev/input/event0,1,2,...)，或者通过tslib、libinput这类库来间接访问设备节点。这些库简化了对数据的处理。

要想深入理解整个输入系统，就必须研究内核的输入系统，这在后续的“驱动大全”中会讲解。

#### 2）编写APP需要掌握的知识

基于编写应用程序的角度，只需要理解这些内容：

**内核中怎么表示一个输入设备？**

使用input\_dev结构体来表示输入设备，它的内容如图所示：

<img src={require('./images/04-inputsystemprogramming-06.png').default} alt="image.png" className="doc-image--80" />

##### **APP\***\*可以得到什么数据？\*\*

可以得到一系列的输入事件，就是一个一个“struct input\_event”，它定义如图 所示：

<img src={require('./images/04-inputsystemprogramming-07.png').default} alt="image.png" className="doc-image--80" />

每个输入事件input\_event中都含有发生时间：timeval表示的是“自系统启动以来过了多少时间”，它是一个结构体，含有“tv\_sec、tv\_usec”两项(即秒、微秒)。

输入事件input\_event中更重要的是：type(哪类事件)、code(哪个事件)、value(事件值)，细讲如下：

① type：表示哪类事件

比如EV\_KEY表示按键类、EV\_REL表示相对位移(比如鼠标)，EV\_ABS表示绝对位置(比如触摸屏)。如图这几类事件(参考Linux内核头文件)：

<img src={require('./images/04-inputsystemprogramming-08.png').default} alt="image.png" className="doc-image--80" />

② code：表示该类事件下的哪一个事件

比如对于EV\_KEY(按键)类事件，它表示键盘。键盘上有很多按键，比如数字键1、2、3，字母键A、B、C里等。所以可以有图中这些事件：

<img src={require('./images/04-inputsystemprogramming-09.png').default} alt="image.png" className="doc-image--80" />

对于触摸屏，它提供的是绝对位置信息，有X方向、Y方向，还有压力值。所以code值有图 中这些：

<img src={require('./images/04-inputsystemprogramming-10.png').default} alt="image.png" className="doc-image--80" />

③ value：表示事件值

对于按键，它的value可以是0(表示按键被按下)、1(表示按键被松开)、2(表示长按)；

对于触摸屏，它的value就是坐标值、压力值。

④ 事件之间的界线

APP读取数据时，可以得到一个或多个数据，比如一个触摸屏的一个触点会上报X、Y位置信息，也可能会上报压力值。

APP怎么知道它已经读到了完整的数据？

驱动程序上报完一系列的数据后，会上报一个“同步事件”，表示数据上报完毕。APP读到“同步事件”时，就知道已经读完了当前的数据。

同步事件也是一个input\_event结构体，它的type、code、value三项都是0。

**输入子系统支持完整的API操作**

支持这些机制：阻塞、非阻塞、POLL/SELECT、异步通知。

#### 3）调试技巧

**确定设备信息**

输入设备的设备节点名为/dev/input/eventX(也可能是/dev/eventX，X表示0、1、2等数字)。查看设备节点，可以执行以下命令：

```shell
ls /dev/input/* -l
#或
ls /dev/event* -l
```

怎么知道这些设备节点对应什么硬件呢？可以在板子上执行以下命令：

```
cat /proc/bus/input/devices
```

这条指令的含义就是获取与event对应的相关设备信息，可以看到类似以下的结果：

<img src={require('./images/04-inputsystemprogramming-14.png').default} alt="image.png" className="doc-image--80" />

那么这里的I、N、P、S、U、H、B对应的每一行是什么含义呢？

① I:id of the device(设备ID)

该参数由结构体struct input\_id来进行描述，驱动程序中会定义这样的结构体：

<img src={require('./images/04-inputsystemprogramming-11.png').default} alt="image.png" className="doc-image--80" />

② N:name of the device

设备名称

③ P:physical path to the device in the system hierarchy

系统层次结构中设备的物理路径。

④ S:sysfs path

位于sys文件系统的路径

⑤ U:unique identification code for the device(if device has it)

设备的唯一标识码

⑥ H:list of input handles associated with the device.

与设备关联的输入句柄列表。

⑦ B:bitmaps(位图)

```plain
PROP:device properties and quirks(设备属性)
EV:types of events supported by the device(设备支持的事件类型)
KEY:keys/buttons this device has(此设备具有的键/按钮)
MSC:miscellaneous events supported by the device(设备支持的其他事件)
LED:leds present on the device(设备上的指示灯)
```

值得注意的是B位图，比如上图中“B: EV=b”用来表示该设备支持哪类输入事件。b的二进制是1011，bit0、1、3为1，表示该设备支持0、1、3这三类事件，即EV\_SYN、EV\_KEY、EV\_ABS。

再举一个例子，“B: ABS=2658000 3”如何理解？

它表示该设备支持EV\_ABS这一类事件中的哪一些事件。这是2个32位的数字：0x2658000、0x3，高位在前低位在后，组成一个64位的数字：“0x2658000,00000003”，数值为1的位有：0、1、47、48、50、53、54，即：0、1、0x2f、0x30、0x32、0x35、0x36，对应以下这些宏：

<img src={require('./images/04-inputsystemprogramming-12.png').default} alt="image.png" className="doc-image--80" />

即这款输入设备支持上述的ABS\_X、ABS\_Y、ABS\_MT\_SLOT、ABS\_MT\_TOUCH\_MAJOR、ABS\_MT\_WIDTH\_MAJOR、ABS\_MT\_POSITION\_X、ABS\_MT\_POSITION\_Y这些绝对位置事件(它们的含义在后面讲解电容屏时再细讲)。

## 2. **使用命令读取数据**

> **注意**：如果没有触摸屏（或者这个触摸名没有注册为输入设备），我们要接入USB鼠标，访问它对应的“/dev/input/event\*”设备。

​	调试输入系统时，直接执行类似下面的命令，然后操作对应的输入设备即可读出数据：

```
hexdump /dev/input/event0
```

​	在开发板执行上述命令之后，如果这个设备是触摸屏（USB鼠标、键盘也是类似的），点击触摸屏，就会打印图示信息：

<img src={require('./images/001.png').default} alt="image.png" className="doc-image--80" />

## 3. 应用程序示例

本节源码位于如下目录：

07\_input\\

01\_get\_input\_info.c

02\_input\_read.c

03\_input\_read\_poll.c

04\_input\_read\_select.c

05\_input\_read\_fasync.c

### 2.1 输入系统支持完整的API操作

支持这些机制：阻塞、非阻塞、POLL/SELECT、异步通知。

作为APP开发人员，即使没有深入理解这些机制，也是可以编写出程序的。

### 2.2 APP访问硬件的4种方式：妈妈怎么知道孩子醒了

妈妈怎么知道卧室里小孩醒了？

-  时不时进房间看一下：查询方式


简单，但是累

- 进去房间陪小孩一起睡觉，小孩醒了会吵醒她：休眠-唤醒


不累，但是妈妈干不了活了

- 妈妈要干很多活，但是可以陪小孩睡一会，定个闹钟：poll方式


要浪费点时间，但是可以继续干活。

妈妈要么是被小孩吵醒，要么是被闹钟吵醒。

- 妈妈在客厅干活，小孩醒了他会自己走出房门告诉妈妈：异步通知


妈妈、小孩互不耽误。

这4种方法没有优劣之分，在不同的场合使用不同的方法。

### 2.3 获取设备信息

通过ioctl获取设备信息，ioctl的参数如下：

**int ioctl(int fd, unsigned long request, ...);**

有些驱动程序对request的格式有要求，它的格式如下：

<img src={require('./images/04-inputsystemprogramming-02.png').default} alt="image.png" className="doc-image--80" />

比如dir为*IOC\_READ(即2)时，表示APP要读数据；为*IOC\_WRITE(即4)时，表示APP要写数据。

-   size表示这个ioctl能传输数据的最大字节数。
-   type、nr的含义由具体的驱动程序决定。

比如要读取输入设备的evbit时，ioctl的request要写为“EVIOCGBIT(0, size)”，size的大小可以由你决定：你想读多少字节就设置为多少。这个宏的定义如下：

<img src={require('./images/04-inputsystemprogramming-03.png').default} alt="image.png" className="doc-image--80" />

插上USB鼠标之前、之后，执行下面的命令查看多出了哪些节点：

```
ls /dev/input/event*
```

执行如下命令编译、测试：

```plain
gcc -o 01_get_input_info 01_get_input_info.c

root@rk3506-buildroot:/# ./01_get_input_info /dev/input/event1
bustype = 0x3
vendor  = 0x46d
product = 0xc53f
version = 0x111
support ev type: EV_SYN  EV_KEY  EV_REL  EV_MSC
```

### 2.4 查询方式

APP调用open函数时，传入“O\_NONBLOCK”表示“非阻塞”。

APP调用read函数读取数据时，如果驱动程序中有数据，那么APP的read函数会返回数据，否则也会立刻返回错误。

执行如下命令编译、测试：

```plain
gcc  -o  02_input_read  02_input_read.c

./02_input_read /dev/input/event1 nonblock
bustype = 0x3
vendor  = 0x46d
product = 0xc53f
version = 0x111
support ev type: EV_SYN  EV_KEY  EV_REL  EV_MSC
read err -1
read err -1
read err -1
read err -1
read err -1
read err -1
get event: type = 0x2, code = 0x0, value = 0x1
get event: type = 0x0, code = 0x0, value = 0x0
```

不移动鼠标，会打印出很多“read err -1”；移动鼠标后，可以看到坐标的打印信息。

### 2.5 休眠-唤醒方式

APP调用open函数时，不要传入“O\_NONBLOCK”。

APP调用read函数读取数据时，如果驱动程序中有数据，那么APP的read函数会返回数据；否则APP就会在内核态休眠，当有数据时驱动程序会把APP唤醒，read函数恢复执行并返回数据给APP。

执行如下命令编译、测试：

```plain
gcc -o 02_input_read  02_input_read.c

./02_input_read /dev/input/event11
bustype = 0x3
vendor  = 0x46d
product = 0xc53f
version = 0x111
support ev type: EV_SYN  EV_KEY  EV_REL  EV_MSC
get event: type = 0x2, code = 0x0, value = 0x1
get event: type = 0x0, code = 0x0, value = 0x0
get event: type = 0x2, code = 0x0, value = 0x1
get event: type = 0x0, code = 0x0, value = 0x0
get event: type = 0x2, code = 0x1, value = 0xffffffff
get event: type = 0x0, code = 0x0, value = 0x0
get event: type = 0x2, code = 0x0, value = 0x1
```

不移动鼠标时，read函数无返回；移动鼠标后，可以看到很多打印信息。

### 2.6 POLL/SELECT方式

#### 1）**功能介绍**

POLL机制、SELECT机制是完全一样的，只是APP接口函数不一样。

简单地说，它们就是“定个闹钟”：在调用poll、select函数时可以传入“超时时间”。在这段时间内，条件合适时(比如有数据可读、有空间可写)就会立刻返回，否则等到“超时时间”结束时返回错误。

用法如下。

-   APP先调用open函数时。

> APP不是直接调用read函数，而是先调用poll或select函数，这2个函数中可以传入“超时时间”。它们的作用是：如果驱动程序中有数据，则立刻返回；否则就休眠。在休眠期间，如果有人操作了硬件，驱动程序获得数据后就会把APP唤醒，导致poll或select立刻返回；如果在“超时时间”内无人操作硬件，则时间到后poll或select函数也会返回。APP可以根据函数的返回值判断返回原因：有数据？无数据超时返回？
>

-   APP根据poll或select的返回值判断有数据之后，就调用read函数读取数据时，这时就会立刻获得数据。
-   poll/select函数可以监测多个文件，可以监测多种事件：

| **事件类型** | **说明** |
| --- | --- |
| **POLLIN** | 有数据可读 |
| **POLLRDNORM** | 等同于POLLIN |
| **POLLRDBAND** | Priority band data can be read，有优先级较较高的“band data”可读 Linux系统中很少使用这个事件 |
| **POLLPRI** | 高优先级数据可读 |
| **POLLOUT** | 可以写数据 |
| **POLLWRNORM** | 等同于POLLOUT |
| **POLLWRBAND** | Priority data may be written |
| **POLLERR** | 发生了错误 |
| **POLLHUP** | 挂起 |
| **POLLNVAL** | 无效的请求，一般是fd未open |

在调用poll函数时，要指明：

-   你要监测哪一个文件：哪一个fd
-   你想监测这个文件的哪种事件：是POLLIN、还是POLLOUT

最后，在poll函数返回时，要判断状态。

应用程序代码如下：

```plain
struct pollfd fds[1];
int timeout_ms = 5000;
int ret;

fds[0].fd = fd;
fds[0].events = POLLIN;

ret = poll(fds, 1, timeout_ms);
if ((ret == 1) && (fds[0].revents & POLLIN))
{
	read(fd, &val, 4);
	printf("get button : 0x%x\n", val);
}
```

#### 2）**使用POLL**

精简过的核心源码如下：

```plain
int main(int argc, char **argv)
{
     int fd;
     struct pollfd fds[1];
……
     fd = open(argv[1], O_RDWR | O_NONBLOCK);
……
     while (1)
     {
             fds[0].fd = fd;
```

第61行：打开设备文件。

第96~98行：设置pollfd结构体。

第96行：想查询哪个文件(fd)？

第97行：想查询什么事件(POLLIN)？

第98行：先清除“返回的事件”(revents)。

第99行：使用poll函数查询事件，指定超时时间为5000(ms)。

第100、110行判断返回值：大于0表示期待的事件发生了，等于0表示超时。

执行如下命令编译、测试：

```plain
gcc -o 03_input_read_poll  03_input_read_poll.c

./03_input_read_poll /dev/input/event1
bustype = 0x3
vendor  = 0x46d
product = 0xc53f
version = 0x111
support ev type: EV_SYN  EV_KEY  EV_REL  EV_MSC
get event: type = 0x2, code = 0x0, value = 0x1
get event: type = 0x0, code = 0x0, value = 0x0
get event: type = 0x2, code = 0x0, value = 0x1
get event: type = 0x0, code = 0x0, value = 0x0
get event: type = 0x2, code = 0x1, value = 0xffffffff
get event: type = 0x0, code = 0x0, value = 0x0
```

不移动鼠标时，read函数会超时返回；移动鼠标后，可以看到很多打印信息。

“04\_input\_read\_select.c”的效果跟“03\_input\_read\_poll.c”是一样的，执行如下命令编译、测试：

```plain
gcc -o  04_input_read_select  04_input_read_select.c

./04_input_read_select  /dev/input/event11
bustype = 0x3
vendor  = 0x46d
product = 0xc53f
version = 0x111
support ev type: EV_SYN  EV_KEY  EV_REL  EV_MSC
get event: type = 0x2, code = 0x0, value = 0x1
get event: type = 0x0, code = 0x0, value = 0x0
get event: type = 0x2, code = 0x1, value = 0xffffffff
get event: type = 0x0, code = 0x0, value = 0x0
get event: type = 0x2, code = 0x0, value = 0x1
```

### 2.7 异步通知方式

#### 1）**功能介绍**

所谓同步，就是“你慢我等你”。

那么异步就是：你慢那你就自己玩，我做自己的事去了，有情况再通知我。

所谓异步通知，就是APP可以忙自己的事，当驱动程序用数据时它会主动给APP发信号，这会导致APP执行信号处理函数。

仔细想想“发信号”，这只有3个字，却可以引发很多问题：

-   谁发：驱动程序发
-   发什么：信号
-   发什么信号：SIGIO
-   怎么发：内核里提供有函数
-   发给谁：APP，APP要把自己告诉驱动
-   APP收到后做什么：执行信号处理函数
-   信号处理函数和信号，之间怎么挂钩：APP注册信号处理函数

小孩通知妈妈的事情有很多：饿了、渴了、想找人玩。

Linux系统中也有很多信号，在Linux内核源文件include\\uapi\\asm-generic\\signal.h中，有很多信号的宏定义：

<img src={require('./images/04-inputsystemprogramming-04.png').default} alt="image.png" className="doc-image--80" />

驱动程序通知APP时，它会发出“SIGIO”这个信号，表示有“IO事件”要处理。

就APP而言，你想处理SIGIO信息，那么需要提供信号处理函数，并且要跟SIGIO挂钩。这可以通过一个signal函数来“给某个信号注册处理函数”，用法如下：

<img src={require('./images/04-inputsystemprogramming-05.png').default} alt="image.png" className="doc-image--80" />

除了注册SIGIO的处理函数，APP还要做什么事？想想这几个问题：

- 内核里有那么多驱动，你想让哪一个驱动给你发SIGIO信号？
- APP要打开驱动程序的设备节点。
- 驱动程序怎么知道要发信号给你而不是别人？APP要把自己的进程ID告诉驱动程序。
- APP有时候想收到信号，有时候又不想收到信号：应该可以把APP的意愿告诉驱动：设置Flag里面的FASYNC位为1，使能“异步通知”。

#### 2）**应用编程**

应用程序要做的事情有这几件：

- 编写信号处理函数：


```plain
static void sig_func(int sig)
{
	int val;
	read(fd, &val, 4);
	printf("get button : 0x%x\n", val);
}
```

- 注册信号处理函数：

  signal(SIGIO, sig\_func);

- 打开驱动：

  fd = open(argv[1], O\_RDWR);

- 把进程ID告诉驱动：

  fcntl(fd, F\_SETOWN, getpid());

- 使能驱动的FASYNC功能：

```plain
flags = fcntl(fd, F_GETFL);
fcntl(fd, F_SETFL, flags | FASYNC);
```

执行如下命令编译、测试：

```plain
gcc -o 05_input_read_fasync  05_input_read_fasync.c

./05_input_read_fasync /dev/input/event11
bustype = 0x3
vendor  = 0x46d
product = 0xc53f
version = 0x111
support ev type: EV_SYN  EV_KEY  EV_REL  EV_MSC
main loop count = 0
get event: type = 0x2, code = 0x0, value = 0x1
get event: type = 0x0, code = 0x0, value = 0x0
main loop count = 1
get event: type = 0x2, code = 0x1, value = 0xffffffff
get event: type = 0x0, code = 0x0, value = 0x0
main loop count = 2
```

不移动鼠标时，main函数的主循环不断打印“main loop count = ...”；移动鼠标后，可以看到很多打印信息。