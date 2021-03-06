"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TslintFixTask = void 0;
const options_1 = require("./options");
/** @deprecated since version 11. Use `ng lint --fix` directly instead. */
class TslintFixTask {
    constructor(configOrPath, options) {
        if (options) {
            this._configOrPath = configOrPath;
            this._options = options;
        }
        else {
            this._options = configOrPath;
            this._configOrPath = null;
        }
    }
    toConfiguration() {
        const path = typeof this._configOrPath == 'string' ? { tslintPath: this._configOrPath } : {};
        const config = typeof this._configOrPath == 'object' && this._configOrPath !== null
            ? { tslintConfig: this._configOrPath }
            : {};
        const options = {
            ...this._options,
            ...path,
            ...config,
        };
        return { name: options_1.TslintFixName, options };
    }
}
exports.TslintFixTask = TslintFixTask;
