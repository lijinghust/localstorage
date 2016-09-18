AppData
=======

> 基于localStorage和userdata实现的具有过期时间及数据签名认证功能的本地存储方案

##使用方法1.
纯粹的本地存储数据
```javascript
// 首先在页面中storage.js

var storage = new Storage('hao360');
storage.set('text', 'hello world!')
alert(storage.get('text'));

```

##使用方法2.
支持过期时间和签名认证的存储
```javascript
// 首先在页面中storage.js和appdata.js

var myApp = new AppData('hao360', 'firstsignature');
myApp.set('text', 'hello world!', '2017-09-01 10:00:00');
alert(myApp.get('text')); // hello world!

var myApp = new AppData('hao360', 'newsignature'); // 新的签名
alert(myApp.get('text')); // undefined

```

#API介绍

##1. Storage
```javascript
* new Storage(namespace)
* set(key, value) // key为字符串;value可为任意格式，如：布尔，字符串，对象，数组等
* get(key)
* remove(key)
* clear()
```

##2. AppData
```javascript
* new AppData(namespace)
* set(key, value, expires)  //key为字符串; value可为任意格式，如：布尔，字符串，对象，数组等; expires 过期截止时间的时间戳：如2014-09-01过期，则为(new Date('2014-09-01')).getTime()
* get(key, ignoreExpires) // ignoreExpires为true or false
* remove(key)
* clear()
* setFormatter(setter, getter) // 设置数据处理方法：比如对数据加密解密等；setter和getter一般成对设置
```
