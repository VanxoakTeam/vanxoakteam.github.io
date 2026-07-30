---
sidebar_position: 2
---

# 设置应用开机自启动

:::tip 提示

本指南将指导您如何将应用设置为**开机自启动**。


:::

  系统启动过程中会扫描/etc/init.d目录下所有以“S”开头的文件并启动。所以只需在/etc/init.d目录下编写一个文件名为：“S+编号+名称”的可执行脚本，在脚本中增加启动某个具体程序的语句即可。文件名必须以“S”开头，编号代表了启动级别，编号数字越大则越晚运行。

  例如，需要开机自启动的应用程序为/opt/demo，可编写S99myapp脚本并增加可执行权限，放到/etc/init.d目录下，S99myapp文件内容可简单的写为如下内容：

```shell
#!/bin/sh
/opt/demo &
```

> 注意：&为后台运行，如不添加此符号可能会导致调试串口无法进入终端。

  实际应用中，程序启动之前通常需要设置一些环境变量、加载某些外设驱动或者库，程序退出时可能也要执行一些清理工作，因此最好编写一个独立的程序启动脚本来完成以上工作，如下所示：

```shell
#!/bin/sh
case "$1" in
    start)
        echo "start demo: "
        . /etc/profile
        /opt/demo &
        ;;
    stop)
        killall demo
        echo "stop demo"
        ;;
    restart|reload)
        $0 stop
        $0 start
        ;;
    *)
        echo "Usage: -bash {start|stop|restart}"
        exit 1
        ;;
esac
exit 0
```

  将该文件保存在/etc/init.d目录下，增加可执行权限，下次系统启动时将会自动启动应用程序。
