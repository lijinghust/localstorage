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
alert(myApp.get('text'));

```