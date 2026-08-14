---
sidebar_position: 1
---

# SDK 源码获取

本文介绍 HD-RK3506-EVB Linux 6.1 SDK 的获取、完整性校验和解压方法。SDK 包含 U-Boot、Linux 内核、Buildroot、板级配置、应用示例、交叉编译工具及固件打包脚本，可用于系统构建、驱动开发、应用开发和产品定制。

:::tip 下载建议

- 初次使用或希望直接编译固件时，建议下载**完整 SDK 源码包**。
- 需要基于基础源码自行维护板级改动时，可选择**基础 SDK + HD-RK3506-EVB 配套包**。
- SDK 压缩包体积较大，建议使用支持断点续传的工具下载，并在解压前核对 MD5。
- 建议开发主机至少预留 **100 GB** 可用空间。

:::

## 1. 获取方式

| 获取方式 | 适用场景 | 特点 |
| --- | --- | --- |
| Ubuntu 虚拟机镜像 | 初次接触 RK3506、希望快速体验 | 已预置开发环境和 SDK，减少环境配置工作 |
| 完整 SDK 源码包 | 常规开发、固件编译、驱动和应用开发 | 内容完整，下载后即可进入编译流程，推荐大多数开发者使用 |
| 基础 SDK + 配套包 | SDK 深度定制、版本管理、选择性合入板级修改 | 组件拆分清晰，便于维护基础源码与 HD-RK3506-EVB 定制内容 |

全部 SDK 资源可以在 [HD-RK3506-EVB SDK 下载目录](https://download.vanxoak.com/products/hd-rk3506-evb/sdk/) 中浏览。

### 1.1 Ubuntu 虚拟机镜像

该方式适合希望快速开始编译、暂时不需要自行搭建 Ubuntu 开发环境的用户。

- 开发环境已预先配置；
- SDK 源码目录为 `/mnt/rk3506-sdk`；
- 导入 VMware 后即可按照后续章节进行编译。

[下载万象奥科 Ubuntu 虚拟机镜像](https://pan.baidu.com/s/1VhPGsQMbhB6NorsQsMgFmA?pwd=wxak)（提取码：`wxak`）

### 1.2 完整 SDK 源码包（推荐）

完整包已经包含基础 SDK 及 HD-RK3506-EVB 开发所需的配套内容，适合直接构建 NAND 或 SD 卡启动固件。

| 项目 | 内容 |
| --- | --- |
| 文件名 | `rk3506_linux6.1_sdk_v1.2.0_evb_all_20260722.tar.gz` |
| SDK 版本 | v1.2.0 |
| 发布日期 | 2026-07-22 |
| 文件大小 | 约 9.6 GiB |
| MD5 | `cef0bf4e551382278a390038848cdb51` |

[下载完整 SDK 源码包](https://download.vanxoak.com/files/products/hd-rk3506-evb/sdk/all/rk3506_linux6.1_sdk_v1.2.0_evb_all_20260722.tar.gz)

也可以在 Ubuntu 开发主机中使用 `wget` 断点续传：

```bash
mkdir -p ~/rk3506-downloads ~/rk3506-work
cd ~/rk3506-downloads

wget -c \
  -O rk3506_linux6.1_sdk_v1.2.0_evb_all_20260722.tar.gz \
  'https://download.vanxoak.com/files/products/hd-rk3506-evb/sdk/all/rk3506_linux6.1_sdk_v1.2.0_evb_all_20260722.tar.gz'
```

下载完成后校验文件：

```bash
cd ~/rk3506-downloads

echo 'cef0bf4e551382278a390038848cdb51  rk3506_linux6.1_sdk_v1.2.0_evb_all_20260722.tar.gz' \
  | md5sum -c -
```

出现以下提示表示文件完整：

```text
rk3506_linux6.1_sdk_v1.2.0_evb_all_20260722.tar.gz: OK
```

解压并进入 SDK 根目录：

```bash
tar -xzf ~/rk3506-downloads/rk3506_linux6.1_sdk_v1.2.0_evb_all_20260722.tar.gz \
  -C ~/rk3506-work

cd ~/rk3506-work/rk3506_linux6.1_sdk_v1.2.0_evb
```

### 1.3 基础 SDK 与 HD-RK3506-EVB 配套包

该方式将通用基础 SDK、HD-RK3506-EVB 板级定制内容和 Buildroot 离线缓存分开提供，适合需要独立管理各部分版本的开发者。

#### 1.3.1 下载文件

| 文件 | 用途 | 大小 | MD5 |
| --- | --- | ---: | --- |
| [基础 SDK 源码包](https://download.vanxoak.com/files/products/hd-rk3506-evb/sdk/base/rk3506_linux6.1_sdk_v1.2.0_evb_base_20260722.tar.gz) | RK3506 Linux 6.1 v1.2.0 基础源码 | 约 8.8 GiB | `4aab0364dcd387f16604fede3706b473` |
| [HD-RK3506-EVB 配套包](https://download.vanxoak.com/files/products/hd-rk3506-evb/sdk/base/hd-rk3506-evb-extern-package-20260722.tar.gz) | 板级配置、设备树、内核配置及相关定制内容 | 约 35 MiB | `2a1b1ae4462b4a4f32cebbede7b0b582` |
| [Buildroot dl 离线软件包](https://download.vanxoak.com/files/products/hd-rk3506-evb/sdk/dl/dl.tar.gz) | Buildroot 构建所需的源码下载缓存，网络受限时建议使用 | 约 720 MiB | `870ebc6f32cd838be9db4d2afacd5f68` |

其中，基础 SDK 和 HD-RK3506-EVB 配套包为必需项；`dl.tar.gz` 为可选项，但在无法稳定访问外部源码站点时建议一并下载。

#### 1.3.2 校验文件

将下载的文件放入 `~/rk3506-downloads`，执行：

```bash
cd ~/rk3506-downloads

echo '4aab0364dcd387f16604fede3706b473  rk3506_linux6.1_sdk_v1.2.0_evb_base_20260722.tar.gz' | md5sum -c -
echo '2a1b1ae4462b4a4f32cebbede7b0b582  hd-rk3506-evb-extern-package-20260722.tar.gz' | md5sum -c -
echo '870ebc6f32cd838be9db4d2afacd5f68  dl.tar.gz' | md5sum -c -
```

如果某个文件未显示 `OK`，请删除该文件并重新下载，不要继续解压或编译。

#### 1.3.3 解压基础 SDK

```bash
mkdir -p ~/rk3506-work

tar -xzf ~/rk3506-downloads/rk3506_linux6.1_sdk_v1.2.0_evb_base_20260722.tar.gz \
  -C ~/rk3506-work
```

解压后的 SDK 根目录为：

```text
~/rk3506-work/rk3506_linux6.1_sdk_v1.2.0_evb/
```

#### 1.3.4 合入 HD-RK3506-EVB 配套包

先将配套包解压到工作目录：

```bash
tar -xzf ~/rk3506-downloads/hd-rk3506-evb-extern-package-20260722.tar.gz \
  -C ~/rk3506-work
```

配套包解压后生成 `hd-rk3506-evb/` 目录。确认路径无误后，将其中的板级文件合入 SDK：

```bash
cp -a ~/rk3506-work/hd-rk3506-evb/. \
  ~/rk3506-work/rk3506_linux6.1_sdk_v1.2.0_evb/
```

:::warning 注意

合入操作会覆盖 SDK 中的同名文件。请确保基础 SDK 与配套包的发布日期和适用版本一致；如果是在已有修改的 SDK 上操作，请先提交 Git 变更或创建备份。

:::

#### 1.3.5 安装 Buildroot 离线软件包（可选）

`dl.tar.gz` 内部包含一个 `dl/` 目录，应解压到 SDK 根目录：

```bash
tar -xzf ~/rk3506-downloads/dl.tar.gz \
  -C ~/rk3506-work/rk3506_linux6.1_sdk_v1.2.0_evb
```

完成后的路径应为：

```text
~/rk3506-work/rk3506_linux6.1_sdk_v1.2.0_evb/dl/
```

## 2. SDK 完整性与版本确认

进入 SDK 根目录后，建议先确认关键目录及构建脚本是否存在：

```bash
cd ~/rk3506-work/rk3506_linux6.1_sdk_v1.2.0_evb

test -x build.sh
test -d buildroot
test -d device/rockchip
test -d kernel-6.1
test -d u-boot
```

以上命令均无报错时，说明 SDK 的基础目录结构完整。使用“基础 SDK + 配套包”方式时，还可以检查 HD-RK3506-EVB 板级配置：

```bash
find device/rockchip -type f \
  \( -name '*rk3506*evb*nand*' -o -name '*rk3506*evb*sd*' \) \
  | sort
```

## 3. SDK 工程目录说明

不同版本的 SDK 目录可能略有差异，常见目录和文件如下：

```text
.
├── app                  # 上层应用及示例程序
├── buildroot            # Buildroot 根文件系统构建工程
├── build.sh             # SDK 统一构建入口
├── common               # Rockchip 通用构建脚本和配置
├── device               # 芯片及板级配置、参数和固件打包脚本
├── dl                   # Buildroot 下载缓存（安装离线包后存在）
├── docs                 # 平台开发指南及模块说明文档
├── external             # 音视频、网络、Recovery 等外部组件
├── hal                  # RK3506 HAL 层源码
├── kernel -> kernel-6.1
├── kernel-6.1           # Linux 6.1 内核源码
├── Makefile             # SDK 顶层 Makefile
├── output               # 编译输出目录
├── prebuilts            # 预编译工具及交叉编译工具链
├── README.md            # SDK 使用说明
├── rkbin                # Rockchip 二进制文件及打包配置
├── rkflash.sh           # 固件烧写辅助脚本
├── rockdev -> output/firmware
├── rtos                 # RTOS 相关源码
├── tools                # Linux 和 Windows 辅助工具
├── u-boot               # U-Boot 源码
└── yocto                # Yocto 构建相关内容
```

完成 SDK 获取和校验后，可以继续进行开发环境配置及固件编译。
