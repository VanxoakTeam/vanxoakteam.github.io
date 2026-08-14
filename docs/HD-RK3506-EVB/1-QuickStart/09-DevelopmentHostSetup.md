---
sidebar_position: 9
---

# 开发主机环境搭建

:::tip 提示

本节详细介绍如何在Windows系统上利用VMware安装一台Ubuntu系统（以Ubuntu 22为例展示）的虚拟机（安装VMware虚拟机、为虚拟机安装Ubuntu系统、更新软件源、安装工具包软件包、设置共享文件夹，中文设置等）。


:::

## 1. 下载Ubuntu镜像文件

1- 进入镜像网站：[Ubuntu 22.04 下载地址](https://www.linuxvmimages.com/images/ubuntu-2204/#google_vignette)下翻网页至如图所示的部分，点击图中所示位置下载Ubuntu22.04。

<img src={require('./images/001.png').default} alt="企业微信截图_17763276372155.png" className="doc-image--80" />

2- 点击下载后，会进入如图所示的界面，等待倒计时结束自动下载。

<img src={require('./images/002.png').default} alt="企业微信截图_17763323532819.png" className="doc-image--80" />

## 2. 安装VMware

什么是VMware Workstation：VMware Workstation是一款由VMware公司开发的桌面虚拟化软件，允许用户在单一的物理计算机上同时运行多个操作系统。它提供了一种安全、封闭的环境来测试、开发、演示和部署软件。

**配套版本下载**：[VMware Workstation Pro 17.6.1](https://download.vanxoak.com/files/common/tools/VMware-workstation-full-17.6.1.zip)。下载完成后解压安装包，并以管理员身份运行安装程序。

1- 双击安装，点击下一步

<img src={require('./images/01-developmenthostsetup-23.png').default} alt="企业微信截图_17764071365181.png" className="doc-image--80" />

2- 勾选接受协议后，点击下一步

<img src={require('./images/01-developmenthostsetup-34.png').default} alt="企业微信截图_17763888617852.png" className="doc-image--80" />

3- 选择安装位置，勾选添加到系统PATH，点击下一步

<img src={require('./images/01-developmenthostsetup-43.png').default} alt="企业微信截图_17763889683240.png" className="doc-image--80" />

4- 点击下一步

<img src={require('./images/01-developmenthostsetup-44.png').default} alt="企业微信截图_17763890517321.png" className="doc-image--80" />

5- 点击下一步

<img src={require('./images/01-developmenthostsetup-45.png').default} alt="企业微信截图_17763891552444.png" className="doc-image--80" />

6- 点击安装，点击完成，就完成安装了

## 3. 运行ubuntu系统

1- 下载完成后，有一个名为 `Ubuntu_22.04_VM.7z` 的文件，解压后获得如图两个文件

<img src={require('./images/003.png').default} alt="image.png" className="doc-image--80" />

2- 打开已安装好的 VMware 虚拟机，点击左上角 ”文件“ → ”打开“ 。

<img src={require('./images/004.png').default} alt="企业微信截图_17763901335086.png" className="doc-image--80" />

3- 找到之前解压的 ubuntu 系统文件，选择 .vmx 文件，然后打开。

<img src={require('./images/005.png').default} alt="企业微信截图_17763901335000.png" className="doc-image--80" />

4- 根据电脑性能来调节内存和处理器，如果电脑性能不高，使用默认的即可。

<img src={require('./images/006.png').default} alt="企业微信截图_17763903688246.png" className="doc-image--80" />

5- 设置完成后，点击开启此虚拟机，启动ubuntu。

<img src={require('./images/007.png').default} alt="企业微信截图_17763903688246.png" className="doc-image--80" />

6- 点击开启虚拟机后会弹出以下信息，选择我已复制该虚拟机，等待系统启动。

<img src={require('./images/008.png').default} alt="企业微信截图_17763903688246.png" className="doc-image--80" />

7- 启动完成后，按回车(Enter)键，输入密码 ，**密码默认：`ubuntu`**；按回车键进入系统。

<img src={require('./images/009.png').default} alt="企业微信截图_17763903688246.png" className="doc-image--80" />

8- 显示如图界面，ubuntu系统启动完成。

<img src={require('./images/010.png').default} alt="企业微信截图_17763903688246.png" className="doc-image--80" />

## 4. 配置系统环境

### 4.1 更新软件源

1- 进入ubuntu系统后，首先需要换源，原本的软件源是国外的，我们需要换成国内，否则很多依赖无法下载。

<img src={require('./images/011.png').default} alt="企业微信截图_17763903688246.png" className="doc-image--80" />

2- 选择 “Ubuntu Software” ，点击箭头②标注位置，选择 “Other...”

<img src={require('./images/012.png').default} alt="企业微信截图_17763903688246.png" className="doc-image--80" />

3- 如图顺序选择，“China” → “阿里源”（也可自行选择其他源）。确认选择之后，需要输入密码，**密码默认：`ubuntu`**。

<img src={require('./images/013.png').default} alt="企业微信截图_17763903688246.png" className="doc-image--80" />

4- 显示阿里源，点击 “Close” 关闭。

<img src={require('./images/014.png').default} alt="企业微信截图_17763903688246.png" className="doc-image--80" />

5- 最后会跳出如图所示界面，点击 “Reload” 重新加载，等待刷新完成即可。

<img src={require('./images/015.png').default} alt="企业微信截图_17763903688246.png" className="doc-image--80" />

### 4.2 复制粘贴主机内容

当前下载的ubuntu镜像文件，无法复制粘贴主机内容，执行以下命令，等待重启后，即可复制粘贴主机内容。

```shell
sudo apt update
sudo apt install open-vm-tools open-vm-tools-desktop -y
sudo reboot
```

### 4.3 安装基础的工具包和软件包

1- 打开终端：桌面右击，点击 Open in Terminal 打开终端

<img src={require('./images/016.png').default} alt="企业微信截图_17764078991673.png" className="doc-image--80" />

2- 在终端执行如下命令，安装常用工具包和软件包

```shell
# 更新软件包列表，获取最新的软件包信息
sudo apt update -y

# 升级已安装的所有软件包到最新版本
sudo apt upgrade -y

# 安装build-essential，包含了编译软件所需的基本工具，如gcc、g++和make等
sudo apt install build-essential -y

# 安装git版本控制系统，用于代码管理和版本控制
sudo apt install git -y

# 安装网络工具包：
# net-tools：包含ifconfig、netstat等常用网络命令
# curl：用于发送HTTP请求的命令行工具
# wget：用于从网络下载文件的工具
sudo apt install net-tools curl wget -y

# 安装SSH服务器，允许远程安全连接到此服务器
sudo apt install openssh-server -y

#安装vim文本编辑工具
sudo apt install vim -y
```

## 5.配置交叉编译链

首先将交叉编译工具链 [arm-buildroot-linux-gnueabihf_sdk-buildroot-20260326.tar.gz](https://download.vanxoak.com/files/products/hd-rk3506-evb/cross-compilation-tools/arm-buildroot-linux-gnueabihf_sdk-buildroot-20260326.tar.gz) 下载到 Ubuntu 虚拟机的用户目录，然后执行以下命令解压：

```shell
#解压到用户目录下：
tar -xvzf arm-buildroot-linux-gnueabihf_sdk-buildroot-20260326.tar.gz -C ~/
```

解压完成后，执行以下命令更新交叉编译工具链路径，确保所有工具和库文件指向当前解压路径：

```shell
~/arm-buildroot-linux-gnueabihf_sdk-buildroot/relocate-sdk.sh
```

> **注意：上述命令只需运行一次，在每次移动工具链目录后，都需要重新执行此命令以更新路径。**

然后可运行交叉编译工具链的环境设置脚本，用于为应用开发准备完整的交叉编译环境：

```shell
source ~/arm-buildroot-linux-gnueabihf_sdk-buildroot/environment-setup
```

查看交叉编译工具链是否能正常运行：

```shell
user@ubuntu:~$ arm-buildroot-linux-gnueabihf-gcc -v
Using built-in specs.
COLLECT_GCC=/home/kik/arm-buildroot-linux-gnueabihf_sdk-buildroot/bin/arm-buildroot-linux-gnueabihf-gcc.br_real
COLLECT_LTO_WRAPPER=/home/kik/arm-buildroot-linux-gnueabihf_sdk-buildroot/bin/../libexec/gcc/arm-buildroot-linux-gnueabihf/12.4.0/lto-wrapper
Target: arm-buildroot-linux-gnueabihf
Configured with: ./configure --prefix=/work/vanxoak/rk3506/rk3506_linux6.1_sdk/buildroot/output/rockchip_rk3506/host --sysconfdir=/work/vanxoak/rk3506/rk3506_linux6.1_sdk/buildroot/output/rockchip_rk3506/host/etc --enable-static --target=arm-buildroot-linux-gnueabihf --with-sysroot=/work/itrunk/rk3506/rk3506_linux6.1_sdk/buildroot/output/rockchip_rk3506/host/arm-buildroot-linux-gnueabihf/sysroot --enable-__cxa_atexit --with-gnu-ld --disable-libssp --disable-multilib --disable-decimal-float --enable-plugins --enable-lto --with-gmp=/work/itrunk/rk3506/rk3506_linux6.1_sdk/buildroot/output/rockchip_rk3506/host --with-mpc=/work/itrunk/rk3506/rk3506_linux6.1_sdk/buildroot/output/rockchip_rk3506/host --with-mpfr=/work/itrunk/rk3506/rk3506_linux6.1_sdk/buildroot/output/rockchip_rk3506/host --with-pkgversion='Buildroot linux-6.1-stan-rkr4.2-1-g5f8a92d2-dirty' --with-bugurl=https://gitlab.com/buildroot.org/buildroot/-/issues --without-zstd --disable-libquadmath --disable-libquadmath-support --enable-tls --enable-threads --without-isl --without-cloog --with-abi=aapcs-linux --with-cpu=cortex-a7 --with-fpu=neon-vfpv4 --with-float=hard --with-mode=arm --enable-languages=c,c++ --with-build-time-tools=/work/itrunk/rk3506/rk3506_linux6.1_sdk/buildroot/output/rockchip_rk3506/host/arm-buildroot-linux-gnueabihf/bin --enable-shared --disable-libgomp
Thread model: posix
Supported LTO compression algorithms: zlib
gcc version 12.4.0 (Buildroot linux-6.1-stan-rkr4.2-1-g5f8a92d2-dirty)
```

打印上述类似的版本信息，证明工具链已成功安装。每次打开新的 shell 终端，需重新运行交叉编译工具链的环境设置脚本。也可将该命令写入~/.bashrc 文件中，这样每次打开新的 shell 终端会自动设置交叉编译环境。



## 6. 设置共享文件夹（可选）

### 6.1 创建共享文件夹

首先在Windows系统中，创建一个文件夹来用作共享文件夹，可以根据自己的需求，找一个盘符空间相对大一点的目录创建。

这里以D:/ubuntu-share目录为例，创建一个no1的目录，用作与ubuntu共享的目录

<img src={require('./images/01-developmenthostsetup-25.png').default} alt="企业微信截图_17764130365781.png" className="doc-image--80" />

### 6.2 VMware设置

1- 虚拟机设置：

VMware控制台左侧点击需要设置共享文件夹的虚拟机，然后点击左侧的编辑虚拟机设置：

<img src={require('./images/01-developmenthostsetup-26.png').default} alt="企业微信截图_17764131426794.png" className="doc-image--80" />

2- 点击选项，点击共享文件夹，勾选总是启用，点击添加

<img src={require('./images/01-developmenthostsetup-27.png').default} alt="企业微信截图_17764133042497.png" className="doc-image--80" />

3- 添加共享文件夹目录

-   点击下一步

<img src={require('./images/01-developmenthostsetup-28.png').default} alt="企业微信截图_17764133921139.png" className="doc-image--80" />

-   设置共享文件夹路径与名称，点击下一步

<img src={require('./images/01-developmenthostsetup-29.png').default} alt="企业微信截图_17764134933032.png" className="doc-image--80" />

-   勾选启用此共享，点击完成

<img src={require('./images/01-developmenthostsetup-30.png').default} alt="企业微信截图_17764135461853.png" className="doc-image--80" />

4- 点击确定，完成共享文件夹设置

<img src={require('./images/01-developmenthostsetup-31.png').default} alt="企业微信截图_17764136253796.png" className="doc-image--80" />

### 6.3 Ubuntu设置

VMware设置完成之后，进行Ubuntu的设置。开启虚拟机，打开终端。

1- 输入以下命令，显示共享文件夹

```shell
ubuntu@ubuntu-2204:~/Desktop$ vmware-hgfsclient 
share
```

2- 创建hgfs目录

```shell
ubuntu@ubuntu-2204:~/Desktop$ cd /mnt/
ubuntu@ubuntu-2204:/mnt$ sudo mkdir /mnt/hgfs
ubuntu@ubuntu-2204:/mnt$ ls
hgfs
```

3- 挂载共享目录

```shell
sudo /usr/bin/vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other -o uid=1000 -o gid=1000 -o umask=022
```

验证是否挂载成功：

-   在Windows文件夹中，创建一个文件

<img src={require('./images/01-developmenthostsetup-32.png').default} alt="企业微信截图_17764146186100.png" className="doc-image--80" />

-   虚拟机中，在ubuntu切换进该目录，查看文件，创建成功

```shell
ubuntu@ubuntu-2204:/mnt$ cd /mnt/hgfs/share/no1/
ubuntu@ubuntu-2204:/mnt/hgfs/share/no1$ ls
1.txt
```

4- 设置开机自动挂载

输入以下命令，编辑/etc/fstab文件

```shell
sudo vim /etc/fstab
```

按 i 键进行输入，在最后面，插入挂载命令，按ESC键，: 键后输入wq进行保存

```shell
.host:/ /mnt/hgfs fuse.vmhgfs-fuse allow_other,uid=1000,gid=1000,umask=022 0 0
```

> <span style={{ color: "#ff0000" }}>⚠️注：写入该命令时，仔细核对，如若写错，系统启动会崩溃。</span>
>

<img src={require('./images/017.png').default} alt="企业微信截图_17764163113081.png" className="doc-image--80" />

5- 重启虚拟机，进入共享文件夹，查看是否挂载成功

```shell
ubuntu@ubuntu-2204:~/Desktop$ cd /mnt/hgfs/share/no1/
ubuntu@ubuntu-2204:/mnt/hgfs/share/no1$ ls
1.txt
```

## 7. 中文设置（可选）

1- 点击桌面右上角，点击Settings设置

<img src={require('./images/01-developmenthostsetup-35.png').default} alt="企业微信截图_17767347531169.png" className="doc-image--80" />

2- 下翻，点击Region & Language，点击Manage Installed Languages下载语言

<img src={require('./images/01-developmenthostsetup-36.png').default} alt="企业微信截图_1776735190836.png" className="doc-image--80" />

3- 点击Install下载，输入虚拟机用户密码后开始下载

<img src={require('./images/01-developmenthostsetup-37.png').default} alt="企业微信截图_17767352484537.png" className="doc-image--80" />

4- 下载完成后，将汉语拖至第一个，点击Apply System-Wide添加

<img src={require('./images/01-developmenthostsetup-38.png').default} alt="企业微信截图_17767355749913.png" className="doc-image--80" />

5- 点击Language打开语言选择

<img src={require('./images/01-developmenthostsetup-39.png').default} alt="企业微信截图_17767357341774.png" className="doc-image--80" />

6- 选择Chinese中文，点击Select选择

<img src={require('./images/01-developmenthostsetup-40.png').default} alt="企业微信截图_17767350486697.png" className="doc-image--80" />

7- 选择完成后，点击Restart重启会话

<img src={require('./images/01-developmenthostsetup-41.png').default} alt="企业微信截图_17767359935717.png" className="doc-image--80" />

8- 会话重启后，需要选择是否修改文件夹名称

> ⚠️注：建议保留英文名称，中文名称需要额外添加中文输入法后，才能在终端进入以下目录

<img src={require('./images/01-developmenthostsetup-42.png').default} alt="企业微信截图_17767366133232.png" className="doc-image--80" />
