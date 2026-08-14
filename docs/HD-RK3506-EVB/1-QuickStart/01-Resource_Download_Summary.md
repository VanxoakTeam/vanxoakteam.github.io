---
sidebar_position: 1
---

# 资源下载链接汇总

:::tip 必读

万象奥科 HD-RK3506-EVB 开发板配套使用 HD-RK3506G-CORE 核心板，核心板采用 NAND 闪存，外观如下图所示：

全部配套资源也可以前往 [HD-RK3506-EVB 下载中心](https://download.vanxoak.com/products/hd-rk3506-evb/) 按目录浏览。下载完成后，建议使用下载中心提供的 MD5 校验值核对文件完整性。

:::

<img src={require('./images/nand.png').default} alt="5304f141-1a09-4b83-b921-796a5bc33097.png" className="doc-image--40" />

## 1. 软件参考资料

| 类目             | 系统          | 存储     | 下载                                                         | 备注                                      |
| ---------------- | ------------- | -------- | ------------------------------------------------------------ | ----------------------------------------- |
| ⚙系统固件        | 📘 Linux       | NAND     | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/firmware/HD-RK3506G-EVB-800x480-RGB-20260617.zip) | 适配 **5 英寸 RGB** 显示屏，分辨率为 800×480   |
|                  | 📘 Linux       | NAND     | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/firmware/HD-RK3506G-EVB-1024x600-MIPI-20260617.zip) | 适配 **7 英寸 MIPI** 显示屏，分辨率为 1024×600 |
|                  | 📘 Linux       | SD 卡启动 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/firmware/HD-RK3506G-EVB-800x480-RGB-SD-20260617.zip) | 适配 **5 英寸 RGB** 显示屏，分辨率为 800×480   |
|                  | 📘 Linux       | SD 卡启动 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/firmware/HD-RK3506G-EVB-1024x600-MIPI-SD-20260617.zip) | 适配 **7 英寸 MIPI** 显示屏，分辨率为 1024×600 |
| 🛠 刷机软件及驱动 | 📒 刷机软件    |          | [点击下载](https://download.vanxoak.com/files/common/tools/RKDevTool_Release_v3.32.zip) | RKDevTool_Release_v3.32.zip               |
|                  | 📒 刷机驱动    |          | [点击下载](https://download.vanxoak.com/files/common/tools/DriverAssitant_v5.13.zip) | DriverAssitant_v5.13.zip                  |
| 🛠 SDK 开发       | 📒 SDK 源码    |          | [进入 SDK 下载目录](https://download.vanxoak.com/products/hd-rk3506-evb/sdk/) | 提供完整包、基础包+HD-RK3506-EVB补丁包             |
|                  | 📒 交叉编译工具链 |       | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/cross-compilation-tools/arm-buildroot-linux-gnueabihf_sdk-buildroot-20260326.tar.gz) | arm-buildroot-linux-gnueabihf_sdk-buildroot-20260326.tar.gz |
| 🛠 开发工具       | 📒 开发工具软件 |          | [Common-software-tools.zip](https://download.vanxoak.com/files/common/tools/Common-software-tools.zip)<br/>[VMware Workstation Pro 17.6.1](https://download.vanxoak.com/files/common/tools/VMware-workstation-full-17.6.1.zip)<br/>[SSCOM32.zip](https://download.vanxoak.com/files/common/tools/SSCOM32.zip)<br/>[SDDiskTool_v1.78.zip](https://download.vanxoak.com/files/common/tools/SDDiskTool_v1.78.zip) | 常用开发环境、串口调试和 SD 卡工具 |
| 🛠 应用示例       | 📒 LVGL 9 UI 示例 |       | [lvgl_ui_demo.zip](https://download.vanxoak.com/files/products/hd-rk3506-evb/apps/lvgl_ui_demo.zip) | LVGL 9 UI 外部交叉编译示例源码 |


---

## 2. 硬件参考资料

### 2.1 RK3506G 邮票孔核心板

| 产品型号 | **类目** | **下载** | **备注** |
| --- | --- | --- | --- |
| HD-RK3506G-CORE V1.0 | 📗DXF结构文件 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/rk3506g-core/HD-RK3506G-CORE%20V1.0-DXF.rar) | HD-RK3506G-CORE V1.0 DXF结构文件 |
| 核心板如下左图所示 | 📗装配图/丝印图 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/rk3506g-core/HD-RK3506G-CORE%20V1.0-AssemblyDrawing.rar) | HD-RK3506G-CORE V1.0装配图与丝印资料 |
|  | 📗数据手册 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/rk3506g-core/HD-RK3506G-CORE%20V1.0-Datasheet.pdf) | HD-RK3506G-CORE V1.0数据手册 |
|  | 📗引脚分配表 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/rk3506g-core/HD-RK3506G-CORE%20V1.0-PinList.xlsx) | HD-RK3506G-CORE V1.0 引脚列表 |

---

<div style={{display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0'}}>
  <img src={require('./images/core.png').default} alt="USB供电烧录" className="doc-image--40" />
  <img src={require('./images/evb.png').default} alt="12s" className="doc-image--50" />
</div>

### 2.2 HD-RK3506-EVB 底板

| 产品型号 | **类目** | **下载** | **备注** |
| --- | --- | --- | --- |
| HD-RK3506-EVB V1.1 | 📗原理图PDF | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/hd-rk3506-evb-backplane/SCH_HD-RK3506-EVB-V1.1.pdf) | SCH_HD-RK3506-EVB-V1.1.pdf |
| 底板如上右图所示 | 📗立创EDA工程文件 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/hd-rk3506-evb-backplane/HD-RK3506-EVB-V1_LCEDA_Project.zip) | 使用立创EDA专业版，包含原理图与PCB工程 |
|  | 📗封装库 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/hd-rk3506-evb-backplane/HD-RK3506-EVB-Library.zip) | HD-RK3506-EVB原理图与PCB封装库 |
|  | 📗芯片手册 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/hd-rk3506-evb-backplane/Rockchip%20RK3506G2%20Datasheet%20V1.0-20240816.pdf) | Rockchip RK3506G2 Datasheet V1.0-20240816.pdf |
|  | 📗DXF结构文件 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/hd-rk3506-evb-backplane/DXF_HD-RK3506-EVB-V1.1.dxf.zip) | DXF_HD-RK3506-EVB-V1.1.dxf.zip |
|  | 📗原理图Checklist | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/hd-rk3506-evb-backplane/SCH_HD-RK3506-EVB-V1.1-Checklist.xlsx) | SCH_HD-RK3506-EVB-V1.1-Checklist.xlsx |
|  | 📗生产注意事项 | [点击下载](https://download.vanxoak.com/files/products/hd-rk3506-evb/hardware/hd-rk3506-evb-backplane/HD-RK3506-EVB-Product_Attention.rar) | HD-RK3506-EVB生产注意事项 |

---

## 3. 更新记录

| 更新日期   | 更新内容说明                              |
| ---------- | ----------------------------------------- |
| 2026/08/13 | 硬件资料、固件、工具链及开发工具下载链接统一迁移到万象奥科下载中心 |
| 2026/07/23 | 更新上传SDK、固件，上传软件资料、硬件资料 |

