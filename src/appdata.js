/**
 * 基于storageSvc存储方案设计的具有更强功能的类cookie存储方案
 *
 * @field expires(option) 过期时间：模拟cookie的过期时间，可以保证数据的时效
 * @field signature(option) 签名：模拟签名认证，可以用来做版本升级的数据匹配等
 * @field lastUpdate 修改时间：记录数据创建或上次修改时间
 */
(function(){
	
	/**
	 * [AppData description]
	 *
	 * @param {[type]} namespace [description]
	 * @param {[type]} signature [description]
	 */
	function AppData(namespace, signature){
		this.storage = Storage.ins(namespace);
		this.signature = signature;
		// this.lastUpdate = null;
		this.dataFormatter = {getter: null, setter: null};
	}

	AppData.prototype = {
		/**
		 * 设置数据处理方法：比如对数据加密解密等
		 *
		 * @param {[type]} setter [description]
		 * @param {[type]} getter [description]
		 */
		setFormatter: function(setter, getter){
			this.dataFormatter = {
				setter: setter,
				getter: getter
			}
		},
		/**
		 * 设置存储值
		 *
		 * @param {[type]} key     [description]
		 * @param {[type]} data    [description]
		 * @param {[type]} expires 过期截至时间的时间戳：如2014-09-01过期，则为(new Date('2014-09-01')).getTime()
		 */
		set: function(key, data, expires){
			if(this.dataFormatter.setter){
				data = this.dataFormatter.setter(data);
			}

			var lastUpdate = (new Date()).getTime();
			var store = {
				value: data,
				lastUpdate: lastUpdate
			}

			if(this.signature){
				store.signature = this.signature;
			}
			if(expires){
				store.expires = expires;
			}
			this.storage.set(key, store);
		},
		/**
		 * 获取值
		 *
		 * @param  {[type]} key           [description]
		 * @param  {[type]} ignoreExpires true or false
		 *
		 * @return {[type]}               [description]
		 */
		get: function(key, ignoreExpires){
			var data = this.storage.get(key);

			if(!data){
				return undefined;
			}
			// 签名与存储的签名不一致
			if(this.signature != data.signature){
				return undefined;
			}
			// 指定忽略过期时间 || 没有过期时间 || 未过期
			if(ignoreExpires || !data.expires || (new Date()).getTime() < data.expires){
				data = data.value;

				if(this.dataFormatter.getter){
					data = this.dataFormatter.getter(data);
				}
				return data;
			}
		},
		remove: function(key){
			this.storage.remove(key);
		},
		clear: function(){
			this.storage.clear();
		}
	}

	window.AppData = AppData;
})();