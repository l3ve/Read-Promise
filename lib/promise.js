'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = function () {
    function Promise(executor) {
        _classCallCheck(this, Promise);

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

    _createClass(Promise, [{
        key: 'resolve',
        value: function resolve(value) {
            if (this.status === 'pending') {
                this.changeStatus('fulfilled');
                this.data = value;
                for (var i = 0; i < this.onResolvedCallback.length; i++) {
                    this.onResolvedCallback[i](value);
                }
            }
        }
    }, {
        key: 'reject',
        value: function reject(reason) {
            if (this.status === 'pending') {
                this.changeStatus('rejected');
                this.data = reason;
                for (var i = 0; i < this.onRejectedCallback.length; i++) {
                    this.onRejectedCallback[i](reason);
                }
            }
        }
    }, {
        key: 'then',
        value: function then(onResolved, onRejected) {
            console.log('then');
            this.promise();
        }
    }, {
        key: 'changeStatus',
        value: function changeStatus(status) {
            this.status = status;
        }
    }, {
        key: 'promise',
        value: function promise() {}
    }]);

    return Promise;
}();