---
sidebar_position: 5
---

# I2C应用编程

:::tip 提示

本指南将指导您如何编写 **I2C 的应用**程序。


:::

## 1. I2C介绍

  参考资料：I2Ctools

[**https://mirrors.edge.kernel.org/pub/software/utils/i2c-tools/**](https://mirrors.edge.kernel.org/pub/software/utils/i2c-tools/)

### 1.1 I2C硬件框架

<img src={require('./images/05-i2cprogramming-01.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

图 10.1 I2C总线拓扑图

-   在一个芯片(SoC)内部，有一个或多个I2C控制器
-   在一个I2C控制器上，可以连接一个或多个I2C设备
-   I2C总线只需要2条线：时钟线SCL、数据线SDA
-   在I2C总线的SCL、SDA线上，都有上拉电阻

### 1.2 I2C软件框架

<img src={require('./images/05-i2cprogramming-12.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

图 10.2 I2C软件框架

以I2C接口的存储设备AT24C02为例：

-   APP：

-   提出要求：把字符串"www.100ask.net"写入AT24C02地址16开始的地方

-   它是大爷，不关心底层实现的细节
-   它只需要调用设备驱动程序提供的接口
-   AT24C02驱动：

-   它知道AT24C02要求的地址、数据格式

-   它知道发出什么信号才能让AT24C02执行擦除、烧写工作
-   它知道怎么判断数据是否烧写成功
-   它构造好一系列的数据，发给I2C控制器
-   I2C控制器驱动

-   它根据I2C协议发出各类信号：I2C设备地址、I2C存储地址、数据

-   它根据I2C协议判断

### 1.3 我们讲什么

#### 1）**对于Linux**

<img src={require('./images/05-i2cprogramming-23.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

从上到下：

-   先讲I2C协议
-   APP可以通过两类驱动程序访问设备

-   I2C设备自己的驱动程序

-   内核自带的i2c-dev.c驱动程序，它是i2c控制器驱动程序暴露给用户空间的驱动程序(i2c-dev.c)
-   I2C Device Driver

-   I2C设备自己的驱动程序

-   内核自带的i2c-dev.c驱动程序，它是i2c控制器驱动程序暴露给用户空间的驱动程序(i2c-dev.c)
-   I2C Controller Driver

-   芯片I2C控制器的驱动程序(称为adapter)

-   使用GPIO模拟的I2C控制器驱动程序(i2c-gpio.c)

#### 2）**对于单片机/裸机**

<img src={require('./images/05-i2cprogramming-26.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

从上到下：

-   先讲I2C协议
-   APP
-   I2C Device Driver
-   I2C Controller Driver(也被称为adapter)

## 2. I2C协议

  参考资料：

i2c\_spec.pdf

### 2.1 硬件连接

  I2C在硬件上的接法如下所示，主控芯片引出两条线SCL,SDA线，在一条I2C总线上可以接很多I2C设备，我们还会放一个上拉电阻（放一个上拉电阻的原因以后我们再说）。

<img src={require('./images/05-i2cprogramming-27.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

### 2.2 传输数据类比

  怎么通过I2C传输数据，我们需要把数据从主设备发送到从设备上去，也需要把数据从从设备传送到主设备上去，数据涉及到双向传输。

举个例子：

<img src={require('./images/05-i2cprogramming-28.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

体育老师：可以把球发给学生，也可以把球从学生中接过来。

-   发球：

-   老师：开始了(start)

-   老师：A！我要发球给你！(地址/方向)
-   学生A：到！(回应)
-   老师把球发出去（传输）
-   A收到球之后，应该告诉老师一声（回应）
-   老师：结束（停止）
-   接球：

-   老师：开始了(start)

-   老师：B！把球发给我！(地址/方向)
-   学生B：到！
-   B把球发给老师（传输）
-   老师收到球之后，给B说一声，表示收到球了（回应）
-   老师：结束（停止）

我们就使用这个简单的例子，来解释一下IIC的传输协议：

-   老师说开始了，表示开始信号(start)
-   老师提醒某个学生要发球，表示发送地址和方向(address/read/write)
-   老师发球/接球，表示数据的传输
-   收到球要回应：回应信号(ACK)
-   老师说结束，表示IIC传输结束(P)

### 2.3 IIC传输数据的格式

#### 1）**写操作**

流程如下：

-   主芯片要发出一个start信号
-   然后发出一个设备地址(用来确定是往哪一个芯片写数据)，方向(读/写，0表示写，1表示读)
-   从设备回应(用来确定这个设备是否存在)，然后就可以传输数据
-   主设备发送一个字节数据给从设备，并等待回应
-   每传输一字节数据，接收方要有一个回应信号（确定数据是否接受完成)，然后再传输下一个数据。
-   数据发送完之后，主芯片就会发送一个停止信号。
-   下图：白色背景表示"主→从"，灰色背景表示"从→主"

<img src={require('./images/05-i2cprogramming-29.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

#### 2）**读操作**

流程如下：

-   主芯片要发出一个start信号
-   然后发出一个设备地址(用来确定是往哪一个芯片写数据)，方向(读/写，0表示写，1表示读)
-   从设备回应(用来确定这个设备是否存在)，然后就可以传输数据
-   从设备发送一个字节数据给主设备，并等待回应
-   每传输一字节数据，接收方要有一个回应信号（确定数据是否接受完成)，然后再传输下一个数据。
-   数据发送完之后，主芯片就会发送一个停止信号。

下图：白色背景表示"主→从"，灰色背景表示"从→主"

<img src={require('./images/05-i2cprogramming-30.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

#### 3）**I2C信号**

I2C协议中数据传输的单位是字节，也就是8位。但是要用到9个时钟：前面8个时钟用来传输8数据，第9个时钟用来传输回应信号。传输时，先传输最高位(MSB)。

-   开始信号（S）：SCL为高电平时，SDA山高电平向低电平跳变，开始传送数据。
-   结束信号（P）：SCL为高电平时，SDA由低电平向高电平跳变，结束传送数据。
-   响应信号(ACK)：接收器在接收到8位数据后，在第9个时钟周期，拉低SDA
-   SDA上传输的数据必须在SCL为高电平期间保持稳定，SDA上的数据只能在SCL为低电平期间变化

I2C协议信号如下：

<img src={require('./images/05-i2cprogramming-31.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

#### 4）**协议细节**

-   如何在SDA上实现双向传输？

-   主芯片通过一根SDA线既可以把数据发给从设备，也可以从SDA上读取数据，连接SDA线的引脚里面必然有两个引脚（发送引脚/接受引脚）。

-   主、从设备都可以通过SDA发送数据，肯定不能同时发送数据，怎么错开时间？在9个时钟里：

-   前8个时钟由主设备发送数据的话，第9个时钟就由从设备发送数据；

-   前8个时钟由从设备发送数据的话，第9个时钟就由主设备发送数据。
-   双方设备中，某个设备发送数据时，另一方怎样才能不影响SDA上的数据？

-   设备的SDA中有一个三极管，使用开极/开漏电路(三极管是开极，CMOS管是开漏，作用一样)，如下图：

<img src={require('./images/05-i2cprogramming-02.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  真值表如下：

<img src={require('./images/05-i2cprogramming-03.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

从真值表和电路图我们可以知道：

-   当某一个芯片不想影响SDA线时，那就不驱动这个三极管
-   想让SDA输出高电平，双方都不驱动三极管(SDA通过上拉电阻变为高电平)
-   想让SDA输出低电平，就驱动三极管

从下面的例子可以看看数据是怎么传的（实现双向传输）。 举例：主设备发送（8bit）给从设备

-   前8个clk

-   从设备不要影响SDA，从设备不驱动三极管
-   主设备决定数据，主设备要发送1时不驱动三极管，要发送0时驱动三极管

-   第9个clk，由从设备决定数据

-   主设备不驱动三极管

-   从设备决定数据，要发出回应信号的话，就驱动三极管让SDA变为0

  从这里也可以知道ACK信号是低电平

  从上面的例子，就可以知道怎样在一条线上实现双向传输，这就是SDA上要使用上拉电阻的原因。

  为何SCL也要使用上拉电阻？在第9个时钟之后，如果有某一方需要更多的时间来处理数据，它可以一直驱动三极管把SCL拉低。 当SCL为低电平时候，大家都不应该使用IIC总线，只有当SCL从低电平变为高电平的时候，IIC总线才能被使用。

  当它就绪后，就可以不再驱动三极管，这是上拉电阻把SCL变为高电平，其他设备就可以继续使用I2C总线了。

  对于IIC协议它只能规定怎么传输数据，数据是什么含义由从设备决定。

## 3. SMBus协议

  参考资料：

-   Linux内核文档：Documentation\\i2c\\smbus-protocol.rst
-   SMBus协议：[http://www.smbus.org/specs/](http://www.smbus.org/specs/)
-   SMBus\_3\_0\_20141220.pdf
-   I2CTools:[https://mirrors.edge.kernel.org/pub/software/utils/i2c-tools/](https://mirrors.edge.kernel.org/pub/software/utils/i2c-tools/)

### 3.1 SMBus是I2C协议的一个子集

  SMBus: System Management Bus，系统管理总线。 SMBus最初的目的是为智能电池、充电电池、其他微控制器之间的通信链路而定义的。 SMBus也被用来连接各种设备，包括电源相关设备，系统传感器，EEPROM通讯设备等等。 SMBus 为系统和电源管理这样的任务提供了一条控制总线，使用 SMBus 的系统，设备之间发送和接收消息都是通过 SMBus，而不是使用单独的控制线，这样可以节省设备的管脚数。 SMBus是基于I2C协议的，SMBus要求更严格，SMBus是I2C协议的子集。

<img src={require('./images/05-i2cprogramming-04.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

SMBus有哪些更严格的要求？跟一般的I2C协议有哪些差别？

-   VDD的极限值不一样

-   I2C协议：范围很广，甚至讨论了高达12V的情况

-   SMBus：1.8V~5V

-   最小时钟频率、最大的Clock Stretching

-   Clock Stretching含义：某个设备需要更多时间进行内部的处理时，它可以把SCL拉低占住I2C总线
-   I2C协议：时钟频率最小值无限制，Clock Stretching时长也没有限制
-   SMBus：时钟频率最小值是10KHz，Clock Stretching的最大时间值也有限制

-   地址回应(Address Acknowledge)：一个I2C设备接收到它的设备地址后，是否必须发出回应信号？

-   I2C协议：没有强制要求必须发出回应信号
-   SMBus：强制要求必须发出回应信号，这样对方才知道该设备的状态：busy，failed，或是被移除了

-   SMBus协议明确了数据的传输格式

-   I2C协议：它只定义了怎么传输数据，但是并没有定义数据的格式，这完全由设备来定义
-   SMBus：定义了几种数据格式(后面分析)

-   REPEATED START Condition(重复发出S信号)

比如读EEPROM时，涉及2个操作：

① 把存储地址发给设备

② 读数据

  在写、读之间，可以不发出P信号，而是直接发出S信号：这个S信号就是REPEATED START，如图所示

<img src={require('./images/05-i2cprogramming-05.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

-   SMBus Low Power Version：SMBus也有低功耗的版本

### 3.2 SMBus协议分析

  对于I2C协议，它只定义了怎么传输数据，但是并没有定义数据的格式，这完全由设备来定义。 对于SMBus协议，它定义了几种数据格式。

> 注意：下面文档中的Functionality flag是Linux的某个I2C控制器驱动所支持的功能。比如Functionality flag: I2C\_FUNC\_SMBUS\_QUICK，表示需要I2C控制器支持SMBus Quick Command

#### 1）**symbols(符号)**

```plain
S     (1 bit) : Start bit(开始位)
Sr    (1 bit) : 重复的开始位
P     (1 bit) : Stop bit(停止位)
R/W#  (1 bit) : Read/Write bit. Rd equals 1, Wr equals 0.(读写位)
A, N  (1 bit) : Accept and reverse accept bit.(回应位)
Address(7 bits): I2C 7 bit address. Note that this can be expanded as usual to
                get a 10 bit I2C address.
                (地址位，7位地址)
Command Code  (8 bits): Command byte, a data byte which often selects a register on
                the device.
                (命令字节，一般用来选择芯片内部的寄存器)
Data Byte (8 bits): A plain data byte. Sometimes, I write DataLow, DataHigh
                for 16 bit data.
                (数据字节，8位；如果是16位数据的话，用2个字节来表示：DataLow、DataHigh)
Count (8 bits): A data byte containing the length of a block operation.
				(在block操作总，表示数据长度)
[..]:           Data sent by I2C device, as opposed to data sent by the host
                adapter.
                (中括号表示I2C设备发送的数据，没有中括号表示host adapter发送的数据)
```

#### 2）**SMBus Quick Command**

<img src={require('./images/05-i2cprogramming-06.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  只是用来发送一位数据：R/W#本意是用来表示读或写，但是在SMBus里可以用来表示其他含义。比如某些开关设备，可以根据这一位来决定是打开还是关闭。

  Functionality flag: I2C\_FUNC\_SMBUS\_QUICK

#### 3 ）SMBus Receive Byte

<img src={require('./images/05-i2cprogramming-07.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  I2C-tools中的函数：i2c\_smbus\_read\_byte()。读取一个字节，Host adapter接收到一个字节后不需要发出回应信号(上图中N表示不回应)。

  Functionality flag: I2C\_FUNC\_SMBUS\_READ\_BYTE

#### **4）SMBus Send Byte**

<img src={require('./images/05-i2cprogramming-08.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  I2C-tools中的函数：i2c\_smbus\_write\_byte()。发送一个字节。

  Functionality flag: I2C\_FUNC\_SMBUS\_WRITE\_BYTE

#### 5）**SMBus Read Byte**

<img src={require('./images/05-i2cprogramming-09.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  I2C-tools中的函数：i2c\_smbus\_read\_byte\_data()。先发出Command Code(它一般表示芯片内部的寄存器地址)，再读取一个字节的数据。上面介绍的SMBus Receive Byte是不发送Comand，直接读取数据。

  Functionality flag: I2C\_FUNC\_SMBUS\_READ\_BYTE\_DATA

#### 6）**SMBus Read Word**

<img src={require('./images/05-i2cprogramming-10.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  I2C-tools中的函数：i2c\_smbus\_read\_word\_data()。先发出Command Code(它一般表示芯片内部的寄存器地址)，再读取2个字节的数据。

  Functionality flag: I2C\_FUNC\_SMBUS\_READ\_WORD\_DATA

#### 7）**SMBus Write Byte**

<img src={require('./images/05-i2cprogramming-11.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  I2C-tools中的函数：i2c\_smbus\_write\_byte\_data()。先发出Command Code(它一般表示芯片内部的寄存器地址)，再发出1个字节的数据。

  Functionality flag: I2C\_FUNC\_SMBUS\_WRITE\_BYTE\_DATA

#### 8）**SMBus Write Word**

<img src={require('./images/05-i2cprogramming-13.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  I2C-tools中的函数：i2c\_smbus\_write\_word\_data()。先发出Command Code(它一般表示芯片内部的寄存器地址)，再发出1个字节的数据。

  Functionality flag: I2C\_FUNC\_SMBUS\_WRITE\_WORD\_DATA

#### 9）**SMBus Block Read**

<img src={require('./images/05-i2cprogramming-14.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

I2C-tools中的函数：i2c\_smbus\_read\_block\_data()。先发出Command Code(它一般表示芯片内部的寄存器地址)，再发起度操作：

-   先读到一个字节(Block Count)，表示后续要读的字节数
-   然后读取全部数据

  Functionality flag: I2C\_FUNC\_SMBUS\_READ\_BLOCK\_DATA

#### 10）**SMBus Block Write**

<img src={require('./images/05-i2cprogramming-15.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

图 10.22 10 SMBus Block Write

I2C-tools中的函数：i2c\_smbus\_write\_block\_data()。先发出Command Code(它一般表示芯片内部的寄存器地址)，再发出1个字节的Byte Conut(表示后续要发出的数据字节数)，最后发出全部数据。

Functionality flag: I2C\_FUNC\_SMBUS\_WRITE\_BLOCK\_DATA

#### 11）**I2C Block Read**

在一般的I2C协议中，也可以连续读出多个字节。它跟SMBus Block Read的差别在于设备发出的第1个数据不是长度N，如下图所示：

<img src={require('./images/05-i2cprogramming-16.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  I2C-tools中的函数：i2c\_smbus\_read\_i2c\_block\_data()。先发出Command Code(它一般表示芯片内部的寄存器地址)，再发出1个字节的Byte Conut(表示后续要发出的数据字节数)，最后发出全部数据。

  Functionality flag: I2C\_FUNC\_SMBUS\_READ\_I2C\_BLOCK

#### 12）**I2C Block Write**

  在一般的I2C协议中，也可以连续发出多个字节。它跟SMBus Block Write的差别在于发出的第1个数据不是长度N，如下图所示：

<img src={require('./images/05-i2cprogramming-17.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  I2C-tools中的函数：i2c\_smbus\_write\_i2c\_block\_data()。先发出Command Code(它一般表示芯片内部的寄存器地址)，再发出1个字节的Byte Conut(表示后续要发出的数据字节数)，最后发出全部数据。

  Functionality flag: I2C\_FUNC\_SMBUS\_WRITE\_I2C\_BLOCK

#### 13）**SMBus Block Write - Block Read Process Call**

<img src={require('./images/05-i2cprogramming-18.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  先写一块数据，再读一块数据。

  Functionality flag: I2C\_FUNC\_SMBUS\_BLOCK\_PROC\_CALL

#### 14）**Packet Error Checking (PEC)**

  PEC是一种错误校验码，如果使用PEC，那么在P信号之前，数据发送方要发送一个字节的PEC码(它是CRC-8码)。以SMBus Send Byte为例，下图中，一个未使用PEC，另一个使用PEC：

<img src={require('./images/05-i2cprogramming-19.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

### 3.3 SMBus和I2C的建议

  因为很多设备都实现了SMBus，而不是更宽泛的I2C协议，所以优先使用SMBus。即使I2C控制器没有实现SMBus，软件方面也是可以使用I2C协议来模拟SMBus。所以：Linux建议优先使用SMBus。

## 4. I2C系统的重要结构体

参考资料：

-   Linux驱动程序:（某版本的Linux，比如Linux-4.9.88）/drivers/i2c
-   I2CTools:[**https://mirrors.edge.kernel.org/pub/software/utils/i2c-tools/**](https://mirrors.edge.kernel.org/pub/software/utils/i2c-tools/)

### 4.1 重要结构体

  使用一句话概括I2C传输：APP通过I2C Controller与I2C Device传输数据。

在Linux中要思索下面几个问题。

-   怎么表示I2C Controller
-   一个芯片里可能有多个I2C Controller，比如第0个、第1个、……
-   对于使用者，只要确定是第几个I2C Controller即可
-   使用i2c\_adapter表示一个I2C BUS，或称为I2C Controller，里面有2个重要的成员：

  a) nr：第几个I2C BUS(I2C Controller)

  b) i2c\_algorithm，里面有该I2C BUS的传输函数，用来收发I2C数据

i2c\_adapter原型：

<img src={require('./images/05-i2cprogramming-20.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

i2c\_algorithm原型：

<img src={require('./images/05-i2cprogramming-21.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

#### 1）**怎么表示I2C Device**

-   一个I2C Device，一定有**设备地址**
-   它连接在哪个I2C Controller上，即对应的i2c\_adapter是什么

  使用i2c\_client来表示一个I2C Device

#### 2）**怎么表示要传输的数据**

  在上面的i2c\_algorithm结构体中可以看到要传输的数据被称为：i2c\_msg

i2c\_msg原型：

-   i2c\_msg中的flags用来表示传输方向：bit 0等于I2C\_M\_RD表示读，bit 0等于0表示写
-   一个i2c\_msg要么是读，要么是写

  举例：设备地址为0x50的EEPROM，要读取它里面存储地址为0x10的一个字节，应该构造几个i2c\_msg？要构造2个i2c\_msg

    c) 第一个i2c\_msg表示写操作，把要访问的存储地址0x10发给设备

    d) 第二个i2c\_msg表示读操作

  代码如下：

```plain
u8 data_addr = 0x10;
i8 data;
struct i2c_msg msgs[2];

msgs[0].addr   = 0x50;
msgs[0].flags  = 0;
msgs[0].len    = 1;
msgs[0].buf    = &data_addr;

msgs[1].addr   = 0x50;
msgs[1].flags  = I2C_M_RD;
msgs[1].len    = 1;
msgs[1].buf    = &data;
```

### 4.2 内核里怎么传输数据

  使用一句话概括I2C传输：

    a) APP通过I2C Controller与I2C Device传输数据

    b) APP通过i2c\_adapter与i2c\_client传输i2c\_msg

    c) 内核函数i2c\_transfer

    i2c\_msg里含有addr，所以这个函数里不需要i2c\_client

<img src={require('./images/05-i2cprogramming-22.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

## 5. 无需编写驱动程序即可访问I2C设备

  APP访问硬件肯定是需要驱动程序的，对于I2C设备，内核提供了驱动程序\***drivers/i2c/i2c-dev.c****\***，通过它可以直接使用下面的I2C控制器驱动程序来访问I2C设备。

框架如下：

<img src={require('./images/05-i2cprogramming-24.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  i2c-tools是一套好用的工具，也是一套示例代码。

### 5.1 体验I2C-Tools

  使用一句话概括I2C传输：APP通过I2C Controller与I2C Device传输数据。

所以使用I2C-Tools时也需要指定：

-   哪个I2C控制器(或称为I2C BUS、I2C Adapter)
-   哪个I2C设备(设备地址)
-   数据：读还是写、数据本身

#### 5.1.1 用法

-   i2cdetect：I2C检测

```C
// 列出当前的I2C Adapter(或称为I2C Bus、I2C Controller)
i2cdetect -l

// 打印某个I2C Adapter的Functionalities, I2CBUS为0、1、2等整数
i2cdetect -F I2CBUS

// 看看有哪些I2C设备, I2CBUS为0、1、2等整数
i2cdetect -y -a I2CBUS  // 使用写操作检测
i2cdetect -y -r I2CBUS  // 使用读操作检测
 
// 效果如下
# i2cdetect -l
i2c-1   i2c             STM32F7 I2C(0x40013000)                 I2C adapter
i2c-2   i2c             STM32F7 I2C(0x5c002000)                 I2C adapter
i2c-0   i2c             STM32F7 I2C(0x40012000)                 I2C adapter

# i2cdetect -F 0
Functionalities implemented by /dev/i2c-0:
I2C                              yes
SMBus Quick Command              yes
SMBus Send Byte                  yes
SMBus Receive Byte               yes
SMBus Write Byte                 yes
SMBus Read Byte                  yes
SMBus Write Word                 yes
SMBus Read Word                  yes
SMBus Process Call               yes
SMBus Block Write                yes
SMBus Block Read                 yes
SMBus Block Process Call         yes
SMBus PEC                        yes
I2C Block Write                  yes
I2C Block Read                   yes

// --表示没有该地址对应的设备, UU表示有该设备并且它已经有驱动程序,
// 数值表示有该设备但是没有对应的设备驱动
# i2cdetect -y -a 1  
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00: 00 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- UU -- -- -- 1e --
20: -- -- UU -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

-   i2cget：I2C读

  使用说明如下:

```
# i2cget
  Usage: i2cget [-f] [-y] [-a] I2CBUS CHIP-ADDRESS [DATA-ADDRESS [MODE]]
  I2CBUS is an integer or an I2C bus name
  ADDRESS is an integer (0x03 - 0x77, or 0x00 - 0x7f if -a is given)
  MODE is one of:
    b (read byte data, default)
    w (read word data)
    c (write byte/read byte)
Append p for SMBus PEC
```

  使用示例：

```plain
// 读一个字节: I2CBUS为0、1、2等整数, 表示I2C Bus; CHIP-ADDRESS表示设备地址
i2cget -f -y I2CBUS CHIP-ADDRESS

// 读某个地址上的一个字节: 
//    I2CBUS为0、1、2等整数, 表示I2C Bus
//    CHIP-ADDRESS表示设备地址
//    DATA-ADDRESS: 芯片上寄存器地址
//    MODE：有2个取值, b-使用`SMBus Read Byte`先发出DATA-ADDRESS, 再读一个字节, 中间无P信号
//                   c-先write byte, 在read byte，中间有P信号 
i2cget -f -y I2CBUS CHIP-ADDRESS DATA-ADDRESS MODE  

// 读某个地址上的2个字节: 
//    I2CBUS为0、1、2等整数, 表示I2C Bus
//    CHIP-ADDRESS表示设备地址
//    DATA-ADDRESS: 芯片上寄存器地址
//    MODE：w-表示先发出DATA-ADDRESS，再读2个字节
i2cget -f -y I2CBUS CHIP-ADDRESS DATA-ADDRESS MODE
```

-   i2cset：I2C写

  使用说明如下：

```plain
# i2cset
  Usage: i2cset [-f] [-y] [-m MASK] [-r] [-a] I2CBUS CHIP-ADDRESS DATA-ADDRESS [VALUE] ... [MODE]
  I2CBUS is an integer or an I2C bus name
  ADDRESS is an integer (0x03 - 0x77, or 0x00 - 0x7f if -a is given)
  MODE is one of:
    c (byte, no value)
    b (byte data, default)
    w (word data)
  i (I2C block data)
    s (SMBus block data)
Append p for SMBus PEC
```

  使用示例：

```plain
// 写一个字节: I2CBUS为0、1、2等整数, 表示I2C Bus; CHIP-ADDRESS表示设备地址
  //           DATA-ADDRESS就是要写的数据
  i2cset -f -y I2CBUS CHIP-ADDRESS DATA-ADDRESS
  
  // 给address写1个字节(address, value):
  //           I2CBUS为0、1、2等整数, 表示I2C Bus; CHIP-ADDRESS表示设备地址
  //           DATA-ADDRESS: 8位芯片寄存器地址; 
  //           VALUE: 8位数值
  //           MODE: 可以省略，也可以写为b
  i2cset -f -y I2CBUS CHIP-ADDRESS DATA-ADDRESS VALUE [b]
  
  // 给address写2个字节(address, value):
  //           I2CBUS为0、1、2等整数, 表示I2C Bus; CHIP-ADDRESS表示设备地址
  //           DATA-ADDRESS: 8位芯片寄存器地址; 
  //           VALUE: 16位数值
  //           MODE: w
  i2cset -f -y I2CBUS CHIP-ADDRESS DATA-ADDRESS VALUE w
  
  // SMBus Block Write：给address写N个字节的数据
  //   发送的数据有：address, N, value1, value2, ..., valueN
  //   跟`I2C Block Write`相比, 需要发送长度N
  //           I2CBUS为0、1、2等整数, 表示I2C Bus; CHIP-ADDRESS表示设备地址
  //           DATA-ADDRESS: 8位芯片寄存器地址; 
  //           VALUE1~N: N个8位数值
  //           MODE: s
  i2cset -f -y I2CBUS CHIP-ADDRESS DATA-ADDRESS VALUE1 ... VALUEN s
  
  // I2C Block Write：给address写N个字节的数据
  //   发送的数据有：address, value1, value2, ..., valueN
  //   跟`SMBus Block Write`相比, 不需要发送长度N
  //           I2CBUS为0、1、2等整数, 表示I2C Bus; CHIP-ADDRESS表示设备地址
  //           DATA-ADDRESS: 8位芯片寄存器地址; 
  //           VALUE1~N: N个8位数值
  //           MODE: i
  i2cset -f -y I2CBUS CHIP-ADDRESS DATA-ADDRESS VALUE1 ... VALUEN i
```

-   i2ctransfer：I2C传输(不是基于SMBus)

  使用说明如下：

```plain
# i2ctransfer
  Usage: i2ctransfer [-f] [-y] [-v] [-V] [-a] I2CBUS DESC [DATA] [DESC [DATA]]...
  I2CBUS is an integer or an I2C bus name
  DESC describes the transfer in the form: {r|w}LENGTH[@address]
    1) read/write-flag 2) LENGTH (range 0-65535) 3) I2C address (use last one if omitted)
  DATA are LENGTH bytes for a write message. They can be shortened by a suffix:
    = (keep value constant until LENGTH)
    + (increase value by 1 until LENGTH)
    - (decrease value by 1 until LENGTH)
    p (use pseudo random generator until LENGTH with value as seed)

Example (bus 0, read 8 byte at offset 0x64 from EEPROM at 0x50):
  # i2ctransfer 0 w1@0x50 0x64 r8
Example (same EEPROM, at offset 0x42 write 0xff 0xfe ... 0xf0):
  # i2ctransfer 0 w17@0x50 0x42 0xff-
```

  使用举例：

```plain
// Example (bus 0, read 8 byte at offset 0x64 from EEPROM at 0x50):
# i2ctransfer -f -y 0 w1@0x50 0x64 r8

  // Example (bus 0, write 3 byte at offset 0x64 from EEPROM at 0x50):
# i2ctransfer -f -y 0 w9@0x50 0x64 val1 val2 val3

  // Example 
// first: (bus 0, write 3 byte at offset 0x64 from EEPROM at 0x50)
// and then: (bus 0, read 3 byte at offset 0x64 from EEPROM at 0x50)
# i2ctransfer -f -y 0 w9@0x50 0x64 val1 val2 val3 r3@0x50  
# i2ctransfer -f -y 0 w9@0x50 0x64 val1 val2 val3 r3 //如果设备地址不变,后面的设备地址可省略
```

### 5.2 I2C-Tools访问I2C设备的2种方式

  I2C-Tools可以通过SMBus来访问I2C设备，也可以使用一般的I2C协议来访问I2C设备。

  使用一句话概括I2C传输：APP通过I2C Controller与I2C Device传输数据。

在APP里，有这几个问题：

① 怎么指定I2C控制器？

-   i2c-dev.c为每个I2C控制器(I2C Bus、I2C Adapter)都生成一个设备节点：/dev/i2c-0、/dev/i2c-1等等；
-   open某个/dev/i2c-X节点，就是去访问该I2C控制器下的设备；

② 怎么指定I2C设备？

 通过ioctl指定I2C设备的地址

-   ioctl(file, I2C\_SLAVE, address)

-   如果该设备已经有了对应的设备驱动程序，则返回失败。

-   ioctl(file, I2C\_SLAVE\_FORCE, address)

-   如果该设备已经有了对应的设备驱动程序但是还是想通过i2c-dev驱动来访问它，则使用这个ioctl来指定I2C设备地址。

③ 怎么传输数据？

 三种方式

-   一般的I2C方式：ioctl(file, I2C\_RDWR, &rdwr)
-   SMBus方式：ioctl(file, I2C\_SMBUS, &args)
