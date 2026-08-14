---
sidebar_position: 6
---

# 串口使用

:::tip 提示

本指南将指导您如何使用 **RK3506-EVB** 的**串口**功能。


:::

HD-RK3506-EVB开发板除了提供TTL电平的调试串口外，还提供了3个TTL电平的串口供用户使用：

<div style={{display: 'flex', justifyContent: 'center', gap: '0px', margin: '20px 0'}}>
  <img src={require('./images/gpio.png').default} alt="开发板" className="doc-image--50" />
  <img src={require('./images/06-serialportusage-02.png').default} alt="原理图" className="doc-image--50" />
</div>

串口引脚对应表如下所示：

| 引脚标号 | 引脚功能 | 电平 | 设备文件名 |
| --- | --- | --- | --- |
| 8、10 | UART1 | TTL | /dev/ttyS1 |
| 12、16 | UART2 | TTL | /dev/ttyS2 |
| 18、22 | UART3 | TTL | /dev/ttyS3 |

系统提供serial\_test程序可以对串口进行数据收发测试,该程序在运行时，需要提供一个命令行参数：对于原生串口该参数既可以是需要打开的串口名，如：“COM2”、“COM3”等；也可以是需要打开的设备名，如`/dev/ttyS4`、`/dev/ttyS5`等，该平台的tty命名规则为ttySx，所以不能用COMx作为参数来测试串口，只能用`/dev/ttySx`作为参数。

```shell
root@rk3506-buildroot:/# serial_test /dev/ttyS1 9600 0 8 1
```

该程序运行流程如下：

-   打开串口（通讯参数为：`/dev/ttyS1`: 设备节点, 9600 : 波特率，0：无数据校验位，8：数据位，1：停止位）；
-   通过串口发送一个20字节的数据；
-   使用镊子短接Tx从串口接收数据；
-   重复步骤2~3，实现数据的循环发送和接收。

使用serial\_test程序进行串口数据收发测试的步骤如下：

-   使用镊子或其他工具短接UART1的Tx与Rx就能实现串口的自收自发测试

<img src={require('./images/06-serialportusage-03.png').default} alt="image.png" className="doc-image--80" />

串口1的自收自发测试