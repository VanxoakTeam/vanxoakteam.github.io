---
sidebar_position: 6
---

# 网络编程

:::tip 提示

本指南将指导您如何编写**网络程序**代码。


:::

## 1. Socket介绍

  套接字（socket）是 Linux 下的一种进程间通信机制（socket IPC），使用 socket IPC 可以使得在不同主机上的应用程序之间进行通信（网络通信），当然也可以是同一台主机上的不同应用程序。socket IPC 通常使用客户端 &lt;---&gt; 服务器这种模式完成通信，多个客户端可以同时连接到服务器中，与服务器之间完成数据交互。

  内核向应用层提供了 socket 接口，我们只需要调用 socket 接口开发自己的应用程序即可！socket 是应用层与 TCP/IP 协议通信的中间软件抽象层，它是一组接口。

## 2. TCP编程介绍

  使用socket编程需要在我们的应用程序代码中包含以下头文件：

```c
#include <sys/types.h>
#include <sys/socket.h>
```

### 2.1 socket()函数

```c
int socket(int domain, int type, int protocol)
```

  socket()函数类似于 open()函数，它用于创建一个网络通信端点（打开一个网络通信），如果成功则返回 。

  一个网络文件描述符，通常把这个文件描述符称为 socket 描述符（socket descriptor），这个 socket 描述符跟文件描述符一样，后续的操作都有用到它，把它作为参数，通过它来进行一些读写操作。该函数包括3个参数：

-   参数 domain 用于指定一个通信域；这将选择将用于通信的协议族，对于tcp/ip协议来说，通常选择AF\_INET就可以了。如果IP 协议的版本支持 IPv6，那么可以选择 AF\_INET6。
-   参数 type 指定套接字的类型。
-   参数 protocol 通常设置为 0，表示为给定的通信域和套接字类型选择默认协议。
-   当对同一域和套接字类型支持多个协议时，可以使用 protocol 参数选择一个特定协议。

  调用socket()与调用open()函数很类似，调用成功情况下，均会返回用于文件I/O 的文件描述符，只不过对于socket()来说，其返回的文件描述符一般称为socket 描述符。当不再需要该文件描述符时，可调用close()函数来关闭套接字，释放相应的资源。如果socket()函数调用失败，则会返回-1，并且会设置 errno 变量以指示错误类型。

  下列是调用socket函数的一般过程，使用示例如下：

```c
int socket_fd = socket(AF_INET, SOCK_STREAM, 0);	//打开套接字 套接字类型为用于 TCP 协议
if(socket_fd < 0)
{
    perror("socket error");
    exit(-1);
}

.....

    close(socket_fd);	//关闭套接字
```

### 2.2 bind()函数

```c
int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
```

  bind()函数用于将一个 IP 地址或端口号与一个套接字进行绑定（将套接字与地址进行关联）。一般来讲，会将一个服务器的套接字绑定到一个众所周知的地址---即一个固定的与服务器进行通信的客户端应用程序提前就知道的地址(注意这里说的地址包括 IP 地址和端口号）。

  因为对于客户端来说，它与服务器进行通信，首先需要知道服务器的 IP 地址以及对应的端口号。

该函数包括三个参数，如下所示：

-   参数socketfd是一个指定的套接字。调用 bind()函数将参数 sockfd 指定的套接字与一个地址 addr 进行绑定，成功返回 0，失败情况下返回- 1，并设置 errno 以提示错误原因。
-   参数addr 是一个指针，指向一个struct sockaddr的变量。

  sockaddr 的原型如下所示

```c
struct sockaddr {
    sa_family_t sa_family;
    char sa_data[14];
}
```

  sa\_data 是一个 char 类型数组，一共 14 个字节，在这 14 个字节中就包括了 IP 地址、端口号等信息，这个结构对用户并不友好，它把这些信息都封装在了 sa\_data 数组中

  一般我们在使用的时候都会使用 struct sockaddr\_in 结构体，sockaddr\_in 和 sockaddr 是并列的结构（占用的空间是一样的），指向 sockaddr\_in 的结构体的指针也可以指向 sockadd 的结构体，并代替它，而且sockaddr\_in 结构对用户将更加友好，在使用的时候进行类型转换就可以了。这个sockaddr\_in结构体如下所示：

```c
struct sockaddr_in {
    sa_family_t sin_family; /* 协议族 */
    in_port_t sin_port; /* 端口号 */
    struct in_addr sin_addr; /* IP 地址 */
    unsigned char sin_zero[8];
};
```

  这个结构体的第一个字段是与 sockaddr 结构体是一致的，而剩下的字段就是 sa\_data 数组连续的14 字节信息里面的内容，只不过从新定义了成员变量而已，sin\_port 字段是我们需要填写的端口号信息，而 sin\_addr字段是我们需要填写的 IP 地址信息，剩下 sin\_zero 区域的 8 字节保留未用。

  使用bind函数的示例如下：

```c
struct sockaddr_in socket_addr;
memset(&socket_addr, 0x0, sizeof(socket_addr)); //清零

//填充变量
socket_addr.sin_family = AF_INET;
socket_addr.sin_addr.s_addr = htonl(INADDR_ANY);
socket_addr.sin_port = htons(5555);

//将地址与套接字进行关联、绑定
bind(socket_fd, (struct sockaddr *)&socket_addr, sizeof(socket_addr));
```

  代码中的 htons 和 htonl 并不是函数，只是一个宏定义，主要的作用在于为了避免大小端的问题， 另外引用这些宏需要在我们的应用程序代码中包含头文件 `&lt;netinet/in.h&gt;`

### 2.3 listen()函数

  listen()函数只能在服务器进程中使用，让服务器进程进入监听状态，等待客户端的连接请求，listen()函 数在一般在 bind()函数之后调用，在 accept()函数之前调用，另外无法在一个已经连接的套接字（即已经成功执行 connect()的套接字或由 accept()调用返回的套接字）上 执行 listen()。listen函数原型如下所示：

```c
int listen(int sockfd, int backlog);
```

  参数 backlog 用来描述 sockfd 的等待连接队列能够达到的最大值。这个 backlog 参数告诉内核使用这个数值作为队列的上限。而当一个客户端的连接请求到达并且该队列为满时，客户端可能会收到一个表示连接失败的错误，本次请求会被丢弃不作处理。

### 2.4 accept()函数

  服务器调用listen()函数之后，就会进入到监听状态，等待客户端的连接请求，使用 accept()函数获取客 户端的连接请求并建立连接。accept函数原型如下所示:

```c
int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);
```

-   参数 addr 是一个传出参数，参数 addr 用来返回已连接的客户端的 IP 地址与端口号等这些信息。
-   参数 addrlen 应设置为 addr 所指向的对象的字节长度，如果我们对客户端的 IP 地址与端口号这些信息不感兴趣，可以把 arrd 和 addrlen 均置为空指针 NULL

为了让客户端正常连接到服务器，服务器必须遵循以下流程：

1.  调用socket()函数打开套接字
2.  调用bind()函数将套接字和一个端口号以及IP地址进行绑定
3.  调用listen()函数让服务器进程进入监听状态，监听客户端的连接请求
4.  调用accept()函数处理到来的连接请求

  accept()函数通常只用于服务器应用程序中，如果调用accept()函数时，并没有客户端请求连接（等待连 接队列中也没有等待连接的请求），此时accept()会进入阻塞状态，直到有客户端连接请求到达为止。当有 客户端连接请求到达时，accept()函数与远程客户端之间建立连接，accept()函数返回一个新的套接字。

  这个套接字与 socket()函数返回的套接字并不同，socket()函数返回的是服务器的套接字（以服务器为例），而accept()函数返回的套接字连接到调用 connect()的客户端，服务器通过该套接字与客户端进行数据交互，比如向客户端发送数据、或从客户端接收数据。

  accept()函数的关键点在于它会创建一个新的套接字，其实这个新的套接字就是与执行connect()（客户端调用 connect()向服务器发起连接请求）的客户端之间建立了连接，这个套接字代表了服务器与客户端的一个连接。如果 accept()函数执行出错，将会返回-1，并会设置 errno 以指示错误原因。

### 2.5 connect()函数

```c
int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
```

该函数用于客户端应用程序中，客户端调用 connect()函数将套接字 sockfd 与远程服务器进行连接。

-   参数 addr 指定了待连接的服务器的 IP 地址以及端口号等信息
-   参数 addrlen 指定了 addr 指向的 struct sockaddr 对象的字节大小。

  客户端通过 connect()函数请求与服务器建立连接，对于 TCP 连接来说，调用该函数将发生 TCP 连接的 握手过程，并最终建立一个 TCP 连接，而对于 UDP 协议来说，调用这个函数只是在 sockfd 中记录服务器 IP 地址与端口号，而不发送任何数据。

  函数调用成功则返回 0，失败返回-1，并设置 errno 以指示错误原因

### 2.6 发送和接受函数

  一旦客户端与服务器建立好连接之后，我们就可以通过套接字描述符来收发数据了。对于客户端使用socket()返回的套接字描述符，而对于服务器来说，需要使用 accept()返回的套接字描述符。可以调用 read()或 recv()函数读取网络数据，调用 write()或 send()函数发送 数据。

#### 2.6.1 接收函数

**read()函数**：

  通过 read()函数从一个文件描述符中读取指定字节大小的数据并放入到指定的缓冲区中，read()调用成功将返回读取到的字节数。套接字描述符也是文件描述符，所以使用 read()函数读取网络数据时，read()函数的参数 fd 就是对应的套接字描述符。

**recv()函数**：

```c
ssize_t recv(int sockfd, void *buf, size_t len, int flags);
```

不论是客户端还是服务器都可以通过 revc()函数读取网络数据，它与 read()函数的功能是相似的。

-   参数 sockfd 指定套接字描述符
-   参数 buf 指向了一个数据接收缓冲区
-   参数 len 指定了读取数据的字节大小
-   参数 flags 可以指定一些标志用于控制如何接收数据。

  函数 recv()与 read()很相似，但是 recv()可以通过指定 flags 标志来控制如何接收数据。通常我们将flags参数设置为0。

#### 2.6.2 发送函数

**write()函数**：

  通过 write()函数可以向套接字描述符中写入数据，函数调用成功返回写入的字节数，失败返回-1，并设置 errno 变量。

**send()**函数：

```c
ssize_t send(int sockfd, const void *buf, size_t len, int flags);
```

  send 和 write 很相似，但是 send 可以通过参数 flags 指定一些标志，来改变处理传输数据的方式。即使 send()成功返回，也并不表示连接的另一端的进程就一定接收了数据，我们所能保证的只是当 send 成功返回时，数据已经被无错误的发送到网络驱动程序上。

### 2.7 错误处理

  在 Socket 编程 中，当系统调用（如 `socket()`, `bind()`, `listen()`, `accept()`, `connect()`, `send()`, `recv()` 等）失败时，返回值通常为 `-1`。此时，可以通过全局变量 `errno` 获取具体的错误码，`errno` 包含了导致函数失败的具体原因。错误码可以通过 `perror()` 或 `strerror(errno)` 函数输出为人类可读的错误信息。

  以下是一些常见的错误码和其对应的含义，这些错误码可以帮助你快速诊断网络编程中的问题：

`**ECONNREFUSED**` **- 连接被拒绝**

> **含义**：目标主机拒绝连接，通常是因为目标端口上没有服务在监听。
>
> **常见场景**：客户端尝试连接一个没有启动服务的服务器，或者服务器上指定端口没有开启。
>
> **调试方法**：
>
> 确认目标服务器在目标端口上是否正在运行并监听。
>
> 确认防火墙或其他网络设置没有阻止连接。

`**ETIMEDOUT**` **- 连接超时**

> **含义**：连接请求超时。客户端尝试连接服务器时，超出了指定的时间。
>
> **常见场景**：服务器响应缓慢或者网络不稳定，导致连接在一定时间内无法建立。
>
> **调试方法**：
>
> 检查网络连接质量，特别是在低带宽或高延迟的情况下。
>
> 检查服务器是否正常响应连接请求。

`**EADDRINUSE**` **- 地址已被使用**

> **含义**：尝试绑定（`bind()`）到一个已经被使用的地址和端口组合上，通常是端口被占用。
>
> **常见场景**：服务器程序已经在某个端口上运行，或同一台机器上有其他进程占用了该端口。
>
> **调试方法**：
>
> 使用 `netstat` 或 `ss` 命令检查端口是否被占用。
>
> 选择一个未被占用的端口进行绑定。

`**EACCES**` **- 权限拒绝**

> **含义**：没有权限绑定到指定的地址和端口，通常发生在使用小于 `1024` 的端口号时（需要管理员权限）。
>
> **常见场景**：尝试绑定到受限端口（如 80, 443）时，普通用户权限不足。
>
> **调试方法**：
>
> 确认进程是否具有足够的权限，尝试使用 `sudo` 启动程序。

`**ENOTSOCK**` **- 不是一个套接字**

> **含义**：指定的文件描述符不是一个有效的套接字。通常是在错误地使用了非套接字的文件描述符。
>
> **常见场景**：调用 `send()` 或 `recv()` 时，文件描述符不指向一个有效的套接字。
>
> **调试方法**：
>
> 检查套接字的创建和操作流程，确保文件描述符指向有效的套接字。

`**EFAULT**` **- 错误的地址**

> **含义**：提供给系统调用的地址无效或指针错误。
>
> **常见场景**：传递给 `send()` 或 `recv()` 的缓冲区指针无效。
>
> **调试方法**：
>
> 确认传递给系统调用的地址是合法的，并且指针指向的内存已正确分配。

`**EHOSTUNREACH**` **- 主机不可达**

> **含义**：目标主机不可达，通常是由于网络路由或连接问题。
>
> **常见场景**：网络配置错误、目标主机离线、路由问题。
>
> **调试方法**：
>
> 检查网络连接，使用 `ping` 命令检查目标主机是否可达。
>
> 检查路由设置和防火墙配置。

另外使用 `perror()`函数可以在标准错误输出中打印一个错误信息，并附带上 `errno` 中保存的错误描述。`perror()` 会自动根据 `errno` 的值输出对应的错误信息。

**示例**：

```c
int sockfd = socket(AF_INET, SOCK_STREAM, 0);
if (sockfd < 0) {
    perror("Socket creation failed");
    exit(EXIT_FAILURE);
}
```

### 2.8 close()函数

  当不再需要套接字描述符时，可调用 close()函数来关闭套接字，释放相应的资源。

## 3. UDP编程介绍

  UDP（User Datagram Protocol，用户数据报协议）是一种无连接、简单的传输层协议。与 TCP 相比，UDP 提供了更轻量级的通信方式，因为它不需要建立连接、维持连接状态或进行流量控制。它主要用于对时延和带宽要求比较高的应用场景，例如实时通信、视频流和DNS查询等。udp 协议有以下特点：

-   **无连接**：UDP 是一种无连接的协议，不需要在数据传输前建立和维持连接。每个 UDP 数据报都是独立的，接收端无法知道是否有其他数据报或者某个数据报的传输状态。
-   **不可靠**：UDP 不保证数据的到达、顺序或完整性。如果数据包丢失、重复或顺序错误，应用层必须自行处理这些问题。
-   **低开销**：由于缺乏连接管理和可靠性保证，UDP 相比于 TCP 有更低的协议开销，适合需要高效传输的应用。
-   **数据报传输**：UDP 是基于数据报的，每个数据包都是独立传输的，大小限制在 65,535 字节（包括头部和数据部分）。
-   **适用于实时应用**：UDP 非常适合要求低延迟的应用，如 VoIP、视频流、多媒体广播等。

### 3.1 UDP 头部结构

  UDP 头部结构非常简单，仅包含以下四个字段：

| 字段 | 长度 | 说明 |
| --- | --- | --- |
| 源端口号 | 16 位 | 发送端的端口号 |
| 目标端口号 | 16 位 | 接收端的端口号 |
| 长度 | 16 位 | 数据报的总长度（包括头部和数据部分） |
| 校验和 | 16 位 | 用于检验数据报的完整性 |

  **UDP 头部** 总长度为 8 字节。

### 3.2 UDP 与 TCP 的对比

| 特性 | UDP | TCP |
| --- | --- | --- |
| 连接方式 | 无连接 | 面向连接 |
| 可靠性 | 不可靠 | 可靠（通过重传机制保证） |
| 顺序保证 | 不保证 | 保证数据顺序 |
| 流量控制 | 无流量控制 | 支持流量控制 |
| 拥塞控制 | 无拥塞控制 | 有拥塞控制 |
| 头部开销 | 小（8 字节） | 大（20 字节） |
| 使用场景 | 实时通信、视频流、DNS、VoIP 等 | 文件传输、网页浏览、电子邮件等 |

### 3.3 UDP 编程

  在 **UDP 编程** 中，应用程序与 TCP 编程非常相似，区别主要体现在连接的建立、数据发送和接收的方式。与 TCP 的“连接导向”不同，UDP 是“无连接”的。

#### 3.3.1 创建 UDP 套接字

  UDP 使用 `SOCK_DGRAM` 类型的套接字来创建。

```c
int sockfd = socket(AF_INET, SOCK_DGRAM, 0);
if (sockfd < 0) {
    perror("Socket creation failed");
    exit(EXIT_FAILURE);
}
```

#### 3.3.2 发送数据

  通过 `sendto()` 函数将数据发送到目标地址。

```c
struct sockaddr_in dest_addr;
dest_addr.sin_family = AF_INET;
dest_addr.sin_port = htons(8080);
dest_addr.sin_addr.s_addr = inet_addr("192.168.1.1");

const char *message = "Hello, UDP!";
int sent_bytes = sendto(sockfd, message, strlen(message), 0, (struct sockaddr *)&dest_addr, sizeof(dest_addr));
if (sent_bytes < 0) {
    perror("Send failed");
    close(sockfd);
    exit(EXIT_FAILURE);
}
```

#### 3.3.3 接收数据

  通过 `recvfrom()` 函数接收数据。

```c
struct sockaddr_in src_addr;
socklen_t addr_len = sizeof(src_addr);
char buffer[1024];
int recv_bytes = recvfrom(sockfd, buffer, sizeof(buffer), 0, (struct sockaddr *)&src_addr, &addr_len);
if (recv_bytes < 0) {
    perror("Receive failed");
    close(sockfd);
    exit(EXIT_FAILURE);
}
buffer[recv_bytes] = '\0';  // Null-terminate the received message
printf("Received message: %s\n", buffer);
```

#### 3.3.4 绑定端口

  通常，UDP 服务器需要绑定到一个本地端口，等待客户端发送数据。

```c
struct sockaddr_in server_addr;
server_addr.sin_family = AF_INET;
server_addr.sin_port = htons(8080);
server_addr.sin_addr.s_addr = INADDR_ANY;

if (bind(sockfd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
    perror("Bind failed");
    close(sockfd);
    exit(EXIT_FAILURE);
}
```

### 3.4 UDP 的优缺点

  **优点**：

-   低延迟：没有连接管理和重传机制，使得 UDP 可以实现更低的延迟。
-   低开销：头部和协议开销小，适合带宽有限的场景。
-   适合广播和多播：UDP 支持广播和多播，适用于一些特殊的应用场景。

**缺点**：

-   不可靠：无法保证数据的到达、顺序和完整性，应用程序需要自行处理这些问题。
-   无连接：UDP 不需要建立连接，因此也没有类似 TCP 的流量控制、拥塞控制等机制。
-   不适合需要严格可靠性保证的应用场景。

## 4. TCP编写应用程序

### 4.1 板卡作为服务端

  将板卡作为服务端，监听客户端的请求：

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>

#define SERVER_PORT 8080

int main(int argc,char *argv[])
{
    struct sockaddr_in server_addr = {0};
    struct sockaddr_in client_addr = {0};

    char ip_str[20] = {0};
    int socket_fd,connect_fd;
    int addrlen = sizeof(client_addr);
    char recvbuf[512];
    int ret;

    // 1- 打开套接字，得到套接字描述符
    socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (socket_fd<0)
    {
        perror("socket error");
        exit(EXIT_FAILURE);
    }

    // 2- 将套接字与指定端口号进行绑定
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    server_addr.sin_port = htons(SERVER_PORT);

    ret = bind(socket_fd, (struct sockaddr *)&server_addr, sizeof(server_addr));
    if (ret<0)
    {
        perror("bind error");
        close(socket_fd);
        exit(EXIT_FAILURE);
    }

    // 3- 监听
    ret = listen(socket_fd, 50);
    if (ret<0)
    {
        perror("listen error");
        close(socket_fd);
        exit(EXIT_FAILURE);
    }

    // 4- 阻塞等待客户端连接
    connect_fd = accept(socket_fd, (struct sockaddr *)&client_addr, &addrlen);
    if (connect_fd<0)
    {
        perror("accept error");
        close(socket_fd);
        exit(EXIT_FAILURE);
    }

    printf("有客户端接入...\n");
    inet_ntop(AF_INET, &client_addr.sin_addr.s_addr, ip_str, sizeof(ip_str));
    printf("客户端主机的 IP 地址: %s\n", ip_str);
    printf("客户端进程的端口号: %d\n", client_addr.sin_port);

    // 5-  接收客户端发送过来的数据
    while(1)
    {
        // 接收缓冲区清零
        memset(recvbuf, 0x0, sizeof(recvbuf));
        // 读数据
        ret = recv(connect_fd, recvbuf, sizeof(recvbuf), 0);
        if(0 >= ret)
        {
            perror("recv error");
            close(connect_fd);
            break;
        }
        // 将读取到的数据以字符串形式打印出来
        printf("from client: %s\n", recvbuf);
        // 如果读取到"exit"则关闭套接字退出程序
        if (0 == strncmp("exit", recvbuf, 4))
        {
            printf("server exit...\n");
            close(connect_fd);
            break;
        }
    }

    // 6- 关闭套接字
    close(socket_fd);
    exit(EXIT_SUCCESS);

}
```

运行程序，使用网络调试助手进行连接，网络调试助手作为客户端，板卡作为服务器，进行连接，传输数据。

### 4.2 板卡作为客户端

  将板卡作为客户端，连接服务器：

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>

#define SERVER_IP "192.168.20.84"
#define SERVER_PORT 8080

int main(int argc,char *argv[])
{
    struct sockaddr_in server_addr = {0};
    struct sockaddr_in client_addr = {0};

    char ip_str[20] = {0};
    int socket_fd,connect_fd;
    int addrlen = sizeof(client_addr);
    char buf[512];
    int ret;

    // 1- 打开套接字，得到套接字描述符
    socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (socket_fd<0)
    {
        perror("socket error");
        exit(EXIT_FAILURE);
    }

    // 2- 将套接字与指定端口号进行绑定
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(SERVER_PORT);
    inet_pton(AF_INET, SERVER_IP, &server_addr.sin_addr);

    ret = connect(socket_fd, (struct sockaddr*)&server_addr, sizeof(server_addr));

    if (ret <0)
    {
        perror("connect error");
        close(socket_fd);
        exit(EXIT_FAILURE);
    }

    printf("server get success ...\n");

    // 5-  接收客户端发送过来的数据
    while(1)
    {
        // 接收缓冲区清零
        memset(buf, 0x0, sizeof(buf));

        // 接收用户输入的字符串数据
        printf("Please enter a string: ");
        fgets(buf, sizeof(buf), stdin);

        // 将用户输入的数据发送给服务器
        ret = send(socket_fd, buf, strlen(buf), 0);
        if(0 > ret)
        {
            perror("send error");
            break;
        }
        //输入了"exit"，退出循环
        if(0 == strncmp(buf, "exit", 4))
            break;
    }

    // 6- 关闭套接字
    close(socket_fd);
    exit(EXIT_SUCCESS);

}
```

使用网络调试助手，协议类型选择 TCP Server，板卡作为客户端，网络调试助手作为服务器，连接后进行数据传输。
