# Read-Promise
深入了解promise的原理,尝试用ES6来实现(实现了基础的用法)

## 源码

已通过promises-aplus-tests测试

* `src/promise.js`里包含了一些自己理解的注释

	注释里的序列号表示这块代码是根据英语规范的序列号来实现的

* `src/prmise.min.js`是优化代码后的源码,去掉注释

## 简单的分析
Promise对象最主要的也就4个方法 :

* resolve : 把之前所有存在onFulfills数组里的函数按顺序调用一遍
* reject : 把之前所有存在onRejects数组里的函数按顺序调用一遍
* then : 返回一个promise对象,根据status(pending, fulfilled, rejected),对then里的方法类型判断,对应执行存入数组或者对应调用方法
* resolvePromise : 根据传入的值判断是否需要递归调用,如果then里面还是promise则递归处理,否则对应执行resolve或者reject.

***个人理解Promise的实现可以高度概括为:自身类递归的一个过程----解析then返回值,压栈,等待触发resolve或者reject,改变status,然后调用栈里的返回值***

## 各个实现点
* then的链式写法: 每个then都会返回一个新的promise,所以能链式调用
* []onFulfills和[]onRejects: 一般链式写法数组是只会有一个值而已,特殊情况下会有多个,请参考: [此帖9楼](https://cnodejs.org/topic/5603cb8a152fdd025f0f5014)
* 如何实现异步到同步: 其实只是把要把异步的东西存在数组里,在异步执行完成之后,触发执行数组里的东西.
* 解析promise: 规范里有个`[[Resolve]](promise, x)`,就是源码里的`resolvePromise`.

	他实际上做了2件事:
	1. 兼容各种promise的写法,因为promise只有规范,实现有很多种不同的方法
	2. 对then的返回值做判断,如果返回值还是promise对象,则按递归处理.

## 参考以下文章
1. [Promise/A+规范](https://promisesaplus.com/): `./promise.md`
2. [中文版精简规范](https://segmentfault.com/a/1190000002452115)
3. [简单实现Promise/A+. 对着文档 .含注释](https://cnodejs.org/topic/5603cb8a152fdd025f0f5014)
4. [剖析Promise内部结构，一步一步实现一个完整的、能通过所有Test case的Promise类](https://github.com/xieranmaya/blog/issues/3)