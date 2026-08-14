---
sidebar_position: 3
---

# U 盘与 SD 卡使用

:::tip 提示

本指南将指导您如何使用 **RK3506-EVB** 的 **U 盘**和 **SD 卡**功能。


:::

## 1. U 盘的使用

#### 步骤 1：插入 U 盘

插入 U 盘后，会有如下打印信息

```shell
[ 3303.968899] usb 1-1.1: USB disconnect, device number 4
[ 3472.623351] usb 1-1.1: new high-speed USB device number 5 using dwc2
[ 3472.733696] usb-storage 1-1.1:1.0: USB Mass Storage device detected
[ 3472.734726] scsi host0: usb-storage 1-1.1:1.0
[ 3473.750855] scsi 0:0:0:0: Direct-Access     Generic  Mass-Storage     2.00 PQ: 0 ANSI: 2
[ 3473.754577] sd 0:0:0:0: [sda] 30965760 512-byte logical blocks: (15.9 GB/14.8 GiB)
[ 3473.755328] sd 0:0:0:0: [sda] Write Protect is off
[ 3473.756073] sd 0:0:0:0: [sda] No Caching mode page found
[ 3473.756098] sd 0:0:0:0: [sda] Assuming drive cache: write through
[ 3473.762227]  sda: sda1
[ 3473.762909] sd 0:0:0:0: [sda] Attached SCSI removable disk
[ 3473.995242] FAT-fs (sda): error, fat_get_cluster: invalid cluster chain (i_pos 1)
[ 3473.995420] FAT-fs (sda): Filesystem has been set read-only
[ 3474.094396] FAT-fs (sda): error, fat_get_cluster: invalid cluster chain (i_pos 1)
[ 3474.094440] FAT-fs (sda): Filesystem has been set read-only
```

可以看到系统检测出一个设备 ，并发现该设备存在一个分区 ，自动挂载了这个分区，我们可以查看分区并往分区里写入内容。

执行以下指令，可以查看该分区的文件类型是什么

```shell
fdisk -l /dev/sda
```

<img src={require('./images/03-usbdriveandsdcard-01.png').default} alt="企业微信截图_17840143757494.png" className="doc-image--80" />

#### 步骤 2：查看分区

使用 df -h 命令查看 U 盘目录

```shell
root@rk3506-buildroot:/# df -h
Filesystem                Size      Used Available Use% Mounted on
......
/dev/sda1                14.7G    920.0K     14.7G   0% /mnt/udisk
```

可以看到 U 盘目录 /mnt/udisk，进入目录，查看 U 盘内容

```shell
root@rk3506-buildroot:/# cd /mnt/udisk/
root@rk3506-buildroot:/mnt/udisk# ls
System Volume Information
```

#### 步骤 3：创建文件

进入 U 盘目录，创建文件，并往文件里写内容

```shell
root@rk3506-buildroot:/mnt/udisk# touch test.txt
root@rk3506-buildroot:/mnt/udisk# ls
System Volume Information  test.txt
root@rk3506-buildroot:/mnt/udisk# echo "hello" > test.txt
root@rk3506-buildroot:/mnt/udisk# cat test.txt
hello
```

拔出 U 盘，插入 Windows，查看如下：

<img src={require('./images/03-usbdriveandsdcard-02.png').default} alt="企业微信截图_17840146755001.png" className="doc-image--80" />

## 2. SD 卡的使用

#### 步骤 1：插入 SD 卡

插入 SD 卡后，会有如下打印信息

```shell
[ 4752.026662] mmc0: card 0001 removed
[ 4754.220329] mmc_host mmc0: Bus speed (slot 0) = 400000Hz (slot req 400000Hz, actual 400000HZ div = 0)
[ 4754.352061] mmc_host mmc0: Bus speed (slot 0) = 50000000Hz (slot req 50000000Hz, actual 50000000HZ div = 0)
[ 4754.352321] mmc0: new high speed SDHC card at address 0001
[ 4754.353610] mmcblk0: mmc0:0001 SD 14.8 GiB
[ 4754.355575]  mmcblk0: p1
[ 4754.509755] usb 1-1: new high-speed USB device number 10 using dwc2
[ 4754.547405] FAT-fs (mmcblk0): error, fat_get_cluster: invalid cluster chain (i_pos 1)
[ 4754.547488] FAT-fs (mmcblk0): Filesystem has been set read-only
[ 4754.628369] FAT-fs (mmcblk0): error, fat_get_cluster: invalid cluster chain (i_pos 1)
[ 4754.628412] FAT-fs (mmcblk0): Filesystem has been set read-only
```

可以看到系统检测出一个设备 ，并发现该设备存在一个分区 ，自动挂载了这个分区，我们可以查看分区并往分区里写入内容。

执行以下指令，可以查看该分区的文件类型是什么

```shell
fdisk -l /dev/mmcblk0
```

<img src={require('./images/03-usbdriveandsdcard-03.png').default} alt="企业微信截图_1784014946581.png" className="doc-image--80" />

#### 步骤 2：查看分区

使用 df -h 命令查看 SD 卡目录

```shell
root@rk3506-buildroot:/# df -h
Filesystem                Size      Used Available Use% Mounted on
......
/dev/mmcblk0p1           14.7G     40.0K     14.7G   0% /mnt/sdcard
```

可以看到 SD 卡目录 /mnt/sdcard，进入目录，查看 SD 卡内容

```shell
root@rk3506-buildroot:/# cd /mnt/sdcard/
root@rk3506-buildroot:/mnt/sdcard# ls
System Volume Information
```

#### 步骤 3：创建文件

进入 SD 卡目录，创建文件，并往文件里写内容

```shell
root@rk3506-buildroot:/mnt/sdcard# touch test.txt
root@rk3506-buildroot:/mnt/sdcard# ls
System Volume Information  test.txt
root@rk3506-buildroot:/mnt/sdcard# echo "hi" > test.txt
root@rk3506-buildroot:/mnt/sdcard# cat test.txt
hi
```

拔出 U 盘，插入 Windows，查看如下：

<img src={require('./images/03-usbdriveandsdcard-04.png').default} alt="企业微信截图_17840153412576.png" className="doc-image--80" />
