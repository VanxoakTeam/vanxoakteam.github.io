---
sidebar_position: 2
---

# 硬件连接

:::tip 提示

本指南针对首次使用 **HD-RK3506-EVB** 开发板的用户，详细阐述标准的接线与开机流程，确保系统能够安全、正常运行。

:::

## 1. 快速启动连接图

用户可根据快速启动连接图进行连接。

```mermaid
flowchart TD
    Power["电源适配器或电脑供电"] -->|"Type-C"| Board["HD-RK3506-EVB 开发板"]

    Board -->|"RGB LCD（可选）"| RGB["RGB LCD"]
    Board -->|"MIPI DSI（可选）"| MIPI["MIPI LCD"]

    Ethernet["网线"] -.->|"RJ45（可选）"| Board

		WIFI["WiFi/BT 模块"] -->|"WiFi/BT"| Board
    USB["U盘"] -.->|"USB Host（可选）"| Board
    TFCard["TF/SD 卡"] -.->|"TF 卡槽（可选）"| Board
    RTC["RTC 电池"] -.->|"RTC（可选）"| Board
```

## 2. 快速启动连接示例

### 2.1 电源供电

- 使用电源适配器或电脑USB连接Type-C 至 **HD-RK3506-EVB**，系统电源灯**红灯常亮**。
- 等待系统启动完成，当系统启动完成后，系统运行指示灯**蓝色灯闪烁**。
- <span style={{ color: "#ff0000" }}>图中Type-C连接线，接入电脑USB口；或连接5V/1A电源。</span>

<img src={require('./images/02-hardwareconnection-02.png').default} alt="5304f141-1a09-4b83-b921-796a5bc33097.png" className="doc-image--50" />

### 2.2 串口连接

- 使用串口模块（TTL转USB模块）连接开发板。
- 串口模块的 TX 接入 HD-RK3506-EVB 的 RX（<span style={{ color: "#ff0000" }}> 红色杜邦线</span>）。
- 串口模块的 RX 接入 HD-RK3506-EVB 的 TX（<span style={{ color: "\#008000" }}> 绿色杜邦线</span>）。
- 串口模块的 GND 接入 HD-RK3506-EVB的 GND（<span style={{ color: "\#ffc107" }}> 黄色杜邦线</span>）。

<div style={{display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0'}}>
  <img src={require('./images/02-hardwareconnection-03.png').default} alt="调试串口" className="doc-image--50" />
  <img src={require('./images/02-hardwareconnection-04.png').default} alt="12s" className="doc-image--50" />
</div>

​	系统启动后，将会从调试串口输出打印信息。

### 2.3 屏幕连接

- HD-RK3506-EVB 可接入 RGB LCD 或 MIPI LCD。

- 两者同时只能单独显示一个，不可同时显示。


#### MIPI LCD

HD-RK3506-EVB 使用 32-pin 同向排线连接万象奥科适配的 7 英寸 MIPI LCD 显示屏。

<div style={{display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0'}}>
  <img src={require('./images/mipi_lcd.jpg').default} alt="调试串口" className="doc-image--50" />
  <img src={require('./images/mipi.jpg').default} alt="12s" className="doc-image--50" />
</div>

#### RGB LCD

HD-RK3506-EVB 使用 40-pin 同向排线连接万象奥科适配的 5 英寸 RGB LCD 显示屏。

<div style={{display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0'}}>
  <img src={require('./images/rgb_lcd.jpg').default} alt="调试串口" className="doc-image--50" />
  <img src={require('./images/rgb.jpg').default} alt="12s" className="doc-image--50" />
</div>




