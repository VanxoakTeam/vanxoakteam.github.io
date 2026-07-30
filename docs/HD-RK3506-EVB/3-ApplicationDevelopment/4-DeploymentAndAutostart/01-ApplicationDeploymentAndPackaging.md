---
sidebar_position: 1
---

# 应用部署与打包

:::tip 提示

本指南将指导您如何将应用打包进 SDK。


:::

  overlay目录，可以覆盖文件系统的配置。

  RK3506 overlay目录默认在`rk3506_linux6.1_sdk_v1.2.0/buildroot/board/vanxoak`目录，此目录内可添加自定义文件，添加后编译可覆盖板上文件系统。

<img src={require('./images/01-applicationdeploymentandpackaging-01.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

  以IOT-EMMC版本为例，比如我需要将test.sh脚本放入/etc目录，此脚本的作用是打印一行helloworld。

  只需将脚本放入SDK中的`rk3506_linux6.1_sdk_v1.2.0/buildroot/board/vanxoak/hd_rk3506_iot_emmc/fs-overlay/etc`目录，重新编译后烧录固件，通过串口可以查看到etc目录下存在test.sh脚本。

<img src={require('./images/01-applicationdeploymentandpackaging-02.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>