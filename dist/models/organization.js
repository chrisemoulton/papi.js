'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _model = require('../model');

var _model2 = _interopRequireDefault(_model);

var Organization = (function (_Model) {
  _inherits(Organization, _Model);

  function Organization() {
    _classCallCheck(this, Organization);

    _Model.apply(this, arguments);
  }

  return Organization;
})(_model2['default']);

exports['default'] = Organization;
module.exports = exports['default'];