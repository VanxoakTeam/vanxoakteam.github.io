---
sidebar_position: 6
---

# 加密芯片 RJGT102应用编程

:::tip 提示

本指南将指导您如何通过代码程序来使用 **RJGT102 加密芯片**。


:::

## 1. 版权保护芯片RJGT102介绍

  为了防止硬件电路与固件被抄袭，核心在于加密芯片和安全解决方案的设计，目前大多MPU并不具备安全防护功能，所以最好的办法是使用一颗专用的加密芯片，通过加密芯片对接MPU，进行认证，授权，保存关键数据等。

  RJGT102采用了SHA256对称加密算法，256位的大数加密， 加密算法强度高。每片RJGT102都有唯一的客户编码，非常适合做防抄板，防抄软件，管控工厂生产数量，防止方案外泄等。

  参与SHA256运算的数据为：8字节Key（可动态更换），8字节UID，8字节随机数，8字节常数，以及32字节关键数据，共512bit数据源，不可以从消息摘要中复原信息，两个不同的消息不会产生同样的消息摘要，修改消息中的一个比特即会引起雪崩效应，输出32字节报文摘要（MAC）。

版权保护芯片的主要用途：

- 进行license授权，控制生产量；
- 进行设备接入认证，保护系统；

  目前，RK3506系列，Linux系统未做加密处理，用户可以参考以下文档，对自己的应用进行加密。

### 1.1 license授权应用

  通过license授权控制生产量从而保护产品防止被抄板进而造成利益受损，通常的管控方案如下：

  每生产一部产品就要用到一颗加密芯片，产品工作时需要认证，通过后才能正常工作，否则不能正常工作或功能受限，从而能防止抄板。通过在PCB电路板上嵌入RJGT102加密芯片，并预先烧录好认证密钥KEYD，然后在主机软件中嵌入认证程序,实现主机对芯片的认证。即便抄板者复制了PCB板，并且从存储器中直接拷贝出了CPU的二进制代码烧录进被复制的存储器中，由于烧录的程序会不时的与RJGT102加密芯片进行身份认证，因为抄板者无法获得厂商定制烧录认证密钥KEYD的RJGT102加密芯片，认证就无法通过，因此系统将无法运行，产品在进行代工生产的时候，可以通过控制烧录认证密钥的RJGT102加密芯片数量来有效控制代工生产的出货数量，也防假冒产品流入市场。

### 1.2 设备接入认证

  与license授权类似，但并不是使得非授权设备无法运行，而是在后端服务处理单元直接无视非授权设备上传的数据请求从而做到设备的认证接入，通常方案如下：

  当需要接入设备与远端服务进行通信时，接入设备上嵌入RJGT102加密芯片，并预先烧录好认证密钥KEYD，由远端服务发送随机数从而开启设备接入认证，接入设备在收到随机数后由板载RJGT102运算生成MAC，并将MAC发送给远端服务，远端服务对接入设备发送过来的MAC进行比对认证从而控制设备的接入与否。

  

## 2. RJG102认证方案流程

  第一步，在产品生产时，通过预设密钥、UID、PAGE区等关键参数来进行第三方授权，并能跟踪和确认其使用，防范非法使用程序代码。

  第二步，在产品使用时，每次上电自检，系统先通过RJGT102执行认证过程，只有具备有效密钥的RJGT102才能成功地返回有效MAC值。如果检测到无效MAC，将结束操作，其结束操作可能发生在本端（如license控制），也可能发生在远端（如接入设备认证）。

认证方案一：

  主机确认RJGT102为有效的安全芯片，认证通过后，主机程序才能进行下一步操作。生产厂商可通过对RJGT102的管理和发放来保护产品的程序、硬件电路等，有效防止软件和硬件设计等知识产权被盗版。

<img src={require('./images/06-rjgt102securitychipprogramming-01.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  上面的认证流程也可将MPU看作远端服务，而将RJGT102看作接入设备，从而控制接入设备的认证接入。

认证方案二：

  RJGT102确认主机是合法用户，认证通过后，可以对RJGT102芯片进行密钥升级，关键参数读取等操作。关键参数可以是密文形式存放，用来增强安全性。上述方案可以防止非法主机操作RJGT102。

<img src={require('./images/06-rjgt102securitychipprogramming-02.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

认证方案三：

  主机和RJGT102相互认证，认证通过后，主机可进入正常操作状态，同时可读取RJGT102中的关键参数，关键参数可以是密文形式存放，用来增强安全性。根据关键参数，主机可以选择条件执行部分子程序或完整程序。通过上述策略，主机系统可有选择的授权完整功能单元或者部分功能单元。

<img src={require('./images/06-rjgt102securitychipprogramming-03.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

## 3. RJGT102第三方应用（库函数介绍）

RJGT102内置EEPROM包含下面内容：

- 存储数据存储区： Page0，Page1，Page2，Page3各32Byte，合计128Byte；
- 密钥存储区：8Byte Key、8Byte UID和Serial Number，合计16Byte，已被固化；

- 控制存储区：16Byte的控制信息，已使用，且没有提供访问接口。

  其中存储数据的存储区内Page0已被设定并用于RJGT102的合法认证，Page1， Page2，Page3留给第三方软件使用，此部分数据可被第三方软件用于认证授权等用途。

  提供有静态库和动态库文件以及一个头文件给第三方软件来使用RJGT102，库文件为libcryproSdr.so、libcryptoSdr.a，头文件为cryproSdr.h。

  库文件提供如下函数：

```c
int CryptoSdr_Init(void);
void CryptoSdr_Close(void);
int CryptoSdr_AuthDev();
int CryptoSdr_UpdatePage(uint8_t page_id, uint8_t *page_data);
int CryptoSdr_ReadPage(uint8_t page_id, uint8_t *page_data);
int CryptoSdr_GetUsid(uint8_t *usid);
int CryptoSdr_CalMac(uint8_t *random, uint8_t page_id, uint8_t *mac);
```

- “CryptoSdr\_Init”函数用于打开RJGT102设备，第三方程序在使用libcryptoSdr提供的其它库函数前必须先调用“CryptoSdr\_Init”函数；


- “CryptoSdr\_Close”函数用于关闭RJGT102设备，第三方程序不需要再使用RJGT102设备功能时，可调用该函数来关闭与该设备的连接，以便其它程序来使用。注意，目前libcryptoSdr库不支持重入，应保证同一时间仅一个程序在使用RJGT102设备；

- “CryptoSdr\_AuthDev()”函数用于验证RJGT102设备的合法性，成功返回0，失败返回\-1，此处应尽量采用静态库，防止动态库因被替换而产生的旁路绕开验证；

- “CryptoSdr\_UpdatePage”函数用于更新Page2，Page3内的数据，**不能用于更新Page0**，page\_data为待更新的32字节数据存储空间；

- “CryptoSdr\_ReadPage”函数用于读取Page2，Page3内的数据，读取到的数据放入page\_data指向的存储空间中；

- “CryptoSdr\_GetUsid”函数用于读取USID，USID为8字节数据，读取到的数据放入usid指向的存储空间中，读取到的USID可用作设备的唯一ID；

- “CryptoSdr\_CalMac”函数用于计算MAC，其中random给到RJGT102用于计算MAC的8字节随机数，page\_id为参与MAC计算的page\_id选择，可以选择Page2、Page3中的任意一个，其对应的参数为2或3，计算返回的32字节MAC值放入mac指向的存储空间中；


  对于8字节Key以及Page0的数据不可见，但“CryptoSdr\_AuthDev()”，“CryptoSdr\_UpdatePage”，和“CryptoSdr\_ReadPage”函数都会使用到这个8字节Key，以及Page0数据来参与认证。

  “CryptoSdr\_CalMac”函数也有8字节Key参与认证，但可结合第三方应用程序设定的Page2，Page3内的数据来参与认证过程。

## 4. 应用程序示例

  RJGT102共有4块区域，**目前第1块【page\_id=0】我司有使用作为密钥验证，第二块【page\_id=1】用于其他客户的版本标识，能够使用的只有page\_id=2和page\_id=3这两个区域**，可通过CryptoSdr\_UpdatePage库函数更新，CryptoSdr\_ReadPage库函数读回。

  下面针对应用程序示例进行介绍。

### 4.1 应用程序加密验证

  使用`CryptoSdr_Init`函数，简单验证加密芯片，如果检测到加密芯片并验证成功，应用程序运行，否则直接返回，不运行用户应用程序。

```c
int main(int argc ,char *argv[])
{
    uint8_t usid[8];

    if(0 != CryptoSdr_Init())
    {
        perror("CryptoSdr_Init failed\n");
        return -1;
    }
    if(0 != CryptoSdr_AuthDev())
    {
        perror("CryptoSdr_AuthDev failed\n");
    }

    printf("CryptoSdr_AuthDev success, Application running!");
}
```

  检测到加密芯片且验证成功，应用程序运行。

<img src={require('./images/06-rjgt102securitychipprogramming-04.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

### 4.2 Page页读写以及MAC值计算

  Page页读写，只支持Page2以及Page3区域，用户可写入信息。

  用户可参考以下程序对Page页进行读写，下列示例展示对Page2页的读写。

```c
/**
 ***************************************************************************
 * @brief  产生一个32位的整型随机数
 * @param  无
 * @retval 返回一个32位的整型随机数
 ***************************************************************************
 */
static uint32_t Rand(void)
{
	uint32_t rd = rand();

    return (uint32_t)(rd / 65536L) % 32768L;
}

/**
 ***************************************************************************
 * @brief  产生8个字节的随机数
 * @param  [OUT] pRngBuf  指向存储8字节随机数的数据区
 * @retval 无
 ***************************************************************************
 */
void GenerateRandom(uint8_t *pRngBuf)
{
    uint32_t RngBuf[2];
    uint8_t  i;

	srand(getpid());
    RngBuf[0] = Rand();
    RngBuf[1] = Rand();
    for (i = 0; i < 4; i++)
    {
        pRngBuf[i] = (uint8_t)((RngBuf[0] >> (8 * i)) & 0xFF);
        pRngBuf[i + 4] = (uint8_t)((RngBuf[1] >> (8 * i)) & 0xFF);
    }
}
int main(int argc, char const *argv[])
{
	int i;
	int ret = -1;
	uint8_t page_id;
	uint8_t random[8];
	uint8_t usid[8];
	uint8_t page_data[32];
	uint8_t mac[32];

	if(0 != CryptoSdr_Init())
	{
		perror("CryptoSdr_Init failed\n");
		return -1;
	}
	if(0 != CryptoSdr_AuthDev())
	{
		perror("CryptoSdr_AuthDev failed\n");
		goto out;
	}

	page_id = 2;
	GenerateRandom(random);
	memset(page_data, 0xbb, 32);

	if(0 != CryptoSdr_UpdatePage(page_id, page_data))
	{
		perror("CryptoSdr_UpdatePage failed\n");
		goto out;
	}
	else{
		printf("CryptoSdr_UpdatePage Finished\n");
	}

	if(0 != CryptoSdr_ReadPage(page_id, page_data))
	{
		perror("CryptoSdr_ReadPage failed\n");
		goto out;
	}
	else{
		printf("CryptoSdr_ReadPage Finished\n");
		for(i=0; i<32; i++)printf("%#x ", page_data[i]);
	}
	printf("\n");

	if(0 != CryptoSdr_CalMac(random, page_id, mac))
	{
		perror("CryptoSdr_CalMac failed\n");
		goto out;
	}
	else{
		printf("CryptoSdr_CalMac Finished\n");
		for(i=0; i<32; i++)printf("%#x ", mac[i]);
	}
	printf("\n");

	memset(page_data, 0xcc, 32);
	if(0 != CryptoSdr_UpdatePage(page_id, page_data))
	{
		perror("CryptoSdr_UpdatePage failed\n");
		goto out;
	}
	else{
		printf("CryptoSdr_UpdatePage Finished\n");
	}

	if(0 != CryptoSdr_ReadPage(page_id, page_data))
	{
		perror("CryptoSdr_ReadPage failed\n");
		goto out;
	}
	else{
		printf("CryptoSdr_ReadPage Finished\n");
		for(i=0; i<32; i++)printf("%#x ", page_data[i]);
	}
	printf("\n");

	if(0 != CryptoSdr_CalMac(random, page_id, mac))
	{
		perror("CryptoSdr_CalMac failed\n");
		goto out;
	}
	else{
		printf("CryptoSdr_CalMac Finished\n");
		for(i=0; i<32; i++)printf("%#x ", mac[i]);
	}
	printf("\n");

	if(0 != CryptoSdr_GetUsid(usid))
	{
		perror("CryptoSdr_GetUsid failed\n");
		goto out;
	}
	else{
		printf("CryptoSdr_GetUsid Finished\n");
		for(i=0; i<8; i++)printf("%#x ", usid[i]);
	}
	printf("\n");

	memset(page_data, 0xbb, 32);
	if(0 != CryptoSdr_UpdatePage(page_id, page_data))
	{
		perror("CryptoSdr_UpdatePage failed\n");
		goto out;
	}
	else{
		printf("CryptoSdr_UpdatePage Finished\n");
	}

	if(0 != CryptoSdr_ReadPage(page_id, page_data))
	{
		perror("CryptoSdr_ReadPage failed\n");
		goto out;
	}
	else{
		printf("CryptoSdr_ReadPage Finished\n");
		for(i=0; i<32; i++)printf("%#x ", page_data[i]);
	}
	printf("\n");

	if(0 != CryptoSdr_CalMac(random, page_id, mac))
	{
		perror("CryptoSdr_CalMac failed\n");
		goto out;
	}
	else{
		printf("CryptoSdr_CalMac Finished\n");
		for(i=0; i<32; i++)printf("%#x ", mac[i]);
	}
	printf("\n");
	ret =0;

out:
	CryptoSdr_Close();

	return ret;
}
```

程序运行如下：

-   对page2 首先读写了32个 0xbb数据，并计算了一次MAC值。
-   再次写入32个0xcc数据，并计算了一次MAC值。
-   读取一次USID。
-   再次重写0xbb数据，再次计算MAC值

<img src={require('./images/06-rjgt102securitychipprogramming-05.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

## 5. 常见错误

### 5.1 驱动未加载

  请使用i2cdetect工具扫描加密芯片，使用以下命令。加密芯片对应的i2c地址为0x68，UU表示内核已加载此驱动。如果为68，则表示驱动未加载。

```c
root@rk3506-buildroot:~# i2cdetect -y 2
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- UU -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --
```

  RK3506 系列，请访问资料下载链接下载最新固件，`/etc/version`在20260319及以后的固件版本中，加密芯片驱动已加载。且库文件已放在开发板中，无需手动创建以及放置。

### 5.2 开发板中没有库文件

  当出现以下错误时，表示加载库文件失败。

<img src={require('./images/06-rjgt102securitychipprogramming-06.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  需要查看/usr/lib目录中是否存在`libcryproSdr.so`和`libcryptoSdr.a`。如果不存在请手动将此库文件放进`/usr/lib`目录下。

```c
root@rk3506-buildroot:~# ls /usr/lib/libcrypto
libcrypto.so    libcrypto.so.3  libcryptoSdr.a
```

  并将头文件`cryptoSdr.h`放入/usr/include文件中。

```c
root@rk3506-buildroot:~# ls /usr/include/
cryptoSdr.h
```

### 5.3 加密芯片不存在

  如果使用i2cdetect 扫描芯片不存在，表示芯片可能有问题，i2c通讯失败。无法进行以上操作，请检查芯片是否连锡、是否损坏。

## 6. 参考示例下载

  用户可下载以下软件示例源码，来验证加密芯片。

[crypto_app.zip](https://vanxoak.yuque.com/attachments/yuque/0/2026/zip/57754166/1784098629361-9cbd3f24-4272-4897-bdf9-69d00384086c.zip)

  以下是库文件以及头文件压缩包，如果开发板中没有库文件，请手动将库文件放进开发板中。

  RK3506系列使用`cryptSdr_arm`，其他RK系列（如RK3562、RK3568、RK3576等）使用`cryptSdr_aarch64`，头文件通用。

[crypto_lib.zip](https://vanxoak.yuque.com/attachments/yuque/0/2026/zip/57754166/1784098628891-8970ef7f-a1a5-4a64-b962-62508ea29392.zip)
