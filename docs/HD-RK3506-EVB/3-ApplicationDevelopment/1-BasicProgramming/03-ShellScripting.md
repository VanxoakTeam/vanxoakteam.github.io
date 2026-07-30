---
sidebar_position: 3
---

# Shell脚本编程

:::tip 提示

本指南将指导您如何编写 Shell 脚本。


:::

## 1. 基础概念

  在使用Linux系统时，我们通过shell访问操作系统内核的服务，它是用户使用 Linux 系统的桥梁，同时它也是一种程序设计语言。Shell 脚本（shell script）是一种为 shell 编写的脚本程序，"shell编程" 都是指 shell 脚本编程，不是指开发 shell 自身。Shell脚本的使用范围很广泛，最简单的情况可以简单堆砌一些命令即可，这样可以减少重复执行这些命令时键盘敲击的次数，复杂的情况下可以利用变量、表达式、流程控制和函数，作为一个完整的程序设计语言来完成特定的功能。Shell作为一种解释性语言，其程序（也就是shell脚本）无需编译即可执行，只需给脚本文件加上执行权限即可。

### 1.1 helloworld脚本

  为了更快进入shell脚本的世界，遵循编程语言介绍的惯例，下面给出一个helloworld的shell脚本：

```plain
#!/bin/bash
echo "Hello World !"
```

可以将上面的文本内容保存为helloworld.sh，然后给文件加上执行权限，可用两种方式执行：

```plain
chmod +x ./helloworld.sh       #使脚本具有执行权限
./helloworld.sh                #直接运行脚本
/bin/sh helloworld.sh   
```

> 注意：直接运行脚本时一定要写成 ./helloworld.sh，而不是 helloworld.sh，运行其它二进制的程序也一样，直接写 helloworld.sh，linux 系统会去 PATH 里寻找有没有叫 helloworld.sh 的，而只有 /bin, /sbin, /usr/bin，/usr/sbin 等在 PATH 里，当前目录通常不在 PATH 里，所以写成 helloworld.sh 是会找不到命令的，要用 ./helloworld.sh 告诉系统说，就在当前目录找。
>

  第二种运行方式是直接运行解释器，其参数就是 shell 脚本的文件名。

## 2. Shell 变量

  在 Shell 编程中，变量是用于存储数据值的名称。

  定义变量时，变量名不加美元 $ 符号，如：

```plain
varName="vanxoak"
```

注意，变量名和等号之间不能有空格，这可能和其它编程语言都不一样。同时，变量名的命名须遵循如下规则：

-   **只包含字母、数字和下划线：** 变量名可以包含字母（大小写敏感）、数字和下划线 **\_**，不能包含其他特殊字符。
-   **不能以数字开头：** 变量名不能以数字开头，但可以包含数字。
-   **避免使用 Shell 关键字：** 不要使用Shell的关键字（例如 if、then、else、fi、for、while 等）作为变量名，以免引起混淆。
-   **使用大写字母表示常量：** 习惯上，常量的变量名通常使用大写字母，例如 **PI=3.14**。
-   **避免使用特殊符号：** 尽量避免在变量名中使用特殊符号，因为它们可能与 Shell 的语法产生冲突。
-   **避免使用空格：** 变量名中不应该包含空格，因为空格通常用于分隔命令和参数。

### 2.1 使用变量

  使用一个定义过的变量，只要在变量名前面加美元符号即可，如：

```shell
varName="vanxoak"
echo $varName
echo ${varName}
```

变量名外面的花括号是可选的，加不加都行，加花括号是为了帮助解释器识别变量的边界，比如下面这种情况：

```shell
for lang in Java VB; do
    echo "I am good at ${lang}Script"
done
```

如果不给skill变量加花括号，写成echo "I am good at $langScript"，解释器就会把$langScript当成一个变量（其值为空），这不是我们想要的结果。

### 2.2 变量类型

  Shell 支持不同类型的变量，其中一些主要的类型包括：

**字符串变量：** 在 Shell中，变量通常被视为字符串。

你可以使用单引号 **'** 或双引号 **"** 来定义字符串，例如：

```plain
myString='Hello, World!'
# 或者
  myString="Hello, World!"
```

**整数变量**： 可以使用 **declare** 或 **typeset** 命令来声明变量类型，可以使用declare -i来声明一个整形变量，例如：

```plain
declare -i myInteger=42
```

这样的声明告诉 Shell 将 myInteger 视为整数，如果尝试将非整数值赋给它，Shell会尝试将其转换为整数。

**数组变量：** Shell 也支持数组，允许你在一个变量中存储多个值。数组可以是整数索引数组或关联数组，以下是一个简单的整数索引数组的例子：

```plain
myArray=(1 2 3 4 5)
```

或者关联数组：

```plain
declare -A assocArray
assocArray["name"]="John"
assocArray["age"]=30
```

**环境变量：** 这些是由操作系统或用户设置的特殊变量，用于配置 Shell 的行为和影响其执行环境。

例如，PATH 变量包含了操作系统搜索可执行文件的路径：

echo $PATH

**特殊变量：** 有一些特殊变量在 Shell 中具有特殊含义，例如 **$0** 表示脚本的名称，**$1**, **$2**, 等表示脚本的参数。

**$#**表示传递给脚本的参数数量，**$?** 表示上一个命令的退出状态等。

| 变量类型 | 变量说明 |
| --- | --- |
| $# | 传递到脚本或函数的参数个数 |
| $* | 以一个单字符串显示所有向脚本传递的参数 |
| $* | 脚本运行的当前进程ID号 |
| $! | 后台运行的最后一个进程的ID号 |
| $@ | 与$*相同，但是使用时加引号，并在引号中返回每个参数 |
| $- | 显示Shell使用的当前选项，与set命令功能相同 |
| $? | 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。 |

## 3. Shell 字符串

  字符串是shell编程中最常用最使用的数据类型，字符串可以用单引号，也可以用双引号，也可以不用引号。

### 3.1 单引号

```plain
str='this is a string'
```

单引号字符串的限制：

-   单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的；
-   单引号字符串中不能出现单独一个的单引号（对单引号使用转义符后也不行），但可成对出现，作为字符串拼接使用。

### 3.2 双引号

```plain
compName="vanxoak"
str="This product is designed and manufactured by \"$compName\"! \n"
echo -e $str
```

输出结果为：

```plain
This product is designed and manufactured by "vanxoak"! 
```

双引号的优点：

-   双引号里可以有变量
-   双引号里可以出现转义字符

### 3.3 字符串操作

#### 3.3.1 拼接字符串

```plain
chipName="RK3506"
# 使用双引号拼接
  product="HD-"$chipName"-IOT"
product_1="HD-${chipName}-IOT"
echo $product  $product_1

# 使用单引号拼接
  product_2='HD-'$chipName'-IOT'
product_3='HD-${chipName}-IOT'
echo $product_2  $product_3
```

程序的输出结果为：

```plain
HD-RK3506-IOT HD-RK3506-IOT
HD-RK3506-IOT HD-${chipName}-IOT
```

#### 3.3.2 获取字符串长度

```plain
string="vanxoak"
echo ${#string}   # 输出 7
```

#### 3.3.3 提取子字符串

  以下实例从字符串第 **2** 个字符开始截取 **4** 个字符：

```plain
string="vanxoak"
echo ${string:1:4}   # 输出 anxo
```

#### 3.3.4 字符串操作表达式

| 表达式 | 涵义 |
| --- | --- |
| `${#string}` | $string的长度 |
| `${string:position}` | 在s t r i n g 中 , 从 位 置 string中, 从位置string中,从位置position开始提取子串 |
| `${string:position:length}` | 在s t r i n g 中 , 从 位 置 string中, 从位置string中,从位置position开始提取长度为$length的子串 |
| `${string#substring}` | 从变量s t r i n g 的 开 头 , 删 除 最 短 匹 配 string的开头, 删除最短匹配string的开头,删除最短匹配substring的子串 |
| `${string##substring}` | 从变量s t r i n g 的 开 头 , 删 除 最 长 匹 配 string的开头, 删除最长匹配string的开头,删除最长匹配substring的 |
| `${string%substring}` | 从变量s t r i n g 的 结 尾 , 删 除 最 短 匹 配 string的结尾, 删除最短匹配string的结尾,删除最短匹配substring的子串 |
| `${string%%substring}` | 从变量s t r i n g 的 结 尾 , 删 除 最 长 匹 配 string的结尾, 删除最长匹配string的结尾,删除最长匹配substring的子串 |
| `${string/substring/replacement}` | 使用r e p l a c e m e n t , 来 代 替 第 一 个 匹 配 的 replacement, 来代替第一个匹配的replacement,来代替第一个匹配的substring |
| `${string//substring/replacement}` | 使用r e p l a c e m e n t , 代 替 ∗ 所 有 ∗ 匹 配 的 replacement, 代替*所有*匹配的replacement,代替∗所有∗匹配的substring |
| `${string/#substring/replacement}` | 如果s t r i n g 的 ∗ 前 缀 ∗ 匹 配 string的*前缀*匹配string的∗前缀∗匹配substring, 那么就用r e p l a c e m e n t 来 代 替 匹 配 到 的 replacement来代替匹配到的replacement来代替匹配到的substring |
| `${string/%substring/replacement}` | 如果s t r i n g 的 ∗ 后 缀 ∗ 匹 配 string的*后缀*匹配string的∗后缀∗匹配substring, 那么就用r e p l a c e m e n t 来 代 替 匹 配 到 的 replacement来代替匹配到的replacement来代替匹配到的substring |

## 4. 操作符与表达式

  对于shell来说，每一个命令也是一个逻辑表达式，用命令或者函数的返回值来代表它们的真值，返回0为真，返回非0为假，这个值可用“$?”来获取。

  Bash支持基本的数学运算符号和各种逻辑操作符。

**数学运算符**：+、-、*、/、**\*、%。*

  除了代表的幂运算外，其它运算符与对应的C语言运算符意义相同。但Bash只支持整数运算，如果需要浮点运算，应该需要调用外部的工具。一般不建议在脚本里进行浮点运算。

  像bc或者dc这样功能强大的计算器程序，可以完成浮点和更复杂的数学运算和求值。感兴趣的同学可以看这两个命令的手册。

**逻辑操作符**：&&和||，分别代表逻辑“与”和逻辑“或”。

  对于&&来说，若左边的表达式为假，右边表达式将不用被执行即可确定整个表达式结果为假；反之需要求值右边的表达式才能求得整个表达式的真值。

  对于||来说，若左边的表达式为真，则右边的表达式将不用被执行即可以确定整个表达式为真；反之需要求值右边的表达式才能求得整个表达式的真值。

### 4.1 算术运算

  shell支持的常用的如下表，举例中这里假定变量 a 为 10，变量 b 为 20：

| **运算符** | **说明** | **举例** |
| --- | --- | --- |
| + | 加法 | `expr $a + $b` 结果为 30 |
| - | 减法 | `expr $a - $b` 结果为 -10 |
| * | 乘法 | `expr $a \* $b` 结果为 200 |
| / | 除法 | `expr $b / $a` 结果为 2 |
| % | 取余 | `expr $b % $a` 结果为 0 |
| = | 赋值 | a=$b 将把变量 b 的值赋给 a |
| == | 相等。用于比较两个数字，相同则返回 true | [ $a == $b ] 返回 false |
| != | 不相等。用于比较两个数字，不相同则返回 true | [ $a != $b ] 返回 true |

### 4.2 关系运算

  shell使用特殊的字符表示关系运算符，并且只支持数字，不支持字符串，除非字符串是数字，下表为常用关系运算符，同样指定a为10，b为20：

| **运算符** | **说明** | **举例** |
| --- | --- | --- |
| -eq | 检测两个数是否相等，相等返回 true | [ $a -eq $b ] 返回 false |
| -ne | 检测两个数是否不相等，不相等返回 true | [ $a -ne $b ] 返回 true |
| -gt | 检测左边的数是否大于右边的，如果是，则返回 true | [ $a -gt $b ] 返回 false |
| -lt | 检测左边的数是否小于右边的，如果是，则返回 true | [ $a -lt $b ] 返回 true |
| -ge | 检测左边的数是否大于等于右边的，如果是，则返回 true | [ $a -ge $b ] 返回 false |
| -le | 检测左边的数是否小于等于右边的，如果是，则返回 true | [ $a -le $b ] 返回 true |

### 4.3 布尔运算

  指定a为10，b为20，shell支持的布尔运算如下表：

| **运算符** | **说明** | **举例** |
| --- | --- | --- |
| ! | 非运算，表达式为 true 则返回 false，否则返回 true | [ ! false ] 返回 true |
| -o | 或运算，有一个表达式为 true 则返回 true | [ $a -lt 20 -o $b -gt 100 ] 返回 true |
| -a | 与运算，两个表达式都为 true 才返回 true | [ $a -lt 20 -a $b -gt 100 ] 返回 false |

### 4.4 逻辑运算

  假定变量 a 为 10，变量 b 为 20，shell支持的逻辑运算示例如下：

| **运算符** | **说明** | **举例** |
| --- | --- | --- |
| && | 逻辑的 AND | [[ $a -lt 100 && $b -gt 100 ]] 返回 false |
| \|\| | 逻辑的 OR | [[ $a -lt 100 \|\| $b -gt 100 ]] 返回 true |

### 4.5 字符串比较

  假定变量 a 为“abc”，变量 b 为“efg”，shell支持的字符串比较示例如下：

| **运算符** | **说明** | **举例** |
| --- | --- | --- |
| =/== | 检测两个字符串是否相等，相等返回 true,==在[[]]和[]中行为可能不同​ | [ $a = $b ] 返回 false |
| != | 检测两个字符串是否相等，不相等返回 true | [ $a != $b ] 返回 true |
| -z | 检测字符串长度是否为0，为0返回 true | [ -z $a ] 返回 false |
| -n | 检测字符串长度是否不为 0，不为 0 返回 true | [ -n “$a” ] 返回 true |
| $ | 检测字符串是否为空，不为空返回 true | [ $a ] 返回 true |
| > | 按照ASCII字母顺序比较，在[]中需要转义写成> | [“$a” >“$b” ]返回 true |
| `&lt;` | 按照ASCII字母顺序比较，在[]中需要转义写成\< | [“$a” \<”$b” ]回 false |

## 5. 流程控制

### 5.1 if else条件

  shell中的if else条件具有一定的模版。其调用格式为：

```plain
if condition
then
    command1 
    command2
    ...
    commandN 
fi
```

  写成单行：

```plain
if condition;then command1; command2;fi
```

  如果存在不满足的条件的情况：

```plain
if condition
then
    command1 
    command2
    ...
    commandN
else
    command
fi
```

  在多层嵌套条件情况：

```plain
if condition1
then
    command1
elif condition2 
then 
    command2
else
    commandN
fi
```

### 5.2 case条件

  shell中case语句为多功能选择语句，与其他语言相通的是，可以用case语句匹配一个值与一个模式，如果匹配成功，执行相匹配的命令。case语句调用格式如下：

```plain
case 值 in
模式1)
    command1
    command2
    ...
    commandN
    ;;
模式2）
    command1
    command2
    ...
    commandN
    ;;
esac
```

需要注意的点：

-   取值后面需要加上in；
-   每一模式必须以右括号结束；
-   每个模式结束后使用`;;`符号结尾；
-   case需要搭配`esac`结尾。

case中想要跳出循环有两个命令：break和continue

-   break命令：允许跳出所有循环（中止执行后面所有的循环）；
-   continue命令：与break命令类似，只有它不会跳出所有循环，仅仅跳出当前循环，这一点和其他类型的语言相同。

### 5.3 for循环

  重复执行一系列命令在编程中很常见，你经常需要重复多个命令直到达到某个特定的条件，shell提供for命令，允许创建一些列值的循环，每次迭代都使用其中一个值来执行已定义好的一组命令。for循环的基本格式如下：

```plain
for var in item1 item2 ... itemN
do
    command1
    command2
    ...
    commandN
done
```

### 5.4 while循环

  while命令在某种程度上结合了if-then条件语句和for循环，while命令允许定义一个要测试的命令，只要该测试命令返回退出状态码为0，就循环执行一组命令。while循环的基本格式如下：

```plain
while condition
do
    command
done
```

`  condition` 一般为条件表达式，如果返回值为 true，则继续执行循环体内的语句，否则跳出循环。

### 5.5 until循环

  until 循环执行一系列命令直至条件为 true 时停止。until 循环与 while 循环在处理方式上刚好相反。一般 while 循环优于 until 循环，但在某些时候until 循环更加有用。until循环调用格式：

```plain
until condition
do
    command
done
```

  `condition` 一般为条件表达式，如果返回值为 false，则继续执行循环体内的语句，否则跳出循环。

## 6. 函数

### 6.1 定义函数

  和很多编程语言一样，如果我们需要在程序的多个地方使用同一段代码，就需要考虑降这部分代码定义为函数。shell也提供了函数支持，我们可以定义一个脚本代码块为一个函数，然后在需要使用这部分代码块时，直接写函数名即可（即调用函数），有两种方法定义函数：

```plain
# 方式1
  function name {
    action;
    [return int;]
}

# 方式2
  name () {
 actions
 [return int;]
}
```

  可以使用关键字function来定义函数，也可以在函数名后跟上一个空括号来表明正在定义的是一个函数。

  当然，左花括号 `{` 可以写在新一行的开头，可以依据个人的风格喜好来选择。可以使用return返回一个int数值），如果不使用，将默认以最后一条命令运行的结果作为返回值。

> 注意：所有的函数在使用前必须定义，这是因为shell解释器是顺序逐层执行的，当shell解释器发现定义的函数时，才会找到其对应的功能，进而执行。
>

### 6.2 函数参数

  想要使用shell函数传递参数时，需要在函数体的内部，通过 $n 的形式来获取参数的值，与其他语言不同的是，这不是在定义函数的时候就给定参数，而是在函数体中获取到的参数，例如，$1表示第一个参数，$2表示第二个参数，函数名保存在$0变量中，可以用$#变量来确定传给函数的参数数量。

### 6.3 获取函数返回值

  在定义函数时可以显式调用return整形值返回，若没有显示调用return语句则使用函数中最后一条shell指令的执行结果作为返回值，那如何获取到这个返回值呢？又如何获取函数的非整形结果呢？

有以下两种方式：

-   用变量接收函数输出值，函数用echo等标准输出将要返回的东西打印出来；
-   用$?来接收函数的执行状态。

```plain
#! /bin/sh

test() {
        echo "test here"
        return 100
}
DD=`test`
echo "return: $?"
echo "DD: $DD"
DD=$(test)
echo "DD: $DD"
echo "return: $?"
```

  上面脚本运行结果将会是：

```plain
return: 100
DD: test here
DD: test here
return: 0
```

  为什么最后一条是输出的0呢，因为$?总是保存着前一个程序或者函数的返回值，所以这个0值代表的是echo "DD: $DD"这个程序调用的结果，因此，若要后续判断函数执行结果，应尽快将$?的值保存到另一变量中，以免$?被后面的函数调用结果覆盖。

> 注意：echo命令的实现原理取决于操作系统和Shell的实现。一般来说，echo命令是由Shell内建的一个命令，它不需要调用外部的程序来执行。
