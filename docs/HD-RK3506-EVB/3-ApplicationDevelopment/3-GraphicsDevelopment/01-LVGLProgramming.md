---
sidebar_position: 1
---

# LVGL应用编程

:::tip 提示

本指南将指导您如何编译 **LVGL 程序**。


:::

## 1. SDK 中编译 LVGL 程序

### 1.1 新建项目

  在rk3506\_linux6.1\_v1.2.0\\app\\lvgl\_demo 下新建LVGL工程，复制一份motor\_demo，重命名为my\_demo。

<img src={require('./images/01-lvglprogramming-01.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  在CMakeLists.txt 中添加配置，增加额外配置 `LV_USE_MY_DEMO`，就以下代码进行说明。

  当变量`LV_USE_RK_DEMO`被定义时，编译`rk_demo`工程。否则编译其他工程，默认编译LV\_Widgets。

  我们新建的LVGL工程为 `my_demo`，直接在后面添加编译`my_demo`工程。

<img src={require('./images/01-lvglprogramming-02.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

### 1.2 编译

  进入rk3506\_linux6.1\_bsp/buildroot目录，执行如下指令编译rk\_demo\_test程序。

```bash
make lvgl-reconfigure lv_drivers-reconfigure lvgl_demo-reconfigure -j20
```

  生成可执行文件路径：`rk3506_linux6.1_sdk_v1.2.0/buildroot/output/rockchip_hd_rk3506g_evb_nand/build/lvgl_demo/my_demo`目录

<img src={require('./images/01-lvglprogramming-03.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

### 1.3 执行程序

  将rk\_demo\_test拷贝到RK3506开发板上，给予可执行权限。

```bash
chmod a+x motor_demo
./motor_demo
```

## 2. 单独编译 LVGL 程序

  HD-RK3506-EVB 设备默认搭载并运行基于LVGL的应用程序。LVGL是一个广受认可的、免费且开源的轻量级嵌入式图形库，专为满足嵌入式系统的图形需求而设计。

  对于大部分用户，只需要修改LVGL程序，在SDK中编译比较繁琐。所以提供了单独编译LVGL应用程序的方法。

### 2.1 准备工作

  在单独编译LVGL前，需要准备包含LVGL库的工具链。在SDK目录，使用 ./build.sh bmake:sdk 生成SDK工具链。生成工具链的目录为：buildroot/output/rockchip\_hd\_rk3506g\_evb\_nand/images/arm-buildroot-linux-gnueabihf\_sdk-buildroot.tar.gz

  **该工具链已打包，请访问资料下载章节进行下载。**

### 2.2 安装工具链

  默认安装到opt目录，命令如下：

```bash
sudo tar xvzf arm-buildroot-linux-gnueabihf_sdk-buildroot.tar.gz -C /opt
```

### 2.3 工程demo

  [lvgl_ui_demo.zip](https://vanxoak.yuque.com/attachments/yuque/0/2026/zip/57754166/1784099381354-f7e07c22-50c9-4a0a-bf3d-4146dc9c9e30.zip)

<img src={require('./images/01-lvglprogramming-04.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

#### 1）toolchain-arm.cmake

```cmake
# toolchain-arm.cmake
  set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR arm)

# 指定交叉编译工具链路径
  set(TOOLCHAIN_DIR "/opt/arm-buildroot-linux-gnueabihf_sdk-buildroot/bin")
set(CMAKE_C_COMPILER ${TOOLCHAIN_DIR}/arm-buildroot-linux-gnueabihf-gcc)
set(CMAKE_CXX_COMPILER ${TOOLCHAIN_DIR}/arm-buildroot-linux-gnueabihf-g++)

# 指定sysroot
  set(CMAKE_SYSROOT "/opt/arm-buildroot-linux-gnueabihf_sdk-buildroot/arm-buildroot-linux-gnueabihf/sysroot")

# 设置查找规则（只在sysroot中查找库和头文件）
  set(CMAKE_FIND_ROOT_PATH ${CMAKE_SYSROOT})
set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)
```

  toolchain-arm.cmake用来指定交叉工具链。

#### 2）lvgl9目录

  lvgl9目录中，主要是LVGL9和硬件适配的接口，已经调整OK，不用修改。

#### 3）main

```c
#include <lvgl/lvgl.h>
#include <lvgl/lv_conf.h>

#include <unistd.h>
#include <pthread.h>
#include <time.h>
#include <stdio.h>
#include <stdlib.h>

#include "main.h"
#include "lv_port_init.h"

static int quit = 0;

static void signal_handler(int sig)
{
    fprintf(stderr, "signal %d\n", sig);
    quit = 1;
}

int main(int argc, char **argv)
{
    printf("lvgl_demo - LVGL v9 Hello World Demo\n");
    printf("Platform: Rockchip RK3506\n");

    signal(SIGINT, signal_handler);

    lv_port_init(0, 0, 0);

    // 获取当前屏幕
    lv_obj_t *scr = lv_scr_act();

    // 设置屏幕背景为黑色
    lv_obj_set_style_bg_color(scr, lv_color_black(), 0);

    // 创建标签控件
    lv_obj_t *label = lv_label_create(scr);

    // 设置标签文本
    lv_label_set_text(label, "Hello World!");

    // 设置文本为白色
    lv_obj_set_style_text_color(label, lv_color_white(), 0);

    // 设置大字体（如果可用）
    const lv_font_t *font = &lv_font_montserrat_48;
    lv_obj_set_style_text_font(label, font, 0);

    // 让标签在屏幕中央显示
    lv_obj_center(label);

    printf("UI created, entering main loop...\n");

    while (!quit)
    {
        lv_task_handler();
        usleep(1000);
    }

    return 0;
}

```

  main文件是一个简单的程序，lv\_port\_init(0, 0, 0); 用来初始化lvgl。后续代码为创建一个label，进行简单显示。

### 2.4 编译

```bash
cmake -DCMAKE_TOOLCHAIN_FILE=./toolchain-arm.cmake -DCMAKE_BUILD_TYPE=Release -S . -B build

cd build
make -j8
```

  编译完成后，会在build目录得到 lvgl\_ui\_demo 文件。可直接拷贝到开发板执行，例如拷贝放到到root目录。

  注意：执行前，需要杀掉默认执行的LVGL图形化页面程序，否则可能会冲突，导致显示失败。

```bash
root@rk3506-buildroot:/root# killall lv_demo

root@rk3506-buildroot:/root# ls
lvgl_ui_demo
root@rk3506-buildroot:/root# ./lvgl_ui_demo
lvgl_demo - LVGL v9 Hello World Demo
Platform: Rockchip RK3506
[User]  (0.000, +0)      lv_port_disp_init: LV_USE_RKADK lv_port_disp.c:36
drm encode type is MIPI
[RKADK_P] {RKADK_VERSION_Dump       :021} ---------------------------------------------------------
[RKADK_P] {RKADK_VERSION_Dump       :022} rkadk version: git-f9d84ca Mon Mar 3 15:31:03 2025 +0800
[RKADK_P] {RKADK_VERSION_Dump       :023} rkadk building: built 2026-06-03 12:22:24
[RKADK_P] {RKADK_VERSION_Dump       :024} ---------------------------------------------------------
rockit_load start
v4l2_tx probe successv4l2_rx_probe success
[00315.609] vrgn_thread_fn(102): vrgn_thread_fn [102] dev(vrgn-15) register okrockit_load end
rockit log path (null), log_size = 0, can use export rt_log_path=, export rt_log_size= change
[  316.776747] rockchip-vop ff600000.vop: [drm:vop_crtc_atomic_enable] Update mode to 1024x600p49, type: 16
log_file = (nil)
(null)           00:05:15-610 {log_level_init    :190}

 please use echo name=level > /tmp/rt_log_level set log level
        name: all cmpi mb sys vdec venc rgn vpss vgs tde avs wbc vo vi ai ao aenc adec
        log_level: 0 1 2 3 4 5 6

(null)           00:05:15-610 {log_level_init    :196} Failed to open /dev/mpi/vlog,please check insmod success or fail
rockit default level 4, can use export rt_log_level=x, x=0,1,2,3,4,5,6 change
(null)           00:05:15-610 {read_log_level    :077} text is all=4
(null)           00:05:15-610 {read_log_level    :079} module is all, log_level is 4
(null)           00:05:15-611 {dump_version      :055} ---------------------------------------------------------
(null)           00:05:15-611 {dump_version      :056} rockit version: git-82723ff48 Fri Feb 7 10:14:47 2025 +0800
(null)           00:05:15-611 {dump_version      :057} rockit building: built-Chu 2025-02-07 14:34:15
(null)           00:05:15-611 {dump_version      :058} ---------------------------------------------------------
(null)           00:05:15-611 {monitor_log_level :131} #Start monitor_log_level thread, arg:(nil)
vsys dev open 4
cmpi             00:05:15-611 {sys_runtime_librar:178} Failed to open /dev/mpi/venc,please check insmod success or fail
cmpi             00:05:15-611 {sys_runtime_librar:178} Failed to open /dev/mpi/avs,please check insmod success or fail
cmpi             00:05:15-611 {sys_runtime_librar:178} Failed to open /dev/mpi/venc,please check insmod success or fail
get a hdl = 0x4b9be0
get a hdl = 0x4ba9d0
mb               00:05:15-616 {mb_create_buffer  :484} allocated buffer(this=0xa68ac9f8, data=0x9e2cb000, size=2457600, phy=0x6f00000, id = 27)
mb               00:05:15-617 {mb_create_buffer  :484} allocated buffer(this=0xa68aca58, data=0x9de1b000, size=2457600, phy=0x7200000, id = 28)
mb               00:05:15-618 {mb_create_buffer  :484} allocated buffer(this=0xa68acab8, data=0x9d96b000, size=2457600, phy=0x7500000, id = 29)
mb               00:05:15-619 {mb_create_buffer  :484} allocated buffer(this=0xa68acb18, data=0x9d4bb000, size=2457600, phy=(nil), id = 31)
evdev_get_tp_event: /sys/class/input/input0/name = goodix-ts
/dev/input/event0
EV_ABS ABS_MT_POSITION_X
        Min          0
        Max       1024
EV_ABS ABS_MT_POSITION_Y
        Min          0
        Max        600
evdev x [0, 3900], y [0, 3700]
[  317.000520] dw-mipi-dsi-rockchip ff640000.dsi: [drm:dw_mipi_dsi_bridge_atomic_enable] final DSI-Link bandwidth: 564 x 2 Mbps
calibrate [0,3900]x[0,3700] to 1024x600
evdev_calibrate = 1
UI created, entering main loop...
load library(librga.so) in releative path
```

  执行完成后，LVGL Hello\_World示例运行如下图所示：

<img src={require('./images/01-lvglprogramming-05.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>