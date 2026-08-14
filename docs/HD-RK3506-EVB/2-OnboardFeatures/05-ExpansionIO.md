---
sidebar_position: 5
---

# 扩展 I/O 使用

:::tip 提示

本指南将指导您如何使用 **RK3506-EVB** 的 **GPIO** 功能。


:::

## 1. gpio资源介绍

HD-RK3506-EVB在JP4 扩展排针上提供了除电源脚和和空脚外，其他所有的端口均能被复用成GPIO，但是有部分IO口默认复用为了I2C、UART、CAN、SPI等功能,使用时请注意。

出厂固件，串口相关IO默认复用成了UART功能，如不需要串口扩展，可自行在设备树中disabled相关节点。

<img src={require('./images/05-expansionio-01.png').default} alt="image.png" className="doc-image--80" />

## 2. gpio号计算

以JP4中的29、31、33、35、37脚为例，说明下GPIO的使用方法

| 细节 | 描述 | 说明 |
| --- | --- | --- |
| 计算公式 | pin=bank*32+num |  |
| 输入项 | bank | bank号，计算gpio序号时需要乘32 |
|  | num | 分为字母和数字两部分，num值为二者之和，其中字母A、B、C、D，分别代表0、8、16、24 |
| 输出项 | pin | 得到的GPIO引脚号 |

| 插针编号 | 引脚标号 | 引脚功能 | 计算公式 | GPIO值 |
| --- | --- | --- | --- | --- |
| 29脚 | GPIO1_C1 | GPIO1_C1 | 1*32+16+1 | 49 |
| 31脚 | GPIO1_C0 | GPIO1_C0 | 1*32+16+0 | 48 |
| 33脚 | GPIO1_B7 | GPIO1_B7 | 1*32+8+7 | 47 |
| 35脚 | GPIO1_B6 | GPIO1_B6 | 1*32+8+6 | 46 |
| 37脚 | GPIO1_B5 | GPIO1_B5 | 1*32+8+5 | 45 |

> **注意：** 各插针的功能请参阅 [HD-RK3506G-CORE V1.0 引脚列表](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/rk3506g-core/HD-RK3506G-CORE%20V1.0-PinList.xlsx)。

当用户需要直接控制GPIO引脚电平时，可以通过来操作GPIO编号实现，以GPIO1\_C1为例

我们可以将其用杜邦线引出并用万用表测量其输出电平，现我们通过sysfs来对其输出不同电平以进行GPIO的测试，GPIO1\_C1的GPIO编号值：

```shell
1*32+16+1 = 49
```

## 3. gpio操作

计算出GPIO编号后，通过以下命令导出到用户空间:

```shell
root@hd-rk3506:/# echo 49 > /sys/class/gpio/export
```

生成的gpio49目录内容如下所示。

```shell
root@hd-rk3506:/# ls /sys/class/gpio/gpio49/
active_low  device  direction  edge  power  subsystem  uevent  value
```

direction为GPIO的方向控制接口，可输入in和out来指定该gpio用作输入还是输出功能。value为GPIO的引脚电平接口，作为输入口时此接口表示外接输入的电平，作为输出口时此接口表示输出的电平。

例如通过以下命令来设置引脚49输出电平。

```shell
root@hd-rk3506:/# echo out > /sys/class/gpio/gpio49/direction   # 设置方向
root@hd-rk3506:/# echo 1 > /sys/class/gpio/gpio49/value         # 1为高电平
root@hd-rk3506:/# echo 0 > /sys/class/gpio/gpio49/value         # 0为低电平
```

当向“/sys/class/gpio/gpio49/value”写入“1”时可以通过万用表测试其输出是否为高来验证，写入“0”时其输出应为低。

## 4. gpio功能查询

GPIO的编号以及状态也可通过下述命令查询：

```shell
root@hd-rk3506:/# cat /sys/kernel/debug/gpio
gpiochip0: GPIOs 0-31, parent: platform/fdd60000.gpio, gpio0:
gpio-0   (                    |ads7846_pendown     ) in  hi
gpio-5   (                    |vcc5v0_otg          ) out lo
 ...
gpio-27  (                    |sysfs               ) out lo
```

> 注意：如果某个GPIO已经在被内核占用，则导出时可能会出现不能被导出并且系统提示"Device or resource busy"的情况（例如被内核用作SPI功能）。

检查板子上的功能和引脚定义

```plain
root@hd-rk3506:/# cat /sys/kernel/debug/pinctrl/pinctrl-maps  | egrep "function|gpio"
```
