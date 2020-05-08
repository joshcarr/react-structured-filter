'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _token = require('./token');

var _token2 = _interopRequireDefault(_token);

var _keyevent = require('../keyevent');

var _keyevent2 = _interopRequireDefault(_keyevent);

var _typeahead3 = require('../typeahead');

var _typeahead4 = _interopRequireDefault(_typeahead3);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 *
 * Example usage:
 *
 *      import StructuredFilter from 'react-structured-filter';
 *
 *      <StructuredFilter
 *        placeholder="Search..."
 *        options={[
 *          {category:"Name",type:"text"},
 *          {category:"Price",type:"number"},
 *        ]}
 *      />
 */
var Tokenizer = function (_Component) {
  _inherits(Tokenizer, _Component);

  function Tokenizer() {
    var _ref;

    _classCallCheck(this, Tokenizer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = Tokenizer.__proto__ || Object.getPrototypeOf(Tokenizer)).call.apply(_ref, [this].concat(args)));

    _this._addTokenForValue = _this._addTokenForValue.bind(_this);
    _this._onKeyDown = _this._onKeyDown.bind(_this);
    _this._getOptionsForTypeahead = _this._getOptionsForTypeahead.bind(_this);
    _this._removeTokenForValue = _this._removeTokenForValue.bind(_this);
    _this.typeahead = _react2.default.createRef();

    var header = {
      first: 'Category',
      second: 'Operator',
      third: 'Value'
    };

    if (typeof _this.props.header === 'boolean') {
      header = _this.props.header ? header : {};
    } else if (Object.prototype.toString.call(_this.props.header) === '[object Object]') {
      header = _this.props.header;
    }

    _this.state = {
      selected: _this.getStateFromProps(_this.props),
      category: '',
      operator: '',
      header: header
    };
    return _this;
  }

  _createClass(Tokenizer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.onChange(this.state.selected);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var update = {};
      if (nextProps.value !== this.props.value) {
        update.selected = this.getStateFromProps(nextProps);
      }
      this.setState(update);
    }
  }, {
    key: 'getStateFromProps',
    value: function getStateFromProps(props) {
      var value = props.value || props.defaultValue || [];
      return value.slice(0);
    }
  }, {
    key: '_renderTokens',
    value: function _renderTokens() {
      var _this2 = this;

      var tokenClasses = {};
      tokenClasses[this.props.customClasses.token] = !!this.props.customClasses.token;
      var classList = (0, _classnames2.default)(tokenClasses);
      var result = this.state.selected.map(function (selected) {
        var mykey = selected.category + selected.operator + selected.value;

        return _react2.default.createElement(
          _token2.default,
          {
            key: mykey,
            className: classList,
            onRemove: _this2._removeTokenForValue
          },
          selected
        );
      }, this);
      return result;
    }
  }, {
    key: '_getOptionsForTypeahead',
    value: function _getOptionsForTypeahead() {
      var categoryType = void 0;

      if (this.state.category === '') {
        var categories = [];
        for (var i = 0; i < this.props.options.length; i++) {
          categories.push(this.props.options[i].category);
        }
        return categories;
      } else if (this.state.operator === '') {
        categoryType = this._getCategoryType();

        var operators = (0, _objectAssign2.default)({}, Tokenizer.defaultProps.operators, this.props.operators);
        switch (categoryType) {
          case 'text':
            return operators.text;
          case 'textoptions':
            return operators.textoptions;
          case 'date':
            return operators.date;
          case 'number':
            return operators.number;
          default:
            /* eslint-disable no-console */
            console.warn('WARNING: Unknown category type in tokenizer: "' + categoryType + '"');
            /* eslint-enable no-console */
            return [];
        }
      }
      var options = this._getCategoryOptions();
      if (options === null || options === undefined) return [];
      return options();
    }
  }, {
    key: '_getHeader',
    value: function _getHeader() {
      if (this.state.category === '') {
        return this.state.header.first;
      } else if (this.state.operator === '') {
        return this.state.header.second;
      }

      return this.state.header.third;
    }
  }, {
    key: '_getCategoryType',
    value: function _getCategoryType(category) {
      var categoryType = void 0;
      var cat = category;
      if (!category || category === '') {
        cat = this.state.category;
      }
      for (var i = 0; i < this.props.options.length; i++) {
        if (this.props.options[i].category === cat) {
          categoryType = this.props.options[i].type;
          return categoryType;
        }
      }
    }
  }, {
    key: '_getCategoryOptions',
    value: function _getCategoryOptions() {
      for (var i = 0; i < this.props.options.length; i++) {
        if (this.props.options[i].category === this.state.category) {
          return this.props.options[i].options;
        }
      }
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(event) {
      // We only care about intercepting backspaces
      if (event.keyCode !== _keyevent2.default.DOM_VK_BACK_SPACE) {
        return;
      }

      // Remove token ONLY when bksp pressed at beginning of line
      // without a selection
      var typeahead = this.typeahead.current.getInstance();
      var entry = typeahead.inputRef();
      if (entry.selectionStart === entry.selectionEnd && entry.selectionStart === 0) {
        if (this.state.operator !== '') {
          this.setState({ operator: '' });
        } else if (this.state.category !== '') {
          this.setState({ category: '' });
        } else {
          // No tokens
          if (!this.state.selected.length) {
            return;
          }
          var lastSelected = JSON.parse(JSON.stringify(this.state.selected[this.state.selected.length - 1]));
          this._removeTokenForValue(this.state.selected[this.state.selected.length - 1]);
          this.setState({ category: lastSelected.category, operator: lastSelected.operator });
          // if ( this._getCategoryType( lastSelected.category ) !== 'textoptions' ) {
          //   typeahead.setEntryText( lastSelected.value );
          // }

          // this.setState({ category: '', operator: '' });
        }
        event.preventDefault();
      }
    }
  }, {
    key: '_removeTokenForValue',
    value: function _removeTokenForValue(value) {
      var index = this.state.selected.indexOf(value);
      if (index === -1) {
        return;
      }

      this.state.selected.splice(index, 1);
      this.setState({ selected: this.state.selected });
      this.props.onChange(this.state.selected);

      return;
    }
  }, {
    key: '_addTokenForValue',
    value: function _addTokenForValue(value) {
      if (this.state.category === '') {
        this.setState({ category: value });
        var _typeahead = this.typeahead.current.getInstance();
        _typeahead.setEntryText('');
        return;
      }

      if (this.state.operator === '') {
        this.setState({ operator: value });
        var _typeahead2 = this.typeahead.current.getInstance();
        _typeahead2.setEntryText('');
        return;
      }

      var newValue = {
        category: this.state.category,
        operator: this.state.operator,
        value: value
      };

      this.state.selected.push(newValue);
      this.setState({ selected: this.state.selected });
      var typeahead = this.typeahead.current.getInstance();
      typeahead.setEntryText('');
      this.props.onChange(this.state.selected);

      this.setState({
        category: '',
        operator: ''
      });

      return;
    }

    /*
     * Returns the data type the input should use ("date" or "text")
     */

  }, {
    key: '_getInputType',
    value: function _getInputType() {
      if (this.state.category !== '' && this.state.operator !== '') {
        return this._getCategoryType();
      }

      return 'text';
    }
  }, {
    key: 'render',
    value: function render() {
      var classes = {};
      classes[this.props.customClasses.typeahead] = !!this.props.customClasses.typeahead;
      var classList = (0, _classnames2.default)(classes);
      return _react2.default.createElement(
        'div',
        { className: 'filter-tokenizer' },
        _react2.default.createElement(
          'div',
          { className: 'token-collection' },
          this._renderTokens(),
          _react2.default.createElement(
            'div',
            { className: 'filter-input-group' },
            _react2.default.createElement(
              'div',
              { className: 'filter-category' },
              this.state.category,
              ' '
            ),
            _react2.default.createElement(
              'div',
              { className: 'filter-operator' },
              this.state.operator,
              ' '
            ),
            _react2.default.createElement(_typeahead4.default, { ref: this.typeahead,
              className: classList,
              placeholder: this.props.placeholder,
              customClasses: this.props.customClasses,
              options: this._getOptionsForTypeahead(),
              header: this._getHeader(),
              datatype: this._getInputType(),
              onOptionSelected: this._addTokenForValue,
              onKeyDown: this._onKeyDown
            })
          )
        )
      );
    }
  }]);

  return Tokenizer;
}(_react.Component);

Tokenizer.propTypes = {
  /**
   * An array of structures with the components `category` and `type`
   *
   * * _category_: Name of the first thing the user types.
   * * _type_: This can be one of the following:
   *   * _text_: Arbitrary text for the value. No autocomplete options.
   *     Operator choices will be: `==`, `!=`, `contains`, `!contains`.
   *   * _textoptions_: You must additionally pass an options value which
   *     will be a function that returns the list of options choices as an
   *     array (for example `function getOptions() {return ["MSFT", "AAPL",
   *     "GOOG"]}`). Operator choices will be: `==`, `!=`.
   *   * _number_: Arbitrary text for the value. No autocomplete options.
   *     Operator choices will be: `==`, `!=`, `<`, `<=`, `>`, `>=`.
   *   * _date_: Shows a calendar and the input must be of the form
   *     `MMM D, YYYY H:mm A`. Operator choices will be: `==`, `!=`, `<`, `<=`, `>`,
   *     `>=`.
   *
   * Example:
   *
   *     [
   *       {
   *         "category": "Symbol",
   *         "type": "textoptions",
   *         "options": function() {return ["MSFT", "AAPL", "GOOG"]}
   *       },
   *       {
   *         "category": "Name",
   *         "type": "text"
   *       },
   *       {
   *         "category": "Price",
   *         "type": "number"
   *       },
   *       {
   *         "category": "MarketCap",
   *         "type": "number"
   *       },
   *       {
   *         "category": "IPO",
   *         "type": "date"
   *       }
   *     ]
   */
  options: _propTypes2.default.array,

  /**
   * An object containing custom class names for child elements. Useful for
   * integrating with 3rd party UI kits. Allowed Keys: `input`, `results`,
   * `listItem`, `listAnchor`, `typeahead`, `hover`
   *
   * Example:
   *
   *     {
   *       input: 'filter-tokenizer-text-input',
   *       results: 'filter-tokenizer-list__container',
   *       listItem: 'filter-tokenizer-list__item'
   *     }
   */
  customClasses: _propTypes2.default.object,

  /**
   * **Uncontrolled Component:** A default set of values of tokens to be
   * loaded on first render. Each token should be an object with a
   * `category`, `operator`, and `value` key.
   *
   * Example:
   *
   *     [
   *       {
   *         category: 'Industry',
   *         operator: '==',
   *         value: 'Books',
   *       },
   *       {
   *         category: 'IPO',
   *         operator: '>',
   *         value: 'Dec 8, 1980 10:50 PM',
   *       },
   *       {
   *         category: 'Name',
   *         operator: 'contains',
   *         value: 'Nabokov',
   *       },
   *     ]
   */
  defaultValue: _propTypes2.default.array,

  /**
   * **Controlled Component:** A set of values of tokens to be loaded on
   * each render. Each token should be an object with a `category`,
   * `operator`, and `value` key.
   *
   * Example:
   *
   *     [
   *       {
   *         category: 'Industry',
   *         operator: '==',
   *         value: 'Books',
   *       },
   *       {
   *         category: 'IPO',
   *         operator: '>',
   *         value: 'Dec 8, 1980 10:50 PM',
   *       },
   *       {
   *         category: 'Name',
   *         operator: 'contains',
   *         value: 'Nabokov',
   *       },
   *     ]
   */
  value: _propTypes2.default.array,

  /**
   * Placeholder text for the typeahead input.
   */
  placeholder: _propTypes2.default.string,

  /**
   * Event handler triggered whenever the filter is changed and a token
   * is added or removed. Params: `(filter)`
   */
  onChange: _propTypes2.default.func,
  /**
   * A mapping of datatypes to operators.
   * Resolved by merging with default operators.
   * Example:
   *
   * ```javascript
   * {
   *    "textoptions":["equals","does not equal"],
   *    "text":["like","not like","equals","does not equal","matches","does not match"]
   * }
   * ```
   */
  operators: _propTypes2.default.object,
  /**
   * A mapping of headers to show
   * Example:
   * ```javascript
   * {
   *    "first": "Category",
   *    "second": "Operator",
   *    "third": "Value"
   * }
   * ```
   */
  header: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.bool])
};
Tokenizer.defaultProps = {
  // value: [],
  // defaultValue: [],
  options: [],
  customClasses: {},
  placeholder: '',
  onChange: function onChange() {},

  operators: {
    textoptions: ['==', '!='],
    text: ['==', '!=', 'contains', '!contains'],
    number: ['==', '!=', '<', '<=', '>', '>='],
    date: ['==', '!=', '<', '<=', '>', '>=']
  },
  header: true
};
exports.default = Tokenizer;