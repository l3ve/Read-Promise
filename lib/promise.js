'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PromiseAplus = function () {
    function PromiseAplus(executor) {
        _classCallCheck(this, PromiseAplus);

        // 2.1
        /*
            promise有3个状态: pending, fulfilled, or rejected.
                if(pending), 则promise可以改变状态为fulfilled || rejected.
                if(fulfilled), 则不能改变状态,且必须有一个不可变的value.
                if(rejected), 则不能改变状态,且必须有一个不可变的reason.
        */
        this.status = 'pending'; //pending => fulfilled || rejected,不可逆
        this.value = undefined; // if(fulfilled)时的value
        this.onFulfills = [];
        this.onRejects = [];

        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
        this.then = this.then.bind(this);
        this.catch = this.catch.bind(this);

        //入口
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e);
        }
    }
    // 2.2.5
    // 2.2.6
    /*
        this.onFulfills[i](onFulfilled) 和this.onRejects[i](onRejected)必须是function.
    */


    _createClass(PromiseAplus, [{
        key: 'resolve',
        value: function resolve(value) {
            var _this = this;

            // 3.1
            setTimeout(function () {
                if (_this.status === 'pending') {
                    _this.status = 'fulfilled';
                    _this.value = value;
                    for (var i = 0; i < _this.onFulfills.length; i++) {
                        _this.onFulfills[i](value);
                    }
                }
            }, 0);
        }
    }, {
        key: 'reject',
        value: function reject(reason) {
            var _this2 = this;

            // 3.1
            setTimeout(function () {
                if (_this2.status === 'pending') {
                    _this2.status = 'rejected';
                    _this2.value = reason;
                    for (var i = 0; i < _this2.onRejects.length; i++) {
                        _this2.onRejects[i](reason);
                    }
                }
            }, 0);
        }
        // 2.2

    }, {
        key: 'then',
        value: function then(onFulfilled, onRejected) {
            var _this3 = this;

            var newPromise = void 0;
            // 2.2.1
            /*
                then接收2个缺省参数onFulfilled和onRejected.
                这2个参数如果不是function,则会被忽略(重置为空函数).
                默认的2个方法直接返回value||reason值是为了实现promise的穿透.
                例: promise().then().then().then((v)=>{console.log(v);})
            */
            onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) {
                return value;
            };
            onRejected = typeof onRejected === 'function' ? onRejected : function (reason) {
                throw reason;
            };
            /*
                如果onResolved或者onRejected不为函数就抛错
                if (typeof onFulfilled !== 'function' || typeof onRejected !== 'function') {
                    throw new Error('onFulfilled and onRejected must be a function ');
                }
            */

            // 2.2.7
            /*
                then方法一定会返回一个promise对象.
            */
            newPromise = new PromiseAplus(function (resolve, reject) {
                /*
                    如果还处于pending就丢进onFulfills和onRejects中,等状态变了在执行.
                */
                if (_this3.status === 'pending') {
                    _this3.onFulfills.push(function (value) {
                        try {
                            var v = onFulfilled(_this3.value);
                            /*
                                特殊处理then的返回的是promise,以下代码抽离到resolvePromise中实现
                                if (v instanceof PromiseAplus) {
                                    v.then(resolve, reject)
                                } else {
                                    否则用newPromise.resolve来返回v值.
                                    resolve(v);
                                }
                            */
                            _this3.resolvePromise(newPromise, v, resolve, reject);
                        } catch (reason) {
                            // 2.2.7.2
                            reject(reason);
                        }
                    });
                    _this3.onRejects.push(function (reason) {
                        try {
                            var v = onRejected(_this3.value);
                            /*
                                特殊处理then的返回的是promise,以下代码抽离到resolvePromise中实现
                                if (v instanceof PromiseAplus) {
                                    v.then(resolve, reject)
                                } else {
                                    否则用newPromise.resolve来返回v值.
                                    reject(v);
                                }
                            */
                            _this3.resolvePromise(newPromise, v, resolve, reject);
                        } catch (reason) {
                            // 2.2.7.2
                            reject(reason);
                        }
                    });
                }
                /*
                    如果已经是fulfilled或者rejected,则执行onFulfilled.
                    通用对onFulfilled的返回值进行判断,如果onFulfilled的返回值是promise,
                    则类似递归运行.
                */
                if (_this3.status === 'fulfilled') {
                    // 2.2.2
                    /*
                        基本同pending思路
                    */
                    // 3.1
                    setTimeout(function () {
                        try {
                            var v = onFulfilled(_this3.value);
                            /*
                                特殊处理then的返回的是promise,以下代码抽离到resolvePromise中实现
                                if (v instanceof PromiseAplus) {
                                    v.then(resolve, reject)
                                } else {
                                    否则用newPromise.resolve来返回v值.
                                    resolve(v);
                                }
                            */
                            _this3.resolvePromise(newPromise, v, resolve, reject);
                        } catch (reason) {
                            // 2.2.7.2
                            reject(reason);
                        }
                    }, 0);
                }
                /*
                    基本同fulfilled思路
                */
                if (_this3.status === 'rejected') {
                    // 2.2.3
                    // 3.1
                    setTimeout(function () {
                        try {
                            var v = onRejected(_this3.value);
                            /*
                                特殊处理then的返回的是promise,以下代码抽离到resolvePromise中实现
                                if (v instanceof PromiseAplus) {
                                    v.then(resolve, reject)
                                } else {
                                    否则用newPromise.resolve来返回v值.
                                    reject(v);
                                }
                            */
                            _this3.resolvePromise(newPromise, v, resolve, reject);
                        } catch (reason) {
                            // 2.2.7.2
                            reject(reason);
                        }
                    }, 0);
                }
            });
            return newPromise;
        }
    }, {
        key: 'catch',
        value: function _catch(onRejected) {
            return this.then(null, onRejected);
        }
        /*
            主要作用:
            1. 用来处理then里面的promise嵌套.
            2. 兼容其他实现方式的promise,可以混合调用.
        */

    }, {
        key: 'resolvePromise',
        value: function resolvePromise(newPromise, x, resolve, reject) {
            var _this4 = this;

            /*
                isIgnored用于当then为function的时,
                then的resolve和reject只能被调用一次
            */
            var isIgnored = false,
                then = void 0;
            // 2.3.1
            if (newPromise === x) {
                return reject(new TypeError(''));
            }
            // 2.3.2
            if (x instanceof PromiseAplus) {
                if (x.status === 'pending') {
                    /*
                        因为我们无法确定x.then.resolve取到的值还是不是promise,所以不能用以下的写法:
                        x.then(resolve, reject);
                        故让他递归,知道取到非promise值为止.
                    */
                    x.then(function (value) {
                        _this4.resolvePromise(newPromise, value, resolve, reject);
                    }, reject);
                } else {
                    x.then(resolve, reject);
                }
                return;
            }
            // 2.3.3
            if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' || typeof x === 'function') {
                then = x.then;
                try {
                    if (typeof then === 'function') {
                        then.call(x, function (y) {
                            // 2.3.3.3.3
                            if (isIgnored) return;
                            isIgnored = true;
                            return _this4.resolvePromise(newPromise, y, resolve, reject);
                        }, function (reason) {
                            // 2.3.3.3.3
                            if (isIgnored) return;
                            isIgnored = true;
                            return reject(reason);
                        });
                    } else {
                        // 2.3.3.4
                        resolve(x);
                    }
                } catch (reason) {
                    // 2.3.3.3.4.1
                    if (isIgnored) return;
                    return reject(reason);
                }
            } else {
                // 2.3.4
                resolve(x);
            }
        }
    }]);

    return PromiseAplus;
}();

//测试用


try {
    module.exports = PromiseAplus;
} catch (e) {}

PromiseAplus.deferred = PromiseAplus.defer = function () {
    var dfd = {};
    dfd.PromiseAplus = new PromiseAplus(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};