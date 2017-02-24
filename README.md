# Read-Promise
深入了解promise的原理,尝试用ES6来实现(实现了基础的用法,还没通过promises-aplus-tests测试)

## 源码
* `src/promise.js`里包含了一些自己理解的注释

	注释里的序列号表示这块代码是根据英语规范的序列号来实现的

* `src/prmise-min.js`是优化代码后的源码,用来理解会比较费力

## 简单的分析
Promise对象最主要的也就4个方法 :

* resolve : 把之前所有存在onFulfills数组里的函数按顺序调用一遍
* reject : 把之前所有存在onRejects数组里的函数按顺序调用一遍
* then : 返回一个promise对象,根据status(pending, fulfilled, rejected),对then里的方法类型判断,对应执行存入数组或者对应调用方法
* resolvePromise : 根据传入的值判断是否需要递归调用,如果then里面还是promise则递归处理,否则对应执行resolve或者reject.

***个人理解Promise的实现可以高度概括为:自身递归的调用,等待status改变,然后触发不同的方法***

## 各个实现点
* then的链式写法: 每个then都会返回一个新的promise,所以能链式调用
* []onFulfills和[]onRejects: 一般链式写法数组是只会有一个值而已,特殊情况下会有多个,请参考: [此帖9楼](https://cnodejs.org/topic/5603cb8a152fdd025f0f5014)
*

## 参考以下文章
1. [Promise/A+规范](https://promisesaplus.com/)
2. [中文版精简规范](https://segmentfault.com/a/1190000002452115)
3. [简单实现Promise/A+. 对着文档 .含注释](https://cnodejs.org/topic/5603cb8a152fdd025f0f5014)
4. [剖析Promise内部结构，一步一步实现一个完整的、能通过所有Test case的Promise类](https://github.com/xieranmaya/blog/issues/3)