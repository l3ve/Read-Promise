class Promise {
    constructor(executor) {
        this.status = 'pending'; //pending  fulfilled  rejected
        this.value = undefined;
        this.thenable = 'thenable';
        this.onResolvedCallback = [];
        this.onRejectedCallback = [];
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e);
        }
    }
    resolve(value) {
        if (this.status === 'pending') {
            this.changeStatus('fulfilled');
            this.data = value;
            for (let i = 0; i < this.onResolvedCallback.length; i++) {
                this.onResolvedCallback[i](value);
            }
        }
    }
    reject(reason) {
        if (this.status === 'pending') {
            this.changeStatus('rejected');
            this.data = reason;
            for (let i = 0; i < this.onRejectedCallback.length; i++) {
                this.onRejectedCallback[i](reason);
            }
        }
    }
    then(onResolved, onRejected) {
        console.log('then');
        this.promise()
    }
    changeStatus(status) {
        this.status = status;
    }
    promise() {

    }
}