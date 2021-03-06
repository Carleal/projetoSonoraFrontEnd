"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function _loadConfiguration(Configuration, options, root, file) {
    if (options.tslintConfig) {
        return Configuration.parseConfigFile(options.tslintConfig, root);
    }
    else if (options.tslintPath) {
        return Configuration.findConfiguration(path.join(root, options.tslintPath)).results;
    }
    else if (file) {
        return Configuration.findConfiguration(null, file).results;
    }
    else {
        throw new Error('Executor must specify a tslint configuration.');
    }
}
function _getFileContent(file, options, program) {
    // The linter retrieves the SourceFile TS node directly if a program is used
    if (program) {
        const source = program.getSourceFile(file);
        if (!source) {
            const message = `File '${file}' is not part of the TypeScript project '${options.tsConfigPath}'.`;
            throw new Error(message);
        }
        return source.getFullText(source);
    }
    // NOTE: The tslint CLI checks for and excludes MPEG transport streams; this does not.
    try {
        // Strip BOM from file data.
        // https://stackoverflow.com/questions/24356713
        return fs.readFileSync(file, 'utf-8').replace(/^\uFEFF/, '');
    }
    catch {
        throw new Error(`Could not read file '${file}'.`);
    }
}
function _listAllFiles(root) {
    const result = [];
    function _recurse(location) {
        const dir = fs.readdirSync(path.join(root, location));
        dir.forEach((name) => {
            const loc = path.join(location, name);
            if (fs.statSync(path.join(root, loc)).isDirectory()) {
                _recurse(loc);
            }
            else {
                result.push(loc);
            }
        });
    }
    _recurse('');
    return result;
}
/** @deprecated since version 11. Use `ng lint --fix` directly instead. */
function default_1() {
    return async (options = {}, context) => {
        const root = process.cwd();
        const tslint = await Promise.resolve().then(() => __importStar(require('tslint'))); // eslint-disable-line import/no-extraneous-dependencies
        const includes = Array.isArray(options.includes)
            ? options.includes
            : options.includes
                ? [options.includes]
                : [];
        const files = Array.isArray(options.files)
            ? options.files
            : options.files
                ? [options.files]
                : [];
        const Linter = tslint.Linter;
        const Configuration = tslint.Configuration;
        let program = undefined;
        let filesToLint = files;
        if (options.tsConfigPath && files.length == 0) {
            const tsConfigPath = path.join(process.cwd(), options.tsConfigPath);
            if (!fs.existsSync(tsConfigPath)) {
                throw new Error('Could not find tsconfig.');
            }
            program = Linter.createProgram(tsConfigPath);
            filesToLint = Linter.getFileNames(program);
        }
        if (includes.length > 0) {
            const allFilesRel = _listAllFiles(root);
            const pattern = '^(' +
                includes
                    .map((ex) => '(' +
                    ex
                        .split(/[\/\\]/g)
                        .map((f) => f
                        .replace(/[\-\[\]{}()+?.^$|]/g, '\\$&')
                        .replace(/^\*\*/g, '(.+?)?')
                        .replace(/\*/g, '[^/\\\\]*'))
                        .join('[/\\\\]') +
                    ')')
                    .join('|') +
                ')($|/|\\\\)';
            const re = new RegExp(pattern);
            filesToLint.push(...allFilesRel.filter((x) => re.test(x)).map((x) => path.join(root, x)));
        }
        const lintOptions = {
            fix: true,
            formatter: options.format || 'prose',
        };
        const linter = new Linter(lintOptions, program);
        // If directory doesn't change, we
        let lastDirectory = null;
        let config;
        for (const file of filesToLint) {
            const dir = path.dirname(file);
            if (lastDirectory !== dir) {
                lastDirectory = dir;
                config = _loadConfiguration(Configuration, options, root, file);
            }
            const content = _getFileContent(file, options, program);
            if (!content) {
                continue;
            }
            linter.lint(file, content, config);
        }
        const result = linter.getResult();
        // Format and show the results.
        if (!options.silent) {
            const Formatter = tslint.findFormatter(options.format || 'prose');
            if (!Formatter) {
                throw new Error(`Invalid lint format "${options.format}".`);
            }
            const formatter = new Formatter();
            // Certain tslint formatters outputs '\n' when there are no failures.
            // This will bloat the console when having schematics running refactor tasks.
            // see https://github.com/palantir/tslint/issues/4244
            const output = (formatter.format(result.failures, result.fixes) || '').trim();
            if (output) {
                context.logger.info(output);
            }
        }
        if (!options.ignoreErrors && result.errorCount > 0) {
            throw new Error('Lint errors were found.');
        }
    };
}
exports.default = default_1;
