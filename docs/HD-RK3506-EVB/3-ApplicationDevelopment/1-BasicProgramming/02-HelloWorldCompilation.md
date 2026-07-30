---
sidebar_position: 2
---

# HelloWorld 程序编译与运行

:::tip 提示

本指南将指导您如何编写简单的 HelloWorld 程序。


:::

  使用熟悉的文本编辑器，编写一个简单的程序，往终端打印“HelloWorld”字符串，以下代码是一个简单的范例。

```c
#include <stdio.h>
int main(int argc, char **argv)
{
    int i;
    for (i=0; i<5; i++) {
        printf("HelloWorld %d!\n", i);
    }
    return 0;
}
```

  启动终端，进入 helloworld程序文件所在目录，输入编译命令对 helloworld.c进行编译：

```c
user@ubuntu:~$ arm-buildroot-linux-gnueabihf-gcc helloworld.c -o helloworld
```

  编译完毕，将得到HelloWorld文件，将HelloWorld程序下载到板子并运行

```shell
root@rk3506-buildroot:/# chmod a+x helloworld
root@rk3506-buildroot:/# ./helloworld
HelloWorld 0!
HelloWorld 1!
HelloWorld 2!
HelloWorld 3!
HelloWorld 4!
```
