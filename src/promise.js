class PromiseAplus {
    constructor(executor) {
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
    resolve(value) {
        // 3.1
        setTimeout(() => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
                for (let i = 0; i < this.onFulfills.length; i++) {
                    this.onFulfills[i](value);
                }
            }
        }, 0);
    }
    reject(reason) {
        // 3.1
        setTimeout(() => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.value = reason;
                for (let i = 0; i < this.onRejects.length; i++) {
                    this.onRejects[i](reason);
                }
            }
        }, 0);
    }
    // 2.2
    then(onFulfilled, onRejected) {
        let newPromise;
        // 2.2.1
        /*
            then接收2个缺省参数onFulfilled和onRejected.
            这2个参数如果不是function,则会被忽略(重置为空函数).
            默认的2个方法直接返回value||reason值是为了实现promise的穿透.
            例: promise().then().then().then((v)=>{console.log(v);})
        */
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) { return value };
        onRejected = typeof onRejected === 'function' ? onRejected : function (reason) { throw reason };
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
        newPromise = new PromiseAplus((resolve, reject) => {
            /*
                如果还处于pending就丢进onFulfills和onRejects中,等状态变了在执行.
            */
            if (this.status === 'pending') {
                this.onFulfills.push((value) => {
                    try {
                        let v = onFulfilled(this.value);
                        /*
                            特殊处理then的返回的是promise,以下代码抽离到resolvePromise中实现
                            if (v instanceof PromiseAplus) {
                                v.then(resolve, reject)
                            } else {
                                否则用newPromise.resolve来返回v值.
                                resolve(v);
                            }
                        */
                        this.resolvePromise(newPromise, v, resolve, reject);
                    } catch (reason) {
                        // 2.2.7.2
                        reject(reason)
                    }
                });
                this.onRejects.push((reason) => {
                    try {
                        let v = onRejected(this.value);
                        /*
                            特殊处理then的返回的是promise,以下代码抽离到resolvePromise中实现
                            if (v instanceof PromiseAplus) {
                                v.then(resolve, reject)
                            } else {
                                否则用newPromise.resolve来返回v值.
                                reject(v);
                            }
                        */
                        this.resolvePromise(newPromise, v, resolve, reject);
                    } catch (reason) {
                        // 2.2.7.2
                        reject(reason)
                    }
                });
            }
            /*
                如果已经是fulfilled或者rejected,则执行onFulfilled.
                通用对onFulfilled的返回值进行判断,如果onFulfilled的返回值是promise,
                则类似递归运行.
            */
            if (this.status === 'fulfilled') {
                // 2.2.2
                /*
                    基本同pending思路
                */
                // 3.1
                setTimeout(() => {
                    try {
                        let v = onFulfilled(this.value);
                        /*
                            特殊处理then的返回的是promise,以下代码抽离到resolvePromise中实现
                            if (v instanceof PromiseAplus) {
                                v.then(resolve, reject)
                            } else {
                                否则用newPromise.resolve来返回v值.
                                resolve(v);
                            }
                        */
                        this.resolvePromise(newPromise, v, resolve, reject);
                    } catch (reason) {
                        // 2.2.7.2
                        reject(reason);
                    }
                }, 0);
            }
            /*
                基本同fulfilled思路
            */
            if (this.status === 'rejected') {
                // 2.2.3
                // 3.1
                setTimeout(() => {
                    try {
                        let v = onRejected(this.value);
                        /*
                            特殊处理then的返回的是promise,以下代码抽离到resolvePromise中实现
                            if (v instanceof PromiseAplus) {
                                v.then(resolve, reject)
                            } else {
                                否则用newPromise.resolve来返回v值.
                                reject(v);
                            }
                        */
                        this.resolvePromise(newPromise, v, resolve, reject);
                    } catch (reason) {
                        // 2.2.7.2
                        reject(reason)
                    }
                }, 0);
            }
        })
        return newPromise;
    }
    catch(onRejected) {
        return this.then(null, onRejected);
    }
    /*
        主要作用:
        1. 用来处理then里面的promise嵌套.
        2. 兼容其他实现方式的promise,可以混合调用.
    */
    resolvePromise(newPromise, x, resolve, reject) {
        /*
            isIgnored用于当then为function的时,
            then的resolve和reject只能被调用一次
        */
        let isIgnored = false,
            then;
        // 2.3.1
        if (newPromise === x) {
            return reject(new TypeError(''))
        }
        // 2.3.2
        if (x instanceof PromiseAplus) {
            if (x.status === 'pending') {
                /*
                    因为我们无法确定x.then.resolve取到的值还是不是promise,所以不能用以下的写法:
                    x.then(resolve, reject);
                    故让他递归,知道取到非promise值为止.
                */
                x.then((value) => {
                    this.resolvePromise(newPromise, value, resolve, reject);
                }, reject)
            } else {
                x.then(resolve, reject);
            }
            return
        }
        // 2.3.3
        if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
            try {
                then = x.then;
                if (typeof then === 'function') {
                    then.call(x, (y) => {
                        // 2.3.3.3.3
                        if (isIgnored) return;
                        isIgnored = true;
                        return this.resolvePromise(newPromise, y, resolve, reject);
                    }, (reason) => {
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
                isIgnored = true;
                return reject(reason);
            }
        } else {
            // 2.3.4
            resolve(x);
        }
    }
}

//测试用
try {
    module.exports = PromiseAplus
} catch (e) { }

PromiseAplus.deferred = PromiseAplus.defer = function () {
    var dfd = {}
    dfd.promise = new PromiseAplus(function (resolve, reject) {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}