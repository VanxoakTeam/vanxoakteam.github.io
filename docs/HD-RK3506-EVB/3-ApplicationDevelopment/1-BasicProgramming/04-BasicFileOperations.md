---
sidebar_position: 4
---

# 文件基础操作

:::tip 提示

本指南将指导您如何编写**文件 IO** 代码。


:::

## 1. 文件IO函数分类

  在 Linux 上操作文件时，有两套函数：标准IO、系统调用IO。标准IO 的相关函数是：fopen/fread/fwrite/fseek/fflush/fclose等 。 系 统 调 用IO的 相 关 函 数 是 ：open/read/write/lseek/fsync/close。

  这 2 种 IO 函数的差别如下图所示：

<img src={require('./images/03-basicfileoperations-01.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  标准IO的内部，会分配一个用户空间的buffer，读写操作先经过这个 buffer。在有必要时，才会调用底下的系统调用IO向内核发起操作。

  所以：标准IO效率更高；但是要访问驱动程序时就不能使用标准IO，而是使用系统调用IO。

## 2. 使用open函数打开文件

  **函数原型：**

int open(const char \\\*pathname, int flags, mode\_t mode);

-   参数 ：

-   pathname：要打开/创建的文件路径。
-   flags：打开模式（如 O\_RDONLY、O\_WRONLY、O\_RDWR）及可选标志（如 O\_CREAT、O\_APPEND）。
-   mode：仅当 O\_CREAT 标志存在时有效，指定文件权限（如 0644）。

-   返回值 ：

-   成功返回文件描述符（非负整数），失败返回 -1 并设置 errno 。

open.c源码如下：

```c
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <unistd.h> 

/*
 * ./open 1.txt
 * argc  = 2
 * argv[0] = "./open"
 * argv[1] = "1.txt"
 */

int main(int argc, char **argv)
{
    int fd;
    if (argc != 2)
    {
        printf("Usage: %s <file>\n", argv[0]);
        return -1;
    }
    fd = open(argv[1], O_RDWR);
    if (fd < 0)
    {
        printf("can not open file %s\n", argv[1]);
        printf("errno = %d\n", errno);
        printf("err: %s\n", strerror(errno));
        perror("open");
    }
    else
    {
        printf("fd = %d\n", fd);
    }
    while (1)
    {
        sleep(10);
    }
    close(fd);
    return 0;
}
```

  本节源码完全可以在DshanPI A1上测试。

  执行以下命令编译、运行：

```c
baiwen@dshanpi-a1:~/code/04_fileio/01_open$ gcc -o open open.c
baiwen@dshanpi-a1:~/code/04_fileio/01_open$ touch 1.txt
baiwen@dshanpi-a1:~/code/04_fileio/01_open$ ./open 1.txt
fd = 3
    ^C
```

## 3. 使用open函数创建文件

  本节create.c源码如下：

```c
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <unistd.h>

/*
 * ./create 1.txt
 * argc  = 2
 * argv[0] = "./open"
 * argv[1] = "1.txt"
 */
int main(int argc, char **argv)
{
    int fd;

    if (argc != 2)
    {
        printf("Usage: %s <file>\n", argv[0]);
        return -1;
    }

    fd = open(argv[1], O_RDWR | O_CREAT | O_TRUNC, 0777);
    if (fd < 0)
    {
        printf("can not open file %s\n", argv[1]);
        printf("errno = %d\n", errno);
        printf("err: %s\n", strerror(errno));
        perror("open");
    }
    else
    {
        printf("fd = %d\n", fd);
    }

    while (1)
    {
        sleep(10);
    }
    close(fd);
    return 0;
}
```

  执行以下命令编译、运行：

```c
baiwen@dshanpi-a1:~/code/04_fileio/02_create$ gcc create.c -o create
baiwen@dshanpi-a1:~/code/04_fileio/02_create$ ./create 1.txt
fd = 3
    ^C
baiwen@dshanpi-a1:~/code/04_fileio/02_create$ ls
1.txt  create  create.c
```

## 4. 使用write函数写文件

  **函数原型**：

```c
#include <unistd.h>
ssize_t write(int fd, const void \*buf, size_t count);
```

-   参数 ：

-   fd：已打开的文件描述符（通过 open、dup 等获取）。
-   buf：指向要写入数据的缓冲区指针。
-   count：要写入的字节数。

-   返回值 ：

-   成功时返回实际写入的字节数（可能小于 count，如写入终端或网络设备）。
-   失败返回 -1 并设置 errno（如无效的 fd 或磁盘空间不足）。

本节write.c源码如下

```c
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <unistd.h>

/*
 * ./write 1.txt str1 str2
 * argc  = 2
 * argv[0] = "./open"
 * argv[1] = "1.txt"
 */

int main(int argc, char **argv)
{
    int fd;
    int i;
    int len;

    if (argc < 3)
    {
        printf("Usage: %s <file> <string1> <string2> ...\n", argv[0]);
        return -1;
    } 

    fd = open(argv[1], O_RDWR | O_CREAT | O_TRUNC, 0644);
    if (fd < 0)
    {
        printf("can not open file %s\n", argv[1]);
        printf("errno = %d\n", errno);
        printf("err: %s\n", strerror(errno));
        perror("open");
    }
    else
    {
        printf("fd = %d\n", fd);
    }

    for (i = 2; i < argc; i++)
    {
        len = write(fd, argv[i], strlen(argv[i]));
        if (len != strlen(argv[i]))
        {
            perror("write");
            break;
        }
        write(fd, "\r\n", 2);
    } 
    close(fd);
    return 0;
}
```

  执行以下命令编译、运行：

```c
baiwen@dshanpi-a1:~/code/04_fileio/03_write$ gcc write.c -o write
baiwen@dshanpi-a1:~/code/04_fileio/03_write$ ./write 1.txt dshanpi-a1
fd = 3
    baiwen@dshanpi-a1:~/code/04_fileio/03_write$ cat 1.txt
dshanpi-a1
```

## 5. 使用read函数读取文件

  **函数原型：**

```c
#include <unistd.h>
ssize_t read(int fd, void \*buf, size_t count);
```

-   参数 ：

-   fd：已打开的文件描述符（通过 open、pipe 等获取）。
-   buf：存储读取数据的缓冲区指针。
-   count：要读取的最大字节数。

-   返回值 ：

-   成功时返回实际读取的字节数（可能小于 count，如文件末尾或中断）。
-   0 表示到达文件末尾（EOF）。
-   \-1 表示错误，并设置 errno（如无效 fd 或权限不足）。

  本节read.c源码如下

```c
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <unistd.h>
/*
 * ./read 1.txt
 * argc  = 2
 * argv[0] = "./read"
 * argv[1] = "1.txt"
 */

int main(int argc, char **argv)
{
    int fd;
    int i;
    int len;
    unsigned char buf[100];
    if (argc != 2)
    {
        printf("Usage: %s <file>\n", argv[0]);
        return -1;
    }
    fd = open(argv[1], O_RDONLY);
    if (fd < 0)
    {
        printf("can not open file %s\n", argv[1]);
        printf("errno = %d\n", errno);
        printf("err: %s\n", strerror(errno));
        perror("open");
    }
    else
    {
        printf("fd = %d\n", fd);
    }
    /* 读文件/打印 */
    while (1)
    {
        len = read(fd, buf, sizeof(buf)-1);
        if (len < 0)
        {
            perror("read");
            close(fd);
            return -1;
        }
        else if (len == 0)
        {
            break;
        }
        else
        {
            /* buf[0], buf[1], ..., buf[len-1] 含有读出的数据
       * buf[len] = '\0'
       */
            buf[len] = '\0';
            printf("%s", buf);
        }
    }
    close(fd);
    return 0;
}
```

  执行以下命令编译、运行：

```c
baiwen@dshanpi-a1:~/code/04_fileio/04_read$ gcc -o read read.c
baiwen@dshanpi-a1:~/code/04_fileio/04_read$ echo 12345 > 1.txt
baiwen@dshanpi-a1:~/code/04_fileio/04_read$ cat 1.txt
12345
baiwen@dshanpi-a1:~/code/04_fileio/04_read$ ./read 1.txt
fd = 3
    12345
```

## 6. 综合实验\_处理表格

  process\_excel.c源码如下

```c
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <unistd.h>

/* 返回值: n表示读到了一行数据的数据个数(n >= 0)
 *         -1(读到文件尾部或者出错)
 */
static int read_line(int fd, unsigned char *buf)
{
    /* 循环读入一个字符 */

    /* 如何判断已经读完一行? 读到0x0d, 0x0a */

    unsigned char c;
    int len;
    int i = 0;
    int err = 0;

    while (1)
    {
        len = read(fd, &c, 1);
        if (len <= 0)
        {
            err = -1;
            break;
        }
        else
        {
            if (c != '\n' && c != '\r')
            {
                buf[i] = c;
                i++;
            }
            else
            {
                /* 碰到回车换行   */
                err = 0;
                break;
            }
        }
    }

    buf[i] = '\0';

    if (err && (i == 0))
    {
        /* 读到文件尾部了并且一个数据都没有读进来 */
        return -1;
    }
    else
    {
        return i;
    }
}

void process_data(unsigned char *data_buf, unsigned char *result_buf)
{
    /* 示例1: data_buf = ",语文,数学,英语,总分,评价" 
     *        result_buf = ",语文,数学,英语,总分,评价" 
     * 示例2: data_buf = "张三,90,91,92,," 
     *        result_buf = "张三,90,91,92,273,A+" 
     *
     */

    char name[100];
    int scores[3];
    int sum;
    char *levels[] = {"A+", "A", "B"};
    int level;

    if (data_buf[0] == 0xef) /* 对于UTF-8编码的文件,它的前3个字符是0xef 0xbb 0xbf */
    {
        strcpy(result_buf, data_buf);
    }
    else
    {
        sscanf(data_buf, "%[^,],%d,%d,%d,", name, &scores[0], &scores[1], &scores[2]);
        //printf("result: %s,%d,%d,%d\n\r", name, scores[0], scores[1], scores[2]);
        //printf("result: %s --->get name---> %s\n\r", data_buf, name);
        sum = scores[0] + scores[1] + scores[2];
        if (sum >= 270)
            level = 0;
        else if (sum >= 240)
            level = 1;
        else
            level = 2;

        sprintf(result_buf, "%s,%d,%d,%d,%d,%s", name, scores[0], scores[1], scores[2], sum, levels[level]);
        //printf("result: %s", result_buf);
    }
}

/*
 * ./process_excel data.csv  result.csv
 * argc    = 3
 * argv[0] = "./process_excel"
 * argv[1] = "data.csv"
 * argv[2] = "result.csv"
 */

int main(int argc, char **argv)
{
    int fd_data, fd_result;
    int i;
    int len;
    unsigned char data_buf[1000];
    unsigned char result_buf[1000];

    if (argc != 3)
    {
        printf("Usage: %s <data csv file> <result csv file>\n", argv[0]);
        return -1;
    }

    fd_data = open(argv[1], O_RDONLY);
    if (fd_data < 0)
    {
        printf("can not open file %s\n", argv[1]);
        perror("open");
        return -1;
    }
    else
    {
        printf("data file fd = %d\n", fd_data);
    }

    fd_result = open(argv[2], O_RDWR | O_CREAT | O_TRUNC, 0644);
    if (fd_result < 0)
    {
        printf("can not create file %s\n", argv[2]);
        perror("create");
        return -1;
    }
    else
    {
        printf("resultfile fd = %d\n", fd_result);
    }

    while (1)
    {
        /* 从数据文件里读取1行 */
        len = read_line(fd_data, data_buf);
        if (len == -1)
        {
            break;
        }

        //if (len != 0)
        //    printf("line: %s\n\r", data_buf);

        if (len != 0)
        {
            /* 处理数据 */
            process_data(data_buf, result_buf);
            
            /* 写入结果文件 */
            //write_data(fd_result, result_buf);
            write(fd_result, result_buf, strlen(result_buf));

            write(fd_result, "\r\n", 2);
        }

    }

    close(fd_data);
    close(fd_result);

    return 0;
}
```

score.csv内容如下：

```c
,语文,数学,英语,总分,评价
张三,90,91,92,,
李四,80,81,82,,
王五,70,71,72,,
```

  执行以下命令编译、运行:

```c
baiwen@dshanpi-a1:~/code/04_fileio/05_process_excel$ gcc process_excel.c -o process_excel
baiwen@dshanpi-a1:~/code/04_fileio/05_process_excel$ ls
process_excel  process_excel.c  score.csv
baiwen@dshanpi-a1:~/code/04_fileio/05_process_excel$ ./process_excel score.csv result.csv
data file fd = 3
resultfile fd = 4
baiwen@dshanpi-a1:~/code/04_fileio/05_process_excel$ cat result.csv
,2660,0,13056,15716,A+
张三,90,91,92,273,A+
李四,80,81,82,243,A
王五,70,71,72,213,B
```

## 7. 文件IO系统调用内部机制

<img src={require('./images/03-basicfileoperations-02.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  以open/read为例，从用户态调用API触发异常进入内核的过程如图 4.2所示，最后调用的sys\_call\_table的函数指针数组如下：

```c
/* 0 */ CALL(sys_restart_syscall)

    CALL(sys_exit)
    CALL(sys_fork)
    CALL(sys_read)
    CALL(sys_write)

    /* 5 */ CALL(sys_open)
    CALL(sys_close)
    CALL(sys_ni_syscall)
    CALL(sys_creat)
    CALL(sys_link)

    /* 10 */CALL(sys_unlink)
    CALL(sys_execve)
    CALL(sys_chdir)
    CALL(OBSULETE(sys_time))
```

## 8. 内核的sys\_open、sys\_read会做什么？

<img src={require('./images/03-basicfileoperations-03.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  从图 4.3可以看出，进入内核后，sys\_read/open会首先根据参数判断文件的类型，然后根据不同的文件类型去找不同的设备驱动，继而进行读写或者输入输出控制。

## 9. dup函数的使用

  dup 函数用于复制文件描述符，其核心功能是创建一个新的文件描述符，使其与原描述符指向相同的文件表项。

**函数原型**:

**int dup(int oldfd);**

-   参数 ：oldfd 是要复制的已存在的文件描述符。
-   返回值 ：成功时返回最小的未被使用的文件描述符；失败返回 -1 并设置 errno 。

本节dup.c源码如下:

```c
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char **argv)
{
    char buf[10];
    char buf2[10];

    if (argc != 2)
    {
        printf("Usage: %s <file>\n", argv[0]);
        return -1;
    }

    int fd = open(argv[1], O_RDONLY);
    int fd2 = open(argv[1], O_RDONLY);
    int fd3 = dup(fd);

    printf("fd = %d\n", fd);
    printf("fd2 = %d\n", fd2);
    printf("fd3 = %d\n", fd3);

    if (fd < 0 || fd2 < 0 || fd3 < 0)
    {
        printf("can not open %s\n", argv[1]);
        return -1;
    }

    read(fd, buf, 1);
    read(fd2, buf2, 1);

    printf("data get from fd : %c\n", buf[0]);
    printf("data get from fd2: %c\n", buf2[0]);

    read(fd3, buf, 1);
    printf("data get from fd3: %c\n", buf[0]);

    return 0;
}
```

  执行以下命令编译、运行：

```c
baiwen@dshanpi-a1:~/code/04_fileio/07_dup$ gcc dup.c -o dup
baiwen@dshanpi-a1:~/code/04_fileio/07_dup$ echo abc > 1.txt
baiwen@dshanpi-a1:~/code/04_fileio/07_dup$ ./dup 1.txt
fd = 3
    fd2 = 4
    fd3 = 5
    data get from fd : a
data get from fd2: a
data get from fd3: b
```