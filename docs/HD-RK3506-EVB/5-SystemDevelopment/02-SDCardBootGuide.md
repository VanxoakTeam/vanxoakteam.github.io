---
sidebar_position: 2
---

# RK3506 SD卡启动指南

:::tip 提示

本指南将指导您如何通过 SD 卡启动系统。


:::

## 1. 概述

  RK3506 平台支持 从 SD 卡直接启动系统，无需依赖 eMMC、NAND Flash 等外部存储介质。通过瑞芯微官方提供的 瑞芯微创建升级磁盘工具，结合编译生成的 `update.img` 固件文件，可方便地制作一张可引导的 SD 启动卡。

## 2. 准备事项

  在制作SD启动卡前，请确认以下准备工作：

### 2.1 准备支持SD卡启动的update.img固件

  用户可通过《资料下载章节》软件开发资料/系统固件中直接获取update.img。也可以通过SDK进行编译。

  RK3506 SDK中提供了`HD-RK3506-EVB`从SD卡启动的配置，请查看《SDK编译》章节，根据文档进行操作。

  板级配置选择`rockchip_rk3506_evb_sd_defconfig`

```shell
vanxaoxk@vanxaoxk:/work/rk3506_linux6.1_v1.2.0$ ./build.sh lunch            # 选择板级配置

############### Rockchip Linux SDK ###############

Manifest: rk3506_linux6.1_release_v1.2.0_20250310.xml

Log colors: message notice warning error fatal

Log saved at /work/prj/rk3506/rk3506_linux6.1_sdk_v1.2.0/output/sessions/2026-04-14_10-56-40
Pick a defconfig:

1. rockchip_rk3506_b_iot_emmc_defconfig
2. rockchip_rk3506_b_iot_emmc_qt_defconfig
3. rockchip_rk3506_b_iot_nand_defconfig
4. rockchip_rk3506_g_evb_nand_defconfig
5. rockchip_rk3506_g_evb_sd_defconfig
6. rockchip_rk3506_g_iot_nand_defconfig
Which would you like? [1]:5
```

  完整编译一次

```shell
./build.sh 
```

  编译通过后，查看`rk3506_linux6.1_v1.2.0/rockdev`文件夹，得到最终的`update.img`。我们需要使用这个固件，来进行启动卡的制作。

### 2.2 获取瑞芯微创建升级磁盘工具

  可直接进入SDK中的`rk3506_linux6.1_v1.2.0/tools/windows`目录，工具名称为`SDDiskTool_v1.78.zip`。也可通过`《资料下载章节》/软件开发资料/开发工具/开发工具软件`下载，工具名称为`SDDiskTool_v1.78.zip`。

  解压zip压缩包。

<img src={require('./images/02-sdcardbootguide-01.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  进入`SDDiskTool_v1.78`文件夹目录。

<img src={require('./images/02-sdcardbootguide-04.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

### 2.3 准备SD卡

-   **SD卡容量大于等于8G**
-   通过USB读卡器连接到PC

### 2.4 宿主机环境

-   一台Windows PC

## 3. 制作SD启动卡步骤

### 3.1 擦除EMMC 或 NAND内容

  **使用镊子短接Recovery**，使用USB-C数据线，将电脑和开发板 USB Device进行连接。待电脑上位机RKDevTool软件检测到设备，显示"发现一个LOADER设备"后，断开镊子。

<img src={require('./images/02-sdcardbootguide-05.png').default} alt="RECOVER 示意图" style={{display: 'block', margin: '20px auto', maxWidth: '50%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  硬件进入Loader模式操作

<img src={require('./images/02-sdcardbootguide-06.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  点击高级功能，擦除所有，擦除EMMC或NAND FLASH中的所有内容，确保启动是从SD卡启动，排除其他干扰。

<img src={require('./images/02-sdcardbootguide-07.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  瑞芯微开发工具-高级功能

  出现擦除成功LOG时，说明擦除成功，可进行下一步操作。

<img src={require('./images/02-sdcardbootguide-08.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  瑞芯微开发工具-擦除所有

### 3.2 打开瑞芯微创建升级磁盘工具制作SD启动卡

  **使用管理员权限打开**`SD_Firmware_Tool.exe`工具。

<img src={require('./images/02-sdcardbootguide-09.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  使用USB读卡器连接SD卡连接到PC中，该工具会识别到可移动磁盘设备，选择功能模式为SD启动，选择系统固件`update.img`，这里是直接从资料下载中获取的SD卡固件。

<img src={require('./images/02-sdcardbootguide-10.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  选择功能模式：

  点击开始创建，确保SD卡中没有重要内容，制作SD启动卡的过程中，将会格式化SD卡分区，点击是。

<img src={require('./images/02-sdcardbootguide-11.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  格式化sd卡，等待制作完成。

<img src={require('./images/02-sdcardbootguide-02.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  制作sd启动卡，制作成功后，将会弹窗提醒。

<img src={require('./images/02-sdcardbootguide-03.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  制作sd启动卡成功

### 3.3 验证SD启动卡

  在`HD-RK3506-EVM`上插入SD卡，上电。

  `Bootdev(atags)：mmc 0`表示从SD启动卡启动，说明SD启动卡制作成功。

```shell
DM: v2
mmc@ff480000: 0
GUID Partition Table Entry Array CRC is wrong: 0xd6aa0e5d != 0xab54d286
Repair the backup gpt table OK!
Bootdev(atags): mmc 0
MMC0: Legacy, 52Mhz
PartType: EFI
boot mode: None
Failed to load DTB, ret=-19
No valid DTB, ret=-22
Failed to get kernel dtb, ret=-22
Model: Rockchip RK3506 EVB Board
rockchip_set_serialno: could not find efuse/otp device
CLK: (arm clk use pvtpll, rate = 1200M)
  gpll 1500000 KHz
  v0pll 1179648 KHz
  v1pll 903168 KHz
  clk_gpll_div 187500 KHz
  clk_gpll_div_100m 93750 KHz
  clk_v0pll_div 147456 KHz
  clk_v1pll_div 129024 KHz
  aclk_bus_root 187500 KHz
  hclk_bus_root 147456 KHz
  pclk_bus_root 93750 KHz
  aclk_hsperi_root 147456 KHz
  hclk_ksperi_root 93750 KHz
Net:   No ethernet found.
Hit key to stop autoboot('CTRL+C'):  0

```

  查看系统磁盘大小。可以看到系统文件系统空间变大，说明SD启动卡成功启动。

```shell
root@rk3506-buildroot:/# df -h
Filesystem                Size      Used Available Use% Mounted on
/dev/root                 5.7G    124.9M      5.4G   2% /
devtmpfs                 48.7M         0     48.7M   0% /dev
tmpfs                    48.8M     84.0K     48.7M   0% /var/log
tmpfs                    48.8M     12.0K     48.8M   0% /tmp
tmpfs                    48.8M    140.0K     48.7M   0% /run
tmpfs                    48.8M         0     48.8M   0% /dev/shm
/dev/mmcblk0p7           23.3G    300.0K     23.3G   0% /userdata
/dev/mmcblk0p6          123.2M      4.3M    118.1M   3% /oem
/dev/mmcblk0p5            5.7G    124.9M      5.4G   2% /mnt/sdcard
/dev/mmcblk0p6          123.2M      4.3M    118.1M   3% /media/sdcard1
/dev/mmcblk0p7           23.3G    300.0K     23.3G   0% /media/sdcard2

```