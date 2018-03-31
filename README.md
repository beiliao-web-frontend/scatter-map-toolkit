## 项目

### 地址

https://github.com/hanyonghao/scatter-map-toolkit

### 克隆

```
$ git clone https://github.com/hanyonghao/scatter-map-toolkit.git
```

### 区域划定工具

#### 启动

打开命令行，切换到项目目录下，执行：

```
$ npm start
```

用浏览器打开「 http://localhost:8000/ 」即可进入操作界面。

### 区域数据使用

#### 使用

```
<scrpit type="text/javascript" src="dist/scatter-map.min.js"></script>

<script type="text/javascript">
    let scatterMap = new ScatterMap(options);
</script>
```

#### API

##### scatterMap.random ()
从配置项里的所有分组中随机获取一个坐标点

###### 返回值
{ Object } 坐标对象

###### 例子：
```
let scatterMap = new ScatterMap(options);

scatterMap.random(); // { x: '50%', y: '50%' }
```

##### scatterMap.randomFromGroup(include, exclude)
从配置项里的特定分组中随机获取一个坐标点

###### 参数

{ String | Array } [include]  包含制定分组，默认为所有分组

{ Strign | Array } [exclude]  排除制定分组，默认为空数组

###### 返回值
{ Object } 坐标对象

###### 例子：
```
let scatterMap = new ScatterMap(options);

scatterMap.randomFromGroup(['广东', '北京', '上海']); // { x: '50%', y: '50%' }
```

#### 示例

##### 启动

打开命令行，切换到项目目录下，执行：

```
$ npm start
```

用浏览器打开「 http://localhost:8000/example 」即可进入示例界面。