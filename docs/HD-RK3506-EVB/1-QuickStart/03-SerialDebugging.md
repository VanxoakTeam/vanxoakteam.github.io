---
sidebar_position: 3
---

# 串口调试指南

:::tip 提示

本指南针对首次使用 **HD-RK3506-EVB** 开发板的用户，详细阐述串口调试方式，确保系统能够正常运行。

:::

通过串口登录开发板的串口通讯参数设置如下：

| 串口参数 | 值 |
| --- | --- |
| 波特率 | 115200 |
| 数据位 | 8 |
| 停止位 | 1 |
| 奇偶校验位 | 无 |
| 流控 | 关闭所有流控 |

<img src={require('./images/debug.png').default} alt="TTL调试串口位置" className="doc-image--50" />

使用TTL 调试串口工具，连接HD-RK3506-EVB评估板调试串口和电脑，从“设备管理器”中查看串口端口号，实际串口号以电脑识别到的端口号为准，图示只做参考。

<img src={require('./images/03-serialdebugging-02.png').default} alt="" className="doc-image--80" />

## 使用MobaXterm登录调试串口

1、按照[硬件连接](https://doc.vanxoak.com/docs/HD-RK3506-EVB/QuickStart/HardwareConnection)[链接](about:blank)完成接线后，就可以进行串口登陆调试了。

2、打开MobaXterm软件，在MobaXterm中按照图片中的顺序进行串口参数配置（波特率115200、8个数据位、1个停止位、无校验、无流控）,最后点击“OK”完成设置；

<img src={require('./images/03-serialdebugging-03.png').default} alt="image.png" className="doc-image--80" />

  

3、接通电源，MobaXterm中就会显示系统启动过程中的日志信息，最后就可以使用直接使用shell命令进行调试了，调试串口进入系统（buildroot系统）做了免输入用户名及密码，默认不需要输入用户名和密码；

<img src={require('./images/03-serialdebugging-04.png').default} alt="image.png" className="doc-image--80" />
