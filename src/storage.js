var JSON;JSON||(JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

(function(win, doc){
	/*
	 * 针对浏览器：IE8+，高级浏览器等支持window.localStorage的API的浏览器
	 * 对localstorage的封装
	 */ 

	var localstorage = {
		init:function(ns){},
		set: function(ns,key,value) {
			try{
				localStorage.setItem(ns+key,value);
			}catch(e){throw e;}
		},
		get: function(ns,key) {return localStorage.getItem(ns+key);},
		remove: function(ns,key) {localStorage.removeItem(ns+key);},
		clear:function(ns){
			if(!ns){
				localStorage.clear();
			}else{
				for(var i = localStorage.length-1, key; key = localStorage.key(i--);) {
					if(key&&key.indexOf(ns)===0) {
						localStorage.removeItem(key);
					}
				}
			}
		}
	}

	/*
	 * 针对浏览器：IE6~IE7
	 * 对userData的封装
	 */ 
	var userdata = {
		_owners:{},
		init:function(ns){
			if(!this._owners[ns])
			{
				if(doc.getElementById(ns))
				{
					this._owners[ns] = doc.getElementById(ns);
				}
				else
				{
					var el = doc.createElement('script'),
					head = doc.head || doc.getElementsByTagName( "head" )[0] || doc.documentElement;
					el.id = ns;
					el.style.display = 'none';
					el.addBehavior('#default#userdata');
					head.insertBefore( el, head.firstChild );
					this._owners[ns] = el;
				}
				try{this._owners[ns].load(ns);}catch(e){}
				var _self = this;
				win.attachEvent("onunload", function(){
					_self._owners[ns] = null;
				});
			}
		},
		set:function(ns,key,value){
			if(this._owners[ns]){
				try{
				this._owners[ns].setAttribute(key, value);
				this._owners[ns].save(ns);
				}catch(e){throw e;}
			}
		},
		get: function(ns,key){
			if(this._owners[ns]){
				this._owners[ns].load(ns);
				return this._owners[ns].getAttribute(key)||"";//避免返回null
			}
			return "";
		},
		remove: function(ns,key){
			if(this._owners[ns]){
				this._owners[ns].removeAttribute(key);
				this._owners[ns].save(ns);
			}
		},
		clear:function(ns){
			if(this._owners[ns]){
				var attributes = this._owners[ns].XMLDocument.documentElement.attributes;
				this._owners[ns].load(ns);
				for (var i=0, attr; attr = attributes[i]; i++) {
					this._owners[ns].removeAttribute(attr.name)
				}
				this._owners[ns].save(ns);
			}
		}
	}


	// 存储类型判断
	var supportType = (function(){
		if(win.localStorage){
			return 'localStorage';
		}else if(win.ActiveXObject && doc.documentElement.addBehavior){
			return 'userdata';
		}else{
			return 'donot';
		}
	})();

	// 根据支持情况，适配不同浏览器的不同实现
	var storageAdapter = (function(){
		if(supportType == 'localStorage'){
			return localstorage;
		}else if(supportType == 'userdata'){
			return userdata;
		}else{
			return {
				init:function(){},
				get:function(){},
				set:function(){},
				remove:function(){},
				clear:function(){}
			}
		}
	})();

	var serialize = function(value){
		return JSON.stringify(value);
	}
	var unserialize = function(value){
		return JSON.parse(value);
	}

	/**
	 *
	 * 设计的存储数据以object序列化之后作为字符串存储下来
	 * 如：'{"value":"hao360","signature":"aaa","lastUpdate":1473150230458}'
	 */
	var prefix = 'ns';
	var _instance = {};
	var storageSvc = function(namespace){
		this._ns = prefix + '_' + namespace + '_';
		this.storage = storageAdapter;

		this.storage.init(this._ns);
	}

	storageSvc.prototype = {
		set: function(key, value){
			this.storage.set(this._ns, key, serialize(value));
		},
		get: function(key){
			return unserialize(this.storage.get(this._ns, key));
		},
		remove: function(key){
			this.storage.remove(this._ns, key);
		},
		clear: function(){
			this.storage.clear(this._ns);
		}
	}
	// 实例唯一性
	storageSvc.ins = function(namespace){
		if(!_instance[namespace]){
			_instance[namespace] = new storageSvc(namespace);
		}
		return _instance[namespace];
	}

	win.Storage = storageSvc;
})(window, document);