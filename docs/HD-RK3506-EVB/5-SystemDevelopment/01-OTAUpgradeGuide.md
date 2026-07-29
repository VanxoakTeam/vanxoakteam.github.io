---
sidebar_position: 1
---

# RK3506 OTA升级指南

  rockchip 支持两种升级方案，一种是Recovery模式升级，一种是Linux A/B模式升级。本章节仅介绍Recovery模式升级。

  RK3506 支持通过OTA（Over-the-Air）技术进行升级。通过执行OTA命令，用户可以方便的通过SD卡/U盘/网络来对固件进行升级更新。

  如果用户不需要升级整个固件，只需要升级应用程序，我们可以通过编写脚本来实现用户应用程序的升级。

  下面我们分别介绍OTA升级固件功能和升级用户应用程序功能。

> **注：自2026年1月22日起，SDK已更新，修复了NAND版本无法OTA升级的问题。RK3506所有系列，都支持OTA升级功能，不受存储类型的限制。**

  **如果开发板硬件有硬件看门狗，请短接看门狗跳线帽，禁用硬件看门狗功能后再进行如下操作。否则会OTA升级失败。**

  **可参考**`**sdk\docs\cn\Linux\Recovery**`**目录，瑞芯微官方的手册关于OTA升级的相关介绍。**

## 1. OTA升级

  HD-RK3506系列 系统包含Recovery分区，该分区由kernel+resource+ramdisk 组成，主要用于升级操作。u-boot会根据misc分区存放的字段来判断将要引导的系统是Normal系统还是Recovery 系统。基于Recovery环境与主系统相对独立的特点，即使在升级过程中遇到诸如非正常断电等中断情况，也能确保升级流程具备一定程度上的恢复能力，从而保证了系统更新的完整性。

### 1.1 UpdateEngine工具

  HD-RK3506系列 可使用UpdateEngine工具进行OTA升级。可升级除lodaer 和 parameter外的分区，以下是updateEngine的使用方法。

```shell
root@rk3506-buildroot:/# updateEngine --h
LOG_INFO: *** update_engine: V1.0.1-g<unknown> ***.
LOG_INFO: --misc=now             Linux A/B mode: Setting the current partition to bootable.
LOG_INFO: --misc=other           Linux A/B mode: Setting another partition to bootable.
LOG_INFO: --misc=update          Recovery mode: Setting the partition to be upgraded.
LOG_INFO: --misc=display         Display misc info.
LOG_INFO: --misc=wipe_userdata   Format data partition.
LOG_INFO: --misc_custom= < op >  Operation on misc for custom cmdlineLOG_INFO:         op:     read   Read custom cmdline to /tmp/custom_cmdlineLOG_INFO:                 write  Write /tmp/custom_cmdline to custom areaLOG_INFO:                 clean  clean custom areaLOG_INFO: --update               Upgrade mode.
LOG_INFO: --partition=0x3FFC00   Set the partition to be upgraded.(NOTICE: OTA not support upgrade loader and parameter)
LOG_INFO:                        0x3FFC00: 0011 1111 1111 1100 0000 0000.
LOG_INFO:                                  uboot trust boot recovery rootfs oem
LOG_INFO:                                  uboot_a uboot_b boot_a boot_b system_a system_b.
LOG_INFO:                        100000000000000000000000: Upgrade loader
LOG_INFO:                        010000000000000000000000: Upgrade parameter
LOG_INFO:                        001000000000000000000000: Upgrade uboot
LOG_INFO:                        000100000000000000000000: Upgrade trust
LOG_INFO:                        000010000000000000000000: Upgrade boot
LOG_INFO:                        000001000000000000000000: Upgrade recovery
LOG_INFO:                        000000100000000000000000: Upgrade rootfs
LOG_INFO:                        000000010000000000000000: Upgrade oem
LOG_INFO:                        000000001000000000000000: Upgrade uboot_a
LOG_INFO:                        000000000100000000000000: Upgrade uboot_b
LOG_INFO:                        000000000010000000000000: Upgrade boot_a
LOG_INFO:                        000000000001000000000000: Upgrade boot_b
LOG_INFO:                        000000000000100000000000: Upgrade system_a
LOG_INFO:                        000000000000010000000000: Upgrade system_b
LOG_INFO:                        000000000000001000000000: Upgrade misc
LOG_INFO:                        000000000000000100000000: Upgrade userdata
LOG_INFO: --reboot               Restart the machine at the end of the program.
LOG_INFO: --version_url=url      The path to the file of version.
LOG_INFO: --image_url=url        Path to upgrade firmware.
LOG_INFO: --savepath=url         save the update.img to url.
LOG_INFO: --version              the version of updateEngine
LOG_INFO: --rkdebug              Log output to serial port
LOG_INFO: --ui_rotation          UI rotation,has 4 angles(0-3).

```

`--misc`：设置升级模式，可选Linux A/B模式升级、Recovery模式升级。本文档仅支持Recovery模式升级。

-   `--misc=update`：设置升级模式为Recovery模式。

`--image_url`：升级固件存放路径。

-   如果是网络升级，则表示以http://xxx/update.img，服务器上的update.img路径。
-   如果是本地升级（U盘/SD卡），则表示固件存放路径。如/mnt/udisk/update.img 或 /mnt/sdcard/update.img。

`--savepath`：固件保存路径。

-   如果是网络升级，则表示固件保存路径。（从网络下载固件保存位置）
-   如果是本地升级，该参数默认无效。

`--partition`：设置将要升级的分区，比如uboot、trust 、boot 、recovery、rootfs、oem等；不支持升级loader分区和parameter分区。

-   如果升级`uboot`分区，指定`partition=0x200000`；
-   如果升级`trust`分区，指定`partition=0x100000`；
-   如果升级`boot`分区，指定`partition=0x80000`；
-   如果升级`recovery`分区，指定`partition=0x40000`；
-   如果升级`rootfs`分区，指定`partition=0x20000`；
-   如果升级`oem`分区，指定`partition=0x10000`；
-   如果升级`misc`分区，指定`partition=0x200`；
-   如果升级`userdata`分区，指定`partition=0x100`；

  还可以指定版本文件等参数，在这里我们不过多介绍，详情可查看瑞芯微官方文档。

  下面针对本地升级，使用以下命令示例升级内核，指定--partition参数为0x80000：

```shell
updateEngine --image_url=/mnt/udisk/update.img --misc=update --partition=0x80000 --reboot &
```

  如果缺省--partition参数，将会设置--partition为默认值，0x3FFC00。使用以下命令可升级整个系统（loader 和parameter除外），userdata分区将会保留一些出厂设置，该分区默认不会升级。在不指定--partition时，userdata分区将默认不会升级。

```shell
updateEngine --image_url=/mnt/udisk/test/update.img --misc=update  --reboot &
```

> 注意：
>
> -   image\_url 路径必须存在固件，否则升级可能不成功
> -   可指定partion进行分区指定升级
> -   升级后，image\_url下的OTA升级固件将会被删除
>

### 1.2 OTA升级流程介绍

  OTA升级分为网络升级和本地升级。下面我们分别针对这两种情况进行介绍

#### 1.2.1 网络升级

  网络升级目前只支持htpp服务进行解析固件，暂未对其他协议进行支持。

```shell
# updateEngine --misc=update --image_url=固件地址 --partition=0x3FFC00 --version_url=版本文件地址 --savepath=保存的固件地址 --reboot

updateEngine --image_url=http://172.16.21.110:8080/linuxab/update.img --misc=update --reboot &

```

网络升级流程：

1.  固件版本比较
2.  下载固件(--image\_url)，并保存到本地(--savepath)
3.  升级指定的分区(--partition)
4.  设置升级分区为将要引导分区
5.  重启
6.  尝试引导升级的分区

#### 1.2.2 本地升级

  本地升级，将会直接从image\_url路径获取升级固件，进行OTA升级。

```shell
updateEngine --image_url=/mnt/udisk/test/update.img --misc=update  --reboot &
```

本地升级流程：

1.  固件版本比较
2.  从image\_url中获取升级固件。
3.  升级指定的分区(--partition)
4.  设置升级分区为将要引导分区
5.  重启
6.  尝试引导升级的分区

### 1.3 升级日志Log查看

  当使用UpdateEngine命令，进行OTA升级后，无论成功与否，可通过查看系统`/userdata/recovery/log`文件，此文件将会保存recovery模式中OTA升级的Log。

### 1.4 使用U盘或SD卡进行OTA升级

-   挂载U盘或SD卡

```plain
mount /dev/sda1 /mnt/udisk
```

-   选择相应的掩码，升级指定的分区

  使用以下命令进行升级，系统将会对固件进行校验后，进行升级，升级成功后，将会重启。

> 注意：**必须保证mage\_url 路径中固件有效，否则OTA升级可能会失败**。
>

```plain
updateEngine --image_url=/mnt/udisk/update.img --misc=update  --partition=0x80000 --reboot &
```

  升级时，串口打印log如下：

```plain
root@rk3506-buildroot:/# updateEngine --image_url=/mnt/udisk/test/update.img --misc=update  --reboot &
[1] 1393
root@rk3506-buildroot:/# LOG_INFO: *** update_engine: V1.0.1-g<unknown> ***.
LOG_INFO: Current Mode is recovery.
LOG_INFO: start RK_ota_url url [/mnt/udisk/test/update.img] save path [/mnt/udisk/test/update.img].
LOG_INFO: save image to /mnt/udisk/test/update.img.
LOG_INFO: url = /mnt/udisk/test/update.img.
LOG_INFO: [MiscUpdate:90] save path: /mnt/udisk/test/update.img
LOG_INFO: update recovery in normal system.
LOG_INFO: [RK_ota_set_partition:106] num [16]
LOG_INFO: need update parameter.
LOG_INFO: need update recovery.
LOG_INFO: Now is MTD.
LOG_INFO: need update recovery ,.dest_path: /dev/mtd3.
LOG_INFO: start RK_ota_start.
LOG_INFO: rk m_status = 1.
LOG_INFO: where the file is local.
LOG_INFO: [RK_ota_set_partition:106] num [16]
LOG_DEBUG: uiTag = 57464b52.
LOG_DEBUG: usSize = 66.
LOG_DEBUG: dwVersion = 8010000.
LOG_DEBUG: btMajor = 8, btMinor = 1, usSmall = 00.
LOG_DEBUG: dwBootOffset = 66.
LOG_DEBUG: dwBootSize = 449c0.
LOG_DEBUG: dwFWOffset = 44a26.
LOG_DEBUG: dwFWSize = 7579804.
LOG_DEBUG: tag = 1178684242
LOG_DEBUG: size = 123181056
LOG_DEBUG: machine_model = RK3506
LOG_DEBUG: manufacturer =  RK3506
LOG_DEBUG: version = 134283264
LOG_DEBUG: item = 10.
LOG_INFO: ================================================
LOG_DEBUG: name = package-file
LOG_DEBUG: file = package-file
LOG_DEBUG: offset = 283174
LOG_DEBUG: flash_offset = -1
LOG_DEBUG: usespace = 1
LOG_DEBUG: size = 209
LOG_INFO: ================================================
LOG_DEBUG: name = parameter
LOG_DEBUG: file = parameter.txt
LOG_DEBUG: offset = 285222
LOG_DEBUG: flash_offset = 0
LOG_DEBUG: usespace = 1
LOG_DEBUG: size = 492
LOG_INFO: ================================================
LOG_DEBUG: name = bootloader
LOG_DEBUG: file = MiniLoaderAll.bin
LOG_DEBUG: offset = 102
LOG_DEBUG: flash_offset = -1
LOG_DEBUG: usespace = 138
LOG_DEBUG: size = 281024
LOG_INFO: ================================================
LOG_DEBUG: name = uboot
LOG_DEBUG: file = uboot.img
LOG_DEBUG: offset = 569894
LOG_DEBUG: flash_offset = 6144
LOG_DEBUG: usespace = 2048
LOG_DEBUG: size = 4194304
LOG_INFO: ================================================
LOG_DEBUG: name = misc
LOG_DEBUG: file = misc.img
LOG_DEBUG: offset = 4764198
LOG_DEBUG: flash_offset = 22528
LOG_DEBUG: usespace = 24
LOG_DEBUG: size = 49152
LOG_INFO: ================================================
LOG_DEBUG: name = boot
LOG_DEBUG: file = boot.img
LOG_DEBUG: offset = 4813350
LOG_DEBUG: flash_offset = 88064
LOG_DEBUG: usespace = 2354
LOG_DEBUG: size = 4819456
LOG_INFO: ================================================
LOG_DEBUG: name = recovery
LOG_DEBUG: file = recovery.img
LOG_DEBUG: offset = 9634342
LOG_DEBUG: flash_offset = 26624
LOG_DEBUG: usespace = 7516
LOG_DEBUG: size = 15391232
LOG_INFO: ================================================
LOG_DEBUG: name = rootfs
LOG_DEBUG: file = rootfs.img
LOG_DEBUG: offset = 25027110
LOG_DEBUG: flash_offset = 108544
LOG_DEBUG: usespace = 45888
LOG_DEBUG: size = 93978624
LOG_INFO: ================================================
LOG_DEBUG: name = oem
LOG_DEBUG: file = oem.img
LOG_DEBUG: offset = 119005734
LOG_DEBUG: flash_offset = 436224
LOG_DEBUG: usespace = 960
LOG_DEBUG: size = 1966080
LOG_INFO: ================================================
LOG_DEBUG: name = userdata
LOG_DEBUG: file = userdata.img
LOG_DEBUG: offset = 120971814
LOG_DEBUG: flash_offset = 468992
LOG_DEBUG: usespace = 1216
LOG_DEBUG: size = 2490368
LOG_INFO: new md5:159ad5d24cc4ff43fb9e627c6587f16b
LOG_INFO: MD5Check is ok of /mnt/udisk/test/update.img
LOG_INFO: analyticImage ok.
LOG_INFO: found rkimage_hdr.item[1].name = parameter.
LOG_INFO: found rkimage_hdr.item[6].name = recovery.
LOG_INFO: Now is MTD.
LOG_INFO: now write parameter to /dev/block/by-name/gpt.
LOG_INFO: ingore misc.
LOG_INFO: now write recovery to /dev/mtd3.
LOG_INFO: update_cmd.flash_offset = 0.
LOG_INFO: flash_normal:200 start.
LOG_INFO: Now is MTD.
LOG_INFO: pcmd->flash_offset = 0.
LOG_INFO: mtd_write /dev/mtd3, offset = 0x930226 size = 0xeada00 flash_offset = 0.
Erasing 30720 Kibyte @ 0 --  0 % complete [  118.865531] nand: attempt to erase a bad/reserved block @16e0000
libmtd: error!: MEMERASE64 ioctl failed for eraseblock 0 (mtd3)
        error 5 (Input/output error)
flash_erase: error!: /dev/mtd3: MTD Erase entire chip failureTrying one by one each sector.
             error 5 (Input/output error)
Erasing 128 Kibyte @ 9c0000 -- 32 % complete flash_erase: Skipping bad block at 009e0000
Erasing 128 Kibyte @ 1a60000 -- 87 % complete flash_erase: Skipping bad block at 01a80000
Erasing 128 Kibyte @ 1de0000 -- 100 % complete
Writing data to block 0 at offset 0x0
Writing data to block 1 at offset 0x20000
Writing data to block 2 at offset 0x40000
Writing data to block 3 at offset 0x60000
Writing data to block 4 at offset 0x80000
Writing data to block 5 at offset 0xa0000
Writing data to block 6 at offset 0xc0000
Writing data to block 7 at offset 0xe0000
Writing data to block 8 at offset 0x100000
Writing data to block 9 at offset 0x120000
Writing data to block 10 at offset 0x140000
Writing data to block 11 at offset 0x160000
Writing data to block 12 at offset 0x180000
Writing data to block 13 at offset 0x1a0000
Writing data to block 14 at offset 0x1c0000
Writing data to block 15 at offset 0x1e0000
Writing data to block 16 at offset 0x200000
Writing data to block 17 at offset 0x220000
Writing data to block 18 at offset 0x240000
Writing data to block 19 at offset 0x260000
Writing data to block 20 at offset 0x280000
Writing data to block 21 at offset 0x2a0000
Writing data to block 22 at offset 0x2c0000
Writing data to block 23 at offset 0x2e0000
Writing data to block 24 at offset 0x300000
Writing data to block 25 at offset 0x320000
Writing data to block 26 at offset 0x340000
Writing data to block 27 at offset 0x360000
Writing data to block 28 at offset 0x380000
Writing data to block 29 at offset 0x3a0000

root@rk3506-buildroot:/# Writing data to block 30 at offset 0x3c0000
Writing data to block 31 at offset 0x3e0000
Writing data to block 32 at offset 0x400000
Writing data to block 33 at offset 0x420000
Writing data to block 34 at offset 0x440000
Writing data to block 35 at offset 0x460000
Writing data to block 36 at offset 0x480000
Writing data to block 37 at offset 0x4a0000
Writing data to block 38 at offset 0x4c0000
Writing data to block 39 at offset 0x4e0000
Writing data to block 40 at offset 0x500000
Writing data to block 41 at offset 0x520000
Writing data to block 42 at offset 0x540000
Writing data to block 43 at offset 0x560000
Writing data to block 44 at offset 0x580000
Writing data to block 45 at offset 0x5a0000
Writing data to block 46 at offset 0x5c0000
Writing data to block 47 at offset 0x5e0000
Writing data to block 48 at offset 0x600000
Writing data to block 49 at offset 0x620000
Writing data to block 50 at offset 0x640000
Writing data to block 51 at offset 0x660000
Writing data to block 52 at offset 0x680000
Writing data to block 53 at offset 0x6a0000
Writing data to block 54 at offset 0x6c0000

root@rk3506-buildroot:/# Writing data to block 55 at offset 0x6e0000
Writing data to block 56 at offset 0x700000
Writing data to block 57 at offset 0x720000
Writing data to block 58 at offset 0x740000
Writing data to block 59 at offset 0x760000
Writing data to block 60 at offset 0x780000
Writing data to block 61 at offset 0x7a0000
Writing data to block 62 at offset 0x7c0000
Writing data to block 63 at offset 0x7e0000
Writing data to block 64 at offset 0x800000
Writing data to block 65 at offset 0x820000
Writing data to block 66 at offset 0x840000
Writing data to block 67 at offset 0x860000
Writing data to block 68 at offset 0x880000
Writing data to block 69 at offset 0x8a0000
Writing data to block 70 at offset 0x8c0000
Writing data to block 71 at offset 0x8e0000
Writing data to block 72 at offset 0x900000
Writing data to block 73 at offset 0x920000
Writing data to block 74 at offset 0x940000
Writing data to block 75 at offset 0x960000
Writing data to block 76 at offset 0x980000
Writing data to block 77 at offset 0x9a0000
Writing data to block 78 at offset 0x9c0000
Writing data to block 79 at offset 0x9e0000
Bad block at 9e0000, 1 block(s) will be skipped
Writing data to block 80 at offset 0xa00000
Writing data to block 81 at offset 0xa20000
Writing data to block 82 at offset 0xa40000
Writing data to block 83 at offset 0xa60000
Writing data to block 84 at offset 0xa80000
Writing data to block 85 at offset 0xaa0000
Writing data to block 86 at offset 0xac0000
Writing data to block 87 at offset 0xae0000
Writing data to block 88 at offset 0xb00000
Writing data to block 89 at offset 0xb20000
Writing data to block 90 at offset 0xb40000
Writing data to block 91 at offset 0xb60000
Writing data to block 92 at offset 0xb80000
Writing data to block 93 at offset 0xba0000
Writing data to block 94 at offset 0xbc0000
Writing data to block 95 at offset 0xbe0000
Writing data to block 96 at offset 0xc00000
Writing data to block 97 at offset 0xc20000
Writing data to block 98 at offset 0xc40000
Writing data to block 99 at offset 0xc60000
Writing data to block 100 at offset 0xc80000
Writing data to block 101 at offset 0xca0000
Writing data to block 102 at offset 0xcc0000
Writing data to block 103 at offset 0xce0000
Writing data to block 104 at offset 0xd00000
Writing data to block 105 at offset 0xd20000
Writing data to block 106 at offset 0xd40000
Writing data to block 107 at offset 0xd60000
Writing data to block 108 at offset 0xd80000
Writing data to block 109 at offset 0xda0000
Writing data to block 110 at offset 0xdc0000
Writing data to block 111 at offset 0xde0000
Writing data to block 112 at offset 0xe00000
Writing data to block 113 at offset 0xe20000
Writing data to block 114 at offset 0xe40000
Writing data to block 115 at offset 0xe60000
Writing data to block 116 at offset 0xe80000
Writing data to block 117 at offset 0xea0000
Writing data to block 118 at offset 0xec0000
LOG_INFO: Now is MTD.
LOG_INFO: [checkdata_mtd:40] offset [0] checksize [15391232]
ECC failed: 0
ECC corrected: 0
Number of bad blocks: 2
Number of bbt blocks: 0
Block size 131072, page size 2048, OOB size 128
Dumping data starting at 0x00000000 and ending at 0x00eada00...

LOG_INFO: read new md5: [afb27db7bdd8273979252ee70a52fff5]
LOG_INFO: new md5:afb27db7bdd8273979252ee70a52fff5
LOG_INFO: MD5Check is ok of /dev/mtd3
LOG_INFO: new md5:afb27db7bdd8273979252ee70a52fff5
LOG_INFO: MD5Check is ok of /mnt/udisk/test/update.img
LOG_INFO: check /dev/mtd3 ok.
LOG_INFO: RK_ota_start is ok!LOG_INFO: rk ota success.
LOG_INFO: Current Mode is recovery.
LOG_INFO: rk m_status = 0.
LOG_INFO: Now is MTD.
mtd: successfully wrote block at 0

###################  进入recovery 模式 #####################

DDR d27ac532c4 typ 25/11/25-09:30.11,fwver: v1.06
tREFI:4x, sr_idle:93, pd_idle:13
SRX
get rd_skew=0x2a, wr_skew=0x22
PHY drv:clk:40,ca:48,DQ:40,odt:240
vrefinner:50%, vrefout:50%
dram drv:40,odt:120
sr_dq:0, sr_ca:0, sr_clk:0
rg:0x17-0x0-0x2, 0xc-0x0-0x2,status:a007
DDR3, 750MHz
BW=16 Col=10 Bk=8 CS0 Row=13 CS=1 Size=128MB
out
U-Boot SPL board init
U-Boot SPL 2017.09-g0d357ad-250310 #itrunk (Jan 19 2026 - 09:33:29)
sfc cmd=03H(6BH-x4)
SPI Nand ID 8c a1 8c
unrecognized JEDEC id bytes: ff, ff, ff
Trying to boot from MTD1
Trying fit image at 0x1800 sector
## Verified-boot: 0
## Checking optee 0x00001000 ... sha256(93603ca22c...) + OK
  Trying kernel at 0x6800 sector from 'recovery' part
## Checking fdt 0x00063000 ... sha256(5efbae5c2a...) + OK
## Checking kernel 0x01100000 ... sha256(6caa31f3b0...) + OK
## Checking ramdisk 0x01800000 ... sha256(ba26963c67...) + OK
  Jumping to Kernel(0x01100000) via OP-TEE(0x00001000)
Total: 1246.364/1315.591 ms

.................................................................

###################  在recovery 模式升级分区 #####################

starting recovery...
starting usbdevice service, log saved to /var/log/usbdevice.log
LOG_INFO: Now is MTD.
LOG_INFO: out->command = boot-recovery.
LOG_INFO: out->status = .
LOG_INFO: out->recovery = recovery
--update_package=/mnt/udisk/test/update.img
.
LOG_INFO: out->systemFlag = .
LOG_INFO: Boot command: boot-recovery
LOG_INFO: Got arguments from boot message
LOG_INFO: Now is MTD.
Starting input-event-daemon: done
root@rk3506-recovery:/# mtd: successfully wrote block at 0
LOG_INFO: Set boot command "boot-recovery"
[    7.009734] UBIFS (ubi6:0): un-mount UBI device 6
[    7.009793] UBIFS (ubi6:0): background thread "ubifs_bgt6_0" stops
[    7.026761] UBIFS (ubi7:0): un-mount UBI device 7
[    7.026827] UBIFS (ubi7:0): background thread "ubifs_bgt7_0" stops
[    7.906657] file system registered
[    8.153288] read descriptors
[    8.153364] read strings
[    8.297845] dwc2 ff740000.usb: bound driver configfs-gadget.rockchip
[   16.602094] nand: attempt to erase a bad/reserved block @3820000
[   18.469220] platform vdd-arm: deferred probe pending
[   72.750653] nand: attempt to erase a bad/reserved block @de60000
[   74.092851] UBIFS (ubi7:0): Mounting in unauthenticated mode
[   74.093118] UBIFS (ubi7:0): background thread "ubifs_bgt7_0" started, PID 766
[   74.159963] UBIFS (ubi7:0): UBIFS: mounted UBI device 7, volume 0, name "userdata"
[   74.160055] UBIFS (ubi7:0): LEB size: 126976 bytes (124 KiB), min./max. I/O unit sizes: 2048 bytes/2048 bytes
[   74.160077] UBIFS (ubi7:0): FS size: 19681280 bytes (18 MiB, 155 LEBs), max 16912 LEBs, journal size 9023488 bytes (8 MiB, 72 LEBs)
[   74.160098] UBIFS (ubi7:0): reserved for root: 0 bytes (0 KiB)
[   74.160112] UBIFS (ubi7:0): media format: w4/r0 (latest is w5/r0), UUID C883285D-A87A-4E0C-B9C4-FFAB6521C2BE, small LPT model
[   74.345693] rga2 ff610000.rga: shutdown success
[   74.350392] reboot: Restarting system

###################  升级完成后重启引导新分区，升级成功 #####################

DDR d27ac532c4 typ 25/11/25-09:30.11,fwver: v1.06
tREFI:4x, sr_idle:93, pd_idle:13
SRX
get rd_skew=0x2a, wr_skew=0x22
PHY drv:clk:40,ca:48,DQ:40,odt:240
vrefinner:50%, vrefout:50%
dram drv:40,odt:120
sr_dq:0, sr_ca:0, sr_clk:0
rg:0x17-0x0-0x2, 0xe-0x0-0x2,status:a007
DDR3, 750MHz
BW=16 Col=10 Bk=8 CS0 Row=13 CS=1 Size=128MB
out
U-Boot SPL board init
U-Boot SPL 2017.09-g0d357ad-250310 #itrunk (Jan 19 2026 - 09:33:29)
sfc cmd=03H(6BH-x4)
SPI Nand ID 8c a1 8c
unrecognized JEDEC id bytes: ff, ff, ff
Trying to boot from MTD1
Trying fit image at 0x1800 sector
## Verified-boot: 0
## Checking optee 0x00001000 ... sha256(93603ca22c...) + OK
  Trying kernel at 0x15800 sector from 'boot' part
## Checking fdt 0x00063000 ... sha256(b3566a53b2...) + OK
## Checking kernel 0x01100000 ... sha256(6caa31f3b0...) + OK
  Jumping to Kernel(0x01100000) via OP-TEE(0x00001000)
Total: 445.895/515.99 ms

```

## 2. 用户应用程序升级

  HD-RK3506系列，可直接通过U盘或SD卡升级用户应用程序，假设用户APP可执行文件名为myapp，在/root目录。

  下方展示插上U盘，自动挂载U盘后，自动从U盘查找升级文件，备份旧程序后，升级新的应用程序的脚本。

```plain
#!/bin/sh

USB_DEV="/dev/sda1"                         # U盘挂载节点
MOUNT_POINT="/mnt/udisk"                    # U盘挂载目录
APP_NAME="myapp"                            # 应用程序名
TARGET="/root/$APP_NAME"

echo "=== USB Upgrade Tool ==="

# 1. 检查 U盘设备是否存在
if [ ! -b "$USB_DEV" ]; then
    echo "USB device $USB_DEV not found!"
    exit 1
fi

# 2. 挂载 U盘
echo "Mounting USB..."
mount | grep "$MOUNT_POINT" >/dev/null 2>&1
if [ $? -ne 0 ]; then
    mount "$USB_DEV" "$MOUNT_POINT"
    if [ $? -ne 0 ]; then
        echo "Failed to mount $USB_DEV"
        exit 1
    fi
fi

# 3. 查找升级文件
if [ ! -f "$MOUNT_POINT/$APP_NAME" ]; then
    echo "No upgrade file found on USB: $APP_NAME"
    umount "$MOUNT_POINT"
    exit 1
fi

echo "Found upgrade file!"

# 4. 备份旧程序
if [ -f "$TARGET" ]; then
    echo "Backing up old app..."
    cp "$TARGET" "$TARGET.bak"
fi

# 5. 覆盖新程序
echo "Copying new version..."
cp "$MOUNT_POINT/$APP_NAME" "$TARGET"
chmod +x "$TARGET"

echo "Upgrade complete."

# 6. 卸载 U盘
umount "$MOUNT_POINT"

# 7. 可选：重启系统
# reboot

exit 0

```

  首先需要在U盘中放置myapp，为脚本自定义的应用程序名称，为新的应用程序，然后插入U盘。

  运行以下命令，直接升级应用程序。

```plain
root@rk3506-buildroot:~# update_APP.sh
=== USB Upgrade Tool ===
Mounting USB...
Found upgrade file!
Backing up old app...
Copying new version...
Upgrade complete.
```

  通过运行截图可以看到，升级前myapp的MD5值和升级后myapp的MD5值不同，备份的应用程序与升级前的myapp应用程序MD5值相同，说明升级成功。

<img src={require('./images/01-otaupgradeguide-01.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>