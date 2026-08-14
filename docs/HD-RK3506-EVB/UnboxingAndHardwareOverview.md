---
sidebar_position: 2
---

# 开箱清单与硬件接口速览

:::tip 提示

本文档主要介绍开箱清单与硬件接口速览，可帮助用户快速了解HD-RK3506-EVB 硬件接口相关功能。

:::

## 1. 开箱清单

HD-RK3506-EVB评估底板在出货时，均会装入电源、天线等，清单如下：


| 序号 | 名称                | 数量 | 备注                 |
| :--- | :------------------- | :--- | :-------------------- |
|  1   | HD-RK3506-EVB评估板 |  1   | 使用防静电气泡袋包装 |
|  2   | Wi-Fi 天线           |  1   |                      |
|  3   | RTC电池             |  1   |                      |
|  4   | 技术支持卡片        |  1   | 扫描可加入技术支持群 |
|  5   | 包装盒              |  1   |                      |

<img src={require('./images/unboxingandhardwareoverview-01.png').default} alt="开箱清单" className="doc-image--100" />

## 2. 硬件接口速览

<img src={require('./images/evb.png').default} alt="开箱清单" className="doc-image--80" />

### 2.1 USB供电/烧录接口

HD-RK3506-EVB板通过Type-C端子来供电，额定电压为5V。电源接口示意图如下所示。
<img src={require('./images/usb.png').default} alt="开箱清单" className="doc-image--25" />

### 2.2 指示灯

HD-RK3506-EVB板中有2个功能指示灯，指示灯分别为运行指示和电源指示，方便在任何的情况下，了解系统的运行状况，具体见下表中描述。

<img src={require('./images/led.png').default} alt="指示灯" className="doc-image--25" />


| 指示灯 | 默认功能 | 描述 |
| --- | --- | --- |
| 蓝灯 | RUN，系统运行状态指示灯 | 不断闪烁表示系统正在运行。 |
| 红灯 | PWR，电源指示灯 | 电源接入后，一直长亮 |

### 2.3 烧录接口及启动功能配置

HD-RK3506-EVB板提供有1个Type-C烧录口，1个Recovery排针接口，1个Maskrom排针接口，用于系统调试、启动配置等。各接口相关描述如下。

<div style={{display: 'flex', justifyContent: 'center', gap: '100px', margin: '20px 0'}}>
  <img src={require('./images/usb.png').default} alt="USB供电烧录" className="doc-image--25" />
  <img src={require('./images/debug.png').default} alt="12s" className="doc-image--25" />
</div>



| 丝印 | 默认功能 | 描述 |
| --- | --- | --- |
| RECOVER | Loader烧写模式选择 | 默认为正常使用，短接排针并重新上电时进入Loader烧写模式 |
| RESET | 复位功能 | 默认为正常使用，短接排针，系统重启 |
| MASKROM | Maskrom烧写模式选择 | 默认为正常使用，短接排针并重新上电时进入Maskrom烧写模式 |

### 2.4 调试串口

在HD-RK3506-EVB，提供有1个3Pin 2.54mm间距排针，此排针为RK3506核心板的UART 3.3V TTL电平调试串口，示意图及引脚定义如下。

<img src={require('./images/debug.png').default} alt="12s" className="doc-image--25" />


| 引脚 | 名称 | 描述 | 引脚电平 |
| --- | --- | --- | --- |
| 1 | GND | 系统地 | 0V |
| 2 | RXD | 核心板数据接收端 | 3.3V |
| 3 | TXD | 核心板数据发送端 | 3.3V |

### 2.5 USB2.0 Host接口

HD-RK3506-EVB底板有1路USB2.0 Host接口，接口采用单层Type-A USB插座，可供用户外接USB Device设备。Type-A USB插座接口示意图及引脚定义如下所示。

<img src={require('./images/usbhost.png').default} alt="13214.png" className="doc-image--20" />


| 引脚 | 名称 | 描述 |
| --- | --- | --- |
| 1 | VBUS | 系统5V 电源输出 |
| 2 | D- | USB2.0数据引脚DATA（-） |
| 3 | D+ | USB2.0数据引脚DATA（+） |
| 4 | GND | 系统地 |
| 5、6 | GND_EARTH | 外壳保护地 |

### 2.6 以太网接口

HD-RK3506-EVB评估板对外提供2路百兆以太网接口，均支持10M/100M通信 (默认出厂固件中，ETH0设置固定IP，ETH1设置为动态IP)。以太网接口采用标准RJ45插座，其示意图及引脚定义如下所示。

<img src={require('./images/eth.png').default} alt="网口" className="doc-image--25" />

### 2.7 显示接口

HD-RK3506-EVB评估板支持RGB LCD显示 或 MIPI LCD显示，可任选一种接口接入屏幕显示。

<img src={require('./images/ui.png').default} alt="网口" className="doc-image--25" />

### 2.8 TF 卡接口

HD-RK3506-EVB评估板预留了一个TF 卡座（存储为EMMC版本时，此接口不支持）

<img src={require('./images/tf.png').default} alt="TF 卡" className="doc-image--25" />


| 引脚 | 名称 | 描述 |
| --- | --- | --- |
| 1 | DATA2 | 数据位2 |
| 2 | DATA3 | 数据位3 |
| 3 | CMD | 命令 |
| 4 | VDD | 3.3V电源 |
| 5 | CLK | 时钟信号 |
| 6 | GND | 系统地 |
| 7 | DATA0 | 数据位0 |
| 8 | DATA1 | 数据位1 |
| 9 | Card Detection | 插卡探测 |

### 2.9 IO扩展排针

HD-RK3506-EVB评估板将剩余未使用的RM\_IO，GPIO等接口通过40Pin 2.54mm间距双排针引出，方便用户进行接口扩展及重定义来做灵活开发。IO扩展排针示意图及引脚定义如下。

<img src={require('./images/gpio.png').default} alt="扩展GPIO" className="doc-image--40" />


| 引脚 | 名称 | 默认功能 | 是否支持RM_IO | RM_IO编号 | 引脚电平 | 备注 |
| :-- | --- | --- | --- | --- | --- | --- |
| 1 | VCC3P3 | 3.3V 电源输出 |  |  |  | VCC3P3 |
| 2 | VDD5 | 5V 电源输出 |  |  |  | VDD5 |
| 3 | SAI1_SDI | I2C1_SDA | √ | RM_IO11 | 3.3V | GPIO0_B3 |
| 4 | VDD5 | 5V 电源输出 |  |  |  | VDD5 |
| 5 | SAI1_SDO0 | I2C1_SCL | √ | RM_IO12 | 3.3V | GPIO0_B4 |
| 6 | GND |  |  |  |  | GND |
| 7 | SAI1_MCLK | GPIO0_B0 | √ | RM_IO8 | 3.3V | GPIO0_B0 |
| 8 | UART1_TX | UART1_TX | √ | RM_IO17 | 3.3V | GPIO0_C1 |
| 9 | GND |  |  |  |  | GND |
| 10 | UART1_RX | UART1_RX | √ | RM_IO16 | 3.3V | GPIO0_C0 |
| 11 | SAI1_SCLK | GPIO0_B1 | √ | RM_IO9 | 3.3V | GPIO0_B1 |
| 12 | UART2_TX | UART2_TX | √ | RM_IO2 | 3.3V | GPIO0_A2 |
| 13 | SAI1_LRCK | GPIO0_B2 | √ | RM_IO10 | 3.3V | GPIO0_B2 |
| 14 | GND |  |  |  |  | GND |
| 15 | CAN1_TX | CAN1_TX | √ | RM_IO13 | 3.3V | GPIO0_B5 |
| 16 | UART2_RX | UART2_RX | √ | RM_IO0 | 3.3V | GPIO0_A0 |
| 17 | VCC3P3 |  |  |  |  | VCC3P3 |
| 18 | UART3_TX | UART3_TX | √ | RM_IO14 | 3.3V | GPIO0_B6 |
| 19 | SPI0_MOSI | SPI0_MOSI | √ | RM_IO3 | 3.3V | GPIO0_A3 |
| 20 | GND |  |  |  | 3.3V | GND |
| 21 | SPI0_MISO | SPI0_MISO | √ | RM_IO6 | 3.3V | GPIO0_A6 |
| 22 | UART3_RX | UART3_RX | √ | RM_IO15 | 3.3V | GPIO0_B7 |
| 23 | SPI0_CLK | SPI0_CLK | √ | RM_IO1 | 3.3V | GPIO0_A1 |
| 24 | SPI0_CSN0 | SPI0_CSN0 | √ | RM_IO7 | 3.3V | GPIO0_A7 |
| 25 | GND |  |  |  |  |  |
| 26 | CAN1_RX | CAN1_RX | √ | RM_IO18 | 3.3V | GPIO0_C2 |
| 27 | I2C0_SDA | I2C0_SDA | √ | RM_IO24 | 3.3V | GPIO1_B1 |
| 28 | I2C0_SCL | I2C0_SCL | √ | RM_IO25 | 3.3V | GPIO1_B2 |
| 29 | GPIO1_C1 | GPIO1_C1 | x |  | 3.3V | GPIO1_C1 |
| 30 | GND |  |  |  |  |  |
| 31 | GPIO1_C0 | GPIO1_C0 | x |  | 3.3V | GPIO1_C0 |
| 32 | CAN0_TX | CAN0_TX | √ | RM_IO19 | 3.3V | GPIO0_C3 |
| 33 | GPIO1_B7 | GPIO1_B7 | x |  | 3.3V | GPIO1_B7 |
| 34 | GND |  |  |  |  |  |
| 35 | GPIO1_B6 | GPIO1_B6 | x |  | 3.3V | GPIO1_B6 |
| 36 | CAN0_RX | CAN0_RX | √ | RM_IO20 | 3.3V | GPIO0_C4 |
| 37 | GPIO1_B5 | GPIO1_B5 | x |  | 3.3V | GPIO1_B5 |
| 38 | GPIO1_B4 | GPIO1_B4 | x |  | 3.3V | GPIO1_B4 |
| 39 | GND |  |  |  |  |  |
| 40 | NOP |  |  |  |  |  |

  

**RM\_IO接口是RK3506的IO 矩阵，具有如下特性：**

-   RM\_IOn（n=0\~31）可以从function IDn（n=0\~98）任选其中一个功能，并且function IDn（n=0\~98）的每个功能，只能映射于其中一个RM\_IOn（n=0\~31）。
    举例：RM\_IO0 选择I2C0\_SCL，则I2C0\_SCL 不能再映射到RM\_IOn（n=1\~31）中；RM\_IO1 选择I2C0\_SDA，则I2C0\_SDA 不能再映射到RM\_IO0、RM\_IOn（n=2\~31）中。
-   由于RM\_IOn（n=0\~31）分布在PMUIO、VCCIO1 两个电源域，但对于同一个功能，并且有较高时序要求的，**不建议跨电源域使用。**例如，SAI、PDM、SPI 信号。
    举例：不要将SAI0\_SCLK 分配在PMUIO 电源域，而将SAI0\_SDI0 分配在VCCIO1 域。
    function IDn（n=0\~98）具体功能见下图所示：

<img src={require('./images/unboxingandhardwareoverview-03.png').default} alt="image13.png" className="doc-image--100" />

## 3. 机械尺寸

HD-RK3506-EVB评估板尺寸为 120mm \* 68mm。四角定位孔尺寸为3.5/6mm（内径/外径）；其机械尺寸图如下所示：

<img src={require('./images/unboxingandhardwareoverview-04.png').default} alt="image.png" className="doc-image--100" />
