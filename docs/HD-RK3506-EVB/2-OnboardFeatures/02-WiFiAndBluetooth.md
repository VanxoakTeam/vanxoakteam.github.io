---
sidebar_position: 2
---

# Wi-Fi 与蓝牙

:::tip 提示

本指南将指导您如何使用 **RK3506-EVB** 的 **Wi-Fi** 和**蓝牙**功能。


:::

## 1. Wi-Fi 的使用

Wi-Fi模块工作模式分为AP与STA模式，AP就是无线接入点，是一个无线网络的创建者，常见的AP设备就是Wi-Fi路由器，它提供房间内如手机、电脑等各类电子设备的上网需求。而STA就是作为连入热点的设备，利用Wi-Fi热点进行网络通讯，常见的STA设备就是手机。

HD-RK3506-EVB板卡默认支持以下蓝牙Wi-Fi二合一模块：

Wi-FI模组/BL-M8800US9-80I(不带天线座)/Wifi6双频/BT5.4/-40~+85℃/必联

### 1.1 STA模式

#### 步骤 1：生成配置文件

设置需要连接的Wi-Fi的名字和密码：

```shell
wpa_passphrase WIFI_SSID PASSWORD > /etc/wpa_supplicant.conf
```

> -   Wi-Fi\_SSID：Wi-Fi名字
> -   PASSWORD：Wi-Fi密码

例如： 连接`B501_2.4G`这个Wi-Fi，密码为`vanxoak8888`，则可以：

```shell
root@rk3506-buildroot:/# wpa_passphrase B501_2.4G vanxoak8888 > /etc/wpa_supplicant.conf
```

#### 步骤 2：启动配置文件

填入Wi-Fi\_SSID以及PASSWORD， 执行`udhcpc -i wlan0`获取。（事先插入Wi-Fi天线）

```shell
wpa_supplicant -B -iwlan0 -c /etc/wpa_supplicant.conf
udhcpc -i wlan0
```

#### 步骤 3：连通性验证

当Wi-Fi网络连接成功后，使用`ifconfig`命令可以看到wlan0网络接口已经自动获取了IP 地址，如下图所示：

```shell
root@rk3506-buildroot:/# ifconfig wlan0
wlan0     Link encap:Ethernet  HWaddr 48:8F:4C:5D:EA:B0  
          inet addr:192.168.20.170  Bcast:192.168.20.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:13409 errors:0 dropped:1 overruns:0 frame:0
          TX packets:8 errors:0 dropped:2 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:2233559 (2.1 MiB)  TX bytes:2208 (2.1 KiB)
```

如果Wi-Fi网络可以连接互联网，也可以直接在命令行下使用`ping`命令，`ping`某个公网网址，测试网络是否连通。例如`ping`外部网址，可在命令行下执行如下命令：

```shell
root@rk3506-buildroot:/# ping 8.8.8.8 -I wlan0
```

如果可以`ping`通表明Wi-Fi网络连接成功。

### 1.2 AP模式配置

#### 步骤 1：新建配置

在/etc/目录下新建配置hostapd.conf和udhcpd.conf。

- 文件：/etc/hostapd.conf


```shell
interface=wlan0
driver=nl80211
ssid=HD-RK3506-WIFI
channel=9
hw_mode=g
macaddr_acl=0
ignore_broadcast_ssid=0
auth_algs=1
wpa=3
wpa_passphrase=12345678
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```

> 配置项解释：
> 
> -   **interface**：Wi-Fi节点名，这里设置为wlan0
> -   **ssid**：Wi-Fi账号，这里设置为HD-RK3506-Wi-Fi
> -   **wpa\_passphrase**：Wi-Fi密码，这里设置12345678

- 文件：/etc/udhcpd.conf


```shell
start 192.168.1.2
end 192.168.1.254
interface wlan0
opt dns 114.114.114.114
option subnet 255.255.255.0
opt router 192.168.1.1
option domain local
option lease 864000
```

> **配置项解释：**
> 
> -   **start 192.168.1.2**：指定DHCP地址池的起始IP 地址为`192.168.1.2`
> -   **end 192.168.1.254**：指定DHCP地址池的结束IP 地址为`192.168.1.254`
> -   **interface wlan0**：指定DHCP服务将在名为`wlan0`的网络接口上运行
> -   **opt dns 114.114.114.114**：设置由DHCP服务器分发给客户端的首选DNS服务器地址为`114.114.114.114`
> -   **option subnet 255.255.255.0**：指定子网掩码为`255.255.255.0`
> -   **opt router 192.168.1.1**：设置默认网关为`192.168.1.1`

#### 步骤 2：开启热点

执行如下命令开启热点。

```shell
ifconfig wlan0 up 192.168.1.18                 # 保持跟dhcpd同网段
touch /var/lib/misc/udhcpd.leases              # 保证udhcpd正常运行 
udhcpd /etc/udhcpd.conf &                      # 后台方式启动 DHCP 服务器
hostapd -B /etc/hostapd.conf &                 # 创建 Wi-Fi 热点
route add default gw 192.168.1.1 dev wlan0     # 设置默认路由
```

## 2. BT 的使用

### 2.1 蓝牙连接

实现蓝牙的广播功能，通过手机主动连接开发板，进行连接。

#### 步骤 1：执行bluetoothctl命令

```shell
root@rk3506-buildroot:/# bluetoothctl
hci0 new_settings: powered connectable discoverable bondable le secure-conn
Agent registered
[CHG] Controller DC:84:03:A1:90:41 Pairable: yes
[bluetooth]#
```

#### 步骤 2：设置广播模式

执行以下命令，配置广播模式，设置可发现、可配对。

```shell
power on                     #打开电源
system-alias rk3506          #设置名称
discoverable-timeout 0           #设置超时
discoverable on            #设置可发现
pairable o               #设置可配对

menu advertise               #进入广播配置
clear                  #清理配置
name rk3506              #设置广播名称
discoverable on            #设置可发现
back                   #返回bluetoothctl

advertise on                     #开启广播
show                             #查看配置器
```

<img src={require('./images/02-wifiandbluetooth-01.png').default} alt="企业微信截图_17767596424517.png" className="doc-image--80" />
<img src={require('./images/02-wifiandbluetooth-02.png').default} alt="企业微信截图_1776759986376.png" className="doc-image--80" />
<img src={require('./images/02-wifiandbluetooth-03.png').default} alt="企业微信截图_17767601219245.png" className="doc-image--80" />

#### 步骤 3：手机扫描，进行连接

<img src={require('./images/02-wifiandbluetooth-04.jpeg').default} alt="Screenshot_20260421_155543_cn.wch.bledemo.jpg" className="doc-image--30" />

#### 步骤 4： 连接完成

<img src={require('./images/02-wifiandbluetooth-05.jpeg').default} alt="Screenshot_20260421_155555_cn.wch.bledemo.jpg" className="doc-image--30" />

### 2.2 蓝牙数据传输

在开发板上进行数据收发，需要注册一个自定义服务，通过这个自定义服务来实现。

#### 步骤 1：注册自定义服务

执行以下命令，注册自定义服务

```shell
menu gatt                                             #进入数据传输配置菜单
register-service 00001234-0000-1000-8000-00805f9b34fb            #注册自定义服务
register-characteristic 00005678-0000-1000-8000-00805f9b34fb read,write,notify
                                             #注册特征
register-descriptor 00002902-0000-1000-8000-00805f9b34fb read,write
                                                                #注册描述符（可选）
register-application                                                    #应用注册
```

<img src={require('./images/02-wifiandbluetooth-06.png').default} alt="企业微信截图_17767634669438.png" className="doc-image--80" />

#### 步骤 2：手机断开重连

手机上断开重连就会多一个务，可以进行数据的收发了

<img src={require('./images/02-wifiandbluetooth-07.jpeg').default} alt="Screenshot_20260421_173140_cn.wch.bledemo.jpg" className="doc-image--30" />

#### 步骤 3：发送数据

断开重连后，手机发送数据，开发板自动接收数据并打印

<img src={require('./images/02-wifiandbluetooth-08.png').default} alt="企业微信截图_17767651974387.png" className="doc-image--80" />

### 2.3 bluetoothctl工具

#### 1）控制器管理

| 命令 | 说明 |
| --- | --- |
| list | 列出本机蓝牙控制器（如 hci0） |
| show [ctrl] | 显示蓝牙适配器信息（状态、地址、名称、电源状态······） |
| `select <ctrl>` | 选择蓝牙控制器 |
| power on/off | 电源控制，打开/关闭蓝牙适配器 |
| `system-alias <name>` | 设置本机蓝牙名称 |
| reset-alias | 恢复默认名称 |

#### 2）设备扫描与发现

| 命令 | 说明 |
| --- | --- |
| scan on/off/bredr/le | 扫描附近蓝牙设备 |
| `agent <on/off/auto/capability>` | 启用/关闭蓝牙配对代理 |
| default-agent | 设置代理为缺省发布 |
| devices | 查看发现的设备 |
| devices Connected | 查看已连接设备 |
| devices Paired | 查看已配对设备 |
| info [dev] | 查看远端设备详情 |

#### 3）配对与连接

| 命令 | 说明 |
| --- | --- |
| pair [dev] | 与远程设备配对 |
| cancel-pairing [dev] | 取消配对过程 |
| trust [dev] | 标记可信设备，自动连接 |
| untrust [dev] | 取消信任设备 |
| connect [dev] | 主动连接设备 |
| disconnect [dev] | 断开设备连接 |
| `remove <dev>` | 删除配对记录 |
| discoverable on/off | 设置可发现，让其他设备能搜索到本机 |
| discoverable-timeout [sec] | 设置可发现超时 |
| pairable on/off | 设置可配对，允许其他设备发起配对 |
| `advertise <on/off/type>` | BLE广播 |

#### 4）子菜单

| 命令 | 说明 |
| --- | --- |
| menu advertise | BLE广播配置（广播包、名称、UUID、厂商数据······） |
| menu gatt | GATT通信，BLE 收发数据、读写特征值 |
| menu scan | 高级扫描配置 |
| menu mgmt | 控制器管理，HCI底层参数设置 |
| menu monitor | 广播监控，监听广告包变化 |
| menu player | 媒体控制，蓝牙音乐播放控制 |
| menu endpoint | 音频端点，音频设备管理 |
| menu transport | 音频传输，音频流状态 |
| menu admin | 策略控制，安全策略、限制 |
