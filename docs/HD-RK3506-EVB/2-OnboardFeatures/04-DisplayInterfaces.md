---
sidebar_position: 4
---

# 显示接口使用（MIPI 与 RGB）

:::tip 提示

本指南将指导您如何使用 **HD-RK3506-EVB** 的 **显示** 功能,板载硬件接口支持<span style={{ color: "#ff0000" }}>RGB LCD显示 或 MIPI LCD显示</span>。

其中**HD-RK3506-EVB**的<span style={{ color: "#ff0000" }}>RGB接口支持RGB565</span>, <span style={{ color: "#ff0000" }}>MIPI接口支持2lanes</span>,显示最大支持屏幕分辨率为<span style={{ color: "#ff0000" }}>1280x1280@60fps</span>,。

:::

## 1. 上电显示

​	上电后，7寸的MIPI屏和5寸的RGB屏，均显示lvgl程序demo，显示内容如下图所示。

<div style={{display: 'flex', justifyContent: 'center', gap: '00px', margin: '20px 0'}}>
  <img src={require('./images/mipi.png').default} alt="USB供电烧录" className="doc-image--50" />
  <img src={require('./images/rgb.png').default} alt="12s" className="doc-image--50" />
</div>

## 2. 液晶显示

Rockchip 平台从 Linux 4.4 内核开始，显示驱动全部切到 DRM 显示框架。

DRM 全称是 Direct Rendering Manager，进行显示输出管理、buffer 分配、帧缓冲。对应的 userspace 库为 libdrm，libdrm 库提供了一系列友好的控制封装，使用户可以方便的进行显示的控制和 buffer 申请。DRM 的设备节点为 "/dev/dri/cardX"， X 为 0-15 的数值，默认使用的/dev/dri/card0.

一般对于drm显示设备测试使用modetest工具。

查看drm系统的基础状态：

```shell
root@rk3506-buildroot:/# modetest -M rockchip
Encoders:
id      crtc    type    possible crtcs  possible clones
74      72      DSI     0x00000001      0x00000001

Connectors:
id      encoder status          name            size (mm)       modes   encoders
75      74      connected       DSI-1           0x0             1       74
  modes:
        index name refresh (Hz) hdisp hss hse htot vdisp vss vse vtot
  #0 1024x600 48.52 1024 1184 1208 1344 600 618 623 644 42000 flags: nhsync, nvsync; type: preferred, driver
  props:
        ...此处有删减

CRTCs:
id      fb      pos     size
72      78      (0,0)   (1024x600)
  #0 1024x600 48.52 1024 1184 1208 1344 600 618 623 644 42000 flags: nhsync, nvsync; type: preferred, driver
  props:
        ...此处有删减
        
Planes:
id      crtc    fb      CRTC x,y        x,y     gamma size      possible crtcs
58      72      78      0,0             0,0     0               0x00000001
  formats: XR24 AR24 XB24 AB24 RG24 BG24 RG16 BG16
  props:
       ...此处有删减
       
Frame buffers:
id      size    pitch
```

第一部分的 Encoders 输出和第二部分的 Connectors 对应，从 Dump 输出我们可以看到：

Connector DSI-1 的 id 为 75，它对应的 Encoder id 为 74，且它处于 connected 的状态，说明底层驱动已经检测到了该 DSI 接口上已经有显示设备连接，modes 是驱动上报的对应显示设备支持的分辨率。

CRTC 对应 VOP 2.0 中的 Video Port 或者 VOP 1.0 中的 vop(RK3506使用VOP 1.0)。

Planes 对应图层，列出的信息包含该图层可以在哪几个 VP 之间切换（ possible crtcs ）以及所支持的格式( formats )。

> **注意：HD-RK3506-EVB 支持 MIPI 和 RGB 显示接口，但两种接口不能同时使用。出厂固件默认适配万象奥科 7 英寸 MIPI 显示屏，分辨率为 1024×600。**

以MIPI显示为例，检测到drm正常后，输入如下指令后可以在显示屏上输出彩条:

```shell
modetest -M rockchip -s 75@72:1024x600
```

通过上述命令，可以在DSI上显示类似下边的smpte彩条，其中75是DPI-1的id,72是VOP1的id。

<img src={require('./images/04-displayinterfaces-01.png').default} alt="image.png" className="doc-image--80" />

## 2. 液晶背光设置

液晶屏使用`backlight`设置背光亮度，背光值设置范围`0~255`：

```shell
echo 150 > /sys/class/backlight/backlight/brightness
```
