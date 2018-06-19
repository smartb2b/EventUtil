var eventutil = {
        addHandler: function(element, type, handler) {
                if (element.addEventListener) {
                        element.addEventListener(type, handler, false);
                } else if (element.attachEvent) {
                        element.attachEvent("on" + type, handler);
                } else {
                        element["on" + type] = handler;
                }
        },

        removeHandler : function(element, type, handler) {
                if (element.removeEventListener){
                        element.removeEventListener(type, handler, false);
                } else if (element.detachEvent){
                        element.detachEvent("on" + type, handler);
                } else {
                        element["on" + type] = null;
                }
        },

        getEvent: function(event) {
                return event || window.event;
        },

        getTarget: function(event) {
                return event.target || event.srcElement;
        },

        preventDefault: function(event) {
                if(event.preventDefault) {
                        event.preventDefault();
                } else {
                        event.returnValue = false;
                }
        },

        stopPropagation: function(event) {
                if(event.stopPropagation) {
                        event.stopPropagation();
                } else {
                        event.cancelBubble = true;
                }
        },

        isArray: function(arr) {
                return Object.prototype.toString.call(arr) === '[object Array]';
        },

        isFunction: function(fn) {
                return Object.prototype.toString.call(fn) === '[object Function]';
        },

        isObject: function(obj) {
                return Object.prototype.toString.call(obj) === '[object Object]';
        },

        // 深复制
        clone: function(src) {
                var obj;
                if(isArray(src)) {
                        obj = [];
                        for(var j=0;j<src.length;j++) {
                                obj[j] = arguments.callee(src[j]);
                        }
                } else if (isObject(src)) {
                        obj = {};
                        for(var i in src) {
                                obj[i] = arguments.callee(src[i]);
                        }
                } else {
                        return src;
                }
                return obj;
        },

        // 数组去重
        unique: function(arr) {
                var newarr = [];
                for (var i=0;i<arr.length;i++) {
                        if (newarr.indexOf(arr[i]) == -1) {
                                newarr.push(arr[i]);
                        }
                }
                return newarr;
        },

        each: function(arr, fn) {
                for (var i= 0,l=arr.length;i<l;i++) {
                        fn.call(arr[i],arr[i],i);
                }
        },

        getobjlength: function(obj) {
                var j = 0;
                for (var i in obj) {
                        j++;
                }
                return j;
        },

        // 快速排序
        quicksort: function(arr) {
                if (arr.length<2) {return arr;}
                var mid = Math.floor(arr.length/2),
                var midnum = arr.splice(mid, 1)[0],
                var left = [],
                var right = [];
                for (var i= 0,j=arr.length;i<j;i++) {
                        if (arr[i]>midnum) {
                                right.push(arr[i]);
                        } else {
                                left.push(arr[i]);
                        }
                }
                return quicksort(left).concat([midnum], quicksort(right));
        },

          /*
        AJAX封装函数
        @para {string} url 请求地址
        @para {object} options 请求发送的选项参数
            @config {string} [options.type] 发送类型，默认为GET
            @config {object} [options.data] 需要发送的数据
            @config {function} [options.onsuccess] 请求成功时触发
            @config {function} [options.onfail] 请求失败时触发
        @return {XMLHttpRequest}
         */
        ajax: function(url, options) {
                // 创建ajax对象
                var oajax = null;
                /*
                * 此处必须使用window.的方式，表示为window对象的
                * 一个属性，不存在时为null
                */
                if (window.XMLHttpRequest) {
                        oajax = new XMLHttpRequest();
                } else {
                        oajax = new ActiveXObject("Microsoft.XMLHTTP");
                }

                // 连接服务器
                // open（方法，url，是否异步）
                var para = ""; // 请求参数
                var data = options.data || -1; // 缓存data
                if (typeof (data) === "object") {
                        // 请求参数拼接
                        for (var key in data) { 
                                if (data.hasOwnProperty(key)) {
                                        para += key + "=" + data[key] + "&";
                                }
                        }
                        para.replace(/&$/, "");
                } else {
                        para = "timestamp" + new Date().getTime();
                }

                // 发送请求
                var type = options.type || "GET";
                if (type === "GET") {
                        oajax.open("GET", url + "?" + para, true);
                        oajax.send(null);
                } else {
                        oajax.open("POST", url, true);
                        oajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        oajax.send(para);
                }

                // 接收返回
                oajax.onreadystatechange = function() {
                        if (oajax.readyState === 4) {
                                if (oajax.status === 200) {
                                        options.onsuccess(oajax.responseText, oajax);
                                } else {
                                // 判断是否存在相应失败函数
                                // 存在时，传入XML对象
                                        if (options.onfail) {
                                                options.onfail(oajax);
                                        }
                                }
                        }
                };
                return oajax;
        }
};
