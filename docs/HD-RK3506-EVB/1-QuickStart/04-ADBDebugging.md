---
sidebar_position: 4
---

# ADB 调试连接与常用指令

:::tip 提示

本指南针对首次使用 **HD-RK3506-EVB** 开发板的用户，详细阐述ADB调试连接与常用的指令，确保系统安全、正常运行。

:::

## 1. usb连接

使用Type-C线连接USB Device端口到PC的USB口，如果是Linux平台，就可以直接使用adb操作开发板了；如果是Windows平台，需要先安装USB设备驱动，才能使用adb。

<img src={require('./images/usb.png').default} alt="USB供电烧录.png" className="doc-image--25" />

## 2. 驱动安装

下载驱动 [DriverAssitant_v5.13.zip](https://download.vanxoak.com/files/common/tools/DriverAssitant_v5.13.zip)。下载完成后解压驱动包并进入驱动包目录，双击运行 `DriverInstall.exe` 进行安装：

## 3. 解压RKDevTool

RKDevTool（[RKDevTool_Release_v3.32.zip](https://download.vanxoak.com/files/common/tools/RKDevTool_Release_v3.32.zip)）是瑞芯微提供的 Windows 开发工具，其中也包含 ADB 命令。解压后可在 `RKDevTool\\RKDevTool_Release\\bin` 目录中找到：

<img src={require('./images/04-adbdebugging-02.png').default} alt="image.png" className="doc-image--80" />

复制`adb.exe`，`AdbWinApi.dll`，`AdbWinUsbApi.dll`到PC上的`C:\WINDOWS\system32`目录以及`C:\WINDOWS\SysWOW64`目录下。

> 注1：如使用win11，则将这几个文件复制到C:\\Windows下
> 
> 注2：win10复制到system32和SysWOW64目录会提示需要管理员权限才能复制

  

驱动安装成功且RKDevTool文件解压后，可在RKDevTool\\RKDevTool\_Release目录下双击打开软件RKDevTool.exe

<img src={require('./images/04-adbdebugging-03.png').default} alt="image.png" className="doc-image--80" />

若驱动安装成功，则软件会显示发现一个ADB设备，表示可使用ADB功能

<img src={require('./images/04-adbdebugging-04.png').default} alt="image.png" className="doc-image--80" />

> 注1：如没有发现设备，可以检查USB先是否插好，或者驱动是否安装成功

## 4. adb使用示例

PC上打开cmd或者powershell，可以直接使用adb命令，以powershell为例，在win10系统上打开可以在搜索栏输入powershell，然后双击点开

<img src={require('./images/04-adbdebugging-05.png').default} alt="image.png" className="doc-image--80" />

在win11系统上打开一个文件夹，右键打开powershell：

<img src={require('./images/04-adbdebugging-06.png').default} alt="image.png" className="doc-image--80" />

-   adb登录

```shell
PS D:\01.开发> adb shell
```

<img src={require('./images/04-adbdebugging-07.png').default} alt="image.png" className="doc-image--80" />

-   adb传输

上传文件到开发板

```shell
PS D:\01.开发> adb push xxx /userdata
```

<img src={require('./images/04-adbdebugging-08.png').default} alt="image.png" className="doc-image--80" />

> 注：xxx为电脑当前路径下的文件，/userdata为开发板文件系统上的一个文件夹

从开发板下载文件到当前路径

```shell
PS D:\01.开发> adb pull /userdata/xxx .
```

<img src={require('./images/04-adbdebugging-09.png').default} alt="image.png" className="doc-image--80" />
