---
sidebar_position: 6
---

# 一分钟快速体验

:::tip 提示

本指南针对首次使用 **HD-RK3506-EVB** 开发板的用户，介绍快速查看开发板系统信息的常用命令。

:::

> 注意：文中命令行出现的“**root@rk3506-buildroot:/#** ”是命令行终端的用户名root和主机名**rk3506-buildroot**，不需要输入。

## 1. 查看磁盘和内存大小

  使用 `df -h` 命令查看系统上磁盘使用情况，如下为默认磁盘使用情况，仅供参考。

<img src={require('./images/df.png').default} alt="" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  使用 `free -h` 命令查看内存使用情况，如下所示。

<img src={require('./images/free.png').default} alt="" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

## 2. 关机和重启

  当需要关机时，如果有数据存储操作，为了确保数据完全写入，可执行sync 命令：

```shell
root@rk3506-buildroot:/# sync
```

  完成数据同步后再关闭电源关机。

  也可以执行 reboot 命令重启开发板：

```shell
root@rk3506-buildroot:/# reboot
```

  该命令会自动完成数据同步后再重启系统。

## 3. 查看内核版本

  使用 `uname -a` 命令可以查看内核版本信息：

<img src={require('./images/uname.png').default} alt="" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  也可以通过查看 `/proc/version`  文件，获得系统内核版本信息：

<img src={require('./images/version.png').default} alt="" style={{display: 'block', margin: '20px auto', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

## 4. 查看磁盘分区信息

  通过查看 `/proc/partitions`  文件，可以获得系统所有的分区信息：

<img src={require('./images/partitions.png').default} alt="" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

## 5. 查看CPU信息

  通过查看 `/proc/cpuinfo` 文件，可以获得CPU等信息：

  其中CPU Serial为CPU的唯一ID，即使是重新刷机，这个唯一ID也不会变。

<img src={require('./images/cpuinfo.png').default} alt="" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  其中`BogoMIPS`参数可以用来衡量处理器的运算能力，表示CPU每秒钟可以处理的指令数，单位百万。

## 6. 查看挂载信息

  通过查看 `mount` 命令，可以获得文件系统的挂载信息：

<img src={require('./images/mount.png').default} alt="" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

## 7. 心跳灯的操控

  心跳灯位于 /sys/class/leds/run，向 brightness 输入 0 和 1 实现对心跳灯的控制。

```shell
# 开灯
echo 0 > /sys/class/leds/run/brightness
#关灯
echo 1 > /sys/class/leds/run/brightness
```