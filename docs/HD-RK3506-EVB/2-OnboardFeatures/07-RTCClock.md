---
sidebar_position: 7
---

# RTC 时钟

:::tip 提示

本指南将指导您如何使用 **RK3506-EVB** 的 **RTC 时钟**功能。


:::

> 注：HD-RK3506-EVB板载RTC，但未预装RTC电池（CR2032），购买开发板时赠送RTC电池，用户可接上电池，体验RTC功能。

<img src={require('./images/rtc.png').default} alt="网口.png" className="doc-image--80" />

## 1. 设置时钟

Linux将时钟分为系统时钟(System Clock)和硬件时钟(Real Time Clock，简称RTC)两种。系统时钟是由Linux内核所维护的时钟，用户一般使用和看到的都是系统时钟。而硬件时钟则是由主板上的电池供电的主板硬件时钟。系统时钟在系统断电后即会消失，但RTC 时钟在主板电池有电的情况下会长期运行。

每次上电时，Linux内核都会读取主板上的RTC时钟，并将它同步到系统时钟。下面列出一些与时钟相关的命令：

- 使用`date`命令可以查看系统时钟：


```shell
root@rk3506-buildroot:/# date
2024年 07月 17日 星期三 07:14:07 UTC
```

- 使用`date -s`命令可以设置系统时钟，如要将当前时钟设置为 2024-07-17 16:15 ：


```shell
root@rk3506-buildroot:/# date -s "2024-07-17 16:15"
```

- 使用`hwclock`命令可以查看RTC时钟：


```shell
root@rk3506-buildroot:/# hwclock
Tue May 17 16:13:09 2022  0.000000 seconds
```

- 使用`hwclock -w`，可以将系统时钟写入RTC时钟：


```shell
root@rk3506-buildroot:/# hwclock -w
```

- 使用`hwclock -s`，可以将RTC时钟写入系统时钟：


```shell
root@rk3506-buildroot:/# hwclock -s
```

通过上面的叙述可以看出，如果想要改变当前的系统时间，且希望系统重启后改变依然生效，需要执行如下两步操作：

-   使用`date -s`命令修改当前的系统时钟；
-   使用`hwclock -w`命令将修改后的系统时钟写入RTC时钟。

例如需要将当前时钟设置为`2024-07-17 15:18:40`，并希望该改变在系统重启后依然有效，应执行如下命令：

```shell
# 设置系统时间
root@rk3506-buildroot:/# date -s "2024-07-17 15:18:40"
2024年 07月 17日 星期三 15:18:40 UTC

# 将系统时间写入RTC
root@rk3506-buildroot:/# hwclock -w

# 读取RTC时间
root@rk3506-buildroot:/# hwclock
2024-07-17 15:19:10.500417+00:00
```

## 2. 设置时区

设置时区的方法如下：

```shell
# 查看当前时区文件，默认UTC
root@rk3506-buildroot:/# ls -l /etc/localtime
lrwxrwxrwx    1 root   root    29 Jan  8  2025 /etc/localtime -> ../usr/share/zoneinfo/Etc/UTC

# 查看时区，+0000默认为UTC
root@rk3506-buildroot:/# date -R
Fri, 11 Feb 2022 02:32:56 +0000

# 修改默认时区文件，如修改为上海
root@rk3506-buildroot:/# ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 查看时区是否需要成功，上海为东八区+0800
root@rk3506-buildroot:/# date -R
Fri, 11 Feb 2022 10:33:11 +0800
```

如需要设置其它时区，可以查看/usr/share/zoneinfo 目录下对应的时区，然后链接到 /etc/localtime 即可。
