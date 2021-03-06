"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeTransition;

var _postcssValueParser = require("postcss-value-parser");

var _cssnanoUtils = require("cssnano-utils");

var _addSpace = _interopRequireDefault(require("../lib/addSpace"));

var _getValue = _interopRequireDefault(require("../lib/getValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// transition: [ none | <single-transition-property> ] || <time> || <single-transition-timing-function> || <time>
const timingFunctions = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'];

function normalizeTransition(parsed) {
  let args = (0, _cssnanoUtils.getArguments)(parsed);
  let values = args.reduce((list, arg) => {
    let state = {
      timingFunction: [],
      property: [],
      time1: [],
      time2: []
    };
    arg.forEach(node => {
      const {
        type,
        value
      } = node;

      if (type === 'space') {
        return;
      }

      if (type === 'function' && ~['steps', 'cubic-bezier'].indexOf(value.toLowerCase())) {
        state.timingFunction = [...state.timingFunction, node, (0, _addSpace.default)()];
      } else if ((0, _postcssValueParser.unit)(value)) {
        if (!state.time1.length) {
          state.time1 = [...state.time1, node, (0, _addSpace.default)()];
        } else {
          state.time2 = [...state.time2, node, (0, _addSpace.default)()];
        }
      } else if (~timingFunctions.indexOf(value.toLowerCase())) {
        state.timingFunction = [...state.timingFunction, node, (0, _addSpace.default)()];
      } else {
        state.property = [...state.property, node, (0, _addSpace.default)()];
      }
    });
    return [...list, [...state.property, ...state.time1, ...state.timingFunction, ...state.time2]];
  }, []);
  return (0, _getValue.default)(values);
}

module.exports = exports.default;