"use strict";
/**
 *
 *    Copyright (c) 2021 Silicon Labs
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
var futureKey = 'futures';
var valueKey = 'futureValues';
var timeoutMessage = '!---timeout---!';
/**
 * Block helper resolving the block if the
 * value of the specified future matches.
 *
 * @param {*} options
 */
function ifFuture(options) {
    var _this = this;
    var name = options.hash.name;
    var value = options.hash.value;
    if (!(futureKey in this.global)) {
        return;
    }
    var futurePromise = this.global[futureKey][name];
    if (futurePromise == null)
        return;
    return futurePromise.then(function (result) {
        if (result == timeoutMessage) {
            return '';
        }
        else if (value == result) {
            return options.fn(_this);
        }
        else {
            return '';
        }
    });
}
/**
 * This method sets the value of the future.
 * Use it as:
 *   {{set_future name="NAME" value="VALUE"}}
 * @param {*} options
 */
function setFuture(options) {
    var name = options.hash.name;
    var value = options.hash.value;
    this.global[valueKey][name] = value;
}
/**
 * This method defines the future with a given name.
 * Use it as: {{future name="NAME"}}
 *
 * @param {*} options
 */
function future(options) {
    var name = options.hash.name;
    var toS = options.hash.timeout;
    var timeout;
    if (toS == null) {
        timeout = 5000; // 5 second default timeout
    }
    else {
        timeout = parseInt(toS);
    }
    if (!(futureKey in this.global)) {
        this.global[futureKey] = {};
    }
    if (!(valueKey in this.global)) {
        this.global[valueKey] = {};
    }
    var valueObject = this.global[valueKey];
    var futurePromise = new Promise(function (resolve, reject) {
        var x = 0;
        var interval = setInterval(function () {
            if (valueObject[name] != undefined) {
                resolve(valueObject[name]);
                clearInterval(interval);
            }
            x++;
            if (10 * x > timeout) {
                resolve(timeoutMessage);
                clearInterval(interval);
            }
        }, 10);
    });
    this.global[futureKey][name] = futurePromise;
}
exports.if_future = ifFuture;
exports.set_future = setFuture;
exports.future = future;
//# sourceMappingURL=helper-future.js.map