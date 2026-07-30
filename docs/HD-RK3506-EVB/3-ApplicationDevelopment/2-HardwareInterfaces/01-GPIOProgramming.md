---
sidebar_position: 1
---

# GPIO应用编程

:::tip 提示

本指南将指导您如何通过代码程序**操控 GPIO**。


:::

## 1. libgpiod 命令行用法简介

  下文以GPIO1\_B5为例讲解 libgpiod 工具的使用。主要讲解 `gpioset`、`gpioget` 等常用命令的用法。

<img src={require('./images/01-gpioprogramming-01.png').default} alt="image.png" style={{display: 'block', margin: '20px auto', maxWidth: '80%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}/>

### 1.1 gpioset 命令

  **gpioset** 用来控制GPIO输出，其命令格式为：

```shell
gpioset [options] <chip> <line>=<value> [<line>=<value> ...]
```

-   `**chip**`**：** 指定要操作的 GPIO 芯片，通常是 `/dev/gpiochipX` 的名称（如 `gpiochip0`）。
-   `**line**`**：** GPIO 引脚编号（基于该chip下的编号，而非全局编号）。
-   `**value**`**：** 输出值，`0` 表示低电平，`1` 表示高电平。

  GPIO1\_B5 的line部分含字母和数字两部分，num为二者之和，其中字母A、B、C、D，分别代表0、8、16、24。 则 B5 值为 8 + 5 = 13。

  使用 gpioset 设置 GPIO1\_B5 输出高电平或者低电平：

```shell
# GPIO输出高电平
  gpioset gpiochip1 13=1
# GPIO输出低电平
  gpioset gpiochip1 13=0
```

  gpioset 也支持一次设置多个GPIO引脚的状态，例如通过一条命令将GPIO1\_B5设置为高、GPIO1\_B6设置为低、GPIO1\_B7设置为高。则命令格式如下：

```shell
gpioset gpiochip1 13=1 14=0 15=1
```

### 1.2 gpioget 命令

  **gpioget** 用来获取IO值：

```shell
gpioget gpiochip1 13
```

## 2. libgpiod C语言接口调用示例

### 2.1 设置 gpio 为输出模式

```shell
#include <gpiod.h>
#include <stdio.h>
#include <stdlib.h>

#define CHIP_NAME "/dev/gpiochip1"    // GPIO 芯片设备文件
#define LINE_NUM 13                   // 要操作的 GPIO 引脚编号
#define CONSUMER "gpio_user"          // 消费者名称，用于标识程序

int main(int argc, char *argv[])
{
    struct gpiod_chip *chip;
    struct gpiod_line *line;
    int value;
    int ret;

    if (argc != 2) {
        fprintf(stderr, "Usage: %s <0|1>\n", argv[0]);
        return EXIT_FAILURE;
    }

    // 获取用户输入的值
    value = atoi(argv[1]);
    if (value != 0 && value != 1) {
        fprintf(stderr, "Error: Value must be 0 or 1.\n");
        return EXIT_FAILURE;
    }

    // 打开 GPIO 芯片
    chip = gpiod_chip_open(CHIP_NAME);
    if (!chip) {
        perror("Failed to open GPIO chip");
        return EXIT_FAILURE;
    }

    // 获取 GPIO 引脚
    line = gpiod_chip_get_line(chip, LINE_NUM);
    if (!line) {
        perror("Failed to get GPIO line");
        gpiod_chip_close(chip);
        return EXIT_FAILURE;
    }

    // 请求 GPIO 引脚为输出模式，并设置初始值
    ret = gpiod_line_request_output(line, CONSUMER, value);
    if (ret < 0) {
        perror("Failed to request GPIO line as output");
        gpiod_chip_close(chip);
        return EXIT_FAILURE;
    }

    // 设置 GPIO 输出值
    ret = gpiod_line_set_value(line, value);
    if (ret < 0) {
        perror("Failed to set GPIO value");
        gpiod_line_release(line);
        gpiod_chip_close(chip);
        return EXIT_FAILURE;
    }

    printf("GPIO line %d set to %d\n", LINE_NUM, value);

    // 释放 GPIO 引脚和芯片
    gpiod_line_release(line);
    gpiod_chip_close(chip);

    return EXIT_SUCCESS;
}
```

  对应的 Makefile 示例：

```shell
CROSSCOMPILE := arm-buildroot-linux-gnueabihf-

CFLAGS 	:= -Wall -O2 -c
CFLAGS  += -I$(PWD)/include

LDFLAGS := -lgpiod

CC 	:= $(CROSSCOMPILE)gcc
LD 	:= $(CROSSCOMPILE)ld

OBJS := gpio_out.o

all: $(OBJS)
	$(CC) $(LDFLAGS) -o gpio_out $^

clean:
	rm -f gpio_out
	rm -f $(OBJS)

%.o:%.c
	$(CC) $(CFLAGS) -o $@ $<

```

  将编译后的程序放入开发板/oem目录，使用如下命令执行程序：

```shell
root@rk3506-buildroot:/oem# ./gpio_out 1
GPIO line 13 set to 1
root@rk3506-buildroot:/oem# ./gpio_out 0
GPIO line 13 set to 0
```

### 2.2 设置 gpio 为输入模式

```shell
#include <gpiod.h>
#include <stdio.h>
#include <stdlib.h>

#define CHIP_NAME "/dev/gpiochip1"  // GPIO 芯片设备文件
#define LINE_NUM 13                // 要读取的 GPIO 引脚编号

int main(void) {
    struct gpiod_chip *chip;
    struct gpiod_line *line;
    int value;

    // 打开 GPIO 芯片
    chip = gpiod_chip_open(CHIP_NAME);
    if (!chip) {
        perror("Failed to open GPIO chip");
        return EXIT_FAILURE;
    }

    // 获取 GPIO 引脚
    line = gpiod_chip_get_line(chip, LINE_NUM);
    if (!line) {
        perror("Failed to get GPIO line");
        gpiod_chip_close(chip);
        return EXIT_FAILURE;
    }

    // 请求 GPIO 引脚为输入模式
    if (gpiod_line_request_input(line, "gpio_reader") < 0) {
        perror("Failed to request GPIO line as input");
        gpiod_chip_close(chip);
        return EXIT_FAILURE;
    }

    // 读取 GPIO 引脚的状态
    value = gpiod_line_get_value(line);
    if (value < 0) {
        perror("Failed to read GPIO line value");
        gpiod_line_release(line);
        gpiod_chip_close(chip);
        return EXIT_FAILURE;
    }

    printf("GPIO line %d value: %d\n", LINE_NUM, value);

    // 释放 GPIO 引脚和芯片
    gpiod_line_release(line);
    gpiod_chip_close(chip);

    return EXIT_SUCCESS;
}

```

  将编译后的程序放入开发板/oem目录，使用如下命令执行程序，可以获取到GPIO的状态：

```shell
root@rk3506-buildroot:/oem# ./gpio_in
GPIO line 13 value: 0
```