---
sidebar_position: 3
---

# SDK 开发指南

:::tip 提示

本文档主要介绍在RK3506平台进行 u-boot、kernel 和 buildroot单独编译与配置。以下操作皆在ubuntu执行。


:::

## 1. u-boot使用

### 1.1 配置u-boot

u-boot是一个引导加载程序，用于初始化硬件并引导操作系统。一般并不需要修改，RK对于原生的u-boot有了完善的支持，例如初始化硬件，uboot会使用kernel的设备树来初始化。

如果需要修改u-boot，往往是修改相应处理器的uboot配置文件、设备树。例如rk3506处理器，配置文件是 `u-boot/configs/rk3506\_defconfig`，设备树在 u-boot/arch/arm/dts/目录里。

uboot配置文件可以在板级配置文件里查看需要修改那个文件。

进入 SDK/u-boot/ 目录下，执行以下指令，打开配置界面，

```bash
make rk3506_defconfig
make menuconfig
```

运行成功后如下：

<img src={require('./images/04-sdkdevelopmentguide-01.png').default} alt="image.png" className="doc-image--80" />

如果执行了修改，需要进行保存`Save` 然后 退出`Exit`。仅仅这样操作并不会修改 `rk3506_defconfig`，需要进行以下操作：

```bash
make savedefconfig
cp defconfig configs/rk3506_defconfig
```

### 1.2 u-boot设备树修改

如果需要修改设备树，在 SDK/u-boot/arch/arm/dts/ 目录下，找到相应的设备树文件进行修改，rk3506的设备树文件包含关系如下：

```bash
rk3506-evb.dts
rk3506.dtsi
rk3506-pinctrl.dtsi
rk3506-u-boot.dtsi
```

### 1.3 u-boot编译

进入SDK 源码根目录，执行以下指令，编译uboot：

```bash
./build.sh uboot
```

## 2. Kernel使用

### 2.1 配置kernel

在kernel阶段，常常需要增减驱动、设备树节点，来适配板载硬件功能。kernel源码在 SDK/kernel-6.1/ 目录下。

<img src={require('./images/04-sdkdevelopmentguide-02.png').default} alt="image.png" className="doc-image--80" />

### 2.2 修改内核配置

内核对应配置在`rk3506_linux6.1_sdk_v1.2.0/kernel6.1/arch/arm/configs/`目录，此目录存放内核配置。请进入以下目录，根据以下内容匹配不同的开发板。

| 版本                  | 内核配置                                       |
| --------------------- | ---------------------------------------------- |
| RK3506G-EVB-NAND      | vanxoak\_hd\_rk3506g\_evb\_nand\_defconfig     |
| RK3506G-EVB-SD        | vanxoak\_hd\_rk3506g\_evb\_sd\_defconfig       |

如果想对内核源码进行配置，例如把某个驱动编译进内核或者编译成模块，进入kernel源码目录，执行以下指令，打开内核的配置界面：

```bash
make ARCH=arm menuconfig
```

执行后，会进入内核配置界面，如下：

如果修改了内核配置信息，除了保存退出，还需要执行以下操作，否则编译时会复原为修改前的配置。

```bash
make ARCH=arm savedefconfig
cp defconfig arch/arm64/configs/vanxoak_hd_rk3506g_evb_nand_defconfig
```

### 2.3 内核设备树修改

内核设备树文件在`rk3506_linux6.1_sdk_v1.2.0/kernel-6.1/arch/arm/boot/dts/`目录，此目录存放内核设备树文件。请进入以下目录，根据以下内容匹配不同的开发板。

| 版本                  | 内核设备树                         |
| --------------------- | ---------------------------------- |
| RK3506G-EVB-NAND      | vanxoak-hd-rk3506g-evb-nand-v1.dts |
| RK3506G-EVB-SD        | vanxoak-hd-rk3506g-evb-sd-v1.dts   |

例如HD-RK3506-EVB评估版设备树文件是`vanxoak-hd-rk3506g-evb-nand-v1.dts`，存放在`rk3506_linux6.1_sdk_v1.2.0/kernel-6.1/arch/arm/boot/dts/`目录下，`vanxoak-hd-rk3506g-evb-nand-v1.dts`包含多个dtsi文件，其包含关系如下：

```bash
vanxoak-hd-rk3506g-evb-nand-v1.dts
  vanxoak-hd-rk3506-evb-v1.dtsi
  vanxoak-hd-rk3506-evb-mipi-1024x600.dtsi
  vanxoak-hd-rk3506-evb-rgb-800x480.dtsi
  vanxoak-hd-rk3506-evb-rgb-1024x600.dtsi
  rk3506.dtsi
    rk3502.dtsi
```

### 2.4 编译内核

进入SDK 源码根目录，执行以下指令，编译Kernel

```bash
./build.sh kernel
```

## 3. buildroot 文件系统使用

### 3.1 配置buildroot

Buildroot 是一个开源工具，用于快速生成嵌入式 Linux 系统的根文件系统、内核和引导加载程序。RK的SDK里还有Yocto构建工具，默认是使用 Buildroot ，这里使用的也是 Buildroot。

Buildroot 的源码存放在 SDK/buildroot/ 目录底下。

<img src={require('./images/04-sdkdevelopmentguide-03.png').default} alt="image.png" className="doc-image--80" />

Buildroot 的目录结构如下所示：

```bash
cxw@vanxoak:/work/rk3506_linux6.1_sdk_v1.2.0_iot_evb/buildroot$ tree -L 1
.
├── arch                       #存放与特定架构相关的代码和配置文件，例如不同处理器架构的支持。
├── archives
├── board                      #包含特定硬件平台的支持文件和配置，用于定义特定板卡的构建过程和设置。
├── boot                       #包含与引导相关的文件和脚本，处理引导加载程序的构建和配置。
├── CHANGES
├── Config.in                  #配置文件，定义了可供选择的配置选项，并指定其依赖关系，通常用于配置菜单。
├── Config.in.legacy
├── configs                    #包含预定义的配置文件（.config），适用于特定硬件或项目，可以通过这些文件快速开始构建。
├── COPYING
├── DEVELOPERS
├── dl                         #下载目录，存放在构建过程中下载的软件包和源代码。
├── docs                       #包含文档和说明，帮助理解和使用 Buildroot。
├── envsetup.sh -> scripts/envsetup.sh
├── fs                         #存放与文件系统相关的代码和配置。
├── linux                      #包含内核相关的配置和文件，支持构建 Linux 内核。
├── Makefile                   #主要的构建文件，定义了如何构建整个项目，包含构建流程的规则和目标。
├── Makefile.legacy
├── output                     #存放最终构建结果，包括生成的根文件系统和其他产物的目录。
├── package                    #包含所有可用软件包的定义和构建信息，允许选择和集成不同的软件包。
├── README
├── README.rockchip
├── scripts                    #构建脚本等
├── support                    #包含用于支持构建的工具和脚本，可能包括调试工具和测试脚本。
├── system                     #与系统级配置和服务相关的文件和设置。
├── toolchain                  #存放与工具链相关的文件和配置，包括交叉编译器的设置。
└── utils                      #实用工具和辅助脚本，用于支持构建过程或提供其他功能。
```

进入 SDK 源码的 Buildroot 目录，执行以下操作选择与开发板对应的 Buildroot 配置。

```bash
source envsetup.sh
```

例如选择，HD-RK3506-EVB评估底板，选择6。

```bash
cxw@vanxoak:/work/prj/rk3506_linux6.1_sdk_v1.2.0_iot_evb/buildroot$ source envsetup.sh

############### Rockchip Buildroot SDK ###############

Pick a board:

1. rockchip_build_autotest
2. rockchip_hd_rk3506b_iot_emmc
3. rockchip_hd_rk3506b_iot_emmc_qt
4. rockchip_hd_rk3506b_iot_nand
5. rockchip_hd_rk3506b_iot_qt_back
6. rockchip_hd_rk3506g_evb_nand
7. rockchip_hd_rk3506g_evb_sd
8. rockchip_hd_rk3506g_iot_nand
................................
96. rockchip_rv1126_rv1109_recovery
Which would you like? [1]: 6
make: 进入目录“/work/prj/rk3506/rk3506_iot_origin/iot-qt-config-sdk/rk3506_linux6.1_sdk_v1.2.0_iot_evb/buildroot”
  GEN     /work/prj/rk3506/rk3506_iot_origin/iot-qt-config-sdk/rk3506_linux6.1_sdk_v1.2.0_iot_evb/buildroot/output/rockchip_hd_rk3506g_evb_nand/Makefile
Parsing defconfig: /work/prj/rk3506/rk3506_iot_origin/iot-qt-config-sdk/rk3506_linux6.1_sdk_v1.2.0_iot_evb/buildroot/configs/rockchip_hd_rk3506g_evb_nand_defconfig
Using /work/prj/rk3506/rk3506_iot_origin/iot-qt-config-sdk/rk3506_linux6.1_sdk_v1.2.0_iot_evb/buildroot/configs/rockchip_hd_rk3506g_evb_nand_defconfig as base
#
# merged configuration written to /work/prj/rk3506/rk3506_iot_origin/iot-qt-config-sdk/rk3506_linux6.1_sdk_v1.2.0_iot_evb/buildroot/output/rockchip_hd_rk3506g_evb_nand/.config.in (needs make)
#
#
# configuration written to /work/prj/rk3506/rk3506_iot_origin/iot-qt-config-sdk/rk3506_linux6.1_sdk_v1.2.0_iot_evb/buildroot/output/rockchip_hd_rk3506g_evb_nand/.config
#
make: 离开目录“/work/prj/rk3506/rk3506_iot_origin/iot-qt-config-sdk/rk3506_linux6.1_sdk_v1.2.0_iot_evb/buildroot”
```

进入buildroot源码路径，执行以下指令：

```bash
make menuconfig
```

执行后，会进入buildroot配置界面，如下：

<img src={require('./images/04-sdkdevelopmentguide-04.png').default} alt="image.png" className="doc-image--80" />

可以在配置界面，选上一些需要的package等，配置完成后，选择保存`Save`，然后退出`Exit`。

执行以下指令即可保存：

```bash
make savedefconfig
```

如果编译后，配置未生效，需要手动替换buildroot相关配置，进入buildroot根目录。

```bash
cp .config configs/rockchip_hd_rk3506g_evb_nand_defconfig
```

buildroot配置文件在`rk3506_linux6.1_sdk_v1.2.0/buildroot/configs/`目录，此目录存放buildroot系统相关配置。

不同的开发板对应的板级配置如下：

| 版本                  | 内核设备树                                      |
| --------------------- | ----------------------------------------------- |
| RK3506G-EVB-NAND      | rockchip\_hd\_rk3506g\_evb\_nand\_defconfig     |
| RK3506G-EVB-SD        | rockchip\_hd\_rk3506g\_evb\_sd\_defconfig       |

### 3.2 编译buildroot

进入SDK 源码根目录，执行以下指令，编译buildroot：

```bash
./build.sh buildroot
```
