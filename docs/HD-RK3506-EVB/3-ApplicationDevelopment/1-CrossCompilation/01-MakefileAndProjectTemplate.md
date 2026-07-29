---
sidebar_position: 1
---

# Makefile的使用及工程模板

:::tip 提示

本指南将指导您如何编写 Makefile 代码。


:::

## 1. Makefile 介绍

### 1.1 什么是 Makefile

  Makefile 是 `make` 工具的配置文件，定义了一套规则来指导如何编译和链接程序。`make` 是一个自动化构建工具，通过读取 Makefile 中的依赖关系，**仅重新编译那些自上次编译后发生过更改的文件**，从而极大提升大型项目的构建效率。

### 1.2 核心工作流程

-   读取 Makefile。
-   找到第一个目标（Target）作为**终极目标**（通常是 `all`）。
-   检查目标的依赖项（Prerequisites）是否存在或比目标新。
-   若依赖过期，则递归更新依赖，最后执行该目标的命令（Recipe）。

## 2. Makefile 语法

### 2.1 基本规则

```makefile
target: prerequisites
    recipe
```

-   **target**：通常是文件名（可执行文件、`.o` 文件），也可以是伪目标（如 `clean`）。
-   **prerequisites**：依赖的文件列表，用空格分隔。
-   **recipe**：Shell 命令，必须以 Tab 键开头（不能用 4 个空格）。

### 2.2 变量

#### 1）赋值符

| 赋值符 | 含义 | 示例 |
| --- | --- | --- |
| = | **递归展开**（使用时才展开，若右值包含变量，会延迟解析） | A = $(B) |
| := | **直接展开**（定义时立即展开，类似 C 语言赋值） | C := $(shell pwd) |
| ?= | **条件赋值**（仅当变量未定义时才赋值） | CC ?= gcc |
| += | **追加赋值**（在原有值后添加内容） | CFLAGS += -O2 |

#### 2）内置自动变量

| 变量 | 说明 |
| --- | --- |
| $@ | 当前规则的目标文件名 |
| `$<` | 当前规则的第一个依赖文件名 |
| $^ | 当前规则的所有依赖文件名（去重） |
| $* | 目标文件名中去除后缀的部分（即主名） |
| $(@D) / $(@F) | 目标文件的目录部分 / 文件名部分 |

### 2.3 函数

  调用格式：`$(function arguments)` 或 `${function arguments}`

| 函数 | 说明 | 示例 |
| --- | --- | --- |
| wildcard | 查找匹配模式的文件 | $(wildcard *.c) |
| patsubst | 模式字符串替换 | $(patsubst %.c, %.o, $(SRCS)) |
| notdir | 去除路径，只留文件名 | $(notdir /src/main.c) |
| shell | 执行 Shell 命令 | $(shell uname -s) |

### 2.4 条件判断

```makefile
ifeq ($(OS), Windows_NT)
    RM = del
else
    RM = rm -f
endif

ifdef DEBUG
    CFLAGS += -g
endif
```

### 2.5 包含与引用

```makefile
include config.mk   # 引入外部配置文件
-include deps.d     # 加 "-" 表示忽略文件不存在的错误
```

### 2.6 命名规范

| 类别 | 规范 | 示例 |
| --- | --- | --- |
| **目标（Target）** | 小写字母，单词间用下划线或连字符 | `all`, `clean`, `unit-test` |
| **变量（Variable）** | 大写字母，单词间用下划线 | `CC`, `CXXFLAGS`, `BUILD_DIR` |
| **内部临时变量** | 小写或前导下划线 | `_objs`, `target_name` |

## 3. Makefile 示例

```makefile
# 项目结构：src/ (存放 .c), inc/ (存放 .h), lib/ (存放 .o)
CC       := arm-buildroot-linux-gnueabihf-gcc
CFLAGS   := -Wall -Iinc
LDFLAGS  := -lm
TARGET   := app
SRC_DIR  := src
BUILD_DIR:= lib
SOURCES  := $(wildcard $(SRC_DIR)/*.c)
OBJECTS  := $(patsubst $(SRC_DIR)/%.c, $(BUILD_DIR)/%.o, $(SOURCES))

all: $(TARGET)

# 链接
	$(TARGET): $(OBJECTS)
	$(CC) $^ -o $@ $(LDFLAGS)

# 编译
	$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD_DIR):
	mkdir -p $@

clean:
	rm -rf $(BUILD_DIR) $(TARGET)

.PHONY: all clean
```
