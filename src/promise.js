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
        this.reason = '';
        this.onFulfills = [];
        this.onRejects = [];

        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
        this.then = this.then.bind(this);
        this.catch = this.catch.bind(this);

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
        if (this.status === 'pending') {
            this.status = 'fulfilled';
            this.value = value;
            for (let i = 0; i < this.onFulfills.length; i++) {
                this.onFulfills[i](value);
            }
        }
    }
    reject(reason) {
        if (this.status === 'pending') {
            this.status = 'rejected';
            this.reason = reason;
            for (let i = 0; i < this.onRejects.length; i++) {
                this.onRejects[i](reason);
            }
        }
    }
    // 2.2
    then(onFulfilled, onRejected) {
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
        return new PromiseAplus((resolve, reject) => {
            if (this.status === 'pending') {
                this.onFulfills.push((value) => {
                    try {
                        let v = onFulfilled(this.value);
                        //特殊处理then的返回的是promise
                        if (v instanceof PromiseAplus) {
                            v.then(resolve, reject)
                        } else {
                            //否则用newPromise.resolve来返回值.
                            resolve(v);
                        }
                    } catch (reason) {
                        // 2.2.7.2
                        reject(reason)
                    }
                });
                this.onRejects.push((reason) => {
                    try {
                        let v = onRejected(this.value);
                        if (v instanceof PromiseAplus) {
                            v.then(resolve, reject)
                        } else {
                            reject(v);
                        }
                    } catch (reason) {
                        // 2.2.7.2
                        reject(reason)
                    }
                });
            }
            if (this.status === 'fulfilled') {
                // 2.2.2
                /*
                    基本同pending思路
                */
                try {
                    let v = onFulfilled(this.value);
                    if (v instanceof PromiseAplus) {
                        v.then(resolve, reject);
                    } else {
                        resolve(v);
                    }
                } catch (reason) {
                    // 2.2.7.2
                    reject(reason);
                }

            }
            if (this.status === 'rejected') {
                // 2.2.3
                /*
                    基本同pending思路
                */
                try {
                    let v = onRejected(this.value);
                    if (v instanceof PromiseAplus) {
                        v.then(resolve, reject);
                    } else {
                        reject(v);
                    }
                } catch (reason) {
                    // 2.2.7.2
                    reject(reason)
                }
            }
        })
    }
    catch(onRejected) {
        return this.then(null, onRejected);
    }
    resolvePromise(newPromise, v, resolve, reject) {

    }
}