---
sidebar_position: 7
---

# 固件烧录全流程

:::tip 提示

本指南针对首次使用 **HD-RK3506-EVB** 开发板的用户，介绍快速查看开发板系统信息的常用命令。

:::

## 1. 烧写前准备

### 1.1 硬件部分

- 开发板 HD-RK3506-EVB
- 调试串口及相应的连接线缆（TTL转USB模块）
- USB-Type-C数据线（供电以及烧录）

### 1.2 软件部分

- Windows 7以上系统
- 驱动助手DriverAssitant
- 瑞芯微烧录工具RKDevTool\_Release 3.31
- 系统固件文件，可从下方连接跳转至资料中心进行下载

> 注：相关软件资料软件可以从[资料下载](/docs/HD-RK3506-EVB/QuickStart/Resource_Download_Summary)进行下载

  系统固件组成如下所示：

| 文件 | 描述 |
| --- | --- |
| MiniLoaderAll.bin | 引导文件 |
| uboot.img | uboot镜像 |
| boot.img | 内核镜像 |
| recovery.img | recovery镜像 |
| rootfs.img | 文件系统镜像 |
| misc.img | 来自rockchip的自定义文件 |
| oem.img | oem分区的固件镜像 |
| parameter.txt | 分区表 |
| userdata.img | 用户空间的固件镜像 |
| update.img | 上述文件打包而成，完整的系统镜像 |

## 2. USB烧写

### 2.1 usb驱动安装

  解压上面提供的DriverAssitant\_v5.13.zip压缩包，进入DriverAssitant\_v5.13目录，双击运行DriverInstall.exe进行安装：

<img src={require('./images/07-firmwareflashing-01.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '50%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  点击“驱动安装”，若出现windows安全提醒，点击信任后继续安装。

<div style={{display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0'}}>
  <img src={require('./images/07-firmwareflashing-08.png').default} alt="驱动安装" style={{maxWidth: '25%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>
  <img src={require('./images/07-firmwareflashing-09.png').default} alt="安装成功" style={{maxWidth: '25%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>
</div>

### 2.2 解压烧写工具

  解压上面提供的RKDevTool.zip，进入RKDevTool\_Release目录后双击运行RKDevTools.exe：

<img src={require('./images/07-firmwareflashing-10.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

### 2.3 连接开发板

  使用USB-C数据线，将电脑和开发板USB Device进行连接。

<img src={require('./images/evb-usb.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

### 2.4 Maskrom模式

  在开发过程中,我们需要采用MASKROM模式进行烧写，用跳线帽短接核心板上**MASKROM**焊接点，然后重新上电。**MASKROM**位置如下图：

<img src={require('./images/maskrom.png').default} alt="MASKROM 示意图" style={{display: 'block', margin: '20px auto', maxWidth: '50%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  发现MASKROM设备后拔出跳线帽，然后点接执行刷机，软件操作与Loade模式一样。需注意的是，**此模式刷机必须勾选Loader 分区。**

<img src={require('./images/07-firmwareflashing-04.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  或者可以直接通过“升级固件”去烧写update.img。

<img src={require('./images/07-firmwareflashing-05.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

**注意：烧录时，如果识别不到设备，请先检查烧录接口是否接错，烧录接口要接J2 USB device（固件下载）接口。**

### 2.5 选择固件

  固件有两中格式，一种是将所有固件打包成为一个update.img文件，另外一种是一个个单独的文件，如uboot.img，boot.img，rootfs.img等文件。

使用打包好的固件update.img的好处是烧录方便，但是由于要将所有部分统一烧录，烧录时间会久一点。使用一个个单独文件烧录的好处是烧录速度快，可以单独只烧录需要修改的部分，缺点是操作会麻烦些。下面分开介绍：

#### 1）update.img烧写

<img src={require('./images/update.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

#### 2）全部分开烧写

  第一次烧写需要选择全部固件，如下图所示。点击分区最后一列的空白处，在弹出的窗口中选择对应分区文件的路径；

<img src={require('./images/allup.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

#### 3）单独烧写

  单独烧写某个镜像，如单独烧写内核所在的boot.img，如下

<img src={require('./images/oneup.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

> **注：单独烧写某个img固件时，需要导入parameter.txt分区文件，否则无法分配烧写地址。**

## 3. 工具使用技巧

  如果烧录配置修改好了，想在下次启动时使用相同的配置，可以右键点击分区配置区域任意位置，在弹出的菜单中选“导出配置”，这时会提示选择保存文件的路径及文件名。只要覆盖当前文件夹下的config.cfg文件，重新启动瑞芯微开发工具AndroidTool时就会自动加载这个配置文件。

<img src={require('./images/07-firmwareflashing-06.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>


  如果上一步保存了多个配置，可以在使用中随时导入，而不必重新启动工具。方法是右键点击分区配置区域任意位置，在弹出的菜单中选择“导入配置”，如下图所示。

<img src={require('./images/07-firmwareflashing-07.png').default} alt="导入烧写配置" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>
