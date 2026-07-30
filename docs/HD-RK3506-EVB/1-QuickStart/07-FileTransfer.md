---
sidebar_position: 7
---

# 文件传输指南

:::tip 提示

本指南针对首次使用 **HD-RK3506-EVB** 开发板的用户，详细阐述将文件从Windows传输至开发板的方式。

:::

  HD-RK3506-EVB支持双路百兆以太口，系统默认eth0采用静态IP地址配置，eth1采用动态IPv4地址获取。

  <span style={{ color: "#ff0000" }}>配置电脑静态IP与开发板同一网关：192.168.1.*；将ETH0与电脑接入同一网关，或者直接将ETH0与电脑连接。</span>

## 1. IP静态地址、用户名和密码

-   默认IP：192.168.1.10
-   用户名：root
-   密码：root

## 2. SCP拷贝

  SCP（Secure Copy Protocol）是一种用于在Linux系统中通过SSH协议安全传输文件的命令。它允许用户在本地主机和远程主机之间进行加密的文件拷贝操作，确保数据在传输过程中不被窃取或篡改。SCP命令的基本语法类似于cp命令，但SCP可以跨网络传输文件，并且所有传输的数据都会经过加密处理。

  先使用`ping 192.168.1.10`测试网络通路，如网络测试正常，可在Ubuntu的终端中输入以下命令本机电脑上的helloworld文件拷贝到开发板oem目录，使用命令如下：

```shell
user@ubuntu:~/sambashare$ scp -r helloworld root@192.168.1.10:/oem/
root@192.168.1.10's password:root
```

## 3. MobaXterm拷贝

  MobaXterm软件支持ssh和sftp功能，通过ssh连接到HD-RK3506-IOT设备后，点击“sftp传输图标”，然后在地址栏选择要上传或下载的目录，再通过上传或下载图标即可选择本地文件通过sftp传输文件。

<img src={require('./images/05-filetransfer-01.png').default} alt="304cf4bcbac61d83ed82e250b53a3a66.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

## 4. adb拷贝

  使用USB-C连接到开发板J2 USB Device接口，如果是Linux平台，就可以直接使用adb操作开发板了；如果是Windows平台，需要先安装USB设备驱动，才能使用adb。

  adb工具存放在RKDevTool.zip压缩包中，解压后可在RKDevTool\\RKDevTool\_Release\\bin下看到 adb.exe文件。

<img src={require('./images/05-filetransfer-02.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  为了更方便使用，可以将adb加入到系统环境变量中。在Windows系统下，搜索环境变量，打开编辑系统环境变量。

<img src={require('./images/05-filetransfer-03.png').default} alt="屏幕截图 2026-07-15 095456.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  设置好后，可以直接在命令提示符中使用adb命令，上传文件到开发板：

```shell
PS F:\> adb push file_name /oem
```

> file\_name为电脑当前路径下的文件，/oem为开发板文件系统上的一个文件夹。

  从开发板下载文件到电脑：

```shell
PS F:\> adb pull /oem/file_name .
```

> /oem为开发板文件系统上的一个文件夹，file\_name为电脑当前路径下的文件。