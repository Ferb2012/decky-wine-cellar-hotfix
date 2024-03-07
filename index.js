(function (deckyFrontendLib, React) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    var TaskType;
    (function (TaskType) {
        TaskType["CheckForFlavorUpdates"] = "CheckForFlavorUpdates";
        TaskType["InstallCompatibilityTool"] = "InstallCompatibilityTool";
        TaskType["CancelCompatibilityToolInstall"] = "CancelCompatibilityToolInstall";
        TaskType["UninstallCompatibilityTool"] = "UninstallCompatibilityTool";
    })(TaskType || (TaskType = {}));
    var UpdaterState;
    (function (UpdaterState) {
        UpdaterState["Idle"] = "Idle";
        UpdaterState["Checking"] = "Checking";
    })(UpdaterState || (UpdaterState = {}));
    var CompatibilityToolFlavor;
    (function (CompatibilityToolFlavor) {
        CompatibilityToolFlavor["Unknown"] = "Unknown";
        CompatibilityToolFlavor["ProtonGE"] = "ProtonGE";
        //SteamTinkerLaunch = "SteamTinkerLaunch",
        CompatibilityToolFlavor["Luxtorpeda"] = "Luxtorpeda";
        CompatibilityToolFlavor["Boxtron"] = "Boxtron";
    })(CompatibilityToolFlavor || (CompatibilityToolFlavor = {}));
    var QueueCompatibilityToolState;
    (function (QueueCompatibilityToolState) {
        QueueCompatibilityToolState["Extracting"] = "Extracting";
        QueueCompatibilityToolState["Downloading"] = "Downloading";
        QueueCompatibilityToolState["Waiting"] = "Waiting";
    })(QueueCompatibilityToolState || (QueueCompatibilityToolState = {}));
    var RequestType;
    (function (RequestType) {
        RequestType["Task"] = "Task";
        RequestType["RequestState"] = "RequestState";
        RequestType["UpdateState"] = "UpdateState";
        RequestType["Notification"] = "Notification";
    })(RequestType || (RequestType = {}));

    const log = (...args) => {
        console.log(`%c Decky %c Wine Cellar %c`, "background: #16a085; color: black;", "background: #1abc9c; color: black;", "background: transparent;", ...args);
    };
    const error = (...args) => {
        console.error(`%c Decky %c Wine Cellar %c`, "background: #16a085; color: black;", "background: #FF0000;", "background: transparent;", ...args);
    };

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    let getRandomValues;
    const rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    const byteToHex = [];

    for (let i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).slice(1));
    }

    function unsafeStringify(arr, offset = 0) {
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
    }

    const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
    var native = {
      randomUUID
    };

    function v4(options, buf, offset) {
      if (native.randomUUID && !buf && !options) {
        return native.randomUUID();
      }

      options = options || {};
      const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (let i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return unsafeStringify(rnds);
    }

    var DefaultContext = {
      color: undefined,
      size: undefined,
      className: undefined,
      style: undefined,
      attr: undefined
    };
    var IconContext = React__default["default"].createContext && React__default["default"].createContext(DefaultContext);

    var __assign = window && window.__assign || function () {
      __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __rest = window && window.__rest || function (s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    };
    function Tree2Element(tree) {
      return tree && tree.map(function (node, i) {
        return React__default["default"].createElement(node.tag, __assign({
          key: i
        }, node.attr), Tree2Element(node.child));
      });
    }
    function GenIcon(data) {
      // eslint-disable-next-line react/display-name
      return function (props) {
        return React__default["default"].createElement(IconBase, __assign({
          attr: __assign({}, data.attr)
        }, props), Tree2Element(data.child));
      };
    }
    function IconBase(props) {
      var elem = function (conf) {
        var attr = props.attr,
          size = props.size,
          title = props.title,
          svgProps = __rest(props, ["attr", "size", "title"]);
        var computedSize = size || conf.size || "1em";
        var className;
        if (conf.className) className = conf.className;
        if (props.className) className = (className ? className + " " : "") + props.className;
        return React__default["default"].createElement("svg", __assign({
          stroke: "currentColor",
          fill: "currentColor",
          strokeWidth: "0"
        }, conf.attr, attr, svgProps, {
          className: className,
          style: __assign(__assign({
            color: props.color || conf.color
          }, conf.style), props.style),
          height: computedSize,
          width: computedSize,
          xmlns: "http://www.w3.org/2000/svg"
        }), title && React__default["default"].createElement("title", null, title), props.children);
      };
      return IconContext !== undefined ? React__default["default"].createElement(IconContext.Consumer, null, function (conf) {
        return elem(conf);
      }) : elem(DefaultContext);
    }

    // THIS FILE IS AUTO GENERATED
    function FaEllipsisH (props) {
      return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"}}]})(props);
    }

    /*!
     * Determine if an object is a Buffer
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */

    var isBuffer = function isBuffer (obj) {
      return obj != null && obj.constructor != null &&
        typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
    };

    /**
     * @typedef {import('unist').Node} Node
     * @typedef {import('unist').Point} Point
     * @typedef {import('unist').Position} Position
     */

    /**
     * @typedef NodeLike
     * @property {string} type
     * @property {PositionLike | null | undefined} [position]
     *
     * @typedef PositionLike
     * @property {PointLike | null | undefined} [start]
     * @property {PointLike | null | undefined} [end]
     *
     * @typedef PointLike
     * @property {number | null | undefined} [line]
     * @property {number | null | undefined} [column]
     * @property {number | null | undefined} [offset]
     */

    /**
     * Serialize the positional info of a point, position (start and end points),
     * or node.
     *
     * @param {Node | NodeLike | Position | PositionLike | Point | PointLike | null | undefined} [value]
     *   Node, position, or point.
     * @returns {string}
     *   Pretty printed positional info of a node (`string`).
     *
     *   In the format of a range `ls:cs-le:ce` (when given `node` or `position`)
     *   or a point `l:c` (when given `point`), where `l` stands for line, `c` for
     *   column, `s` for `start`, and `e` for end.
     *   An empty string (`''`) is returned if the given value is neither `node`,
     *   `position`, nor `point`.
     */
    function stringifyPosition(value) {
      // Nothing.
      if (!value || typeof value !== 'object') {
        return ''
      }

      // Node.
      if ('position' in value || 'type' in value) {
        return position$1(value.position)
      }

      // Position.
      if ('start' in value || 'end' in value) {
        return position$1(value)
      }

      // Point.
      if ('line' in value || 'column' in value) {
        return point$2(value)
      }

      // ?
      return ''
    }

    /**
     * @param {Point | PointLike | null | undefined} point
     * @returns {string}
     */
    function point$2(point) {
      return index$1(point && point.line) + ':' + index$1(point && point.column)
    }

    /**
     * @param {Position | PositionLike | null | undefined} pos
     * @returns {string}
     */
    function position$1(pos) {
      return point$2(pos && pos.start) + '-' + point$2(pos && pos.end)
    }

    /**
     * @param {number | null | undefined} value
     * @returns {number}
     */
    function index$1(value) {
      return value && typeof value === 'number' ? value : 1
    }

    /**
     * @typedef {import('unist').Node} Node
     * @typedef {import('unist').Position} Position
     * @typedef {import('unist').Point} Point
     * @typedef {object & {type: string, position?: Position | undefined}} NodeLike
     */

    /**
     * Message.
     */
    class VFileMessage extends Error {
      /**
       * Create a message for `reason` at `place` from `origin`.
       *
       * When an error is passed in as `reason`, the `stack` is copied.
       *
       * @param {string | Error | VFileMessage} reason
       *   Reason for message, uses the stack and message of the error if given.
       *
       *   > 👉 **Note**: you should use markdown.
       * @param {Node | NodeLike | Position | Point | null | undefined} [place]
       *   Place in file where the message occurred.
       * @param {string | null | undefined} [origin]
       *   Place in code where the message originates (example:
       *   `'my-package:my-rule'` or `'my-rule'`).
       * @returns
       *   Instance of `VFileMessage`.
       */
      // To do: next major: expose `undefined` everywhere instead of `null`.
      constructor(reason, place, origin) {
        /** @type {[string | null, string | null]} */
        const parts = [null, null];
        /** @type {Position} */
        let position = {
          // @ts-expect-error: we always follows the structure of `position`.
          start: {line: null, column: null},
          // @ts-expect-error: "
          end: {line: null, column: null}
        };

        super();

        if (typeof place === 'string') {
          origin = place;
          place = undefined;
        }

        if (typeof origin === 'string') {
          const index = origin.indexOf(':');

          if (index === -1) {
            parts[1] = origin;
          } else {
            parts[0] = origin.slice(0, index);
            parts[1] = origin.slice(index + 1);
          }
        }

        if (place) {
          // Node.
          if ('type' in place || 'position' in place) {
            if (place.position) {
              // To do: next major: deep clone.
              // @ts-expect-error: looks like a position.
              position = place.position;
            }
          }
          // Position.
          else if ('start' in place || 'end' in place) {
            // @ts-expect-error: looks like a position.
            // To do: next major: deep clone.
            position = place;
          }
          // Point.
          else if ('line' in place || 'column' in place) {
            // To do: next major: deep clone.
            position.start = place;
          }
        }

        // Fields from `Error`.
        /**
         * Serialized positional info of error.
         *
         * On normal errors, this would be something like `ParseError`, buit in
         * `VFile` messages we use this space to show where an error happened.
         */
        this.name = stringifyPosition(place) || '1:1';

        /**
         * Reason for message.
         *
         * @type {string}
         */
        this.message = typeof reason === 'object' ? reason.message : reason;

        /**
         * Stack of message.
         *
         * This is used by normal errors to show where something happened in
         * programming code, irrelevant for `VFile` messages,
         *
         * @type {string}
         */
        this.stack = '';

        if (typeof reason === 'object' && reason.stack) {
          this.stack = reason.stack;
        }

        /**
         * Reason for message.
         *
         * > 👉 **Note**: you should use markdown.
         *
         * @type {string}
         */
        this.reason = this.message;

        /* eslint-disable no-unused-expressions */
        /**
         * State of problem.
         *
         * * `true` — marks associated file as no longer processable (error)
         * * `false` — necessitates a (potential) change (warning)
         * * `null | undefined` — for things that might not need changing (info)
         *
         * @type {boolean | null | undefined}
         */
        this.fatal;

        /**
         * Starting line of error.
         *
         * @type {number | null}
         */
        this.line = position.start.line;

        /**
         * Starting column of error.
         *
         * @type {number | null}
         */
        this.column = position.start.column;

        /**
         * Full unist position.
         *
         * @type {Position | null}
         */
        this.position = position;

        /**
         * Namespace of message (example: `'my-package'`).
         *
         * @type {string | null}
         */
        this.source = parts[0];

        /**
         * Category of message (example: `'my-rule'`).
         *
         * @type {string | null}
         */
        this.ruleId = parts[1];

        /**
         * Path of a file (used throughout the `VFile` ecosystem).
         *
         * @type {string | null}
         */
        this.file;

        // The following fields are “well known”.
        // Not standard.
        // Feel free to add other non-standard fields to your messages.

        /**
         * Specify the source value that’s being reported, which is deemed
         * incorrect.
         *
         * @type {string | null}
         */
        this.actual;

        /**
         * Suggest acceptable values that can be used instead of `actual`.
         *
         * @type {Array<string> | null}
         */
        this.expected;

        /**
         * Link to docs for the message.
         *
         * > 👉 **Note**: this must be an absolute URL that can be passed as `x`
         * > to `new URL(x)`.
         *
         * @type {string | null}
         */
        this.url;

        /**
         * Long form description of the message (you should use markdown).
         *
         * @type {string | null}
         */
        this.note;
        /* eslint-enable no-unused-expressions */
      }
    }

    VFileMessage.prototype.file = '';
    VFileMessage.prototype.name = '';
    VFileMessage.prototype.reason = '';
    VFileMessage.prototype.message = '';
    VFileMessage.prototype.stack = '';
    VFileMessage.prototype.fatal = null;
    VFileMessage.prototype.column = null;
    VFileMessage.prototype.line = null;
    VFileMessage.prototype.source = null;
    VFileMessage.prototype.ruleId = null;
    VFileMessage.prototype.position = null;

    // A derivative work based on:
    // <https://github.com/browserify/path-browserify>.
    // Which is licensed:
    //
    // MIT License
    //
    // Copyright (c) 2013 James Halliday
    //
    // Permission is hereby granted, free of charge, to any person obtaining a copy of
    // this software and associated documentation files (the "Software"), to deal in
    // the Software without restriction, including without limitation the rights to
    // use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    // the Software, and to permit persons to whom the Software is furnished to do so,
    // subject to the following conditions:
    //
    // The above copyright notice and this permission notice shall be included in all
    // copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    // FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    // COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    // IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    // CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    // A derivative work based on:
    //
    // Parts of that are extracted from Node’s internal `path` module:
    // <https://github.com/nodejs/node/blob/master/lib/path.js>.
    // Which is licensed:
    //
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    const path$1 = {basename, dirname, extname, join, sep: '/'};

    /* eslint-disable max-depth, complexity */

    /**
     * Get the basename from a path.
     *
     * @param {string} path
     *   File path.
     * @param {string | undefined} [ext]
     *   Extension to strip.
     * @returns {string}
     *   Stem or basename.
     */
    function basename(path, ext) {
      if (ext !== undefined && typeof ext !== 'string') {
        throw new TypeError('"ext" argument must be a string')
      }

      assertPath$1(path);
      let start = 0;
      let end = -1;
      let index = path.length;
      /** @type {boolean | undefined} */
      let seenNonSlash;

      if (ext === undefined || ext.length === 0 || ext.length > path.length) {
        while (index--) {
          if (path.charCodeAt(index) === 47 /* `/` */) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now.
            if (seenNonSlash) {
              start = index + 1;
              break
            }
          } else if (end < 0) {
            // We saw the first non-path separator, mark this as the end of our
            // path component.
            seenNonSlash = true;
            end = index + 1;
          }
        }

        return end < 0 ? '' : path.slice(start, end)
      }

      if (ext === path) {
        return ''
      }

      let firstNonSlashEnd = -1;
      let extIndex = ext.length - 1;

      while (index--) {
        if (path.charCodeAt(index) === 47 /* `/` */) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now.
          if (seenNonSlash) {
            start = index + 1;
            break
          }
        } else {
          if (firstNonSlashEnd < 0) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching.
            seenNonSlash = true;
            firstNonSlashEnd = index + 1;
          }

          if (extIndex > -1) {
            // Try to match the explicit extension.
            if (path.charCodeAt(index) === ext.charCodeAt(extIndex--)) {
              if (extIndex < 0) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = index;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIndex = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) {
        end = firstNonSlashEnd;
      } else if (end < 0) {
        end = path.length;
      }

      return path.slice(start, end)
    }

    /**
     * Get the dirname from a path.
     *
     * @param {string} path
     *   File path.
     * @returns {string}
     *   File path.
     */
    function dirname(path) {
      assertPath$1(path);

      if (path.length === 0) {
        return '.'
      }

      let end = -1;
      let index = path.length;
      /** @type {boolean | undefined} */
      let unmatchedSlash;

      // Prefix `--` is important to not run on `0`.
      while (--index) {
        if (path.charCodeAt(index) === 47 /* `/` */) {
          if (unmatchedSlash) {
            end = index;
            break
          }
        } else if (!unmatchedSlash) {
          // We saw the first non-path separator
          unmatchedSlash = true;
        }
      }

      return end < 0
        ? path.charCodeAt(0) === 47 /* `/` */
          ? '/'
          : '.'
        : end === 1 && path.charCodeAt(0) === 47 /* `/` */
        ? '//'
        : path.slice(0, end)
    }

    /**
     * Get an extname from a path.
     *
     * @param {string} path
     *   File path.
     * @returns {string}
     *   Extname.
     */
    function extname(path) {
      assertPath$1(path);

      let index = path.length;

      let end = -1;
      let startPart = 0;
      let startDot = -1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find.
      let preDotState = 0;
      /** @type {boolean | undefined} */
      let unmatchedSlash;

      while (index--) {
        const code = path.charCodeAt(index);

        if (code === 47 /* `/` */) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now.
          if (unmatchedSlash) {
            startPart = index + 1;
            break
          }

          continue
        }

        if (end < 0) {
          // We saw the first non-path separator, mark this as the end of our
          // extension.
          unmatchedSlash = true;
          end = index + 1;
        }

        if (code === 46 /* `.` */) {
          // If this is our first dot, mark it as the start of our extension.
          if (startDot < 0) {
            startDot = index;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot > -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension.
          preDotState = -1;
        }
      }

      if (
        startDot < 0 ||
        end < 0 ||
        // We saw a non-dot character immediately before the dot.
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly `..`.
        (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
      ) {
        return ''
      }

      return path.slice(startDot, end)
    }

    /**
     * Join segments from a path.
     *
     * @param {Array<string>} segments
     *   Path segments.
     * @returns {string}
     *   File path.
     */
    function join(...segments) {
      let index = -1;
      /** @type {string | undefined} */
      let joined;

      while (++index < segments.length) {
        assertPath$1(segments[index]);

        if (segments[index]) {
          joined =
            joined === undefined ? segments[index] : joined + '/' + segments[index];
        }
      }

      return joined === undefined ? '.' : normalize$1(joined)
    }

    /**
     * Normalize a basic file path.
     *
     * @param {string} path
     *   File path.
     * @returns {string}
     *   File path.
     */
    // Note: `normalize` is not exposed as `path.normalize`, so some code is
    // manually removed from it.
    function normalize$1(path) {
      assertPath$1(path);

      const absolute = path.charCodeAt(0) === 47; /* `/` */

      // Normalize the path according to POSIX rules.
      let value = normalizeString(path, !absolute);

      if (value.length === 0 && !absolute) {
        value = '.';
      }

      if (value.length > 0 && path.charCodeAt(path.length - 1) === 47 /* / */) {
        value += '/';
      }

      return absolute ? '/' + value : value
    }

    /**
     * Resolve `.` and `..` elements in a path with directory names.
     *
     * @param {string} path
     *   File path.
     * @param {boolean} allowAboveRoot
     *   Whether `..` can move above root.
     * @returns {string}
     *   File path.
     */
    function normalizeString(path, allowAboveRoot) {
      let result = '';
      let lastSegmentLength = 0;
      let lastSlash = -1;
      let dots = 0;
      let index = -1;
      /** @type {number | undefined} */
      let code;
      /** @type {number} */
      let lastSlashIndex;

      while (++index <= path.length) {
        if (index < path.length) {
          code = path.charCodeAt(index);
        } else if (code === 47 /* `/` */) {
          break
        } else {
          code = 47; /* `/` */
        }

        if (code === 47 /* `/` */) {
          if (lastSlash === index - 1 || dots === 1) ; else if (lastSlash !== index - 1 && dots === 2) {
            if (
              result.length < 2 ||
              lastSegmentLength !== 2 ||
              result.charCodeAt(result.length - 1) !== 46 /* `.` */ ||
              result.charCodeAt(result.length - 2) !== 46 /* `.` */
            ) {
              if (result.length > 2) {
                lastSlashIndex = result.lastIndexOf('/');

                if (lastSlashIndex !== result.length - 1) {
                  if (lastSlashIndex < 0) {
                    result = '';
                    lastSegmentLength = 0;
                  } else {
                    result = result.slice(0, lastSlashIndex);
                    lastSegmentLength = result.length - 1 - result.lastIndexOf('/');
                  }

                  lastSlash = index;
                  dots = 0;
                  continue
                }
              } else if (result.length > 0) {
                result = '';
                lastSegmentLength = 0;
                lastSlash = index;
                dots = 0;
                continue
              }
            }

            if (allowAboveRoot) {
              result = result.length > 0 ? result + '/..' : '..';
              lastSegmentLength = 2;
            }
          } else {
            if (result.length > 0) {
              result += '/' + path.slice(lastSlash + 1, index);
            } else {
              result = path.slice(lastSlash + 1, index);
            }

            lastSegmentLength = index - lastSlash - 1;
          }

          lastSlash = index;
          dots = 0;
        } else if (code === 46 /* `.` */ && dots > -1) {
          dots++;
        } else {
          dots = -1;
        }
      }

      return result
    }

    /**
     * Make sure `path` is a string.
     *
     * @param {string} path
     *   File path.
     * @returns {asserts path is string}
     *   Nothing.
     */
    function assertPath$1(path) {
      if (typeof path !== 'string') {
        throw new TypeError(
          'Path must be a string. Received ' + JSON.stringify(path)
        )
      }
    }

    /* eslint-enable max-depth, complexity */

    // Somewhat based on:
    // <https://github.com/defunctzombie/node-process/blob/master/browser.js>.
    // But I don’t think one tiny line of code can be copyrighted. 😅
    const proc = {cwd};

    function cwd() {
      return '/'
    }

    /**
     * @typedef URL
     * @property {string} hash
     * @property {string} host
     * @property {string} hostname
     * @property {string} href
     * @property {string} origin
     * @property {string} password
     * @property {string} pathname
     * @property {string} port
     * @property {string} protocol
     * @property {string} search
     * @property {any} searchParams
     * @property {string} username
     * @property {() => string} toString
     * @property {() => string} toJSON
     */

    /**
     * Check if `fileUrlOrPath` looks like a URL.
     *
     * @param {unknown} fileUrlOrPath
     *   File path or URL.
     * @returns {fileUrlOrPath is URL}
     *   Whether it’s a URL.
     */
    // From: <https://github.com/nodejs/node/blob/fcf8ba4/lib/internal/url.js#L1501>
    function isUrl(fileUrlOrPath) {
      return (
        fileUrlOrPath !== null &&
        typeof fileUrlOrPath === 'object' &&
        // @ts-expect-error: indexable.
        fileUrlOrPath.href &&
        // @ts-expect-error: indexable.
        fileUrlOrPath.origin
      )
    }

    /// <reference lib="dom" />

    // See: <https://github.com/nodejs/node/blob/fcf8ba4/lib/internal/url.js>

    /**
     * @param {string | URL} path
     *   File URL.
     * @returns {string}
     *   File URL.
     */
    function urlToPath(path) {
      if (typeof path === 'string') {
        path = new URL(path);
      } else if (!isUrl(path)) {
        /** @type {NodeJS.ErrnoException} */
        const error = new TypeError(
          'The "path" argument must be of type string or an instance of URL. Received `' +
            path +
            '`'
        );
        error.code = 'ERR_INVALID_ARG_TYPE';
        throw error
      }

      if (path.protocol !== 'file:') {
        /** @type {NodeJS.ErrnoException} */
        const error = new TypeError('The URL must be of scheme file');
        error.code = 'ERR_INVALID_URL_SCHEME';
        throw error
      }

      return getPathFromURLPosix(path)
    }

    /**
     * Get a path from a POSIX URL.
     *
     * @param {URL} url
     *   URL.
     * @returns {string}
     *   File path.
     */
    function getPathFromURLPosix(url) {
      if (url.hostname !== '') {
        /** @type {NodeJS.ErrnoException} */
        const error = new TypeError(
          'File URL host must be "localhost" or empty on darwin'
        );
        error.code = 'ERR_INVALID_FILE_URL_HOST';
        throw error
      }

      const pathname = url.pathname;
      let index = -1;

      while (++index < pathname.length) {
        if (
          pathname.charCodeAt(index) === 37 /* `%` */ &&
          pathname.charCodeAt(index + 1) === 50 /* `2` */
        ) {
          const third = pathname.charCodeAt(index + 2);
          if (third === 70 /* `F` */ || third === 102 /* `f` */) {
            /** @type {NodeJS.ErrnoException} */
            const error = new TypeError(
              'File URL path must not include encoded / characters'
            );
            error.code = 'ERR_INVALID_FILE_URL_PATH';
            throw error
          }
        }
      }

      return decodeURIComponent(pathname)
    }

    /**
     * @typedef {import('unist').Node} Node
     * @typedef {import('unist').Position} Position
     * @typedef {import('unist').Point} Point
     * @typedef {import('./minurl.shared.js').URL} URL
     * @typedef {import('../index.js').Data} Data
     * @typedef {import('../index.js').Value} Value
     */

    /**
     * Order of setting (least specific to most), we need this because otherwise
     * `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
     * stem can be set.
     *
     * @type {Array<'basename' | 'dirname' | 'extname' | 'history' | 'path' | 'stem'>}
     */
    const order = ['history', 'path', 'basename', 'stem', 'extname', 'dirname'];

    class VFile {
      /**
       * Create a new virtual file.
       *
       * `options` is treated as:
       *
       * *   `string` or `Buffer` — `{value: options}`
       * *   `URL` — `{path: options}`
       * *   `VFile` — shallow copies its data over to the new file
       * *   `object` — all fields are shallow copied over to the new file
       *
       * Path related fields are set in the following order (least specific to
       * most specific): `history`, `path`, `basename`, `stem`, `extname`,
       * `dirname`.
       *
       * You cannot set `dirname` or `extname` without setting either `history`,
       * `path`, `basename`, or `stem` too.
       *
       * @param {Compatible | null | undefined} [value]
       *   File value.
       * @returns
       *   New instance.
       */
      constructor(value) {
        /** @type {Options | VFile} */
        let options;

        if (!value) {
          options = {};
        } else if (typeof value === 'string' || buffer(value)) {
          options = {value};
        } else if (isUrl(value)) {
          options = {path: value};
        } else {
          options = value;
        }

        /**
         * Place to store custom information (default: `{}`).
         *
         * It’s OK to store custom data directly on the file but moving it to
         * `data` is recommended.
         *
         * @type {Data}
         */
        this.data = {};

        /**
         * List of messages associated with the file.
         *
         * @type {Array<VFileMessage>}
         */
        this.messages = [];

        /**
         * List of filepaths the file moved between.
         *
         * The first is the original path and the last is the current path.
         *
         * @type {Array<string>}
         */
        this.history = [];

        /**
         * Base of `path` (default: `process.cwd()` or `'/'` in browsers).
         *
         * @type {string}
         */
        this.cwd = proc.cwd();

        /* eslint-disable no-unused-expressions */
        /**
         * Raw value.
         *
         * @type {Value}
         */
        this.value;

        // The below are non-standard, they are “well-known”.
        // As in, used in several tools.

        /**
         * Whether a file was saved to disk.
         *
         * This is used by vfile reporters.
         *
         * @type {boolean}
         */
        this.stored;

        /**
         * Custom, non-string, compiled, representation.
         *
         * This is used by unified to store non-string results.
         * One example is when turning markdown into React nodes.
         *
         * @type {unknown}
         */
        this.result;

        /**
         * Source map.
         *
         * This type is equivalent to the `RawSourceMap` type from the `source-map`
         * module.
         *
         * @type {Map | null | undefined}
         */
        this.map;
        /* eslint-enable no-unused-expressions */

        // Set path related properties in the correct order.
        let index = -1;

        while (++index < order.length) {
          const prop = order[index];

          // Note: we specifically use `in` instead of `hasOwnProperty` to accept
          // `vfile`s too.
          if (
            prop in options &&
            options[prop] !== undefined &&
            options[prop] !== null
          ) {
            // @ts-expect-error: TS doesn’t understand basic reality.
            this[prop] = prop === 'history' ? [...options[prop]] : options[prop];
          }
        }

        /** @type {string} */
        let prop;

        // Set non-path related properties.
        for (prop in options) {
          // @ts-expect-error: fine to set other things.
          if (!order.includes(prop)) {
            // @ts-expect-error: fine to set other things.
            this[prop] = options[prop];
          }
        }
      }

      /**
       * Get the full path (example: `'~/index.min.js'`).
       *
       * @returns {string}
       */
      get path() {
        return this.history[this.history.length - 1]
      }

      /**
       * Set the full path (example: `'~/index.min.js'`).
       *
       * Cannot be nullified.
       * You can set a file URL (a `URL` object with a `file:` protocol) which will
       * be turned into a path with `url.fileURLToPath`.
       *
       * @param {string | URL} path
       */
      set path(path) {
        if (isUrl(path)) {
          path = urlToPath(path);
        }

        assertNonEmpty(path, 'path');

        if (this.path !== path) {
          this.history.push(path);
        }
      }

      /**
       * Get the parent path (example: `'~'`).
       */
      get dirname() {
        return typeof this.path === 'string' ? path$1.dirname(this.path) : undefined
      }

      /**
       * Set the parent path (example: `'~'`).
       *
       * Cannot be set if there’s no `path` yet.
       */
      set dirname(dirname) {
        assertPath(this.basename, 'dirname');
        this.path = path$1.join(dirname || '', this.basename);
      }

      /**
       * Get the basename (including extname) (example: `'index.min.js'`).
       */
      get basename() {
        return typeof this.path === 'string' ? path$1.basename(this.path) : undefined
      }

      /**
       * Set basename (including extname) (`'index.min.js'`).
       *
       * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
       * on windows).
       * Cannot be nullified (use `file.path = file.dirname` instead).
       */
      set basename(basename) {
        assertNonEmpty(basename, 'basename');
        assertPart(basename, 'basename');
        this.path = path$1.join(this.dirname || '', basename);
      }

      /**
       * Get the extname (including dot) (example: `'.js'`).
       */
      get extname() {
        return typeof this.path === 'string' ? path$1.extname(this.path) : undefined
      }

      /**
       * Set the extname (including dot) (example: `'.js'`).
       *
       * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
       * on windows).
       * Cannot be set if there’s no `path` yet.
       */
      set extname(extname) {
        assertPart(extname, 'extname');
        assertPath(this.dirname, 'extname');

        if (extname) {
          if (extname.charCodeAt(0) !== 46 /* `.` */) {
            throw new Error('`extname` must start with `.`')
          }

          if (extname.includes('.', 1)) {
            throw new Error('`extname` cannot contain multiple dots')
          }
        }

        this.path = path$1.join(this.dirname, this.stem + (extname || ''));
      }

      /**
       * Get the stem (basename w/o extname) (example: `'index.min'`).
       */
      get stem() {
        return typeof this.path === 'string'
          ? path$1.basename(this.path, this.extname)
          : undefined
      }

      /**
       * Set the stem (basename w/o extname) (example: `'index.min'`).
       *
       * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
       * on windows).
       * Cannot be nullified (use `file.path = file.dirname` instead).
       */
      set stem(stem) {
        assertNonEmpty(stem, 'stem');
        assertPart(stem, 'stem');
        this.path = path$1.join(this.dirname || '', stem + (this.extname || ''));
      }

      /**
       * Serialize the file.
       *
       * @param {BufferEncoding | null | undefined} [encoding='utf8']
       *   Character encoding to understand `value` as when it’s a `Buffer`
       *   (default: `'utf8'`).
       * @returns {string}
       *   Serialized file.
       */
      toString(encoding) {
        return (this.value || '').toString(encoding || undefined)
      }

      /**
       * Create a warning message associated with the file.
       *
       * Its `fatal` is set to `false` and `file` is set to the current file path.
       * Its added to `file.messages`.
       *
       * @param {string | Error | VFileMessage} reason
       *   Reason for message, uses the stack and message of the error if given.
       * @param {Node | NodeLike | Position | Point | null | undefined} [place]
       *   Place in file where the message occurred.
       * @param {string | null | undefined} [origin]
       *   Place in code where the message originates (example:
       *   `'my-package:my-rule'` or `'my-rule'`).
       * @returns {VFileMessage}
       *   Message.
       */
      message(reason, place, origin) {
        const message = new VFileMessage(reason, place, origin);

        if (this.path) {
          message.name = this.path + ':' + message.name;
          message.file = this.path;
        }

        message.fatal = false;

        this.messages.push(message);

        return message
      }

      /**
       * Create an info message associated with the file.
       *
       * Its `fatal` is set to `null` and `file` is set to the current file path.
       * Its added to `file.messages`.
       *
       * @param {string | Error | VFileMessage} reason
       *   Reason for message, uses the stack and message of the error if given.
       * @param {Node | NodeLike | Position | Point | null | undefined} [place]
       *   Place in file where the message occurred.
       * @param {string | null | undefined} [origin]
       *   Place in code where the message originates (example:
       *   `'my-package:my-rule'` or `'my-rule'`).
       * @returns {VFileMessage}
       *   Message.
       */
      info(reason, place, origin) {
        const message = this.message(reason, place, origin);

        message.fatal = null;

        return message
      }

      /**
       * Create a fatal error associated with the file.
       *
       * Its `fatal` is set to `true` and `file` is set to the current file path.
       * Its added to `file.messages`.
       *
       * > 👉 **Note**: a fatal error means that a file is no longer processable.
       *
       * @param {string | Error | VFileMessage} reason
       *   Reason for message, uses the stack and message of the error if given.
       * @param {Node | NodeLike | Position | Point | null | undefined} [place]
       *   Place in file where the message occurred.
       * @param {string | null | undefined} [origin]
       *   Place in code where the message originates (example:
       *   `'my-package:my-rule'` or `'my-rule'`).
       * @returns {never}
       *   Message.
       * @throws {VFileMessage}
       *   Message.
       */
      fail(reason, place, origin) {
        const message = this.message(reason, place, origin);

        message.fatal = true;

        throw message
      }
    }

    /**
     * Assert that `part` is not a path (as in, does not contain `path.sep`).
     *
     * @param {string | null | undefined} part
     *   File path part.
     * @param {string} name
     *   Part name.
     * @returns {void}
     *   Nothing.
     */
    function assertPart(part, name) {
      if (part && part.includes(path$1.sep)) {
        throw new Error(
          '`' + name + '` cannot be a path: did not expect `' + path$1.sep + '`'
        )
      }
    }

    /**
     * Assert that `part` is not empty.
     *
     * @param {string | undefined} part
     *   Thing.
     * @param {string} name
     *   Part name.
     * @returns {asserts part is string}
     *   Nothing.
     */
    function assertNonEmpty(part, name) {
      if (!part) {
        throw new Error('`' + name + '` cannot be empty')
      }
    }

    /**
     * Assert `path` exists.
     *
     * @param {string | undefined} path
     *   Path.
     * @param {string} name
     *   Dependency name.
     * @returns {asserts path is string}
     *   Nothing.
     */
    function assertPath(path, name) {
      if (!path) {
        throw new Error('Setting `' + name + '` requires `path` to be set too')
      }
    }

    /**
     * Assert `value` is a buffer.
     *
     * @param {unknown} value
     *   thing.
     * @returns {value is Buffer}
     *   Whether `value` is a Node.js buffer.
     */
    function buffer(value) {
      return isBuffer(value)
    }

    /**
     * Throw a given error.
     *
     * @param {Error|null|undefined} [error]
     *   Maybe error.
     * @returns {asserts error is null|undefined}
     */
    function bail(error) {
      if (error) {
        throw error
      }
    }

    var hasOwn = Object.prototype.hasOwnProperty;
    var toStr = Object.prototype.toString;
    var defineProperty = Object.defineProperty;
    var gOPD = Object.getOwnPropertyDescriptor;

    var isArray = function isArray(arr) {
    	if (typeof Array.isArray === 'function') {
    		return Array.isArray(arr);
    	}

    	return toStr.call(arr) === '[object Array]';
    };

    var isPlainObject$1 = function isPlainObject(obj) {
    	if (!obj || toStr.call(obj) !== '[object Object]') {
    		return false;
    	}

    	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
    	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
    	// Not own constructor property must be Object
    	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    		return false;
    	}

    	// Own properties are enumerated firstly, so to speed up,
    	// if last one is own, then all properties are own.
    	var key;
    	for (key in obj) { /**/ }

    	return typeof key === 'undefined' || hasOwn.call(obj, key);
    };

    // If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
    var setProperty = function setProperty(target, options) {
    	if (defineProperty && options.name === '__proto__') {
    		defineProperty(target, options.name, {
    			enumerable: true,
    			configurable: true,
    			value: options.newValue,
    			writable: true
    		});
    	} else {
    		target[options.name] = options.newValue;
    	}
    };

    // Return undefined instead of __proto__ if '__proto__' is not an own property
    var getProperty = function getProperty(obj, name) {
    	if (name === '__proto__') {
    		if (!hasOwn.call(obj, name)) {
    			return void 0;
    		} else if (gOPD) {
    			// In early versions of node, obj['__proto__'] is buggy when obj has
    			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
    			return gOPD(obj, name).value;
    		}
    	}

    	return obj[name];
    };

    var extend = function extend() {
    	var options, name, src, copy, copyIsArray, clone;
    	var target = arguments[0];
    	var i = 1;
    	var length = arguments.length;
    	var deep = false;

    	// Handle a deep copy situation
    	if (typeof target === 'boolean') {
    		deep = target;
    		target = arguments[1] || {};
    		// skip the boolean and the target
    		i = 2;
    	}
    	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
    		target = {};
    	}

    	for (; i < length; ++i) {
    		options = arguments[i];
    		// Only deal with non-null/undefined values
    		if (options != null) {
    			// Extend the base object
    			for (name in options) {
    				src = getProperty(target, name);
    				copy = getProperty(options, name);

    				// Prevent never-ending loop
    				if (target !== copy) {
    					// Recurse if we're merging plain objects or arrays
    					if (deep && copy && (isPlainObject$1(copy) || (copyIsArray = isArray(copy)))) {
    						if (copyIsArray) {
    							copyIsArray = false;
    							clone = src && isArray(src) ? src : [];
    						} else {
    							clone = src && isPlainObject$1(src) ? src : {};
    						}

    						// Never move original objects, clone them
    						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

    					// Don't bring in undefined values
    					} else if (typeof copy !== 'undefined') {
    						setProperty(target, { name: name, newValue: copy });
    					}
    				}
    			}
    		}
    	}

    	// Return the modified object
    	return target;
    };

    function isPlainObject(value) {
    	if (typeof value !== 'object' || value === null) {
    		return false;
    	}

    	const prototype = Object.getPrototypeOf(value);
    	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
    }

    // To do: remove `void`s
    // To do: remove `null` from output of our APIs, allow it as user APIs.

    /**
     * @typedef {(error?: Error | null | undefined, ...output: Array<any>) => void} Callback
     *   Callback.
     *
     * @typedef {(...input: Array<any>) => any} Middleware
     *   Ware.
     *
     * @typedef Pipeline
     *   Pipeline.
     * @property {Run} run
     *   Run the pipeline.
     * @property {Use} use
     *   Add middleware.
     *
     * @typedef {(...input: Array<any>) => void} Run
     *   Call all middleware.
     *
     *   Calls `done` on completion with either an error or the output of the
     *   last middleware.
     *
     *   > 👉 **Note**: as the length of input defines whether async functions get a
     *   > `next` function,
     *   > it’s recommended to keep `input` at one value normally.

     *
     * @typedef {(fn: Middleware) => Pipeline} Use
     *   Add middleware.
     */

    /**
     * Create new middleware.
     *
     * @returns {Pipeline}
     *   Pipeline.
     */
    function trough() {
      /** @type {Array<Middleware>} */
      const fns = [];
      /** @type {Pipeline} */
      const pipeline = {run, use};

      return pipeline

      /** @type {Run} */
      function run(...values) {
        let middlewareIndex = -1;
        /** @type {Callback} */
        const callback = values.pop();

        if (typeof callback !== 'function') {
          throw new TypeError('Expected function as last argument, not ' + callback)
        }

        next(null, ...values);

        /**
         * Run the next `fn`, or we’re done.
         *
         * @param {Error | null | undefined} error
         * @param {Array<any>} output
         */
        function next(error, ...output) {
          const fn = fns[++middlewareIndex];
          let index = -1;

          if (error) {
            callback(error);
            return
          }

          // Copy non-nullish input into values.
          while (++index < values.length) {
            if (output[index] === null || output[index] === undefined) {
              output[index] = values[index];
            }
          }

          // Save the newly created `output` for the next call.
          values = output;

          // Next or done.
          if (fn) {
            wrap$1(fn, next)(...output);
          } else {
            callback(null, ...output);
          }
        }
      }

      /** @type {Use} */
      function use(middelware) {
        if (typeof middelware !== 'function') {
          throw new TypeError(
            'Expected `middelware` to be a function, not ' + middelware
          )
        }

        fns.push(middelware);
        return pipeline
      }
    }

    /**
     * Wrap `middleware` into a uniform interface.
     *
     * You can pass all input to the resulting function.
     * `callback` is then called with the output of `middleware`.
     *
     * If `middleware` accepts more arguments than the later given in input,
     * an extra `done` function is passed to it after that input,
     * which must be called by `middleware`.
     *
     * The first value in `input` is the main input value.
     * All other input values are the rest input values.
     * The values given to `callback` are the input values,
     * merged with every non-nullish output value.
     *
     * * if `middleware` throws an error,
     *   returns a promise that is rejected,
     *   or calls the given `done` function with an error,
     *   `callback` is called with that error
     * * if `middleware` returns a value or returns a promise that is resolved,
     *   that value is the main output value
     * * if `middleware` calls `done`,
     *   all non-nullish values except for the first one (the error) overwrite the
     *   output values
     *
     * @param {Middleware} middleware
     *   Function to wrap.
     * @param {Callback} callback
     *   Callback called with the output of `middleware`.
     * @returns {Run}
     *   Wrapped middleware.
     */
    function wrap$1(middleware, callback) {
      /** @type {boolean} */
      let called;

      return wrapped

      /**
       * Call `middleware`.
       * @this {any}
       * @param {Array<any>} parameters
       * @returns {void}
       */
      function wrapped(...parameters) {
        const fnExpectsCallback = middleware.length > parameters.length;
        /** @type {any} */
        let result;

        if (fnExpectsCallback) {
          parameters.push(done);
        }

        try {
          result = middleware.apply(this, parameters);
        } catch (error) {
          const exception = /** @type {Error} */ (error);

          // Well, this is quite the pickle.
          // `middleware` received a callback and called it synchronously, but that
          // threw an error.
          // The only thing left to do is to throw the thing instead.
          if (fnExpectsCallback && called) {
            throw exception
          }

          return done(exception)
        }

        if (!fnExpectsCallback) {
          if (result && result.then && typeof result.then === 'function') {
            result.then(then, done);
          } else if (result instanceof Error) {
            done(result);
          } else {
            then(result);
          }
        }
      }

      /**
       * Call `callback`, only once.
       *
       * @type {Callback}
       */
      function done(error, ...output) {
        if (!called) {
          called = true;
          callback(error, ...output);
        }
      }

      /**
       * Call `done` with one value.
       *
       * @param {any} [value]
       */
      function then(value) {
        done(null, value);
      }
    }

    /**
     * @typedef {import('unist').Node} Node
     * @typedef {import('vfile').VFileCompatible} VFileCompatible
     * @typedef {import('vfile').VFileValue} VFileValue
     * @typedef {import('..').Processor} Processor
     * @typedef {import('..').Plugin} Plugin
     * @typedef {import('..').Preset} Preset
     * @typedef {import('..').Pluggable} Pluggable
     * @typedef {import('..').PluggableList} PluggableList
     * @typedef {import('..').Transformer} Transformer
     * @typedef {import('..').Parser} Parser
     * @typedef {import('..').Compiler} Compiler
     * @typedef {import('..').RunCallback} RunCallback
     * @typedef {import('..').ProcessCallback} ProcessCallback
     *
     * @typedef Context
     * @property {Node} tree
     * @property {VFile} file
     */

    // Expose a frozen processor.
    const unified = base().freeze();

    const own$7 = {}.hasOwnProperty;

    // Function to create the first processor.
    /**
     * @returns {Processor}
     */
    function base() {
      const transformers = trough();
      /** @type {Processor['attachers']} */
      const attachers = [];
      /** @type {Record<string, unknown>} */
      let namespace = {};
      /** @type {boolean|undefined} */
      let frozen;
      let freezeIndex = -1;

      // Data management.
      // @ts-expect-error: overloads are handled.
      processor.data = data;
      processor.Parser = undefined;
      processor.Compiler = undefined;

      // Lock.
      processor.freeze = freeze;

      // Plugins.
      processor.attachers = attachers;
      // @ts-expect-error: overloads are handled.
      processor.use = use;

      // API.
      processor.parse = parse;
      processor.stringify = stringify;
      // @ts-expect-error: overloads are handled.
      processor.run = run;
      processor.runSync = runSync;
      // @ts-expect-error: overloads are handled.
      processor.process = process;
      processor.processSync = processSync;

      // Expose.
      return processor

      // Create a new processor based on the processor in the current scope.
      /** @type {Processor} */
      function processor() {
        const destination = base();
        let index = -1;

        while (++index < attachers.length) {
          destination.use(...attachers[index]);
        }

        destination.data(extend(true, {}, namespace));

        return destination
      }

      /**
       * @param {string|Record<string, unknown>} [key]
       * @param {unknown} [value]
       * @returns {unknown}
       */
      function data(key, value) {
        if (typeof key === 'string') {
          // Set `key`.
          if (arguments.length === 2) {
            assertUnfrozen('data', frozen);
            namespace[key] = value;
            return processor
          }

          // Get `key`.
          return (own$7.call(namespace, key) && namespace[key]) || null
        }

        // Set space.
        if (key) {
          assertUnfrozen('data', frozen);
          namespace = key;
          return processor
        }

        // Get space.
        return namespace
      }

      /** @type {Processor['freeze']} */
      function freeze() {
        if (frozen) {
          return processor
        }

        while (++freezeIndex < attachers.length) {
          const [attacher, ...options] = attachers[freezeIndex];

          if (options[0] === false) {
            continue
          }

          if (options[0] === true) {
            options[0] = undefined;
          }

          /** @type {Transformer|void} */
          const transformer = attacher.call(processor, ...options);

          if (typeof transformer === 'function') {
            transformers.use(transformer);
          }
        }

        frozen = true;
        freezeIndex = Number.POSITIVE_INFINITY;

        return processor
      }

      /**
       * @param {Pluggable|null|undefined} [value]
       * @param {...unknown} options
       * @returns {Processor}
       */
      function use(value, ...options) {
        /** @type {Record<string, unknown>|undefined} */
        let settings;

        assertUnfrozen('use', frozen);

        if (value === null || value === undefined) ; else if (typeof value === 'function') {
          addPlugin(value, ...options);
        } else if (typeof value === 'object') {
          if (Array.isArray(value)) {
            addList(value);
          } else {
            addPreset(value);
          }
        } else {
          throw new TypeError('Expected usable value, not `' + value + '`')
        }

        if (settings) {
          namespace.settings = Object.assign(namespace.settings || {}, settings);
        }

        return processor

        /**
         * @param {import('..').Pluggable<unknown[]>} value
         * @returns {void}
         */
        function add(value) {
          if (typeof value === 'function') {
            addPlugin(value);
          } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
              const [plugin, ...options] = value;
              addPlugin(plugin, ...options);
            } else {
              addPreset(value);
            }
          } else {
            throw new TypeError('Expected usable value, not `' + value + '`')
          }
        }

        /**
         * @param {Preset} result
         * @returns {void}
         */
        function addPreset(result) {
          addList(result.plugins);

          if (result.settings) {
            settings = Object.assign(settings || {}, result.settings);
          }
        }

        /**
         * @param {PluggableList|null|undefined} [plugins]
         * @returns {void}
         */
        function addList(plugins) {
          let index = -1;

          if (plugins === null || plugins === undefined) ; else if (Array.isArray(plugins)) {
            while (++index < plugins.length) {
              const thing = plugins[index];
              add(thing);
            }
          } else {
            throw new TypeError('Expected a list of plugins, not `' + plugins + '`')
          }
        }

        /**
         * @param {Plugin} plugin
         * @param {...unknown} [value]
         * @returns {void}
         */
        function addPlugin(plugin, value) {
          let index = -1;
          /** @type {Processor['attachers'][number]|undefined} */
          let entry;

          while (++index < attachers.length) {
            if (attachers[index][0] === plugin) {
              entry = attachers[index];
              break
            }
          }

          if (entry) {
            if (isPlainObject(entry[1]) && isPlainObject(value)) {
              value = extend(true, entry[1], value);
            }

            entry[1] = value;
          } else {
            // @ts-expect-error: fine.
            attachers.push([...arguments]);
          }
        }
      }

      /** @type {Processor['parse']} */
      function parse(doc) {
        processor.freeze();
        const file = vfile(doc);
        const Parser = processor.Parser;
        assertParser('parse', Parser);

        if (newable(Parser, 'parse')) {
          // @ts-expect-error: `newable` checks this.
          return new Parser(String(file), file).parse()
        }

        // @ts-expect-error: `newable` checks this.
        return Parser(String(file), file) // eslint-disable-line new-cap
      }

      /** @type {Processor['stringify']} */
      function stringify(node, doc) {
        processor.freeze();
        const file = vfile(doc);
        const Compiler = processor.Compiler;
        assertCompiler('stringify', Compiler);
        assertNode(node);

        if (newable(Compiler, 'compile')) {
          // @ts-expect-error: `newable` checks this.
          return new Compiler(node, file).compile()
        }

        // @ts-expect-error: `newable` checks this.
        return Compiler(node, file) // eslint-disable-line new-cap
      }

      /**
       * @param {Node} node
       * @param {VFileCompatible|RunCallback} [doc]
       * @param {RunCallback} [callback]
       * @returns {Promise<Node>|void}
       */
      function run(node, doc, callback) {
        assertNode(node);
        processor.freeze();

        if (!callback && typeof doc === 'function') {
          callback = doc;
          doc = undefined;
        }

        if (!callback) {
          return new Promise(executor)
        }

        executor(null, callback);

        /**
         * @param {null|((node: Node) => void)} resolve
         * @param {(error: Error) => void} reject
         * @returns {void}
         */
        function executor(resolve, reject) {
          // @ts-expect-error: `doc` can’t be a callback anymore, we checked.
          transformers.run(node, vfile(doc), done);

          /**
           * @param {Error|null} error
           * @param {Node} tree
           * @param {VFile} file
           * @returns {void}
           */
          function done(error, tree, file) {
            tree = tree || node;
            if (error) {
              reject(error);
            } else if (resolve) {
              resolve(tree);
            } else {
              // @ts-expect-error: `callback` is defined if `resolve` is not.
              callback(null, tree, file);
            }
          }
        }
      }

      /** @type {Processor['runSync']} */
      function runSync(node, file) {
        /** @type {Node|undefined} */
        let result;
        /** @type {boolean|undefined} */
        let complete;

        processor.run(node, file, done);

        assertDone('runSync', 'run', complete);

        // @ts-expect-error: we either bailed on an error or have a tree.
        return result

        /**
         * @param {Error|null} [error]
         * @param {Node} [tree]
         * @returns {void}
         */
        function done(error, tree) {
          bail(error);
          result = tree;
          complete = true;
        }
      }

      /**
       * @param {VFileCompatible} doc
       * @param {ProcessCallback} [callback]
       * @returns {Promise<VFile>|undefined}
       */
      function process(doc, callback) {
        processor.freeze();
        assertParser('process', processor.Parser);
        assertCompiler('process', processor.Compiler);

        if (!callback) {
          return new Promise(executor)
        }

        executor(null, callback);

        /**
         * @param {null|((file: VFile) => void)} resolve
         * @param {(error?: Error|null|undefined) => void} reject
         * @returns {void}
         */
        function executor(resolve, reject) {
          const file = vfile(doc);

          processor.run(processor.parse(file), file, (error, tree, file) => {
            if (error || !tree || !file) {
              done(error);
            } else {
              /** @type {unknown} */
              const result = processor.stringify(tree, file);

              if (result === undefined || result === null) ; else if (looksLikeAVFileValue(result)) {
                file.value = result;
              } else {
                file.result = result;
              }

              done(error, file);
            }
          });

          /**
           * @param {Error|null|undefined} [error]
           * @param {VFile|undefined} [file]
           * @returns {void}
           */
          function done(error, file) {
            if (error || !file) {
              reject(error);
            } else if (resolve) {
              resolve(file);
            } else {
              // @ts-expect-error: `callback` is defined if `resolve` is not.
              callback(null, file);
            }
          }
        }
      }

      /** @type {Processor['processSync']} */
      function processSync(doc) {
        /** @type {boolean|undefined} */
        let complete;

        processor.freeze();
        assertParser('processSync', processor.Parser);
        assertCompiler('processSync', processor.Compiler);

        const file = vfile(doc);

        processor.process(file, done);

        assertDone('processSync', 'process', complete);

        return file

        /**
         * @param {Error|null|undefined} [error]
         * @returns {void}
         */
        function done(error) {
          complete = true;
          bail(error);
        }
      }
    }

    /**
     * Check if `value` is a constructor.
     *
     * @param {unknown} value
     * @param {string} name
     * @returns {boolean}
     */
    function newable(value, name) {
      return (
        typeof value === 'function' &&
        // Prototypes do exist.
        // type-coverage:ignore-next-line
        value.prototype &&
        // A function with keys in its prototype is probably a constructor.
        // Classes’ prototype methods are not enumerable, so we check if some value
        // exists in the prototype.
        // type-coverage:ignore-next-line
        (keys(value.prototype) || name in value.prototype)
      )
    }

    /**
     * Check if `value` is an object with keys.
     *
     * @param {Record<string, unknown>} value
     * @returns {boolean}
     */
    function keys(value) {
      /** @type {string} */
      let key;

      for (key in value) {
        if (own$7.call(value, key)) {
          return true
        }
      }

      return false
    }

    /**
     * Assert a parser is available.
     *
     * @param {string} name
     * @param {unknown} value
     * @returns {asserts value is Parser}
     */
    function assertParser(name, value) {
      if (typeof value !== 'function') {
        throw new TypeError('Cannot `' + name + '` without `Parser`')
      }
    }

    /**
     * Assert a compiler is available.
     *
     * @param {string} name
     * @param {unknown} value
     * @returns {asserts value is Compiler}
     */
    function assertCompiler(name, value) {
      if (typeof value !== 'function') {
        throw new TypeError('Cannot `' + name + '` without `Compiler`')
      }
    }

    /**
     * Assert the processor is not frozen.
     *
     * @param {string} name
     * @param {unknown} frozen
     * @returns {asserts frozen is false}
     */
    function assertUnfrozen(name, frozen) {
      if (frozen) {
        throw new Error(
          'Cannot call `' +
            name +
            '` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.'
        )
      }
    }

    /**
     * Assert `node` is a unist node.
     *
     * @param {unknown} node
     * @returns {asserts node is Node}
     */
    function assertNode(node) {
      // `isPlainObj` unfortunately uses `any` instead of `unknown`.
      // type-coverage:ignore-next-line
      if (!isPlainObject(node) || typeof node.type !== 'string') {
        throw new TypeError('Expected node, got `' + node + '`')
        // Fine.
      }
    }

    /**
     * Assert that `complete` is `true`.
     *
     * @param {string} name
     * @param {string} asyncName
     * @param {unknown} complete
     * @returns {asserts complete is true}
     */
    function assertDone(name, asyncName, complete) {
      if (!complete) {
        throw new Error(
          '`' + name + '` finished async. Use `' + asyncName + '` instead'
        )
      }
    }

    /**
     * @param {VFileCompatible} [value]
     * @returns {VFile}
     */
    function vfile(value) {
      return looksLikeAVFile(value) ? value : new VFile(value)
    }

    /**
     * @param {VFileCompatible} [value]
     * @returns {value is VFile}
     */
    function looksLikeAVFile(value) {
      return Boolean(
        value &&
          typeof value === 'object' &&
          'message' in value &&
          'messages' in value
      )
    }

    /**
     * @param {unknown} [value]
     * @returns {value is VFileValue}
     */
    function looksLikeAVFileValue(value) {
      return typeof value === 'string' || isBuffer(value)
    }

    /**
     * @typedef {import('mdast').Root|import('mdast').Content} Node
     *
     * @typedef Options
     *   Configuration (optional).
     * @property {boolean | null | undefined} [includeImageAlt=true]
     *   Whether to use `alt` for `image`s.
     * @property {boolean | null | undefined} [includeHtml=true]
     *   Whether to use `value` of HTML.
     */

    /** @type {Options} */
    const emptyOptions = {};

    /**
     * Get the text content of a node or list of nodes.
     *
     * Prefers the node’s plain-text fields, otherwise serializes its children,
     * and if the given value is an array, serialize the nodes in it.
     *
     * @param {unknown} value
     *   Thing to serialize, typically `Node`.
     * @param {Options | null | undefined} [options]
     *   Configuration (optional).
     * @returns {string}
     *   Serialized `value`.
     */
    function toString(value, options) {
      const settings = options || emptyOptions;
      const includeImageAlt =
        typeof settings.includeImageAlt === 'boolean'
          ? settings.includeImageAlt
          : true;
      const includeHtml =
        typeof settings.includeHtml === 'boolean' ? settings.includeHtml : true;

      return one$1(value, includeImageAlt, includeHtml)
    }

    /**
     * One node or several nodes.
     *
     * @param {unknown} value
     *   Thing to serialize.
     * @param {boolean} includeImageAlt
     *   Include image `alt`s.
     * @param {boolean} includeHtml
     *   Include HTML.
     * @returns {string}
     *   Serialized node.
     */
    function one$1(value, includeImageAlt, includeHtml) {
      if (node(value)) {
        if ('value' in value) {
          return value.type === 'html' && !includeHtml ? '' : value.value
        }

        if (includeImageAlt && 'alt' in value && value.alt) {
          return value.alt
        }

        if ('children' in value) {
          return all$1(value.children, includeImageAlt, includeHtml)
        }
      }

      if (Array.isArray(value)) {
        return all$1(value, includeImageAlt, includeHtml)
      }

      return ''
    }

    /**
     * Serialize a list of nodes.
     *
     * @param {Array<unknown>} values
     *   Thing to serialize.
     * @param {boolean} includeImageAlt
     *   Include image `alt`s.
     * @param {boolean} includeHtml
     *   Include HTML.
     * @returns {string}
     *   Serialized nodes.
     */
    function all$1(values, includeImageAlt, includeHtml) {
      /** @type {Array<string>} */
      const result = [];
      let index = -1;

      while (++index < values.length) {
        result[index] = one$1(values[index], includeImageAlt, includeHtml);
      }

      return result.join('')
    }

    /**
     * Check if `value` looks like a node.
     *
     * @param {unknown} value
     *   Thing.
     * @returns {value is Node}
     *   Whether `value` is a node.
     */
    function node(value) {
      return Boolean(value && typeof value === 'object')
    }

    /**
     * Like `Array#splice`, but smarter for giant arrays.
     *
     * `Array#splice` takes all items to be inserted as individual argument which
     * causes a stack overflow in V8 when trying to insert 100k items for instance.
     *
     * Otherwise, this does not return the removed items, and takes `items` as an
     * array instead of rest parameters.
     *
     * @template {unknown} T
     *   Item type.
     * @param {Array<T>} list
     *   List to operate on.
     * @param {number} start
     *   Index to remove/insert at (can be negative).
     * @param {number} remove
     *   Number of items to remove.
     * @param {Array<T>} items
     *   Items to inject into `list`.
     * @returns {void}
     *   Nothing.
     */
    function splice(list, start, remove, items) {
      const end = list.length;
      let chunkStart = 0;
      /** @type {Array<unknown>} */
      let parameters;

      // Make start between zero and `end` (included).
      if (start < 0) {
        start = -start > end ? 0 : end + start;
      } else {
        start = start > end ? end : start;
      }
      remove = remove > 0 ? remove : 0;

      // No need to chunk the items if there’s only a couple (10k) items.
      if (items.length < 10000) {
        parameters = Array.from(items);
        parameters.unshift(start, remove);
        // @ts-expect-error Hush, it’s fine.
        list.splice(...parameters);
      } else {
        // Delete `remove` items starting from `start`
        if (remove) list.splice(start, remove);

        // Insert the items in chunks to not cause stack overflows.
        while (chunkStart < items.length) {
          parameters = items.slice(chunkStart, chunkStart + 10000);
          parameters.unshift(start, 0);
          // @ts-expect-error Hush, it’s fine.
          list.splice(...parameters);
          chunkStart += 10000;
          start += 10000;
        }
      }
    }

    /**
     * Append `items` (an array) at the end of `list` (another array).
     * When `list` was empty, returns `items` instead.
     *
     * This prevents a potentially expensive operation when `list` is empty,
     * and adds items in batches to prevent V8 from hanging.
     *
     * @template {unknown} T
     *   Item type.
     * @param {Array<T>} list
     *   List to operate on.
     * @param {Array<T>} items
     *   Items to add to `list`.
     * @returns {Array<T>}
     *   Either `list` or `items`.
     */
    function push(list, items) {
      if (list.length > 0) {
        splice(list, list.length, 0, items);
        return list
      }
      return items
    }

    /**
     * @typedef {import('micromark-util-types').Extension} Extension
     * @typedef {import('micromark-util-types').Handles} Handles
     * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
     * @typedef {import('micromark-util-types').NormalizedExtension} NormalizedExtension
     */

    const hasOwnProperty = {}.hasOwnProperty;

    /**
     * Combine multiple syntax extensions into one.
     *
     * @param {Array<Extension>} extensions
     *   List of syntax extensions.
     * @returns {NormalizedExtension}
     *   A single combined extension.
     */
    function combineExtensions(extensions) {
      /** @type {NormalizedExtension} */
      const all = {};
      let index = -1;

      while (++index < extensions.length) {
        syntaxExtension(all, extensions[index]);
      }

      return all
    }

    /**
     * Merge `extension` into `all`.
     *
     * @param {NormalizedExtension} all
     *   Extension to merge into.
     * @param {Extension} extension
     *   Extension to merge.
     * @returns {void}
     */
    function syntaxExtension(all, extension) {
      /** @type {keyof Extension} */
      let hook;

      for (hook in extension) {
        const maybe = hasOwnProperty.call(all, hook) ? all[hook] : undefined;
        /** @type {Record<string, unknown>} */
        const left = maybe || (all[hook] = {});
        /** @type {Record<string, unknown> | undefined} */
        const right = extension[hook];
        /** @type {string} */
        let code;

        if (right) {
          for (code in right) {
            if (!hasOwnProperty.call(left, code)) left[code] = [];
            const value = right[code];
            constructs(
              // @ts-expect-error Looks like a list.
              left[code],
              Array.isArray(value) ? value : value ? [value] : []
            );
          }
        }
      }
    }

    /**
     * Merge `list` into `existing` (both lists of constructs).
     * Mutates `existing`.
     *
     * @param {Array<unknown>} existing
     * @param {Array<unknown>} list
     * @returns {void}
     */
    function constructs(existing, list) {
      let index = -1;
      /** @type {Array<unknown>} */
      const before = [];

      while (++index < list.length) {
    (list[index].add === 'after' ? existing : before).push(list[index]);
      }

      splice(existing, 0, 0, before);
    }

    // This module is generated by `script/`.
    //
    // CommonMark handles attention (emphasis, strong) markers based on what comes
    // before or after them.
    // One such difference is if those characters are Unicode punctuation.
    // This script is generated from the Unicode data.

    /**
     * Regular expression that matches a unicode punctuation character.
     */
    const unicodePunctuationRegex =
      /[!-\/:-@\[-`\{-~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;

    /**
     * @typedef {import('micromark-util-types').Code} Code
     */

    /**
     * Check whether the character code represents an ASCII alpha (`a` through `z`,
     * case insensitive).
     *
     * An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.
     *
     * An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)
     * to U+005A (`Z`).
     *
     * An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)
     * to U+007A (`z`).
     *
     * @param code
     *   Code.
     * @returns
     *   Whether it matches.
     */
    const asciiAlpha = regexCheck(/[A-Za-z]/);

    /**
     * Check whether the character code represents an ASCII alphanumeric (`a`
     * through `z`, case insensitive, or `0` through `9`).
     *
     * An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha
     * (see `asciiAlpha`).
     *
     * @param code
     *   Code.
     * @returns
     *   Whether it matches.
     */
    const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);

    /**
     * Check whether the character code represents an ASCII atext.
     *
     * atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in
     * the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),
     * U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F
     * SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E
     * CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE
     * (`{`) to U+007E TILDE (`~`).
     *
     * See:
     * **\[RFC5322]**:
     * [Internet Message Format](https://tools.ietf.org/html/rfc5322).
     * P. Resnick.
     * IETF.
     *
     * @param code
     *   Code.
     * @returns
     *   Whether it matches.
     */
    const asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);

    /**
     * Check whether a character code is an ASCII control character.
     *
     * An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)
     * to U+001F (US), or U+007F (DEL).
     *
     * @param {Code} code
     *   Code.
     * @returns {boolean}
     *   Whether it matches.
     */
    function asciiControl(code) {
      return (
        // Special whitespace codes (which have negative values), C0 and Control
        // character DEL
        code !== null && (code < 32 || code === 127)
      )
    }

    /**
     * Check whether the character code represents an ASCII digit (`0` through `9`).
     *
     * An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to
     * U+0039 (`9`).
     *
     * @param code
     *   Code.
     * @returns
     *   Whether it matches.
     */
    const asciiDigit = regexCheck(/\d/);

    /**
     * Check whether the character code represents an ASCII hex digit (`a` through
     * `f`, case insensitive, or `0` through `9`).
     *
     * An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex
     * digit, or an ASCII lower hex digit.
     *
     * An **ASCII upper hex digit** is a character in the inclusive range U+0041
     * (`A`) to U+0046 (`F`).
     *
     * An **ASCII lower hex digit** is a character in the inclusive range U+0061
     * (`a`) to U+0066 (`f`).
     *
     * @param code
     *   Code.
     * @returns
     *   Whether it matches.
     */
    const asciiHexDigit = regexCheck(/[\dA-Fa-f]/);

    /**
     * Check whether the character code represents ASCII punctuation.
     *
     * An **ASCII punctuation** is a character in the inclusive ranges U+0021
     * EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT
     * SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT
     * (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).
     *
     * @param code
     *   Code.
     * @returns
     *   Whether it matches.
     */
    const asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);

    /**
     * Check whether a character code is a markdown line ending.
     *
     * A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN
     * LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).
     *
     * In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE
     * RETURN (CR) are replaced by these virtual characters depending on whether
     * they occurred together.
     *
     * @param {Code} code
     *   Code.
     * @returns {boolean}
     *   Whether it matches.
     */
    function markdownLineEnding(code) {
      return code !== null && code < -2
    }

    /**
     * Check whether a character code is a markdown line ending (see
     * `markdownLineEnding`) or markdown space (see `markdownSpace`).
     *
     * @param {Code} code
     *   Code.
     * @returns {boolean}
     *   Whether it matches.
     */
    function markdownLineEndingOrSpace(code) {
      return code !== null && (code < 0 || code === 32)
    }

    /**
     * Check whether a character code is a markdown space.
     *
     * A **markdown space** is the concrete character U+0020 SPACE (SP) and the
     * virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).
     *
     * In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is
     * replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL
     * SPACE (VS) characters, depending on the column at which the tab occurred.
     *
     * @param {Code} code
     *   Code.
     * @returns {boolean}
     *   Whether it matches.
     */
    function markdownSpace(code) {
      return code === -2 || code === -1 || code === 32
    }

    // Size note: removing ASCII from the regex and using `asciiPunctuation` here
    // In fact adds to the bundle size.
    /**
     * Check whether the character code represents Unicode punctuation.
     *
     * A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,
     * Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`
     * (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`
     * (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII
     * punctuation (see `asciiPunctuation`).
     *
     * See:
     * **\[UNICODE]**:
     * [The Unicode Standard](https://www.unicode.org/versions/).
     * Unicode Consortium.
     *
     * @param code
     *   Code.
     * @returns
     *   Whether it matches.
     */
    const unicodePunctuation = regexCheck(unicodePunctuationRegex);

    /**
     * Check whether the character code represents Unicode whitespace.
     *
     * Note that this does handle micromark specific markdown whitespace characters.
     * See `markdownLineEndingOrSpace` to check that.
     *
     * A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,
     * Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),
     * U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\[UNICODE]**).
     *
     * See:
     * **\[UNICODE]**:
     * [The Unicode Standard](https://www.unicode.org/versions/).
     * Unicode Consortium.
     *
     * @param code
     *   Code.
     * @returns
     *   Whether it matches.
     */
    const unicodeWhitespace = regexCheck(/\s/);

    /**
     * Create a code check from a regex.
     *
     * @param {RegExp} regex
     * @returns {(code: Code) => boolean}
     */
    function regexCheck(regex) {
      return check

      /**
       * Check whether a code matches the bound regex.
       *
       * @param {Code} code
       *   Character code.
       * @returns {boolean}
       *   Whether the character code matches the bound regex.
       */
      function check(code) {
        return code !== null && regex.test(String.fromCharCode(code))
      }
    }

    /**
     * @typedef {import('micromark-util-types').Effects} Effects
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenType} TokenType
     */

    // To do: implement `spaceOrTab`, `spaceOrTabMinMax`, `spaceOrTabWithOptions`.

    /**
     * Parse spaces and tabs.
     *
     * There is no `nok` parameter:
     *
     * *   spaces in markdown are often optional, in which case this factory can be
     *     used and `ok` will be switched to whether spaces were found or not
     * *   one line ending or space can be detected with `markdownSpace(code)` right
     *     before using `factorySpace`
     *
     * ###### Examples
     *
     * Where `␉` represents a tab (plus how much it expands) and `␠` represents a
     * single space.
     *
     * ```markdown
     * ␉
     * ␠␠␠␠
     * ␉␠
     * ```
     *
     * @param {Effects} effects
     *   Context.
     * @param {State} ok
     *   State switched to when successful.
     * @param {TokenType} type
     *   Type (`' \t'`).
     * @param {number | undefined} [max=Infinity]
     *   Max (exclusive).
     * @returns
     *   Start state.
     */
    function factorySpace(effects, ok, type, max) {
      const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
      let size = 0;
      return start

      /** @type {State} */
      function start(code) {
        if (markdownSpace(code)) {
          effects.enter(type);
          return prefix(code)
        }
        return ok(code)
      }

      /** @type {State} */
      function prefix(code) {
        if (markdownSpace(code) && size++ < limit) {
          effects.consume(code);
          return prefix
        }
        effects.exit(type);
        return ok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
     * @typedef {import('micromark-util-types').Initializer} Initializer
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     */
    /** @type {InitialConstruct} */
    const content$1 = {
      tokenize: initializeContent
    };

    /**
     * @this {TokenizeContext}
     * @type {Initializer}
     */
    function initializeContent(effects) {
      const contentStart = effects.attempt(
        this.parser.constructs.contentInitial,
        afterContentStartConstruct,
        paragraphInitial
      );
      /** @type {Token} */
      let previous;
      return contentStart

      /** @type {State} */
      function afterContentStartConstruct(code) {
        if (code === null) {
          effects.consume(code);
          return
        }
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return factorySpace(effects, contentStart, 'linePrefix')
      }

      /** @type {State} */
      function paragraphInitial(code) {
        effects.enter('paragraph');
        return lineStart(code)
      }

      /** @type {State} */
      function lineStart(code) {
        const token = effects.enter('chunkText', {
          contentType: 'text',
          previous
        });
        if (previous) {
          previous.next = token;
        }
        previous = token;
        return data(code)
      }

      /** @type {State} */
      function data(code) {
        if (code === null) {
          effects.exit('chunkText');
          effects.exit('paragraph');
          effects.consume(code);
          return
        }
        if (markdownLineEnding(code)) {
          effects.consume(code);
          effects.exit('chunkText');
          return lineStart
        }

        // Data.
        effects.consume(code);
        return data
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').ContainerState} ContainerState
     * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
     * @typedef {import('micromark-util-types').Initializer} Initializer
     * @typedef {import('micromark-util-types').Point} Point
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {InitialConstruct} */
    const document$2 = {
      tokenize: initializeDocument
    };

    /** @type {Construct} */
    const containerConstruct = {
      tokenize: tokenizeContainer
    };

    /**
     * @this {TokenizeContext}
     * @type {Initializer}
     */
    function initializeDocument(effects) {
      const self = this;
      /** @type {Array<StackItem>} */
      const stack = [];
      let continued = 0;
      /** @type {TokenizeContext | undefined} */
      let childFlow;
      /** @type {Token | undefined} */
      let childToken;
      /** @type {number} */
      let lineStartOffset;
      return start

      /** @type {State} */
      function start(code) {
        // First we iterate through the open blocks, starting with the root
        // document, and descending through last children down to the last open
        // block.
        // Each block imposes a condition that the line must satisfy if the block is
        // to remain open.
        // For example, a block quote requires a `>` character.
        // A paragraph requires a non-blank line.
        // In this phase we may match all or just some of the open blocks.
        // But we cannot close unmatched blocks yet, because we may have a lazy
        // continuation line.
        if (continued < stack.length) {
          const item = stack[continued];
          self.containerState = item[1];
          return effects.attempt(
            item[0].continuation,
            documentContinue,
            checkNewContainers
          )(code)
        }

        // Done.
        return checkNewContainers(code)
      }

      /** @type {State} */
      function documentContinue(code) {
        continued++;

        // Note: this field is called `_closeFlow` but it also closes containers.
        // Perhaps a good idea to rename it but it’s already used in the wild by
        // extensions.
        if (self.containerState._closeFlow) {
          self.containerState._closeFlow = undefined;
          if (childFlow) {
            closeFlow();
          }

          // Note: this algorithm for moving events around is similar to the
          // algorithm when dealing with lazy lines in `writeToChild`.
          const indexBeforeExits = self.events.length;
          let indexBeforeFlow = indexBeforeExits;
          /** @type {Point | undefined} */
          let point;

          // Find the flow chunk.
          while (indexBeforeFlow--) {
            if (
              self.events[indexBeforeFlow][0] === 'exit' &&
              self.events[indexBeforeFlow][1].type === 'chunkFlow'
            ) {
              point = self.events[indexBeforeFlow][1].end;
              break
            }
          }
          exitContainers(continued);

          // Fix positions.
          let index = indexBeforeExits;
          while (index < self.events.length) {
            self.events[index][1].end = Object.assign({}, point);
            index++;
          }

          // Inject the exits earlier (they’re still also at the end).
          splice(
            self.events,
            indexBeforeFlow + 1,
            0,
            self.events.slice(indexBeforeExits)
          );

          // Discard the duplicate exits.
          self.events.length = index;
          return checkNewContainers(code)
        }
        return start(code)
      }

      /** @type {State} */
      function checkNewContainers(code) {
        // Next, after consuming the continuation markers for existing blocks, we
        // look for new block starts (e.g. `>` for a block quote).
        // If we encounter a new block start, we close any blocks unmatched in
        // step 1 before creating the new block as a child of the last matched
        // block.
        if (continued === stack.length) {
          // No need to `check` whether there’s a container, of `exitContainers`
          // would be moot.
          // We can instead immediately `attempt` to parse one.
          if (!childFlow) {
            return documentContinued(code)
          }

          // If we have concrete content, such as block HTML or fenced code,
          // we can’t have containers “pierce” into them, so we can immediately
          // start.
          if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
            return flowStart(code)
          }

          // If we do have flow, it could still be a blank line,
          // but we’d be interrupting it w/ a new container if there’s a current
          // construct.
          // To do: next major: remove `_gfmTableDynamicInterruptHack` (no longer
          // needed in micromark-extension-gfm-table@1.0.6).
          self.interrupt = Boolean(
            childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack
          );
        }

        // Check if there is a new container.
        self.containerState = {};
        return effects.check(
          containerConstruct,
          thereIsANewContainer,
          thereIsNoNewContainer
        )(code)
      }

      /** @type {State} */
      function thereIsANewContainer(code) {
        if (childFlow) closeFlow();
        exitContainers(continued);
        return documentContinued(code)
      }

      /** @type {State} */
      function thereIsNoNewContainer(code) {
        self.parser.lazy[self.now().line] = continued !== stack.length;
        lineStartOffset = self.now().offset;
        return flowStart(code)
      }

      /** @type {State} */
      function documentContinued(code) {
        // Try new containers.
        self.containerState = {};
        return effects.attempt(
          containerConstruct,
          containerContinue,
          flowStart
        )(code)
      }

      /** @type {State} */
      function containerContinue(code) {
        continued++;
        stack.push([self.currentConstruct, self.containerState]);
        // Try another.
        return documentContinued(code)
      }

      /** @type {State} */
      function flowStart(code) {
        if (code === null) {
          if (childFlow) closeFlow();
          exitContainers(0);
          effects.consume(code);
          return
        }
        childFlow = childFlow || self.parser.flow(self.now());
        effects.enter('chunkFlow', {
          contentType: 'flow',
          previous: childToken,
          _tokenizer: childFlow
        });
        return flowContinue(code)
      }

      /** @type {State} */
      function flowContinue(code) {
        if (code === null) {
          writeToChild(effects.exit('chunkFlow'), true);
          exitContainers(0);
          effects.consume(code);
          return
        }
        if (markdownLineEnding(code)) {
          effects.consume(code);
          writeToChild(effects.exit('chunkFlow'));
          // Get ready for the next line.
          continued = 0;
          self.interrupt = undefined;
          return start
        }
        effects.consume(code);
        return flowContinue
      }

      /**
       * @param {Token} token
       * @param {boolean | undefined} [eof]
       * @returns {void}
       */
      function writeToChild(token, eof) {
        const stream = self.sliceStream(token);
        if (eof) stream.push(null);
        token.previous = childToken;
        if (childToken) childToken.next = token;
        childToken = token;
        childFlow.defineSkip(token.start);
        childFlow.write(stream);

        // Alright, so we just added a lazy line:
        //
        // ```markdown
        // > a
        // b.
        //
        // Or:
        //
        // > ~~~c
        // d
        //
        // Or:
        //
        // > | e |
        // f
        // ```
        //
        // The construct in the second example (fenced code) does not accept lazy
        // lines, so it marked itself as done at the end of its first line, and
        // then the content construct parses `d`.
        // Most constructs in markdown match on the first line: if the first line
        // forms a construct, a non-lazy line can’t “unmake” it.
        //
        // The construct in the third example is potentially a GFM table, and
        // those are *weird*.
        // It *could* be a table, from the first line, if the following line
        // matches a condition.
        // In this case, that second line is lazy, which “unmakes” the first line
        // and turns the whole into one content block.
        //
        // We’ve now parsed the non-lazy and the lazy line, and can figure out
        // whether the lazy line started a new flow block.
        // If it did, we exit the current containers between the two flow blocks.
        if (self.parser.lazy[token.start.line]) {
          let index = childFlow.events.length;
          while (index--) {
            if (
              // The token starts before the line ending…
              childFlow.events[index][1].start.offset < lineStartOffset &&
              // …and either is not ended yet…
              (!childFlow.events[index][1].end ||
                // …or ends after it.
                childFlow.events[index][1].end.offset > lineStartOffset)
            ) {
              // Exit: there’s still something open, which means it’s a lazy line
              // part of something.
              return
            }
          }

          // Note: this algorithm for moving events around is similar to the
          // algorithm when closing flow in `documentContinue`.
          const indexBeforeExits = self.events.length;
          let indexBeforeFlow = indexBeforeExits;
          /** @type {boolean | undefined} */
          let seen;
          /** @type {Point | undefined} */
          let point;

          // Find the previous chunk (the one before the lazy line).
          while (indexBeforeFlow--) {
            if (
              self.events[indexBeforeFlow][0] === 'exit' &&
              self.events[indexBeforeFlow][1].type === 'chunkFlow'
            ) {
              if (seen) {
                point = self.events[indexBeforeFlow][1].end;
                break
              }
              seen = true;
            }
          }
          exitContainers(continued);

          // Fix positions.
          index = indexBeforeExits;
          while (index < self.events.length) {
            self.events[index][1].end = Object.assign({}, point);
            index++;
          }

          // Inject the exits earlier (they’re still also at the end).
          splice(
            self.events,
            indexBeforeFlow + 1,
            0,
            self.events.slice(indexBeforeExits)
          );

          // Discard the duplicate exits.
          self.events.length = index;
        }
      }

      /**
       * @param {number} size
       * @returns {void}
       */
      function exitContainers(size) {
        let index = stack.length;

        // Exit open containers.
        while (index-- > size) {
          const entry = stack[index];
          self.containerState = entry[1];
          entry[0].exit.call(self, effects);
        }
        stack.length = size;
      }
      function closeFlow() {
        childFlow.write([null]);
        childToken = undefined;
        childFlow = undefined;
        self.containerState._closeFlow = undefined;
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeContainer(effects, ok, nok) {
      // Always populated by defaults.

      return factorySpace(
        effects,
        effects.attempt(this.parser.constructs.document, ok, nok),
        'linePrefix',
        this.parser.constructs.disable.null.includes('codeIndented') ? undefined : 4
      )
    }

    /**
     * @typedef {import('micromark-util-types').Code} Code
     */
    /**
     * Classify whether a code represents whitespace, punctuation, or something
     * else.
     *
     * Used for attention (emphasis, strong), whose sequences can open or close
     * based on the class of surrounding characters.
     *
     * > 👉 **Note**: eof (`null`) is seen as whitespace.
     *
     * @param {Code} code
     *   Code.
     * @returns {typeof constants.characterGroupWhitespace | typeof constants.characterGroupPunctuation | undefined}
     *   Group.
     */
    function classifyCharacter(code) {
      if (
        code === null ||
        markdownLineEndingOrSpace(code) ||
        unicodeWhitespace(code)
      ) {
        return 1
      }
      if (unicodePunctuation(code)) {
        return 2
      }
    }

    /**
     * @typedef {import('micromark-util-types').Event} Event
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     */

    /**
     * Call all `resolveAll`s.
     *
     * @param {Array<{resolveAll?: Resolver | undefined}>} constructs
     *   List of constructs, optionally with `resolveAll`s.
     * @param {Array<Event>} events
     *   List of events.
     * @param {TokenizeContext} context
     *   Context used by `tokenize`.
     * @returns {Array<Event>}
     *   Changed events.
     */
    function resolveAll(constructs, events, context) {
      /** @type {Array<Resolver>} */
      const called = [];
      let index = -1;

      while (++index < constructs.length) {
        const resolve = constructs[index].resolveAll;

        if (resolve && !called.includes(resolve)) {
          events = resolve(events, context);
          called.push(resolve);
        }
      }

      return events
    }

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').Event} Event
     * @typedef {import('micromark-util-types').Point} Point
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const attention = {
      name: 'attention',
      tokenize: tokenizeAttention,
      resolveAll: resolveAllAttention
    };

    /**
     * Take all events and resolve attention to emphasis or strong.
     *
     * @type {Resolver}
     */
    function resolveAllAttention(events, context) {
      let index = -1;
      /** @type {number} */
      let open;
      /** @type {Token} */
      let group;
      /** @type {Token} */
      let text;
      /** @type {Token} */
      let openingSequence;
      /** @type {Token} */
      let closingSequence;
      /** @type {number} */
      let use;
      /** @type {Array<Event>} */
      let nextEvents;
      /** @type {number} */
      let offset;

      // Walk through all events.
      //
      // Note: performance of this is fine on an mb of normal markdown, but it’s
      // a bottleneck for malicious stuff.
      while (++index < events.length) {
        // Find a token that can close.
        if (
          events[index][0] === 'enter' &&
          events[index][1].type === 'attentionSequence' &&
          events[index][1]._close
        ) {
          open = index;

          // Now walk back to find an opener.
          while (open--) {
            // Find a token that can open the closer.
            if (
              events[open][0] === 'exit' &&
              events[open][1].type === 'attentionSequence' &&
              events[open][1]._open &&
              // If the markers are the same:
              context.sliceSerialize(events[open][1]).charCodeAt(0) ===
                context.sliceSerialize(events[index][1]).charCodeAt(0)
            ) {
              // If the opening can close or the closing can open,
              // and the close size *is not* a multiple of three,
              // but the sum of the opening and closing size *is* multiple of three,
              // then don’t match.
              if (
                (events[open][1]._close || events[index][1]._open) &&
                (events[index][1].end.offset - events[index][1].start.offset) % 3 &&
                !(
                  (events[open][1].end.offset -
                    events[open][1].start.offset +
                    events[index][1].end.offset -
                    events[index][1].start.offset) %
                  3
                )
              ) {
                continue
              }

              // Number of markers to use from the sequence.
              use =
                events[open][1].end.offset - events[open][1].start.offset > 1 &&
                events[index][1].end.offset - events[index][1].start.offset > 1
                  ? 2
                  : 1;
              const start = Object.assign({}, events[open][1].end);
              const end = Object.assign({}, events[index][1].start);
              movePoint(start, -use);
              movePoint(end, use);
              openingSequence = {
                type: use > 1 ? 'strongSequence' : 'emphasisSequence',
                start,
                end: Object.assign({}, events[open][1].end)
              };
              closingSequence = {
                type: use > 1 ? 'strongSequence' : 'emphasisSequence',
                start: Object.assign({}, events[index][1].start),
                end
              };
              text = {
                type: use > 1 ? 'strongText' : 'emphasisText',
                start: Object.assign({}, events[open][1].end),
                end: Object.assign({}, events[index][1].start)
              };
              group = {
                type: use > 1 ? 'strong' : 'emphasis',
                start: Object.assign({}, openingSequence.start),
                end: Object.assign({}, closingSequence.end)
              };
              events[open][1].end = Object.assign({}, openingSequence.start);
              events[index][1].start = Object.assign({}, closingSequence.end);
              nextEvents = [];

              // If there are more markers in the opening, add them before.
              if (events[open][1].end.offset - events[open][1].start.offset) {
                nextEvents = push(nextEvents, [
                  ['enter', events[open][1], context],
                  ['exit', events[open][1], context]
                ]);
              }

              // Opening.
              nextEvents = push(nextEvents, [
                ['enter', group, context],
                ['enter', openingSequence, context],
                ['exit', openingSequence, context],
                ['enter', text, context]
              ]);

              // Always populated by defaults.

              // Between.
              nextEvents = push(
                nextEvents,
                resolveAll(
                  context.parser.constructs.insideSpan.null,
                  events.slice(open + 1, index),
                  context
                )
              );

              // Closing.
              nextEvents = push(nextEvents, [
                ['exit', text, context],
                ['enter', closingSequence, context],
                ['exit', closingSequence, context],
                ['exit', group, context]
              ]);

              // If there are more markers in the closing, add them after.
              if (events[index][1].end.offset - events[index][1].start.offset) {
                offset = 2;
                nextEvents = push(nextEvents, [
                  ['enter', events[index][1], context],
                  ['exit', events[index][1], context]
                ]);
              } else {
                offset = 0;
              }
              splice(events, open - 1, index - open + 3, nextEvents);
              index = open + nextEvents.length - offset - 2;
              break
            }
          }
        }
      }

      // Remove remaining sequences.
      index = -1;
      while (++index < events.length) {
        if (events[index][1].type === 'attentionSequence') {
          events[index][1].type = 'data';
        }
      }
      return events
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeAttention(effects, ok) {
      const attentionMarkers = this.parser.constructs.attentionMarkers.null;
      const previous = this.previous;
      const before = classifyCharacter(previous);

      /** @type {NonNullable<Code>} */
      let marker;
      return start

      /**
       * Before a sequence.
       *
       * ```markdown
       * > | **
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        marker = code;
        effects.enter('attentionSequence');
        return inside(code)
      }

      /**
       * In a sequence.
       *
       * ```markdown
       * > | **
       *     ^^
       * ```
       *
       * @type {State}
       */
      function inside(code) {
        if (code === marker) {
          effects.consume(code);
          return inside
        }
        const token = effects.exit('attentionSequence');

        // To do: next major: move this to resolver, just like `markdown-rs`.
        const after = classifyCharacter(code);

        // Always populated by defaults.

        const open =
          !after || (after === 2 && before) || attentionMarkers.includes(code);
        const close =
          !before || (before === 2 && after) || attentionMarkers.includes(previous);
        token._open = Boolean(marker === 42 ? open : open && (before || !close));
        token._close = Boolean(marker === 42 ? close : close && (after || !open));
        return ok(code)
      }
    }

    /**
     * Move a point a bit.
     *
     * Note: `move` only works inside lines! It’s not possible to move past other
     * chunks (replacement characters, tabs, or line endings).
     *
     * @param {Point} point
     * @param {number} offset
     * @returns {void}
     */
    function movePoint(point, offset) {
      point.column += offset;
      point.offset += offset;
      point._bufferIndex += offset;
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const autolink = {
      name: 'autolink',
      tokenize: tokenizeAutolink
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeAutolink(effects, ok, nok) {
      let size = 0;
      return start

      /**
       * Start of an autolink.
       *
       * ```markdown
       * > | a<https://example.com>b
       *      ^
       * > | a<user@example.com>b
       *      ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('autolink');
        effects.enter('autolinkMarker');
        effects.consume(code);
        effects.exit('autolinkMarker');
        effects.enter('autolinkProtocol');
        return open
      }

      /**
       * After `<`, at protocol or atext.
       *
       * ```markdown
       * > | a<https://example.com>b
       *       ^
       * > | a<user@example.com>b
       *       ^
       * ```
       *
       * @type {State}
       */
      function open(code) {
        if (asciiAlpha(code)) {
          effects.consume(code);
          return schemeOrEmailAtext
        }
        return emailAtext(code)
      }

      /**
       * At second byte of protocol or atext.
       *
       * ```markdown
       * > | a<https://example.com>b
       *        ^
       * > | a<user@example.com>b
       *        ^
       * ```
       *
       * @type {State}
       */
      function schemeOrEmailAtext(code) {
        // ASCII alphanumeric and `+`, `-`, and `.`.
        if (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) {
          // Count the previous alphabetical from `open` too.
          size = 1;
          return schemeInsideOrEmailAtext(code)
        }
        return emailAtext(code)
      }

      /**
       * In ambiguous protocol or atext.
       *
       * ```markdown
       * > | a<https://example.com>b
       *        ^
       * > | a<user@example.com>b
       *        ^
       * ```
       *
       * @type {State}
       */
      function schemeInsideOrEmailAtext(code) {
        if (code === 58) {
          effects.consume(code);
          size = 0;
          return urlInside
        }

        // ASCII alphanumeric and `+`, `-`, and `.`.
        if (
          (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) &&
          size++ < 32
        ) {
          effects.consume(code);
          return schemeInsideOrEmailAtext
        }
        size = 0;
        return emailAtext(code)
      }

      /**
       * After protocol, in URL.
       *
       * ```markdown
       * > | a<https://example.com>b
       *             ^
       * ```
       *
       * @type {State}
       */
      function urlInside(code) {
        if (code === 62) {
          effects.exit('autolinkProtocol');
          effects.enter('autolinkMarker');
          effects.consume(code);
          effects.exit('autolinkMarker');
          effects.exit('autolink');
          return ok
        }

        // ASCII control, space, or `<`.
        if (code === null || code === 32 || code === 60 || asciiControl(code)) {
          return nok(code)
        }
        effects.consume(code);
        return urlInside
      }

      /**
       * In email atext.
       *
       * ```markdown
       * > | a<user.name@example.com>b
       *              ^
       * ```
       *
       * @type {State}
       */
      function emailAtext(code) {
        if (code === 64) {
          effects.consume(code);
          return emailAtSignOrDot
        }
        if (asciiAtext(code)) {
          effects.consume(code);
          return emailAtext
        }
        return nok(code)
      }

      /**
       * In label, after at-sign or dot.
       *
       * ```markdown
       * > | a<user.name@example.com>b
       *                 ^       ^
       * ```
       *
       * @type {State}
       */
      function emailAtSignOrDot(code) {
        return asciiAlphanumeric(code) ? emailLabel(code) : nok(code)
      }

      /**
       * In label, where `.` and `>` are allowed.
       *
       * ```markdown
       * > | a<user.name@example.com>b
       *                   ^
       * ```
       *
       * @type {State}
       */
      function emailLabel(code) {
        if (code === 46) {
          effects.consume(code);
          size = 0;
          return emailAtSignOrDot
        }
        if (code === 62) {
          // Exit, then change the token type.
          effects.exit('autolinkProtocol').type = 'autolinkEmail';
          effects.enter('autolinkMarker');
          effects.consume(code);
          effects.exit('autolinkMarker');
          effects.exit('autolink');
          return ok
        }
        return emailValue(code)
      }

      /**
       * In label, where `.` and `>` are *not* allowed.
       *
       * Though, this is also used in `emailLabel` to parse other values.
       *
       * ```markdown
       * > | a<user.name@ex-ample.com>b
       *                    ^
       * ```
       *
       * @type {State}
       */
      function emailValue(code) {
        // ASCII alphanumeric or `-`.
        if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
          const next = code === 45 ? emailValue : emailLabel;
          effects.consume(code);
          return next
        }
        return nok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const blankLine = {
      tokenize: tokenizeBlankLine,
      partial: true
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeBlankLine(effects, ok, nok) {
      return start

      /**
       * Start of blank line.
       *
       * > 👉 **Note**: `␠` represents a space character.
       *
       * ```markdown
       * > | ␠␠␊
       *     ^
       * > | ␊
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        return markdownSpace(code)
          ? factorySpace(effects, after, 'linePrefix')(code)
          : after(code)
      }

      /**
       * At eof/eol, after optional whitespace.
       *
       * > 👉 **Note**: `␠` represents a space character.
       *
       * ```markdown
       * > | ␠␠␊
       *       ^
       * > | ␊
       *     ^
       * ```
       *
       * @type {State}
       */
      function after(code) {
        return code === null || markdownLineEnding(code) ? ok(code) : nok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').Exiter} Exiter
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const blockQuote = {
      name: 'blockQuote',
      tokenize: tokenizeBlockQuoteStart,
      continuation: {
        tokenize: tokenizeBlockQuoteContinuation
      },
      exit: exit$1
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeBlockQuoteStart(effects, ok, nok) {
      const self = this;
      return start

      /**
       * Start of block quote.
       *
       * ```markdown
       * > | > a
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        if (code === 62) {
          const state = self.containerState;
          if (!state.open) {
            effects.enter('blockQuote', {
              _container: true
            });
            state.open = true;
          }
          effects.enter('blockQuotePrefix');
          effects.enter('blockQuoteMarker');
          effects.consume(code);
          effects.exit('blockQuoteMarker');
          return after
        }
        return nok(code)
      }

      /**
       * After `>`, before optional whitespace.
       *
       * ```markdown
       * > | > a
       *      ^
       * ```
       *
       * @type {State}
       */
      function after(code) {
        if (markdownSpace(code)) {
          effects.enter('blockQuotePrefixWhitespace');
          effects.consume(code);
          effects.exit('blockQuotePrefixWhitespace');
          effects.exit('blockQuotePrefix');
          return ok
        }
        effects.exit('blockQuotePrefix');
        return ok(code)
      }
    }

    /**
     * Start of block quote continuation.
     *
     * ```markdown
     *   | > a
     * > | > b
     *     ^
     * ```
     *
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeBlockQuoteContinuation(effects, ok, nok) {
      const self = this;
      return contStart

      /**
       * Start of block quote continuation.
       *
       * Also used to parse the first block quote opening.
       *
       * ```markdown
       *   | > a
       * > | > b
       *     ^
       * ```
       *
       * @type {State}
       */
      function contStart(code) {
        if (markdownSpace(code)) {
          // Always populated by defaults.

          return factorySpace(
            effects,
            contBefore,
            'linePrefix',
            self.parser.constructs.disable.null.includes('codeIndented')
              ? undefined
              : 4
          )(code)
        }
        return contBefore(code)
      }

      /**
       * At `>`, after optional whitespace.
       *
       * Also used to parse the first block quote opening.
       *
       * ```markdown
       *   | > a
       * > | > b
       *     ^
       * ```
       *
       * @type {State}
       */
      function contBefore(code) {
        return effects.attempt(blockQuote, ok, nok)(code)
      }
    }

    /** @type {Exiter} */
    function exit$1(effects) {
      effects.exit('blockQuote');
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const characterEscape = {
      name: 'characterEscape',
      tokenize: tokenizeCharacterEscape
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeCharacterEscape(effects, ok, nok) {
      return start

      /**
       * Start of character escape.
       *
       * ```markdown
       * > | a\*b
       *      ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('characterEscape');
        effects.enter('escapeMarker');
        effects.consume(code);
        effects.exit('escapeMarker');
        return inside
      }

      /**
       * After `\`, at punctuation.
       *
       * ```markdown
       * > | a\*b
       *       ^
       * ```
       *
       * @type {State}
       */
      function inside(code) {
        // ASCII punctuation.
        if (asciiPunctuation(code)) {
          effects.enter('characterEscapeValue');
          effects.consume(code);
          effects.exit('characterEscapeValue');
          effects.exit('characterEscape');
          return ok
        }
        return nok(code)
      }
    }

    /// <reference lib="dom" />

    /* eslint-env browser */

    const element = document.createElement('i');

    /**
     * @param {string} value
     * @returns {string|false}
     */
    function decodeNamedCharacterReference(value) {
      const characterReference = '&' + value + ';';
      element.innerHTML = characterReference;
      const char = element.textContent;

      // Some named character references do not require the closing semicolon
      // (`&not`, for instance), which leads to situations where parsing the assumed
      // named reference of `&notit;` will result in the string `¬it;`.
      // When we encounter a trailing semicolon after parsing, and the character
      // reference to decode was not a semicolon (`&semi;`), we can assume that the
      // matching was not complete.
      // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
      // yield `null`.
      if (char.charCodeAt(char.length - 1) === 59 /* `;` */ && value !== 'semi') {
        return false
      }

      // If the decoded string is equal to the input, the character reference was
      // not valid.
      // @ts-expect-error: TypeScript is wrong that `textContent` on elements can
      // yield `null`.
      return char === characterReference ? false : char
    }

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const characterReference = {
      name: 'characterReference',
      tokenize: tokenizeCharacterReference
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeCharacterReference(effects, ok, nok) {
      const self = this;
      let size = 0;
      /** @type {number} */
      let max;
      /** @type {(code: Code) => boolean} */
      let test;
      return start

      /**
       * Start of character reference.
       *
       * ```markdown
       * > | a&amp;b
       *      ^
       * > | a&#123;b
       *      ^
       * > | a&#x9;b
       *      ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('characterReference');
        effects.enter('characterReferenceMarker');
        effects.consume(code);
        effects.exit('characterReferenceMarker');
        return open
      }

      /**
       * After `&`, at `#` for numeric references or alphanumeric for named
       * references.
       *
       * ```markdown
       * > | a&amp;b
       *       ^
       * > | a&#123;b
       *       ^
       * > | a&#x9;b
       *       ^
       * ```
       *
       * @type {State}
       */
      function open(code) {
        if (code === 35) {
          effects.enter('characterReferenceMarkerNumeric');
          effects.consume(code);
          effects.exit('characterReferenceMarkerNumeric');
          return numeric
        }
        effects.enter('characterReferenceValue');
        max = 31;
        test = asciiAlphanumeric;
        return value(code)
      }

      /**
       * After `#`, at `x` for hexadecimals or digit for decimals.
       *
       * ```markdown
       * > | a&#123;b
       *        ^
       * > | a&#x9;b
       *        ^
       * ```
       *
       * @type {State}
       */
      function numeric(code) {
        if (code === 88 || code === 120) {
          effects.enter('characterReferenceMarkerHexadecimal');
          effects.consume(code);
          effects.exit('characterReferenceMarkerHexadecimal');
          effects.enter('characterReferenceValue');
          max = 6;
          test = asciiHexDigit;
          return value
        }
        effects.enter('characterReferenceValue');
        max = 7;
        test = asciiDigit;
        return value(code)
      }

      /**
       * After markers (`&#x`, `&#`, or `&`), in value, before `;`.
       *
       * The character reference kind defines what and how many characters are
       * allowed.
       *
       * ```markdown
       * > | a&amp;b
       *       ^^^
       * > | a&#123;b
       *        ^^^
       * > | a&#x9;b
       *         ^
       * ```
       *
       * @type {State}
       */
      function value(code) {
        if (code === 59 && size) {
          const token = effects.exit('characterReferenceValue');
          if (
            test === asciiAlphanumeric &&
            !decodeNamedCharacterReference(self.sliceSerialize(token))
          ) {
            return nok(code)
          }

          // To do: `markdown-rs` uses a different name:
          // `CharacterReferenceMarkerSemi`.
          effects.enter('characterReferenceMarker');
          effects.consume(code);
          effects.exit('characterReferenceMarker');
          effects.exit('characterReference');
          return ok
        }
        if (test(code) && size++ < max) {
          effects.consume(code);
          return value
        }
        return nok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const nonLazyContinuation = {
      tokenize: tokenizeNonLazyContinuation,
      partial: true
    };

    /** @type {Construct} */
    const codeFenced = {
      name: 'codeFenced',
      tokenize: tokenizeCodeFenced,
      concrete: true
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeCodeFenced(effects, ok, nok) {
      const self = this;
      /** @type {Construct} */
      const closeStart = {
        tokenize: tokenizeCloseStart,
        partial: true
      };
      let initialPrefix = 0;
      let sizeOpen = 0;
      /** @type {NonNullable<Code>} */
      let marker;
      return start

      /**
       * Start of code.
       *
       * ```markdown
       * > | ~~~js
       *     ^
       *   | alert(1)
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function start(code) {
        // To do: parse whitespace like `markdown-rs`.
        return beforeSequenceOpen(code)
      }

      /**
       * In opening fence, after prefix, at sequence.
       *
       * ```markdown
       * > | ~~~js
       *     ^
       *   | alert(1)
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function beforeSequenceOpen(code) {
        const tail = self.events[self.events.length - 1];
        initialPrefix =
          tail && tail[1].type === 'linePrefix'
            ? tail[2].sliceSerialize(tail[1], true).length
            : 0;
        marker = code;
        effects.enter('codeFenced');
        effects.enter('codeFencedFence');
        effects.enter('codeFencedFenceSequence');
        return sequenceOpen(code)
      }

      /**
       * In opening fence sequence.
       *
       * ```markdown
       * > | ~~~js
       *      ^
       *   | alert(1)
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function sequenceOpen(code) {
        if (code === marker) {
          sizeOpen++;
          effects.consume(code);
          return sequenceOpen
        }
        if (sizeOpen < 3) {
          return nok(code)
        }
        effects.exit('codeFencedFenceSequence');
        return markdownSpace(code)
          ? factorySpace(effects, infoBefore, 'whitespace')(code)
          : infoBefore(code)
      }

      /**
       * In opening fence, after the sequence (and optional whitespace), before info.
       *
       * ```markdown
       * > | ~~~js
       *        ^
       *   | alert(1)
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function infoBefore(code) {
        if (code === null || markdownLineEnding(code)) {
          effects.exit('codeFencedFence');
          return self.interrupt
            ? ok(code)
            : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)
        }
        effects.enter('codeFencedFenceInfo');
        effects.enter('chunkString', {
          contentType: 'string'
        });
        return info(code)
      }

      /**
       * In info.
       *
       * ```markdown
       * > | ~~~js
       *        ^
       *   | alert(1)
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function info(code) {
        if (code === null || markdownLineEnding(code)) {
          effects.exit('chunkString');
          effects.exit('codeFencedFenceInfo');
          return infoBefore(code)
        }
        if (markdownSpace(code)) {
          effects.exit('chunkString');
          effects.exit('codeFencedFenceInfo');
          return factorySpace(effects, metaBefore, 'whitespace')(code)
        }
        if (code === 96 && code === marker) {
          return nok(code)
        }
        effects.consume(code);
        return info
      }

      /**
       * In opening fence, after info and whitespace, before meta.
       *
       * ```markdown
       * > | ~~~js eval
       *           ^
       *   | alert(1)
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function metaBefore(code) {
        if (code === null || markdownLineEnding(code)) {
          return infoBefore(code)
        }
        effects.enter('codeFencedFenceMeta');
        effects.enter('chunkString', {
          contentType: 'string'
        });
        return meta(code)
      }

      /**
       * In meta.
       *
       * ```markdown
       * > | ~~~js eval
       *           ^
       *   | alert(1)
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function meta(code) {
        if (code === null || markdownLineEnding(code)) {
          effects.exit('chunkString');
          effects.exit('codeFencedFenceMeta');
          return infoBefore(code)
        }
        if (code === 96 && code === marker) {
          return nok(code)
        }
        effects.consume(code);
        return meta
      }

      /**
       * At eol/eof in code, before a non-lazy closing fence or content.
       *
       * ```markdown
       * > | ~~~js
       *          ^
       * > | alert(1)
       *             ^
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function atNonLazyBreak(code) {
        return effects.attempt(closeStart, after, contentBefore)(code)
      }

      /**
       * Before code content, not a closing fence, at eol.
       *
       * ```markdown
       *   | ~~~js
       * > | alert(1)
       *             ^
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function contentBefore(code) {
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return contentStart
      }

      /**
       * Before code content, not a closing fence.
       *
       * ```markdown
       *   | ~~~js
       * > | alert(1)
       *     ^
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function contentStart(code) {
        return initialPrefix > 0 && markdownSpace(code)
          ? factorySpace(
              effects,
              beforeContentChunk,
              'linePrefix',
              initialPrefix + 1
            )(code)
          : beforeContentChunk(code)
      }

      /**
       * Before code content, after optional prefix.
       *
       * ```markdown
       *   | ~~~js
       * > | alert(1)
       *     ^
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function beforeContentChunk(code) {
        if (code === null || markdownLineEnding(code)) {
          return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)
        }
        effects.enter('codeFlowValue');
        return contentChunk(code)
      }

      /**
       * In code content.
       *
       * ```markdown
       *   | ~~~js
       * > | alert(1)
       *     ^^^^^^^^
       *   | ~~~
       * ```
       *
       * @type {State}
       */
      function contentChunk(code) {
        if (code === null || markdownLineEnding(code)) {
          effects.exit('codeFlowValue');
          return beforeContentChunk(code)
        }
        effects.consume(code);
        return contentChunk
      }

      /**
       * After code.
       *
       * ```markdown
       *   | ~~~js
       *   | alert(1)
       * > | ~~~
       *        ^
       * ```
       *
       * @type {State}
       */
      function after(code) {
        effects.exit('codeFenced');
        return ok(code)
      }

      /**
       * @this {TokenizeContext}
       * @type {Tokenizer}
       */
      function tokenizeCloseStart(effects, ok, nok) {
        let size = 0;
        return startBefore

        /**
         *
         *
         * @type {State}
         */
        function startBefore(code) {
          effects.enter('lineEnding');
          effects.consume(code);
          effects.exit('lineEnding');
          return start
        }

        /**
         * Before closing fence, at optional whitespace.
         *
         * ```markdown
         *   | ~~~js
         *   | alert(1)
         * > | ~~~
         *     ^
         * ```
         *
         * @type {State}
         */
        function start(code) {
          // Always populated by defaults.

          // To do: `enter` here or in next state?
          effects.enter('codeFencedFence');
          return markdownSpace(code)
            ? factorySpace(
                effects,
                beforeSequenceClose,
                'linePrefix',
                self.parser.constructs.disable.null.includes('codeIndented')
                  ? undefined
                  : 4
              )(code)
            : beforeSequenceClose(code)
        }

        /**
         * In closing fence, after optional whitespace, at sequence.
         *
         * ```markdown
         *   | ~~~js
         *   | alert(1)
         * > | ~~~
         *     ^
         * ```
         *
         * @type {State}
         */
        function beforeSequenceClose(code) {
          if (code === marker) {
            effects.enter('codeFencedFenceSequence');
            return sequenceClose(code)
          }
          return nok(code)
        }

        /**
         * In closing fence sequence.
         *
         * ```markdown
         *   | ~~~js
         *   | alert(1)
         * > | ~~~
         *     ^
         * ```
         *
         * @type {State}
         */
        function sequenceClose(code) {
          if (code === marker) {
            size++;
            effects.consume(code);
            return sequenceClose
          }
          if (size >= sizeOpen) {
            effects.exit('codeFencedFenceSequence');
            return markdownSpace(code)
              ? factorySpace(effects, sequenceCloseAfter, 'whitespace')(code)
              : sequenceCloseAfter(code)
          }
          return nok(code)
        }

        /**
         * After closing fence sequence, after optional whitespace.
         *
         * ```markdown
         *   | ~~~js
         *   | alert(1)
         * > | ~~~
         *        ^
         * ```
         *
         * @type {State}
         */
        function sequenceCloseAfter(code) {
          if (code === null || markdownLineEnding(code)) {
            effects.exit('codeFencedFence');
            return ok(code)
          }
          return nok(code)
        }
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeNonLazyContinuation(effects, ok, nok) {
      const self = this;
      return start

      /**
       *
       *
       * @type {State}
       */
      function start(code) {
        if (code === null) {
          return nok(code)
        }
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return lineStart
      }

      /**
       *
       *
       * @type {State}
       */
      function lineStart(code) {
        return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const codeIndented = {
      name: 'codeIndented',
      tokenize: tokenizeCodeIndented
    };

    /** @type {Construct} */
    const furtherStart = {
      tokenize: tokenizeFurtherStart,
      partial: true
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeCodeIndented(effects, ok, nok) {
      const self = this;
      return start

      /**
       * Start of code (indented).
       *
       * > **Parsing note**: it is not needed to check if this first line is a
       * > filled line (that it has a non-whitespace character), because blank lines
       * > are parsed already, so we never run into that.
       *
       * ```markdown
       * > |     aaa
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        // To do: manually check if interrupting like `markdown-rs`.

        effects.enter('codeIndented');
        // To do: use an improved `space_or_tab` function like `markdown-rs`,
        // so that we can drop the next state.
        return factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1)(code)
      }

      /**
       * At start, after 1 or 4 spaces.
       *
       * ```markdown
       * > |     aaa
       *         ^
       * ```
       *
       * @type {State}
       */
      function afterPrefix(code) {
        const tail = self.events[self.events.length - 1];
        return tail &&
          tail[1].type === 'linePrefix' &&
          tail[2].sliceSerialize(tail[1], true).length >= 4
          ? atBreak(code)
          : nok(code)
      }

      /**
       * At a break.
       *
       * ```markdown
       * > |     aaa
       *         ^  ^
       * ```
       *
       * @type {State}
       */
      function atBreak(code) {
        if (code === null) {
          return after(code)
        }
        if (markdownLineEnding(code)) {
          return effects.attempt(furtherStart, atBreak, after)(code)
        }
        effects.enter('codeFlowValue');
        return inside(code)
      }

      /**
       * In code content.
       *
       * ```markdown
       * > |     aaa
       *         ^^^^
       * ```
       *
       * @type {State}
       */
      function inside(code) {
        if (code === null || markdownLineEnding(code)) {
          effects.exit('codeFlowValue');
          return atBreak(code)
        }
        effects.consume(code);
        return inside
      }

      /** @type {State} */
      function after(code) {
        effects.exit('codeIndented');
        // To do: allow interrupting like `markdown-rs`.
        // Feel free to interrupt.
        // tokenizer.interrupt = false
        return ok(code)
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeFurtherStart(effects, ok, nok) {
      const self = this;
      return furtherStart

      /**
       * At eol, trying to parse another indent.
       *
       * ```markdown
       * > |     aaa
       *            ^
       *   |     bbb
       * ```
       *
       * @type {State}
       */
      function furtherStart(code) {
        // To do: improve `lazy` / `pierce` handling.
        // If this is a lazy line, it can’t be code.
        if (self.parser.lazy[self.now().line]) {
          return nok(code)
        }
        if (markdownLineEnding(code)) {
          effects.enter('lineEnding');
          effects.consume(code);
          effects.exit('lineEnding');
          return furtherStart
        }

        // To do: the code here in `micromark-js` is a bit different from
        // `markdown-rs` because there it can attempt spaces.
        // We can’t yet.
        //
        // To do: use an improved `space_or_tab` function like `markdown-rs`,
        // so that we can drop the next state.
        return factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1)(code)
      }

      /**
       * At start, after 1 or 4 spaces.
       *
       * ```markdown
       * > |     aaa
       *         ^
       * ```
       *
       * @type {State}
       */
      function afterPrefix(code) {
        const tail = self.events[self.events.length - 1];
        return tail &&
          tail[1].type === 'linePrefix' &&
          tail[2].sliceSerialize(tail[1], true).length >= 4
          ? ok(code)
          : markdownLineEnding(code)
          ? furtherStart(code)
          : nok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').Previous} Previous
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const codeText = {
      name: 'codeText',
      tokenize: tokenizeCodeText,
      resolve: resolveCodeText,
      previous: previous$1
    };

    // To do: next major: don’t resolve, like `markdown-rs`.
    /** @type {Resolver} */
    function resolveCodeText(events) {
      let tailExitIndex = events.length - 4;
      let headEnterIndex = 3;
      /** @type {number} */
      let index;
      /** @type {number | undefined} */
      let enter;

      // If we start and end with an EOL or a space.
      if (
        (events[headEnterIndex][1].type === 'lineEnding' ||
          events[headEnterIndex][1].type === 'space') &&
        (events[tailExitIndex][1].type === 'lineEnding' ||
          events[tailExitIndex][1].type === 'space')
      ) {
        index = headEnterIndex;

        // And we have data.
        while (++index < tailExitIndex) {
          if (events[index][1].type === 'codeTextData') {
            // Then we have padding.
            events[headEnterIndex][1].type = 'codeTextPadding';
            events[tailExitIndex][1].type = 'codeTextPadding';
            headEnterIndex += 2;
            tailExitIndex -= 2;
            break
          }
        }
      }

      // Merge adjacent spaces and data.
      index = headEnterIndex - 1;
      tailExitIndex++;
      while (++index <= tailExitIndex) {
        if (enter === undefined) {
          if (index !== tailExitIndex && events[index][1].type !== 'lineEnding') {
            enter = index;
          }
        } else if (
          index === tailExitIndex ||
          events[index][1].type === 'lineEnding'
        ) {
          events[enter][1].type = 'codeTextData';
          if (index !== enter + 2) {
            events[enter][1].end = events[index - 1][1].end;
            events.splice(enter + 2, index - enter - 2);
            tailExitIndex -= index - enter - 2;
            index = enter + 2;
          }
          enter = undefined;
        }
      }
      return events
    }

    /**
     * @this {TokenizeContext}
     * @type {Previous}
     */
    function previous$1(code) {
      // If there is a previous code, there will always be a tail.
      return (
        code !== 96 ||
        this.events[this.events.length - 1][1].type === 'characterEscape'
      )
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeCodeText(effects, ok, nok) {
      let sizeOpen = 0;
      /** @type {number} */
      let size;
      /** @type {Token} */
      let token;
      return start

      /**
       * Start of code (text).
       *
       * ```markdown
       * > | `a`
       *     ^
       * > | \`a`
       *      ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('codeText');
        effects.enter('codeTextSequence');
        return sequenceOpen(code)
      }

      /**
       * In opening sequence.
       *
       * ```markdown
       * > | `a`
       *     ^
       * ```
       *
       * @type {State}
       */
      function sequenceOpen(code) {
        if (code === 96) {
          effects.consume(code);
          sizeOpen++;
          return sequenceOpen
        }
        effects.exit('codeTextSequence');
        return between(code)
      }

      /**
       * Between something and something else.
       *
       * ```markdown
       * > | `a`
       *      ^^
       * ```
       *
       * @type {State}
       */
      function between(code) {
        // EOF.
        if (code === null) {
          return nok(code)
        }

        // To do: next major: don’t do spaces in resolve, but when compiling,
        // like `markdown-rs`.
        // Tabs don’t work, and virtual spaces don’t make sense.
        if (code === 32) {
          effects.enter('space');
          effects.consume(code);
          effects.exit('space');
          return between
        }

        // Closing fence? Could also be data.
        if (code === 96) {
          token = effects.enter('codeTextSequence');
          size = 0;
          return sequenceClose(code)
        }
        if (markdownLineEnding(code)) {
          effects.enter('lineEnding');
          effects.consume(code);
          effects.exit('lineEnding');
          return between
        }

        // Data.
        effects.enter('codeTextData');
        return data(code)
      }

      /**
       * In data.
       *
       * ```markdown
       * > | `a`
       *      ^
       * ```
       *
       * @type {State}
       */
      function data(code) {
        if (
          code === null ||
          code === 32 ||
          code === 96 ||
          markdownLineEnding(code)
        ) {
          effects.exit('codeTextData');
          return between(code)
        }
        effects.consume(code);
        return data
      }

      /**
       * In closing sequence.
       *
       * ```markdown
       * > | `a`
       *       ^
       * ```
       *
       * @type {State}
       */
      function sequenceClose(code) {
        // More.
        if (code === 96) {
          effects.consume(code);
          size++;
          return sequenceClose
        }

        // Done!
        if (size === sizeOpen) {
          effects.exit('codeTextSequence');
          effects.exit('codeText');
          return ok(code)
        }

        // More or less accents: mark as data.
        token.type = 'codeTextData';
        return data(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Chunk} Chunk
     * @typedef {import('micromark-util-types').Event} Event
     * @typedef {import('micromark-util-types').Token} Token
     */
    /**
     * Tokenize subcontent.
     *
     * @param {Array<Event>} events
     *   List of events.
     * @returns {boolean}
     *   Whether subtokens were found.
     */
    function subtokenize(events) {
      /** @type {Record<string, number>} */
      const jumps = {};
      let index = -1;
      /** @type {Event} */
      let event;
      /** @type {number | undefined} */
      let lineIndex;
      /** @type {number} */
      let otherIndex;
      /** @type {Event} */
      let otherEvent;
      /** @type {Array<Event>} */
      let parameters;
      /** @type {Array<Event>} */
      let subevents;
      /** @type {boolean | undefined} */
      let more;
      while (++index < events.length) {
        while (index in jumps) {
          index = jumps[index];
        }
        event = events[index];

        // Add a hook for the GFM tasklist extension, which needs to know if text
        // is in the first content of a list item.
        if (
          index &&
          event[1].type === 'chunkFlow' &&
          events[index - 1][1].type === 'listItemPrefix'
        ) {
          subevents = event[1]._tokenizer.events;
          otherIndex = 0;
          if (
            otherIndex < subevents.length &&
            subevents[otherIndex][1].type === 'lineEndingBlank'
          ) {
            otherIndex += 2;
          }
          if (
            otherIndex < subevents.length &&
            subevents[otherIndex][1].type === 'content'
          ) {
            while (++otherIndex < subevents.length) {
              if (subevents[otherIndex][1].type === 'content') {
                break
              }
              if (subevents[otherIndex][1].type === 'chunkText') {
                subevents[otherIndex][1]._isInFirstContentOfListItem = true;
                otherIndex++;
              }
            }
          }
        }

        // Enter.
        if (event[0] === 'enter') {
          if (event[1].contentType) {
            Object.assign(jumps, subcontent(events, index));
            index = jumps[index];
            more = true;
          }
        }
        // Exit.
        else if (event[1]._container) {
          otherIndex = index;
          lineIndex = undefined;
          while (otherIndex--) {
            otherEvent = events[otherIndex];
            if (
              otherEvent[1].type === 'lineEnding' ||
              otherEvent[1].type === 'lineEndingBlank'
            ) {
              if (otherEvent[0] === 'enter') {
                if (lineIndex) {
                  events[lineIndex][1].type = 'lineEndingBlank';
                }
                otherEvent[1].type = 'lineEnding';
                lineIndex = otherIndex;
              }
            } else {
              break
            }
          }
          if (lineIndex) {
            // Fix position.
            event[1].end = Object.assign({}, events[lineIndex][1].start);

            // Switch container exit w/ line endings.
            parameters = events.slice(lineIndex, index);
            parameters.unshift(event);
            splice(events, lineIndex, index - lineIndex + 1, parameters);
          }
        }
      }
      return !more
    }

    /**
     * Tokenize embedded tokens.
     *
     * @param {Array<Event>} events
     * @param {number} eventIndex
     * @returns {Record<string, number>}
     */
    function subcontent(events, eventIndex) {
      const token = events[eventIndex][1];
      const context = events[eventIndex][2];
      let startPosition = eventIndex - 1;
      /** @type {Array<number>} */
      const startPositions = [];
      const tokenizer =
        token._tokenizer || context.parser[token.contentType](token.start);
      const childEvents = tokenizer.events;
      /** @type {Array<[number, number]>} */
      const jumps = [];
      /** @type {Record<string, number>} */
      const gaps = {};
      /** @type {Array<Chunk>} */
      let stream;
      /** @type {Token | undefined} */
      let previous;
      let index = -1;
      /** @type {Token | undefined} */
      let current = token;
      let adjust = 0;
      let start = 0;
      const breaks = [start];

      // Loop forward through the linked tokens to pass them in order to the
      // subtokenizer.
      while (current) {
        // Find the position of the event for this token.
        while (events[++startPosition][1] !== current) {
          // Empty.
        }
        startPositions.push(startPosition);
        if (!current._tokenizer) {
          stream = context.sliceStream(current);
          if (!current.next) {
            stream.push(null);
          }
          if (previous) {
            tokenizer.defineSkip(current.start);
          }
          if (current._isInFirstContentOfListItem) {
            tokenizer._gfmTasklistFirstContentOfListItem = true;
          }
          tokenizer.write(stream);
          if (current._isInFirstContentOfListItem) {
            tokenizer._gfmTasklistFirstContentOfListItem = undefined;
          }
        }

        // Unravel the next token.
        previous = current;
        current = current.next;
      }

      // Now, loop back through all events (and linked tokens), to figure out which
      // parts belong where.
      current = token;
      while (++index < childEvents.length) {
        if (
          // Find a void token that includes a break.
          childEvents[index][0] === 'exit' &&
          childEvents[index - 1][0] === 'enter' &&
          childEvents[index][1].type === childEvents[index - 1][1].type &&
          childEvents[index][1].start.line !== childEvents[index][1].end.line
        ) {
          start = index + 1;
          breaks.push(start);
          // Help GC.
          current._tokenizer = undefined;
          current.previous = undefined;
          current = current.next;
        }
      }

      // Help GC.
      tokenizer.events = [];

      // If there’s one more token (which is the cases for lines that end in an
      // EOF), that’s perfect: the last point we found starts it.
      // If there isn’t then make sure any remaining content is added to it.
      if (current) {
        // Help GC.
        current._tokenizer = undefined;
        current.previous = undefined;
      } else {
        breaks.pop();
      }

      // Now splice the events from the subtokenizer into the current events,
      // moving back to front so that splice indices aren’t affected.
      index = breaks.length;
      while (index--) {
        const slice = childEvents.slice(breaks[index], breaks[index + 1]);
        const start = startPositions.pop();
        jumps.unshift([start, start + slice.length - 1]);
        splice(events, start, 2, slice);
      }
      index = -1;
      while (++index < jumps.length) {
        gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
        adjust += jumps[index][1] - jumps[index][0] - 1;
      }
      return gaps
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /**
     * No name because it must not be turned off.
     * @type {Construct}
     */
    const content = {
      tokenize: tokenizeContent,
      resolve: resolveContent
    };

    /** @type {Construct} */
    const continuationConstruct = {
      tokenize: tokenizeContinuation,
      partial: true
    };

    /**
     * Content is transparent: it’s parsed right now. That way, definitions are also
     * parsed right now: before text in paragraphs (specifically, media) are parsed.
     *
     * @type {Resolver}
     */
    function resolveContent(events) {
      subtokenize(events);
      return events
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeContent(effects, ok) {
      /** @type {Token | undefined} */
      let previous;
      return chunkStart

      /**
       * Before a content chunk.
       *
       * ```markdown
       * > | abc
       *     ^
       * ```
       *
       * @type {State}
       */
      function chunkStart(code) {
        effects.enter('content');
        previous = effects.enter('chunkContent', {
          contentType: 'content'
        });
        return chunkInside(code)
      }

      /**
       * In a content chunk.
       *
       * ```markdown
       * > | abc
       *     ^^^
       * ```
       *
       * @type {State}
       */
      function chunkInside(code) {
        if (code === null) {
          return contentEnd(code)
        }

        // To do: in `markdown-rs`, each line is parsed on its own, and everything
        // is stitched together resolving.
        if (markdownLineEnding(code)) {
          return effects.check(
            continuationConstruct,
            contentContinue,
            contentEnd
          )(code)
        }

        // Data.
        effects.consume(code);
        return chunkInside
      }

      /**
       *
       *
       * @type {State}
       */
      function contentEnd(code) {
        effects.exit('chunkContent');
        effects.exit('content');
        return ok(code)
      }

      /**
       *
       *
       * @type {State}
       */
      function contentContinue(code) {
        effects.consume(code);
        effects.exit('chunkContent');
        previous.next = effects.enter('chunkContent', {
          contentType: 'content',
          previous
        });
        previous = previous.next;
        return chunkInside
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeContinuation(effects, ok, nok) {
      const self = this;
      return startLookahead

      /**
       *
       *
       * @type {State}
       */
      function startLookahead(code) {
        effects.exit('chunkContent');
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return factorySpace(effects, prefixed, 'linePrefix')
      }

      /**
       *
       *
       * @type {State}
       */
      function prefixed(code) {
        if (code === null || markdownLineEnding(code)) {
          return nok(code)
        }

        // Always populated by defaults.

        const tail = self.events[self.events.length - 1];
        if (
          !self.parser.constructs.disable.null.includes('codeIndented') &&
          tail &&
          tail[1].type === 'linePrefix' &&
          tail[2].sliceSerialize(tail[1], true).length >= 4
        ) {
          return ok(code)
        }
        return effects.interrupt(self.parser.constructs.flow, nok, ok)(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Effects} Effects
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenType} TokenType
     */
    /**
     * Parse destinations.
     *
     * ###### Examples
     *
     * ```markdown
     * <a>
     * <a\>b>
     * <a b>
     * <a)>
     * a
     * a\)b
     * a(b)c
     * a(b)
     * ```
     *
     * @param {Effects} effects
     *   Context.
     * @param {State} ok
     *   State switched to when successful.
     * @param {State} nok
     *   State switched to when unsuccessful.
     * @param {TokenType} type
     *   Type for whole (`<a>` or `b`).
     * @param {TokenType} literalType
     *   Type when enclosed (`<a>`).
     * @param {TokenType} literalMarkerType
     *   Type for enclosing (`<` and `>`).
     * @param {TokenType} rawType
     *   Type when not enclosed (`b`).
     * @param {TokenType} stringType
     *   Type for the value (`a` or `b`).
     * @param {number | undefined} [max=Infinity]
     *   Depth of nested parens (inclusive).
     * @returns {State}
     *   Start state.
     */ // eslint-disable-next-line max-params
    function factoryDestination(
      effects,
      ok,
      nok,
      type,
      literalType,
      literalMarkerType,
      rawType,
      stringType,
      max
    ) {
      const limit = max || Number.POSITIVE_INFINITY;
      let balance = 0;
      return start

      /**
       * Start of destination.
       *
       * ```markdown
       * > | <aa>
       *     ^
       * > | aa
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        if (code === 60) {
          effects.enter(type);
          effects.enter(literalType);
          effects.enter(literalMarkerType);
          effects.consume(code);
          effects.exit(literalMarkerType);
          return enclosedBefore
        }

        // ASCII control, space, closing paren.
        if (code === null || code === 32 || code === 41 || asciiControl(code)) {
          return nok(code)
        }
        effects.enter(type);
        effects.enter(rawType);
        effects.enter(stringType);
        effects.enter('chunkString', {
          contentType: 'string'
        });
        return raw(code)
      }

      /**
       * After `<`, at an enclosed destination.
       *
       * ```markdown
       * > | <aa>
       *      ^
       * ```
       *
       * @type {State}
       */
      function enclosedBefore(code) {
        if (code === 62) {
          effects.enter(literalMarkerType);
          effects.consume(code);
          effects.exit(literalMarkerType);
          effects.exit(literalType);
          effects.exit(type);
          return ok
        }
        effects.enter(stringType);
        effects.enter('chunkString', {
          contentType: 'string'
        });
        return enclosed(code)
      }

      /**
       * In enclosed destination.
       *
       * ```markdown
       * > | <aa>
       *      ^
       * ```
       *
       * @type {State}
       */
      function enclosed(code) {
        if (code === 62) {
          effects.exit('chunkString');
          effects.exit(stringType);
          return enclosedBefore(code)
        }
        if (code === null || code === 60 || markdownLineEnding(code)) {
          return nok(code)
        }
        effects.consume(code);
        return code === 92 ? enclosedEscape : enclosed
      }

      /**
       * After `\`, at a special character.
       *
       * ```markdown
       * > | <a\*a>
       *        ^
       * ```
       *
       * @type {State}
       */
      function enclosedEscape(code) {
        if (code === 60 || code === 62 || code === 92) {
          effects.consume(code);
          return enclosed
        }
        return enclosed(code)
      }

      /**
       * In raw destination.
       *
       * ```markdown
       * > | aa
       *     ^
       * ```
       *
       * @type {State}
       */
      function raw(code) {
        if (
          !balance &&
          (code === null || code === 41 || markdownLineEndingOrSpace(code))
        ) {
          effects.exit('chunkString');
          effects.exit(stringType);
          effects.exit(rawType);
          effects.exit(type);
          return ok(code)
        }
        if (balance < limit && code === 40) {
          effects.consume(code);
          balance++;
          return raw
        }
        if (code === 41) {
          effects.consume(code);
          balance--;
          return raw
        }

        // ASCII control (but *not* `\0`) and space and `(`.
        // Note: in `markdown-rs`, `\0` exists in codes, in `micromark-js` it
        // doesn’t.
        if (code === null || code === 32 || code === 40 || asciiControl(code)) {
          return nok(code)
        }
        effects.consume(code);
        return code === 92 ? rawEscape : raw
      }

      /**
       * After `\`, at special character.
       *
       * ```markdown
       * > | a\*a
       *       ^
       * ```
       *
       * @type {State}
       */
      function rawEscape(code) {
        if (code === 40 || code === 41 || code === 92) {
          effects.consume(code);
          return raw
        }
        return raw(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Effects} Effects
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').TokenType} TokenType
     */
    /**
     * Parse labels.
     *
     * > 👉 **Note**: labels in markdown are capped at 999 characters in the string.
     *
     * ###### Examples
     *
     * ```markdown
     * [a]
     * [a
     * b]
     * [a\]b]
     * ```
     *
     * @this {TokenizeContext}
     *   Tokenize context.
     * @param {Effects} effects
     *   Context.
     * @param {State} ok
     *   State switched to when successful.
     * @param {State} nok
     *   State switched to when unsuccessful.
     * @param {TokenType} type
     *   Type of the whole label (`[a]`).
     * @param {TokenType} markerType
     *   Type for the markers (`[` and `]`).
     * @param {TokenType} stringType
     *   Type for the identifier (`a`).
     * @returns {State}
     *   Start state.
     */ // eslint-disable-next-line max-params
    function factoryLabel(effects, ok, nok, type, markerType, stringType) {
      const self = this;
      let size = 0;
      /** @type {boolean} */
      let seen;
      return start

      /**
       * Start of label.
       *
       * ```markdown
       * > | [a]
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter(type);
        effects.enter(markerType);
        effects.consume(code);
        effects.exit(markerType);
        effects.enter(stringType);
        return atBreak
      }

      /**
       * In label, at something, before something else.
       *
       * ```markdown
       * > | [a]
       *      ^
       * ```
       *
       * @type {State}
       */
      function atBreak(code) {
        if (
          size > 999 ||
          code === null ||
          code === 91 ||
          (code === 93 && !seen) ||
          // To do: remove in the future once we’ve switched from
          // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
          // which doesn’t need this.
          // Hidden footnotes hook.
          /* c8 ignore next 3 */
          (code === 94 &&
            !size &&
            '_hiddenFootnoteSupport' in self.parser.constructs)
        ) {
          return nok(code)
        }
        if (code === 93) {
          effects.exit(stringType);
          effects.enter(markerType);
          effects.consume(code);
          effects.exit(markerType);
          effects.exit(type);
          return ok
        }

        // To do: indent? Link chunks and EOLs together?
        if (markdownLineEnding(code)) {
          effects.enter('lineEnding');
          effects.consume(code);
          effects.exit('lineEnding');
          return atBreak
        }
        effects.enter('chunkString', {
          contentType: 'string'
        });
        return labelInside(code)
      }

      /**
       * In label, in text.
       *
       * ```markdown
       * > | [a]
       *      ^
       * ```
       *
       * @type {State}
       */
      function labelInside(code) {
        if (
          code === null ||
          code === 91 ||
          code === 93 ||
          markdownLineEnding(code) ||
          size++ > 999
        ) {
          effects.exit('chunkString');
          return atBreak(code)
        }
        effects.consume(code);
        if (!seen) seen = !markdownSpace(code);
        return code === 92 ? labelEscape : labelInside
      }

      /**
       * After `\`, at a special character.
       *
       * ```markdown
       * > | [a\*a]
       *        ^
       * ```
       *
       * @type {State}
       */
      function labelEscape(code) {
        if (code === 91 || code === 92 || code === 93) {
          effects.consume(code);
          size++;
          return labelInside
        }
        return labelInside(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Effects} Effects
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenType} TokenType
     */
    /**
     * Parse titles.
     *
     * ###### Examples
     *
     * ```markdown
     * "a"
     * 'b'
     * (c)
     * "a
     * b"
     * 'a
     *     b'
     * (a\)b)
     * ```
     *
     * @param {Effects} effects
     *   Context.
     * @param {State} ok
     *   State switched to when successful.
     * @param {State} nok
     *   State switched to when unsuccessful.
     * @param {TokenType} type
     *   Type of the whole title (`"a"`, `'b'`, `(c)`).
     * @param {TokenType} markerType
     *   Type for the markers (`"`, `'`, `(`, and `)`).
     * @param {TokenType} stringType
     *   Type for the value (`a`).
     * @returns {State}
     *   Start state.
     */ // eslint-disable-next-line max-params
    function factoryTitle(effects, ok, nok, type, markerType, stringType) {
      /** @type {NonNullable<Code>} */
      let marker;
      return start

      /**
       * Start of title.
       *
       * ```markdown
       * > | "a"
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        if (code === 34 || code === 39 || code === 40) {
          effects.enter(type);
          effects.enter(markerType);
          effects.consume(code);
          effects.exit(markerType);
          marker = code === 40 ? 41 : code;
          return begin
        }
        return nok(code)
      }

      /**
       * After opening marker.
       *
       * This is also used at the closing marker.
       *
       * ```markdown
       * > | "a"
       *      ^
       * ```
       *
       * @type {State}
       */
      function begin(code) {
        if (code === marker) {
          effects.enter(markerType);
          effects.consume(code);
          effects.exit(markerType);
          effects.exit(type);
          return ok
        }
        effects.enter(stringType);
        return atBreak(code)
      }

      /**
       * At something, before something else.
       *
       * ```markdown
       * > | "a"
       *      ^
       * ```
       *
       * @type {State}
       */
      function atBreak(code) {
        if (code === marker) {
          effects.exit(stringType);
          return begin(marker)
        }
        if (code === null) {
          return nok(code)
        }

        // Note: blank lines can’t exist in content.
        if (markdownLineEnding(code)) {
          // To do: use `space_or_tab_eol_with_options`, connect.
          effects.enter('lineEnding');
          effects.consume(code);
          effects.exit('lineEnding');
          return factorySpace(effects, atBreak, 'linePrefix')
        }
        effects.enter('chunkString', {
          contentType: 'string'
        });
        return inside(code)
      }

      /**
       *
       *
       * @type {State}
       */
      function inside(code) {
        if (code === marker || code === null || markdownLineEnding(code)) {
          effects.exit('chunkString');
          return atBreak(code)
        }
        effects.consume(code);
        return code === 92 ? escape : inside
      }

      /**
       * After `\`, at a special character.
       *
       * ```markdown
       * > | "a\*b"
       *      ^
       * ```
       *
       * @type {State}
       */
      function escape(code) {
        if (code === marker || code === 92) {
          effects.consume(code);
          return inside
        }
        return inside(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Effects} Effects
     * @typedef {import('micromark-util-types').State} State
     */
    /**
     * Parse spaces and tabs.
     *
     * There is no `nok` parameter:
     *
     * *   line endings or spaces in markdown are often optional, in which case this
     *     factory can be used and `ok` will be switched to whether spaces were found
     *     or not
     * *   one line ending or space can be detected with
     *     `markdownLineEndingOrSpace(code)` right before using `factoryWhitespace`
     *
     * @param {Effects} effects
     *   Context.
     * @param {State} ok
     *   State switched to when successful.
     * @returns
     *   Start state.
     */
    function factoryWhitespace(effects, ok) {
      /** @type {boolean} */
      let seen;
      return start

      /** @type {State} */
      function start(code) {
        if (markdownLineEnding(code)) {
          effects.enter('lineEnding');
          effects.consume(code);
          effects.exit('lineEnding');
          seen = true;
          return start
        }
        if (markdownSpace(code)) {
          return factorySpace(
            effects,
            start,
            seen ? 'linePrefix' : 'lineSuffix'
          )(code)
        }
        return ok(code)
      }
    }

    /**
     * Normalize an identifier (as found in references, definitions).
     *
     * Collapses markdown whitespace, trim, and then lower- and uppercase.
     *
     * Some characters are considered “uppercase”, such as U+03F4 (`ϴ`), but if their
     * lowercase counterpart (U+03B8 (`θ`)) is uppercased will result in a different
     * uppercase character (U+0398 (`Θ`)).
     * So, to get a canonical form, we perform both lower- and uppercase.
     *
     * Using uppercase last makes sure keys will never interact with default
     * prototypal values (such as `constructor`): nothing in the prototype of
     * `Object` is uppercase.
     *
     * @param {string} value
     *   Identifier to normalize.
     * @returns {string}
     *   Normalized identifier.
     */
    function normalizeIdentifier(value) {
      return (
        value
          // Collapse markdown whitespace.
          .replace(/[\t\n\r ]+/g, ' ')
          // Trim.
          .replace(/^ | $/g, '')
          // Some characters are considered “uppercase”, but if their lowercase
          // counterpart is uppercased will result in a different uppercase
          // character.
          // Hence, to get that form, we perform both lower- and uppercase.
          // Upper case makes sure keys will not interact with default prototypal
          // methods: no method is uppercase.
          .toLowerCase()
          .toUpperCase()
      )
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const definition = {
      name: 'definition',
      tokenize: tokenizeDefinition
    };

    /** @type {Construct} */
    const titleBefore = {
      tokenize: tokenizeTitleBefore,
      partial: true
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeDefinition(effects, ok, nok) {
      const self = this;
      /** @type {string} */
      let identifier;
      return start

      /**
       * At start of a definition.
       *
       * ```markdown
       * > | [a]: b "c"
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        // Do not interrupt paragraphs (but do follow definitions).
        // To do: do `interrupt` the way `markdown-rs` does.
        // To do: parse whitespace the way `markdown-rs` does.
        effects.enter('definition');
        return before(code)
      }

      /**
       * After optional whitespace, at `[`.
       *
       * ```markdown
       * > | [a]: b "c"
       *     ^
       * ```
       *
       * @type {State}
       */
      function before(code) {
        // To do: parse whitespace the way `markdown-rs` does.

        return factoryLabel.call(
          self,
          effects,
          labelAfter,
          // Note: we don’t need to reset the way `markdown-rs` does.
          nok,
          'definitionLabel',
          'definitionLabelMarker',
          'definitionLabelString'
        )(code)
      }

      /**
       * After label.
       *
       * ```markdown
       * > | [a]: b "c"
       *        ^
       * ```
       *
       * @type {State}
       */
      function labelAfter(code) {
        identifier = normalizeIdentifier(
          self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
        );
        if (code === 58) {
          effects.enter('definitionMarker');
          effects.consume(code);
          effects.exit('definitionMarker');
          return markerAfter
        }
        return nok(code)
      }

      /**
       * After marker.
       *
       * ```markdown
       * > | [a]: b "c"
       *         ^
       * ```
       *
       * @type {State}
       */
      function markerAfter(code) {
        // Note: whitespace is optional.
        return markdownLineEndingOrSpace(code)
          ? factoryWhitespace(effects, destinationBefore)(code)
          : destinationBefore(code)
      }

      /**
       * Before destination.
       *
       * ```markdown
       * > | [a]: b "c"
       *          ^
       * ```
       *
       * @type {State}
       */
      function destinationBefore(code) {
        return factoryDestination(
          effects,
          destinationAfter,
          // Note: we don’t need to reset the way `markdown-rs` does.
          nok,
          'definitionDestination',
          'definitionDestinationLiteral',
          'definitionDestinationLiteralMarker',
          'definitionDestinationRaw',
          'definitionDestinationString'
        )(code)
      }

      /**
       * After destination.
       *
       * ```markdown
       * > | [a]: b "c"
       *           ^
       * ```
       *
       * @type {State}
       */
      function destinationAfter(code) {
        return effects.attempt(titleBefore, after, after)(code)
      }

      /**
       * After definition.
       *
       * ```markdown
       * > | [a]: b
       *           ^
       * > | [a]: b "c"
       *               ^
       * ```
       *
       * @type {State}
       */
      function after(code) {
        return markdownSpace(code)
          ? factorySpace(effects, afterWhitespace, 'whitespace')(code)
          : afterWhitespace(code)
      }

      /**
       * After definition, after optional whitespace.
       *
       * ```markdown
       * > | [a]: b
       *           ^
       * > | [a]: b "c"
       *               ^
       * ```
       *
       * @type {State}
       */
      function afterWhitespace(code) {
        if (code === null || markdownLineEnding(code)) {
          effects.exit('definition');

          // Note: we don’t care about uniqueness.
          // It’s likely that that doesn’t happen very frequently.
          // It is more likely that it wastes precious time.
          self.parser.defined.push(identifier);

          // To do: `markdown-rs` interrupt.
          // // You’d be interrupting.
          // tokenizer.interrupt = true
          return ok(code)
        }
        return nok(code)
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeTitleBefore(effects, ok, nok) {
      return titleBefore

      /**
       * After destination, at whitespace.
       *
       * ```markdown
       * > | [a]: b
       *           ^
       * > | [a]: b "c"
       *           ^
       * ```
       *
       * @type {State}
       */
      function titleBefore(code) {
        return markdownLineEndingOrSpace(code)
          ? factoryWhitespace(effects, beforeMarker)(code)
          : nok(code)
      }

      /**
       * At title.
       *
       * ```markdown
       *   | [a]: b
       * > | "c"
       *     ^
       * ```
       *
       * @type {State}
       */
      function beforeMarker(code) {
        return factoryTitle(
          effects,
          titleAfter,
          nok,
          'definitionTitle',
          'definitionTitleMarker',
          'definitionTitleString'
        )(code)
      }

      /**
       * After title.
       *
       * ```markdown
       * > | [a]: b "c"
       *               ^
       * ```
       *
       * @type {State}
       */
      function titleAfter(code) {
        return markdownSpace(code)
          ? factorySpace(effects, titleAfterOptionalWhitespace, 'whitespace')(code)
          : titleAfterOptionalWhitespace(code)
      }

      /**
       * After title, after optional whitespace.
       *
       * ```markdown
       * > | [a]: b "c"
       *               ^
       * ```
       *
       * @type {State}
       */
      function titleAfterOptionalWhitespace(code) {
        return code === null || markdownLineEnding(code) ? ok(code) : nok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const hardBreakEscape = {
      name: 'hardBreakEscape',
      tokenize: tokenizeHardBreakEscape
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeHardBreakEscape(effects, ok, nok) {
      return start

      /**
       * Start of a hard break (escape).
       *
       * ```markdown
       * > | a\
       *      ^
       *   | b
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('hardBreakEscape');
        effects.consume(code);
        return after
      }

      /**
       * After `\`, at eol.
       *
       * ```markdown
       * > | a\
       *       ^
       *   | b
       * ```
       *
       *  @type {State}
       */
      function after(code) {
        if (markdownLineEnding(code)) {
          effects.exit('hardBreakEscape');
          return ok(code)
        }
        return nok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const headingAtx = {
      name: 'headingAtx',
      tokenize: tokenizeHeadingAtx,
      resolve: resolveHeadingAtx
    };

    /** @type {Resolver} */
    function resolveHeadingAtx(events, context) {
      let contentEnd = events.length - 2;
      let contentStart = 3;
      /** @type {Token} */
      let content;
      /** @type {Token} */
      let text;

      // Prefix whitespace, part of the opening.
      if (events[contentStart][1].type === 'whitespace') {
        contentStart += 2;
      }

      // Suffix whitespace, part of the closing.
      if (
        contentEnd - 2 > contentStart &&
        events[contentEnd][1].type === 'whitespace'
      ) {
        contentEnd -= 2;
      }
      if (
        events[contentEnd][1].type === 'atxHeadingSequence' &&
        (contentStart === contentEnd - 1 ||
          (contentEnd - 4 > contentStart &&
            events[contentEnd - 2][1].type === 'whitespace'))
      ) {
        contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
      }
      if (contentEnd > contentStart) {
        content = {
          type: 'atxHeadingText',
          start: events[contentStart][1].start,
          end: events[contentEnd][1].end
        };
        text = {
          type: 'chunkText',
          start: events[contentStart][1].start,
          end: events[contentEnd][1].end,
          contentType: 'text'
        };
        splice(events, contentStart, contentEnd - contentStart + 1, [
          ['enter', content, context],
          ['enter', text, context],
          ['exit', text, context],
          ['exit', content, context]
        ]);
      }
      return events
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeHeadingAtx(effects, ok, nok) {
      let size = 0;
      return start

      /**
       * Start of a heading (atx).
       *
       * ```markdown
       * > | ## aa
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        // To do: parse indent like `markdown-rs`.
        effects.enter('atxHeading');
        return before(code)
      }

      /**
       * After optional whitespace, at `#`.
       *
       * ```markdown
       * > | ## aa
       *     ^
       * ```
       *
       * @type {State}
       */
      function before(code) {
        effects.enter('atxHeadingSequence');
        return sequenceOpen(code)
      }

      /**
       * In opening sequence.
       *
       * ```markdown
       * > | ## aa
       *     ^
       * ```
       *
       * @type {State}
       */
      function sequenceOpen(code) {
        if (code === 35 && size++ < 6) {
          effects.consume(code);
          return sequenceOpen
        }

        // Always at least one `#`.
        if (code === null || markdownLineEndingOrSpace(code)) {
          effects.exit('atxHeadingSequence');
          return atBreak(code)
        }
        return nok(code)
      }

      /**
       * After something, before something else.
       *
       * ```markdown
       * > | ## aa
       *       ^
       * ```
       *
       * @type {State}
       */
      function atBreak(code) {
        if (code === 35) {
          effects.enter('atxHeadingSequence');
          return sequenceFurther(code)
        }
        if (code === null || markdownLineEnding(code)) {
          effects.exit('atxHeading');
          // To do: interrupt like `markdown-rs`.
          // // Feel free to interrupt.
          // tokenizer.interrupt = false
          return ok(code)
        }
        if (markdownSpace(code)) {
          return factorySpace(effects, atBreak, 'whitespace')(code)
        }

        // To do: generate `data` tokens, add the `text` token later.
        // Needs edit map, see: `markdown.rs`.
        effects.enter('atxHeadingText');
        return data(code)
      }

      /**
       * In further sequence (after whitespace).
       *
       * Could be normal “visible” hashes in the heading or a final sequence.
       *
       * ```markdown
       * > | ## aa ##
       *           ^
       * ```
       *
       * @type {State}
       */
      function sequenceFurther(code) {
        if (code === 35) {
          effects.consume(code);
          return sequenceFurther
        }
        effects.exit('atxHeadingSequence');
        return atBreak(code)
      }

      /**
       * In text.
       *
       * ```markdown
       * > | ## aa
       *        ^
       * ```
       *
       * @type {State}
       */
      function data(code) {
        if (code === null || code === 35 || markdownLineEndingOrSpace(code)) {
          effects.exit('atxHeadingText');
          return atBreak(code)
        }
        effects.consume(code);
        return data
      }
    }

    /**
     * List of lowercase HTML “block” tag names.
     *
     * The list, when parsing HTML (flow), results in more relaxed rules (condition
     * 6).
     * Because they are known blocks, the HTML-like syntax doesn’t have to be
     * strictly parsed.
     * For tag names not in this list, a more strict algorithm (condition 7) is used
     * to detect whether the HTML-like syntax is seen as HTML (flow) or not.
     *
     * This is copied from:
     * <https://spec.commonmark.org/0.30/#html-blocks>.
     *
     * > 👉 **Note**: `search` was added in `CommonMark@0.31`.
     */
    const htmlBlockNames = [
      'address',
      'article',
      'aside',
      'base',
      'basefont',
      'blockquote',
      'body',
      'caption',
      'center',
      'col',
      'colgroup',
      'dd',
      'details',
      'dialog',
      'dir',
      'div',
      'dl',
      'dt',
      'fieldset',
      'figcaption',
      'figure',
      'footer',
      'form',
      'frame',
      'frameset',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'head',
      'header',
      'hr',
      'html',
      'iframe',
      'legend',
      'li',
      'link',
      'main',
      'menu',
      'menuitem',
      'nav',
      'noframes',
      'ol',
      'optgroup',
      'option',
      'p',
      'param',
      'search',
      'section',
      'summary',
      'table',
      'tbody',
      'td',
      'tfoot',
      'th',
      'thead',
      'title',
      'tr',
      'track',
      'ul'
    ];

    /**
     * List of lowercase HTML “raw” tag names.
     *
     * The list, when parsing HTML (flow), results in HTML that can include lines
     * without exiting, until a closing tag also in this list is found (condition
     * 1).
     *
     * This module is copied from:
     * <https://spec.commonmark.org/0.30/#html-blocks>.
     *
     * > 👉 **Note**: `textarea` was added in `CommonMark@0.30`.
     */
    const htmlRawNames = ['pre', 'script', 'style', 'textarea'];

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */

    /** @type {Construct} */
    const htmlFlow = {
      name: 'htmlFlow',
      tokenize: tokenizeHtmlFlow,
      resolveTo: resolveToHtmlFlow,
      concrete: true
    };

    /** @type {Construct} */
    const blankLineBefore = {
      tokenize: tokenizeBlankLineBefore,
      partial: true
    };
    const nonLazyContinuationStart = {
      tokenize: tokenizeNonLazyContinuationStart,
      partial: true
    };

    /** @type {Resolver} */
    function resolveToHtmlFlow(events) {
      let index = events.length;
      while (index--) {
        if (events[index][0] === 'enter' && events[index][1].type === 'htmlFlow') {
          break
        }
      }
      if (index > 1 && events[index - 2][1].type === 'linePrefix') {
        // Add the prefix start to the HTML token.
        events[index][1].start = events[index - 2][1].start;
        // Add the prefix start to the HTML line token.
        events[index + 1][1].start = events[index - 2][1].start;
        // Remove the line prefix.
        events.splice(index - 2, 2);
      }
      return events
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeHtmlFlow(effects, ok, nok) {
      const self = this;
      /** @type {number} */
      let marker;
      /** @type {boolean} */
      let closingTag;
      /** @type {string} */
      let buffer;
      /** @type {number} */
      let index;
      /** @type {Code} */
      let markerB;
      return start

      /**
       * Start of HTML (flow).
       *
       * ```markdown
       * > | <x />
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        // To do: parse indent like `markdown-rs`.
        return before(code)
      }

      /**
       * At `<`, after optional whitespace.
       *
       * ```markdown
       * > | <x />
       *     ^
       * ```
       *
       * @type {State}
       */
      function before(code) {
        effects.enter('htmlFlow');
        effects.enter('htmlFlowData');
        effects.consume(code);
        return open
      }

      /**
       * After `<`, at tag name or other stuff.
       *
       * ```markdown
       * > | <x />
       *      ^
       * > | <!doctype>
       *      ^
       * > | <!--xxx-->
       *      ^
       * ```
       *
       * @type {State}
       */
      function open(code) {
        if (code === 33) {
          effects.consume(code);
          return declarationOpen
        }
        if (code === 47) {
          effects.consume(code);
          closingTag = true;
          return tagCloseStart
        }
        if (code === 63) {
          effects.consume(code);
          marker = 3;
          // To do:
          // tokenizer.concrete = true
          // To do: use `markdown-rs` style interrupt.
          // While we’re in an instruction instead of a declaration, we’re on a `?`
          // right now, so we do need to search for `>`, similar to declarations.
          return self.interrupt ? ok : continuationDeclarationInside
        }

        // ASCII alphabetical.
        if (asciiAlpha(code)) {
          effects.consume(code);
          // @ts-expect-error: not null.
          buffer = String.fromCharCode(code);
          return tagName
        }
        return nok(code)
      }

      /**
       * After `<!`, at declaration, comment, or CDATA.
       *
       * ```markdown
       * > | <!doctype>
       *       ^
       * > | <!--xxx-->
       *       ^
       * > | <![CDATA[>&<]]>
       *       ^
       * ```
       *
       * @type {State}
       */
      function declarationOpen(code) {
        if (code === 45) {
          effects.consume(code);
          marker = 2;
          return commentOpenInside
        }
        if (code === 91) {
          effects.consume(code);
          marker = 5;
          index = 0;
          return cdataOpenInside
        }

        // ASCII alphabetical.
        if (asciiAlpha(code)) {
          effects.consume(code);
          marker = 4;
          // // Do not form containers.
          // tokenizer.concrete = true
          return self.interrupt ? ok : continuationDeclarationInside
        }
        return nok(code)
      }

      /**
       * After `<!-`, inside a comment, at another `-`.
       *
       * ```markdown
       * > | <!--xxx-->
       *        ^
       * ```
       *
       * @type {State}
       */
      function commentOpenInside(code) {
        if (code === 45) {
          effects.consume(code);
          // // Do not form containers.
          // tokenizer.concrete = true
          return self.interrupt ? ok : continuationDeclarationInside
        }
        return nok(code)
      }

      /**
       * After `<![`, inside CDATA, expecting `CDATA[`.
       *
       * ```markdown
       * > | <![CDATA[>&<]]>
       *        ^^^^^^
       * ```
       *
       * @type {State}
       */
      function cdataOpenInside(code) {
        const value = 'CDATA[';
        if (code === value.charCodeAt(index++)) {
          effects.consume(code);
          if (index === value.length) {
            // // Do not form containers.
            // tokenizer.concrete = true
            return self.interrupt ? ok : continuation
          }
          return cdataOpenInside
        }
        return nok(code)
      }

      /**
       * After `</`, in closing tag, at tag name.
       *
       * ```markdown
       * > | </x>
       *       ^
       * ```
       *
       * @type {State}
       */
      function tagCloseStart(code) {
        if (asciiAlpha(code)) {
          effects.consume(code);
          // @ts-expect-error: not null.
          buffer = String.fromCharCode(code);
          return tagName
        }
        return nok(code)
      }

      /**
       * In tag name.
       *
       * ```markdown
       * > | <ab>
       *      ^^
       * > | </ab>
       *       ^^
       * ```
       *
       * @type {State}
       */
      function tagName(code) {
        if (
          code === null ||
          code === 47 ||
          code === 62 ||
          markdownLineEndingOrSpace(code)
        ) {
          const slash = code === 47;
          const name = buffer.toLowerCase();
          if (!slash && !closingTag && htmlRawNames.includes(name)) {
            marker = 1;
            // // Do not form containers.
            // tokenizer.concrete = true
            return self.interrupt ? ok(code) : continuation(code)
          }
          if (htmlBlockNames.includes(buffer.toLowerCase())) {
            marker = 6;
            if (slash) {
              effects.consume(code);
              return basicSelfClosing
            }

            // // Do not form containers.
            // tokenizer.concrete = true
            return self.interrupt ? ok(code) : continuation(code)
          }
          marker = 7;
          // Do not support complete HTML when interrupting.
          return self.interrupt && !self.parser.lazy[self.now().line]
            ? nok(code)
            : closingTag
            ? completeClosingTagAfter(code)
            : completeAttributeNameBefore(code)
        }

        // ASCII alphanumerical and `-`.
        if (code === 45 || asciiAlphanumeric(code)) {
          effects.consume(code);
          buffer += String.fromCharCode(code);
          return tagName
        }
        return nok(code)
      }

      /**
       * After closing slash of a basic tag name.
       *
       * ```markdown
       * > | <div/>
       *          ^
       * ```
       *
       * @type {State}
       */
      function basicSelfClosing(code) {
        if (code === 62) {
          effects.consume(code);
          // // Do not form containers.
          // tokenizer.concrete = true
          return self.interrupt ? ok : continuation
        }
        return nok(code)
      }

      /**
       * After closing slash of a complete tag name.
       *
       * ```markdown
       * > | <x/>
       *        ^
       * ```
       *
       * @type {State}
       */
      function completeClosingTagAfter(code) {
        if (markdownSpace(code)) {
          effects.consume(code);
          return completeClosingTagAfter
        }
        return completeEnd(code)
      }

      /**
       * At an attribute name.
       *
       * At first, this state is used after a complete tag name, after whitespace,
       * where it expects optional attributes or the end of the tag.
       * It is also reused after attributes, when expecting more optional
       * attributes.
       *
       * ```markdown
       * > | <a />
       *        ^
       * > | <a :b>
       *        ^
       * > | <a _b>
       *        ^
       * > | <a b>
       *        ^
       * > | <a >
       *        ^
       * ```
       *
       * @type {State}
       */
      function completeAttributeNameBefore(code) {
        if (code === 47) {
          effects.consume(code);
          return completeEnd
        }

        // ASCII alphanumerical and `:` and `_`.
        if (code === 58 || code === 95 || asciiAlpha(code)) {
          effects.consume(code);
          return completeAttributeName
        }
        if (markdownSpace(code)) {
          effects.consume(code);
          return completeAttributeNameBefore
        }
        return completeEnd(code)
      }

      /**
       * In attribute name.
       *
       * ```markdown
       * > | <a :b>
       *         ^
       * > | <a _b>
       *         ^
       * > | <a b>
       *         ^
       * ```
       *
       * @type {State}
       */
      function completeAttributeName(code) {
        // ASCII alphanumerical and `-`, `.`, `:`, and `_`.
        if (
          code === 45 ||
          code === 46 ||
          code === 58 ||
          code === 95 ||
          asciiAlphanumeric(code)
        ) {
          effects.consume(code);
          return completeAttributeName
        }
        return completeAttributeNameAfter(code)
      }

      /**
       * After attribute name, at an optional initializer, the end of the tag, or
       * whitespace.
       *
       * ```markdown
       * > | <a b>
       *         ^
       * > | <a b=c>
       *         ^
       * ```
       *
       * @type {State}
       */
      function completeAttributeNameAfter(code) {
        if (code === 61) {
          effects.consume(code);
          return completeAttributeValueBefore
        }
        if (markdownSpace(code)) {
          effects.consume(code);
          return completeAttributeNameAfter
        }
        return completeAttributeNameBefore(code)
      }

      /**
       * Before unquoted, double quoted, or single quoted attribute value, allowing
       * whitespace.
       *
       * ```markdown
       * > | <a b=c>
       *          ^
       * > | <a b="c">
       *          ^
       * ```
       *
       * @type {State}
       */
      function completeAttributeValueBefore(code) {
        if (
          code === null ||
          code === 60 ||
          code === 61 ||
          code === 62 ||
          code === 96
        ) {
          return nok(code)
        }
        if (code === 34 || code === 39) {
          effects.consume(code);
          markerB = code;
          return completeAttributeValueQuoted
        }
        if (markdownSpace(code)) {
          effects.consume(code);
          return completeAttributeValueBefore
        }
        return completeAttributeValueUnquoted(code)
      }

      /**
       * In double or single quoted attribute value.
       *
       * ```markdown
       * > | <a b="c">
       *           ^
       * > | <a b='c'>
       *           ^
       * ```
       *
       * @type {State}
       */
      function completeAttributeValueQuoted(code) {
        if (code === markerB) {
          effects.consume(code);
          markerB = null;
          return completeAttributeValueQuotedAfter
        }
        if (code === null || markdownLineEnding(code)) {
          return nok(code)
        }
        effects.consume(code);
        return completeAttributeValueQuoted
      }

      /**
       * In unquoted attribute value.
       *
       * ```markdown
       * > | <a b=c>
       *          ^
       * ```
       *
       * @type {State}
       */
      function completeAttributeValueUnquoted(code) {
        if (
          code === null ||
          code === 34 ||
          code === 39 ||
          code === 47 ||
          code === 60 ||
          code === 61 ||
          code === 62 ||
          code === 96 ||
          markdownLineEndingOrSpace(code)
        ) {
          return completeAttributeNameAfter(code)
        }
        effects.consume(code);
        return completeAttributeValueUnquoted
      }

      /**
       * After double or single quoted attribute value, before whitespace or the
       * end of the tag.
       *
       * ```markdown
       * > | <a b="c">
       *            ^
       * ```
       *
       * @type {State}
       */
      function completeAttributeValueQuotedAfter(code) {
        if (code === 47 || code === 62 || markdownSpace(code)) {
          return completeAttributeNameBefore(code)
        }
        return nok(code)
      }

      /**
       * In certain circumstances of a complete tag where only an `>` is allowed.
       *
       * ```markdown
       * > | <a b="c">
       *             ^
       * ```
       *
       * @type {State}
       */
      function completeEnd(code) {
        if (code === 62) {
          effects.consume(code);
          return completeAfter
        }
        return nok(code)
      }

      /**
       * After `>` in a complete tag.
       *
       * ```markdown
       * > | <x>
       *        ^
       * ```
       *
       * @type {State}
       */
      function completeAfter(code) {
        if (code === null || markdownLineEnding(code)) {
          // // Do not form containers.
          // tokenizer.concrete = true
          return continuation(code)
        }
        if (markdownSpace(code)) {
          effects.consume(code);
          return completeAfter
        }
        return nok(code)
      }

      /**
       * In continuation of any HTML kind.
       *
       * ```markdown
       * > | <!--xxx-->
       *          ^
       * ```
       *
       * @type {State}
       */
      function continuation(code) {
        if (code === 45 && marker === 2) {
          effects.consume(code);
          return continuationCommentInside
        }
        if (code === 60 && marker === 1) {
          effects.consume(code);
          return continuationRawTagOpen
        }
        if (code === 62 && marker === 4) {
          effects.consume(code);
          return continuationClose
        }
        if (code === 63 && marker === 3) {
          effects.consume(code);
          return continuationDeclarationInside
        }
        if (code === 93 && marker === 5) {
          effects.consume(code);
          return continuationCdataInside
        }
        if (markdownLineEnding(code) && (marker === 6 || marker === 7)) {
          effects.exit('htmlFlowData');
          return effects.check(
            blankLineBefore,
            continuationAfter,
            continuationStart
          )(code)
        }
        if (code === null || markdownLineEnding(code)) {
          effects.exit('htmlFlowData');
          return continuationStart(code)
        }
        effects.consume(code);
        return continuation
      }

      /**
       * In continuation, at eol.
       *
       * ```markdown
       * > | <x>
       *        ^
       *   | asd
       * ```
       *
       * @type {State}
       */
      function continuationStart(code) {
        return effects.check(
          nonLazyContinuationStart,
          continuationStartNonLazy,
          continuationAfter
        )(code)
      }

      /**
       * In continuation, at eol, before non-lazy content.
       *
       * ```markdown
       * > | <x>
       *        ^
       *   | asd
       * ```
       *
       * @type {State}
       */
      function continuationStartNonLazy(code) {
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return continuationBefore
      }

      /**
       * In continuation, before non-lazy content.
       *
       * ```markdown
       *   | <x>
       * > | asd
       *     ^
       * ```
       *
       * @type {State}
       */
      function continuationBefore(code) {
        if (code === null || markdownLineEnding(code)) {
          return continuationStart(code)
        }
        effects.enter('htmlFlowData');
        return continuation(code)
      }

      /**
       * In comment continuation, after one `-`, expecting another.
       *
       * ```markdown
       * > | <!--xxx-->
       *             ^
       * ```
       *
       * @type {State}
       */
      function continuationCommentInside(code) {
        if (code === 45) {
          effects.consume(code);
          return continuationDeclarationInside
        }
        return continuation(code)
      }

      /**
       * In raw continuation, after `<`, at `/`.
       *
       * ```markdown
       * > | <script>console.log(1)</script>
       *                            ^
       * ```
       *
       * @type {State}
       */
      function continuationRawTagOpen(code) {
        if (code === 47) {
          effects.consume(code);
          buffer = '';
          return continuationRawEndTag
        }
        return continuation(code)
      }

      /**
       * In raw continuation, after `</`, in a raw tag name.
       *
       * ```markdown
       * > | <script>console.log(1)</script>
       *                             ^^^^^^
       * ```
       *
       * @type {State}
       */
      function continuationRawEndTag(code) {
        if (code === 62) {
          const name = buffer.toLowerCase();
          if (htmlRawNames.includes(name)) {
            effects.consume(code);
            return continuationClose
          }
          return continuation(code)
        }
        if (asciiAlpha(code) && buffer.length < 8) {
          effects.consume(code);
          // @ts-expect-error: not null.
          buffer += String.fromCharCode(code);
          return continuationRawEndTag
        }
        return continuation(code)
      }

      /**
       * In cdata continuation, after `]`, expecting `]>`.
       *
       * ```markdown
       * > | <![CDATA[>&<]]>
       *                  ^
       * ```
       *
       * @type {State}
       */
      function continuationCdataInside(code) {
        if (code === 93) {
          effects.consume(code);
          return continuationDeclarationInside
        }
        return continuation(code)
      }

      /**
       * In declaration or instruction continuation, at `>`.
       *
       * ```markdown
       * > | <!-->
       *         ^
       * > | <?>
       *       ^
       * > | <!q>
       *        ^
       * > | <!--ab-->
       *             ^
       * > | <![CDATA[>&<]]>
       *                   ^
       * ```
       *
       * @type {State}
       */
      function continuationDeclarationInside(code) {
        if (code === 62) {
          effects.consume(code);
          return continuationClose
        }

        // More dashes.
        if (code === 45 && marker === 2) {
          effects.consume(code);
          return continuationDeclarationInside
        }
        return continuation(code)
      }

      /**
       * In closed continuation: everything we get until the eol/eof is part of it.
       *
       * ```markdown
       * > | <!doctype>
       *               ^
       * ```
       *
       * @type {State}
       */
      function continuationClose(code) {
        if (code === null || markdownLineEnding(code)) {
          effects.exit('htmlFlowData');
          return continuationAfter(code)
        }
        effects.consume(code);
        return continuationClose
      }

      /**
       * Done.
       *
       * ```markdown
       * > | <!doctype>
       *               ^
       * ```
       *
       * @type {State}
       */
      function continuationAfter(code) {
        effects.exit('htmlFlow');
        // // Feel free to interrupt.
        // tokenizer.interrupt = false
        // // No longer concrete.
        // tokenizer.concrete = false
        return ok(code)
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeNonLazyContinuationStart(effects, ok, nok) {
      const self = this;
      return start

      /**
       * At eol, before continuation.
       *
       * ```markdown
       * > | * ```js
       *            ^
       *   | b
       * ```
       *
       * @type {State}
       */
      function start(code) {
        if (markdownLineEnding(code)) {
          effects.enter('lineEnding');
          effects.consume(code);
          effects.exit('lineEnding');
          return after
        }
        return nok(code)
      }

      /**
       * A continuation.
       *
       * ```markdown
       *   | * ```js
       * > | b
       *     ^
       * ```
       *
       * @type {State}
       */
      function after(code) {
        return self.parser.lazy[self.now().line] ? nok(code) : ok(code)
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeBlankLineBefore(effects, ok, nok) {
      return start

      /**
       * Before eol, expecting blank line.
       *
       * ```markdown
       * > | <div>
       *          ^
       *   |
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return effects.attempt(blankLine, ok, nok)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const htmlText = {
      name: 'htmlText',
      tokenize: tokenizeHtmlText
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeHtmlText(effects, ok, nok) {
      const self = this;
      /** @type {NonNullable<Code> | undefined} */
      let marker;
      /** @type {number} */
      let index;
      /** @type {State} */
      let returnState;
      return start

      /**
       * Start of HTML (text).
       *
       * ```markdown
       * > | a <b> c
       *       ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('htmlText');
        effects.enter('htmlTextData');
        effects.consume(code);
        return open
      }

      /**
       * After `<`, at tag name or other stuff.
       *
       * ```markdown
       * > | a <b> c
       *        ^
       * > | a <!doctype> c
       *        ^
       * > | a <!--b--> c
       *        ^
       * ```
       *
       * @type {State}
       */
      function open(code) {
        if (code === 33) {
          effects.consume(code);
          return declarationOpen
        }
        if (code === 47) {
          effects.consume(code);
          return tagCloseStart
        }
        if (code === 63) {
          effects.consume(code);
          return instruction
        }

        // ASCII alphabetical.
        if (asciiAlpha(code)) {
          effects.consume(code);
          return tagOpen
        }
        return nok(code)
      }

      /**
       * After `<!`, at declaration, comment, or CDATA.
       *
       * ```markdown
       * > | a <!doctype> c
       *         ^
       * > | a <!--b--> c
       *         ^
       * > | a <![CDATA[>&<]]> c
       *         ^
       * ```
       *
       * @type {State}
       */
      function declarationOpen(code) {
        if (code === 45) {
          effects.consume(code);
          return commentOpenInside
        }
        if (code === 91) {
          effects.consume(code);
          index = 0;
          return cdataOpenInside
        }
        if (asciiAlpha(code)) {
          effects.consume(code);
          return declaration
        }
        return nok(code)
      }

      /**
       * In a comment, after `<!-`, at another `-`.
       *
       * ```markdown
       * > | a <!--b--> c
       *          ^
       * ```
       *
       * @type {State}
       */
      function commentOpenInside(code) {
        if (code === 45) {
          effects.consume(code);
          return commentEnd
        }
        return nok(code)
      }

      /**
       * In comment.
       *
       * ```markdown
       * > | a <!--b--> c
       *           ^
       * ```
       *
       * @type {State}
       */
      function comment(code) {
        if (code === null) {
          return nok(code)
        }
        if (code === 45) {
          effects.consume(code);
          return commentClose
        }
        if (markdownLineEnding(code)) {
          returnState = comment;
          return lineEndingBefore(code)
        }
        effects.consume(code);
        return comment
      }

      /**
       * In comment, after `-`.
       *
       * ```markdown
       * > | a <!--b--> c
       *             ^
       * ```
       *
       * @type {State}
       */
      function commentClose(code) {
        if (code === 45) {
          effects.consume(code);
          return commentEnd
        }
        return comment(code)
      }

      /**
       * In comment, after `--`.
       *
       * ```markdown
       * > | a <!--b--> c
       *              ^
       * ```
       *
       * @type {State}
       */
      function commentEnd(code) {
        return code === 62
          ? end(code)
          : code === 45
          ? commentClose(code)
          : comment(code)
      }

      /**
       * After `<![`, in CDATA, expecting `CDATA[`.
       *
       * ```markdown
       * > | a <![CDATA[>&<]]> b
       *          ^^^^^^
       * ```
       *
       * @type {State}
       */
      function cdataOpenInside(code) {
        const value = 'CDATA[';
        if (code === value.charCodeAt(index++)) {
          effects.consume(code);
          return index === value.length ? cdata : cdataOpenInside
        }
        return nok(code)
      }

      /**
       * In CDATA.
       *
       * ```markdown
       * > | a <![CDATA[>&<]]> b
       *                ^^^
       * ```
       *
       * @type {State}
       */
      function cdata(code) {
        if (code === null) {
          return nok(code)
        }
        if (code === 93) {
          effects.consume(code);
          return cdataClose
        }
        if (markdownLineEnding(code)) {
          returnState = cdata;
          return lineEndingBefore(code)
        }
        effects.consume(code);
        return cdata
      }

      /**
       * In CDATA, after `]`, at another `]`.
       *
       * ```markdown
       * > | a <![CDATA[>&<]]> b
       *                    ^
       * ```
       *
       * @type {State}
       */
      function cdataClose(code) {
        if (code === 93) {
          effects.consume(code);
          return cdataEnd
        }
        return cdata(code)
      }

      /**
       * In CDATA, after `]]`, at `>`.
       *
       * ```markdown
       * > | a <![CDATA[>&<]]> b
       *                     ^
       * ```
       *
       * @type {State}
       */
      function cdataEnd(code) {
        if (code === 62) {
          return end(code)
        }
        if (code === 93) {
          effects.consume(code);
          return cdataEnd
        }
        return cdata(code)
      }

      /**
       * In declaration.
       *
       * ```markdown
       * > | a <!b> c
       *          ^
       * ```
       *
       * @type {State}
       */
      function declaration(code) {
        if (code === null || code === 62) {
          return end(code)
        }
        if (markdownLineEnding(code)) {
          returnState = declaration;
          return lineEndingBefore(code)
        }
        effects.consume(code);
        return declaration
      }

      /**
       * In instruction.
       *
       * ```markdown
       * > | a <?b?> c
       *         ^
       * ```
       *
       * @type {State}
       */
      function instruction(code) {
        if (code === null) {
          return nok(code)
        }
        if (code === 63) {
          effects.consume(code);
          return instructionClose
        }
        if (markdownLineEnding(code)) {
          returnState = instruction;
          return lineEndingBefore(code)
        }
        effects.consume(code);
        return instruction
      }

      /**
       * In instruction, after `?`, at `>`.
       *
       * ```markdown
       * > | a <?b?> c
       *           ^
       * ```
       *
       * @type {State}
       */
      function instructionClose(code) {
        return code === 62 ? end(code) : instruction(code)
      }

      /**
       * After `</`, in closing tag, at tag name.
       *
       * ```markdown
       * > | a </b> c
       *         ^
       * ```
       *
       * @type {State}
       */
      function tagCloseStart(code) {
        // ASCII alphabetical.
        if (asciiAlpha(code)) {
          effects.consume(code);
          return tagClose
        }
        return nok(code)
      }

      /**
       * After `</x`, in a tag name.
       *
       * ```markdown
       * > | a </b> c
       *          ^
       * ```
       *
       * @type {State}
       */
      function tagClose(code) {
        // ASCII alphanumerical and `-`.
        if (code === 45 || asciiAlphanumeric(code)) {
          effects.consume(code);
          return tagClose
        }
        return tagCloseBetween(code)
      }

      /**
       * In closing tag, after tag name.
       *
       * ```markdown
       * > | a </b> c
       *          ^
       * ```
       *
       * @type {State}
       */
      function tagCloseBetween(code) {
        if (markdownLineEnding(code)) {
          returnState = tagCloseBetween;
          return lineEndingBefore(code)
        }
        if (markdownSpace(code)) {
          effects.consume(code);
          return tagCloseBetween
        }
        return end(code)
      }

      /**
       * After `<x`, in opening tag name.
       *
       * ```markdown
       * > | a <b> c
       *         ^
       * ```
       *
       * @type {State}
       */
      function tagOpen(code) {
        // ASCII alphanumerical and `-`.
        if (code === 45 || asciiAlphanumeric(code)) {
          effects.consume(code);
          return tagOpen
        }
        if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
          return tagOpenBetween(code)
        }
        return nok(code)
      }

      /**
       * In opening tag, after tag name.
       *
       * ```markdown
       * > | a <b> c
       *         ^
       * ```
       *
       * @type {State}
       */
      function tagOpenBetween(code) {
        if (code === 47) {
          effects.consume(code);
          return end
        }

        // ASCII alphabetical and `:` and `_`.
        if (code === 58 || code === 95 || asciiAlpha(code)) {
          effects.consume(code);
          return tagOpenAttributeName
        }
        if (markdownLineEnding(code)) {
          returnState = tagOpenBetween;
          return lineEndingBefore(code)
        }
        if (markdownSpace(code)) {
          effects.consume(code);
          return tagOpenBetween
        }
        return end(code)
      }

      /**
       * In attribute name.
       *
       * ```markdown
       * > | a <b c> d
       *          ^
       * ```
       *
       * @type {State}
       */
      function tagOpenAttributeName(code) {
        // ASCII alphabetical and `-`, `.`, `:`, and `_`.
        if (
          code === 45 ||
          code === 46 ||
          code === 58 ||
          code === 95 ||
          asciiAlphanumeric(code)
        ) {
          effects.consume(code);
          return tagOpenAttributeName
        }
        return tagOpenAttributeNameAfter(code)
      }

      /**
       * After attribute name, before initializer, the end of the tag, or
       * whitespace.
       *
       * ```markdown
       * > | a <b c> d
       *           ^
       * ```
       *
       * @type {State}
       */
      function tagOpenAttributeNameAfter(code) {
        if (code === 61) {
          effects.consume(code);
          return tagOpenAttributeValueBefore
        }
        if (markdownLineEnding(code)) {
          returnState = tagOpenAttributeNameAfter;
          return lineEndingBefore(code)
        }
        if (markdownSpace(code)) {
          effects.consume(code);
          return tagOpenAttributeNameAfter
        }
        return tagOpenBetween(code)
      }

      /**
       * Before unquoted, double quoted, or single quoted attribute value, allowing
       * whitespace.
       *
       * ```markdown
       * > | a <b c=d> e
       *            ^
       * ```
       *
       * @type {State}
       */
      function tagOpenAttributeValueBefore(code) {
        if (
          code === null ||
          code === 60 ||
          code === 61 ||
          code === 62 ||
          code === 96
        ) {
          return nok(code)
        }
        if (code === 34 || code === 39) {
          effects.consume(code);
          marker = code;
          return tagOpenAttributeValueQuoted
        }
        if (markdownLineEnding(code)) {
          returnState = tagOpenAttributeValueBefore;
          return lineEndingBefore(code)
        }
        if (markdownSpace(code)) {
          effects.consume(code);
          return tagOpenAttributeValueBefore
        }
        effects.consume(code);
        return tagOpenAttributeValueUnquoted
      }

      /**
       * In double or single quoted attribute value.
       *
       * ```markdown
       * > | a <b c="d"> e
       *             ^
       * ```
       *
       * @type {State}
       */
      function tagOpenAttributeValueQuoted(code) {
        if (code === marker) {
          effects.consume(code);
          marker = undefined;
          return tagOpenAttributeValueQuotedAfter
        }
        if (code === null) {
          return nok(code)
        }
        if (markdownLineEnding(code)) {
          returnState = tagOpenAttributeValueQuoted;
          return lineEndingBefore(code)
        }
        effects.consume(code);
        return tagOpenAttributeValueQuoted
      }

      /**
       * In unquoted attribute value.
       *
       * ```markdown
       * > | a <b c=d> e
       *            ^
       * ```
       *
       * @type {State}
       */
      function tagOpenAttributeValueUnquoted(code) {
        if (
          code === null ||
          code === 34 ||
          code === 39 ||
          code === 60 ||
          code === 61 ||
          code === 96
        ) {
          return nok(code)
        }
        if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
          return tagOpenBetween(code)
        }
        effects.consume(code);
        return tagOpenAttributeValueUnquoted
      }

      /**
       * After double or single quoted attribute value, before whitespace or the end
       * of the tag.
       *
       * ```markdown
       * > | a <b c="d"> e
       *               ^
       * ```
       *
       * @type {State}
       */
      function tagOpenAttributeValueQuotedAfter(code) {
        if (code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
          return tagOpenBetween(code)
        }
        return nok(code)
      }

      /**
       * In certain circumstances of a tag where only an `>` is allowed.
       *
       * ```markdown
       * > | a <b c="d"> e
       *               ^
       * ```
       *
       * @type {State}
       */
      function end(code) {
        if (code === 62) {
          effects.consume(code);
          effects.exit('htmlTextData');
          effects.exit('htmlText');
          return ok
        }
        return nok(code)
      }

      /**
       * At eol.
       *
       * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
       * > empty tokens.
       *
       * ```markdown
       * > | a <!--a
       *            ^
       *   | b-->
       * ```
       *
       * @type {State}
       */
      function lineEndingBefore(code) {
        effects.exit('htmlTextData');
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return lineEndingAfter
      }

      /**
       * After eol, at optional whitespace.
       *
       * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
       * > empty tokens.
       *
       * ```markdown
       *   | a <!--a
       * > | b-->
       *     ^
       * ```
       *
       * @type {State}
       */
      function lineEndingAfter(code) {
        // Always populated by defaults.

        return markdownSpace(code)
          ? factorySpace(
              effects,
              lineEndingAfterPrefix,
              'linePrefix',
              self.parser.constructs.disable.null.includes('codeIndented')
                ? undefined
                : 4
            )(code)
          : lineEndingAfterPrefix(code)
      }

      /**
       * After eol, after optional whitespace.
       *
       * > 👉 **Note**: we can’t have blank lines in text, so no need to worry about
       * > empty tokens.
       *
       * ```markdown
       *   | a <!--a
       * > | b-->
       *     ^
       * ```
       *
       * @type {State}
       */
      function lineEndingAfterPrefix(code) {
        effects.enter('htmlTextData');
        return returnState(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').Event} Event
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const labelEnd = {
      name: 'labelEnd',
      tokenize: tokenizeLabelEnd,
      resolveTo: resolveToLabelEnd,
      resolveAll: resolveAllLabelEnd
    };

    /** @type {Construct} */
    const resourceConstruct = {
      tokenize: tokenizeResource
    };
    /** @type {Construct} */
    const referenceFullConstruct = {
      tokenize: tokenizeReferenceFull
    };
    /** @type {Construct} */
    const referenceCollapsedConstruct = {
      tokenize: tokenizeReferenceCollapsed
    };

    /** @type {Resolver} */
    function resolveAllLabelEnd(events) {
      let index = -1;
      while (++index < events.length) {
        const token = events[index][1];
        if (
          token.type === 'labelImage' ||
          token.type === 'labelLink' ||
          token.type === 'labelEnd'
        ) {
          // Remove the marker.
          events.splice(index + 1, token.type === 'labelImage' ? 4 : 2);
          token.type = 'data';
          index++;
        }
      }
      return events
    }

    /** @type {Resolver} */
    function resolveToLabelEnd(events, context) {
      let index = events.length;
      let offset = 0;
      /** @type {Token} */
      let token;
      /** @type {number | undefined} */
      let open;
      /** @type {number | undefined} */
      let close;
      /** @type {Array<Event>} */
      let media;

      // Find an opening.
      while (index--) {
        token = events[index][1];
        if (open) {
          // If we see another link, or inactive link label, we’ve been here before.
          if (
            token.type === 'link' ||
            (token.type === 'labelLink' && token._inactive)
          ) {
            break
          }

          // Mark other link openings as inactive, as we can’t have links in
          // links.
          if (events[index][0] === 'enter' && token.type === 'labelLink') {
            token._inactive = true;
          }
        } else if (close) {
          if (
            events[index][0] === 'enter' &&
            (token.type === 'labelImage' || token.type === 'labelLink') &&
            !token._balanced
          ) {
            open = index;
            if (token.type !== 'labelLink') {
              offset = 2;
              break
            }
          }
        } else if (token.type === 'labelEnd') {
          close = index;
        }
      }
      const group = {
        type: events[open][1].type === 'labelLink' ? 'link' : 'image',
        start: Object.assign({}, events[open][1].start),
        end: Object.assign({}, events[events.length - 1][1].end)
      };
      const label = {
        type: 'label',
        start: Object.assign({}, events[open][1].start),
        end: Object.assign({}, events[close][1].end)
      };
      const text = {
        type: 'labelText',
        start: Object.assign({}, events[open + offset + 2][1].end),
        end: Object.assign({}, events[close - 2][1].start)
      };
      media = [
        ['enter', group, context],
        ['enter', label, context]
      ];

      // Opening marker.
      media = push(media, events.slice(open + 1, open + offset + 3));

      // Text open.
      media = push(media, [['enter', text, context]]);

      // Always populated by defaults.

      // Between.
      media = push(
        media,
        resolveAll(
          context.parser.constructs.insideSpan.null,
          events.slice(open + offset + 4, close - 3),
          context
        )
      );

      // Text close, marker close, label close.
      media = push(media, [
        ['exit', text, context],
        events[close - 2],
        events[close - 1],
        ['exit', label, context]
      ]);

      // Reference, resource, or so.
      media = push(media, events.slice(close + 1));

      // Media close.
      media = push(media, [['exit', group, context]]);
      splice(events, open, events.length, media);
      return events
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeLabelEnd(effects, ok, nok) {
      const self = this;
      let index = self.events.length;
      /** @type {Token} */
      let labelStart;
      /** @type {boolean} */
      let defined;

      // Find an opening.
      while (index--) {
        if (
          (self.events[index][1].type === 'labelImage' ||
            self.events[index][1].type === 'labelLink') &&
          !self.events[index][1]._balanced
        ) {
          labelStart = self.events[index][1];
          break
        }
      }
      return start

      /**
       * Start of label end.
       *
       * ```markdown
       * > | [a](b) c
       *       ^
       * > | [a][b] c
       *       ^
       * > | [a][] b
       *       ^
       * > | [a] b
       * ```
       *
       * @type {State}
       */
      function start(code) {
        // If there is not an okay opening.
        if (!labelStart) {
          return nok(code)
        }

        // If the corresponding label (link) start is marked as inactive,
        // it means we’d be wrapping a link, like this:
        //
        // ```markdown
        // > | a [b [c](d) e](f) g.
        //                  ^
        // ```
        //
        // We can’t have that, so it’s just balanced brackets.
        if (labelStart._inactive) {
          return labelEndNok(code)
        }
        defined = self.parser.defined.includes(
          normalizeIdentifier(
            self.sliceSerialize({
              start: labelStart.end,
              end: self.now()
            })
          )
        );
        effects.enter('labelEnd');
        effects.enter('labelMarker');
        effects.consume(code);
        effects.exit('labelMarker');
        effects.exit('labelEnd');
        return after
      }

      /**
       * After `]`.
       *
       * ```markdown
       * > | [a](b) c
       *       ^
       * > | [a][b] c
       *       ^
       * > | [a][] b
       *       ^
       * > | [a] b
       *       ^
       * ```
       *
       * @type {State}
       */
      function after(code) {
        // Note: `markdown-rs` also parses GFM footnotes here, which for us is in
        // an extension.

        // Resource (`[asd](fgh)`)?
        if (code === 40) {
          return effects.attempt(
            resourceConstruct,
            labelEndOk,
            defined ? labelEndOk : labelEndNok
          )(code)
        }

        // Full (`[asd][fgh]`) or collapsed (`[asd][]`) reference?
        if (code === 91) {
          return effects.attempt(
            referenceFullConstruct,
            labelEndOk,
            defined ? referenceNotFull : labelEndNok
          )(code)
        }

        // Shortcut (`[asd]`) reference?
        return defined ? labelEndOk(code) : labelEndNok(code)
      }

      /**
       * After `]`, at `[`, but not at a full reference.
       *
       * > 👉 **Note**: we only get here if the label is defined.
       *
       * ```markdown
       * > | [a][] b
       *        ^
       * > | [a] b
       *        ^
       * ```
       *
       * @type {State}
       */
      function referenceNotFull(code) {
        return effects.attempt(
          referenceCollapsedConstruct,
          labelEndOk,
          labelEndNok
        )(code)
      }

      /**
       * Done, we found something.
       *
       * ```markdown
       * > | [a](b) c
       *           ^
       * > | [a][b] c
       *           ^
       * > | [a][] b
       *          ^
       * > | [a] b
       *        ^
       * ```
       *
       * @type {State}
       */
      function labelEndOk(code) {
        // Note: `markdown-rs` does a bunch of stuff here.
        return ok(code)
      }

      /**
       * Done, it’s nothing.
       *
       * There was an okay opening, but we didn’t match anything.
       *
       * ```markdown
       * > | [a](b c
       *        ^
       * > | [a][b c
       *        ^
       * > | [a] b
       *        ^
       * ```
       *
       * @type {State}
       */
      function labelEndNok(code) {
        labelStart._balanced = true;
        return nok(code)
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeResource(effects, ok, nok) {
      return resourceStart

      /**
       * At a resource.
       *
       * ```markdown
       * > | [a](b) c
       *        ^
       * ```
       *
       * @type {State}
       */
      function resourceStart(code) {
        effects.enter('resource');
        effects.enter('resourceMarker');
        effects.consume(code);
        effects.exit('resourceMarker');
        return resourceBefore
      }

      /**
       * In resource, after `(`, at optional whitespace.
       *
       * ```markdown
       * > | [a](b) c
       *         ^
       * ```
       *
       * @type {State}
       */
      function resourceBefore(code) {
        return markdownLineEndingOrSpace(code)
          ? factoryWhitespace(effects, resourceOpen)(code)
          : resourceOpen(code)
      }

      /**
       * In resource, after optional whitespace, at `)` or a destination.
       *
       * ```markdown
       * > | [a](b) c
       *         ^
       * ```
       *
       * @type {State}
       */
      function resourceOpen(code) {
        if (code === 41) {
          return resourceEnd(code)
        }
        return factoryDestination(
          effects,
          resourceDestinationAfter,
          resourceDestinationMissing,
          'resourceDestination',
          'resourceDestinationLiteral',
          'resourceDestinationLiteralMarker',
          'resourceDestinationRaw',
          'resourceDestinationString',
          32
        )(code)
      }

      /**
       * In resource, after destination, at optional whitespace.
       *
       * ```markdown
       * > | [a](b) c
       *          ^
       * ```
       *
       * @type {State}
       */
      function resourceDestinationAfter(code) {
        return markdownLineEndingOrSpace(code)
          ? factoryWhitespace(effects, resourceBetween)(code)
          : resourceEnd(code)
      }

      /**
       * At invalid destination.
       *
       * ```markdown
       * > | [a](<<) b
       *         ^
       * ```
       *
       * @type {State}
       */
      function resourceDestinationMissing(code) {
        return nok(code)
      }

      /**
       * In resource, after destination and whitespace, at `(` or title.
       *
       * ```markdown
       * > | [a](b ) c
       *           ^
       * ```
       *
       * @type {State}
       */
      function resourceBetween(code) {
        if (code === 34 || code === 39 || code === 40) {
          return factoryTitle(
            effects,
            resourceTitleAfter,
            nok,
            'resourceTitle',
            'resourceTitleMarker',
            'resourceTitleString'
          )(code)
        }
        return resourceEnd(code)
      }

      /**
       * In resource, after title, at optional whitespace.
       *
       * ```markdown
       * > | [a](b "c") d
       *              ^
       * ```
       *
       * @type {State}
       */
      function resourceTitleAfter(code) {
        return markdownLineEndingOrSpace(code)
          ? factoryWhitespace(effects, resourceEnd)(code)
          : resourceEnd(code)
      }

      /**
       * In resource, at `)`.
       *
       * ```markdown
       * > | [a](b) d
       *          ^
       * ```
       *
       * @type {State}
       */
      function resourceEnd(code) {
        if (code === 41) {
          effects.enter('resourceMarker');
          effects.consume(code);
          effects.exit('resourceMarker');
          effects.exit('resource');
          return ok
        }
        return nok(code)
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeReferenceFull(effects, ok, nok) {
      const self = this;
      return referenceFull

      /**
       * In a reference (full), at the `[`.
       *
       * ```markdown
       * > | [a][b] d
       *        ^
       * ```
       *
       * @type {State}
       */
      function referenceFull(code) {
        return factoryLabel.call(
          self,
          effects,
          referenceFullAfter,
          referenceFullMissing,
          'reference',
          'referenceMarker',
          'referenceString'
        )(code)
      }

      /**
       * In a reference (full), after `]`.
       *
       * ```markdown
       * > | [a][b] d
       *          ^
       * ```
       *
       * @type {State}
       */
      function referenceFullAfter(code) {
        return self.parser.defined.includes(
          normalizeIdentifier(
            self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)
          )
        )
          ? ok(code)
          : nok(code)
      }

      /**
       * In reference (full) that was missing.
       *
       * ```markdown
       * > | [a][b d
       *        ^
       * ```
       *
       * @type {State}
       */
      function referenceFullMissing(code) {
        return nok(code)
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeReferenceCollapsed(effects, ok, nok) {
      return referenceCollapsedStart

      /**
       * In reference (collapsed), at `[`.
       *
       * > 👉 **Note**: we only get here if the label is defined.
       *
       * ```markdown
       * > | [a][] d
       *        ^
       * ```
       *
       * @type {State}
       */
      function referenceCollapsedStart(code) {
        // We only attempt a collapsed label if there’s a `[`.

        effects.enter('reference');
        effects.enter('referenceMarker');
        effects.consume(code);
        effects.exit('referenceMarker');
        return referenceCollapsedOpen
      }

      /**
       * In reference (collapsed), at `]`.
       *
       * > 👉 **Note**: we only get here if the label is defined.
       *
       * ```markdown
       * > | [a][] d
       *         ^
       * ```
       *
       *  @type {State}
       */
      function referenceCollapsedOpen(code) {
        if (code === 93) {
          effects.enter('referenceMarker');
          effects.consume(code);
          effects.exit('referenceMarker');
          effects.exit('reference');
          return ok
        }
        return nok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */

    /** @type {Construct} */
    const labelStartImage = {
      name: 'labelStartImage',
      tokenize: tokenizeLabelStartImage,
      resolveAll: labelEnd.resolveAll
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeLabelStartImage(effects, ok, nok) {
      const self = this;
      return start

      /**
       * Start of label (image) start.
       *
       * ```markdown
       * > | a ![b] c
       *       ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('labelImage');
        effects.enter('labelImageMarker');
        effects.consume(code);
        effects.exit('labelImageMarker');
        return open
      }

      /**
       * After `!`, at `[`.
       *
       * ```markdown
       * > | a ![b] c
       *        ^
       * ```
       *
       * @type {State}
       */
      function open(code) {
        if (code === 91) {
          effects.enter('labelMarker');
          effects.consume(code);
          effects.exit('labelMarker');
          effects.exit('labelImage');
          return after
        }
        return nok(code)
      }

      /**
       * After `![`.
       *
       * ```markdown
       * > | a ![b] c
       *         ^
       * ```
       *
       * This is needed in because, when GFM footnotes are enabled, images never
       * form when started with a `^`.
       * Instead, links form:
       *
       * ```markdown
       * ![^a](b)
       *
       * ![^a][b]
       *
       * [b]: c
       * ```
       *
       * ```html
       * <p>!<a href=\"b\">^a</a></p>
       * <p>!<a href=\"c\">^a</a></p>
       * ```
       *
       * @type {State}
       */
      function after(code) {
        // To do: use a new field to do this, this is still needed for
        // `micromark-extension-gfm-footnote`, but the `label-start-link`
        // behavior isn’t.
        // Hidden footnotes hook.
        /* c8 ignore next 3 */
        return code === 94 && '_hiddenFootnoteSupport' in self.parser.constructs
          ? nok(code)
          : ok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */

    /** @type {Construct} */
    const labelStartLink = {
      name: 'labelStartLink',
      tokenize: tokenizeLabelStartLink,
      resolveAll: labelEnd.resolveAll
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeLabelStartLink(effects, ok, nok) {
      const self = this;
      return start

      /**
       * Start of label (link) start.
       *
       * ```markdown
       * > | a [b] c
       *       ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('labelLink');
        effects.enter('labelMarker');
        effects.consume(code);
        effects.exit('labelMarker');
        effects.exit('labelLink');
        return after
      }

      /** @type {State} */
      function after(code) {
        // To do: this isn’t needed in `micromark-extension-gfm-footnote`,
        // remove.
        // Hidden footnotes hook.
        /* c8 ignore next 3 */
        return code === 94 && '_hiddenFootnoteSupport' in self.parser.constructs
          ? nok(code)
          : ok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const lineEnding = {
      name: 'lineEnding',
      tokenize: tokenizeLineEnding
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeLineEnding(effects, ok) {
      return start

      /** @type {State} */
      function start(code) {
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        return factorySpace(effects, ok, 'linePrefix')
      }
    }

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const thematicBreak$1 = {
      name: 'thematicBreak',
      tokenize: tokenizeThematicBreak
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeThematicBreak(effects, ok, nok) {
      let size = 0;
      /** @type {NonNullable<Code>} */
      let marker;
      return start

      /**
       * Start of thematic break.
       *
       * ```markdown
       * > | ***
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('thematicBreak');
        // To do: parse indent like `markdown-rs`.
        return before(code)
      }

      /**
       * After optional whitespace, at marker.
       *
       * ```markdown
       * > | ***
       *     ^
       * ```
       *
       * @type {State}
       */
      function before(code) {
        marker = code;
        return atBreak(code)
      }

      /**
       * After something, before something else.
       *
       * ```markdown
       * > | ***
       *     ^
       * ```
       *
       * @type {State}
       */
      function atBreak(code) {
        if (code === marker) {
          effects.enter('thematicBreakSequence');
          return sequence(code)
        }
        if (size >= 3 && (code === null || markdownLineEnding(code))) {
          effects.exit('thematicBreak');
          return ok(code)
        }
        return nok(code)
      }

      /**
       * In sequence.
       *
       * ```markdown
       * > | ***
       *     ^
       * ```
       *
       * @type {State}
       */
      function sequence(code) {
        if (code === marker) {
          effects.consume(code);
          size++;
          return sequence
        }
        effects.exit('thematicBreakSequence');
        return markdownSpace(code)
          ? factorySpace(effects, atBreak, 'whitespace')(code)
          : atBreak(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').ContainerState} ContainerState
     * @typedef {import('micromark-util-types').Exiter} Exiter
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */

    /** @type {Construct} */
    const list$1 = {
      name: 'list',
      tokenize: tokenizeListStart,
      continuation: {
        tokenize: tokenizeListContinuation
      },
      exit: tokenizeListEnd
    };

    /** @type {Construct} */
    const listItemPrefixWhitespaceConstruct = {
      tokenize: tokenizeListItemPrefixWhitespace,
      partial: true
    };

    /** @type {Construct} */
    const indentConstruct = {
      tokenize: tokenizeIndent$1,
      partial: true
    };

    // To do: `markdown-rs` parses list items on their own and later stitches them
    // together.

    /**
     * @type {Tokenizer}
     * @this {TokenizeContext}
     */
    function tokenizeListStart(effects, ok, nok) {
      const self = this;
      const tail = self.events[self.events.length - 1];
      let initialSize =
        tail && tail[1].type === 'linePrefix'
          ? tail[2].sliceSerialize(tail[1], true).length
          : 0;
      let size = 0;
      return start

      /** @type {State} */
      function start(code) {
        const kind =
          self.containerState.type ||
          (code === 42 || code === 43 || code === 45
            ? 'listUnordered'
            : 'listOrdered');
        if (
          kind === 'listUnordered'
            ? !self.containerState.marker || code === self.containerState.marker
            : asciiDigit(code)
        ) {
          if (!self.containerState.type) {
            self.containerState.type = kind;
            effects.enter(kind, {
              _container: true
            });
          }
          if (kind === 'listUnordered') {
            effects.enter('listItemPrefix');
            return code === 42 || code === 45
              ? effects.check(thematicBreak$1, nok, atMarker)(code)
              : atMarker(code)
          }
          if (!self.interrupt || code === 49) {
            effects.enter('listItemPrefix');
            effects.enter('listItemValue');
            return inside(code)
          }
        }
        return nok(code)
      }

      /** @type {State} */
      function inside(code) {
        if (asciiDigit(code) && ++size < 10) {
          effects.consume(code);
          return inside
        }
        if (
          (!self.interrupt || size < 2) &&
          (self.containerState.marker
            ? code === self.containerState.marker
            : code === 41 || code === 46)
        ) {
          effects.exit('listItemValue');
          return atMarker(code)
        }
        return nok(code)
      }

      /**
       * @type {State}
       **/
      function atMarker(code) {
        effects.enter('listItemMarker');
        effects.consume(code);
        effects.exit('listItemMarker');
        self.containerState.marker = self.containerState.marker || code;
        return effects.check(
          blankLine,
          // Can’t be empty when interrupting.
          self.interrupt ? nok : onBlank,
          effects.attempt(
            listItemPrefixWhitespaceConstruct,
            endOfPrefix,
            otherPrefix
          )
        )
      }

      /** @type {State} */
      function onBlank(code) {
        self.containerState.initialBlankLine = true;
        initialSize++;
        return endOfPrefix(code)
      }

      /** @type {State} */
      function otherPrefix(code) {
        if (markdownSpace(code)) {
          effects.enter('listItemPrefixWhitespace');
          effects.consume(code);
          effects.exit('listItemPrefixWhitespace');
          return endOfPrefix
        }
        return nok(code)
      }

      /** @type {State} */
      function endOfPrefix(code) {
        self.containerState.size =
          initialSize +
          self.sliceSerialize(effects.exit('listItemPrefix'), true).length;
        return ok(code)
      }
    }

    /**
     * @type {Tokenizer}
     * @this {TokenizeContext}
     */
    function tokenizeListContinuation(effects, ok, nok) {
      const self = this;
      self.containerState._closeFlow = undefined;
      return effects.check(blankLine, onBlank, notBlank)

      /** @type {State} */
      function onBlank(code) {
        self.containerState.furtherBlankLines =
          self.containerState.furtherBlankLines ||
          self.containerState.initialBlankLine;

        // We have a blank line.
        // Still, try to consume at most the items size.
        return factorySpace(
          effects,
          ok,
          'listItemIndent',
          self.containerState.size + 1
        )(code)
      }

      /** @type {State} */
      function notBlank(code) {
        if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
          self.containerState.furtherBlankLines = undefined;
          self.containerState.initialBlankLine = undefined;
          return notInCurrentItem(code)
        }
        self.containerState.furtherBlankLines = undefined;
        self.containerState.initialBlankLine = undefined;
        return effects.attempt(indentConstruct, ok, notInCurrentItem)(code)
      }

      /** @type {State} */
      function notInCurrentItem(code) {
        // While we do continue, we signal that the flow should be closed.
        self.containerState._closeFlow = true;
        // As we’re closing flow, we’re no longer interrupting.
        self.interrupt = undefined;
        // Always populated by defaults.

        return factorySpace(
          effects,
          effects.attempt(list$1, ok, nok),
          'linePrefix',
          self.parser.constructs.disable.null.includes('codeIndented')
            ? undefined
            : 4
        )(code)
      }
    }

    /**
     * @type {Tokenizer}
     * @this {TokenizeContext}
     */
    function tokenizeIndent$1(effects, ok, nok) {
      const self = this;
      return factorySpace(
        effects,
        afterPrefix,
        'listItemIndent',
        self.containerState.size + 1
      )

      /** @type {State} */
      function afterPrefix(code) {
        const tail = self.events[self.events.length - 1];
        return tail &&
          tail[1].type === 'listItemIndent' &&
          tail[2].sliceSerialize(tail[1], true).length === self.containerState.size
          ? ok(code)
          : nok(code)
      }
    }

    /**
     * @type {Exiter}
     * @this {TokenizeContext}
     */
    function tokenizeListEnd(effects) {
      effects.exit(this.containerState.type);
    }

    /**
     * @type {Tokenizer}
     * @this {TokenizeContext}
     */
    function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
      const self = this;

      // Always populated by defaults.

      return factorySpace(
        effects,
        afterPrefix,
        'listItemPrefixWhitespace',
        self.parser.constructs.disable.null.includes('codeIndented')
          ? undefined
          : 4 + 1
      )

      /** @type {State} */
      function afterPrefix(code) {
        const tail = self.events[self.events.length - 1];
        return !markdownSpace(code) &&
          tail &&
          tail[1].type === 'listItemPrefixWhitespace'
          ? ok(code)
          : nok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    /** @type {Construct} */
    const setextUnderline = {
      name: 'setextUnderline',
      tokenize: tokenizeSetextUnderline,
      resolveTo: resolveToSetextUnderline
    };

    /** @type {Resolver} */
    function resolveToSetextUnderline(events, context) {
      // To do: resolve like `markdown-rs`.
      let index = events.length;
      /** @type {number | undefined} */
      let content;
      /** @type {number | undefined} */
      let text;
      /** @type {number | undefined} */
      let definition;

      // Find the opening of the content.
      // It’ll always exist: we don’t tokenize if it isn’t there.
      while (index--) {
        if (events[index][0] === 'enter') {
          if (events[index][1].type === 'content') {
            content = index;
            break
          }
          if (events[index][1].type === 'paragraph') {
            text = index;
          }
        }
        // Exit
        else {
          if (events[index][1].type === 'content') {
            // Remove the content end (if needed we’ll add it later)
            events.splice(index, 1);
          }
          if (!definition && events[index][1].type === 'definition') {
            definition = index;
          }
        }
      }
      const heading = {
        type: 'setextHeading',
        start: Object.assign({}, events[text][1].start),
        end: Object.assign({}, events[events.length - 1][1].end)
      };

      // Change the paragraph to setext heading text.
      events[text][1].type = 'setextHeadingText';

      // If we have definitions in the content, we’ll keep on having content,
      // but we need move it.
      if (definition) {
        events.splice(text, 0, ['enter', heading, context]);
        events.splice(definition + 1, 0, ['exit', events[content][1], context]);
        events[content][1].end = Object.assign({}, events[definition][1].end);
      } else {
        events[content][1] = heading;
      }

      // Add the heading exit at the end.
      events.push(['exit', heading, context]);
      return events
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeSetextUnderline(effects, ok, nok) {
      const self = this;
      /** @type {NonNullable<Code>} */
      let marker;
      return start

      /**
       * At start of heading (setext) underline.
       *
       * ```markdown
       *   | aa
       * > | ==
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        let index = self.events.length;
        /** @type {boolean | undefined} */
        let paragraph;
        // Find an opening.
        while (index--) {
          // Skip enter/exit of line ending, line prefix, and content.
          // We can now either have a definition or a paragraph.
          if (
            self.events[index][1].type !== 'lineEnding' &&
            self.events[index][1].type !== 'linePrefix' &&
            self.events[index][1].type !== 'content'
          ) {
            paragraph = self.events[index][1].type === 'paragraph';
            break
          }
        }

        // To do: handle lazy/pierce like `markdown-rs`.
        // To do: parse indent like `markdown-rs`.
        if (!self.parser.lazy[self.now().line] && (self.interrupt || paragraph)) {
          effects.enter('setextHeadingLine');
          marker = code;
          return before(code)
        }
        return nok(code)
      }

      /**
       * After optional whitespace, at `-` or `=`.
       *
       * ```markdown
       *   | aa
       * > | ==
       *     ^
       * ```
       *
       * @type {State}
       */
      function before(code) {
        effects.enter('setextHeadingLineSequence');
        return inside(code)
      }

      /**
       * In sequence.
       *
       * ```markdown
       *   | aa
       * > | ==
       *     ^
       * ```
       *
       * @type {State}
       */
      function inside(code) {
        if (code === marker) {
          effects.consume(code);
          return inside
        }
        effects.exit('setextHeadingLineSequence');
        return markdownSpace(code)
          ? factorySpace(effects, after, 'lineSuffix')(code)
          : after(code)
      }

      /**
       * After sequence, after optional whitespace.
       *
       * ```markdown
       *   | aa
       * > | ==
       *       ^
       * ```
       *
       * @type {State}
       */
      function after(code) {
        if (code === null || markdownLineEnding(code)) {
          effects.exit('setextHeadingLine');
          return ok(code)
        }
        return nok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
     * @typedef {import('micromark-util-types').Initializer} Initializer
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     */
    /** @type {InitialConstruct} */
    const flow$1 = {
      tokenize: initializeFlow
    };

    /**
     * @this {TokenizeContext}
     * @type {Initializer}
     */
    function initializeFlow(effects) {
      const self = this;
      const initial = effects.attempt(
        // Try to parse a blank line.
        blankLine,
        atBlankEnding,
        // Try to parse initial flow (essentially, only code).
        effects.attempt(
          this.parser.constructs.flowInitial,
          afterConstruct,
          factorySpace(
            effects,
            effects.attempt(
              this.parser.constructs.flow,
              afterConstruct,
              effects.attempt(content, afterConstruct)
            ),
            'linePrefix'
          )
        )
      );
      return initial

      /** @type {State} */
      function atBlankEnding(code) {
        if (code === null) {
          effects.consume(code);
          return
        }
        effects.enter('lineEndingBlank');
        effects.consume(code);
        effects.exit('lineEndingBlank');
        self.currentConstruct = undefined;
        return initial
      }

      /** @type {State} */
      function afterConstruct(code) {
        if (code === null) {
          effects.consume(code);
          return
        }
        effects.enter('lineEnding');
        effects.consume(code);
        effects.exit('lineEnding');
        self.currentConstruct = undefined;
        return initial
      }
    }

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
     * @typedef {import('micromark-util-types').Initializer} Initializer
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     */

    const resolver = {
      resolveAll: createResolver()
    };
    const string$1 = initializeFactory('string');
    const text$3 = initializeFactory('text');

    /**
     * @param {'string' | 'text'} field
     * @returns {InitialConstruct}
     */
    function initializeFactory(field) {
      return {
        tokenize: initializeText,
        resolveAll: createResolver(
          field === 'text' ? resolveAllLineSuffixes : undefined
        )
      }

      /**
       * @this {TokenizeContext}
       * @type {Initializer}
       */
      function initializeText(effects) {
        const self = this;
        const constructs = this.parser.constructs[field];
        const text = effects.attempt(constructs, start, notText);
        return start

        /** @type {State} */
        function start(code) {
          return atBreak(code) ? text(code) : notText(code)
        }

        /** @type {State} */
        function notText(code) {
          if (code === null) {
            effects.consume(code);
            return
          }
          effects.enter('data');
          effects.consume(code);
          return data
        }

        /** @type {State} */
        function data(code) {
          if (atBreak(code)) {
            effects.exit('data');
            return text(code)
          }

          // Data.
          effects.consume(code);
          return data
        }

        /**
         * @param {Code} code
         * @returns {boolean}
         */
        function atBreak(code) {
          if (code === null) {
            return true
          }
          const list = constructs[code];
          let index = -1;
          if (list) {
            // Always populated by defaults.

            while (++index < list.length) {
              const item = list[index];
              if (!item.previous || item.previous.call(self, self.previous)) {
                return true
              }
            }
          }
          return false
        }
      }
    }

    /**
     * @param {Resolver | undefined} [extraResolver]
     * @returns {Resolver}
     */
    function createResolver(extraResolver) {
      return resolveAllText

      /** @type {Resolver} */
      function resolveAllText(events, context) {
        let index = -1;
        /** @type {number | undefined} */
        let enter;

        // A rather boring computation (to merge adjacent `data` events) which
        // improves mm performance by 29%.
        while (++index <= events.length) {
          if (enter === undefined) {
            if (events[index] && events[index][1].type === 'data') {
              enter = index;
              index++;
            }
          } else if (!events[index] || events[index][1].type !== 'data') {
            // Don’t do anything if there is one data token.
            if (index !== enter + 2) {
              events[enter][1].end = events[index - 1][1].end;
              events.splice(enter + 2, index - enter - 2);
              index = enter + 2;
            }
            enter = undefined;
          }
        }
        return extraResolver ? extraResolver(events, context) : events
      }
    }

    /**
     * A rather ugly set of instructions which again looks at chunks in the input
     * stream.
     * The reason to do this here is that it is *much* faster to parse in reverse.
     * And that we can’t hook into `null` to split the line suffix before an EOF.
     * To do: figure out if we can make this into a clean utility, or even in core.
     * As it will be useful for GFMs literal autolink extension (and maybe even
     * tables?)
     *
     * @type {Resolver}
     */
    function resolveAllLineSuffixes(events, context) {
      let eventIndex = 0; // Skip first.

      while (++eventIndex <= events.length) {
        if (
          (eventIndex === events.length ||
            events[eventIndex][1].type === 'lineEnding') &&
          events[eventIndex - 1][1].type === 'data'
        ) {
          const data = events[eventIndex - 1][1];
          const chunks = context.sliceStream(data);
          let index = chunks.length;
          let bufferIndex = -1;
          let size = 0;
          /** @type {boolean | undefined} */
          let tabs;
          while (index--) {
            const chunk = chunks[index];
            if (typeof chunk === 'string') {
              bufferIndex = chunk.length;
              while (chunk.charCodeAt(bufferIndex - 1) === 32) {
                size++;
                bufferIndex--;
              }
              if (bufferIndex) break
              bufferIndex = -1;
            }
            // Number
            else if (chunk === -2) {
              tabs = true;
              size++;
            } else if (chunk === -1) ; else {
              // Replacement character, exit.
              index++;
              break
            }
          }
          if (size) {
            const token = {
              type:
                eventIndex === events.length || tabs || size < 2
                  ? 'lineSuffix'
                  : 'hardBreakTrailing',
              start: {
                line: data.end.line,
                column: data.end.column - size,
                offset: data.end.offset - size,
                _index: data.start._index + index,
                _bufferIndex: index
                  ? bufferIndex
                  : data.start._bufferIndex + bufferIndex
              },
              end: Object.assign({}, data.end)
            };
            data.end = Object.assign({}, token.start);
            if (data.start.offset === data.end.offset) {
              Object.assign(data, token);
            } else {
              events.splice(
                eventIndex,
                0,
                ['enter', token, context],
                ['exit', token, context]
              );
              eventIndex += 2;
            }
          }
          eventIndex++;
        }
      }
      return events
    }

    /**
     * @typedef {import('micromark-util-types').Chunk} Chunk
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Construct} Construct
     * @typedef {import('micromark-util-types').ConstructRecord} ConstructRecord
     * @typedef {import('micromark-util-types').Effects} Effects
     * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
     * @typedef {import('micromark-util-types').ParseContext} ParseContext
     * @typedef {import('micromark-util-types').Point} Point
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenType} TokenType
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     */
    /**
     * Create a tokenizer.
     * Tokenizers deal with one type of data (e.g., containers, flow, text).
     * The parser is the object dealing with it all.
     * `initialize` works like other constructs, except that only its `tokenize`
     * function is used, in which case it doesn’t receive an `ok` or `nok`.
     * `from` can be given to set the point before the first character, although
     * when further lines are indented, they must be set with `defineSkip`.
     *
     * @param {ParseContext} parser
     * @param {InitialConstruct} initialize
     * @param {Omit<Point, '_bufferIndex' | '_index'> | undefined} [from]
     * @returns {TokenizeContext}
     */
    function createTokenizer(parser, initialize, from) {
      /** @type {Point} */
      let point = Object.assign(
        from
          ? Object.assign({}, from)
          : {
              line: 1,
              column: 1,
              offset: 0
            },
        {
          _index: 0,
          _bufferIndex: -1
        }
      );
      /** @type {Record<string, number>} */
      const columnStart = {};
      /** @type {Array<Construct>} */
      const resolveAllConstructs = [];
      /** @type {Array<Chunk>} */
      let chunks = [];
      /** @type {Array<Token>} */
      let stack = [];

      /**
       * Tools used for tokenizing.
       *
       * @type {Effects}
       */
      const effects = {
        consume,
        enter,
        exit,
        attempt: constructFactory(onsuccessfulconstruct),
        check: constructFactory(onsuccessfulcheck),
        interrupt: constructFactory(onsuccessfulcheck, {
          interrupt: true
        })
      };

      /**
       * State and tools for resolving and serializing.
       *
       * @type {TokenizeContext}
       */
      const context = {
        previous: null,
        code: null,
        containerState: {},
        events: [],
        parser,
        sliceStream,
        sliceSerialize,
        now,
        defineSkip,
        write
      };

      /**
       * The state function.
       *
       * @type {State | void}
       */
      let state = initialize.tokenize.call(context, effects);
      if (initialize.resolveAll) {
        resolveAllConstructs.push(initialize);
      }
      return context

      /** @type {TokenizeContext['write']} */
      function write(slice) {
        chunks = push(chunks, slice);
        main();

        // Exit if we’re not done, resolve might change stuff.
        if (chunks[chunks.length - 1] !== null) {
          return []
        }
        addResult(initialize, 0);

        // Otherwise, resolve, and exit.
        context.events = resolveAll(resolveAllConstructs, context.events, context);
        return context.events
      }

      //
      // Tools.
      //

      /** @type {TokenizeContext['sliceSerialize']} */
      function sliceSerialize(token, expandTabs) {
        return serializeChunks(sliceStream(token), expandTabs)
      }

      /** @type {TokenizeContext['sliceStream']} */
      function sliceStream(token) {
        return sliceChunks(chunks, token)
      }

      /** @type {TokenizeContext['now']} */
      function now() {
        // This is a hot path, so we clone manually instead of `Object.assign({}, point)`
        const {line, column, offset, _index, _bufferIndex} = point;
        return {
          line,
          column,
          offset,
          _index,
          _bufferIndex
        }
      }

      /** @type {TokenizeContext['defineSkip']} */
      function defineSkip(value) {
        columnStart[value.line] = value.column;
        accountForPotentialSkip();
      }

      //
      // State management.
      //

      /**
       * Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
       * `consume`).
       * Here is where we walk through the chunks, which either include strings of
       * several characters, or numerical character codes.
       * The reason to do this in a loop instead of a call is so the stack can
       * drain.
       *
       * @returns {void}
       */
      function main() {
        /** @type {number} */
        let chunkIndex;
        while (point._index < chunks.length) {
          const chunk = chunks[point._index];

          // If we’re in a buffer chunk, loop through it.
          if (typeof chunk === 'string') {
            chunkIndex = point._index;
            if (point._bufferIndex < 0) {
              point._bufferIndex = 0;
            }
            while (
              point._index === chunkIndex &&
              point._bufferIndex < chunk.length
            ) {
              go(chunk.charCodeAt(point._bufferIndex));
            }
          } else {
            go(chunk);
          }
        }
      }

      /**
       * Deal with one code.
       *
       * @param {Code} code
       * @returns {void}
       */
      function go(code) {
        state = state(code);
      }

      /** @type {Effects['consume']} */
      function consume(code) {
        if (markdownLineEnding(code)) {
          point.line++;
          point.column = 1;
          point.offset += code === -3 ? 2 : 1;
          accountForPotentialSkip();
        } else if (code !== -1) {
          point.column++;
          point.offset++;
        }

        // Not in a string chunk.
        if (point._bufferIndex < 0) {
          point._index++;
        } else {
          point._bufferIndex++;

          // At end of string chunk.
          // @ts-expect-error Points w/ non-negative `_bufferIndex` reference
          // strings.
          if (point._bufferIndex === chunks[point._index].length) {
            point._bufferIndex = -1;
            point._index++;
          }
        }

        // Expose the previous character.
        context.previous = code;
      }

      /** @type {Effects['enter']} */
      function enter(type, fields) {
        /** @type {Token} */
        // @ts-expect-error Patch instead of assign required fields to help GC.
        const token = fields || {};
        token.type = type;
        token.start = now();
        context.events.push(['enter', token, context]);
        stack.push(token);
        return token
      }

      /** @type {Effects['exit']} */
      function exit(type) {
        const token = stack.pop();
        token.end = now();
        context.events.push(['exit', token, context]);
        return token
      }

      /**
       * Use results.
       *
       * @type {ReturnHandle}
       */
      function onsuccessfulconstruct(construct, info) {
        addResult(construct, info.from);
      }

      /**
       * Discard results.
       *
       * @type {ReturnHandle}
       */
      function onsuccessfulcheck(_, info) {
        info.restore();
      }

      /**
       * Factory to attempt/check/interrupt.
       *
       * @param {ReturnHandle} onreturn
       * @param {{interrupt?: boolean | undefined} | undefined} [fields]
       */
      function constructFactory(onreturn, fields) {
        return hook

        /**
         * Handle either an object mapping codes to constructs, a list of
         * constructs, or a single construct.
         *
         * @param {Array<Construct> | Construct | ConstructRecord} constructs
         * @param {State} returnState
         * @param {State | undefined} [bogusState]
         * @returns {State}
         */
        function hook(constructs, returnState, bogusState) {
          /** @type {Array<Construct>} */
          let listOfConstructs;
          /** @type {number} */
          let constructIndex;
          /** @type {Construct} */
          let currentConstruct;
          /** @type {Info} */
          let info;
          return Array.isArray(constructs) /* c8 ignore next 1 */
            ? handleListOfConstructs(constructs)
            : 'tokenize' in constructs
            ? // @ts-expect-error Looks like a construct.
              handleListOfConstructs([constructs])
            : handleMapOfConstructs(constructs)

          /**
           * Handle a list of construct.
           *
           * @param {ConstructRecord} map
           * @returns {State}
           */
          function handleMapOfConstructs(map) {
            return start

            /** @type {State} */
            function start(code) {
              const def = code !== null && map[code];
              const all = code !== null && map.null;
              const list = [
                // To do: add more extension tests.
                /* c8 ignore next 2 */
                ...(Array.isArray(def) ? def : def ? [def] : []),
                ...(Array.isArray(all) ? all : all ? [all] : [])
              ];
              return handleListOfConstructs(list)(code)
            }
          }

          /**
           * Handle a list of construct.
           *
           * @param {Array<Construct>} list
           * @returns {State}
           */
          function handleListOfConstructs(list) {
            listOfConstructs = list;
            constructIndex = 0;
            if (list.length === 0) {
              return bogusState
            }
            return handleConstruct(list[constructIndex])
          }

          /**
           * Handle a single construct.
           *
           * @param {Construct} construct
           * @returns {State}
           */
          function handleConstruct(construct) {
            return start

            /** @type {State} */
            function start(code) {
              // To do: not needed to store if there is no bogus state, probably?
              // Currently doesn’t work because `inspect` in document does a check
              // w/o a bogus, which doesn’t make sense. But it does seem to help perf
              // by not storing.
              info = store();
              currentConstruct = construct;
              if (!construct.partial) {
                context.currentConstruct = construct;
              }

              // Always populated by defaults.

              if (
                construct.name &&
                context.parser.constructs.disable.null.includes(construct.name)
              ) {
                return nok()
              }
              return construct.tokenize.call(
                // If we do have fields, create an object w/ `context` as its
                // prototype.
                // This allows a “live binding”, which is needed for `interrupt`.
                fields ? Object.assign(Object.create(context), fields) : context,
                effects,
                ok,
                nok
              )(code)
            }
          }

          /** @type {State} */
          function ok(code) {
            onreturn(currentConstruct, info);
            return returnState
          }

          /** @type {State} */
          function nok(code) {
            info.restore();
            if (++constructIndex < listOfConstructs.length) {
              return handleConstruct(listOfConstructs[constructIndex])
            }
            return bogusState
          }
        }
      }

      /**
       * @param {Construct} construct
       * @param {number} from
       * @returns {void}
       */
      function addResult(construct, from) {
        if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
          resolveAllConstructs.push(construct);
        }
        if (construct.resolve) {
          splice(
            context.events,
            from,
            context.events.length - from,
            construct.resolve(context.events.slice(from), context)
          );
        }
        if (construct.resolveTo) {
          context.events = construct.resolveTo(context.events, context);
        }
      }

      /**
       * Store state.
       *
       * @returns {Info}
       */
      function store() {
        const startPoint = now();
        const startPrevious = context.previous;
        const startCurrentConstruct = context.currentConstruct;
        const startEventsIndex = context.events.length;
        const startStack = Array.from(stack);
        return {
          restore,
          from: startEventsIndex
        }

        /**
         * Restore state.
         *
         * @returns {void}
         */
        function restore() {
          point = startPoint;
          context.previous = startPrevious;
          context.currentConstruct = startCurrentConstruct;
          context.events.length = startEventsIndex;
          stack = startStack;
          accountForPotentialSkip();
        }
      }

      /**
       * Move the current point a bit forward in the line when it’s on a column
       * skip.
       *
       * @returns {void}
       */
      function accountForPotentialSkip() {
        if (point.line in columnStart && point.column < 2) {
          point.column = columnStart[point.line];
          point.offset += columnStart[point.line] - 1;
        }
      }
    }

    /**
     * Get the chunks from a slice of chunks in the range of a token.
     *
     * @param {Array<Chunk>} chunks
     * @param {Pick<Token, 'end' | 'start'>} token
     * @returns {Array<Chunk>}
     */
    function sliceChunks(chunks, token) {
      const startIndex = token.start._index;
      const startBufferIndex = token.start._bufferIndex;
      const endIndex = token.end._index;
      const endBufferIndex = token.end._bufferIndex;
      /** @type {Array<Chunk>} */
      let view;
      if (startIndex === endIndex) {
        // @ts-expect-error `_bufferIndex` is used on string chunks.
        view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
      } else {
        view = chunks.slice(startIndex, endIndex);
        if (startBufferIndex > -1) {
          const head = view[0];
          if (typeof head === 'string') {
            view[0] = head.slice(startBufferIndex);
          } else {
            view.shift();
          }
        }
        if (endBufferIndex > 0) {
          // @ts-expect-error `_bufferIndex` is used on string chunks.
          view.push(chunks[endIndex].slice(0, endBufferIndex));
        }
      }
      return view
    }

    /**
     * Get the string value of a slice of chunks.
     *
     * @param {Array<Chunk>} chunks
     * @param {boolean | undefined} [expandTabs=false]
     * @returns {string}
     */
    function serializeChunks(chunks, expandTabs) {
      let index = -1;
      /** @type {Array<string>} */
      const result = [];
      /** @type {boolean | undefined} */
      let atTab;
      while (++index < chunks.length) {
        const chunk = chunks[index];
        /** @type {string} */
        let value;
        if (typeof chunk === 'string') {
          value = chunk;
        } else
          switch (chunk) {
            case -5: {
              value = '\r';
              break
            }
            case -4: {
              value = '\n';
              break
            }
            case -3: {
              value = '\r' + '\n';
              break
            }
            case -2: {
              value = expandTabs ? ' ' : '\t';
              break
            }
            case -1: {
              if (!expandTabs && atTab) continue
              value = ' ';
              break
            }
            default: {
              // Currently only replacement character.
              value = String.fromCharCode(chunk);
            }
          }
        atTab = chunk === -2;
        result.push(value);
      }
      return result.join('')
    }

    /**
     * @typedef {import('micromark-util-types').Extension} Extension
     */

    /** @satisfies {Extension['document']} */
    const document$1 = {
      [42]: list$1,
      [43]: list$1,
      [45]: list$1,
      [48]: list$1,
      [49]: list$1,
      [50]: list$1,
      [51]: list$1,
      [52]: list$1,
      [53]: list$1,
      [54]: list$1,
      [55]: list$1,
      [56]: list$1,
      [57]: list$1,
      [62]: blockQuote
    };

    /** @satisfies {Extension['contentInitial']} */
    const contentInitial = {
      [91]: definition
    };

    /** @satisfies {Extension['flowInitial']} */
    const flowInitial = {
      [-2]: codeIndented,
      [-1]: codeIndented,
      [32]: codeIndented
    };

    /** @satisfies {Extension['flow']} */
    const flow = {
      [35]: headingAtx,
      [42]: thematicBreak$1,
      [45]: [setextUnderline, thematicBreak$1],
      [60]: htmlFlow,
      [61]: setextUnderline,
      [95]: thematicBreak$1,
      [96]: codeFenced,
      [126]: codeFenced
    };

    /** @satisfies {Extension['string']} */
    const string = {
      [38]: characterReference,
      [92]: characterEscape
    };

    /** @satisfies {Extension['text']} */
    const text$2 = {
      [-5]: lineEnding,
      [-4]: lineEnding,
      [-3]: lineEnding,
      [33]: labelStartImage,
      [38]: characterReference,
      [42]: attention,
      [60]: [autolink, htmlText],
      [91]: labelStartLink,
      [92]: [hardBreakEscape, characterEscape],
      [93]: labelEnd,
      [95]: attention,
      [96]: codeText
    };

    /** @satisfies {Extension['insideSpan']} */
    const insideSpan = {
      null: [attention, resolver]
    };

    /** @satisfies {Extension['attentionMarkers']} */
    const attentionMarkers = {
      null: [42, 95]
    };

    /** @satisfies {Extension['disable']} */
    const disable = {
      null: []
    };

    var defaultConstructs = /*#__PURE__*/Object.freeze({
        __proto__: null,
        document: document$1,
        contentInitial: contentInitial,
        flowInitial: flowInitial,
        flow: flow,
        string: string,
        text: text$2,
        insideSpan: insideSpan,
        attentionMarkers: attentionMarkers,
        disable: disable
    });

    /**
     * @typedef {import('micromark-util-types').Create} Create
     * @typedef {import('micromark-util-types').FullNormalizedExtension} FullNormalizedExtension
     * @typedef {import('micromark-util-types').InitialConstruct} InitialConstruct
     * @typedef {import('micromark-util-types').ParseContext} ParseContext
     * @typedef {import('micromark-util-types').ParseOptions} ParseOptions
     */

    /**
     * @param {ParseOptions | null | undefined} [options]
     * @returns {ParseContext}
     */
    function parse$1(options) {
      const settings = options || {};
      const constructs =
        /** @type {FullNormalizedExtension} */
        combineExtensions([defaultConstructs, ...(settings.extensions || [])]);

      /** @type {ParseContext} */
      const parser = {
        defined: [],
        lazy: {},
        constructs,
        content: create(content$1),
        document: create(document$2),
        flow: create(flow$1),
        string: create(string$1),
        text: create(text$3)
      };
      return parser

      /**
       * @param {InitialConstruct} initial
       */
      function create(initial) {
        return creator
        /** @type {Create} */
        function creator(from) {
          return createTokenizer(parser, initial, from)
        }
      }
    }

    /**
     * @typedef {import('micromark-util-types').Chunk} Chunk
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').Encoding} Encoding
     * @typedef {import('micromark-util-types').Value} Value
     */

    /**
     * @callback Preprocessor
     * @param {Value} value
     * @param {Encoding | null | undefined} [encoding]
     * @param {boolean | null | undefined} [end=false]
     * @returns {Array<Chunk>}
     */

    const search = /[\0\t\n\r]/g;

    /**
     * @returns {Preprocessor}
     */
    function preprocess() {
      let column = 1;
      let buffer = '';
      /** @type {boolean | undefined} */
      let start = true;
      /** @type {boolean | undefined} */
      let atCarriageReturn;
      return preprocessor

      /** @type {Preprocessor} */
      function preprocessor(value, encoding, end) {
        /** @type {Array<Chunk>} */
        const chunks = [];
        /** @type {RegExpMatchArray | null} */
        let match;
        /** @type {number} */
        let next;
        /** @type {number} */
        let startPosition;
        /** @type {number} */
        let endPosition;
        /** @type {Code} */
        let code;

        // @ts-expect-error `Buffer` does allow an encoding.
        value = buffer + value.toString(encoding);
        startPosition = 0;
        buffer = '';
        if (start) {
          // To do: `markdown-rs` actually parses BOMs (byte order mark).
          if (value.charCodeAt(0) === 65279) {
            startPosition++;
          }
          start = undefined;
        }
        while (startPosition < value.length) {
          search.lastIndex = startPosition;
          match = search.exec(value);
          endPosition =
            match && match.index !== undefined ? match.index : value.length;
          code = value.charCodeAt(endPosition);
          if (!match) {
            buffer = value.slice(startPosition);
            break
          }
          if (code === 10 && startPosition === endPosition && atCarriageReturn) {
            chunks.push(-3);
            atCarriageReturn = undefined;
          } else {
            if (atCarriageReturn) {
              chunks.push(-5);
              atCarriageReturn = undefined;
            }
            if (startPosition < endPosition) {
              chunks.push(value.slice(startPosition, endPosition));
              column += endPosition - startPosition;
            }
            switch (code) {
              case 0: {
                chunks.push(65533);
                column++;
                break
              }
              case 9: {
                next = Math.ceil(column / 4) * 4;
                chunks.push(-2);
                while (column++ < next) chunks.push(-1);
                break
              }
              case 10: {
                chunks.push(-4);
                column = 1;
                break
              }
              default: {
                atCarriageReturn = true;
                column = 1;
              }
            }
          }
          startPosition = endPosition + 1;
        }
        if (end) {
          if (atCarriageReturn) chunks.push(-5);
          if (buffer) chunks.push(buffer);
          chunks.push(null);
        }
        return chunks
      }
    }

    /**
     * @typedef {import('micromark-util-types').Event} Event
     */

    /**
     * @param {Array<Event>} events
     * @returns {Array<Event>}
     */
    function postprocess(events) {
      while (!subtokenize(events)) {
        // Empty
      }
      return events
    }

    /**
     * Turn the number (in string form as either hexa- or plain decimal) coming from
     * a numeric character reference into a character.
     *
     * Sort of like `String.fromCharCode(Number.parseInt(value, base))`, but makes
     * non-characters and control characters safe.
     *
     * @param {string} value
     *   Value to decode.
     * @param {number} base
     *   Numeric base.
     * @returns {string}
     *   Character.
     */
    function decodeNumericCharacterReference(value, base) {
      const code = Number.parseInt(value, base);
      if (
        // C0 except for HT, LF, FF, CR, space.
        code < 9 ||
        code === 11 ||
        (code > 13 && code < 32) ||
        // Control character (DEL) of C0, and C1 controls.
        (code > 126 && code < 160) ||
        // Lone high surrogates and low surrogates.
        (code > 55295 && code < 57344) ||
        // Noncharacters.
        (code > 64975 && code < 65008) /* eslint-disable no-bitwise */ ||
        (code & 65535) === 65535 ||
        (code & 65535) === 65534 /* eslint-enable no-bitwise */ ||
        // Out of range
        code > 1114111
      ) {
        return '\uFFFD'
      }
      return String.fromCharCode(code)
    }

    const characterEscapeOrReference =
      /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;

    /**
     * Decode markdown strings (which occur in places such as fenced code info
     * strings, destinations, labels, and titles).
     *
     * The “string” content type allows character escapes and -references.
     * This decodes those.
     *
     * @param {string} value
     *   Value to decode.
     * @returns {string}
     *   Decoded value.
     */
    function decodeString(value) {
      return value.replace(characterEscapeOrReference, decode)
    }

    /**
     * @param {string} $0
     * @param {string} $1
     * @param {string} $2
     * @returns {string}
     */
    function decode($0, $1, $2) {
      if ($1) {
        // Escape.
        return $1
      }

      // Reference.
      const head = $2.charCodeAt(0);
      if (head === 35) {
        const head = $2.charCodeAt(1);
        const hex = head === 120 || head === 88;
        return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10)
      }
      return decodeNamedCharacterReference($2) || $0
    }

    /**
     * @typedef {import('micromark-util-types').Encoding} Encoding
     * @typedef {import('micromark-util-types').Event} Event
     * @typedef {import('micromark-util-types').ParseOptions} ParseOptions
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Value} Value
     *
     * @typedef {import('unist').Parent} UnistParent
     * @typedef {import('unist').Point} Point
     *
     * @typedef {import('mdast').PhrasingContent} PhrasingContent
     * @typedef {import('mdast').StaticPhrasingContent} StaticPhrasingContent
     * @typedef {import('mdast').Content} Content
     * @typedef {import('mdast').Break} Break
     * @typedef {import('mdast').Blockquote} Blockquote
     * @typedef {import('mdast').Code} Code
     * @typedef {import('mdast').Definition} Definition
     * @typedef {import('mdast').Emphasis} Emphasis
     * @typedef {import('mdast').Heading} Heading
     * @typedef {import('mdast').HTML} HTML
     * @typedef {import('mdast').Image} Image
     * @typedef {import('mdast').ImageReference} ImageReference
     * @typedef {import('mdast').InlineCode} InlineCode
     * @typedef {import('mdast').Link} Link
     * @typedef {import('mdast').LinkReference} LinkReference
     * @typedef {import('mdast').List} List
     * @typedef {import('mdast').ListItem} ListItem
     * @typedef {import('mdast').Paragraph} Paragraph
     * @typedef {import('mdast').Root} Root
     * @typedef {import('mdast').Strong} Strong
     * @typedef {import('mdast').Text} Text
     * @typedef {import('mdast').ThematicBreak} ThematicBreak
     * @typedef {import('mdast').ReferenceType} ReferenceType
     * @typedef {import('../index.js').CompileData} CompileData
     */
    const own$6 = {}.hasOwnProperty;

    /**
     * @param value
     *   Markdown to parse.
     * @param encoding
     *   Character encoding for when `value` is `Buffer`.
     * @param options
     *   Configuration.
     * @returns
     *   mdast tree.
     */
    const fromMarkdown =
      /**
       * @type {(
       *   ((value: Value, encoding: Encoding, options?: Options | null | undefined) => Root) &
       *   ((value: Value, options?: Options | null | undefined) => Root)
       * )}
       */

      /**
       * @param {Value} value
       * @param {Encoding | Options | null | undefined} [encoding]
       * @param {Options | null | undefined} [options]
       * @returns {Root}
       */
      function (value, encoding, options) {
        if (typeof encoding !== 'string') {
          options = encoding;
          encoding = undefined;
        }
        return compiler(options)(
          postprocess(
            parse$1(options).document().write(preprocess()(value, encoding, true))
          )
        )
      };

    /**
     * Note this compiler only understand complete buffering, not streaming.
     *
     * @param {Options | null | undefined} [options]
     */
    function compiler(options) {
      /** @type {Config} */
      const config = {
        transforms: [],
        canContainEols: ['emphasis', 'fragment', 'heading', 'paragraph', 'strong'],
        enter: {
          autolink: opener(link),
          autolinkProtocol: onenterdata,
          autolinkEmail: onenterdata,
          atxHeading: opener(heading),
          blockQuote: opener(blockQuote),
          characterEscape: onenterdata,
          characterReference: onenterdata,
          codeFenced: opener(codeFlow),
          codeFencedFenceInfo: buffer,
          codeFencedFenceMeta: buffer,
          codeIndented: opener(codeFlow, buffer),
          codeText: opener(codeText, buffer),
          codeTextData: onenterdata,
          data: onenterdata,
          codeFlowValue: onenterdata,
          definition: opener(definition),
          definitionDestinationString: buffer,
          definitionLabelString: buffer,
          definitionTitleString: buffer,
          emphasis: opener(emphasis),
          hardBreakEscape: opener(hardBreak),
          hardBreakTrailing: opener(hardBreak),
          htmlFlow: opener(html, buffer),
          htmlFlowData: onenterdata,
          htmlText: opener(html, buffer),
          htmlTextData: onenterdata,
          image: opener(image),
          label: buffer,
          link: opener(link),
          listItem: opener(listItem),
          listItemValue: onenterlistitemvalue,
          listOrdered: opener(list, onenterlistordered),
          listUnordered: opener(list),
          paragraph: opener(paragraph),
          reference: onenterreference,
          referenceString: buffer,
          resourceDestinationString: buffer,
          resourceTitleString: buffer,
          setextHeading: opener(heading),
          strong: opener(strong),
          thematicBreak: opener(thematicBreak)
        },
        exit: {
          atxHeading: closer(),
          atxHeadingSequence: onexitatxheadingsequence,
          autolink: closer(),
          autolinkEmail: onexitautolinkemail,
          autolinkProtocol: onexitautolinkprotocol,
          blockQuote: closer(),
          characterEscapeValue: onexitdata,
          characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
          characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
          characterReferenceValue: onexitcharacterreferencevalue,
          codeFenced: closer(onexitcodefenced),
          codeFencedFence: onexitcodefencedfence,
          codeFencedFenceInfo: onexitcodefencedfenceinfo,
          codeFencedFenceMeta: onexitcodefencedfencemeta,
          codeFlowValue: onexitdata,
          codeIndented: closer(onexitcodeindented),
          codeText: closer(onexitcodetext),
          codeTextData: onexitdata,
          data: onexitdata,
          definition: closer(),
          definitionDestinationString: onexitdefinitiondestinationstring,
          definitionLabelString: onexitdefinitionlabelstring,
          definitionTitleString: onexitdefinitiontitlestring,
          emphasis: closer(),
          hardBreakEscape: closer(onexithardbreak),
          hardBreakTrailing: closer(onexithardbreak),
          htmlFlow: closer(onexithtmlflow),
          htmlFlowData: onexitdata,
          htmlText: closer(onexithtmltext),
          htmlTextData: onexitdata,
          image: closer(onexitimage),
          label: onexitlabel,
          labelText: onexitlabeltext,
          lineEnding: onexitlineending,
          link: closer(onexitlink),
          listItem: closer(),
          listOrdered: closer(),
          listUnordered: closer(),
          paragraph: closer(),
          referenceString: onexitreferencestring,
          resourceDestinationString: onexitresourcedestinationstring,
          resourceTitleString: onexitresourcetitlestring,
          resource: onexitresource,
          setextHeading: closer(onexitsetextheading),
          setextHeadingLineSequence: onexitsetextheadinglinesequence,
          setextHeadingText: onexitsetextheadingtext,
          strong: closer(),
          thematicBreak: closer()
        }
      };
      configure(config, (options || {}).mdastExtensions || []);

      /** @type {CompileData} */
      const data = {};
      return compile

      /**
       * Turn micromark events into an mdast tree.
       *
       * @param {Array<Event>} events
       *   Events.
       * @returns {Root}
       *   mdast tree.
       */
      function compile(events) {
        /** @type {Root} */
        let tree = {
          type: 'root',
          children: []
        };
        /** @type {Omit<CompileContext, 'sliceSerialize'>} */
        const context = {
          stack: [tree],
          tokenStack: [],
          config,
          enter,
          exit,
          buffer,
          resume,
          setData,
          getData
        };
        /** @type {Array<number>} */
        const listStack = [];
        let index = -1;
        while (++index < events.length) {
          // We preprocess lists to add `listItem` tokens, and to infer whether
          // items the list itself are spread out.
          if (
            events[index][1].type === 'listOrdered' ||
            events[index][1].type === 'listUnordered'
          ) {
            if (events[index][0] === 'enter') {
              listStack.push(index);
            } else {
              const tail = listStack.pop();
              index = prepareList(events, tail, index);
            }
          }
        }
        index = -1;
        while (++index < events.length) {
          const handler = config[events[index][0]];
          if (own$6.call(handler, events[index][1].type)) {
            handler[events[index][1].type].call(
              Object.assign(
                {
                  sliceSerialize: events[index][2].sliceSerialize
                },
                context
              ),
              events[index][1]
            );
          }
        }

        // Handle tokens still being open.
        if (context.tokenStack.length > 0) {
          const tail = context.tokenStack[context.tokenStack.length - 1];
          const handler = tail[1] || defaultOnError;
          handler.call(context, undefined, tail[0]);
        }

        // Figure out `root` position.
        tree.position = {
          start: point$1(
            events.length > 0
              ? events[0][1].start
              : {
                  line: 1,
                  column: 1,
                  offset: 0
                }
          ),
          end: point$1(
            events.length > 0
              ? events[events.length - 2][1].end
              : {
                  line: 1,
                  column: 1,
                  offset: 0
                }
          )
        };

        // Call transforms.
        index = -1;
        while (++index < config.transforms.length) {
          tree = config.transforms[index](tree) || tree;
        }
        return tree
      }

      /**
       * @param {Array<Event>} events
       * @param {number} start
       * @param {number} length
       * @returns {number}
       */
      function prepareList(events, start, length) {
        let index = start - 1;
        let containerBalance = -1;
        let listSpread = false;
        /** @type {Token | undefined} */
        let listItem;
        /** @type {number | undefined} */
        let lineIndex;
        /** @type {number | undefined} */
        let firstBlankLineIndex;
        /** @type {boolean | undefined} */
        let atMarker;
        while (++index <= length) {
          const event = events[index];
          if (
            event[1].type === 'listUnordered' ||
            event[1].type === 'listOrdered' ||
            event[1].type === 'blockQuote'
          ) {
            if (event[0] === 'enter') {
              containerBalance++;
            } else {
              containerBalance--;
            }
            atMarker = undefined;
          } else if (event[1].type === 'lineEndingBlank') {
            if (event[0] === 'enter') {
              if (
                listItem &&
                !atMarker &&
                !containerBalance &&
                !firstBlankLineIndex
              ) {
                firstBlankLineIndex = index;
              }
              atMarker = undefined;
            }
          } else if (
            event[1].type === 'linePrefix' ||
            event[1].type === 'listItemValue' ||
            event[1].type === 'listItemMarker' ||
            event[1].type === 'listItemPrefix' ||
            event[1].type === 'listItemPrefixWhitespace'
          ) ; else {
            atMarker = undefined;
          }
          if (
            (!containerBalance &&
              event[0] === 'enter' &&
              event[1].type === 'listItemPrefix') ||
            (containerBalance === -1 &&
              event[0] === 'exit' &&
              (event[1].type === 'listUnordered' ||
                event[1].type === 'listOrdered'))
          ) {
            if (listItem) {
              let tailIndex = index;
              lineIndex = undefined;
              while (tailIndex--) {
                const tailEvent = events[tailIndex];
                if (
                  tailEvent[1].type === 'lineEnding' ||
                  tailEvent[1].type === 'lineEndingBlank'
                ) {
                  if (tailEvent[0] === 'exit') continue
                  if (lineIndex) {
                    events[lineIndex][1].type = 'lineEndingBlank';
                    listSpread = true;
                  }
                  tailEvent[1].type = 'lineEnding';
                  lineIndex = tailIndex;
                } else if (
                  tailEvent[1].type === 'linePrefix' ||
                  tailEvent[1].type === 'blockQuotePrefix' ||
                  tailEvent[1].type === 'blockQuotePrefixWhitespace' ||
                  tailEvent[1].type === 'blockQuoteMarker' ||
                  tailEvent[1].type === 'listItemIndent'
                ) ; else {
                  break
                }
              }
              if (
                firstBlankLineIndex &&
                (!lineIndex || firstBlankLineIndex < lineIndex)
              ) {
                listItem._spread = true;
              }

              // Fix position.
              listItem.end = Object.assign(
                {},
                lineIndex ? events[lineIndex][1].start : event[1].end
              );
              events.splice(lineIndex || index, 0, ['exit', listItem, event[2]]);
              index++;
              length++;
            }

            // Create a new list item.
            if (event[1].type === 'listItemPrefix') {
              listItem = {
                type: 'listItem',
                _spread: false,
                start: Object.assign({}, event[1].start),
                // @ts-expect-error: we’ll add `end` in a second.
                end: undefined
              };
              // @ts-expect-error: `listItem` is most definitely defined, TS...
              events.splice(index, 0, ['enter', listItem, event[2]]);
              index++;
              length++;
              firstBlankLineIndex = undefined;
              atMarker = true;
            }
          }
        }
        events[start][1]._spread = listSpread;
        return length
      }

      /**
       * Set data.
       *
       * @template {keyof CompileData} Key
       *   Field type.
       * @param {Key} key
       *   Key of field.
       * @param {CompileData[Key]} [value]
       *   New value.
       * @returns {void}
       *   Nothing.
       */
      function setData(key, value) {
        data[key] = value;
      }

      /**
       * Get data.
       *
       * @template {keyof CompileData} Key
       *   Field type.
       * @param {Key} key
       *   Key of field.
       * @returns {CompileData[Key]}
       *   Value.
       */
      function getData(key) {
        return data[key]
      }

      /**
       * Create an opener handle.
       *
       * @param {(token: Token) => Node} create
       *   Create a node.
       * @param {Handle} [and]
       *   Optional function to also run.
       * @returns {Handle}
       *   Handle.
       */
      function opener(create, and) {
        return open

        /**
         * @this {CompileContext}
         * @param {Token} token
         * @returns {void}
         */
        function open(token) {
          enter.call(this, create(token), token);
          if (and) and.call(this, token);
        }
      }

      /**
       * @this {CompileContext}
       * @returns {void}
       */
      function buffer() {
        this.stack.push({
          type: 'fragment',
          children: []
        });
      }

      /**
       * @template {Node} Kind
       *   Node type.
       * @this {CompileContext}
       *   Context.
       * @param {Kind} node
       *   Node to enter.
       * @param {Token} token
       *   Corresponding token.
       * @param {OnEnterError | undefined} [errorHandler]
       *   Handle the case where this token is open, but it is closed by something else.
       * @returns {Kind}
       *   The given node.
       */
      function enter(node, token, errorHandler) {
        const parent = this.stack[this.stack.length - 1];
        // @ts-expect-error: Assume `Node` can exist as a child of `parent`.
        parent.children.push(node);
        this.stack.push(node);
        this.tokenStack.push([token, errorHandler]);
        // @ts-expect-error: `end` will be patched later.
        node.position = {
          start: point$1(token.start)
        };
        return node
      }

      /**
       * Create a closer handle.
       *
       * @param {Handle} [and]
       *   Optional function to also run.
       * @returns {Handle}
       *   Handle.
       */
      function closer(and) {
        return close

        /**
         * @this {CompileContext}
         * @param {Token} token
         * @returns {void}
         */
        function close(token) {
          if (and) and.call(this, token);
          exit.call(this, token);
        }
      }

      /**
       * @this {CompileContext}
       *   Context.
       * @param {Token} token
       *   Corresponding token.
       * @param {OnExitError | undefined} [onExitError]
       *   Handle the case where another token is open.
       * @returns {Node}
       *   The closed node.
       */
      function exit(token, onExitError) {
        const node = this.stack.pop();
        const open = this.tokenStack.pop();
        if (!open) {
          throw new Error(
            'Cannot close `' +
              token.type +
              '` (' +
              stringifyPosition({
                start: token.start,
                end: token.end
              }) +
              '): it’s not open'
          )
        } else if (open[0].type !== token.type) {
          if (onExitError) {
            onExitError.call(this, token, open[0]);
          } else {
            const handler = open[1] || defaultOnError;
            handler.call(this, token, open[0]);
          }
        }
        node.position.end = point$1(token.end);
        return node
      }

      /**
       * @this {CompileContext}
       * @returns {string}
       */
      function resume() {
        return toString(this.stack.pop())
      }

      //
      // Handlers.
      //

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onenterlistordered() {
        setData('expectingFirstListItemValue', true);
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onenterlistitemvalue(token) {
        if (getData('expectingFirstListItemValue')) {
          const ancestor = this.stack[this.stack.length - 2];
          ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
          setData('expectingFirstListItemValue');
        }
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitcodefencedfenceinfo() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.lang = data;
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitcodefencedfencemeta() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.meta = data;
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitcodefencedfence() {
        // Exit if this is the closing fence.
        if (getData('flowCodeInside')) return
        this.buffer();
        setData('flowCodeInside', true);
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitcodefenced() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, '');
        setData('flowCodeInside');
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitcodeindented() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.value = data.replace(/(\r?\n|\r)$/g, '');
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitdefinitionlabelstring(token) {
        const label = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.label = label;
        node.identifier = normalizeIdentifier(
          this.sliceSerialize(token)
        ).toLowerCase();
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitdefinitiontitlestring() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.title = data;
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitdefinitiondestinationstring() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.url = data;
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitatxheadingsequence(token) {
        const node = this.stack[this.stack.length - 1];
        if (!node.depth) {
          const depth = this.sliceSerialize(token).length;
          node.depth = depth;
        }
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitsetextheadingtext() {
        setData('setextHeadingSlurpLineEnding', true);
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitsetextheadinglinesequence(token) {
        const node = this.stack[this.stack.length - 1];
        node.depth = this.sliceSerialize(token).charCodeAt(0) === 61 ? 1 : 2;
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitsetextheading() {
        setData('setextHeadingSlurpLineEnding');
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onenterdata(token) {
        const node = this.stack[this.stack.length - 1];
        let tail = node.children[node.children.length - 1];
        if (!tail || tail.type !== 'text') {
          // Add a new text node.
          tail = text();
          // @ts-expect-error: we’ll add `end` later.
          tail.position = {
            start: point$1(token.start)
          };
          // @ts-expect-error: Assume `parent` accepts `text`.
          node.children.push(tail);
        }
        this.stack.push(tail);
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitdata(token) {
        const tail = this.stack.pop();
        tail.value += this.sliceSerialize(token);
        tail.position.end = point$1(token.end);
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitlineending(token) {
        const context = this.stack[this.stack.length - 1];
        // If we’re at a hard break, include the line ending in there.
        if (getData('atHardBreak')) {
          const tail = context.children[context.children.length - 1];
          tail.position.end = point$1(token.end);
          setData('atHardBreak');
          return
        }
        if (
          !getData('setextHeadingSlurpLineEnding') &&
          config.canContainEols.includes(context.type)
        ) {
          onenterdata.call(this, token);
          onexitdata.call(this, token);
        }
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexithardbreak() {
        setData('atHardBreak', true);
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexithtmlflow() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.value = data;
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexithtmltext() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.value = data;
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitcodetext() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.value = data;
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitlink() {
        const node = this.stack[this.stack.length - 1];
        // Note: there are also `identifier` and `label` fields on this link node!
        // These are used / cleaned here.
        // To do: clean.
        if (getData('inReference')) {
          /** @type {ReferenceType} */
          const referenceType = getData('referenceType') || 'shortcut';
          node.type += 'Reference';
          // @ts-expect-error: mutate.
          node.referenceType = referenceType;
          // @ts-expect-error: mutate.
          delete node.url;
          delete node.title;
        } else {
          // @ts-expect-error: mutate.
          delete node.identifier;
          // @ts-expect-error: mutate.
          delete node.label;
        }
        setData('referenceType');
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitimage() {
        const node = this.stack[this.stack.length - 1];
        // Note: there are also `identifier` and `label` fields on this link node!
        // These are used / cleaned here.
        // To do: clean.
        if (getData('inReference')) {
          /** @type {ReferenceType} */
          const referenceType = getData('referenceType') || 'shortcut';
          node.type += 'Reference';
          // @ts-expect-error: mutate.
          node.referenceType = referenceType;
          // @ts-expect-error: mutate.
          delete node.url;
          delete node.title;
        } else {
          // @ts-expect-error: mutate.
          delete node.identifier;
          // @ts-expect-error: mutate.
          delete node.label;
        }
        setData('referenceType');
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitlabeltext(token) {
        const string = this.sliceSerialize(token);
        const ancestor = this.stack[this.stack.length - 2];
        // @ts-expect-error: stash this on the node, as it might become a reference
        // later.
        ancestor.label = decodeString(string);
        // @ts-expect-error: same as above.
        ancestor.identifier = normalizeIdentifier(string).toLowerCase();
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitlabel() {
        const fragment = this.stack[this.stack.length - 1];
        const value = this.resume();
        const node = this.stack[this.stack.length - 1];
        // Assume a reference.
        setData('inReference', true);
        if (node.type === 'link') {
          /** @type {Array<StaticPhrasingContent>} */
          // @ts-expect-error: Assume static phrasing content.
          const children = fragment.children;
          node.children = children;
        } else {
          node.alt = value;
        }
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitresourcedestinationstring() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.url = data;
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitresourcetitlestring() {
        const data = this.resume();
        const node = this.stack[this.stack.length - 1];
        node.title = data;
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitresource() {
        setData('inReference');
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onenterreference() {
        setData('referenceType', 'collapsed');
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitreferencestring(token) {
        const label = this.resume();
        const node = this.stack[this.stack.length - 1];
        // @ts-expect-error: stash this on the node, as it might become a reference
        // later.
        node.label = label;
        // @ts-expect-error: same as above.
        node.identifier = normalizeIdentifier(
          this.sliceSerialize(token)
        ).toLowerCase();
        setData('referenceType', 'full');
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */

      function onexitcharacterreferencemarker(token) {
        setData('characterReferenceType', token.type);
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitcharacterreferencevalue(token) {
        const data = this.sliceSerialize(token);
        const type = getData('characterReferenceType');
        /** @type {string} */
        let value;
        if (type) {
          value = decodeNumericCharacterReference(
            data,
            type === 'characterReferenceMarkerNumeric' ? 10 : 16
          );
          setData('characterReferenceType');
        } else {
          const result = decodeNamedCharacterReference(data);
          value = result;
        }
        const tail = this.stack.pop();
        tail.value += value;
        tail.position.end = point$1(token.end);
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitautolinkprotocol(token) {
        onexitdata.call(this, token);
        const node = this.stack[this.stack.length - 1];
        node.url = this.sliceSerialize(token);
      }

      /**
       * @this {CompileContext}
       * @type {Handle}
       */
      function onexitautolinkemail(token) {
        onexitdata.call(this, token);
        const node = this.stack[this.stack.length - 1];
        node.url = 'mailto:' + this.sliceSerialize(token);
      }

      //
      // Creaters.
      //

      /** @returns {Blockquote} */
      function blockQuote() {
        return {
          type: 'blockquote',
          children: []
        }
      }

      /** @returns {Code} */
      function codeFlow() {
        return {
          type: 'code',
          lang: null,
          meta: null,
          value: ''
        }
      }

      /** @returns {InlineCode} */
      function codeText() {
        return {
          type: 'inlineCode',
          value: ''
        }
      }

      /** @returns {Definition} */
      function definition() {
        return {
          type: 'definition',
          identifier: '',
          label: null,
          title: null,
          url: ''
        }
      }

      /** @returns {Emphasis} */
      function emphasis() {
        return {
          type: 'emphasis',
          children: []
        }
      }

      /** @returns {Heading} */
      function heading() {
        // @ts-expect-error `depth` will be set later.
        return {
          type: 'heading',
          depth: undefined,
          children: []
        }
      }

      /** @returns {Break} */
      function hardBreak() {
        return {
          type: 'break'
        }
      }

      /** @returns {HTML} */
      function html() {
        return {
          type: 'html',
          value: ''
        }
      }

      /** @returns {Image} */
      function image() {
        return {
          type: 'image',
          title: null,
          url: '',
          alt: null
        }
      }

      /** @returns {Link} */
      function link() {
        return {
          type: 'link',
          title: null,
          url: '',
          children: []
        }
      }

      /**
       * @param {Token} token
       * @returns {List}
       */
      function list(token) {
        return {
          type: 'list',
          ordered: token.type === 'listOrdered',
          start: null,
          spread: token._spread,
          children: []
        }
      }

      /**
       * @param {Token} token
       * @returns {ListItem}
       */
      function listItem(token) {
        return {
          type: 'listItem',
          spread: token._spread,
          checked: null,
          children: []
        }
      }

      /** @returns {Paragraph} */
      function paragraph() {
        return {
          type: 'paragraph',
          children: []
        }
      }

      /** @returns {Strong} */
      function strong() {
        return {
          type: 'strong',
          children: []
        }
      }

      /** @returns {Text} */
      function text() {
        return {
          type: 'text',
          value: ''
        }
      }

      /** @returns {ThematicBreak} */
      function thematicBreak() {
        return {
          type: 'thematicBreak'
        }
      }
    }

    /**
     * Copy a point-like value.
     *
     * @param {Point} d
     *   Point-like value.
     * @returns {Point}
     *   unist point.
     */
    function point$1(d) {
      return {
        line: d.line,
        column: d.column,
        offset: d.offset
      }
    }

    /**
     * @param {Config} combined
     * @param {Array<Extension | Array<Extension>>} extensions
     * @returns {void}
     */
    function configure(combined, extensions) {
      let index = -1;
      while (++index < extensions.length) {
        const value = extensions[index];
        if (Array.isArray(value)) {
          configure(combined, value);
        } else {
          extension(combined, value);
        }
      }
    }

    /**
     * @param {Config} combined
     * @param {Extension} extension
     * @returns {void}
     */
    function extension(combined, extension) {
      /** @type {keyof Extension} */
      let key;
      for (key in extension) {
        if (own$6.call(extension, key)) {
          if (key === 'canContainEols') {
            const right = extension[key];
            if (right) {
              combined[key].push(...right);
            }
          } else if (key === 'transforms') {
            const right = extension[key];
            if (right) {
              combined[key].push(...right);
            }
          } else if (key === 'enter' || key === 'exit') {
            const right = extension[key];
            if (right) {
              Object.assign(combined[key], right);
            }
          }
        }
      }
    }

    /** @type {OnEnterError} */
    function defaultOnError(left, right) {
      if (left) {
        throw new Error(
          'Cannot close `' +
            left.type +
            '` (' +
            stringifyPosition({
              start: left.start,
              end: left.end
            }) +
            '): a different token (`' +
            right.type +
            '`, ' +
            stringifyPosition({
              start: right.start,
              end: right.end
            }) +
            ') is open'
        )
      } else {
        throw new Error(
          'Cannot close document, a token (`' +
            right.type +
            '`, ' +
            stringifyPosition({
              start: right.start,
              end: right.end
            }) +
            ') is still open'
        )
      }
    }

    /**
     * @typedef {import('mdast').Root} Root
     * @typedef {import('mdast-util-from-markdown').Options} Options
     */

    /**
     * @this {import('unified').Processor}
     * @type {import('unified').Plugin<[Options?] | void[], string, Root>}
     */
    function remarkParse(options) {
      /** @type {import('unified').ParserFunction<Root>} */
      const parser = (doc) => {
        // Assume options.
        const settings = /** @type {Options} */ (this.data('settings'));

        return fromMarkdown(
          doc,
          Object.assign({}, settings, options, {
            // Note: these options are not in the readme.
            // The goal is for them to be set by plugins on `data` instead of being
            // passed by users.
            extensions: this.data('micromarkExtensions') || [],
            mdastExtensions: this.data('fromMarkdownExtensions') || []
          })
        )
      };

      Object.assign(this, {Parser: parser});
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').Blockquote} Blockquote
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `blockquote` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Blockquote} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function blockquote(state, node) {
      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'blockquote',
        properties: {},
        children: state.wrap(state.all(node), true)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').Text} Text
     * @typedef {import('mdast').Break} Break
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `break` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Break} node
     *   mdast node.
     * @returns {Array<Element | Text>}
     *   hast element content.
     */
    function hardBreak(state, node) {
      /** @type {Element} */
      const result = {type: 'element', tagName: 'br', properties: {}, children: []};
      state.patch(node, result);
      return [state.applyData(node, result), {type: 'text', value: '\n'}]
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').Properties} Properties
     * @typedef {import('mdast').Code} Code
     * @typedef {import('../state.js').State} State

     */

    /**
     * Turn an mdast `code` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Code} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function code$1(state, node) {
      const value = node.value ? node.value + '\n' : '';
      // To do: next major, use `node.lang` w/o regex, the splitting’s been going
      // on for years in remark now.
      const lang = node.lang ? node.lang.match(/^[^ \t]+(?=[ \t]|$)/) : null;
      /** @type {Properties} */
      const properties = {};

      if (lang) {
        properties.className = ['language-' + lang];
      }

      // Create `<code>`.
      /** @type {Element} */
      let result = {
        type: 'element',
        tagName: 'code',
        properties,
        children: [{type: 'text', value}]
      };

      if (node.meta) {
        result.data = {meta: node.meta};
      }

      state.patch(node, result);
      result = state.applyData(node, result);

      // Create `<pre>`.
      result = {type: 'element', tagName: 'pre', properties: {}, children: [result]};
      state.patch(node, result);
      return result
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').Delete} Delete
     * @typedef {import('../state.js').State} State

     */

    /**
     * Turn an mdast `delete` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Delete} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function strikethrough(state, node) {
      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'del',
        properties: {},
        children: state.all(node)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').Emphasis} Emphasis
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `emphasis` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Emphasis} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function emphasis(state, node) {
      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'em',
        properties: {},
        children: state.all(node)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * Normalize a URL.
     *
     * Encode unsafe characters with percent-encoding, skipping already encoded
     * sequences.
     *
     * @param {string} value
     *   URI to normalize.
     * @returns {string}
     *   Normalized URI.
     */
    function normalizeUri(value) {
      /** @type {Array<string>} */
      const result = [];
      let index = -1;
      let start = 0;
      let skip = 0;
      while (++index < value.length) {
        const code = value.charCodeAt(index);
        /** @type {string} */
        let replace = '';

        // A correct percent encoded value.
        if (
          code === 37 &&
          asciiAlphanumeric(value.charCodeAt(index + 1)) &&
          asciiAlphanumeric(value.charCodeAt(index + 2))
        ) {
          skip = 2;
        }
        // ASCII.
        else if (code < 128) {
          if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code))) {
            replace = String.fromCharCode(code);
          }
        }
        // Astral.
        else if (code > 55295 && code < 57344) {
          const next = value.charCodeAt(index + 1);

          // A correct surrogate pair.
          if (code < 56320 && next > 56319 && next < 57344) {
            replace = String.fromCharCode(code, next);
            skip = 1;
          }
          // Lone surrogate.
          else {
            replace = '\uFFFD';
          }
        }
        // Unicode.
        else {
          replace = String.fromCharCode(code);
        }
        if (replace) {
          result.push(value.slice(start, index), encodeURIComponent(replace));
          start = index + skip + 1;
          replace = '';
        }
        if (skip) {
          index += skip;
          skip = 0;
        }
      }
      return result.join('') + value.slice(start)
    }

    /**
     * @typedef {import('mdast').FootnoteReference} FootnoteReference
     * @typedef {import('hast').Element} Element
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `footnoteReference` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {FootnoteReference} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function footnoteReference$1(state, node) {
      const id = String(node.identifier).toUpperCase();
      const safeId = normalizeUri(id.toLowerCase());
      const index = state.footnoteOrder.indexOf(id);
      /** @type {number} */
      let counter;

      if (index === -1) {
        state.footnoteOrder.push(id);
        state.footnoteCounts[id] = 1;
        counter = state.footnoteOrder.length;
      } else {
        state.footnoteCounts[id]++;
        counter = index + 1;
      }

      const reuseCounter = state.footnoteCounts[id];

      /** @type {Element} */
      const link = {
        type: 'element',
        tagName: 'a',
        properties: {
          href: '#' + state.clobberPrefix + 'fn-' + safeId,
          id:
            state.clobberPrefix +
            'fnref-' +
            safeId +
            (reuseCounter > 1 ? '-' + reuseCounter : ''),
          dataFootnoteRef: true,
          ariaDescribedBy: ['footnote-label']
        },
        children: [{type: 'text', value: String(counter)}]
      };
      state.patch(node, link);

      /** @type {Element} */
      const sup = {
        type: 'element',
        tagName: 'sup',
        properties: {},
        children: [link]
      };
      state.patch(node, sup);
      return state.applyData(node, sup)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').Footnote} Footnote
     * @typedef {import('../state.js').State} State
     */

    // To do: when both:
    // * <https://github.com/micromark/micromark-extension-footnote>
    // * <https://github.com/syntax-tree/mdast-util-footnote>
    // …are archived, remove this (also from mdast).
    // These inline notes are not used in GFM.

    /**
     * Turn an mdast `footnote` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Footnote} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function footnote(state, node) {
      const footnoteById = state.footnoteById;
      let no = 1;

      while (no in footnoteById) no++;

      const identifier = String(no);

      footnoteById[identifier] = {
        type: 'footnoteDefinition',
        identifier,
        children: [{type: 'paragraph', children: node.children}],
        position: node.position
      };

      return footnoteReference$1(state, {
        type: 'footnoteReference',
        identifier,
        position: node.position
      })
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').Heading} Heading
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `heading` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Heading} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function heading(state, node) {
      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'h' + node.depth,
        properties: {},
        children: state.all(node)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').HTML} Html
     * @typedef {import('../state.js').State} State
     * @typedef {import('../../index.js').Raw} Raw
     */

    /**
     * Turn an mdast `html` node into hast (`raw` node in dangerous mode, otherwise
     * nothing).
     *
     * @param {State} state
     *   Info passed around.
     * @param {Html} node
     *   mdast node.
     * @returns {Raw | Element | null}
     *   hast node.
     */
    function html$2(state, node) {
      if (state.dangerous) {
        /** @type {Raw} */
        const result = {type: 'raw', value: node.value};
        state.patch(node, result);
        return state.applyData(node, result)
      }

      // To do: next major: return `undefined`.
      return null
    }

    /**
     * @typedef {import('hast').ElementContent} ElementContent
     *
     * @typedef {import('mdast').Content} Content
     * @typedef {import('mdast').Reference} Reference
     * @typedef {import('mdast').Root} Root
     *
     * @typedef {import('./state.js').State} State
     */

    /**
     * @typedef {Root | Content} Nodes
     * @typedef {Extract<Nodes, Reference>} References
     */

    // To do: next major: always return array.

    /**
     * Return the content of a reference without definition as plain text.
     *
     * @param {State} state
     *   Info passed around.
     * @param {References} node
     *   Reference node (image, link).
     * @returns {ElementContent | Array<ElementContent>}
     *   hast content.
     */
    function revert(state, node) {
      const subtype = node.referenceType;
      let suffix = ']';

      if (subtype === 'collapsed') {
        suffix += '[]';
      } else if (subtype === 'full') {
        suffix += '[' + (node.label || node.identifier) + ']';
      }

      if (node.type === 'imageReference') {
        return {type: 'text', value: '![' + node.alt + suffix}
      }

      const contents = state.all(node);
      const head = contents[0];

      if (head && head.type === 'text') {
        head.value = '[' + head.value;
      } else {
        contents.unshift({type: 'text', value: '['});
      }

      const tail = contents[contents.length - 1];

      if (tail && tail.type === 'text') {
        tail.value += suffix;
      } else {
        contents.push({type: 'text', value: suffix});
      }

      return contents
    }

    /**
     * @typedef {import('hast').ElementContent} ElementContent
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').Properties} Properties
     * @typedef {import('mdast').ImageReference} ImageReference
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `imageReference` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {ImageReference} node
     *   mdast node.
     * @returns {ElementContent | Array<ElementContent>}
     *   hast node.
     */
    function imageReference(state, node) {
      const def = state.definition(node.identifier);

      if (!def) {
        return revert(state, node)
      }

      /** @type {Properties} */
      const properties = {src: normalizeUri(def.url || ''), alt: node.alt};

      if (def.title !== null && def.title !== undefined) {
        properties.title = def.title;
      }

      /** @type {Element} */
      const result = {type: 'element', tagName: 'img', properties, children: []};
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').Properties} Properties
     * @typedef {import('mdast').Image} Image
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `image` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Image} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function image(state, node) {
      /** @type {Properties} */
      const properties = {src: normalizeUri(node.url)};

      if (node.alt !== null && node.alt !== undefined) {
        properties.alt = node.alt;
      }

      if (node.title !== null && node.title !== undefined) {
        properties.title = node.title;
      }

      /** @type {Element} */
      const result = {type: 'element', tagName: 'img', properties, children: []};
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').Text} Text
     * @typedef {import('mdast').InlineCode} InlineCode
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `inlineCode` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {InlineCode} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function inlineCode$1(state, node) {
      /** @type {Text} */
      const text = {type: 'text', value: node.value.replace(/\r?\n|\r/g, ' ')};
      state.patch(node, text);

      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'code',
        properties: {},
        children: [text]
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').ElementContent} ElementContent
     * @typedef {import('hast').Properties} Properties
     * @typedef {import('mdast').LinkReference} LinkReference
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `linkReference` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {LinkReference} node
     *   mdast node.
     * @returns {ElementContent | Array<ElementContent>}
     *   hast node.
     */
    function linkReference(state, node) {
      const def = state.definition(node.identifier);

      if (!def) {
        return revert(state, node)
      }

      /** @type {Properties} */
      const properties = {href: normalizeUri(def.url || '')};

      if (def.title !== null && def.title !== undefined) {
        properties.title = def.title;
      }

      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'a',
        properties,
        children: state.all(node)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').Properties} Properties
     * @typedef {import('mdast').Link} Link
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `link` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Link} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function link(state, node) {
      /** @type {Properties} */
      const properties = {href: normalizeUri(node.url)};

      if (node.title !== null && node.title !== undefined) {
        properties.title = node.title;
      }

      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'a',
        properties,
        children: state.all(node)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').ElementContent} ElementContent
     * @typedef {import('hast').Properties} Properties
     * @typedef {import('mdast').Content} Content
     * @typedef {import('mdast').ListItem} ListItem
     * @typedef {import('mdast').Parent} Parent
     * @typedef {import('mdast').Root} Root
     * @typedef {import('../state.js').State} State
     */

    /**
     * @typedef {Root | Content} Nodes
     * @typedef {Extract<Nodes, Parent>} Parents
     */

    /**
     * Turn an mdast `listItem` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {ListItem} node
     *   mdast node.
     * @param {Parents | null | undefined} parent
     *   Parent of `node`.
     * @returns {Element}
     *   hast node.
     */
    function listItem$1(state, node, parent) {
      const results = state.all(node);
      const loose = parent ? listLoose(parent) : listItemLoose(node);
      /** @type {Properties} */
      const properties = {};
      /** @type {Array<ElementContent>} */
      const children = [];

      if (typeof node.checked === 'boolean') {
        const head = results[0];
        /** @type {Element} */
        let paragraph;

        if (head && head.type === 'element' && head.tagName === 'p') {
          paragraph = head;
        } else {
          paragraph = {type: 'element', tagName: 'p', properties: {}, children: []};
          results.unshift(paragraph);
        }

        if (paragraph.children.length > 0) {
          paragraph.children.unshift({type: 'text', value: ' '});
        }

        paragraph.children.unshift({
          type: 'element',
          tagName: 'input',
          properties: {type: 'checkbox', checked: node.checked, disabled: true},
          children: []
        });

        // According to github-markdown-css, this class hides bullet.
        // See: <https://github.com/sindresorhus/github-markdown-css>.
        properties.className = ['task-list-item'];
      }

      let index = -1;

      while (++index < results.length) {
        const child = results[index];

        // Add eols before nodes, except if this is a loose, first paragraph.
        if (
          loose ||
          index !== 0 ||
          child.type !== 'element' ||
          child.tagName !== 'p'
        ) {
          children.push({type: 'text', value: '\n'});
        }

        if (child.type === 'element' && child.tagName === 'p' && !loose) {
          children.push(...child.children);
        } else {
          children.push(child);
        }
      }

      const tail = results[results.length - 1];

      // Add a final eol.
      if (tail && (loose || tail.type !== 'element' || tail.tagName !== 'p')) {
        children.push({type: 'text', value: '\n'});
      }

      /** @type {Element} */
      const result = {type: 'element', tagName: 'li', properties, children};
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @param {Parents} node
     * @return {Boolean}
     */
    function listLoose(node) {
      let loose = false;
      if (node.type === 'list') {
        loose = node.spread || false;
        const children = node.children;
        let index = -1;

        while (!loose && ++index < children.length) {
          loose = listItemLoose(children[index]);
        }
      }

      return loose
    }

    /**
     * @param {ListItem} node
     * @return {Boolean}
     */
    function listItemLoose(node) {
      const spread = node.spread;

      return spread === undefined || spread === null
        ? node.children.length > 1
        : spread
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').Properties} Properties
     * @typedef {import('mdast').List} List
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `list` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {List} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function list(state, node) {
      /** @type {Properties} */
      const properties = {};
      const results = state.all(node);
      let index = -1;

      if (typeof node.start === 'number' && node.start !== 1) {
        properties.start = node.start;
      }

      // Like GitHub, add a class for custom styling.
      while (++index < results.length) {
        const child = results[index];

        if (
          child.type === 'element' &&
          child.tagName === 'li' &&
          child.properties &&
          Array.isArray(child.properties.className) &&
          child.properties.className.includes('task-list-item')
        ) {
          properties.className = ['contains-task-list'];
          break
        }
      }

      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: node.ordered ? 'ol' : 'ul',
        properties,
        children: state.wrap(results, true)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').Paragraph} Paragraph
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `paragraph` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Paragraph} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function paragraph(state, node) {
      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'p',
        properties: {},
        children: state.all(node)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Root} HastRoot
     * @typedef {import('hast').Element} HastElement
     * @typedef {import('mdast').Root} MdastRoot
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `root` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {MdastRoot} node
     *   mdast node.
     * @returns {HastRoot | HastElement}
     *   hast node.
     */
    function root(state, node) {
      /** @type {HastRoot} */
      const result = {type: 'root', children: state.wrap(state.all(node))};
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').Strong} Strong
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `strong` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Strong} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function strong(state, node) {
      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: state.all(node)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('unist').Position} Position
     * @typedef {import('unist').Node} Node
     * @typedef {import('unist').Point} Point
     */

    /**
     * @typedef NodeLike
     * @property {string} type
     * @property {PositionLike | null | undefined} [position]
     *
     * @typedef PositionLike
     * @property {PointLike | null | undefined} [start]
     * @property {PointLike | null | undefined} [end]
     *
     * @typedef PointLike
     * @property {number | null | undefined} [line]
     * @property {number | null | undefined} [column]
     * @property {number | null | undefined} [offset]
     */

    /**
     * Get the starting point of `node`.
     *
     * @param node
     *   Node.
     * @returns
     *   Point.
     */
    const pointStart = point('start');

    /**
     * Get the ending point of `node`.
     *
     * @param node
     *   Node.
     * @returns
     *   Point.
     */
    const pointEnd = point('end');

    /**
     * Get the positional info of `node`.
     *
     * @param {NodeLike | Node | null | undefined} [node]
     *   Node.
     * @returns {Position}
     *   Position.
     */
    function position(node) {
      return {start: pointStart(node), end: pointEnd(node)}
    }

    /**
     * Get the positional info of `node`.
     *
     * @param {'start' | 'end'} type
     *   Side.
     * @returns
     *   Getter.
     */
    function point(type) {
      return point

      /**
       * Get the point info of `node` at a bound side.
       *
       * @param {NodeLike | Node | null | undefined} [node]
       * @returns {Point}
       */
      function point(node) {
        const point = (node && node.position && node.position[type]) || {};

        // To do: next major: don’t return points when invalid.
        return {
          // @ts-expect-error: in practice, null is allowed.
          line: point.line || null,
          // @ts-expect-error: in practice, null is allowed.
          column: point.column || null,
          // @ts-expect-error: in practice, null is allowed.
          offset: point.offset > -1 ? point.offset : null
        }
      }
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').Table} Table
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `table` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {Table} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function table(state, node) {
      const rows = state.all(node);
      const firstRow = rows.shift();
      /** @type {Array<Element>} */
      const tableContent = [];

      if (firstRow) {
        /** @type {Element} */
        const head = {
          type: 'element',
          tagName: 'thead',
          properties: {},
          children: state.wrap([firstRow], true)
        };
        state.patch(node.children[0], head);
        tableContent.push(head);
      }

      if (rows.length > 0) {
        /** @type {Element} */
        const body = {
          type: 'element',
          tagName: 'tbody',
          properties: {},
          children: state.wrap(rows, true)
        };

        const start = pointStart(node.children[1]);
        const end = pointEnd(node.children[node.children.length - 1]);
        if (start.line && end.line) body.position = {start, end};
        tableContent.push(body);
      }

      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'table',
        properties: {},
        children: state.wrap(tableContent, true)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Properties} Properties
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').ElementContent} ElementContent
     * @typedef {import('mdast').Content} Content
     * @typedef {import('mdast').Parent} Parent
     * @typedef {import('mdast').Root} Root
     * @typedef {import('mdast').TableRow} TableRow
     * @typedef {import('../state.js').State} State
     */

    /**
     * @typedef {Root | Content} Nodes
     * @typedef {Extract<Nodes, Parent>} Parents
     */

    /**
     * Turn an mdast `tableRow` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {TableRow} node
     *   mdast node.
     * @param {Parents | null | undefined} parent
     *   Parent of `node`.
     * @returns {Element}
     *   hast node.
     */
    function tableRow(state, node, parent) {
      const siblings = parent ? parent.children : undefined;
      // Generate a body row when without parent.
      const rowIndex = siblings ? siblings.indexOf(node) : 1;
      const tagName = rowIndex === 0 ? 'th' : 'td';
      const align = parent && parent.type === 'table' ? parent.align : undefined;
      const length = align ? align.length : node.children.length;
      let cellIndex = -1;
      /** @type {Array<ElementContent>} */
      const cells = [];

      while (++cellIndex < length) {
        // Note: can also be undefined.
        const cell = node.children[cellIndex];
        /** @type {Properties} */
        const properties = {};
        const alignValue = align ? align[cellIndex] : undefined;

        if (alignValue) {
          properties.align = alignValue;
        }

        /** @type {Element} */
        let result = {type: 'element', tagName, properties, children: []};

        if (cell) {
          result.children = state.all(cell);
          state.patch(cell, result);
          result = state.applyData(node, result);
        }

        cells.push(result);
      }

      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'tr',
        properties: {},
        children: state.wrap(cells, true)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').TableCell} TableCell
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `tableCell` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {TableCell} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function tableCell(state, node) {
      // Note: this function is normally not called: see `table-row` for how rows
      // and their cells are compiled.
      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'td', // Assume body cell.
        properties: {},
        children: state.all(node)
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    const tab = 9; /* `\t` */
    const space = 32; /* ` ` */

    /**
     * Remove initial and final spaces and tabs at the line breaks in `value`.
     * Does not trim initial and final spaces and tabs of the value itself.
     *
     * @param {string} value
     *   Value to trim.
     * @returns {string}
     *   Trimmed value.
     */
    function trimLines(value) {
      const source = String(value);
      const search = /\r?\n|\r/g;
      let match = search.exec(source);
      let last = 0;
      /** @type {Array<string>} */
      const lines = [];

      while (match) {
        lines.push(
          trimLine(source.slice(last, match.index), last > 0, true),
          match[0]
        );

        last = match.index + match[0].length;
        match = search.exec(source);
      }

      lines.push(trimLine(source.slice(last), last > 0, false));

      return lines.join('')
    }

    /**
     * @param {string} value
     *   Line to trim.
     * @param {boolean} start
     *   Whether to trim the start of the line.
     * @param {boolean} end
     *   Whether to trim the end of the line.
     * @returns {string}
     *   Trimmed line.
     */
    function trimLine(value, start, end) {
      let startIndex = 0;
      let endIndex = value.length;

      if (start) {
        let code = value.codePointAt(startIndex);

        while (code === tab || code === space) {
          startIndex++;
          code = value.codePointAt(startIndex);
        }
      }

      if (end) {
        let code = value.codePointAt(endIndex - 1);

        while (code === tab || code === space) {
          endIndex--;
          code = value.codePointAt(endIndex - 1);
        }
      }

      return endIndex > startIndex ? value.slice(startIndex, endIndex) : ''
    }

    /**
     * @typedef {import('hast').Element} HastElement
     * @typedef {import('hast').Text} HastText
     * @typedef {import('mdast').Text} MdastText
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `text` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {MdastText} node
     *   mdast node.
     * @returns {HastText | HastElement}
     *   hast node.
     */
    function text$1(state, node) {
      /** @type {HastText} */
      const result = {type: 'text', value: trimLines(String(node.value))};
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('mdast').ThematicBreak} ThematicBreak
     * @typedef {import('../state.js').State} State
     */

    /**
     * Turn an mdast `thematicBreak` node into hast.
     *
     * @param {State} state
     *   Info passed around.
     * @param {ThematicBreak} node
     *   mdast node.
     * @returns {Element}
     *   hast node.
     */
    function thematicBreak(state, node) {
      /** @type {Element} */
      const result = {
        type: 'element',
        tagName: 'hr',
        properties: {},
        children: []
      };
      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * Default handlers for nodes.
     */
    const handlers = {
      blockquote,
      break: hardBreak,
      code: code$1,
      delete: strikethrough,
      emphasis,
      footnoteReference: footnoteReference$1,
      footnote,
      heading,
      html: html$2,
      imageReference,
      image,
      inlineCode: inlineCode$1,
      linkReference,
      link,
      listItem: listItem$1,
      list,
      paragraph,
      root,
      strong,
      table,
      tableCell,
      tableRow,
      text: text$1,
      thematicBreak,
      toml: ignore,
      yaml: ignore,
      definition: ignore,
      footnoteDefinition: ignore
    };

    // Return nothing for nodes that are ignored.
    function ignore() {
      // To do: next major: return `undefined`.
      return null
    }

    /**
     * @typedef {import('unist').Node} Node
     * @typedef {import('unist').Parent} Parent
     */

    /**
     * Generate an assertion from a test.
     *
     * Useful if you’re going to test many nodes, for example when creating a
     * utility where something else passes a compatible test.
     *
     * The created function is a bit faster because it expects valid input only:
     * a `node`, `index`, and `parent`.
     *
     * @param test
     *   *   when nullish, checks if `node` is a `Node`.
     *   *   when `string`, works like passing `(node) => node.type === test`.
     *   *   when `function` checks if function passed the node is true.
     *   *   when `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
     *   *   when `array`, checks if any one of the subtests pass.
     * @returns
     *   An assertion.
     */
    const convert =
      /**
       * @type {(
       *   (<Kind extends Node>(test: PredicateTest<Kind>) => AssertPredicate<Kind>) &
       *   ((test?: Test) => AssertAnything)
       * )}
       */
      (
        /**
         * @param {Test} [test]
         * @returns {AssertAnything}
         */
        function (test) {
          if (test === undefined || test === null) {
            return ok
          }

          if (typeof test === 'string') {
            return typeFactory(test)
          }

          if (typeof test === 'object') {
            return Array.isArray(test) ? anyFactory(test) : propsFactory(test)
          }

          if (typeof test === 'function') {
            return castFactory(test)
          }

          throw new Error('Expected function, string, or object as test')
        }
      );

    /**
     * @param {Array<string | Props | TestFunctionAnything>} tests
     * @returns {AssertAnything}
     */
    function anyFactory(tests) {
      /** @type {Array<AssertAnything>} */
      const checks = [];
      let index = -1;

      while (++index < tests.length) {
        checks[index] = convert(tests[index]);
      }

      return castFactory(any)

      /**
       * @this {unknown}
       * @param {Array<unknown>} parameters
       * @returns {boolean}
       */
      function any(...parameters) {
        let index = -1;

        while (++index < checks.length) {
          if (checks[index].call(this, ...parameters)) return true
        }

        return false
      }
    }

    /**
     * Turn an object into a test for a node with a certain fields.
     *
     * @param {Props} check
     * @returns {AssertAnything}
     */
    function propsFactory(check) {
      return castFactory(all)

      /**
       * @param {Node} node
       * @returns {boolean}
       */
      function all(node) {
        /** @type {string} */
        let key;

        for (key in check) {
          // @ts-expect-error: hush, it sure works as an index.
          if (node[key] !== check[key]) return false
        }

        return true
      }
    }

    /**
     * Turn a string into a test for a node with a certain type.
     *
     * @param {string} check
     * @returns {AssertAnything}
     */
    function typeFactory(check) {
      return castFactory(type)

      /**
       * @param {Node} node
       */
      function type(node) {
        return node && node.type === check
      }
    }

    /**
     * Turn a custom test into a test for a node that passes that test.
     *
     * @param {TestFunctionAnything} check
     * @returns {AssertAnything}
     */
    function castFactory(check) {
      return assertion

      /**
       * @this {unknown}
       * @param {unknown} node
       * @param {Array<unknown>} parameters
       * @returns {boolean}
       */
      function assertion(node, ...parameters) {
        return Boolean(
          node &&
            typeof node === 'object' &&
            'type' in node &&
            // @ts-expect-error: fine.
            Boolean(check.call(this, node, ...parameters))
        )
      }
    }

    function ok() {
      return true
    }

    /**
     * @param {string} d
     * @returns {string}
     */
    function color(d) {
      return d
    }

    /**
     * @typedef {import('unist').Node} Node
     * @typedef {import('unist').Parent} Parent
     * @typedef {import('unist-util-is').Test} Test
     */

    /**
     * Continue traversing as normal.
     */
    const CONTINUE = true;

    /**
     * Stop traversing immediately.
     */
    const EXIT = false;

    /**
     * Do not traverse this node’s children.
     */
    const SKIP = 'skip';

    /**
     * Visit nodes, with ancestral information.
     *
     * This algorithm performs *depth-first* *tree traversal* in *preorder*
     * (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
     *
     * You can choose for which nodes `visitor` is called by passing a `test`.
     * For complex tests, you should test yourself in `visitor`, as it will be
     * faster and will have improved type information.
     *
     * Walking the tree is an intensive task.
     * Make use of the return values of the visitor when possible.
     * Instead of walking a tree multiple times, walk it once, use `unist-util-is`
     * to check if a node matches, and then perform different operations.
     *
     * You can change the tree.
     * See `Visitor` for more info.
     *
     * @param tree
     *   Tree to traverse.
     * @param test
     *   `unist-util-is`-compatible test
     * @param visitor
     *   Handle each node.
     * @param reverse
     *   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
     * @returns
     *   Nothing.
     */
    const visitParents =
      /**
       * @type {(
       *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
       *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
       * )}
       */
      (
        /**
         * @param {Node} tree
         * @param {Test} test
         * @param {Visitor<Node>} visitor
         * @param {boolean | null | undefined} [reverse]
         * @returns {void}
         */
        function (tree, test, visitor, reverse) {
          if (typeof test === 'function' && typeof visitor !== 'function') {
            reverse = visitor;
            // @ts-expect-error no visitor given, so `visitor` is test.
            visitor = test;
            test = null;
          }

          const is = convert(test);
          const step = reverse ? -1 : 1;

          factory(tree, undefined, [])();

          /**
           * @param {Node} node
           * @param {number | undefined} index
           * @param {Array<Parent>} parents
           */
          function factory(node, index, parents) {
            /** @type {Record<string, unknown>} */
            // @ts-expect-error: hush
            const value = node && typeof node === 'object' ? node : {};

            if (typeof value.type === 'string') {
              const name =
                // `hast`
                typeof value.tagName === 'string'
                  ? value.tagName
                  : // `xast`
                  typeof value.name === 'string'
                  ? value.name
                  : undefined;

              Object.defineProperty(visit, 'name', {
                value:
                  'node (' + color(node.type + (name ? '<' + name + '>' : '')) + ')'
              });
            }

            return visit

            function visit() {
              /** @type {ActionTuple} */
              let result = [];
              /** @type {ActionTuple} */
              let subresult;
              /** @type {number} */
              let offset;
              /** @type {Array<Parent>} */
              let grandparents;

              if (!test || is(node, index, parents[parents.length - 1] || null)) {
                result = toResult(visitor(node, parents));

                if (result[0] === EXIT) {
                  return result
                }
              }

              // @ts-expect-error looks like a parent.
              if (node.children && result[0] !== SKIP) {
                // @ts-expect-error looks like a parent.
                offset = (reverse ? node.children.length : -1) + step;
                // @ts-expect-error looks like a parent.
                grandparents = parents.concat(node);

                // @ts-expect-error looks like a parent.
                while (offset > -1 && offset < node.children.length) {
                  // @ts-expect-error looks like a parent.
                  subresult = factory(node.children[offset], offset, grandparents)();

                  if (subresult[0] === EXIT) {
                    return subresult
                  }

                  offset =
                    typeof subresult[1] === 'number' ? subresult[1] : offset + step;
                }
              }

              return result
            }
          }
        }
      );

    /**
     * Turn a return value into a clean result.
     *
     * @param {VisitorResult} value
     *   Valid return values from visitors.
     * @returns {ActionTuple}
     *   Clean result.
     */
    function toResult(value) {
      if (Array.isArray(value)) {
        return value
      }

      if (typeof value === 'number') {
        return [CONTINUE, value]
      }

      return [value]
    }

    /**
     * @typedef {import('unist').Node} Node
     * @typedef {import('unist').Parent} Parent
     * @typedef {import('unist-util-is').Test} Test
     * @typedef {import('unist-util-visit-parents').VisitorResult} VisitorResult
     */

    /**
     * Visit nodes.
     *
     * This algorithm performs *depth-first* *tree traversal* in *preorder*
     * (**NLR**) or if `reverse` is given, in *reverse preorder* (**NRL**).
     *
     * You can choose for which nodes `visitor` is called by passing a `test`.
     * For complex tests, you should test yourself in `visitor`, as it will be
     * faster and will have improved type information.
     *
     * Walking the tree is an intensive task.
     * Make use of the return values of the visitor when possible.
     * Instead of walking a tree multiple times, walk it once, use `unist-util-is`
     * to check if a node matches, and then perform different operations.
     *
     * You can change the tree.
     * See `Visitor` for more info.
     *
     * @param tree
     *   Tree to traverse.
     * @param test
     *   `unist-util-is`-compatible test
     * @param visitor
     *   Handle each node.
     * @param reverse
     *   Traverse in reverse preorder (NRL) instead of the default preorder (NLR).
     * @returns
     *   Nothing.
     */
    const visit =
      /**
       * @type {(
       *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
       *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
       * )}
       */
      (
        /**
         * @param {Node} tree
         * @param {Test} test
         * @param {Visitor} visitor
         * @param {boolean | null | undefined} [reverse]
         * @returns {void}
         */
        function (tree, test, visitor, reverse) {
          if (typeof test === 'function' && typeof visitor !== 'function') {
            reverse = visitor;
            visitor = test;
            test = null;
          }

          visitParents(tree, test, overload, reverse);

          /**
           * @param {Node} node
           * @param {Array<Parent>} parents
           */
          function overload(node, parents) {
            const parent = parents[parents.length - 1];
            return visitor(
              node,
              parent ? parent.children.indexOf(node) : null,
              parent
            )
          }
        }
      );

    /**
     * @typedef PointLike
     * @property {number | null | undefined} [line]
     * @property {number | null | undefined} [column]
     * @property {number | null | undefined} [offset]
     *
     * @typedef PositionLike
     * @property {PointLike | null | undefined} [start]
     * @property {PointLike | null | undefined} [end]
     *
     * @typedef NodeLike
     * @property {PositionLike | null | undefined} [position]
     */

    /**
     * Check if `node` is generated.
     *
     * @param {NodeLike | null | undefined} [node]
     *   Node to check.
     * @returns {boolean}
     *   Whether `node` is generated (does not have positional info).
     */
    function generated(node) {
      return (
        !node ||
        !node.position ||
        !node.position.start ||
        !node.position.start.line ||
        !node.position.start.column ||
        !node.position.end ||
        !node.position.end.line ||
        !node.position.end.column
      )
    }

    /**
     * @typedef {import('mdast').Root} Root
     * @typedef {import('mdast').Content} Content
     * @typedef {import('mdast').Definition} Definition
     */

    const own$5 = {}.hasOwnProperty;

    /**
     * Find definitions in `tree`.
     *
     * Uses CommonMark precedence, which means that earlier definitions are
     * preferred over duplicate later definitions.
     *
     * @param {Node} tree
     *   Tree to check.
     * @returns {GetDefinition}
     *   Getter.
     */
    function definitions(tree) {
      /** @type {Record<string, Definition>} */
      const cache = Object.create(null);

      if (!tree || !tree.type) {
        throw new Error('mdast-util-definitions expected node')
      }

      visit(tree, 'definition', (definition) => {
        const id = clean(definition.identifier);
        if (id && !own$5.call(cache, id)) {
          cache[id] = definition;
        }
      });

      return definition

      /** @type {GetDefinition} */
      function definition(identifier) {
        const id = clean(identifier);
        // To do: next major: return `undefined` when not found.
        return id && own$5.call(cache, id) ? cache[id] : null
      }
    }

    /**
     * @param {string | null | undefined} [value]
     * @returns {string}
     */
    function clean(value) {
      return String(value || '').toUpperCase()
    }

    /**
     * @typedef {import('hast').Content} HastContent
     * @typedef {import('hast').Element} HastElement
     * @typedef {import('hast').ElementContent} HastElementContent
     * @typedef {import('hast').Properties} HastProperties
     * @typedef {import('hast').Root} HastRoot
     * @typedef {import('hast').Text} HastText
     *
     * @typedef {import('mdast').Content} MdastContent
     * @typedef {import('mdast').Definition} MdastDefinition
     * @typedef {import('mdast').FootnoteDefinition} MdastFootnoteDefinition
     * @typedef {import('mdast').Parent} MdastParent
     * @typedef {import('mdast').Root} MdastRoot
     */

    const own$4 = {}.hasOwnProperty;

    /**
     * Create `state` from an mdast tree.
     *
     * @param {MdastNodes} tree
     *   mdast node to transform.
     * @param {Options | null | undefined} [options]
     *   Configuration.
     * @returns {State}
     *   `state` function.
     */
    function createState(tree, options) {
      const settings = options || {};
      const dangerous = settings.allowDangerousHtml || false;
      /** @type {Record<string, MdastFootnoteDefinition>} */
      const footnoteById = {};

      // To do: next major: add `options` to state, remove:
      // `dangerous`, `clobberPrefix`, `footnoteLabel`, `footnoteLabelTagName`,
      // `footnoteLabelProperties`, `footnoteBackLabel`, `passThrough`,
      // `unknownHandler`.

      // To do: next major: move to `state.options.allowDangerousHtml`.
      state.dangerous = dangerous;
      // To do: next major: move to `state.options`.
      state.clobberPrefix =
        settings.clobberPrefix === undefined || settings.clobberPrefix === null
          ? 'user-content-'
          : settings.clobberPrefix;
      // To do: next major: move to `state.options`.
      state.footnoteLabel = settings.footnoteLabel || 'Footnotes';
      // To do: next major: move to `state.options`.
      state.footnoteLabelTagName = settings.footnoteLabelTagName || 'h2';
      // To do: next major: move to `state.options`.
      state.footnoteLabelProperties = settings.footnoteLabelProperties || {
        className: ['sr-only']
      };
      // To do: next major: move to `state.options`.
      state.footnoteBackLabel = settings.footnoteBackLabel || 'Back to content';
      // To do: next major: move to `state.options`.
      state.unknownHandler = settings.unknownHandler;
      // To do: next major: move to `state.options`.
      state.passThrough = settings.passThrough;

      state.handlers = {...handlers, ...settings.handlers};

      // To do: next major: replace utility with `definitionById` object, so we
      // only walk once (as we need footnotes too).
      state.definition = definitions(tree);
      state.footnoteById = footnoteById;
      /** @type {Array<string>} */
      state.footnoteOrder = [];
      /** @type {Record<string, number>} */
      state.footnoteCounts = {};

      state.patch = patch;
      state.applyData = applyData;
      state.one = oneBound;
      state.all = allBound;
      state.wrap = wrap;
      // To do: next major: remove `augment`.
      state.augment = augment;

      visit(tree, 'footnoteDefinition', (definition) => {
        const id = String(definition.identifier).toUpperCase();

        // Mimick CM behavior of link definitions.
        // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/8290999/index.js#L26>.
        if (!own$4.call(footnoteById, id)) {
          footnoteById[id] = definition;
        }
      });

      // @ts-expect-error Hush, it’s fine!
      return state

      /**
       * Finalise the created `right`, a hast node, from `left`, an mdast node.
       *
       * @param {MdastNodeWithData | PositionLike | null | undefined} left
       * @param {HastElementContent} right
       * @returns {HastElementContent}
       */
      /* c8 ignore start */
      // To do: next major: remove.
      function augment(left, right) {
        // Handle `data.hName`, `data.hProperties, `data.hChildren`.
        if (left && 'data' in left && left.data) {
          /** @type {MdastData} */
          const data = left.data;

          if (data.hName) {
            if (right.type !== 'element') {
              right = {
                type: 'element',
                tagName: '',
                properties: {},
                children: []
              };
            }

            right.tagName = data.hName;
          }

          if (right.type === 'element' && data.hProperties) {
            right.properties = {...right.properties, ...data.hProperties};
          }

          if ('children' in right && right.children && data.hChildren) {
            right.children = data.hChildren;
          }
        }

        if (left) {
          const ctx = 'type' in left ? left : {position: left};

          if (!generated(ctx)) {
            // @ts-expect-error: fine.
            right.position = {start: pointStart(ctx), end: pointEnd(ctx)};
          }
        }

        return right
      }
      /* c8 ignore stop */

      /**
       * Create an element for `node`.
       *
       * @type {HFunctionProps}
       */
      /* c8 ignore start */
      // To do: next major: remove.
      function state(node, tagName, props, children) {
        if (Array.isArray(props)) {
          children = props;
          props = {};
        }

        // @ts-expect-error augmenting an element yields an element.
        return augment(node, {
          type: 'element',
          tagName,
          properties: props || {},
          children: children || []
        })
      }
      /* c8 ignore stop */

      /**
       * Transform an mdast node into a hast node.
       *
       * @param {MdastNodes} node
       *   mdast node.
       * @param {MdastParents | null | undefined} [parent]
       *   Parent of `node`.
       * @returns {HastElementContent | Array<HastElementContent> | null | undefined}
       *   Resulting hast node.
       */
      function oneBound(node, parent) {
        // @ts-expect-error: that’s a state :)
        return one(state, node, parent)
      }

      /**
       * Transform the children of an mdast node into hast nodes.
       *
       * @param {MdastNodes} parent
       *   mdast node to compile
       * @returns {Array<HastElementContent>}
       *   Resulting hast nodes.
       */
      function allBound(parent) {
        // @ts-expect-error: that’s a state :)
        return all(state, parent)
      }
    }

    /**
     * Copy a node’s positional info.
     *
     * @param {MdastNodes} from
     *   mdast node to copy from.
     * @param {HastNodes} to
     *   hast node to copy into.
     * @returns {void}
     *   Nothing.
     */
    function patch(from, to) {
      if (from.position) to.position = position(from);
    }

    /**
     * Honor the `data` of `from` and maybe generate an element instead of `to`.
     *
     * @template {HastNodes} Type
     *   Node type.
     * @param {MdastNodes} from
     *   mdast node to use data from.
     * @param {Type} to
     *   hast node to change.
     * @returns {Type | HastElement}
     *   Nothing.
     */
    function applyData(from, to) {
      /** @type {Type | HastElement} */
      let result = to;

      // Handle `data.hName`, `data.hProperties, `data.hChildren`.
      if (from && from.data) {
        const hName = from.data.hName;
        const hChildren = from.data.hChildren;
        const hProperties = from.data.hProperties;

        if (typeof hName === 'string') {
          // Transforming the node resulted in an element with a different name
          // than wanted:
          if (result.type === 'element') {
            result.tagName = hName;
          }
          // Transforming the node resulted in a non-element, which happens for
          // raw, text, and root nodes (unless custom handlers are passed).
          // The intent is likely to keep the content around (otherwise: pass
          // `hChildren`).
          else {
            result = {
              type: 'element',
              tagName: hName,
              properties: {},
              children: []
            };

            // To do: next major: take the children from the `root`, or inject the
            // raw/text/comment or so into the element?
            // if ('children' in node) {
            //   // @ts-expect-error: assume `children` are allowed in elements.
            //   result.children = node.children
            // } else {
            //   // @ts-expect-error: assume `node` is allowed in elements.
            //   result.children.push(node)
            // }
          }
        }

        if (result.type === 'element' && hProperties) {
          result.properties = {...result.properties, ...hProperties};
        }

        if (
          'children' in result &&
          result.children &&
          hChildren !== null &&
          hChildren !== undefined
        ) {
          // @ts-expect-error: assume valid children are defined.
          result.children = hChildren;
        }
      }

      return result
    }

    /**
     * Transform an mdast node into a hast node.
     *
     * @param {State} state
     *   Info passed around.
     * @param {MdastNodes} node
     *   mdast node.
     * @param {MdastParents | null | undefined} [parent]
     *   Parent of `node`.
     * @returns {HastElementContent | Array<HastElementContent> | null | undefined}
     *   Resulting hast node.
     */
    // To do: next major: do not expose, keep bound.
    function one(state, node, parent) {
      const type = node && node.type;

      // Fail on non-nodes.
      if (!type) {
        throw new Error('Expected node, got `' + node + '`')
      }

      if (own$4.call(state.handlers, type)) {
        return state.handlers[type](state, node, parent)
      }

      if (state.passThrough && state.passThrough.includes(type)) {
        // To do: next major: deep clone.
        // @ts-expect-error: types of passed through nodes are expected to be added manually.
        return 'children' in node ? {...node, children: all(state, node)} : node
      }

      if (state.unknownHandler) {
        return state.unknownHandler(state, node, parent)
      }

      return defaultUnknownHandler(state, node)
    }

    /**
     * Transform the children of an mdast node into hast nodes.
     *
     * @param {State} state
     *   Info passed around.
     * @param {MdastNodes} parent
     *   mdast node to compile
     * @returns {Array<HastElementContent>}
     *   Resulting hast nodes.
     */
    // To do: next major: do not expose, keep bound.
    function all(state, parent) {
      /** @type {Array<HastElementContent>} */
      const values = [];

      if ('children' in parent) {
        const nodes = parent.children;
        let index = -1;
        while (++index < nodes.length) {
          const result = one(state, nodes[index], parent);

          // To do: see if we van clean this? Can we merge texts?
          if (result) {
            if (index && nodes[index - 1].type === 'break') {
              if (!Array.isArray(result) && result.type === 'text') {
                result.value = result.value.replace(/^\s+/, '');
              }

              if (!Array.isArray(result) && result.type === 'element') {
                const head = result.children[0];

                if (head && head.type === 'text') {
                  head.value = head.value.replace(/^\s+/, '');
                }
              }
            }

            if (Array.isArray(result)) {
              values.push(...result);
            } else {
              values.push(result);
            }
          }
        }
      }

      return values
    }

    /**
     * Transform an unknown node.
     *
     * @param {State} state
     *   Info passed around.
     * @param {MdastNodes} node
     *   Unknown mdast node.
     * @returns {HastText | HastElement}
     *   Resulting hast node.
     */
    function defaultUnknownHandler(state, node) {
      const data = node.data || {};
      /** @type {HastText | HastElement} */
      const result =
        'value' in node &&
        !(own$4.call(data, 'hProperties') || own$4.call(data, 'hChildren'))
          ? {type: 'text', value: node.value}
          : {
              type: 'element',
              tagName: 'div',
              properties: {},
              children: all(state, node)
            };

      state.patch(node, result);
      return state.applyData(node, result)
    }

    /**
     * Wrap `nodes` with line endings between each node.
     *
     * @template {HastContent} Type
     *   Node type.
     * @param {Array<Type>} nodes
     *   List of nodes to wrap.
     * @param {boolean | null | undefined} [loose=false]
     *   Whether to add line endings at start and end.
     * @returns {Array<Type | HastText>}
     *   Wrapped nodes.
     */
    function wrap(nodes, loose) {
      /** @type {Array<Type | HastText>} */
      const result = [];
      let index = -1;

      if (loose) {
        result.push({type: 'text', value: '\n'});
      }

      while (++index < nodes.length) {
        if (index) result.push({type: 'text', value: '\n'});
        result.push(nodes[index]);
      }

      if (loose && nodes.length > 0) {
        result.push({type: 'text', value: '\n'});
      }

      return result
    }

    /**
     * @typedef {import('hast').Element} Element
     * @typedef {import('hast').ElementContent} ElementContent
     *
     * @typedef {import('./state.js').State} State
     */

    /**
     * Generate a hast footer for called footnote definitions.
     *
     * @param {State} state
     *   Info passed around.
     * @returns {Element | undefined}
     *   `section` element or `undefined`.
     */
    function footer(state) {
      /** @type {Array<ElementContent>} */
      const listItems = [];
      let index = -1;

      while (++index < state.footnoteOrder.length) {
        const def = state.footnoteById[state.footnoteOrder[index]];

        if (!def) {
          continue
        }

        const content = state.all(def);
        const id = String(def.identifier).toUpperCase();
        const safeId = normalizeUri(id.toLowerCase());
        let referenceIndex = 0;
        /** @type {Array<ElementContent>} */
        const backReferences = [];

        while (++referenceIndex <= state.footnoteCounts[id]) {
          /** @type {Element} */
          const backReference = {
            type: 'element',
            tagName: 'a',
            properties: {
              href:
                '#' +
                state.clobberPrefix +
                'fnref-' +
                safeId +
                (referenceIndex > 1 ? '-' + referenceIndex : ''),
              dataFootnoteBackref: true,
              className: ['data-footnote-backref'],
              ariaLabel: state.footnoteBackLabel
            },
            children: [{type: 'text', value: '↩'}]
          };

          if (referenceIndex > 1) {
            backReference.children.push({
              type: 'element',
              tagName: 'sup',
              children: [{type: 'text', value: String(referenceIndex)}]
            });
          }

          if (backReferences.length > 0) {
            backReferences.push({type: 'text', value: ' '});
          }

          backReferences.push(backReference);
        }

        const tail = content[content.length - 1];

        if (tail && tail.type === 'element' && tail.tagName === 'p') {
          const tailTail = tail.children[tail.children.length - 1];
          if (tailTail && tailTail.type === 'text') {
            tailTail.value += ' ';
          } else {
            tail.children.push({type: 'text', value: ' '});
          }

          tail.children.push(...backReferences);
        } else {
          content.push(...backReferences);
        }

        /** @type {Element} */
        const listItem = {
          type: 'element',
          tagName: 'li',
          properties: {id: state.clobberPrefix + 'fn-' + safeId},
          children: state.wrap(content, true)
        };

        state.patch(def, listItem);

        listItems.push(listItem);
      }

      if (listItems.length === 0) {
        return
      }

      return {
        type: 'element',
        tagName: 'section',
        properties: {dataFootnotes: true, className: ['footnotes']},
        children: [
          {
            type: 'element',
            tagName: state.footnoteLabelTagName,
            properties: {
              // To do: use structured clone.
              ...JSON.parse(JSON.stringify(state.footnoteLabelProperties)),
              id: 'footnote-label'
            },
            children: [{type: 'text', value: state.footnoteLabel}]
          },
          {type: 'text', value: '\n'},
          {
            type: 'element',
            tagName: 'ol',
            properties: {},
            children: state.wrap(listItems, true)
          },
          {type: 'text', value: '\n'}
        ]
      }
    }

    /**
     * @typedef {import('hast').Content} HastContent
     * @typedef {import('hast').Root} HastRoot
     *
     * @typedef {import('mdast').Content} MdastContent
     * @typedef {import('mdast').Root} MdastRoot
     *
     * @typedef {import('./state.js').Options} Options
     */

    /**
     * Transform mdast to hast.
     *
     * ##### Notes
     *
     * ###### HTML
     *
     * Raw HTML is available in mdast as `html` nodes and can be embedded in hast
     * as semistandard `raw` nodes.
     * Most utilities ignore `raw` nodes but two notable ones don’t:
     *
     * *   `hast-util-to-html` also has an option `allowDangerousHtml` which will
     *     output the raw HTML.
     *     This is typically discouraged as noted by the option name but is useful
     *     if you completely trust authors
     * *   `hast-util-raw` can handle the raw embedded HTML strings by parsing them
     *     into standard hast nodes (`element`, `text`, etc).
     *     This is a heavy task as it needs a full HTML parser, but it is the only
     *     way to support untrusted content
     *
     * ###### Footnotes
     *
     * Many options supported here relate to footnotes.
     * Footnotes are not specified by CommonMark, which we follow by default.
     * They are supported by GitHub, so footnotes can be enabled in markdown with
     * `mdast-util-gfm`.
     *
     * The options `footnoteBackLabel` and `footnoteLabel` define natural language
     * that explains footnotes, which is hidden for sighted users but shown to
     * assistive technology.
     * When your page is not in English, you must define translated values.
     *
     * Back references use ARIA attributes, but the section label itself uses a
     * heading that is hidden with an `sr-only` class.
     * To show it to sighted users, define different attributes in
     * `footnoteLabelProperties`.
     *
     * ###### Clobbering
     *
     * Footnotes introduces a problem, as it links footnote calls to footnote
     * definitions on the page through `id` attributes generated from user content,
     * which results in DOM clobbering.
     *
     * DOM clobbering is this:
     *
     * ```html
     * <p id=x></p>
     * <script>alert(x) // `x` now refers to the DOM `p#x` element</script>
     * ```
     *
     * Elements by their ID are made available by browsers on the `window` object,
     * which is a security risk.
     * Using a prefix solves this problem.
     *
     * More information on how to handle clobbering and the prefix is explained in
     * Example: headings (DOM clobbering) in `rehype-sanitize`.
     *
     * ###### Unknown nodes
     *
     * Unknown nodes are nodes with a type that isn’t in `handlers` or `passThrough`.
     * The default behavior for unknown nodes is:
     *
     * *   when the node has a `value` (and doesn’t have `data.hName`,
     *     `data.hProperties`, or `data.hChildren`, see later), create a hast `text`
     *     node
     * *   otherwise, create a `<div>` element (which could be changed with
     *     `data.hName`), with its children mapped from mdast to hast as well
     *
     * This behavior can be changed by passing an `unknownHandler`.
     *
     * @param {MdastNodes} tree
     *   mdast tree.
     * @param {Options | null | undefined} [options]
     *   Configuration.
     * @returns {HastNodes | null | undefined}
     *   hast tree.
     */
    // To do: next major: always return a single `root`.
    function toHast(tree, options) {
      const state = createState(tree, options);
      const node = state.one(tree, null);
      const foot = footer(state);

      if (foot) {
        // @ts-expect-error If there’s a footer, there were definitions, meaning block
        // content.
        // So assume `node` is a parent node.
        node.children.push({type: 'text', value: '\n'}, foot);
      }

      // To do: next major: always return root?
      return Array.isArray(node) ? {type: 'root', children: node} : node
    }

    /**
     * @typedef {import('hast').Root} HastRoot
     * @typedef {import('mdast').Root} MdastRoot
     * @typedef {import('mdast-util-to-hast').Options} Options
     * @typedef {import('unified').Processor<any, any, any, any>} Processor
     *
     * @typedef {import('mdast-util-to-hast')} DoNotTouchAsThisImportIncludesRawInTree
     */

    // Note: the `<MdastRoot, HastRoot>` overload doesn’t seem to work :'(

    /**
     * Plugin that turns markdown into HTML to support rehype.
     *
     * *   If a destination processor is given, that processor runs with a new HTML
     *     (hast) tree (bridge-mode).
     *     As the given processor runs with a hast tree, and rehype plugins support
     *     hast, that means rehype plugins can be used with the given processor.
     *     The hast tree is discarded in the end.
     *     It’s highly unlikely that you want to do this.
     * *   The common case is to not pass a destination processor, in which case the
     *     current processor continues running with a new HTML (hast) tree
     *     (mutate-mode).
     *     As the current processor continues with a hast tree, and rehype plugins
     *     support hast, that means rehype plugins can be used after
     *     `remark-rehype`.
     *     It’s likely that this is what you want to do.
     *
     * @param destination
     *   Optional unified processor.
     * @param options
     *   Options passed to `mdast-util-to-hast`.
     */
    const remarkRehype =
      /** @type {(import('unified').Plugin<[Processor, Options?]|[null|undefined, Options?]|[Options]|[], MdastRoot>)} */
      (
        function (destination, options) {
          return destination && 'run' in destination
            ? bridge(destination, options)
            : mutate(destination || options)
        }
      );

    var remarkRehype$1 = remarkRehype;

    /**
     * Bridge-mode.
     * Runs the destination with the new hast tree.
     *
     * @type {import('unified').Plugin<[Processor, Options?], MdastRoot>}
     */
    function bridge(destination, options) {
      return (node, file, next) => {
        destination.run(toHast(node, options), file, (error) => {
          next(error);
        });
      }
    }

    /**
     * Mutate-mode.
     * Further plugins run on the hast tree.
     *
     * @type {import('unified').Plugin<[Options?]|void[], MdastRoot, HastRoot>}
     */
    function mutate(options) {
      // @ts-expect-error: assume a corresponding node is returned by `toHast`.
      return (node) => toHast(node, options)
    }

    var propTypes$2 = {exports: {}};

    var reactIs_production_min$1 = {};

    /** @license React v16.13.1
     * react-is.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var b$1="function"===typeof Symbol&&Symbol.for,c$1=b$1?Symbol.for("react.element"):60103,d$1=b$1?Symbol.for("react.portal"):60106,e$1=b$1?Symbol.for("react.fragment"):60107,f$1=b$1?Symbol.for("react.strict_mode"):60108,g$1=b$1?Symbol.for("react.profiler"):60114,h$1=b$1?Symbol.for("react.provider"):60109,k$1=b$1?Symbol.for("react.context"):60110,l$1=b$1?Symbol.for("react.async_mode"):60111,m$1=b$1?Symbol.for("react.concurrent_mode"):60111,n$1=b$1?Symbol.for("react.forward_ref"):60112,p$1=b$1?Symbol.for("react.suspense"):60113,q$1=b$1?
    Symbol.for("react.suspense_list"):60120,r=b$1?Symbol.for("react.memo"):60115,t$1=b$1?Symbol.for("react.lazy"):60116,v$1=b$1?Symbol.for("react.block"):60121,w=b$1?Symbol.for("react.fundamental"):60117,x=b$1?Symbol.for("react.responder"):60118,y=b$1?Symbol.for("react.scope"):60119;
    function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c$1:switch(a=a.type,a){case l$1:case m$1:case e$1:case g$1:case f$1:case p$1:return a;default:switch(a=a&&a.$$typeof,a){case k$1:case n$1:case t$1:case r:case h$1:return a;default:return u}}case d$1:return u}}}function A(a){return z(a)===m$1}reactIs_production_min$1.AsyncMode=l$1;reactIs_production_min$1.ConcurrentMode=m$1;reactIs_production_min$1.ContextConsumer=k$1;reactIs_production_min$1.ContextProvider=h$1;reactIs_production_min$1.Element=c$1;reactIs_production_min$1.ForwardRef=n$1;reactIs_production_min$1.Fragment=e$1;reactIs_production_min$1.Lazy=t$1;reactIs_production_min$1.Memo=r;reactIs_production_min$1.Portal=d$1;
    reactIs_production_min$1.Profiler=g$1;reactIs_production_min$1.StrictMode=f$1;reactIs_production_min$1.Suspense=p$1;reactIs_production_min$1.isAsyncMode=function(a){return A(a)||z(a)===l$1};reactIs_production_min$1.isConcurrentMode=A;reactIs_production_min$1.isContextConsumer=function(a){return z(a)===k$1};reactIs_production_min$1.isContextProvider=function(a){return z(a)===h$1};reactIs_production_min$1.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c$1};reactIs_production_min$1.isForwardRef=function(a){return z(a)===n$1};reactIs_production_min$1.isFragment=function(a){return z(a)===e$1};reactIs_production_min$1.isLazy=function(a){return z(a)===t$1};
    reactIs_production_min$1.isMemo=function(a){return z(a)===r};reactIs_production_min$1.isPortal=function(a){return z(a)===d$1};reactIs_production_min$1.isProfiler=function(a){return z(a)===g$1};reactIs_production_min$1.isStrictMode=function(a){return z(a)===f$1};reactIs_production_min$1.isSuspense=function(a){return z(a)===p$1};
    reactIs_production_min$1.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e$1||a===m$1||a===g$1||a===f$1||a===p$1||a===q$1||"object"===typeof a&&null!==a&&(a.$$typeof===t$1||a.$$typeof===r||a.$$typeof===h$1||a.$$typeof===k$1||a.$$typeof===n$1||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v$1)};reactIs_production_min$1.typeOf=z;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

    var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactPropTypesSecret = ReactPropTypesSecret_1;

    function emptyFunction() {}
    function emptyFunctionWithReset() {}
    emptyFunctionWithReset.resetWarningCache = emptyFunction;

    var factoryWithThrowingShims = function() {
      function shim(props, propName, componentName, location, propFullName, secret) {
        if (secret === ReactPropTypesSecret) {
          // It is still safe when called from React.
          return;
        }
        var err = new Error(
          'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
          'Use PropTypes.checkPropTypes() to call them. ' +
          'Read more at http://fb.me/use-check-prop-types'
        );
        err.name = 'Invariant Violation';
        throw err;
      }  shim.isRequired = shim;
      function getShim() {
        return shim;
      }  // Important!
      // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
      var ReactPropTypes = {
        array: shim,
        bigint: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,

        any: shim,
        arrayOf: getShim,
        element: shim,
        elementType: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim,
        exact: getShim,

        checkPropTypes: emptyFunctionWithReset,
        resetWarningCache: emptyFunction
      };

      ReactPropTypes.PropTypes = ReactPropTypes;

      return ReactPropTypes;
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    {
      // By explicitly using `prop-types` you are opting into new production behavior.
      // http://fb.me/prop-types-in-prod
      propTypes$2.exports = factoryWithThrowingShims();
    }

    var PropTypes = propTypes$2.exports;

    /**
     * @typedef {import('./info.js').Info} Info
     * @typedef {Record<string, Info>} Properties
     * @typedef {Record<string, string>} Normal
     */

    class Schema {
      /**
       * @constructor
       * @param {Properties} property
       * @param {Normal} normal
       * @param {string} [space]
       */
      constructor(property, normal, space) {
        this.property = property;
        this.normal = normal;
        if (space) {
          this.space = space;
        }
      }
    }

    /** @type {Properties} */
    Schema.prototype.property = {};
    /** @type {Normal} */
    Schema.prototype.normal = {};
    /** @type {string|null} */
    Schema.prototype.space = null;

    /**
     * @typedef {import('./schema.js').Properties} Properties
     * @typedef {import('./schema.js').Normal} Normal
     */

    /**
     * @param {Schema[]} definitions
     * @param {string} [space]
     * @returns {Schema}
     */
    function merge(definitions, space) {
      /** @type {Properties} */
      const property = {};
      /** @type {Normal} */
      const normal = {};
      let index = -1;

      while (++index < definitions.length) {
        Object.assign(property, definitions[index].property);
        Object.assign(normal, definitions[index].normal);
      }

      return new Schema(property, normal, space)
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    function normalize(value) {
      return value.toLowerCase()
    }

    class Info {
      /**
       * @constructor
       * @param {string} property
       * @param {string} attribute
       */
      constructor(property, attribute) {
        /** @type {string} */
        this.property = property;
        /** @type {string} */
        this.attribute = attribute;
      }
    }

    /** @type {string|null} */
    Info.prototype.space = null;
    Info.prototype.boolean = false;
    Info.prototype.booleanish = false;
    Info.prototype.overloadedBoolean = false;
    Info.prototype.number = false;
    Info.prototype.commaSeparated = false;
    Info.prototype.spaceSeparated = false;
    Info.prototype.commaOrSpaceSeparated = false;
    Info.prototype.mustUseProperty = false;
    Info.prototype.defined = false;

    let powers = 0;

    const boolean = increment();
    const booleanish = increment();
    const overloadedBoolean = increment();
    const number = increment();
    const spaceSeparated = increment();
    const commaSeparated = increment();
    const commaOrSpaceSeparated = increment();

    function increment() {
      return 2 ** ++powers
    }

    var types = /*#__PURE__*/Object.freeze({
        __proto__: null,
        boolean: boolean,
        booleanish: booleanish,
        overloadedBoolean: overloadedBoolean,
        number: number,
        spaceSeparated: spaceSeparated,
        commaSeparated: commaSeparated,
        commaOrSpaceSeparated: commaOrSpaceSeparated
    });

    /** @type {Array<keyof types>} */
    // @ts-expect-error: hush.
    const checks = Object.keys(types);

    class DefinedInfo extends Info {
      /**
       * @constructor
       * @param {string} property
       * @param {string} attribute
       * @param {number|null} [mask]
       * @param {string} [space]
       */
      constructor(property, attribute, mask, space) {
        let index = -1;

        super(property, attribute);

        mark(this, 'space', space);

        if (typeof mask === 'number') {
          while (++index < checks.length) {
            const check = checks[index];
            mark(this, checks[index], (mask & types[check]) === types[check]);
          }
        }
      }
    }

    DefinedInfo.prototype.defined = true;

    /**
     * @param {DefinedInfo} values
     * @param {string} key
     * @param {unknown} value
     */
    function mark(values, key, value) {
      if (value) {
        // @ts-expect-error: assume `value` matches the expected value of `key`.
        values[key] = value;
      }
    }

    /**
     * @typedef {import('./schema.js').Properties} Properties
     * @typedef {import('./schema.js').Normal} Normal
     *
     * @typedef {Record<string, string>} Attributes
     *
     * @typedef {Object} Definition
     * @property {Record<string, number|null>} properties
     * @property {(attributes: Attributes, property: string) => string} transform
     * @property {string} [space]
     * @property {Attributes} [attributes]
     * @property {Array<string>} [mustUseProperty]
     */

    const own$3 = {}.hasOwnProperty;

    /**
     * @param {Definition} definition
     * @returns {Schema}
     */
    function create(definition) {
      /** @type {Properties} */
      const property = {};
      /** @type {Normal} */
      const normal = {};
      /** @type {string} */
      let prop;

      for (prop in definition.properties) {
        if (own$3.call(definition.properties, prop)) {
          const value = definition.properties[prop];
          const info = new DefinedInfo(
            prop,
            definition.transform(definition.attributes || {}, prop),
            value,
            definition.space
          );

          if (
            definition.mustUseProperty &&
            definition.mustUseProperty.includes(prop)
          ) {
            info.mustUseProperty = true;
          }

          property[prop] = info;

          normal[normalize(prop)] = prop;
          normal[normalize(info.attribute)] = prop;
        }
      }

      return new Schema(property, normal, definition.space)
    }

    const xlink = create({
      space: 'xlink',
      transform(_, prop) {
        return 'xlink:' + prop.slice(5).toLowerCase()
      },
      properties: {
        xLinkActuate: null,
        xLinkArcRole: null,
        xLinkHref: null,
        xLinkRole: null,
        xLinkShow: null,
        xLinkTitle: null,
        xLinkType: null
      }
    });

    const xml = create({
      space: 'xml',
      transform(_, prop) {
        return 'xml:' + prop.slice(3).toLowerCase()
      },
      properties: {xmlLang: null, xmlBase: null, xmlSpace: null}
    });

    /**
     * @param {Record<string, string>} attributes
     * @param {string} attribute
     * @returns {string}
     */
    function caseSensitiveTransform(attributes, attribute) {
      return attribute in attributes ? attributes[attribute] : attribute
    }

    /**
     * @param {Record<string, string>} attributes
     * @param {string} property
     * @returns {string}
     */
    function caseInsensitiveTransform(attributes, property) {
      return caseSensitiveTransform(attributes, property.toLowerCase())
    }

    const xmlns = create({
      space: 'xmlns',
      attributes: {xmlnsxlink: 'xmlns:xlink'},
      transform: caseInsensitiveTransform,
      properties: {xmlns: null, xmlnsXLink: null}
    });

    const aria = create({
      transform(_, prop) {
        return prop === 'role' ? prop : 'aria-' + prop.slice(4).toLowerCase()
      },
      properties: {
        ariaActiveDescendant: null,
        ariaAtomic: booleanish,
        ariaAutoComplete: null,
        ariaBusy: booleanish,
        ariaChecked: booleanish,
        ariaColCount: number,
        ariaColIndex: number,
        ariaColSpan: number,
        ariaControls: spaceSeparated,
        ariaCurrent: null,
        ariaDescribedBy: spaceSeparated,
        ariaDetails: null,
        ariaDisabled: booleanish,
        ariaDropEffect: spaceSeparated,
        ariaErrorMessage: null,
        ariaExpanded: booleanish,
        ariaFlowTo: spaceSeparated,
        ariaGrabbed: booleanish,
        ariaHasPopup: null,
        ariaHidden: booleanish,
        ariaInvalid: null,
        ariaKeyShortcuts: null,
        ariaLabel: null,
        ariaLabelledBy: spaceSeparated,
        ariaLevel: number,
        ariaLive: null,
        ariaModal: booleanish,
        ariaMultiLine: booleanish,
        ariaMultiSelectable: booleanish,
        ariaOrientation: null,
        ariaOwns: spaceSeparated,
        ariaPlaceholder: null,
        ariaPosInSet: number,
        ariaPressed: booleanish,
        ariaReadOnly: booleanish,
        ariaRelevant: null,
        ariaRequired: booleanish,
        ariaRoleDescription: spaceSeparated,
        ariaRowCount: number,
        ariaRowIndex: number,
        ariaRowSpan: number,
        ariaSelected: booleanish,
        ariaSetSize: number,
        ariaSort: null,
        ariaValueMax: number,
        ariaValueMin: number,
        ariaValueNow: number,
        ariaValueText: null,
        role: null
      }
    });

    const html$1 = create({
      space: 'html',
      attributes: {
        acceptcharset: 'accept-charset',
        classname: 'class',
        htmlfor: 'for',
        httpequiv: 'http-equiv'
      },
      transform: caseInsensitiveTransform,
      mustUseProperty: ['checked', 'multiple', 'muted', 'selected'],
      properties: {
        // Standard Properties.
        abbr: null,
        accept: commaSeparated,
        acceptCharset: spaceSeparated,
        accessKey: spaceSeparated,
        action: null,
        allow: null,
        allowFullScreen: boolean,
        allowPaymentRequest: boolean,
        allowUserMedia: boolean,
        alt: null,
        as: null,
        async: boolean,
        autoCapitalize: null,
        autoComplete: spaceSeparated,
        autoFocus: boolean,
        autoPlay: boolean,
        blocking: spaceSeparated,
        capture: null,
        charSet: null,
        checked: boolean,
        cite: null,
        className: spaceSeparated,
        cols: number,
        colSpan: null,
        content: null,
        contentEditable: booleanish,
        controls: boolean,
        controlsList: spaceSeparated,
        coords: number | commaSeparated,
        crossOrigin: null,
        data: null,
        dateTime: null,
        decoding: null,
        default: boolean,
        defer: boolean,
        dir: null,
        dirName: null,
        disabled: boolean,
        download: overloadedBoolean,
        draggable: booleanish,
        encType: null,
        enterKeyHint: null,
        fetchPriority: null,
        form: null,
        formAction: null,
        formEncType: null,
        formMethod: null,
        formNoValidate: boolean,
        formTarget: null,
        headers: spaceSeparated,
        height: number,
        hidden: boolean,
        high: number,
        href: null,
        hrefLang: null,
        htmlFor: spaceSeparated,
        httpEquiv: spaceSeparated,
        id: null,
        imageSizes: null,
        imageSrcSet: null,
        inert: boolean,
        inputMode: null,
        integrity: null,
        is: null,
        isMap: boolean,
        itemId: null,
        itemProp: spaceSeparated,
        itemRef: spaceSeparated,
        itemScope: boolean,
        itemType: spaceSeparated,
        kind: null,
        label: null,
        lang: null,
        language: null,
        list: null,
        loading: null,
        loop: boolean,
        low: number,
        manifest: null,
        max: null,
        maxLength: number,
        media: null,
        method: null,
        min: null,
        minLength: number,
        multiple: boolean,
        muted: boolean,
        name: null,
        nonce: null,
        noModule: boolean,
        noValidate: boolean,
        onAbort: null,
        onAfterPrint: null,
        onAuxClick: null,
        onBeforeMatch: null,
        onBeforePrint: null,
        onBeforeToggle: null,
        onBeforeUnload: null,
        onBlur: null,
        onCancel: null,
        onCanPlay: null,
        onCanPlayThrough: null,
        onChange: null,
        onClick: null,
        onClose: null,
        onContextLost: null,
        onContextMenu: null,
        onContextRestored: null,
        onCopy: null,
        onCueChange: null,
        onCut: null,
        onDblClick: null,
        onDrag: null,
        onDragEnd: null,
        onDragEnter: null,
        onDragExit: null,
        onDragLeave: null,
        onDragOver: null,
        onDragStart: null,
        onDrop: null,
        onDurationChange: null,
        onEmptied: null,
        onEnded: null,
        onError: null,
        onFocus: null,
        onFormData: null,
        onHashChange: null,
        onInput: null,
        onInvalid: null,
        onKeyDown: null,
        onKeyPress: null,
        onKeyUp: null,
        onLanguageChange: null,
        onLoad: null,
        onLoadedData: null,
        onLoadedMetadata: null,
        onLoadEnd: null,
        onLoadStart: null,
        onMessage: null,
        onMessageError: null,
        onMouseDown: null,
        onMouseEnter: null,
        onMouseLeave: null,
        onMouseMove: null,
        onMouseOut: null,
        onMouseOver: null,
        onMouseUp: null,
        onOffline: null,
        onOnline: null,
        onPageHide: null,
        onPageShow: null,
        onPaste: null,
        onPause: null,
        onPlay: null,
        onPlaying: null,
        onPopState: null,
        onProgress: null,
        onRateChange: null,
        onRejectionHandled: null,
        onReset: null,
        onResize: null,
        onScroll: null,
        onScrollEnd: null,
        onSecurityPolicyViolation: null,
        onSeeked: null,
        onSeeking: null,
        onSelect: null,
        onSlotChange: null,
        onStalled: null,
        onStorage: null,
        onSubmit: null,
        onSuspend: null,
        onTimeUpdate: null,
        onToggle: null,
        onUnhandledRejection: null,
        onUnload: null,
        onVolumeChange: null,
        onWaiting: null,
        onWheel: null,
        open: boolean,
        optimum: number,
        pattern: null,
        ping: spaceSeparated,
        placeholder: null,
        playsInline: boolean,
        popover: null,
        popoverTarget: null,
        popoverTargetAction: null,
        poster: null,
        preload: null,
        readOnly: boolean,
        referrerPolicy: null,
        rel: spaceSeparated,
        required: boolean,
        reversed: boolean,
        rows: number,
        rowSpan: number,
        sandbox: spaceSeparated,
        scope: null,
        scoped: boolean,
        seamless: boolean,
        selected: boolean,
        shadowRootDelegatesFocus: boolean,
        shadowRootMode: null,
        shape: null,
        size: number,
        sizes: null,
        slot: null,
        span: number,
        spellCheck: booleanish,
        src: null,
        srcDoc: null,
        srcLang: null,
        srcSet: null,
        start: number,
        step: null,
        style: null,
        tabIndex: number,
        target: null,
        title: null,
        translate: null,
        type: null,
        typeMustMatch: boolean,
        useMap: null,
        value: booleanish,
        width: number,
        wrap: null,

        // Legacy.
        // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
        align: null, // Several. Use CSS `text-align` instead,
        aLink: null, // `<body>`. Use CSS `a:active {color}` instead
        archive: spaceSeparated, // `<object>`. List of URIs to archives
        axis: null, // `<td>` and `<th>`. Use `scope` on `<th>`
        background: null, // `<body>`. Use CSS `background-image` instead
        bgColor: null, // `<body>` and table elements. Use CSS `background-color` instead
        border: number, // `<table>`. Use CSS `border-width` instead,
        borderColor: null, // `<table>`. Use CSS `border-color` instead,
        bottomMargin: number, // `<body>`
        cellPadding: null, // `<table>`
        cellSpacing: null, // `<table>`
        char: null, // Several table elements. When `align=char`, sets the character to align on
        charOff: null, // Several table elements. When `char`, offsets the alignment
        classId: null, // `<object>`
        clear: null, // `<br>`. Use CSS `clear` instead
        code: null, // `<object>`
        codeBase: null, // `<object>`
        codeType: null, // `<object>`
        color: null, // `<font>` and `<hr>`. Use CSS instead
        compact: boolean, // Lists. Use CSS to reduce space between items instead
        declare: boolean, // `<object>`
        event: null, // `<script>`
        face: null, // `<font>`. Use CSS instead
        frame: null, // `<table>`
        frameBorder: null, // `<iframe>`. Use CSS `border` instead
        hSpace: number, // `<img>` and `<object>`
        leftMargin: number, // `<body>`
        link: null, // `<body>`. Use CSS `a:link {color: *}` instead
        longDesc: null, // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
        lowSrc: null, // `<img>`. Use a `<picture>`
        marginHeight: number, // `<body>`
        marginWidth: number, // `<body>`
        noResize: boolean, // `<frame>`
        noHref: boolean, // `<area>`. Use no href instead of an explicit `nohref`
        noShade: boolean, // `<hr>`. Use background-color and height instead of borders
        noWrap: boolean, // `<td>` and `<th>`
        object: null, // `<applet>`
        profile: null, // `<head>`
        prompt: null, // `<isindex>`
        rev: null, // `<link>`
        rightMargin: number, // `<body>`
        rules: null, // `<table>`
        scheme: null, // `<meta>`
        scrolling: booleanish, // `<frame>`. Use overflow in the child context
        standby: null, // `<object>`
        summary: null, // `<table>`
        text: null, // `<body>`. Use CSS `color` instead
        topMargin: number, // `<body>`
        valueType: null, // `<param>`
        version: null, // `<html>`. Use a doctype.
        vAlign: null, // Several. Use CSS `vertical-align` instead
        vLink: null, // `<body>`. Use CSS `a:visited {color}` instead
        vSpace: number, // `<img>` and `<object>`

        // Non-standard Properties.
        allowTransparency: null,
        autoCorrect: null,
        autoSave: null,
        disablePictureInPicture: boolean,
        disableRemotePlayback: boolean,
        prefix: null,
        property: null,
        results: number,
        security: null,
        unselectable: null
      }
    });

    const svg$1 = create({
      space: 'svg',
      attributes: {
        accentHeight: 'accent-height',
        alignmentBaseline: 'alignment-baseline',
        arabicForm: 'arabic-form',
        baselineShift: 'baseline-shift',
        capHeight: 'cap-height',
        className: 'class',
        clipPath: 'clip-path',
        clipRule: 'clip-rule',
        colorInterpolation: 'color-interpolation',
        colorInterpolationFilters: 'color-interpolation-filters',
        colorProfile: 'color-profile',
        colorRendering: 'color-rendering',
        crossOrigin: 'crossorigin',
        dataType: 'datatype',
        dominantBaseline: 'dominant-baseline',
        enableBackground: 'enable-background',
        fillOpacity: 'fill-opacity',
        fillRule: 'fill-rule',
        floodColor: 'flood-color',
        floodOpacity: 'flood-opacity',
        fontFamily: 'font-family',
        fontSize: 'font-size',
        fontSizeAdjust: 'font-size-adjust',
        fontStretch: 'font-stretch',
        fontStyle: 'font-style',
        fontVariant: 'font-variant',
        fontWeight: 'font-weight',
        glyphName: 'glyph-name',
        glyphOrientationHorizontal: 'glyph-orientation-horizontal',
        glyphOrientationVertical: 'glyph-orientation-vertical',
        hrefLang: 'hreflang',
        horizAdvX: 'horiz-adv-x',
        horizOriginX: 'horiz-origin-x',
        horizOriginY: 'horiz-origin-y',
        imageRendering: 'image-rendering',
        letterSpacing: 'letter-spacing',
        lightingColor: 'lighting-color',
        markerEnd: 'marker-end',
        markerMid: 'marker-mid',
        markerStart: 'marker-start',
        navDown: 'nav-down',
        navDownLeft: 'nav-down-left',
        navDownRight: 'nav-down-right',
        navLeft: 'nav-left',
        navNext: 'nav-next',
        navPrev: 'nav-prev',
        navRight: 'nav-right',
        navUp: 'nav-up',
        navUpLeft: 'nav-up-left',
        navUpRight: 'nav-up-right',
        onAbort: 'onabort',
        onActivate: 'onactivate',
        onAfterPrint: 'onafterprint',
        onBeforePrint: 'onbeforeprint',
        onBegin: 'onbegin',
        onCancel: 'oncancel',
        onCanPlay: 'oncanplay',
        onCanPlayThrough: 'oncanplaythrough',
        onChange: 'onchange',
        onClick: 'onclick',
        onClose: 'onclose',
        onCopy: 'oncopy',
        onCueChange: 'oncuechange',
        onCut: 'oncut',
        onDblClick: 'ondblclick',
        onDrag: 'ondrag',
        onDragEnd: 'ondragend',
        onDragEnter: 'ondragenter',
        onDragExit: 'ondragexit',
        onDragLeave: 'ondragleave',
        onDragOver: 'ondragover',
        onDragStart: 'ondragstart',
        onDrop: 'ondrop',
        onDurationChange: 'ondurationchange',
        onEmptied: 'onemptied',
        onEnd: 'onend',
        onEnded: 'onended',
        onError: 'onerror',
        onFocus: 'onfocus',
        onFocusIn: 'onfocusin',
        onFocusOut: 'onfocusout',
        onHashChange: 'onhashchange',
        onInput: 'oninput',
        onInvalid: 'oninvalid',
        onKeyDown: 'onkeydown',
        onKeyPress: 'onkeypress',
        onKeyUp: 'onkeyup',
        onLoad: 'onload',
        onLoadedData: 'onloadeddata',
        onLoadedMetadata: 'onloadedmetadata',
        onLoadStart: 'onloadstart',
        onMessage: 'onmessage',
        onMouseDown: 'onmousedown',
        onMouseEnter: 'onmouseenter',
        onMouseLeave: 'onmouseleave',
        onMouseMove: 'onmousemove',
        onMouseOut: 'onmouseout',
        onMouseOver: 'onmouseover',
        onMouseUp: 'onmouseup',
        onMouseWheel: 'onmousewheel',
        onOffline: 'onoffline',
        onOnline: 'ononline',
        onPageHide: 'onpagehide',
        onPageShow: 'onpageshow',
        onPaste: 'onpaste',
        onPause: 'onpause',
        onPlay: 'onplay',
        onPlaying: 'onplaying',
        onPopState: 'onpopstate',
        onProgress: 'onprogress',
        onRateChange: 'onratechange',
        onRepeat: 'onrepeat',
        onReset: 'onreset',
        onResize: 'onresize',
        onScroll: 'onscroll',
        onSeeked: 'onseeked',
        onSeeking: 'onseeking',
        onSelect: 'onselect',
        onShow: 'onshow',
        onStalled: 'onstalled',
        onStorage: 'onstorage',
        onSubmit: 'onsubmit',
        onSuspend: 'onsuspend',
        onTimeUpdate: 'ontimeupdate',
        onToggle: 'ontoggle',
        onUnload: 'onunload',
        onVolumeChange: 'onvolumechange',
        onWaiting: 'onwaiting',
        onZoom: 'onzoom',
        overlinePosition: 'overline-position',
        overlineThickness: 'overline-thickness',
        paintOrder: 'paint-order',
        panose1: 'panose-1',
        pointerEvents: 'pointer-events',
        referrerPolicy: 'referrerpolicy',
        renderingIntent: 'rendering-intent',
        shapeRendering: 'shape-rendering',
        stopColor: 'stop-color',
        stopOpacity: 'stop-opacity',
        strikethroughPosition: 'strikethrough-position',
        strikethroughThickness: 'strikethrough-thickness',
        strokeDashArray: 'stroke-dasharray',
        strokeDashOffset: 'stroke-dashoffset',
        strokeLineCap: 'stroke-linecap',
        strokeLineJoin: 'stroke-linejoin',
        strokeMiterLimit: 'stroke-miterlimit',
        strokeOpacity: 'stroke-opacity',
        strokeWidth: 'stroke-width',
        tabIndex: 'tabindex',
        textAnchor: 'text-anchor',
        textDecoration: 'text-decoration',
        textRendering: 'text-rendering',
        transformOrigin: 'transform-origin',
        typeOf: 'typeof',
        underlinePosition: 'underline-position',
        underlineThickness: 'underline-thickness',
        unicodeBidi: 'unicode-bidi',
        unicodeRange: 'unicode-range',
        unitsPerEm: 'units-per-em',
        vAlphabetic: 'v-alphabetic',
        vHanging: 'v-hanging',
        vIdeographic: 'v-ideographic',
        vMathematical: 'v-mathematical',
        vectorEffect: 'vector-effect',
        vertAdvY: 'vert-adv-y',
        vertOriginX: 'vert-origin-x',
        vertOriginY: 'vert-origin-y',
        wordSpacing: 'word-spacing',
        writingMode: 'writing-mode',
        xHeight: 'x-height',
        // These were camelcased in Tiny. Now lowercased in SVG 2
        playbackOrder: 'playbackorder',
        timelineBegin: 'timelinebegin'
      },
      transform: caseSensitiveTransform,
      properties: {
        about: commaOrSpaceSeparated,
        accentHeight: number,
        accumulate: null,
        additive: null,
        alignmentBaseline: null,
        alphabetic: number,
        amplitude: number,
        arabicForm: null,
        ascent: number,
        attributeName: null,
        attributeType: null,
        azimuth: number,
        bandwidth: null,
        baselineShift: null,
        baseFrequency: null,
        baseProfile: null,
        bbox: null,
        begin: null,
        bias: number,
        by: null,
        calcMode: null,
        capHeight: number,
        className: spaceSeparated,
        clip: null,
        clipPath: null,
        clipPathUnits: null,
        clipRule: null,
        color: null,
        colorInterpolation: null,
        colorInterpolationFilters: null,
        colorProfile: null,
        colorRendering: null,
        content: null,
        contentScriptType: null,
        contentStyleType: null,
        crossOrigin: null,
        cursor: null,
        cx: null,
        cy: null,
        d: null,
        dataType: null,
        defaultAction: null,
        descent: number,
        diffuseConstant: number,
        direction: null,
        display: null,
        dur: null,
        divisor: number,
        dominantBaseline: null,
        download: boolean,
        dx: null,
        dy: null,
        edgeMode: null,
        editable: null,
        elevation: number,
        enableBackground: null,
        end: null,
        event: null,
        exponent: number,
        externalResourcesRequired: null,
        fill: null,
        fillOpacity: number,
        fillRule: null,
        filter: null,
        filterRes: null,
        filterUnits: null,
        floodColor: null,
        floodOpacity: null,
        focusable: null,
        focusHighlight: null,
        fontFamily: null,
        fontSize: null,
        fontSizeAdjust: null,
        fontStretch: null,
        fontStyle: null,
        fontVariant: null,
        fontWeight: null,
        format: null,
        fr: null,
        from: null,
        fx: null,
        fy: null,
        g1: commaSeparated,
        g2: commaSeparated,
        glyphName: commaSeparated,
        glyphOrientationHorizontal: null,
        glyphOrientationVertical: null,
        glyphRef: null,
        gradientTransform: null,
        gradientUnits: null,
        handler: null,
        hanging: number,
        hatchContentUnits: null,
        hatchUnits: null,
        height: null,
        href: null,
        hrefLang: null,
        horizAdvX: number,
        horizOriginX: number,
        horizOriginY: number,
        id: null,
        ideographic: number,
        imageRendering: null,
        initialVisibility: null,
        in: null,
        in2: null,
        intercept: number,
        k: number,
        k1: number,
        k2: number,
        k3: number,
        k4: number,
        kernelMatrix: commaOrSpaceSeparated,
        kernelUnitLength: null,
        keyPoints: null, // SEMI_COLON_SEPARATED
        keySplines: null, // SEMI_COLON_SEPARATED
        keyTimes: null, // SEMI_COLON_SEPARATED
        kerning: null,
        lang: null,
        lengthAdjust: null,
        letterSpacing: null,
        lightingColor: null,
        limitingConeAngle: number,
        local: null,
        markerEnd: null,
        markerMid: null,
        markerStart: null,
        markerHeight: null,
        markerUnits: null,
        markerWidth: null,
        mask: null,
        maskContentUnits: null,
        maskUnits: null,
        mathematical: null,
        max: null,
        media: null,
        mediaCharacterEncoding: null,
        mediaContentEncodings: null,
        mediaSize: number,
        mediaTime: null,
        method: null,
        min: null,
        mode: null,
        name: null,
        navDown: null,
        navDownLeft: null,
        navDownRight: null,
        navLeft: null,
        navNext: null,
        navPrev: null,
        navRight: null,
        navUp: null,
        navUpLeft: null,
        navUpRight: null,
        numOctaves: null,
        observer: null,
        offset: null,
        onAbort: null,
        onActivate: null,
        onAfterPrint: null,
        onBeforePrint: null,
        onBegin: null,
        onCancel: null,
        onCanPlay: null,
        onCanPlayThrough: null,
        onChange: null,
        onClick: null,
        onClose: null,
        onCopy: null,
        onCueChange: null,
        onCut: null,
        onDblClick: null,
        onDrag: null,
        onDragEnd: null,
        onDragEnter: null,
        onDragExit: null,
        onDragLeave: null,
        onDragOver: null,
        onDragStart: null,
        onDrop: null,
        onDurationChange: null,
        onEmptied: null,
        onEnd: null,
        onEnded: null,
        onError: null,
        onFocus: null,
        onFocusIn: null,
        onFocusOut: null,
        onHashChange: null,
        onInput: null,
        onInvalid: null,
        onKeyDown: null,
        onKeyPress: null,
        onKeyUp: null,
        onLoad: null,
        onLoadedData: null,
        onLoadedMetadata: null,
        onLoadStart: null,
        onMessage: null,
        onMouseDown: null,
        onMouseEnter: null,
        onMouseLeave: null,
        onMouseMove: null,
        onMouseOut: null,
        onMouseOver: null,
        onMouseUp: null,
        onMouseWheel: null,
        onOffline: null,
        onOnline: null,
        onPageHide: null,
        onPageShow: null,
        onPaste: null,
        onPause: null,
        onPlay: null,
        onPlaying: null,
        onPopState: null,
        onProgress: null,
        onRateChange: null,
        onRepeat: null,
        onReset: null,
        onResize: null,
        onScroll: null,
        onSeeked: null,
        onSeeking: null,
        onSelect: null,
        onShow: null,
        onStalled: null,
        onStorage: null,
        onSubmit: null,
        onSuspend: null,
        onTimeUpdate: null,
        onToggle: null,
        onUnload: null,
        onVolumeChange: null,
        onWaiting: null,
        onZoom: null,
        opacity: null,
        operator: null,
        order: null,
        orient: null,
        orientation: null,
        origin: null,
        overflow: null,
        overlay: null,
        overlinePosition: number,
        overlineThickness: number,
        paintOrder: null,
        panose1: null,
        path: null,
        pathLength: number,
        patternContentUnits: null,
        patternTransform: null,
        patternUnits: null,
        phase: null,
        ping: spaceSeparated,
        pitch: null,
        playbackOrder: null,
        pointerEvents: null,
        points: null,
        pointsAtX: number,
        pointsAtY: number,
        pointsAtZ: number,
        preserveAlpha: null,
        preserveAspectRatio: null,
        primitiveUnits: null,
        propagate: null,
        property: commaOrSpaceSeparated,
        r: null,
        radius: null,
        referrerPolicy: null,
        refX: null,
        refY: null,
        rel: commaOrSpaceSeparated,
        rev: commaOrSpaceSeparated,
        renderingIntent: null,
        repeatCount: null,
        repeatDur: null,
        requiredExtensions: commaOrSpaceSeparated,
        requiredFeatures: commaOrSpaceSeparated,
        requiredFonts: commaOrSpaceSeparated,
        requiredFormats: commaOrSpaceSeparated,
        resource: null,
        restart: null,
        result: null,
        rotate: null,
        rx: null,
        ry: null,
        scale: null,
        seed: null,
        shapeRendering: null,
        side: null,
        slope: null,
        snapshotTime: null,
        specularConstant: number,
        specularExponent: number,
        spreadMethod: null,
        spacing: null,
        startOffset: null,
        stdDeviation: null,
        stemh: null,
        stemv: null,
        stitchTiles: null,
        stopColor: null,
        stopOpacity: null,
        strikethroughPosition: number,
        strikethroughThickness: number,
        string: null,
        stroke: null,
        strokeDashArray: commaOrSpaceSeparated,
        strokeDashOffset: null,
        strokeLineCap: null,
        strokeLineJoin: null,
        strokeMiterLimit: number,
        strokeOpacity: number,
        strokeWidth: null,
        style: null,
        surfaceScale: number,
        syncBehavior: null,
        syncBehaviorDefault: null,
        syncMaster: null,
        syncTolerance: null,
        syncToleranceDefault: null,
        systemLanguage: commaOrSpaceSeparated,
        tabIndex: number,
        tableValues: null,
        target: null,
        targetX: number,
        targetY: number,
        textAnchor: null,
        textDecoration: null,
        textRendering: null,
        textLength: null,
        timelineBegin: null,
        title: null,
        transformBehavior: null,
        type: null,
        typeOf: commaOrSpaceSeparated,
        to: null,
        transform: null,
        transformOrigin: null,
        u1: null,
        u2: null,
        underlinePosition: number,
        underlineThickness: number,
        unicode: null,
        unicodeBidi: null,
        unicodeRange: null,
        unitsPerEm: number,
        values: null,
        vAlphabetic: number,
        vMathematical: number,
        vectorEffect: null,
        vHanging: number,
        vIdeographic: number,
        version: null,
        vertAdvY: number,
        vertOriginX: number,
        vertOriginY: number,
        viewBox: null,
        viewTarget: null,
        visibility: null,
        width: null,
        widths: null,
        wordSpacing: null,
        writingMode: null,
        x: null,
        x1: null,
        x2: null,
        xChannelSelector: null,
        xHeight: number,
        y: null,
        y1: null,
        y2: null,
        yChannelSelector: null,
        z: null,
        zoomAndPan: null
      }
    });

    /**
     * @typedef {import('./util/schema.js').Schema} Schema
     */

    const valid = /^data[-\w.:]+$/i;
    const dash = /-[a-z]/g;
    const cap = /[A-Z]/g;

    /**
     * @param {Schema} schema
     * @param {string} value
     * @returns {Info}
     */
    function find(schema, value) {
      const normal = normalize(value);
      let prop = value;
      let Type = Info;

      if (normal in schema.normal) {
        return schema.property[schema.normal[normal]]
      }

      if (normal.length > 4 && normal.slice(0, 4) === 'data' && valid.test(value)) {
        // Attribute or property.
        if (value.charAt(4) === '-') {
          // Turn it into a property.
          const rest = value.slice(5).replace(dash, camelcase);
          prop = 'data' + rest.charAt(0).toUpperCase() + rest.slice(1);
        } else {
          // Turn it into an attribute.
          const rest = value.slice(4);

          if (!dash.test(rest)) {
            let dashes = rest.replace(cap, kebab);

            if (dashes.charAt(0) !== '-') {
              dashes = '-' + dashes;
            }

            value = 'data' + dashes;
          }
        }

        Type = DefinedInfo;
      }

      return new Type(prop, value)
    }

    /**
     * @param {string} $0
     * @returns {string}
     */
    function kebab($0) {
      return '-' + $0.toLowerCase()
    }

    /**
     * @param {string} $0
     * @returns {string}
     */
    function camelcase($0) {
      return $0.charAt(1).toUpperCase()
    }

    /**
     * `hast` is close to `React`, but differs in a couple of cases.
     *
     * To get a React property from a hast property, check if it is in
     * `hastToReact`, if it is, then use the corresponding value,
     * otherwise, use the hast property.
     *
     * @type {Record<string, string>}
     */
    const hastToReact = {
      classId: 'classID',
      dataType: 'datatype',
      itemId: 'itemID',
      strokeDashArray: 'strokeDasharray',
      strokeDashOffset: 'strokeDashoffset',
      strokeLineCap: 'strokeLinecap',
      strokeLineJoin: 'strokeLinejoin',
      strokeMiterLimit: 'strokeMiterlimit',
      typeOf: 'typeof',
      xLinkActuate: 'xlinkActuate',
      xLinkArcRole: 'xlinkArcrole',
      xLinkHref: 'xlinkHref',
      xLinkRole: 'xlinkRole',
      xLinkShow: 'xlinkShow',
      xLinkTitle: 'xlinkTitle',
      xLinkType: 'xlinkType',
      xmlnsXLink: 'xmlnsXlink'
    };

    /**
     * @typedef {import('./lib/util/info.js').Info} Info
     * @typedef {import('./lib/util/schema.js').Schema} Schema
     */
    const html = merge([xml, xlink, xmlns, aria, html$1], 'html');
    const svg = merge([xml, xlink, xmlns, aria, svg$1], 'svg');

    /**
     * @typedef {import('unist').Node} Node
     * @typedef {import('hast').Root} Root
     * @typedef {import('hast').Element} Element
     *
     * @callback AllowElement
     * @param {Element} element
     * @param {number} index
     * @param {Element|Root} parent
     * @returns {boolean|undefined}
     *
     * @typedef Options
     * @property {Array<string>} [allowedElements]
     * @property {Array<string>} [disallowedElements=[]]
     * @property {AllowElement} [allowElement]
     * @property {boolean} [unwrapDisallowed=false]
     */

    /**
     * @type {import('unified').Plugin<[Options], Root>}
     */
    function rehypeFilter(options) {
      if (options.allowedElements && options.disallowedElements) {
        throw new TypeError(
          'Only one of `allowedElements` and `disallowedElements` should be defined'
        )
      }

      if (
        options.allowedElements ||
        options.disallowedElements ||
        options.allowElement
      ) {
        return (tree) => {
          visit(tree, 'element', (node, index, parent_) => {
            const parent = /** @type {Element|Root} */ (parent_);
            /** @type {boolean|undefined} */
            let remove;

            if (options.allowedElements) {
              remove = !options.allowedElements.includes(node.tagName);
            } else if (options.disallowedElements) {
              remove = options.disallowedElements.includes(node.tagName);
            }

            if (!remove && options.allowElement && typeof index === 'number') {
              remove = !options.allowElement(node, index, parent);
            }

            if (remove && typeof index === 'number') {
              if (options.unwrapDisallowed && node.children) {
                parent.children.splice(index, 1, ...node.children);
              } else {
                parent.children.splice(index, 1);
              }

              return index
            }

            return undefined
          });
        }
      }
    }

    var reactIs = {exports: {}};

    var reactIs_production_min = {};

    /**
     * @license React
     * react-is.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var b=Symbol.for("react.element"),c=Symbol.for("react.portal"),d=Symbol.for("react.fragment"),e=Symbol.for("react.strict_mode"),f=Symbol.for("react.profiler"),g=Symbol.for("react.provider"),h=Symbol.for("react.context"),k=Symbol.for("react.server_context"),l=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),n=Symbol.for("react.suspense_list"),p=Symbol.for("react.memo"),q=Symbol.for("react.lazy"),t=Symbol.for("react.offscreen"),u;u=Symbol.for("react.module.reference");
    function v(a){if("object"===typeof a&&null!==a){var r=a.$$typeof;switch(r){case b:switch(a=a.type,a){case d:case f:case e:case m:case n:return a;default:switch(a=a&&a.$$typeof,a){case k:case h:case l:case q:case p:case g:return a;default:return r}}case c:return r}}}reactIs_production_min.ContextConsumer=h;reactIs_production_min.ContextProvider=g;reactIs_production_min.Element=b;reactIs_production_min.ForwardRef=l;reactIs_production_min.Fragment=d;reactIs_production_min.Lazy=q;reactIs_production_min.Memo=p;reactIs_production_min.Portal=c;reactIs_production_min.Profiler=f;reactIs_production_min.StrictMode=e;reactIs_production_min.Suspense=m;
    reactIs_production_min.SuspenseList=n;reactIs_production_min.isAsyncMode=function(){return !1};reactIs_production_min.isConcurrentMode=function(){return !1};reactIs_production_min.isContextConsumer=function(a){return v(a)===h};reactIs_production_min.isContextProvider=function(a){return v(a)===g};reactIs_production_min.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===b};reactIs_production_min.isForwardRef=function(a){return v(a)===l};reactIs_production_min.isFragment=function(a){return v(a)===d};reactIs_production_min.isLazy=function(a){return v(a)===q};reactIs_production_min.isMemo=function(a){return v(a)===p};
    reactIs_production_min.isPortal=function(a){return v(a)===c};reactIs_production_min.isProfiler=function(a){return v(a)===f};reactIs_production_min.isStrictMode=function(a){return v(a)===e};reactIs_production_min.isSuspense=function(a){return v(a)===m};reactIs_production_min.isSuspenseList=function(a){return v(a)===n};
    reactIs_production_min.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===d||a===f||a===e||a===m||a===n||a===t||"object"===typeof a&&null!==a&&(a.$$typeof===q||a.$$typeof===p||a.$$typeof===g||a.$$typeof===h||a.$$typeof===l||a.$$typeof===u||void 0!==a.getModuleId)?!0:!1};reactIs_production_min.typeOf=v;

    {
      reactIs.exports = reactIs_production_min;
    }

    var ReactIs = reactIs.exports;

    /**
     * Check if the given value is *inter-element whitespace*.
     *
     * @param {unknown} thing
     *   Thing to check (typically `Node` or `string`).
     * @returns {boolean}
     *   Whether the `value` is inter-element whitespace (`boolean`): consisting of
     *   zero or more of space, tab (`\t`), line feed (`\n`), carriage return
     *   (`\r`), or form feed (`\f`).
     *   If a node is passed it must be a `Text` node, whose `value` field is
     *   checked.
     */
    function whitespace(thing) {
      /** @type {string} */
      const value =
        // @ts-expect-error looks like a node.
        thing && typeof thing === 'object' && thing.type === 'text'
          ? // @ts-expect-error looks like a text.
            thing.value || ''
          : thing;

      // HTML whitespace expression.
      // See <https://infra.spec.whatwg.org/#ascii-whitespace>.
      return typeof value === 'string' && value.replace(/[ \t\n\f\r]/g, '') === ''
    }

    /**
     * Parse space-separated tokens to an array of strings.
     *
     * @param {string} value
     *   Space-separated tokens.
     * @returns {Array<string>}
     *   List of tokens.
     */

    /**
     * Serialize an array of strings as space separated-tokens.
     *
     * @param {Array<string|number>} values
     *   List of tokens.
     * @returns {string}
     *   Space-separated tokens.
     */
    function stringify$1(values) {
      return values.join(' ').trim()
    }

    /**
     * @typedef Options
     *   Configuration for `stringify`.
     * @property {boolean} [padLeft=true]
     *   Whether to pad a space before a token.
     * @property {boolean} [padRight=false]
     *   Whether to pad a space after a token.
     */

    /**
     * Serialize an array of strings or numbers to comma-separated tokens.
     *
     * @param {Array<string|number>} values
     *   List of tokens.
     * @param {Options} [options]
     *   Configuration for `stringify` (optional).
     * @returns {string}
     *   Comma-separated tokens.
     */
    function stringify(values, options) {
      const settings = options || {};

      // Ensure the last empty entry is seen.
      const input = values[values.length - 1] === '' ? [...values, ''] : values;

      return input
        .join(
          (settings.padRight ? ' ' : '') +
            ',' +
            (settings.padLeft === false ? '' : ' ')
        )
        .trim()
    }

    var styleToObject = {exports: {}};

    // http://www.w3.org/TR/CSS21/grammar.html
    // https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
    var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

    var NEWLINE_REGEX = /\n/g;
    var WHITESPACE_REGEX = /^\s*/;

    // declaration
    var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
    var COLON_REGEX = /^:\s*/;
    var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
    var SEMICOLON_REGEX = /^[;\s]*/;

    // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
    var TRIM_REGEX = /^\s+|\s+$/g;

    // strings
    var NEWLINE = '\n';
    var FORWARD_SLASH = '/';
    var ASTERISK = '*';
    var EMPTY_STRING = '';

    // types
    var TYPE_COMMENT = 'comment';
    var TYPE_DECLARATION = 'declaration';

    /**
     * @param {String} style
     * @param {Object} [options]
     * @return {Object[]}
     * @throws {TypeError}
     * @throws {Error}
     */
    var inlineStyleParser = function(style, options) {
      if (typeof style !== 'string') {
        throw new TypeError('First argument must be a string');
      }

      if (!style) return [];

      options = options || {};

      /**
       * Positional.
       */
      var lineno = 1;
      var column = 1;

      /**
       * Update lineno and column based on `str`.
       *
       * @param {String} str
       */
      function updatePosition(str) {
        var lines = str.match(NEWLINE_REGEX);
        if (lines) lineno += lines.length;
        var i = str.lastIndexOf(NEWLINE);
        column = ~i ? str.length - i : column + str.length;
      }

      /**
       * Mark position and patch `node.position`.
       *
       * @return {Function}
       */
      function position() {
        var start = { line: lineno, column: column };
        return function(node) {
          node.position = new Position(start);
          whitespace();
          return node;
        };
      }

      /**
       * Store position information for a node.
       *
       * @constructor
       * @property {Object} start
       * @property {Object} end
       * @property {undefined|String} source
       */
      function Position(start) {
        this.start = start;
        this.end = { line: lineno, column: column };
        this.source = options.source;
      }

      /**
       * Non-enumerable source string.
       */
      Position.prototype.content = style;

      /**
       * Error `msg`.
       *
       * @param {String} msg
       * @throws {Error}
       */
      function error(msg) {
        var err = new Error(
          options.source + ':' + lineno + ':' + column + ': ' + msg
        );
        err.reason = msg;
        err.filename = options.source;
        err.line = lineno;
        err.column = column;
        err.source = style;

        if (options.silent) ; else {
          throw err;
        }
      }

      /**
       * Match `re` and return captures.
       *
       * @param {RegExp} re
       * @return {undefined|Array}
       */
      function match(re) {
        var m = re.exec(style);
        if (!m) return;
        var str = m[0];
        updatePosition(str);
        style = style.slice(str.length);
        return m;
      }

      /**
       * Parse whitespace.
       */
      function whitespace() {
        match(WHITESPACE_REGEX);
      }

      /**
       * Parse comments.
       *
       * @param {Object[]} [rules]
       * @return {Object[]}
       */
      function comments(rules) {
        var c;
        rules = rules || [];
        while ((c = comment())) {
          if (c !== false) {
            rules.push(c);
          }
        }
        return rules;
      }

      /**
       * Parse comment.
       *
       * @return {Object}
       * @throws {Error}
       */
      function comment() {
        var pos = position();
        if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;

        var i = 2;
        while (
          EMPTY_STRING != style.charAt(i) &&
          (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))
        ) {
          ++i;
        }
        i += 2;

        if (EMPTY_STRING === style.charAt(i - 1)) {
          return error('End of comment missing');
        }

        var str = style.slice(2, i - 2);
        column += 2;
        updatePosition(str);
        style = style.slice(i);
        column += 2;

        return pos({
          type: TYPE_COMMENT,
          comment: str
        });
      }

      /**
       * Parse declaration.
       *
       * @return {Object}
       * @throws {Error}
       */
      function declaration() {
        var pos = position();

        // prop
        var prop = match(PROPERTY_REGEX);
        if (!prop) return;
        comment();

        // :
        if (!match(COLON_REGEX)) return error("property missing ':'");

        // val
        var val = match(VALUE_REGEX);

        var ret = pos({
          type: TYPE_DECLARATION,
          property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
          value: val
            ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING))
            : EMPTY_STRING
        });

        // ;
        match(SEMICOLON_REGEX);

        return ret;
      }

      /**
       * Parse declarations.
       *
       * @return {Object[]}
       */
      function declarations() {
        var decls = [];

        comments(decls);

        // declarations
        var decl;
        while ((decl = declaration())) {
          if (decl !== false) {
            decls.push(decl);
            comments(decls);
          }
        }

        return decls;
      }

      whitespace();
      return declarations();
    };

    /**
     * Trim `str`.
     *
     * @param {String} str
     * @return {String}
     */
    function trim(str) {
      return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
    }

    var parse = inlineStyleParser;

    /**
     * Parses inline style to object.
     *
     * @example
     * // returns { 'line-height': '42' }
     * StyleToObject('line-height: 42;');
     *
     * @param  {String}      style      - The inline style.
     * @param  {Function}    [iterator] - The iterator function.
     * @return {null|Object}
     */
    function StyleToObject(style, iterator) {
      var output = null;
      if (!style || typeof style !== 'string') {
        return output;
      }

      var declaration;
      var declarations = parse(style);
      var hasIterator = typeof iterator === 'function';
      var property;
      var value;

      for (var i = 0, len = declarations.length; i < len; i++) {
        declaration = declarations[i];
        property = declaration.property;
        value = declaration.value;

        if (hasIterator) {
          iterator(property, value, declaration);
        } else if (value) {
          output || (output = {});
          output[property] = value;
        }
      }

      return output;
    }

    styleToObject.exports = StyleToObject;
    styleToObject.exports.default = StyleToObject; // ESM support

    var StyleToObject$1 = styleToObject.exports;

    const protocols = ['http', 'https', 'mailto', 'tel'];

    /**
     * @param {string} uri
     * @returns {string}
     */
    function uriTransformer(uri) {
      const url = (uri || '').trim();
      const first = url.charAt(0);

      if (first === '#' || first === '/') {
        return url
      }

      const colon = url.indexOf(':');
      if (colon === -1) {
        return url
      }

      let index = -1;

      while (++index < protocols.length) {
        const protocol = protocols[index];

        if (
          colon === protocol.length &&
          url.slice(0, protocol.length).toLowerCase() === protocol
        ) {
          return url
        }
      }

      index = url.indexOf('?');
      if (index !== -1 && colon > index) {
        return url
      }

      index = url.indexOf('#');
      if (index !== -1 && colon > index) {
        return url
      }

      // eslint-disable-next-line no-script-url
      return 'javascript:void(0)'
    }

    /**
     * @template T
     * @typedef {import('react').ComponentType<T>} ComponentType<T>
     */

    const own$2 = {}.hasOwnProperty;

    // The table-related elements that must not contain whitespace text according
    // to React.
    const tableElements = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr']);

    /**
     * @param {Context} context
     * @param {Element|Root} node
     */
    function childrenToReact(context, node) {
      /** @type {Array<ReactNode>} */
      const children = [];
      let childIndex = -1;
      /** @type {Comment|Doctype|Element|Raw|Text} */
      let child;

      while (++childIndex < node.children.length) {
        child = node.children[childIndex];

        if (child.type === 'element') {
          children.push(toReact(context, child, childIndex, node));
        } else if (child.type === 'text') {
          // Currently, a warning is triggered by react for *any* white space in
          // tables.
          // So we drop it.
          // See: <https://github.com/facebook/react/pull/7081>.
          // See: <https://github.com/facebook/react/pull/7515>.
          // See: <https://github.com/remarkjs/remark-react/issues/64>.
          // See: <https://github.com/remarkjs/react-markdown/issues/576>.
          if (
            node.type !== 'element' ||
            !tableElements.has(node.tagName) ||
            !whitespace(child)
          ) {
            children.push(child.value);
          }
        } else if (child.type === 'raw' && !context.options.skipHtml) {
          // Default behavior is to show (encoded) HTML.
          children.push(child.value);
        }
      }

      return children
    }

    /**
     * @param {Context} context
     * @param {Element} node
     * @param {number} index
     * @param {Element|Root} parent
     */
    function toReact(context, node, index, parent) {
      const options = context.options;
      const transform =
        options.transformLinkUri === undefined
          ? uriTransformer
          : options.transformLinkUri;
      const parentSchema = context.schema;
      /** @type {ReactMarkdownNames} */
      // @ts-expect-error assume a known HTML/SVG element.
      const name = node.tagName;
      /** @type {Record<string, unknown>} */
      const properties = {};
      let schema = parentSchema;
      /** @type {string} */
      let property;

      if (parentSchema.space === 'html' && name === 'svg') {
        schema = svg;
        context.schema = schema;
      }

      if (node.properties) {
        for (property in node.properties) {
          if (own$2.call(node.properties, property)) {
            addProperty(properties, property, node.properties[property], context);
          }
        }
      }

      if (name === 'ol' || name === 'ul') {
        context.listDepth++;
      }

      const children = childrenToReact(context, node);

      if (name === 'ol' || name === 'ul') {
        context.listDepth--;
      }

      // Restore parent schema.
      context.schema = parentSchema;

      // Nodes created by plugins do not have positional info, in which case we use
      // an object that matches the position interface.
      const position = node.position || {
        start: {line: null, column: null, offset: null},
        end: {line: null, column: null, offset: null}
      };
      const component =
        options.components && own$2.call(options.components, name)
          ? options.components[name]
          : name;
      const basic = typeof component === 'string' || component === React__default["default"].Fragment;

      if (!ReactIs.isValidElementType(component)) {
        throw new TypeError(
          `Component for name \`${name}\` not defined or is not renderable`
        )
      }

      properties.key = index;

      if (name === 'a' && options.linkTarget) {
        properties.target =
          typeof options.linkTarget === 'function'
            ? options.linkTarget(
                String(properties.href || ''),
                node.children,
                typeof properties.title === 'string' ? properties.title : null
              )
            : options.linkTarget;
      }

      if (name === 'a' && transform) {
        properties.href = transform(
          String(properties.href || ''),
          node.children,
          typeof properties.title === 'string' ? properties.title : null
        );
      }

      if (
        !basic &&
        name === 'code' &&
        parent.type === 'element' &&
        parent.tagName !== 'pre'
      ) {
        properties.inline = true;
      }

      if (
        !basic &&
        (name === 'h1' ||
          name === 'h2' ||
          name === 'h3' ||
          name === 'h4' ||
          name === 'h5' ||
          name === 'h6')
      ) {
        properties.level = Number.parseInt(name.charAt(1), 10);
      }

      if (name === 'img' && options.transformImageUri) {
        properties.src = options.transformImageUri(
          String(properties.src || ''),
          String(properties.alt || ''),
          typeof properties.title === 'string' ? properties.title : null
        );
      }

      if (!basic && name === 'li' && parent.type === 'element') {
        const input = getInputElement(node);
        properties.checked =
          input && input.properties ? Boolean(input.properties.checked) : null;
        properties.index = getElementsBeforeCount(parent, node);
        properties.ordered = parent.tagName === 'ol';
      }

      if (!basic && (name === 'ol' || name === 'ul')) {
        properties.ordered = name === 'ol';
        properties.depth = context.listDepth;
      }

      if (name === 'td' || name === 'th') {
        if (properties.align) {
          if (!properties.style) properties.style = {};
          // @ts-expect-error assume `style` is an object
          properties.style.textAlign = properties.align;
          delete properties.align;
        }

        if (!basic) {
          properties.isHeader = name === 'th';
        }
      }

      if (!basic && name === 'tr' && parent.type === 'element') {
        properties.isHeader = Boolean(parent.tagName === 'thead');
      }

      // If `sourcePos` is given, pass source information (line/column info from markdown source).
      if (options.sourcePos) {
        properties['data-sourcepos'] = flattenPosition(position);
      }

      if (!basic && options.rawSourcePos) {
        properties.sourcePosition = node.position;
      }

      // If `includeElementIndex` is given, pass node index info to components.
      if (!basic && options.includeElementIndex) {
        properties.index = getElementsBeforeCount(parent, node);
        properties.siblingCount = getElementsBeforeCount(parent);
      }

      if (!basic) {
        properties.node = node;
      }

      // Ensure no React warnings are emitted for void elements w/ children.
      return children.length > 0
        ? React__default["default"].createElement(component, properties, children)
        : React__default["default"].createElement(component, properties)
    }

    /**
     * @param {Element|Root} node
     * @returns {Element?}
     */
    function getInputElement(node) {
      let index = -1;

      while (++index < node.children.length) {
        const child = node.children[index];

        if (child.type === 'element' && child.tagName === 'input') {
          return child
        }
      }

      return null
    }

    /**
     * @param {Element|Root} parent
     * @param {Element} [node]
     * @returns {number}
     */
    function getElementsBeforeCount(parent, node) {
      let index = -1;
      let count = 0;

      while (++index < parent.children.length) {
        if (parent.children[index] === node) break
        if (parent.children[index].type === 'element') count++;
      }

      return count
    }

    /**
     * @param {Record<string, unknown>} props
     * @param {string} prop
     * @param {unknown} value
     * @param {Context} ctx
     */
    function addProperty(props, prop, value, ctx) {
      const info = find(ctx.schema, prop);
      let result = value;

      // Ignore nullish and `NaN` values.
      // eslint-disable-next-line no-self-compare
      if (result === null || result === undefined || result !== result) {
        return
      }

      // Accept `array`.
      // Most props are space-separated.
      if (Array.isArray(result)) {
        result = info.commaSeparated ? stringify(result) : stringify$1(result);
      }

      if (info.property === 'style' && typeof result === 'string') {
        result = parseStyle(result);
      }

      if (info.space && info.property) {
        props[
          own$2.call(hastToReact, info.property)
            ? hastToReact[info.property]
            : info.property
        ] = result;
      } else if (info.attribute) {
        props[info.attribute] = result;
      }
    }

    /**
     * @param {string} value
     * @returns {Record<string, string>}
     */
    function parseStyle(value) {
      /** @type {Record<string, string>} */
      const result = {};

      try {
        StyleToObject$1(value, iterator);
      } catch {
        // Silent.
      }

      return result

      /**
       * @param {string} name
       * @param {string} v
       */
      function iterator(name, v) {
        const k = name.slice(0, 4) === '-ms-' ? `ms-${name.slice(4)}` : name;
        result[k.replace(/-([a-z])/g, styleReplacer)] = v;
      }
    }

    /**
     * @param {unknown} _
     * @param {string} $1
     */
    function styleReplacer(_, $1) {
      return $1.toUpperCase()
    }

    /**
     * @param {Position|{start: {line: null, column: null, offset: null}, end: {line: null, column: null, offset: null}}} pos
     * @returns {string}
     */
    function flattenPosition(pos) {
      return [
        pos.start.line,
        ':',
        pos.start.column,
        '-',
        pos.end.line,
        ':',
        pos.end.column
      ]
        .map(String)
        .join('')
    }

    /**
     * @typedef {import('react').ReactNode} ReactNode
     * @typedef {import('react').ReactElement<{}>} ReactElement
     * @typedef {import('unified').PluggableList} PluggableList
     * @typedef {import('hast').Root} Root
     * @typedef {import('./rehype-filter.js').Options} FilterOptions
     * @typedef {import('./ast-to-react.js').Options} TransformOptions
     *
     * @typedef CoreOptions
     * @property {string} children
     *
     * @typedef PluginOptions
     * @property {PluggableList} [remarkPlugins=[]]
     * @property {PluggableList} [rehypePlugins=[]]
     * @property {import('remark-rehype').Options | undefined} [remarkRehypeOptions={}]
     *
     * @typedef LayoutOptions
     * @property {string} [className]
     *
     * @typedef {CoreOptions & PluginOptions & LayoutOptions & FilterOptions & TransformOptions} ReactMarkdownOptions
     *
     * @typedef Deprecation
     * @property {string} id
     * @property {string} [to]
     */

    const own$1 = {}.hasOwnProperty;
    const changelog =
      'https://github.com/remarkjs/react-markdown/blob/main/changelog.md';

    /** @type {Record<string, Deprecation>} */
    const deprecated = {
      plugins: {to: 'remarkPlugins', id: 'change-plugins-to-remarkplugins'},
      renderers: {to: 'components', id: 'change-renderers-to-components'},
      astPlugins: {id: 'remove-buggy-html-in-markdown-parser'},
      allowDangerousHtml: {id: 'remove-buggy-html-in-markdown-parser'},
      escapeHtml: {id: 'remove-buggy-html-in-markdown-parser'},
      source: {to: 'children', id: 'change-source-to-children'},
      allowNode: {
        to: 'allowElement',
        id: 'replace-allownode-allowedtypes-and-disallowedtypes'
      },
      allowedTypes: {
        to: 'allowedElements',
        id: 'replace-allownode-allowedtypes-and-disallowedtypes'
      },
      disallowedTypes: {
        to: 'disallowedElements',
        id: 'replace-allownode-allowedtypes-and-disallowedtypes'
      },
      includeNodeIndex: {
        to: 'includeElementIndex',
        id: 'change-includenodeindex-to-includeelementindex'
      }
    };

    /**
     * React component to render markdown.
     *
     * @param {ReactMarkdownOptions} options
     * @returns {ReactElement}
     */
    function ReactMarkdown(options) {
      for (const key in deprecated) {
        if (own$1.call(deprecated, key) && own$1.call(options, key)) {
          const deprecation = deprecated[key];
          console.warn(
            `[react-markdown] Warning: please ${
          deprecation.to ? `use \`${deprecation.to}\` instead of` : 'remove'
        } \`${key}\` (see <${changelog}#${deprecation.id}> for more info)`
          );
          delete deprecated[key];
        }
      }

      const processor = unified()
        .use(remarkParse)
        .use(options.remarkPlugins || [])
        .use(remarkRehype$1, {
          ...options.remarkRehypeOptions,
          allowDangerousHtml: true
        })
        .use(options.rehypePlugins || [])
        .use(rehypeFilter, options);

      const file = new VFile();

      if (typeof options.children === 'string') {
        file.value = options.children;
      } else if (options.children !== undefined && options.children !== null) {
        console.warn(
          `[react-markdown] Warning: please pass a string as \`children\` (not: \`${options.children}\`)`
        );
      }

      const hastNode = processor.runSync(processor.parse(file), file);

      if (hastNode.type !== 'root') {
        throw new TypeError('Expected a `root` node')
      }

      /** @type {ReactElement} */
      let result = React__default["default"].createElement(
        React__default["default"].Fragment,
        {},
        childrenToReact({options, schema: html, listDepth: 0}, hastNode)
      );

      if (options.className) {
        result = React__default["default"].createElement('div', {className: options.className}, result);
      }

      return result
    }

    ReactMarkdown.propTypes = {
      // Core options:
      children: PropTypes.string,
      // Layout options:
      className: PropTypes.string,
      // Filter options:
      allowElement: PropTypes.func,
      allowedElements: PropTypes.arrayOf(PropTypes.string),
      disallowedElements: PropTypes.arrayOf(PropTypes.string),
      unwrapDisallowed: PropTypes.bool,
      // Plugin options:
      remarkPlugins: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.func,
          PropTypes.arrayOf(
            PropTypes.oneOfType([
              PropTypes.bool,
              PropTypes.string,
              PropTypes.object,
              PropTypes.func,
              PropTypes.arrayOf(
                // prettier-ignore
                // type-coverage:ignore-next-line
                PropTypes.any
              )
            ])
          )
        ])
      ),
      rehypePlugins: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.func,
          PropTypes.arrayOf(
            PropTypes.oneOfType([
              PropTypes.bool,
              PropTypes.string,
              PropTypes.object,
              PropTypes.func,
              PropTypes.arrayOf(
                // prettier-ignore
                // type-coverage:ignore-next-line
                PropTypes.any
              )
            ])
          )
        ])
      ),
      // Transform options:
      sourcePos: PropTypes.bool,
      rawSourcePos: PropTypes.bool,
      skipHtml: PropTypes.bool,
      includeElementIndex: PropTypes.bool,
      transformLinkUri: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
      linkTarget: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      transformImageUri: PropTypes.func,
      components: PropTypes.object
    };

    /**
     * @typedef {import('micromark-util-types').Code} Code
     * @typedef {import('micromark-util-types').ConstructRecord} ConstructRecord
     * @typedef {import('micromark-util-types').Event} Event
     * @typedef {import('micromark-util-types').Extension} Extension
     * @typedef {import('micromark-util-types').Previous} Previous
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    const wwwPrefix = {
      tokenize: tokenizeWwwPrefix,
      partial: true
    };
    const domain = {
      tokenize: tokenizeDomain,
      partial: true
    };
    const path = {
      tokenize: tokenizePath,
      partial: true
    };
    const trail = {
      tokenize: tokenizeTrail,
      partial: true
    };
    const emailDomainDotTrail = {
      tokenize: tokenizeEmailDomainDotTrail,
      partial: true
    };
    const wwwAutolink = {
      tokenize: tokenizeWwwAutolink,
      previous: previousWww
    };
    const protocolAutolink = {
      tokenize: tokenizeProtocolAutolink,
      previous: previousProtocol
    };
    const emailAutolink = {
      tokenize: tokenizeEmailAutolink,
      previous: previousEmail
    };

    /** @type {ConstructRecord} */
    const text = {};

    // To do: next major: expose functions that yields extension.

    /**
     * Extension for `micromark` that can be passed in `extensions` to enable GFM
     * autolink literal syntax.
     *
     * @type {Extension}
     */
    const gfmAutolinkLiteral = {
      text
    };

    /** @type {Code} */
    let code = 48;

    // Add alphanumerics.
    while (code < 123) {
      text[code] = emailAutolink;
      code++;
      if (code === 58) code = 65;
      else if (code === 91) code = 97;
    }
    text[43] = emailAutolink;
    text[45] = emailAutolink;
    text[46] = emailAutolink;
    text[95] = emailAutolink;
    text[72] = [emailAutolink, protocolAutolink];
    text[104] = [emailAutolink, protocolAutolink];
    text[87] = [emailAutolink, wwwAutolink];
    text[119] = [emailAutolink, wwwAutolink];

    // To do: perform email autolink literals on events, afterwards.
    // That’s where `markdown-rs` and `cmark-gfm` perform it.
    // It should look for `@`, then for atext backwards, and then for a label
    // forwards.
    // To do: `mailto:`, `xmpp:` protocol as prefix.

    /**
     * Email autolink literal.
     *
     * ```markdown
     * > | a contact@example.org b
     *       ^^^^^^^^^^^^^^^^^^^
     * ```
     *
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeEmailAutolink(effects, ok, nok) {
      const self = this;
      /** @type {boolean | undefined} */
      let dot;
      /** @type {boolean} */
      let data;
      return start

      /**
       * Start of email autolink literal.
       *
       * ```markdown
       * > | a contact@example.org b
       *       ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        if (
          !gfmAtext(code) ||
          !previousEmail.call(self, self.previous) ||
          previousUnbalanced(self.events)
        ) {
          return nok(code)
        }
        effects.enter('literalAutolink');
        effects.enter('literalAutolinkEmail');
        return atext(code)
      }

      /**
       * In email atext.
       *
       * ```markdown
       * > | a contact@example.org b
       *       ^
       * ```
       *
       * @type {State}
       */
      function atext(code) {
        if (gfmAtext(code)) {
          effects.consume(code);
          return atext
        }
        if (code === 64) {
          effects.consume(code);
          return emailDomain
        }
        return nok(code)
      }

      /**
       * In email domain.
       *
       * The reference code is a bit overly complex as it handles the `@`, of which
       * there may be just one.
       * Source: <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L318>
       *
       * ```markdown
       * > | a contact@example.org b
       *               ^
       * ```
       *
       * @type {State}
       */
      function emailDomain(code) {
        // Dot followed by alphanumerical (not `-` or `_`).
        if (code === 46) {
          return effects.check(
            emailDomainDotTrail,
            emailDomainAfter,
            emailDomainDot
          )(code)
        }

        // Alphanumerical, `-`, and `_`.
        if (code === 45 || code === 95 || asciiAlphanumeric(code)) {
          data = true;
          effects.consume(code);
          return emailDomain
        }

        // To do: `/` if xmpp.

        // Note: normally we’d truncate trailing punctuation from the link.
        // However, email autolink literals cannot contain any of those markers,
        // except for `.`, but that can only occur if it isn’t trailing.
        // So we can ignore truncating!
        return emailDomainAfter(code)
      }

      /**
       * In email domain, on dot that is not a trail.
       *
       * ```markdown
       * > | a contact@example.org b
       *                      ^
       * ```
       *
       * @type {State}
       */
      function emailDomainDot(code) {
        effects.consume(code);
        dot = true;
        return emailDomain
      }

      /**
       * After email domain.
       *
       * ```markdown
       * > | a contact@example.org b
       *                          ^
       * ```
       *
       * @type {State}
       */
      function emailDomainAfter(code) {
        // Domain must not be empty, must include a dot, and must end in alphabetical.
        // Source: <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L332>.
        if (data && dot && asciiAlpha(self.previous)) {
          effects.exit('literalAutolinkEmail');
          effects.exit('literalAutolink');
          return ok(code)
        }
        return nok(code)
      }
    }

    /**
     * `www` autolink literal.
     *
     * ```markdown
     * > | a www.example.org b
     *       ^^^^^^^^^^^^^^^
     * ```
     *
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeWwwAutolink(effects, ok, nok) {
      const self = this;
      return wwwStart

      /**
       * Start of www autolink literal.
       *
       * ```markdown
       * > | www.example.com/a?b#c
       *     ^
       * ```
       *
       * @type {State}
       */
      function wwwStart(code) {
        if (
          (code !== 87 && code !== 119) ||
          !previousWww.call(self, self.previous) ||
          previousUnbalanced(self.events)
        ) {
          return nok(code)
        }
        effects.enter('literalAutolink');
        effects.enter('literalAutolinkWww');
        // Note: we *check*, so we can discard the `www.` we parsed.
        // If it worked, we consider it as a part of the domain.
        return effects.check(
          wwwPrefix,
          effects.attempt(domain, effects.attempt(path, wwwAfter), nok),
          nok
        )(code)
      }

      /**
       * After a www autolink literal.
       *
       * ```markdown
       * > | www.example.com/a?b#c
       *                          ^
       * ```
       *
       * @type {State}
       */
      function wwwAfter(code) {
        effects.exit('literalAutolinkWww');
        effects.exit('literalAutolink');
        return ok(code)
      }
    }

    /**
     * Protocol autolink literal.
     *
     * ```markdown
     * > | a https://example.org b
     *       ^^^^^^^^^^^^^^^^^^^
     * ```
     *
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeProtocolAutolink(effects, ok, nok) {
      const self = this;
      let buffer = '';
      let seen = false;
      return protocolStart

      /**
       * Start of protocol autolink literal.
       *
       * ```markdown
       * > | https://example.com/a?b#c
       *     ^
       * ```
       *
       * @type {State}
       */
      function protocolStart(code) {
        if (
          (code === 72 || code === 104) &&
          previousProtocol.call(self, self.previous) &&
          !previousUnbalanced(self.events)
        ) {
          effects.enter('literalAutolink');
          effects.enter('literalAutolinkHttp');
          buffer += String.fromCodePoint(code);
          effects.consume(code);
          return protocolPrefixInside
        }
        return nok(code)
      }

      /**
       * In protocol.
       *
       * ```markdown
       * > | https://example.com/a?b#c
       *     ^^^^^
       * ```
       *
       * @type {State}
       */
      function protocolPrefixInside(code) {
        // `5` is size of `https`
        if (asciiAlpha(code) && buffer.length < 5) {
          // @ts-expect-error: definitely number.
          buffer += String.fromCodePoint(code);
          effects.consume(code);
          return protocolPrefixInside
        }
        if (code === 58) {
          const protocol = buffer.toLowerCase();
          if (protocol === 'http' || protocol === 'https') {
            effects.consume(code);
            return protocolSlashesInside
          }
        }
        return nok(code)
      }

      /**
       * In slashes.
       *
       * ```markdown
       * > | https://example.com/a?b#c
       *           ^^
       * ```
       *
       * @type {State}
       */
      function protocolSlashesInside(code) {
        if (code === 47) {
          effects.consume(code);
          if (seen) {
            return afterProtocol
          }
          seen = true;
          return protocolSlashesInside
        }
        return nok(code)
      }

      /**
       * After protocol, before domain.
       *
       * ```markdown
       * > | https://example.com/a?b#c
       *             ^
       * ```
       *
       * @type {State}
       */
      function afterProtocol(code) {
        // To do: this is different from `markdown-rs`:
        // https://github.com/wooorm/markdown-rs/blob/b3a921c761309ae00a51fe348d8a43adbc54b518/src/construct/gfm_autolink_literal.rs#L172-L182
        return code === null ||
          asciiControl(code) ||
          markdownLineEndingOrSpace(code) ||
          unicodeWhitespace(code) ||
          unicodePunctuation(code)
          ? nok(code)
          : effects.attempt(domain, effects.attempt(path, protocolAfter), nok)(code)
      }

      /**
       * After a protocol autolink literal.
       *
       * ```markdown
       * > | https://example.com/a?b#c
       *                              ^
       * ```
       *
       * @type {State}
       */
      function protocolAfter(code) {
        effects.exit('literalAutolinkHttp');
        effects.exit('literalAutolink');
        return ok(code)
      }
    }

    /**
     * `www` prefix.
     *
     * ```markdown
     * > | a www.example.org b
     *       ^^^^
     * ```
     *
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeWwwPrefix(effects, ok, nok) {
      let size = 0;
      return wwwPrefixInside

      /**
       * In www prefix.
       *
       * ```markdown
       * > | www.example.com
       *     ^^^^
       * ```
       *
       * @type {State}
       */
      function wwwPrefixInside(code) {
        if ((code === 87 || code === 119) && size < 3) {
          size++;
          effects.consume(code);
          return wwwPrefixInside
        }
        if (code === 46 && size === 3) {
          effects.consume(code);
          return wwwPrefixAfter
        }
        return nok(code)
      }

      /**
       * After www prefix.
       *
       * ```markdown
       * > | www.example.com
       *         ^
       * ```
       *
       * @type {State}
       */
      function wwwPrefixAfter(code) {
        // If there is *anything*, we can link.
        return code === null ? nok(code) : ok(code)
      }
    }

    /**
     * Domain.
     *
     * ```markdown
     * > | a https://example.org b
     *               ^^^^^^^^^^^
     * ```
     *
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeDomain(effects, ok, nok) {
      /** @type {boolean | undefined} */
      let underscoreInLastSegment;
      /** @type {boolean | undefined} */
      let underscoreInLastLastSegment;
      /** @type {boolean | undefined} */
      let seen;
      return domainInside

      /**
       * In domain.
       *
       * ```markdown
       * > | https://example.com/a
       *             ^^^^^^^^^^^
       * ```
       *
       * @type {State}
       */
      function domainInside(code) {
        // Check whether this marker, which is a trailing punctuation
        // marker, optionally followed by more trailing markers, and then
        // followed by an end.
        if (code === 46 || code === 95) {
          return effects.check(trail, domainAfter, domainAtPunctuation)(code)
        }

        // GH documents that only alphanumerics (other than `-`, `.`, and `_`) can
        // occur, which sounds like ASCII only, but they also support `www.點看.com`,
        // so that’s Unicode.
        // Instead of some new production for Unicode alphanumerics, markdown
        // already has that for Unicode punctuation and whitespace, so use those.
        // Source: <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L12>.
        if (
          code === null ||
          markdownLineEndingOrSpace(code) ||
          unicodeWhitespace(code) ||
          (code !== 45 && unicodePunctuation(code))
        ) {
          return domainAfter(code)
        }
        seen = true;
        effects.consume(code);
        return domainInside
      }

      /**
       * In domain, at potential trailing punctuation, that was not trailing.
       *
       * ```markdown
       * > | https://example.com
       *                    ^
       * ```
       *
       * @type {State}
       */
      function domainAtPunctuation(code) {
        // There is an underscore in the last segment of the domain
        if (code === 95) {
          underscoreInLastSegment = true;
        }
        // Otherwise, it’s a `.`: save the last segment underscore in the
        // penultimate segment slot.
        else {
          underscoreInLastLastSegment = underscoreInLastSegment;
          underscoreInLastSegment = undefined;
        }
        effects.consume(code);
        return domainInside
      }

      /**
       * After domain.
       *
       * ```markdown
       * > | https://example.com/a
       *                        ^
       * ```
       *
       * @type {State} */
      function domainAfter(code) {
        // Note: that’s GH says a dot is needed, but it’s not true:
        // <https://github.com/github/cmark-gfm/issues/279>
        if (underscoreInLastLastSegment || underscoreInLastSegment || !seen) {
          return nok(code)
        }
        return ok(code)
      }
    }

    /**
     * Path.
     *
     * ```markdown
     * > | a https://example.org/stuff b
     *                          ^^^^^^
     * ```
     *
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizePath(effects, ok) {
      let sizeOpen = 0;
      let sizeClose = 0;
      return pathInside

      /**
       * In path.
       *
       * ```markdown
       * > | https://example.com/a
       *                        ^^
       * ```
       *
       * @type {State}
       */
      function pathInside(code) {
        if (code === 40) {
          sizeOpen++;
          effects.consume(code);
          return pathInside
        }

        // To do: `markdown-rs` also needs this.
        // If this is a paren, and there are less closings than openings,
        // we don’t check for a trail.
        if (code === 41 && sizeClose < sizeOpen) {
          return pathAtPunctuation(code)
        }

        // Check whether this trailing punctuation marker is optionally
        // followed by more trailing markers, and then followed
        // by an end.
        if (
          code === 33 ||
          code === 34 ||
          code === 38 ||
          code === 39 ||
          code === 41 ||
          code === 42 ||
          code === 44 ||
          code === 46 ||
          code === 58 ||
          code === 59 ||
          code === 60 ||
          code === 63 ||
          code === 93 ||
          code === 95 ||
          code === 126
        ) {
          return effects.check(trail, ok, pathAtPunctuation)(code)
        }
        if (
          code === null ||
          markdownLineEndingOrSpace(code) ||
          unicodeWhitespace(code)
        ) {
          return ok(code)
        }
        effects.consume(code);
        return pathInside
      }

      /**
       * In path, at potential trailing punctuation, that was not trailing.
       *
       * ```markdown
       * > | https://example.com/a"b
       *                          ^
       * ```
       *
       * @type {State}
       */
      function pathAtPunctuation(code) {
        // Count closing parens.
        if (code === 41) {
          sizeClose++;
        }
        effects.consume(code);
        return pathInside
      }
    }

    /**
     * Trail.
     *
     * This calls `ok` if this *is* the trail, followed by an end, which means
     * the entire trail is not part of the link.
     * It calls `nok` if this *is* part of the link.
     *
     * ```markdown
     * > | https://example.com").
     *                        ^^^
     * ```
     *
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeTrail(effects, ok, nok) {
      return trail

      /**
       * In trail of domain or path.
       *
       * ```markdown
       * > | https://example.com").
       *                        ^
       * ```
       *
       * @type {State}
       */
      function trail(code) {
        // Regular trailing punctuation.
        if (
          code === 33 ||
          code === 34 ||
          code === 39 ||
          code === 41 ||
          code === 42 ||
          code === 44 ||
          code === 46 ||
          code === 58 ||
          code === 59 ||
          code === 63 ||
          code === 95 ||
          code === 126
        ) {
          effects.consume(code);
          return trail
        }

        // `&` followed by one or more alphabeticals and then a `;`, is
        // as a whole considered as trailing punctuation.
        // In all other cases, it is considered as continuation of the URL.
        if (code === 38) {
          effects.consume(code);
          return trailCharRefStart
        }

        // Needed because we allow literals after `[`, as we fix:
        // <https://github.com/github/cmark-gfm/issues/278>.
        // Check that it is not followed by `(` or `[`.
        if (code === 93) {
          effects.consume(code);
          return trailBracketAfter
        }
        if (
          // `<` is an end.
          code === 60 ||
          // So is whitespace.
          code === null ||
          markdownLineEndingOrSpace(code) ||
          unicodeWhitespace(code)
        ) {
          return ok(code)
        }
        return nok(code)
      }

      /**
       * In trail, after `]`.
       *
       * > 👉 **Note**: this deviates from `cmark-gfm` to fix a bug.
       * > See end of <https://github.com/github/cmark-gfm/issues/278> for more.
       *
       * ```markdown
       * > | https://example.com](
       *                         ^
       * ```
       *
       * @type {State}
       */
      function trailBracketAfter(code) {
        // Whitespace or something that could start a resource or reference is the end.
        // Switch back to trail otherwise.
        if (
          code === null ||
          code === 40 ||
          code === 91 ||
          markdownLineEndingOrSpace(code) ||
          unicodeWhitespace(code)
        ) {
          return ok(code)
        }
        return trail(code)
      }

      /**
       * In character-reference like trail, after `&`.
       *
       * ```markdown
       * > | https://example.com&amp;).
       *                         ^
       * ```
       *
       * @type {State}
       */
      function trailCharRefStart(code) {
        // When non-alpha, it’s not a trail.
        return asciiAlpha(code) ? trailCharRefInside(code) : nok(code)
      }

      /**
       * In character-reference like trail.
       *
       * ```markdown
       * > | https://example.com&amp;).
       *                         ^
       * ```
       *
       * @type {State}
       */
      function trailCharRefInside(code) {
        // Switch back to trail if this is well-formed.
        if (code === 59) {
          effects.consume(code);
          return trail
        }
        if (asciiAlpha(code)) {
          effects.consume(code);
          return trailCharRefInside
        }

        // It’s not a trail.
        return nok(code)
      }
    }

    /**
     * Dot in email domain trail.
     *
     * This calls `ok` if this *is* the trail, followed by an end, which means
     * the trail is not part of the link.
     * It calls `nok` if this *is* part of the link.
     *
     * ```markdown
     * > | contact@example.org.
     *                        ^
     * ```
     *
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeEmailDomainDotTrail(effects, ok, nok) {
      return start

      /**
       * Dot.
       *
       * ```markdown
       * > | contact@example.org.
       *                    ^   ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        // Must be dot.
        effects.consume(code);
        return after
      }

      /**
       * After dot.
       *
       * ```markdown
       * > | contact@example.org.
       *                     ^   ^
       * ```
       *
       * @type {State}
       */
      function after(code) {
        // Not a trail if alphanumeric.
        return asciiAlphanumeric(code) ? nok(code) : ok(code)
      }
    }

    /**
     * See:
     * <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L156>.
     *
     * @type {Previous}
     */
    function previousWww(code) {
      return (
        code === null ||
        code === 40 ||
        code === 42 ||
        code === 95 ||
        code === 91 ||
        code === 93 ||
        code === 126 ||
        markdownLineEndingOrSpace(code)
      )
    }

    /**
     * See:
     * <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L214>.
     *
     * @type {Previous}
     */
    function previousProtocol(code) {
      return !asciiAlpha(code)
    }

    /**
     * @this {TokenizeContext}
     * @type {Previous}
     */
    function previousEmail(code) {
      // Do not allow a slash “inside” atext.
      // The reference code is a bit weird, but that’s what it results in.
      // Source: <https://github.com/github/cmark-gfm/blob/ef1cfcb/extensions/autolink.c#L307>.
      // Other than slash, every preceding character is allowed.
      return !(code === 47 || gfmAtext(code))
    }

    /**
     * @param {Code} code
     * @returns {boolean}
     */
    function gfmAtext(code) {
      return (
        code === 43 ||
        code === 45 ||
        code === 46 ||
        code === 95 ||
        asciiAlphanumeric(code)
      )
    }

    /**
     * @param {Array<Event>} events
     * @returns {boolean}
     */
    function previousUnbalanced(events) {
      let index = events.length;
      let result = false;
      while (index--) {
        const token = events[index][1];
        if (
          (token.type === 'labelLink' || token.type === 'labelImage') &&
          !token._balanced
        ) {
          result = true;
          break
        }

        // If we’ve seen this token, and it was marked as not having any unbalanced
        // bracket before it, we can exit.
        if (token._gfmAutolinkLiteralWalkedInto) {
          result = false;
          break
        }
      }
      if (events.length > 0 && !result) {
        // Mark the last token as “walked into” w/o finding
        // anything.
        events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
      }
      return result
    }

    /**
     * @typedef {import('micromark-util-types').Event} Event
     * @typedef {import('micromark-util-types').Exiter} Exiter
     * @typedef {import('micromark-util-types').Extension} Extension
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    const indent = {
      tokenize: tokenizeIndent,
      partial: true
    };

    // To do: micromark should support a `_hiddenGfmFootnoteSupport`, which only
    // affects label start (image).
    // That will let us drop `tokenizePotentialGfmFootnote*`.
    // It currently has a `_hiddenFootnoteSupport`, which affects that and more.
    // That can be removed when `micromark-extension-footnote` is archived.

    /**
     * Create an extension for `micromark` to enable GFM footnote syntax.
     *
     * @returns {Extension}
     *   Extension for `micromark` that can be passed in `extensions` to
     *   enable GFM footnote syntax.
     */
    function gfmFootnote() {
      /** @type {Extension} */
      return {
        document: {
          [91]: {
            tokenize: tokenizeDefinitionStart,
            continuation: {
              tokenize: tokenizeDefinitionContinuation
            },
            exit: gfmFootnoteDefinitionEnd
          }
        },
        text: {
          [91]: {
            tokenize: tokenizeGfmFootnoteCall
          },
          [93]: {
            add: 'after',
            tokenize: tokenizePotentialGfmFootnoteCall,
            resolveTo: resolveToPotentialGfmFootnoteCall
          }
        }
      }
    }

    // To do: remove after micromark update.
    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizePotentialGfmFootnoteCall(effects, ok, nok) {
      const self = this;
      let index = self.events.length;
      /** @type {Array<string>} */
      // @ts-expect-error It’s fine!
      const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
      /** @type {Token} */
      let labelStart;

      // Find an opening.
      while (index--) {
        const token = self.events[index][1];
        if (token.type === 'labelImage') {
          labelStart = token;
          break
        }

        // Exit if we’ve walked far enough.
        if (
          token.type === 'gfmFootnoteCall' ||
          token.type === 'labelLink' ||
          token.type === 'label' ||
          token.type === 'image' ||
          token.type === 'link'
        ) {
          break
        }
      }
      return start

      /**
       * @type {State}
       */
      function start(code) {
        if (!labelStart || !labelStart._balanced) {
          return nok(code)
        }
        const id = normalizeIdentifier(
          self.sliceSerialize({
            start: labelStart.end,
            end: self.now()
          })
        );
        if (id.codePointAt(0) !== 94 || !defined.includes(id.slice(1))) {
          return nok(code)
        }
        effects.enter('gfmFootnoteCallLabelMarker');
        effects.consume(code);
        effects.exit('gfmFootnoteCallLabelMarker');
        return ok(code)
      }
    }

    // To do: remove after micromark update.
    /** @type {Resolver} */
    function resolveToPotentialGfmFootnoteCall(events, context) {
      let index = events.length;

      // Find an opening.
      while (index--) {
        if (
          events[index][1].type === 'labelImage' &&
          events[index][0] === 'enter'
        ) {
          events[index][1];
          break
        }
      }
      // Change the `labelImageMarker` to a `data`.
      events[index + 1][1].type = 'data';
      events[index + 3][1].type = 'gfmFootnoteCallLabelMarker';

      // The whole (without `!`):
      /** @type {Token} */
      const call = {
        type: 'gfmFootnoteCall',
        start: Object.assign({}, events[index + 3][1].start),
        end: Object.assign({}, events[events.length - 1][1].end)
      };
      // The `^` marker
      /** @type {Token} */
      const marker = {
        type: 'gfmFootnoteCallMarker',
        start: Object.assign({}, events[index + 3][1].end),
        end: Object.assign({}, events[index + 3][1].end)
      };
      // Increment the end 1 character.
      marker.end.column++;
      marker.end.offset++;
      marker.end._bufferIndex++;
      /** @type {Token} */
      const string = {
        type: 'gfmFootnoteCallString',
        start: Object.assign({}, marker.end),
        end: Object.assign({}, events[events.length - 1][1].start)
      };
      /** @type {Token} */
      const chunk = {
        type: 'chunkString',
        contentType: 'string',
        start: Object.assign({}, string.start),
        end: Object.assign({}, string.end)
      };

      /** @type {Array<Event>} */
      const replacement = [
        // Take the `labelImageMarker` (now `data`, the `!`)
        events[index + 1],
        events[index + 2],
        ['enter', call, context],
        // The `[`
        events[index + 3],
        events[index + 4],
        // The `^`.
        ['enter', marker, context],
        ['exit', marker, context],
        // Everything in between.
        ['enter', string, context],
        ['enter', chunk, context],
        ['exit', chunk, context],
        ['exit', string, context],
        // The ending (`]`, properly parsed and labelled).
        events[events.length - 2],
        events[events.length - 1],
        ['exit', call, context]
      ];
      events.splice(index, events.length - index + 1, ...replacement);
      return events
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeGfmFootnoteCall(effects, ok, nok) {
      const self = this;
      /** @type {Array<string>} */
      // @ts-expect-error It’s fine!
      const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
      let size = 0;
      /** @type {boolean} */
      let data;

      // Note: the implementation of `markdown-rs` is different, because it houses
      // core *and* extensions in one project.
      // Therefore, it can include footnote logic inside `label-end`.
      // We can’t do that, but luckily, we can parse footnotes in a simpler way than
      // needed for labels.
      return start

      /**
       * Start of footnote label.
       *
       * ```markdown
       * > | a [^b] c
       *       ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('gfmFootnoteCall');
        effects.enter('gfmFootnoteCallLabelMarker');
        effects.consume(code);
        effects.exit('gfmFootnoteCallLabelMarker');
        return callStart
      }

      /**
       * After `[`, at `^`.
       *
       * ```markdown
       * > | a [^b] c
       *        ^
       * ```
       *
       * @type {State}
       */
      function callStart(code) {
        if (code !== 94) return nok(code)
        effects.enter('gfmFootnoteCallMarker');
        effects.consume(code);
        effects.exit('gfmFootnoteCallMarker');
        effects.enter('gfmFootnoteCallString');
        effects.enter('chunkString').contentType = 'string';
        return callData
      }

      /**
       * In label.
       *
       * ```markdown
       * > | a [^b] c
       *         ^
       * ```
       *
       * @type {State}
       */
      function callData(code) {
        if (
          // Too long.
          size > 999 ||
          // Closing brace with nothing.
          (code === 93 && !data) ||
          // Space or tab is not supported by GFM for some reason.
          // `\n` and `[` not being supported makes sense.
          code === null ||
          code === 91 ||
          markdownLineEndingOrSpace(code)
        ) {
          return nok(code)
        }
        if (code === 93) {
          effects.exit('chunkString');
          const token = effects.exit('gfmFootnoteCallString');
          if (!defined.includes(normalizeIdentifier(self.sliceSerialize(token)))) {
            return nok(code)
          }
          effects.enter('gfmFootnoteCallLabelMarker');
          effects.consume(code);
          effects.exit('gfmFootnoteCallLabelMarker');
          effects.exit('gfmFootnoteCall');
          return ok
        }
        if (!markdownLineEndingOrSpace(code)) {
          data = true;
        }
        size++;
        effects.consume(code);
        return code === 92 ? callEscape : callData
      }

      /**
       * On character after escape.
       *
       * ```markdown
       * > | a [^b\c] d
       *           ^
       * ```
       *
       * @type {State}
       */
      function callEscape(code) {
        if (code === 91 || code === 92 || code === 93) {
          effects.consume(code);
          size++;
          return callData
        }
        return callData(code)
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeDefinitionStart(effects, ok, nok) {
      const self = this;
      /** @type {Array<string>} */
      // @ts-expect-error It’s fine!
      const defined = self.parser.gfmFootnotes || (self.parser.gfmFootnotes = []);
      /** @type {string} */
      let identifier;
      let size = 0;
      /** @type {boolean | undefined} */
      let data;
      return start

      /**
       * Start of GFM footnote definition.
       *
       * ```markdown
       * > | [^a]: b
       *     ^
       * ```
       *
       * @type {State}
       */
      function start(code) {
        effects.enter('gfmFootnoteDefinition')._container = true;
        effects.enter('gfmFootnoteDefinitionLabel');
        effects.enter('gfmFootnoteDefinitionLabelMarker');
        effects.consume(code);
        effects.exit('gfmFootnoteDefinitionLabelMarker');
        return labelAtMarker
      }

      /**
       * In label, at caret.
       *
       * ```markdown
       * > | [^a]: b
       *      ^
       * ```
       *
       * @type {State}
       */
      function labelAtMarker(code) {
        if (code === 94) {
          effects.enter('gfmFootnoteDefinitionMarker');
          effects.consume(code);
          effects.exit('gfmFootnoteDefinitionMarker');
          effects.enter('gfmFootnoteDefinitionLabelString');
          effects.enter('chunkString').contentType = 'string';
          return labelInside
        }
        return nok(code)
      }

      /**
       * In label.
       *
       * > 👉 **Note**: `cmark-gfm` prevents whitespace from occurring in footnote
       * > definition labels.
       *
       * ```markdown
       * > | [^a]: b
       *       ^
       * ```
       *
       * @type {State}
       */
      function labelInside(code) {
        if (
          // Too long.
          size > 999 ||
          // Closing brace with nothing.
          (code === 93 && !data) ||
          // Space or tab is not supported by GFM for some reason.
          // `\n` and `[` not being supported makes sense.
          code === null ||
          code === 91 ||
          markdownLineEndingOrSpace(code)
        ) {
          return nok(code)
        }
        if (code === 93) {
          effects.exit('chunkString');
          const token = effects.exit('gfmFootnoteDefinitionLabelString');
          identifier = normalizeIdentifier(self.sliceSerialize(token));
          effects.enter('gfmFootnoteDefinitionLabelMarker');
          effects.consume(code);
          effects.exit('gfmFootnoteDefinitionLabelMarker');
          effects.exit('gfmFootnoteDefinitionLabel');
          return labelAfter
        }
        if (!markdownLineEndingOrSpace(code)) {
          data = true;
        }
        size++;
        effects.consume(code);
        return code === 92 ? labelEscape : labelInside
      }

      /**
       * After `\`, at a special character.
       *
       * > 👉 **Note**: `cmark-gfm` currently does not support escaped brackets:
       * > <https://github.com/github/cmark-gfm/issues/240>
       *
       * ```markdown
       * > | [^a\*b]: c
       *         ^
       * ```
       *
       * @type {State}
       */
      function labelEscape(code) {
        if (code === 91 || code === 92 || code === 93) {
          effects.consume(code);
          size++;
          return labelInside
        }
        return labelInside(code)
      }

      /**
       * After definition label.
       *
       * ```markdown
       * > | [^a]: b
       *         ^
       * ```
       *
       * @type {State}
       */
      function labelAfter(code) {
        if (code === 58) {
          effects.enter('definitionMarker');
          effects.consume(code);
          effects.exit('definitionMarker');
          if (!defined.includes(identifier)) {
            defined.push(identifier);
          }

          // Any whitespace after the marker is eaten, forming indented code
          // is not possible.
          // No space is also fine, just like a block quote marker.
          return factorySpace(
            effects,
            whitespaceAfter,
            'gfmFootnoteDefinitionWhitespace'
          )
        }
        return nok(code)
      }

      /**
       * After definition prefix.
       *
       * ```markdown
       * > | [^a]: b
       *           ^
       * ```
       *
       * @type {State}
       */
      function whitespaceAfter(code) {
        // `markdown-rs` has a wrapping token for the prefix that is closed here.
        return ok(code)
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeDefinitionContinuation(effects, ok, nok) {
      /// Start of footnote definition continuation.
      ///
      /// ```markdown
      ///   | [^a]: b
      /// > |     c
      ///     ^
      /// ```
      //
      // Either a blank line, which is okay, or an indented thing.
      return effects.check(blankLine, ok, effects.attempt(indent, ok, nok))
    }

    /** @type {Exiter} */
    function gfmFootnoteDefinitionEnd(effects) {
      effects.exit('gfmFootnoteDefinition');
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeIndent(effects, ok, nok) {
      const self = this;
      return factorySpace(
        effects,
        afterPrefix,
        'gfmFootnoteDefinitionIndent',
        4 + 1
      )

      /**
       * @type {State}
       */
      function afterPrefix(code) {
        const tail = self.events[self.events.length - 1];
        return tail &&
          tail[1].type === 'gfmFootnoteDefinitionIndent' &&
          tail[2].sliceSerialize(tail[1], true).length === 4
          ? ok(code)
          : nok(code)
      }
    }

    /**
     * @typedef {import('micromark-util-types').Event} Event
     * @typedef {import('micromark-util-types').Extension} Extension
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     *
     * @typedef Options
     *   Configuration (optional).
     * @property {boolean} [singleTilde=true]
     *   Whether to support strikethrough with a single tilde.
     *
     *   Single tildes work on github.com, but are technically prohibited by the
     *   GFM spec.
     */
    /**
     * Create an extension for `micromark` to enable GFM strikethrough syntax.
     *
     * @param {Options | null | undefined} [options]
     *   Configuration.
     * @returns {Extension}
     *   Extension for `micromark` that can be passed in `extensions`, to
     *   enable GFM strikethrough syntax.
     */
    function gfmStrikethrough(options) {
      const options_ = options || {};
      let single = options_.singleTilde;
      const tokenizer = {
        tokenize: tokenizeStrikethrough,
        resolveAll: resolveAllStrikethrough
      };
      if (single === null || single === undefined) {
        single = true;
      }
      return {
        text: {
          [126]: tokenizer
        },
        insideSpan: {
          null: [tokenizer]
        },
        attentionMarkers: {
          null: [126]
        }
      }

      /**
       * Take events and resolve strikethrough.
       *
       * @type {Resolver}
       */
      function resolveAllStrikethrough(events, context) {
        let index = -1;

        // Walk through all events.
        while (++index < events.length) {
          // Find a token that can close.
          if (
            events[index][0] === 'enter' &&
            events[index][1].type === 'strikethroughSequenceTemporary' &&
            events[index][1]._close
          ) {
            let open = index;

            // Now walk back to find an opener.
            while (open--) {
              // Find a token that can open the closer.
              if (
                events[open][0] === 'exit' &&
                events[open][1].type === 'strikethroughSequenceTemporary' &&
                events[open][1]._open &&
                // If the sizes are the same:
                events[index][1].end.offset - events[index][1].start.offset ===
                  events[open][1].end.offset - events[open][1].start.offset
              ) {
                events[index][1].type = 'strikethroughSequence';
                events[open][1].type = 'strikethroughSequence';

                /** @type {Token} */
                const strikethrough = {
                  type: 'strikethrough',
                  start: Object.assign({}, events[open][1].start),
                  end: Object.assign({}, events[index][1].end)
                };

                /** @type {Token} */
                const text = {
                  type: 'strikethroughText',
                  start: Object.assign({}, events[open][1].end),
                  end: Object.assign({}, events[index][1].start)
                };

                // Opening.
                /** @type {Array<Event>} */
                const nextEvents = [
                  ['enter', strikethrough, context],
                  ['enter', events[open][1], context],
                  ['exit', events[open][1], context],
                  ['enter', text, context]
                ];
                const insideSpan = context.parser.constructs.insideSpan.null;
                if (insideSpan) {
                  // Between.
                  splice(
                    nextEvents,
                    nextEvents.length,
                    0,
                    resolveAll(insideSpan, events.slice(open + 1, index), context)
                  );
                }

                // Closing.
                splice(nextEvents, nextEvents.length, 0, [
                  ['exit', text, context],
                  ['enter', events[index][1], context],
                  ['exit', events[index][1], context],
                  ['exit', strikethrough, context]
                ]);
                splice(events, open - 1, index - open + 3, nextEvents);
                index = open + nextEvents.length - 2;
                break
              }
            }
          }
        }
        index = -1;
        while (++index < events.length) {
          if (events[index][1].type === 'strikethroughSequenceTemporary') {
            events[index][1].type = 'data';
          }
        }
        return events
      }

      /**
       * @this {TokenizeContext}
       * @type {Tokenizer}
       */
      function tokenizeStrikethrough(effects, ok, nok) {
        const previous = this.previous;
        const events = this.events;
        let size = 0;
        return start

        /** @type {State} */
        function start(code) {
          if (
            previous === 126 &&
            events[events.length - 1][1].type !== 'characterEscape'
          ) {
            return nok(code)
          }
          effects.enter('strikethroughSequenceTemporary');
          return more(code)
        }

        /** @type {State} */
        function more(code) {
          const before = classifyCharacter(previous);
          if (code === 126) {
            // If this is the third marker, exit.
            if (size > 1) return nok(code)
            effects.consume(code);
            size++;
            return more
          }
          if (size < 2 && !single) return nok(code)
          const token = effects.exit('strikethroughSequenceTemporary');
          const after = classifyCharacter(code);
          token._open = !after || (after === 2 && Boolean(before));
          token._close = !before || (before === 2 && Boolean(after));
          return ok(code)
        }
      }
    }

    /**
     * @typedef {import('micromark-util-types').Event} Event
     */

    // Port of `edit_map.rs` from `markdown-rs`.
    // This should move to `markdown-js` later.

    // Deal with several changes in events, batching them together.
    //
    // Preferably, changes should be kept to a minimum.
    // Sometimes, it’s needed to change the list of events, because parsing can be
    // messy, and it helps to expose a cleaner interface of events to the compiler
    // and other users.
    // It can also help to merge many adjacent similar events.
    // And, in other cases, it’s needed to parse subcontent: pass some events
    // through another tokenizer and inject the result.

    /**
     * @typedef {[number, number, Array<Event>]} Change
     * @typedef {[number, number, number]} Jump
     */

    /**
     * Tracks a bunch of edits.
     */
    class EditMap {
      /**
       * Create a new edit map.
       */
      constructor() {
        /**
         * Record of changes.
         *
         * @type {Array<Change>}
         */
        this.map = [];
      }

      /**
       * Create an edit: a remove and/or add at a certain place.
       *
       * @param {number} index
       * @param {number} remove
       * @param {Array<Event>} add
       * @returns {void}
       */
      add(index, remove, add) {
        addImpl(this, index, remove, add);
      }

      // To do: not used here.
      // /**
      //  * Create an edit: but insert `add` before existing additions.
      //  *
      //  * @param {number} index
      //  * @param {number} remove
      //  * @param {Array<Event>} add
      //  * @returns {void}
      //  */
      // addBefore(index, remove, add) {
      //   addImpl(this, index, remove, add, true)
      // }

      /**
       * Done, change the events.
       *
       * @param {Array<Event>} events
       * @returns {void}
       */
      consume(events) {
        this.map.sort((a, b) => a[0] - b[0]);

        /* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
        if (this.map.length === 0) {
          return
        }

        // To do: if links are added in events, like they are in `markdown-rs`,
        // this is needed.
        // // Calculate jumps: where items in the current list move to.
        // /** @type {Array<Jump>} */
        // const jumps = []
        // let index = 0
        // let addAcc = 0
        // let removeAcc = 0
        // while (index < this.map.length) {
        //   const [at, remove, add] = this.map[index]
        //   removeAcc += remove
        //   addAcc += add.length
        //   jumps.push([at, removeAcc, addAcc])
        //   index += 1
        // }
        //
        // . shiftLinks(events, jumps)

        let index = this.map.length;
        /** @type {Array<Array<Event>>} */
        const vecs = [];
        while (index > 0) {
          index -= 1;
          vecs.push(events.slice(this.map[index][0] + this.map[index][1]));
          // eslint-disable-next-line unicorn/no-array-push-push
          vecs.push(this.map[index][2]);

          // Truncate rest.
          events.length = this.map[index][0];
        }
        vecs.push([...events]);
        events.length = 0;
        let slice = vecs.pop();
        while (slice) {
          events.push(...slice);
          slice = vecs.pop();
        }

        // Truncate everything.
        this.map.length = 0;
      }
    }

    /**
     * Create an edit.
     *
     * @param {EditMap} editMap
     * @param {number} at
     * @param {number} remove
     * @param {Array<Event>} add
     * @returns {void}
     */
    function addImpl(editMap, at, remove, add) {
      let index = 0;

      /* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
      if (remove === 0 && add.length === 0) {
        return
      }
      while (index < editMap.map.length) {
        if (editMap.map[index][0] === at) {
          editMap.map[index][1] += remove;

          // To do: before not used.
          // if (before) {
          //   add.push(...editMap.map[index][2])
          //   editMap.map[index][2] = add
          // } else {
          editMap.map[index][2].push(...add);
          // }

          return
        }
        index += 1;
      }
      editMap.map.push([at, remove, add]);
    }

    // /**
    //  * Shift `previous` and `next` links according to `jumps`.
    //  *
    //  * This fixes links in case there are events removed or added between them.
    //  *
    //  * @param {Array<Event>} events
    //  * @param {Array<Jump>} jumps
    //  */
    // function shiftLinks(events, jumps) {
    //   let jumpIndex = 0
    //   let index = 0
    //   let add = 0
    //   let rm = 0

    //   while (index < events.length) {
    //     const rmCurr = rm

    //     while (jumpIndex < jumps.length && jumps[jumpIndex][0] <= index) {
    //       add = jumps[jumpIndex][2]
    //       rm = jumps[jumpIndex][1]
    //       jumpIndex += 1
    //     }

    //     // Ignore items that will be removed.
    //     if (rm > rmCurr) {
    //       index += rm - rmCurr
    //     } else {
    //       console.log('to do: links?', add, rmCurr)
    //       // ?
    //       // if let Some(link) = &events[index].link {
    //       //     if let Some(next) = link.next {
    //       //         events[next].link.as_mut().unwrap().previous = Some(index + add - rm);
    //       //         while jumpIndex < jumps.len() && jumps[jumpIndex].0 <= next {
    //       //             add = jumps[jumpIndex].2;
    //       //             rm = jumps[jumpIndex].1;
    //       //             jumpIndex += 1;
    //       //         }
    //       //         events[index].link.as_mut().unwrap().next = Some(next + add - rm);
    //       //         index = next;
    //       //         continue;
    //       //     }
    //       // }
    //       index += 1
    //     }
    //   }
    // }

    /**
     * @typedef {import('micromark-util-types').Event} Event
     */

    /**
     * @typedef {'left' | 'center' | 'right' | 'none'} Align
     */

    /**
     * Figure out the alignment of a GFM table.
     *
     * @param {Array<Event>} events
     * @param {number} index
     * @returns {Array<Align>}
     */
    function gfmTableAlign(events, index) {
      let inDelimiterRow = false;
      /** @type {Array<Align>} */
      const align = [];
      while (index < events.length) {
        const event = events[index];
        if (inDelimiterRow) {
          if (event[0] === 'enter') {
            // Start of alignment value: set a new column.
            // To do: `markdown-rs` uses `tableDelimiterCellValue`.
            if (event[1].type === 'tableContent') {
              align.push(
                events[index + 1][1].type === 'tableDelimiterMarker'
                  ? 'left'
                  : 'none'
              );
            }
          }
          // Exits:
          // End of alignment value: change the column.
          // To do: `markdown-rs` uses `tableDelimiterCellValue`.
          else if (event[1].type === 'tableContent') {
            if (events[index - 1][1].type === 'tableDelimiterMarker') {
              const alignIndex = align.length - 1;
              align[alignIndex] = align[alignIndex] === 'left' ? 'center' : 'right';
            }
          }
          // Done!
          else if (event[1].type === 'tableDelimiterRow') {
            break
          }
        } else if (event[0] === 'enter' && event[1].type === 'tableDelimiterRow') {
          inDelimiterRow = true;
        }
        index += 1;
      }
      return align
    }

    /**
     * @typedef {import('micromark-util-types').Event} Event
     * @typedef {import('micromark-util-types').Extension} Extension
     * @typedef {import('micromark-util-types').Point} Point
     * @typedef {import('micromark-util-types').Resolver} Resolver
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').Token} Token
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */

    // To do: next major: expose functions.

    /**
     * Extension for `micromark` that can be passed in `extensions` to enable GFM
     * table syntax.
     *
     * @type {Extension}
     */
    const gfmTable = {
      flow: {
        null: {
          tokenize: tokenizeTable,
          resolveAll: resolveTable
        }
      }
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeTable(effects, ok, nok) {
      const self = this;
      let size = 0;
      let sizeB = 0;
      /** @type {boolean | undefined} */
      let seen;
      return start

      /**
       * Start of a GFM table.
       *
       * If there is a valid table row or table head before, then we try to parse
       * another row.
       * Otherwise, we try to parse a head.
       *
       * ```markdown
       * > | | a |
       *     ^
       *   | | - |
       * > | | b |
       *     ^
       * ```
       * @type {State}
       */
      function start(code) {
        let index = self.events.length - 1;
        while (index > -1) {
          const type = self.events[index][1].type;
          if (
            type === 'lineEnding' ||
            // Note: markdown-rs uses `whitespace` instead of `linePrefix`
            type === 'linePrefix'
          )
            index--;
          else break
        }
        const tail = index > -1 ? self.events[index][1].type : null;
        const next =
          tail === 'tableHead' || tail === 'tableRow' ? bodyRowStart : headRowBefore;

        // Don’t allow lazy body rows.
        if (next === bodyRowStart && self.parser.lazy[self.now().line]) {
          return nok(code)
        }
        return next(code)
      }

      /**
       * Before table head row.
       *
       * ```markdown
       * > | | a |
       *     ^
       *   | | - |
       *   | | b |
       * ```
       *
       * @type {State}
       */
      function headRowBefore(code) {
        effects.enter('tableHead');
        effects.enter('tableRow');
        return headRowStart(code)
      }

      /**
       * Before table head row, after whitespace.
       *
       * ```markdown
       * > | | a |
       *     ^
       *   | | - |
       *   | | b |
       * ```
       *
       * @type {State}
       */
      function headRowStart(code) {
        if (code === 124) {
          return headRowBreak(code)
        }

        // To do: micromark-js should let us parse our own whitespace in extensions,
        // like `markdown-rs`:
        //
        // ```js
        // // 4+ spaces.
        // if (markdownSpace(code)) {
        //   return nok(code)
        // }
        // ```

        seen = true;
        // Count the first character, that isn’t a pipe, double.
        sizeB += 1;
        return headRowBreak(code)
      }

      /**
       * At break in table head row.
       *
       * ```markdown
       * > | | a |
       *     ^
       *       ^
       *         ^
       *   | | - |
       *   | | b |
       * ```
       *
       * @type {State}
       */
      function headRowBreak(code) {
        if (code === null) {
          // Note: in `markdown-rs`, we need to reset, in `micromark-js` we don‘t.
          return nok(code)
        }
        if (markdownLineEnding(code)) {
          // If anything other than one pipe (ignoring whitespace) was used, it’s fine.
          if (sizeB > 1) {
            sizeB = 0;
            // To do: check if this works.
            // Feel free to interrupt:
            self.interrupt = true;
            effects.exit('tableRow');
            effects.enter('lineEnding');
            effects.consume(code);
            effects.exit('lineEnding');
            return headDelimiterStart
          }

          // Note: in `markdown-rs`, we need to reset, in `micromark-js` we don‘t.
          return nok(code)
        }
        if (markdownSpace(code)) {
          // To do: check if this is fine.
          // effects.attempt(State::Next(StateName::GfmTableHeadRowBreak), State::Nok)
          // State::Retry(space_or_tab(tokenizer))
          return factorySpace(effects, headRowBreak, 'whitespace')(code)
        }
        sizeB += 1;
        if (seen) {
          seen = false;
          // Header cell count.
          size += 1;
        }
        if (code === 124) {
          effects.enter('tableCellDivider');
          effects.consume(code);
          effects.exit('tableCellDivider');
          // Whether a delimiter was seen.
          seen = true;
          return headRowBreak
        }

        // Anything else is cell data.
        effects.enter('data');
        return headRowData(code)
      }

      /**
       * In table head row data.
       *
       * ```markdown
       * > | | a |
       *       ^
       *   | | - |
       *   | | b |
       * ```
       *
       * @type {State}
       */
      function headRowData(code) {
        if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
          effects.exit('data');
          return headRowBreak(code)
        }
        effects.consume(code);
        return code === 92 ? headRowEscape : headRowData
      }

      /**
       * In table head row escape.
       *
       * ```markdown
       * > | | a\-b |
       *         ^
       *   | | ---- |
       *   | | c    |
       * ```
       *
       * @type {State}
       */
      function headRowEscape(code) {
        if (code === 92 || code === 124) {
          effects.consume(code);
          return headRowData
        }
        return headRowData(code)
      }

      /**
       * Before delimiter row.
       *
       * ```markdown
       *   | | a |
       * > | | - |
       *     ^
       *   | | b |
       * ```
       *
       * @type {State}
       */
      function headDelimiterStart(code) {
        // Reset `interrupt`.
        self.interrupt = false;

        // Note: in `markdown-rs`, we need to handle piercing here too.
        if (self.parser.lazy[self.now().line]) {
          return nok(code)
        }
        effects.enter('tableDelimiterRow');
        // Track if we’ve seen a `:` or `|`.
        seen = false;
        if (markdownSpace(code)) {
          return factorySpace(
            effects,
            headDelimiterBefore,
            'linePrefix',
            self.parser.constructs.disable.null.includes('codeIndented')
              ? undefined
              : 4
          )(code)
        }
        return headDelimiterBefore(code)
      }

      /**
       * Before delimiter row, after optional whitespace.
       *
       * Reused when a `|` is found later, to parse another cell.
       *
       * ```markdown
       *   | | a |
       * > | | - |
       *     ^
       *   | | b |
       * ```
       *
       * @type {State}
       */
      function headDelimiterBefore(code) {
        if (code === 45 || code === 58) {
          return headDelimiterValueBefore(code)
        }
        if (code === 124) {
          seen = true;
          // If we start with a pipe, we open a cell marker.
          effects.enter('tableCellDivider');
          effects.consume(code);
          effects.exit('tableCellDivider');
          return headDelimiterCellBefore
        }

        // More whitespace / empty row not allowed at start.
        return headDelimiterNok(code)
      }

      /**
       * After `|`, before delimiter cell.
       *
       * ```markdown
       *   | | a |
       * > | | - |
       *      ^
       * ```
       *
       * @type {State}
       */
      function headDelimiterCellBefore(code) {
        if (markdownSpace(code)) {
          return factorySpace(effects, headDelimiterValueBefore, 'whitespace')(code)
        }
        return headDelimiterValueBefore(code)
      }

      /**
       * Before delimiter cell value.
       *
       * ```markdown
       *   | | a |
       * > | | - |
       *       ^
       * ```
       *
       * @type {State}
       */
      function headDelimiterValueBefore(code) {
        // Align: left.
        if (code === 58) {
          sizeB += 1;
          seen = true;
          effects.enter('tableDelimiterMarker');
          effects.consume(code);
          effects.exit('tableDelimiterMarker');
          return headDelimiterLeftAlignmentAfter
        }

        // Align: none.
        if (code === 45) {
          sizeB += 1;
          // To do: seems weird that this *isn’t* left aligned, but that state is used?
          return headDelimiterLeftAlignmentAfter(code)
        }
        if (code === null || markdownLineEnding(code)) {
          return headDelimiterCellAfter(code)
        }
        return headDelimiterNok(code)
      }

      /**
       * After delimiter cell left alignment marker.
       *
       * ```markdown
       *   | | a  |
       * > | | :- |
       *        ^
       * ```
       *
       * @type {State}
       */
      function headDelimiterLeftAlignmentAfter(code) {
        if (code === 45) {
          effects.enter('tableDelimiterFiller');
          return headDelimiterFiller(code)
        }

        // Anything else is not ok after the left-align colon.
        return headDelimiterNok(code)
      }

      /**
       * In delimiter cell filler.
       *
       * ```markdown
       *   | | a |
       * > | | - |
       *       ^
       * ```
       *
       * @type {State}
       */
      function headDelimiterFiller(code) {
        if (code === 45) {
          effects.consume(code);
          return headDelimiterFiller
        }

        // Align is `center` if it was `left`, `right` otherwise.
        if (code === 58) {
          seen = true;
          effects.exit('tableDelimiterFiller');
          effects.enter('tableDelimiterMarker');
          effects.consume(code);
          effects.exit('tableDelimiterMarker');
          return headDelimiterRightAlignmentAfter
        }
        effects.exit('tableDelimiterFiller');
        return headDelimiterRightAlignmentAfter(code)
      }

      /**
       * After delimiter cell right alignment marker.
       *
       * ```markdown
       *   | |  a |
       * > | | -: |
       *         ^
       * ```
       *
       * @type {State}
       */
      function headDelimiterRightAlignmentAfter(code) {
        if (markdownSpace(code)) {
          return factorySpace(effects, headDelimiterCellAfter, 'whitespace')(code)
        }
        return headDelimiterCellAfter(code)
      }

      /**
       * After delimiter cell.
       *
       * ```markdown
       *   | |  a |
       * > | | -: |
       *          ^
       * ```
       *
       * @type {State}
       */
      function headDelimiterCellAfter(code) {
        if (code === 124) {
          return headDelimiterBefore(code)
        }
        if (code === null || markdownLineEnding(code)) {
          // Exit when:
          // * there was no `:` or `|` at all (it’s a thematic break or setext
          //   underline instead)
          // * the header cell count is not the delimiter cell count
          if (!seen || size !== sizeB) {
            return headDelimiterNok(code)
          }

          // Note: in markdown-rs`, a reset is needed here.
          effects.exit('tableDelimiterRow');
          effects.exit('tableHead');
          // To do: in `markdown-rs`, resolvers need to be registered manually.
          // effects.register_resolver(ResolveName::GfmTable)
          return ok(code)
        }
        return headDelimiterNok(code)
      }

      /**
       * In delimiter row, at a disallowed byte.
       *
       * ```markdown
       *   | | a |
       * > | | x |
       *       ^
       * ```
       *
       * @type {State}
       */
      function headDelimiterNok(code) {
        // Note: in `markdown-rs`, we need to reset, in `micromark-js` we don‘t.
        return nok(code)
      }

      /**
       * Before table body row.
       *
       * ```markdown
       *   | | a |
       *   | | - |
       * > | | b |
       *     ^
       * ```
       *
       * @type {State}
       */
      function bodyRowStart(code) {
        // Note: in `markdown-rs` we need to manually take care of a prefix,
        // but in `micromark-js` that is done for us, so if we’re here, we’re
        // never at whitespace.
        effects.enter('tableRow');
        return bodyRowBreak(code)
      }

      /**
       * At break in table body row.
       *
       * ```markdown
       *   | | a |
       *   | | - |
       * > | | b |
       *     ^
       *       ^
       *         ^
       * ```
       *
       * @type {State}
       */
      function bodyRowBreak(code) {
        if (code === 124) {
          effects.enter('tableCellDivider');
          effects.consume(code);
          effects.exit('tableCellDivider');
          return bodyRowBreak
        }
        if (code === null || markdownLineEnding(code)) {
          effects.exit('tableRow');
          return ok(code)
        }
        if (markdownSpace(code)) {
          return factorySpace(effects, bodyRowBreak, 'whitespace')(code)
        }

        // Anything else is cell content.
        effects.enter('data');
        return bodyRowData(code)
      }

      /**
       * In table body row data.
       *
       * ```markdown
       *   | | a |
       *   | | - |
       * > | | b |
       *       ^
       * ```
       *
       * @type {State}
       */
      function bodyRowData(code) {
        if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
          effects.exit('data');
          return bodyRowBreak(code)
        }
        effects.consume(code);
        return code === 92 ? bodyRowEscape : bodyRowData
      }

      /**
       * In table body row escape.
       *
       * ```markdown
       *   | | a    |
       *   | | ---- |
       * > | | b\-c |
       *         ^
       * ```
       *
       * @type {State}
       */
      function bodyRowEscape(code) {
        if (code === 92 || code === 124) {
          effects.consume(code);
          return bodyRowData
        }
        return bodyRowData(code)
      }
    }

    /** @type {Resolver} */
    // eslint-disable-next-line complexity
    function resolveTable(events, context) {
      let index = -1;
      let inFirstCellAwaitingPipe = true;
      /** @type {RowKind} */
      let rowKind = 0;
      /** @type {Range} */
      let lastCell = [0, 0, 0, 0];
      /** @type {Range} */
      let cell = [0, 0, 0, 0];
      let afterHeadAwaitingFirstBodyRow = false;
      let lastTableEnd = 0;
      /** @type {Token | undefined} */
      let currentTable;
      /** @type {Token | undefined} */
      let currentBody;
      /** @type {Token | undefined} */
      let currentCell;
      const map = new EditMap();
      while (++index < events.length) {
        const event = events[index];
        const token = event[1];
        if (event[0] === 'enter') {
          // Start of head.
          if (token.type === 'tableHead') {
            afterHeadAwaitingFirstBodyRow = false;

            // Inject previous (body end and) table end.
            if (lastTableEnd !== 0) {
              flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
              currentBody = undefined;
              lastTableEnd = 0;
            }

            // Inject table start.
            currentTable = {
              type: 'table',
              start: Object.assign({}, token.start),
              // Note: correct end is set later.
              end: Object.assign({}, token.end)
            };
            map.add(index, 0, [['enter', currentTable, context]]);
          } else if (
            token.type === 'tableRow' ||
            token.type === 'tableDelimiterRow'
          ) {
            inFirstCellAwaitingPipe = true;
            currentCell = undefined;
            lastCell = [0, 0, 0, 0];
            cell = [0, index + 1, 0, 0];

            // Inject table body start.
            if (afterHeadAwaitingFirstBodyRow) {
              afterHeadAwaitingFirstBodyRow = false;
              currentBody = {
                type: 'tableBody',
                start: Object.assign({}, token.start),
                // Note: correct end is set later.
                end: Object.assign({}, token.end)
              };
              map.add(index, 0, [['enter', currentBody, context]]);
            }
            rowKind = token.type === 'tableDelimiterRow' ? 2 : currentBody ? 3 : 1;
          }
          // Cell data.
          else if (
            rowKind &&
            (token.type === 'data' ||
              token.type === 'tableDelimiterMarker' ||
              token.type === 'tableDelimiterFiller')
          ) {
            inFirstCellAwaitingPipe = false;

            // First value in cell.
            if (cell[2] === 0) {
              if (lastCell[1] !== 0) {
                cell[0] = cell[1];
                currentCell = flushCell(
                  map,
                  context,
                  lastCell,
                  rowKind,
                  undefined,
                  currentCell
                );
                lastCell = [0, 0, 0, 0];
              }
              cell[2] = index;
            }
          } else if (token.type === 'tableCellDivider') {
            if (inFirstCellAwaitingPipe) {
              inFirstCellAwaitingPipe = false;
            } else {
              if (lastCell[1] !== 0) {
                cell[0] = cell[1];
                currentCell = flushCell(
                  map,
                  context,
                  lastCell,
                  rowKind,
                  undefined,
                  currentCell
                );
              }
              lastCell = cell;
              cell = [lastCell[1], index, 0, 0];
            }
          }
        }
        // Exit events.
        else if (token.type === 'tableHead') {
          afterHeadAwaitingFirstBodyRow = true;
          lastTableEnd = index;
        } else if (
          token.type === 'tableRow' ||
          token.type === 'tableDelimiterRow'
        ) {
          lastTableEnd = index;
          if (lastCell[1] !== 0) {
            cell[0] = cell[1];
            currentCell = flushCell(
              map,
              context,
              lastCell,
              rowKind,
              index,
              currentCell
            );
          } else if (cell[1] !== 0) {
            currentCell = flushCell(map, context, cell, rowKind, index, currentCell);
          }
          rowKind = 0;
        } else if (
          rowKind &&
          (token.type === 'data' ||
            token.type === 'tableDelimiterMarker' ||
            token.type === 'tableDelimiterFiller')
        ) {
          cell[3] = index;
        }
      }
      if (lastTableEnd !== 0) {
        flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
      }
      map.consume(context.events);

      // To do: move this into `html`, when events are exposed there.
      // That’s what `markdown-rs` does.
      // That needs updates to `mdast-util-gfm-table`.
      index = -1;
      while (++index < context.events.length) {
        const event = context.events[index];
        if (event[0] === 'enter' && event[1].type === 'table') {
          event[1]._align = gfmTableAlign(context.events, index);
        }
      }
      return events
    }

    /// Generate a cell.
    /**
     *
     * @param {EditMap} map
     * @param {TokenizeContext} context
     * @param {Range} range
     * @param {RowKind} rowKind
     * @param {number | undefined} rowEnd
     * @param {Token | undefined} previousCell
     * @returns {Token | undefined}
     */
    // eslint-disable-next-line max-params
    function flushCell(map, context, range, rowKind, rowEnd, previousCell) {
      // `markdown-rs` uses:
      // rowKind === 2 ? 'tableDelimiterCell' : 'tableCell'
      const groupName =
        rowKind === 1
          ? 'tableHeader'
          : rowKind === 2
          ? 'tableDelimiter'
          : 'tableData';
      // `markdown-rs` uses:
      // rowKind === 2 ? 'tableDelimiterCellValue' : 'tableCellText'
      const valueName = 'tableContent';

      // Insert an exit for the previous cell, if there is one.
      //
      // ```markdown
      // > | | aa | bb | cc |
      //          ^-- exit
      //           ^^^^-- this cell
      // ```
      if (range[0] !== 0) {
        previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
        map.add(range[0], 0, [['exit', previousCell, context]]);
      }

      // Insert enter of this cell.
      //
      // ```markdown
      // > | | aa | bb | cc |
      //           ^-- enter
      //           ^^^^-- this cell
      // ```
      const now = getPoint(context.events, range[1]);
      previousCell = {
        type: groupName,
        start: Object.assign({}, now),
        // Note: correct end is set later.
        end: Object.assign({}, now)
      };
      map.add(range[1], 0, [['enter', previousCell, context]]);

      // Insert text start at first data start and end at last data end, and
      // remove events between.
      //
      // ```markdown
      // > | | aa | bb | cc |
      //            ^-- enter
      //             ^-- exit
      //           ^^^^-- this cell
      // ```
      if (range[2] !== 0) {
        const relatedStart = getPoint(context.events, range[2]);
        const relatedEnd = getPoint(context.events, range[3]);
        /** @type {Token} */
        const valueToken = {
          type: valueName,
          start: Object.assign({}, relatedStart),
          end: Object.assign({}, relatedEnd)
        };
        map.add(range[2], 0, [['enter', valueToken, context]]);
        if (rowKind !== 2) {
          // Fix positional info on remaining events
          const start = context.events[range[2]];
          const end = context.events[range[3]];
          start[1].end = Object.assign({}, end[1].end);
          start[1].type = 'chunkText';
          start[1].contentType = 'text';

          // Remove if needed.
          if (range[3] > range[2] + 1) {
            const a = range[2] + 1;
            const b = range[3] - range[2] - 1;
            map.add(a, b, []);
          }
        }
        map.add(range[3] + 1, 0, [['exit', valueToken, context]]);
      }

      // Insert an exit for the last cell, if at the row end.
      //
      // ```markdown
      // > | | aa | bb | cc |
      //                    ^-- exit
      //               ^^^^^^-- this cell (the last one contains two “between” parts)
      // ```
      if (rowEnd !== undefined) {
        previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
        map.add(rowEnd, 0, [['exit', previousCell, context]]);
        previousCell = undefined;
      }
      return previousCell
    }

    /**
     * Generate table end (and table body end).
     *
     * @param {EditMap} map
     * @param {TokenizeContext} context
     * @param {number} index
     * @param {Token} table
     * @param {Token | undefined} tableBody
     */
    // eslint-disable-next-line max-params
    function flushTableEnd(map, context, index, table, tableBody) {
      /** @type {Array<Event>} */
      const exits = [];
      const related = getPoint(context.events, index);
      if (tableBody) {
        tableBody.end = Object.assign({}, related);
        exits.push(['exit', tableBody, context]);
      }
      table.end = Object.assign({}, related);
      exits.push(['exit', table, context]);
      map.add(index + 1, 0, exits);
    }

    /**
     * @param {Array<Event>} events
     * @param {number} index
     * @returns {readonly Point}
     */
    function getPoint(events, index) {
      const event = events[index];
      const side = event[0] === 'enter' ? 'start' : 'end';
      return event[1][side]
    }

    /**
     * @typedef {import('micromark-util-types').Extension} Extension
     * @typedef {import('micromark-util-types').State} State
     * @typedef {import('micromark-util-types').TokenizeContext} TokenizeContext
     * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
     */
    const tasklistCheck = {
      tokenize: tokenizeTasklistCheck
    };

    // To do: next major: expose function to make extension.

    /**
     * Extension for `micromark` that can be passed in `extensions`, to
     * enable GFM task list items syntax.
     *
     * @type {Extension}
     */
    const gfmTaskListItem = {
      text: {
        [91]: tasklistCheck
      }
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeTasklistCheck(effects, ok, nok) {
      const self = this;
      return open

      /**
       * At start of task list item check.
       *
       * ```markdown
       * > | * [x] y.
       *       ^
       * ```
       *
       * @type {State}
       */
      function open(code) {
        if (
          // Exit if there’s stuff before.
          self.previous !== null ||
          // Exit if not in the first content that is the first child of a list
          // item.
          !self._gfmTasklistFirstContentOfListItem
        ) {
          return nok(code)
        }
        effects.enter('taskListCheck');
        effects.enter('taskListCheckMarker');
        effects.consume(code);
        effects.exit('taskListCheckMarker');
        return inside
      }

      /**
       * In task list item check.
       *
       * ```markdown
       * > | * [x] y.
       *        ^
       * ```
       *
       * @type {State}
       */
      function inside(code) {
        // Currently we match how GH works in files.
        // To match how GH works in comments, use `markdownSpace` (`[\t ]`) instead
        // of `markdownLineEndingOrSpace` (`[\t\n\r ]`).
        if (markdownLineEndingOrSpace(code)) {
          effects.enter('taskListCheckValueUnchecked');
          effects.consume(code);
          effects.exit('taskListCheckValueUnchecked');
          return close
        }
        if (code === 88 || code === 120) {
          effects.enter('taskListCheckValueChecked');
          effects.consume(code);
          effects.exit('taskListCheckValueChecked');
          return close
        }
        return nok(code)
      }

      /**
       * At close of task list item check.
       *
       * ```markdown
       * > | * [x] y.
       *         ^
       * ```
       *
       * @type {State}
       */
      function close(code) {
        if (code === 93) {
          effects.enter('taskListCheckMarker');
          effects.consume(code);
          effects.exit('taskListCheckMarker');
          effects.exit('taskListCheck');
          return after
        }
        return nok(code)
      }

      /**
       * @type {State}
       */
      function after(code) {
        // EOL in paragraph means there must be something else after it.
        if (markdownLineEnding(code)) {
          return ok(code)
        }

        // Space or tab?
        // Check what comes after.
        if (markdownSpace(code)) {
          return effects.check(
            {
              tokenize: spaceThenNonSpace
            },
            ok,
            nok
          )(code)
        }

        // EOF, or non-whitespace, both wrong.
        return nok(code)
      }
    }

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function spaceThenNonSpace(effects, ok, nok) {
      return factorySpace(effects, after, 'whitespace')

      /**
       * After whitespace, after task list item check.
       *
       * ```markdown
       * > | * [x] y.
       *           ^
       * ```
       *
       * @type {State}
       */
      function after(code) {
        // EOF means there was nothing, so bad.
        // EOL means there’s content after it, so good.
        // Impossible to have more spaces.
        // Anything else is good.
        return code === null ? nok(code) : ok(code)
      }
    }

    /**
     * @typedef {import('micromark-extension-gfm-footnote').HtmlOptions} HtmlOptions
     * @typedef {import('micromark-extension-gfm-strikethrough').Options} Options
     * @typedef {import('micromark-util-types').Extension} Extension
     * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
     */

    /**
     * Create an extension for `micromark` to enable GFM syntax.
     *
     * @param {Options | null | undefined} [options]
     *   Configuration (optional).
     *
     *   Passed to `micromark-extens-gfm-strikethrough`.
     * @returns {Extension}
     *   Extension for `micromark` that can be passed in `extensions` to enable GFM
     *   syntax.
     */
    function gfm(options) {
      return combineExtensions([
        gfmAutolinkLiteral,
        gfmFootnote(),
        gfmStrikethrough(options),
        gfmTable,
        gfmTaskListItem
      ])
    }

    /**
     * Count how often a character (or substring) is used in a string.
     *
     * @param {string} value
     *   Value to search in.
     * @param {string} character
     *   Character (or substring) to look for.
     * @return {number}
     *   Number of times `character` occurred in `value`.
     */
    function ccount(value, character) {
      const source = String(value);

      if (typeof character !== 'string') {
        throw new TypeError('Expected character')
      }

      let count = 0;
      let index = source.indexOf(character);

      while (index !== -1) {
        count++;
        index = source.indexOf(character, index + character.length);
      }

      return count
    }

    function escapeStringRegexp(string) {
    	if (typeof string !== 'string') {
    		throw new TypeError('Expected a string');
    	}

    	// Escape characters with special meaning either inside or outside character sets.
    	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    	return string
    		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    		.replace(/-/g, '\\x2d');
    }

    /**
     * @typedef {import('mdast').Parent} MdastParent
     * @typedef {import('mdast').Root} Root
     * @typedef {import('mdast').Content} Content
     * @typedef {import('mdast').PhrasingContent} PhrasingContent
     * @typedef {import('mdast').Text} Text
     * @typedef {import('unist-util-visit-parents').Test} Test
     * @typedef {import('unist-util-visit-parents').VisitorResult} VisitorResult
     */

    const own = {}.hasOwnProperty;

    /**
     * Find patterns in a tree and replace them.
     *
     * The algorithm searches the tree in *preorder* for complete values in `Text`
     * nodes.
     * Partial matches are not supported.
     *
     * @param tree
     *   Tree to change.
     * @param find
     *   Patterns to find.
     * @param replace
     *   Things to replace with (when `find` is `Find`) or configuration.
     * @param options
     *   Configuration (when `find` is not `Find`).
     * @returns
     *   Given, modified, tree.
     */
    // To do: next major: remove `find` & `replace` combo, remove schema.
    const findAndReplace =
      /**
       * @type {(
       *   (<Tree extends Node>(tree: Tree, find: Find, replace?: Replace | null | undefined, options?: Options | null | undefined) => Tree) &
       *   (<Tree extends Node>(tree: Tree, schema: FindAndReplaceSchema | FindAndReplaceList, options?: Options | null | undefined) => Tree)
       * )}
       **/
      (
        /**
         * @template {Node} Tree
         * @param {Tree} tree
         * @param {Find | FindAndReplaceSchema | FindAndReplaceList} find
         * @param {Replace | Options | null | undefined} [replace]
         * @param {Options | null | undefined} [options]
         * @returns {Tree}
         */
        function (tree, find, replace, options) {
          /** @type {Options | null | undefined} */
          let settings;
          /** @type {FindAndReplaceSchema|FindAndReplaceList} */
          let schema;

          if (typeof find === 'string' || find instanceof RegExp) {
            // @ts-expect-error don’t expect options twice.
            schema = [[find, replace]];
            settings = options;
          } else {
            schema = find;
            // @ts-expect-error don’t expect replace twice.
            settings = replace;
          }

          if (!settings) {
            settings = {};
          }

          const ignored = convert(settings.ignore || []);
          const pairs = toPairs(schema);
          let pairIndex = -1;

          while (++pairIndex < pairs.length) {
            visitParents(tree, 'text', visitor);
          }

          // To do next major: don’t return the given tree.
          return tree

          /** @type {import('unist-util-visit-parents/complex-types.js').BuildVisitor<Root, 'text'>} */
          function visitor(node, parents) {
            let index = -1;
            /** @type {Parent | undefined} */
            let grandparent;

            while (++index < parents.length) {
              const parent = parents[index];

              if (
                ignored(
                  parent,
                  // @ts-expect-error: TS doesn’t understand but it’s perfect.
                  grandparent ? grandparent.children.indexOf(parent) : undefined,
                  grandparent
                )
              ) {
                return
              }

              grandparent = parent;
            }

            if (grandparent) {
              return handler(node, parents)
            }
          }

          /**
           * Handle a text node which is not in an ignored parent.
           *
           * @param {Text} node
           *   Text node.
           * @param {Array<Parent>} parents
           *   Parents.
           * @returns {VisitorResult}
           *   Result.
           */
          function handler(node, parents) {
            const parent = parents[parents.length - 1];
            const find = pairs[pairIndex][0];
            const replace = pairs[pairIndex][1];
            let start = 0;
            // @ts-expect-error: TS is wrong, some of these children can be text.
            const index = parent.children.indexOf(node);
            let change = false;
            /** @type {Array<PhrasingContent>} */
            let nodes = [];

            find.lastIndex = 0;

            let match = find.exec(node.value);

            while (match) {
              const position = match.index;
              /** @type {RegExpMatchObject} */
              const matchObject = {
                index: match.index,
                input: match.input,
                // @ts-expect-error: stack is fine.
                stack: [...parents, node]
              };
              let value = replace(...match, matchObject);

              if (typeof value === 'string') {
                value = value.length > 0 ? {type: 'text', value} : undefined;
              }

              // It wasn’t a match after all.
              if (value !== false) {
                if (start !== position) {
                  nodes.push({
                    type: 'text',
                    value: node.value.slice(start, position)
                  });
                }

                if (Array.isArray(value)) {
                  nodes.push(...value);
                } else if (value) {
                  nodes.push(value);
                }

                start = position + match[0].length;
                change = true;
              }

              if (!find.global) {
                break
              }

              match = find.exec(node.value);
            }

            if (change) {
              if (start < node.value.length) {
                nodes.push({type: 'text', value: node.value.slice(start)});
              }

              parent.children.splice(index, 1, ...nodes);
            } else {
              nodes = [node];
            }

            return index + nodes.length
          }
        }
      );

    /**
     * Turn a schema into pairs.
     *
     * @param {FindAndReplaceSchema | FindAndReplaceList} schema
     *   Schema.
     * @returns {Pairs}
     *   Clean pairs.
     */
    function toPairs(schema) {
      /** @type {Pairs} */
      const result = [];

      if (typeof schema !== 'object') {
        throw new TypeError('Expected array or object as schema')
      }

      if (Array.isArray(schema)) {
        let index = -1;

        while (++index < schema.length) {
          result.push([
            toExpression(schema[index][0]),
            toFunction(schema[index][1])
          ]);
        }
      } else {
        /** @type {string} */
        let key;

        for (key in schema) {
          if (own.call(schema, key)) {
            result.push([toExpression(key), toFunction(schema[key])]);
          }
        }
      }

      return result
    }

    /**
     * Turn a find into an expression.
     *
     * @param {Find} find
     *   Find.
     * @returns {RegExp}
     *   Expression.
     */
    function toExpression(find) {
      return typeof find === 'string' ? new RegExp(escapeStringRegexp(find), 'g') : find
    }

    /**
     * Turn a replace into a function.
     *
     * @param {Replace} replace
     *   Replace.
     * @returns {ReplaceFunction}
     *   Function.
     */
    function toFunction(replace) {
      return typeof replace === 'function' ? replace : () => replace
    }

    /**
     * @typedef {import('mdast').Link} Link
     * @typedef {import('mdast').PhrasingContent} PhrasingContent
     *
     * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
     * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
     * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
     * @typedef {import('mdast-util-from-markdown').Transform} FromMarkdownTransform
     *
     * @typedef {import('mdast-util-to-markdown').ConstructName} ConstructName
     * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
     *
     * @typedef {import('mdast-util-find-and-replace').ReplaceFunction} ReplaceFunction
     * @typedef {import('mdast-util-find-and-replace').RegExpMatchObject} RegExpMatchObject
     */

    /** @type {ConstructName} */
    const inConstruct = 'phrasing';
    /** @type {Array<ConstructName>} */
    const notInConstruct = ['autolink', 'link', 'image', 'label'];

    // To do: next major: expose functions instead of extensions.

    /**
     * Extension for `mdast-util-from-markdown` to enable GFM autolink literals.
     *
     * @type {FromMarkdownExtension}
     */
    const gfmAutolinkLiteralFromMarkdown = {
      transforms: [transformGfmAutolinkLiterals],
      enter: {
        literalAutolink: enterLiteralAutolink,
        literalAutolinkEmail: enterLiteralAutolinkValue,
        literalAutolinkHttp: enterLiteralAutolinkValue,
        literalAutolinkWww: enterLiteralAutolinkValue
      },
      exit: {
        literalAutolink: exitLiteralAutolink,
        literalAutolinkEmail: exitLiteralAutolinkEmail,
        literalAutolinkHttp: exitLiteralAutolinkHttp,
        literalAutolinkWww: exitLiteralAutolinkWww
      }
    };

    /**
     * Extension for `mdast-util-to-markdown` to enable GFM autolink literals.
     *
     * @type {ToMarkdownExtension}
     */
    const gfmAutolinkLiteralToMarkdown = {
      unsafe: [
        {
          character: '@',
          before: '[+\\-.\\w]',
          after: '[\\-.\\w]',
          inConstruct,
          notInConstruct
        },
        {
          character: '.',
          before: '[Ww]',
          after: '[\\-.\\w]',
          inConstruct,
          notInConstruct
        },
        {character: ':', before: '[ps]', after: '\\/', inConstruct, notInConstruct}
      ]
    };

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function enterLiteralAutolink(token) {
      this.enter({type: 'link', title: null, url: '', children: []}, token);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function enterLiteralAutolinkValue(token) {
      this.config.enter.autolinkProtocol.call(this, token);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitLiteralAutolinkHttp(token) {
      this.config.exit.autolinkProtocol.call(this, token);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitLiteralAutolinkWww(token) {
      this.config.exit.data.call(this, token);
      const node = /** @type {Link} */ (this.stack[this.stack.length - 1]);
      node.url = 'http://' + this.sliceSerialize(token);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitLiteralAutolinkEmail(token) {
      this.config.exit.autolinkEmail.call(this, token);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitLiteralAutolink(token) {
      this.exit(token);
    }

    /** @type {FromMarkdownTransform} */
    function transformGfmAutolinkLiterals(tree) {
      findAndReplace(
        tree,
        [
          [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, findUrl],
          [/([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/g, findEmail]
        ],
        {ignore: ['link', 'linkReference']}
      );
    }

    /**
     * @type {ReplaceFunction}
     * @param {string} _
     * @param {string} protocol
     * @param {string} domain
     * @param {string} path
     * @param {RegExpMatchObject} match
     * @returns {Link | Array<PhrasingContent> | false}
     */
    // eslint-disable-next-line max-params
    function findUrl(_, protocol, domain, path, match) {
      let prefix = '';

      // Not an expected previous character.
      if (!previous(match)) {
        return false
      }

      // Treat `www` as part of the domain.
      if (/^w/i.test(protocol)) {
        domain = protocol + domain;
        protocol = '';
        prefix = 'http://';
      }

      if (!isCorrectDomain(domain)) {
        return false
      }

      const parts = splitUrl(domain + path);

      if (!parts[0]) return false

      /** @type {Link} */
      const result = {
        type: 'link',
        title: null,
        url: prefix + protocol + parts[0],
        children: [{type: 'text', value: protocol + parts[0]}]
      };

      if (parts[1]) {
        return [result, {type: 'text', value: parts[1]}]
      }

      return result
    }

    /**
     * @type {ReplaceFunction}
     * @param {string} _
     * @param {string} atext
     * @param {string} label
     * @param {RegExpMatchObject} match
     * @returns {Link | false}
     */
    function findEmail(_, atext, label, match) {
      if (
        // Not an expected previous character.
        !previous(match, true) ||
        // Label ends in not allowed character.
        /[-\d_]$/.test(label)
      ) {
        return false
      }

      return {
        type: 'link',
        title: null,
        url: 'mailto:' + atext + '@' + label,
        children: [{type: 'text', value: atext + '@' + label}]
      }
    }

    /**
     * @param {string} domain
     * @returns {boolean}
     */
    function isCorrectDomain(domain) {
      const parts = domain.split('.');

      if (
        parts.length < 2 ||
        (parts[parts.length - 1] &&
          (/_/.test(parts[parts.length - 1]) ||
            !/[a-zA-Z\d]/.test(parts[parts.length - 1]))) ||
        (parts[parts.length - 2] &&
          (/_/.test(parts[parts.length - 2]) ||
            !/[a-zA-Z\d]/.test(parts[parts.length - 2])))
      ) {
        return false
      }

      return true
    }

    /**
     * @param {string} url
     * @returns {[string, string | undefined]}
     */
    function splitUrl(url) {
      const trailExec = /[!"&'),.:;<>?\]}]+$/.exec(url);

      if (!trailExec) {
        return [url, undefined]
      }

      url = url.slice(0, trailExec.index);

      let trail = trailExec[0];
      let closingParenIndex = trail.indexOf(')');
      const openingParens = ccount(url, '(');
      let closingParens = ccount(url, ')');

      while (closingParenIndex !== -1 && openingParens > closingParens) {
        url += trail.slice(0, closingParenIndex + 1);
        trail = trail.slice(closingParenIndex + 1);
        closingParenIndex = trail.indexOf(')');
        closingParens++;
      }

      return [url, trail]
    }

    /**
     * @param {RegExpMatchObject} match
     * @param {boolean | null | undefined} [email=false]
     * @returns {boolean}
     */
    function previous(match, email) {
      const code = match.input.charCodeAt(match.index - 1);

      return (
        (match.index === 0 ||
          unicodeWhitespace(code) ||
          unicodePunctuation(code)) &&
        (!email || code !== 47)
      )
    }

    /**
     * @typedef {import('../types.js').AssociationId} AssociationId
     */

    /**
     * Get an identifier from an association to match it to others.
     *
     * Associations are nodes that match to something else through an ID:
     * <https://github.com/syntax-tree/mdast#association>.
     *
     * The `label` of an association is the string value: character escapes and
     * references work, and casing is intact.
     * The `identifier` is used to match one association to another:
     * controversially, character escapes and references don’t work in this
     * matching: `&copy;` does not match `©`, and `\+` does not match `+`.
     *
     * But casing is ignored (and whitespace) is trimmed and collapsed: ` A\nb`
     * matches `a b`.
     * So, we do prefer the label when figuring out how we’re going to serialize:
     * it has whitespace, casing, and we can ignore most useless character
     * escapes and all character references.
     *
     * @type {AssociationId}
     */
    function association(node) {
      if (node.label || !node.identifier) {
        return node.label || ''
      }

      return decodeString(node.identifier)
    }

    /**
     * @typedef {import('../types.js').FlowContent} FlowContent
     * @typedef {import('../types.js').Node} Node
     * @typedef {import('../types.js').Parent} Parent
     * @typedef {import('../types.js').State} State
     * @typedef {import('../types.js').TrackFields} TrackFields
     */

    /**
     * @param {Parent & {children: Array<FlowContent>}} parent
     *   Parent of flow nodes.
     * @param {State} state
     *   Info passed around about the current state.
     * @param {TrackFields} info
     *   Info on where we are in the document we are generating.
     * @returns {string}
     *   Serialized children, joined by (blank) lines.
     */
    function containerFlow(parent, state, info) {
      const indexStack = state.indexStack;
      const children = parent.children || [];
      const tracker = state.createTracker(info);
      /** @type {Array<string>} */
      const results = [];
      let index = -1;

      indexStack.push(-1);

      while (++index < children.length) {
        const child = children[index];

        indexStack[indexStack.length - 1] = index;

        results.push(
          tracker.move(
            state.handle(child, parent, state, {
              before: '\n',
              after: '\n',
              ...tracker.current()
            })
          )
        );

        if (child.type !== 'list') {
          state.bulletLastUsed = undefined;
        }

        if (index < children.length - 1) {
          results.push(
            tracker.move(between(child, children[index + 1], parent, state))
          );
        }
      }

      indexStack.pop();

      return results.join('')
    }

    /**
     * @param {Node} left
     * @param {Node} right
     * @param {Parent} parent
     * @param {State} state
     * @returns {string}
     */
    function between(left, right, parent, state) {
      let index = state.join.length;

      while (index--) {
        const result = state.join[index](left, right, parent, state);

        if (result === true || result === 1) {
          break
        }

        if (typeof result === 'number') {
          return '\n'.repeat(1 + result)
        }

        if (result === false) {
          return '\n\n<!---->\n\n'
        }
      }

      return '\n\n'
    }

    /**
     * @typedef {import('../types.js').IndentLines} IndentLines
     */

    const eol = /\r?\n|\r/g;

    /**
     * @type {IndentLines}
     */
    function indentLines(value, map) {
      /** @type {Array<string>} */
      const result = [];
      let start = 0;
      let line = 0;
      /** @type {RegExpExecArray | null} */
      let match;

      while ((match = eol.exec(value))) {
        one(value.slice(start, match.index));
        result.push(match[0]);
        start = match.index + match[0].length;
        line++;
      }

      one(value.slice(start));

      return result.join('')

      /**
       * @param {string} value
       */
      function one(value) {
        result.push(map(value, line, !value));
      }
    }

    /**
     * @typedef {import('../types.js').Unsafe} Unsafe
     */

    /**
     * @param {Unsafe} pattern
     * @returns {RegExp}
     */
    function patternCompile(pattern) {
      if (!pattern._compiled) {
        const before =
          (pattern.atBreak ? '[\\r\\n][\\t ]*' : '') +
          (pattern.before ? '(?:' + pattern.before + ')' : '');

        pattern._compiled = new RegExp(
          (before ? '(' + before + ')' : '') +
            (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? '\\' : '') +
            pattern.character +
            (pattern.after ? '(?:' + pattern.after + ')' : ''),
          'g'
        );
      }

      return pattern._compiled
    }

    /**
     * @typedef {import('../types.js').Unsafe} Unsafe
     * @typedef {import('../types.js').ConstructName} ConstructName
     */

    /**
     * @param {Array<ConstructName>} stack
     * @param {Unsafe} pattern
     * @returns {boolean}
     */
    function patternInScope(stack, pattern) {
      return (
        listInScope(stack, pattern.inConstruct, true) &&
        !listInScope(stack, pattern.notInConstruct, false)
      )
    }

    /**
     * @param {Array<ConstructName>} stack
     * @param {Unsafe['inConstruct']} list
     * @param {boolean} none
     * @returns {boolean}
     */
    function listInScope(stack, list, none) {
      if (typeof list === 'string') {
        list = [list];
      }

      if (!list || list.length === 0) {
        return none
      }

      let index = -1;

      while (++index < list.length) {
        if (stack.includes(list[index])) {
          return true
        }
      }

      return false
    }

    /**
     * @typedef {import('../types.js').State} State
     * @typedef {import('../types.js').SafeConfig} SafeConfig
     */

    /**
     * Make a string safe for embedding in markdown constructs.
     *
     * In markdown, almost all punctuation characters can, in certain cases,
     * result in something.
     * Whether they do is highly subjective to where they happen and in what
     * they happen.
     *
     * To solve this, `mdast-util-to-markdown` tracks:
     *
     * * Characters before and after something;
     * * What “constructs” we are in.
     *
     * This information is then used by this function to escape or encode
     * special characters.
     *
     * @param {State} state
     *   Info passed around about the current state.
     * @param {string | null | undefined} input
     *   Raw value to make safe.
     * @param {SafeConfig} config
     *   Configuration.
     * @returns {string}
     *   Serialized markdown safe for embedding.
     */
    function safe(state, input, config) {
      const value = (config.before || '') + (input || '') + (config.after || '');
      /** @type {Array<number>} */
      const positions = [];
      /** @type {Array<string>} */
      const result = [];
      /** @type {Record<number, {before: boolean, after: boolean}>} */
      const infos = {};
      let index = -1;

      while (++index < state.unsafe.length) {
        const pattern = state.unsafe[index];

        if (!patternInScope(state.stack, pattern)) {
          continue
        }

        const expression = patternCompile(pattern);
        /** @type {RegExpExecArray | null} */
        let match;

        while ((match = expression.exec(value))) {
          const before = 'before' in pattern || Boolean(pattern.atBreak);
          const after = 'after' in pattern;
          const position = match.index + (before ? match[1].length : 0);

          if (positions.includes(position)) {
            if (infos[position].before && !before) {
              infos[position].before = false;
            }

            if (infos[position].after && !after) {
              infos[position].after = false;
            }
          } else {
            positions.push(position);
            infos[position] = {before, after};
          }
        }
      }

      positions.sort(numerical);

      let start = config.before ? config.before.length : 0;
      const end = value.length - (config.after ? config.after.length : 0);
      index = -1;

      while (++index < positions.length) {
        const position = positions[index];

        // Character before or after matched:
        if (position < start || position >= end) {
          continue
        }

        // If this character is supposed to be escaped because it has a condition on
        // the next character, and the next character is definitly being escaped,
        // then skip this escape.
        if (
          (position + 1 < end &&
            positions[index + 1] === position + 1 &&
            infos[position].after &&
            !infos[position + 1].before &&
            !infos[position + 1].after) ||
          (positions[index - 1] === position - 1 &&
            infos[position].before &&
            !infos[position - 1].before &&
            !infos[position - 1].after)
        ) {
          continue
        }

        if (start !== position) {
          // If we have to use a character reference, an ampersand would be more
          // correct, but as backslashes only care about punctuation, either will
          // do the trick
          result.push(escapeBackslashes(value.slice(start, position), '\\'));
        }

        start = position;

        if (
          /[!-/:-@[-`{-~]/.test(value.charAt(position)) &&
          (!config.encode || !config.encode.includes(value.charAt(position)))
        ) {
          // Character escape.
          result.push('\\');
        } else {
          // Character reference.
          result.push(
            '&#x' + value.charCodeAt(position).toString(16).toUpperCase() + ';'
          );
          start++;
        }
      }

      result.push(escapeBackslashes(value.slice(start, end), config.after));

      return result.join('')
    }

    /**
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    function numerical(a, b) {
      return a - b
    }

    /**
     * @param {string} value
     * @param {string} after
     * @returns {string}
     */
    function escapeBackslashes(value, after) {
      const expression = /\\(?=[!-/:-@[-`{-~])/g;
      /** @type {Array<number>} */
      const positions = [];
      /** @type {Array<string>} */
      const results = [];
      const whole = value + after;
      let index = -1;
      let start = 0;
      /** @type {RegExpExecArray | null} */
      let match;

      while ((match = expression.exec(whole))) {
        positions.push(match.index);
      }

      while (++index < positions.length) {
        if (start !== positions[index]) {
          results.push(value.slice(start, positions[index]));
        }

        results.push('\\');
        start = positions[index];
      }

      results.push(value.slice(start));

      return results.join('')
    }

    /**
     * @typedef {import('../types.js').CreateTracker} CreateTracker
     * @typedef {import('../types.js').TrackCurrent} TrackCurrent
     * @typedef {import('../types.js').TrackMove} TrackMove
     * @typedef {import('../types.js').TrackShift} TrackShift
     */

    /**
     * Track positional info in the output.
     *
     * @type {CreateTracker}
     */
    function track(config) {
      // Defaults are used to prevent crashes when older utilities somehow activate
      // this code.
      /* c8 ignore next 5 */
      const options = config || {};
      const now = options.now || {};
      let lineShift = options.lineShift || 0;
      let line = now.line || 1;
      let column = now.column || 1;

      return {move, current, shift}

      /**
       * Get the current tracked info.
       *
       * @type {TrackCurrent}
       */
      function current() {
        return {now: {line, column}, lineShift}
      }

      /**
       * Define an increased line shift (the typical indent for lines).
       *
       * @type {TrackShift}
       */
      function shift(value) {
        lineShift += value;
      }

      /**
       * Move past some generated markdown.
       *
       * @type {TrackMove}
       */
      function move(input) {
        // eslint-disable-next-line unicorn/prefer-default-parameters
        const value = input || '';
        const chunks = value.split(/\r?\n|\r/g);
        const tail = chunks[chunks.length - 1];
        line += chunks.length - 1;
        column =
          chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift;
        return value
      }
    }

    /**
     * @typedef {import('mdast').FootnoteReference} FootnoteReference
     * @typedef {import('mdast').FootnoteDefinition} FootnoteDefinition
     * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
     * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
     * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
     * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
     * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
     * @typedef {import('mdast-util-to-markdown').Map} Map
     */

    footnoteReference.peek = footnoteReferencePeek;

    // To do: next major: rename `context` -> `state`, `safeOptions` to `info`, use
    // utilities on `state`.

    /**
     * Create an extension for `mdast-util-from-markdown` to enable GFM footnotes
     * in markdown.
     *
     * @returns {FromMarkdownExtension}
     *   Extension for `mdast-util-from-markdown`.
     */
    function gfmFootnoteFromMarkdown() {
      return {
        enter: {
          gfmFootnoteDefinition: enterFootnoteDefinition,
          gfmFootnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,
          gfmFootnoteCall: enterFootnoteCall,
          gfmFootnoteCallString: enterFootnoteCallString
        },
        exit: {
          gfmFootnoteDefinition: exitFootnoteDefinition,
          gfmFootnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,
          gfmFootnoteCall: exitFootnoteCall,
          gfmFootnoteCallString: exitFootnoteCallString
        }
      }
    }

    /**
     * Create an extension for `mdast-util-to-markdown` to enable GFM footnotes
     * in markdown.
     *
     * @returns {ToMarkdownExtension}
     *   Extension for `mdast-util-to-markdown`.
     */
    function gfmFootnoteToMarkdown() {
      return {
        // This is on by default already.
        unsafe: [{character: '[', inConstruct: ['phrasing', 'label', 'reference']}],
        handlers: {footnoteDefinition, footnoteReference}
      }
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function enterFootnoteDefinition(token) {
      this.enter(
        {type: 'footnoteDefinition', identifier: '', label: '', children: []},
        token
      );
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function enterFootnoteDefinitionLabelString() {
      this.buffer();
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitFootnoteDefinitionLabelString(token) {
      const label = this.resume();
      const node = /** @type {FootnoteDefinition} */ (
        this.stack[this.stack.length - 1]
      );
      node.label = label;
      node.identifier = normalizeIdentifier(
        this.sliceSerialize(token)
      ).toLowerCase();
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitFootnoteDefinition(token) {
      this.exit(token);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function enterFootnoteCall(token) {
      this.enter({type: 'footnoteReference', identifier: '', label: ''}, token);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function enterFootnoteCallString() {
      this.buffer();
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitFootnoteCallString(token) {
      const label = this.resume();
      const node = /** @type {FootnoteDefinition} */ (
        this.stack[this.stack.length - 1]
      );
      node.label = label;
      node.identifier = normalizeIdentifier(
        this.sliceSerialize(token)
      ).toLowerCase();
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitFootnoteCall(token) {
      this.exit(token);
    }

    /**
     * @type {ToMarkdownHandle}
     * @param {FootnoteReference} node
     */
    function footnoteReference(node, _, context, safeOptions) {
      const tracker = track(safeOptions);
      let value = tracker.move('[^');
      const exit = context.enter('footnoteReference');
      const subexit = context.enter('reference');
      value += tracker.move(
        safe(context, association(node), {
          ...tracker.current(),
          before: value,
          after: ']'
        })
      );
      subexit();
      exit();
      value += tracker.move(']');
      return value
    }

    /** @type {ToMarkdownHandle} */
    function footnoteReferencePeek() {
      return '['
    }

    /**
     * @type {ToMarkdownHandle}
     * @param {FootnoteDefinition} node
     */
    function footnoteDefinition(node, _, context, safeOptions) {
      const tracker = track(safeOptions);
      let value = tracker.move('[^');
      const exit = context.enter('footnoteDefinition');
      const subexit = context.enter('label');
      value += tracker.move(
        safe(context, association(node), {
          ...tracker.current(),
          before: value,
          after: ']'
        })
      );
      subexit();
      value += tracker.move(
        ']:' + (node.children && node.children.length > 0 ? ' ' : '')
      );
      tracker.shift(4);
      value += tracker.move(
        indentLines(containerFlow(node, context, tracker.current()), map)
      );
      exit();

      return value
    }

    /** @type {Map} */
    function map(line, index, blank) {
      if (index === 0) {
        return line
      }

      return (blank ? '' : '    ') + line
    }

    /**
     * @typedef {import('../types.js').Handle} Handle
     * @typedef {import('../types.js').Info} Info
     * @typedef {import('../types.js').Parent} Parent
     * @typedef {import('../types.js').PhrasingContent} PhrasingContent
     * @typedef {import('../types.js').State} State
     */

    /**
     * Serialize the children of a parent that contains phrasing children.
     *
     * These children will be joined flush together.
     *
     * @param {Parent & {children: Array<PhrasingContent>}} parent
     *   Parent of flow nodes.
     * @param {State} state
     *   Info passed around about the current state.
     * @param {Info} info
     *   Info on where we are in the document we are generating.
     * @returns {string}
     *   Serialized children, joined together.
     */
    function containerPhrasing(parent, state, info) {
      const indexStack = state.indexStack;
      const children = parent.children || [];
      /** @type {Array<string>} */
      const results = [];
      let index = -1;
      let before = info.before;

      indexStack.push(-1);
      let tracker = state.createTracker(info);

      while (++index < children.length) {
        const child = children[index];
        /** @type {string} */
        let after;

        indexStack[indexStack.length - 1] = index;

        if (index + 1 < children.length) {
          /** @type {Handle} */
          // @ts-expect-error: hush, it’s actually a `zwitch`.
          let handle = state.handle.handlers[children[index + 1].type];
          /** @type {Handle} */
          // @ts-expect-error: hush, it’s actually a `zwitch`.
          if (handle && handle.peek) handle = handle.peek;
          after = handle
            ? handle(children[index + 1], parent, state, {
                before: '',
                after: '',
                ...tracker.current()
              }).charAt(0)
            : '';
        } else {
          after = info.after;
        }

        // In some cases, html (text) can be found in phrasing right after an eol.
        // When we’d serialize that, in most cases that would be seen as html
        // (flow).
        // As we can’t escape or so to prevent it from happening, we take a somewhat
        // reasonable approach: replace that eol with a space.
        // See: <https://github.com/syntax-tree/mdast-util-to-markdown/issues/15>
        if (
          results.length > 0 &&
          (before === '\r' || before === '\n') &&
          child.type === 'html'
        ) {
          results[results.length - 1] = results[results.length - 1].replace(
            /(\r?\n|\r)$/,
            ' '
          );
          before = ' ';

          // To do: does this work to reset tracker?
          tracker = state.createTracker(info);
          tracker.move(results.join(''));
        }

        results.push(
          tracker.move(
            state.handle(child, parent, state, {
              ...tracker.current(),
              before,
              after
            })
          )
        );

        before = results[results.length - 1].slice(-1);
      }

      indexStack.pop();

      return results.join('')
    }

    /**
     * @typedef {import('mdast').Delete} Delete
     *
     * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
     * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
     * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
     *
     * @typedef {import('mdast-util-to-markdown').ConstructName} ConstructName
     * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
     * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
     */

    // To do: next major: expose functions.
    // To do: next major: use `state`, state utilities.

    /**
     * List of constructs that occur in phrasing (paragraphs, headings), but cannot
     * contain strikethrough.
     * So they sort of cancel each other out.
     * Note: could use a better name.
     *
     * Note: keep in sync with: <https://github.com/syntax-tree/mdast-util-to-markdown/blob/8ce8dbf/lib/unsafe.js#L14>
     *
     * @type {Array<ConstructName>}
     */
    const constructsWithoutStrikethrough = [
      'autolink',
      'destinationLiteral',
      'destinationRaw',
      'reference',
      'titleQuote',
      'titleApostrophe'
    ];

    handleDelete.peek = peekDelete;

    /**
     * Extension for `mdast-util-from-markdown` to enable GFM strikethrough.
     *
     * @type {FromMarkdownExtension}
     */
    const gfmStrikethroughFromMarkdown = {
      canContainEols: ['delete'],
      enter: {strikethrough: enterStrikethrough},
      exit: {strikethrough: exitStrikethrough}
    };

    /**
     * Extension for `mdast-util-to-markdown` to enable GFM strikethrough.
     *
     * @type {ToMarkdownExtension}
     */
    const gfmStrikethroughToMarkdown = {
      unsafe: [
        {
          character: '~',
          inConstruct: 'phrasing',
          notInConstruct: constructsWithoutStrikethrough
        }
      ],
      handlers: {delete: handleDelete}
    };

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function enterStrikethrough(token) {
      this.enter({type: 'delete', children: []}, token);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitStrikethrough(token) {
      this.exit(token);
    }

    /**
     * @type {ToMarkdownHandle}
     * @param {Delete} node
     */
    function handleDelete(node, _, context, safeOptions) {
      const tracker = track(safeOptions);
      const exit = context.enter('strikethrough');
      let value = tracker.move('~~');
      value += containerPhrasing(node, context, {
        ...tracker.current(),
        before: value,
        after: '~'
      });
      value += tracker.move('~~');
      exit();
      return value
    }

    /** @type {ToMarkdownHandle} */
    function peekDelete() {
      return '~'
    }

    /**
     * @typedef {import('mdast').InlineCode} InlineCode
     * @typedef {import('../types.js').Parent} Parent
     * @typedef {import('../types.js').State} State
     */

    inlineCode.peek = inlineCodePeek;

    /**
     * @param {InlineCode} node
     * @param {Parent | undefined} _
     * @param {State} state
     * @returns {string}
     */
    function inlineCode(node, _, state) {
      let value = node.value || '';
      let sequence = '`';
      let index = -1;

      // If there is a single grave accent on its own in the code, use a fence of
      // two.
      // If there are two in a row, use one.
      while (new RegExp('(^|[^`])' + sequence + '([^`]|$)').test(value)) {
        sequence += '`';
      }

      // If this is not just spaces or eols (tabs don’t count), and either the
      // first or last character are a space, eol, or tick, then pad with spaces.
      if (
        /[^ \r\n]/.test(value) &&
        ((/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value)) || /^`|`$/.test(value))
      ) {
        value = ' ' + value + ' ';
      }

      // We have a potential problem: certain characters after eols could result in
      // blocks being seen.
      // For example, if someone injected the string `'\n# b'`, then that would
      // result in an ATX heading.
      // We can’t escape characters in `inlineCode`, but because eols are
      // transformed to spaces when going from markdown to HTML anyway, we can swap
      // them out.
      while (++index < state.unsafe.length) {
        const pattern = state.unsafe[index];
        const expression = patternCompile(pattern);
        /** @type {RegExpExecArray | null} */
        let match;

        // Only look for `atBreak`s.
        // Btw: note that `atBreak` patterns will always start the regex at LF or
        // CR.
        if (!pattern.atBreak) continue

        while ((match = expression.exec(value))) {
          let position = match.index;

          // Support CRLF (patterns only look for one of the characters).
          if (
            value.charCodeAt(position) === 10 /* `\n` */ &&
            value.charCodeAt(position - 1) === 13 /* `\r` */
          ) {
            position--;
          }

          value = value.slice(0, position) + ' ' + value.slice(match.index + 1);
        }
      }

      return sequence + value + sequence
    }

    /**
     * @returns {string}
     */
    function inlineCodePeek() {
      return '`'
    }

    /**
     * @typedef Options
     *   Configuration (optional).
     * @property {string|null|ReadonlyArray<string|null|undefined>} [align]
     *   One style for all columns, or styles for their respective columns.
     *   Each style is either `'l'` (left), `'r'` (right), or `'c'` (center).
     *   Other values are treated as `''`, which doesn’t place the colon in the
     *   alignment row but does align left.
     *   *Only the lowercased first character is used, so `Right` is fine.*
     * @property {boolean} [padding=true]
     *   Whether to add a space of padding between delimiters and cells.
     *
     *   When `true`, there is padding:
     *
     *   ```markdown
     *   | Alpha | B     |
     *   | ----- | ----- |
     *   | C     | Delta |
     *   ```
     *
     *   When `false`, there is no padding:
     *
     *   ```markdown
     *   |Alpha|B    |
     *   |-----|-----|
     *   |C    |Delta|
     *   ```
     * @property {boolean} [delimiterStart=true]
     *   Whether to begin each row with the delimiter.
     *
     *   > 👉 **Note**: please don’t use this: it could create fragile structures
     *   > that aren’t understandable to some markdown parsers.
     *
     *   When `true`, there are starting delimiters:
     *
     *   ```markdown
     *   | Alpha | B     |
     *   | ----- | ----- |
     *   | C     | Delta |
     *   ```
     *
     *   When `false`, there are no starting delimiters:
     *
     *   ```markdown
     *   Alpha | B     |
     *   ----- | ----- |
     *   C     | Delta |
     *   ```
     * @property {boolean} [delimiterEnd=true]
     *   Whether to end each row with the delimiter.
     *
     *   > 👉 **Note**: please don’t use this: it could create fragile structures
     *   > that aren’t understandable to some markdown parsers.
     *
     *   When `true`, there are ending delimiters:
     *
     *   ```markdown
     *   | Alpha | B     |
     *   | ----- | ----- |
     *   | C     | Delta |
     *   ```
     *
     *   When `false`, there are no ending delimiters:
     *
     *   ```markdown
     *   | Alpha | B
     *   | ----- | -----
     *   | C     | Delta
     *   ```
     * @property {boolean} [alignDelimiters=true]
     *   Whether to align the delimiters.
     *   By default, they are aligned:
     *
     *   ```markdown
     *   | Alpha | B     |
     *   | ----- | ----- |
     *   | C     | Delta |
     *   ```
     *
     *   Pass `false` to make them staggered:
     *
     *   ```markdown
     *   | Alpha | B |
     *   | - | - |
     *   | C | Delta |
     *   ```
     * @property {(value: string) => number} [stringLength]
     *   Function to detect the length of table cell content.
     *   This is used when aligning the delimiters (`|`) between table cells.
     *   Full-width characters and emoji mess up delimiter alignment when viewing
     *   the markdown source.
     *   To fix this, you can pass this function, which receives the cell content
     *   and returns its “visible” size.
     *   Note that what is and isn’t visible depends on where the text is displayed.
     *
     *   Without such a function, the following:
     *
     *   ```js
     *   markdownTable([
     *     ['Alpha', 'Bravo'],
     *     ['中文', 'Charlie'],
     *     ['👩‍❤️‍👩', 'Delta']
     *   ])
     *   ```
     *
     *   Yields:
     *
     *   ```markdown
     *   | Alpha | Bravo |
     *   | - | - |
     *   | 中文 | Charlie |
     *   | 👩‍❤️‍👩 | Delta |
     *   ```
     *
     *   With [`string-width`](https://github.com/sindresorhus/string-width):
     *
     *   ```js
     *   import stringWidth from 'string-width'
     *
     *   markdownTable(
     *     [
     *       ['Alpha', 'Bravo'],
     *       ['中文', 'Charlie'],
     *       ['👩‍❤️‍👩', 'Delta']
     *     ],
     *     {stringLength: stringWidth}
     *   )
     *   ```
     *
     *   Yields:
     *
     *   ```markdown
     *   | Alpha | Bravo   |
     *   | ----- | ------- |
     *   | 中文  | Charlie |
     *   | 👩‍❤️‍👩    | Delta   |
     *   ```
     */

    /**
     * @typedef {Options} MarkdownTableOptions
     * @todo
     *   Remove next major.
     */

    /**
     * Generate a markdown ([GFM](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables)) table..
     *
     * @param {ReadonlyArray<ReadonlyArray<string|null|undefined>>} table
     *   Table data (matrix of strings).
     * @param {Options} [options]
     *   Configuration (optional).
     * @returns {string}
     */
    function markdownTable(table, options = {}) {
      const align = (options.align || []).concat();
      const stringLength = options.stringLength || defaultStringLength;
      /** @type {Array<number>} Character codes as symbols for alignment per column. */
      const alignments = [];
      /** @type {Array<Array<string>>} Cells per row. */
      const cellMatrix = [];
      /** @type {Array<Array<number>>} Sizes of each cell per row. */
      const sizeMatrix = [];
      /** @type {Array<number>} */
      const longestCellByColumn = [];
      let mostCellsPerRow = 0;
      let rowIndex = -1;

      // This is a superfluous loop if we don’t align delimiters, but otherwise we’d
      // do superfluous work when aligning, so optimize for aligning.
      while (++rowIndex < table.length) {
        /** @type {Array<string>} */
        const row = [];
        /** @type {Array<number>} */
        const sizes = [];
        let columnIndex = -1;

        if (table[rowIndex].length > mostCellsPerRow) {
          mostCellsPerRow = table[rowIndex].length;
        }

        while (++columnIndex < table[rowIndex].length) {
          const cell = serialize(table[rowIndex][columnIndex]);

          if (options.alignDelimiters !== false) {
            const size = stringLength(cell);
            sizes[columnIndex] = size;

            if (
              longestCellByColumn[columnIndex] === undefined ||
              size > longestCellByColumn[columnIndex]
            ) {
              longestCellByColumn[columnIndex] = size;
            }
          }

          row.push(cell);
        }

        cellMatrix[rowIndex] = row;
        sizeMatrix[rowIndex] = sizes;
      }

      // Figure out which alignments to use.
      let columnIndex = -1;

      if (typeof align === 'object' && 'length' in align) {
        while (++columnIndex < mostCellsPerRow) {
          alignments[columnIndex] = toAlignment(align[columnIndex]);
        }
      } else {
        const code = toAlignment(align);

        while (++columnIndex < mostCellsPerRow) {
          alignments[columnIndex] = code;
        }
      }

      // Inject the alignment row.
      columnIndex = -1;
      /** @type {Array<string>} */
      const row = [];
      /** @type {Array<number>} */
      const sizes = [];

      while (++columnIndex < mostCellsPerRow) {
        const code = alignments[columnIndex];
        let before = '';
        let after = '';

        if (code === 99 /* `c` */) {
          before = ':';
          after = ':';
        } else if (code === 108 /* `l` */) {
          before = ':';
        } else if (code === 114 /* `r` */) {
          after = ':';
        }

        // There *must* be at least one hyphen-minus in each alignment cell.
        let size =
          options.alignDelimiters === false
            ? 1
            : Math.max(
                1,
                longestCellByColumn[columnIndex] - before.length - after.length
              );

        const cell = before + '-'.repeat(size) + after;

        if (options.alignDelimiters !== false) {
          size = before.length + size + after.length;

          if (size > longestCellByColumn[columnIndex]) {
            longestCellByColumn[columnIndex] = size;
          }

          sizes[columnIndex] = size;
        }

        row[columnIndex] = cell;
      }

      // Inject the alignment row.
      cellMatrix.splice(1, 0, row);
      sizeMatrix.splice(1, 0, sizes);

      rowIndex = -1;
      /** @type {Array<string>} */
      const lines = [];

      while (++rowIndex < cellMatrix.length) {
        const row = cellMatrix[rowIndex];
        const sizes = sizeMatrix[rowIndex];
        columnIndex = -1;
        /** @type {Array<string>} */
        const line = [];

        while (++columnIndex < mostCellsPerRow) {
          const cell = row[columnIndex] || '';
          let before = '';
          let after = '';

          if (options.alignDelimiters !== false) {
            const size =
              longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0);
            const code = alignments[columnIndex];

            if (code === 114 /* `r` */) {
              before = ' '.repeat(size);
            } else if (code === 99 /* `c` */) {
              if (size % 2) {
                before = ' '.repeat(size / 2 + 0.5);
                after = ' '.repeat(size / 2 - 0.5);
              } else {
                before = ' '.repeat(size / 2);
                after = before;
              }
            } else {
              after = ' '.repeat(size);
            }
          }

          if (options.delimiterStart !== false && !columnIndex) {
            line.push('|');
          }

          if (
            options.padding !== false &&
            // Don’t add the opening space if we’re not aligning and the cell is
            // empty: there will be a closing space.
            !(options.alignDelimiters === false && cell === '') &&
            (options.delimiterStart !== false || columnIndex)
          ) {
            line.push(' ');
          }

          if (options.alignDelimiters !== false) {
            line.push(before);
          }

          line.push(cell);

          if (options.alignDelimiters !== false) {
            line.push(after);
          }

          if (options.padding !== false) {
            line.push(' ');
          }

          if (
            options.delimiterEnd !== false ||
            columnIndex !== mostCellsPerRow - 1
          ) {
            line.push('|');
          }
        }

        lines.push(
          options.delimiterEnd === false
            ? line.join('').replace(/ +$/, '')
            : line.join('')
        );
      }

      return lines.join('\n')
    }

    /**
     * @param {string|null|undefined} [value]
     * @returns {string}
     */
    function serialize(value) {
      return value === null || value === undefined ? '' : String(value)
    }

    /**
     * @param {string} value
     * @returns {number}
     */
    function defaultStringLength(value) {
      return value.length
    }

    /**
     * @param {string|null|undefined} value
     * @returns {number}
     */
    function toAlignment(value) {
      const code = typeof value === 'string' ? value.codePointAt(0) : 0;

      return code === 67 /* `C` */ || code === 99 /* `c` */
        ? 99 /* `c` */
        : code === 76 /* `L` */ || code === 108 /* `l` */
        ? 108 /* `l` */
        : code === 82 /* `R` */ || code === 114 /* `r` */
        ? 114 /* `r` */
        : 0
    }

    /**
     * @typedef {import('mdast').Table} Table
     * @typedef {import('mdast').TableRow} TableRow
     * @typedef {import('mdast').TableCell} TableCell
     * @typedef {import('mdast').InlineCode} InlineCode
     *
     * @typedef {import('markdown-table').MarkdownTableOptions} MarkdownTableOptions
     *
     * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
     * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
     * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
     *
     * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
     * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
     * @typedef {import('mdast-util-to-markdown').Context} ToMarkdownContext
     * @typedef {import('mdast-util-to-markdown').SafeOptions} SafeOptions
     */

    // To do: next major: use `state` and `state` utilities from `mdast-util-to-markdown`.
    // To do: next major: use `defaultHandlers.inlineCode`.
    // To do: next major: expose functions.

    /**
     * Extension for `mdast-util-from-markdown` to enable GFM tables.
     *
     * @type {FromMarkdownExtension}
     */
    const gfmTableFromMarkdown = {
      enter: {
        table: enterTable,
        tableData: enterCell,
        tableHeader: enterCell,
        tableRow: enterRow
      },
      exit: {
        codeText: exitCodeText,
        table: exitTable,
        tableData: exit,
        tableHeader: exit,
        tableRow: exit
      }
    };

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function enterTable(token) {
      /** @type {Array<'left' | 'right' | 'center' | 'none'>} */
      // @ts-expect-error: `align` is custom.
      const align = token._align;
      this.enter(
        {
          type: 'table',
          align: align.map((d) => (d === 'none' ? null : d)),
          children: []
        },
        token
      );
      this.setData('inTable', true);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitTable(token) {
      this.exit(token);
      this.setData('inTable');
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function enterRow(token) {
      this.enter({type: 'tableRow', children: []}, token);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exit(token) {
      this.exit(token);
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function enterCell(token) {
      this.enter({type: 'tableCell', children: []}, token);
    }

    // Overwrite the default code text data handler to unescape escaped pipes when
    // they are in tables.
    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitCodeText(token) {
      let value = this.resume();

      if (this.getData('inTable')) {
        value = value.replace(/\\([\\|])/g, replace);
      }

      const node = /** @type {InlineCode} */ (this.stack[this.stack.length - 1]);
      node.value = value;
      this.exit(token);
    }

    /**
     * @param {string} $0
     * @param {string} $1
     * @returns {string}
     */
    function replace($0, $1) {
      // Pipes work, backslashes don’t (but can’t escape pipes).
      return $1 === '|' ? $1 : $0
    }

    /**
     * Create an extension for `mdast-util-to-markdown` to enable GFM tables in
     * markdown.
     *
     * @param {Options | null | undefined} [options]
     *   Configuration.
     * @returns {ToMarkdownExtension}
     *   Extension for `mdast-util-to-markdown` to enable GFM tables.
     */
    function gfmTableToMarkdown(options) {
      const settings = options || {};
      const padding = settings.tableCellPadding;
      const alignDelimiters = settings.tablePipeAlign;
      const stringLength = settings.stringLength;
      const around = padding ? ' ' : '|';

      return {
        unsafe: [
          {character: '\r', inConstruct: 'tableCell'},
          {character: '\n', inConstruct: 'tableCell'},
          // A pipe, when followed by a tab or space (padding), or a dash or colon
          // (unpadded delimiter row), could result in a table.
          {atBreak: true, character: '|', after: '[\t :-]'},
          // A pipe in a cell must be encoded.
          {character: '|', inConstruct: 'tableCell'},
          // A colon must be followed by a dash, in which case it could start a
          // delimiter row.
          {atBreak: true, character: ':', after: '-'},
          // A delimiter row can also start with a dash, when followed by more
          // dashes, a colon, or a pipe.
          // This is a stricter version than the built in check for lists, thematic
          // breaks, and setex heading underlines though:
          // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
          {atBreak: true, character: '-', after: '[:|-]'}
        ],
        handlers: {
          table: handleTable,
          tableRow: handleTableRow,
          tableCell: handleTableCell,
          inlineCode: inlineCodeWithTable
        }
      }

      /**
       * @type {ToMarkdownHandle}
       * @param {Table} node
       */
      function handleTable(node, _, context, safeOptions) {
        return serializeData(
          handleTableAsData(node, context, safeOptions),
          node.align
        )
      }

      /**
       * This function isn’t really used normally, because we handle rows at the
       * table level.
       * But, if someone passes in a table row, this ensures we make somewhat sense.
       *
       * @type {ToMarkdownHandle}
       * @param {TableRow} node
       */
      function handleTableRow(node, _, context, safeOptions) {
        const row = handleTableRowAsData(node, context, safeOptions);
        const value = serializeData([row]);
        // `markdown-table` will always add an align row
        return value.slice(0, value.indexOf('\n'))
      }

      /**
       * @type {ToMarkdownHandle}
       * @param {TableCell} node
       */
      function handleTableCell(node, _, context, safeOptions) {
        const exit = context.enter('tableCell');
        const subexit = context.enter('phrasing');
        const value = containerPhrasing(node, context, {
          ...safeOptions,
          before: around,
          after: around
        });
        subexit();
        exit();
        return value
      }

      /**
       * @param {Array<Array<string>>} matrix
       * @param {Array<string | null | undefined> | null | undefined} [align]
       */
      function serializeData(matrix, align) {
        return markdownTable(matrix, {
          align,
          // @ts-expect-error: `markdown-table` types should support `null`.
          alignDelimiters,
          // @ts-expect-error: `markdown-table` types should support `null`.
          padding,
          // @ts-expect-error: `markdown-table` types should support `null`.
          stringLength
        })
      }

      /**
       * @param {Table} node
       * @param {ToMarkdownContext} context
       * @param {SafeOptions} safeOptions
       */
      function handleTableAsData(node, context, safeOptions) {
        const children = node.children;
        let index = -1;
        /** @type {Array<Array<string>>} */
        const result = [];
        const subexit = context.enter('table');

        while (++index < children.length) {
          result[index] = handleTableRowAsData(
            children[index],
            context,
            safeOptions
          );
        }

        subexit();

        return result
      }

      /**
       * @param {TableRow} node
       * @param {ToMarkdownContext} context
       * @param {SafeOptions} safeOptions
       */
      function handleTableRowAsData(node, context, safeOptions) {
        const children = node.children;
        let index = -1;
        /** @type {Array<string>} */
        const result = [];
        const subexit = context.enter('tableRow');

        while (++index < children.length) {
          // Note: the positional info as used here is incorrect.
          // Making it correct would be impossible due to aligning cells?
          // And it would need copy/pasting `markdown-table` into this project.
          result[index] = handleTableCell(
            children[index],
            node,
            context,
            safeOptions
          );
        }

        subexit();

        return result
      }

      /**
       * @type {ToMarkdownHandle}
       * @param {InlineCode} node
       */
      function inlineCodeWithTable(node, parent, context) {
        let value = inlineCode(node, parent, context);

        if (context.stack.includes('tableCell')) {
          value = value.replace(/\|/g, '\\$&');
        }

        return value
      }
    }

    /**
     * @typedef {import('../types.js').State} State
     * @typedef {import('../types.js').Options} Options
     */

    /**
     * @param {State} state
     * @returns {Exclude<Options['bullet'], null | undefined>}
     */
    function checkBullet(state) {
      const marker = state.options.bullet || '*';

      if (marker !== '*' && marker !== '+' && marker !== '-') {
        throw new Error(
          'Cannot serialize items with `' +
            marker +
            '` for `options.bullet`, expected `*`, `+`, or `-`'
        )
      }

      return marker
    }

    /**
     * @typedef {import('../types.js').State} State
     * @typedef {import('../types.js').Options} Options
     */

    /**
     * @param {State} state
     * @returns {Exclude<Options['listItemIndent'], null | undefined>}
     */
    function checkListItemIndent(state) {
      const style = state.options.listItemIndent || 'tab';

      // To do: remove in a major.
      // @ts-expect-error: deprecated.
      if (style === 1 || style === '1') {
        return 'one'
      }

      if (style !== 'tab' && style !== 'one' && style !== 'mixed') {
        throw new Error(
          'Cannot serialize items with `' +
            style +
            '` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`'
        )
      }

      return style
    }

    /**
     * @typedef {import('mdast').ListItem} ListItem
     * @typedef {import('../types.js').Map} Map
     * @typedef {import('../types.js').Parent} Parent
     * @typedef {import('../types.js').State} State
     * @typedef {import('../types.js').Info} Info
     */

    /**
     * @param {ListItem} node
     * @param {Parent | undefined} parent
     * @param {State} state
     * @param {Info} info
     * @returns {string}
     */
    function listItem(node, parent, state, info) {
      const listItemIndent = checkListItemIndent(state);
      let bullet = state.bulletCurrent || checkBullet(state);

      // Add the marker value for ordered lists.
      if (parent && parent.type === 'list' && parent.ordered) {
        bullet =
          (typeof parent.start === 'number' && parent.start > -1
            ? parent.start
            : 1) +
          (state.options.incrementListMarker === false
            ? 0
            : parent.children.indexOf(node)) +
          bullet;
      }

      let size = bullet.length + 1;

      if (
        listItemIndent === 'tab' ||
        (listItemIndent === 'mixed' &&
          ((parent && parent.type === 'list' && parent.spread) || node.spread))
      ) {
        size = Math.ceil(size / 4) * 4;
      }

      const tracker = state.createTracker(info);
      tracker.move(bullet + ' '.repeat(size - bullet.length));
      tracker.shift(size);
      const exit = state.enter('listItem');
      const value = state.indentLines(
        state.containerFlow(node, tracker.current()),
        map
      );
      exit();

      return value

      /** @type {Map} */
      function map(line, index, blank) {
        if (index) {
          return (blank ? '' : ' '.repeat(size)) + line
        }

        return (blank ? bullet : bullet + ' '.repeat(size - bullet.length)) + line
      }
    }

    /**
     * @typedef {import('mdast').Content} Content
     * @typedef {import('mdast').ListItem} ListItem
     * @typedef {import('mdast').Paragraph} Paragraph
     * @typedef {import('mdast').Parent} Parent
     * @typedef {import('mdast').Root} Root
     * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
     * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
     * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
     * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
     * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
     */

    // To do: next major: rename `context` -> `state`, `safeOptions` -> `info`, use
    // `track` from `state`.
    // To do: next major: replace exports with functions.
    // To do: next major: use `defaulthandlers.listItem`.

    /**
     * Extension for `mdast-util-from-markdown` to enable GFM task list items.
     *
     * @type {FromMarkdownExtension}
     */
    const gfmTaskListItemFromMarkdown = {
      exit: {
        taskListCheckValueChecked: exitCheck,
        taskListCheckValueUnchecked: exitCheck,
        paragraph: exitParagraphWithTaskListItem
      }
    };

    /**
     * Extension for `mdast-util-to-markdown` to enable GFM task list items.
     *
     * @type {ToMarkdownExtension}
     */
    const gfmTaskListItemToMarkdown = {
      unsafe: [{atBreak: true, character: '-', after: '[:|-]'}],
      handlers: {listItem: listItemWithTaskListItem}
    };

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitCheck(token) {
      const node = /** @type {ListItem} */ (this.stack[this.stack.length - 2]);
      // We’re always in a paragraph, in a list item.
      node.checked = token.type === 'taskListCheckValueChecked';
    }

    /**
     * @this {CompileContext}
     * @type {FromMarkdownHandle}
     */
    function exitParagraphWithTaskListItem(token) {
      const parent = /** @type {Parents} */ (this.stack[this.stack.length - 2]);

      if (
        parent &&
        parent.type === 'listItem' &&
        typeof parent.checked === 'boolean'
      ) {
        const node = /** @type {Paragraph} */ (this.stack[this.stack.length - 1]);
        const head = node.children[0];

        if (head && head.type === 'text') {
          const siblings = parent.children;
          let index = -1;
          /** @type {Paragraph | undefined} */
          let firstParaghraph;

          while (++index < siblings.length) {
            const sibling = siblings[index];
            if (sibling.type === 'paragraph') {
              firstParaghraph = sibling;
              break
            }
          }

          if (firstParaghraph === node) {
            // Must start with a space or a tab.
            head.value = head.value.slice(1);

            if (head.value.length === 0) {
              node.children.shift();
            } else if (
              node.position &&
              head.position &&
              typeof head.position.start.offset === 'number'
            ) {
              head.position.start.column++;
              head.position.start.offset++;
              node.position.start = Object.assign({}, head.position.start);
            }
          }
        }
      }

      this.exit(token);
    }

    /**
     * @type {ToMarkdownHandle}
     * @param {ListItem} node
     */
    function listItemWithTaskListItem(node, parent, context, safeOptions) {
      const head = node.children[0];
      const checkable =
        typeof node.checked === 'boolean' && head && head.type === 'paragraph';
      const checkbox = '[' + (node.checked ? 'x' : ' ') + '] ';
      const tracker = track(safeOptions);

      if (checkable) {
        tracker.move(checkbox);
      }

      let value = listItem(node, parent, context, {
        ...safeOptions,
        ...tracker.current()
      });

      if (checkable) {
        value = value.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, check);
      }

      return value

      /**
       * @param {string} $0
       * @returns {string}
       */
      function check($0) {
        return $0 + checkbox
      }
    }

    /**
     * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
     * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
     */

    /**
     * Create an extension for `mdast-util-from-markdown` to enable GFM (autolink
     * literals, footnotes, strikethrough, tables, tasklists).
     *
     * @returns {Array<FromMarkdownExtension>}
     *   Extension for `mdast-util-from-markdown` to enable GFM (autolink literals,
     *   footnotes, strikethrough, tables, tasklists).
     */
    function gfmFromMarkdown() {
      return [
        gfmAutolinkLiteralFromMarkdown,
        gfmFootnoteFromMarkdown(),
        gfmStrikethroughFromMarkdown,
        gfmTableFromMarkdown,
        gfmTaskListItemFromMarkdown
      ]
    }

    /**
     * Create an extension for `mdast-util-to-markdown` to enable GFM (autolink
     * literals, footnotes, strikethrough, tables, tasklists).
     *
     * @param {Options | null | undefined} [options]
     *   Configuration.
     * @returns {ToMarkdownExtension}
     *   Extension for `mdast-util-to-markdown` to enable GFM (autolink literals,
     *   footnotes, strikethrough, tables, tasklists).
     */
    function gfmToMarkdown(options) {
      return {
        extensions: [
          gfmAutolinkLiteralToMarkdown,
          gfmFootnoteToMarkdown(),
          gfmStrikethroughToMarkdown,
          gfmTableToMarkdown(options),
          gfmTaskListItemToMarkdown
        ]
      }
    }

    /**
     * @typedef {import('mdast').Root} Root
     * @typedef {import('micromark-extension-gfm').Options & import('mdast-util-gfm').Options} Options
     */

    /**
     * Plugin to support GFM (autolink literals, footnotes, strikethrough, tables, tasklists).
     *
     * @type {import('unified').Plugin<[Options?]|void[], Root>}
     */
    function remarkGfm(options = {}) {
      const data = this.data();

      add('micromarkExtensions', gfm(options));
      add('fromMarkdownExtensions', gfmFromMarkdown());
      add('toMarkdownExtensions', gfmToMarkdown(options));

      /**
       * @param {string} field
       * @param {unknown} value
       */
      function add(field, value) {
        const list = /** @type {unknown[]} */ (
          // Other extensions
          /* c8 ignore next 2 */
          data[field] ? data[field] : (data[field] = [])
        );

        list.push(value);
      }
    }

    const Markdown = (props) => {
        return (window.SP_REACT.createElement(deckyFrontendLib.Focusable, null,
            window.SP_REACT.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], components: {
                    div: (nodeProps) => (window.SP_REACT.createElement(deckyFrontendLib.Focusable, { ...nodeProps.node.properties }, nodeProps.children)),
                    a: (nodeProps) => {
                        const aRef = React.useRef(null);
                        return (
                        // TODO fix focus ring
                        window.SP_REACT.createElement(deckyFrontendLib.Focusable, { onActivate: () => { }, onOKButton: () => {
                                props.onDismiss?.();
                                deckyFrontendLib.Navigation.NavigateToExternalWeb(aRef.current.href);
                            }, style: { display: "inline" } },
                            window.SP_REACT.createElement("a", { ref: aRef, ...nodeProps.node.properties }, nodeProps.children)));
                    },
                }, ...props }, props.children)));
    };

    function ChangeLogModal({ release, closeModal, }) {
        return (window.SP_REACT.createElement(deckyFrontendLib.Focusable, { onCancelButton: closeModal },
            window.SP_REACT.createElement(deckyFrontendLib.Focusable, { onActivate: () => { }, style: {
                    marginTop: "40px",
                    height: "calc( 100% - 40px )",
                    overflowY: "scroll",
                    display: "flex",
                    justifyContent: "center",
                    margin: "40px",
                } },
                window.SP_REACT.createElement("div", null,
                    window.SP_REACT.createElement("h1", null, release.name),
                    release.body ? (window.SP_REACT.createElement(Markdown, null, `${release.body}`)) : ("no patch notes for this version")))));
    }

    /**
     * Retrieves a list of available compatibility tools for all applications.
     * @returns A Promise that resolves to an array of CompatToolInfo objects.
     */
    async function GetGlobalCompatTools() {
        try {
            const response = await SteamClient.Settings.GetGlobalCompatTools();
            // Map the response to CompatToolInfo objects and return as an array
            return response.map((tool) => ({
                ...tool,
            }));
        }
        catch (error) {
            // If an error occurs during the API call, log the error and return an empty array
            console.error("Error:", error);
            return [];
        }
    }
    /**
     * Restarts the Steam client.
     */
    function RestartSteamClient() {
        SteamClient.User.StartRestart();
    }

    function FlavorTab({ appState, flavor, socket, }) {
        const handleInstall = (gitHubRelease) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const response = {
                    type: RequestType.Task,
                    task: {
                        type: TaskType.InstallCompatibilityTool,
                        install: {
                            flavor: flavor.flavor,
                            release: gitHubRelease,
                        },
                    },
                };
                socket.send(JSON.stringify(response));
            }
            else {
                error("WebSocket not alive...");
            }
        };
        const handleUninstall = (steamCompatibilityTool) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const response = {
                    type: RequestType.Task,
                    task: {
                        type: TaskType.UninstallCompatibilityTool,
                        uninstall: {
                            flavor: flavor.flavor,
                            steam_compatibility_tool: steamCompatibilityTool,
                        },
                    },
                };
                socket.send(JSON.stringify(response));
            }
            else {
                error("WebSocket not alive...");
            }
        };
        const handleViewUsedByGames = (steamCompatibilityTool) => {
            deckyFrontendLib.showModal(window.SP_REACT.createElement(deckyFrontendLib.ConfirmModal, { strTitle: "Steam Applications using " + steamCompatibilityTool.display_name, strDescription: steamCompatibilityTool.used_by_games.join(", "), strOKButtonText: "OK" }));
        };
        const handleCancel = (gitHubRelease) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const response = {
                    type: RequestType.Task,
                    task: {
                        type: TaskType.CancelCompatibilityToolInstall,
                        install: {
                            flavor: flavor.flavor,
                            release: gitHubRelease,
                        },
                    },
                };
                socket.send(JSON.stringify(response));
            }
            else {
                error("WebSocket not alive...");
            }
        };
        const handleUninstallModal = (steamCompatibilityTool) => deckyFrontendLib.showModal(window.SP_REACT.createElement(deckyFrontendLib.ConfirmModal, { strTitle: "Uninstallation of " + steamCompatibilityTool.display_name, strDescription: "Are you sure want to remove this compatibility tool? Used by " +
                steamCompatibilityTool.used_by_games.join(","), strOKButtonText: "Uninstall", strCancelButtonText: "Cancel", onOK: () => {
                handleUninstall(steamCompatibilityTool);
            } }));
        const handleViewChangeLog = (gitHubRelease) => deckyFrontendLib.showModal(window.SP_REACT.createElement(ChangeLogModal, { release: gitHubRelease }));
        return (window.SP_REACT.createElement(deckyFrontendLib.DialogBody, null,
            appState.installed_compatibility_tools.filter((t) => t.flavor == flavor.flavor).length != 0 && (window.SP_REACT.createElement(deckyFrontendLib.DialogControlsSection, null,
                window.SP_REACT.createElement(deckyFrontendLib.DialogControlsSectionHeader, null, "Installed"),
                window.SP_REACT.createElement("ul", { style: { listStyleType: "none" } }, appState.installed_compatibility_tools
                    .filter((t) => t.flavor == flavor.flavor)
                    .map((steamCompatibilityTool) => {
                    const isQueued = appState.in_progress !== null;
                    return (window.SP_REACT.createElement("li", { style: {
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingBottom: "10px",
                        } },
                        window.SP_REACT.createElement("span", null,
                            steamCompatibilityTool.display_name,
                            " ",
                            steamCompatibilityTool.requires_restart &&
                                "(Requires Restart)",
                            steamCompatibilityTool.used_by_games.length != 0 &&
                                "(Used By Games)"),
                        window.SP_REACT.createElement(deckyFrontendLib.Focusable, { style: {
                                marginLeft: "auto",
                                boxShadow: "none",
                                display: "flex",
                                justifyContent: "right",
                            } },
                            window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { style: {
                                    height: "40px",
                                    width: "40px",
                                    padding: "10px 12px",
                                    minWidth: "40px",
                                }, onClick: (e) => deckyFrontendLib.showContextMenu(window.SP_REACT.createElement(deckyFrontendLib.Menu, { label: "Runner Actions" },
                                    window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onClick: () => {
                                            handleUninstallModal(steamCompatibilityTool);
                                        } }, "Uninstall"),
                                    steamCompatibilityTool.used_by_games.length !=
                                        0 && (window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onSelected: () => { }, onClick: () => {
                                            handleViewUsedByGames(steamCompatibilityTool);
                                        } }, "View Used By Games")),
                                    steamCompatibilityTool.github_release !=
                                        null && (window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onClick: () => {
                                            if (steamCompatibilityTool.github_release !=
                                                null) {
                                                handleViewChangeLog(steamCompatibilityTool.github_release);
                                            }
                                        } }, "View Change Log")),
                                    steamCompatibilityTool.requires_restart && (window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { disabled: isQueued, onClick: () => {
                                            RestartSteamClient();
                                        } }, "Restart Steam"))), e.currentTarget ?? window) },
                                window.SP_REACT.createElement(FaEllipsisH, null)))));
                })))),
            flavor.releases.length != 0 && (window.SP_REACT.createElement(deckyFrontendLib.DialogControlsSection, null,
                window.SP_REACT.createElement(deckyFrontendLib.DialogControlsSectionHeader, null, "Not Installed"),
                window.SP_REACT.createElement("ul", null, flavor.releases.map((release) => {
                    const isQueued = appState.task_queue
                        .filter((task) => task.type == TaskType.InstallCompatibilityTool)
                        .map((task) => task.install)
                        .filter((install) => install != null && install.release.url == release.url).length == 1;
                    const isInProgress = appState.in_progress !== null;
                    const isItemInProgress = isInProgress && appState.in_progress?.name === release.tag_name;
                    return (window.SP_REACT.createElement("li", { style: {
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingBottom: "10px",
                        } },
                        window.SP_REACT.createElement("span", null,
                            release.tag_name,
                            isQueued && " (In Queue)"),
                        isItemInProgress && (window.SP_REACT.createElement("div", { style: {
                                marginLeft: "auto",
                                paddingLeft: "10px",
                                minWidth: "200px",
                            } },
                            window.SP_REACT.createElement(deckyFrontendLib.ProgressBarWithInfo, { nProgress: appState.in_progress?.progress, indeterminate: appState.in_progress?.state ==
                                    QueueCompatibilityToolState.Extracting, sOperationText: appState.in_progress?.state, bottomSeparator: "none" }))),
                        window.SP_REACT.createElement(deckyFrontendLib.Focusable, { style: {
                                marginLeft: "auto",
                                boxShadow: "none",
                                display: "flex",
                                justifyContent: "right",
                            } },
                            window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { style: {
                                    height: "40px",
                                    width: "40px",
                                    padding: "10px 12px",
                                    minWidth: "40px",
                                }, onClick: (e) => deckyFrontendLib.showContextMenu(window.SP_REACT.createElement(deckyFrontendLib.Menu, { label: "Runner Actions" },
                                    window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { disabled: isItemInProgress || isQueued, onSelected: () => { }, onClick: () => {
                                            handleInstall(release);
                                        } }, "Install"),
                                    (isItemInProgress || isQueued) && (window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onClick: () => {
                                            handleCancel(release);
                                        } }, "Cancel from Installation")),
                                    window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onClick: () => {
                                            handleViewChangeLog(release);
                                        } }, "View Change Log")), e.currentTarget ?? window) },
                                window.SP_REACT.createElement(FaEllipsisH, null)))));
                }))))));
    }

    function ManagerTab({ appState, socket, }) {
        const handleUninstall = (release) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const response = {
                    type: RequestType.Task,
                    task: {
                        type: TaskType.UninstallCompatibilityTool,
                        uninstall: {
                            flavor: CompatibilityToolFlavor.Unknown,
                            steam_compatibility_tool: release,
                        },
                    },
                };
                socket.send(JSON.stringify(response));
            }
            else {
                error("WebSocket not alive...");
            }
        };
        const handleViewUsedByGames = (release) => {
            deckyFrontendLib.showModal(window.SP_REACT.createElement(deckyFrontendLib.ConfirmModal, { strTitle: "Steam Applications using " + release.display_name, strDescription: release.used_by_games.join(", "), strOKButtonText: "OK" }));
        };
        const handleViewChangeLog = (release) => deckyFrontendLib.showModal(window.SP_REACT.createElement(ChangeLogModal, { release: release }));
        const handleUninstallModal = (release) => deckyFrontendLib.showModal(window.SP_REACT.createElement(deckyFrontendLib.ConfirmModal, { strTitle: "Uninstallation of " + release.display_name, strDescription: "Are you sure want to remove this compatibility tool?", strOKButtonText: "Uninstall", strCancelButtonText: "Cancel", onOK: () => {
                handleUninstall(release);
            } }));
        return (window.SP_REACT.createElement(deckyFrontendLib.DialogBody, null,
            window.SP_REACT.createElement(deckyFrontendLib.DialogControlsSection, null,
                window.SP_REACT.createElement(deckyFrontendLib.DialogControlsSectionHeader, null, "Installed"),
                window.SP_REACT.createElement("ul", null, appState.installed_compatibility_tools.map((steamCompatibilityTool) => {
                    return (window.SP_REACT.createElement("li", { style: {
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingBottom: "10px",
                        } },
                        window.SP_REACT.createElement("span", null,
                            steamCompatibilityTool.display_name,
                            steamCompatibilityTool.requires_restart &&
                                " (Requires Restart)",
                            steamCompatibilityTool.used_by_games.length != 0 &&
                                " (Used By Games)"),
                        window.SP_REACT.createElement(deckyFrontendLib.Focusable, { style: {
                                marginLeft: "auto",
                                boxShadow: "none",
                                display: "flex",
                                justifyContent: "right",
                            } },
                            window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { style: {
                                    height: "40px",
                                    width: "40px",
                                    padding: "10px 12px",
                                    minWidth: "40px",
                                }, onClick: (e) => deckyFrontendLib.showContextMenu(window.SP_REACT.createElement(deckyFrontendLib.Menu, { label: "Runner Actions" },
                                    window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onSelected: () => { }, onClick: () => {
                                            handleUninstallModal(steamCompatibilityTool);
                                        } }, "Uninstall"),
                                    steamCompatibilityTool.used_by_games.length !=
                                        0 && (window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onSelected: () => { }, onClick: () => {
                                            handleViewUsedByGames(steamCompatibilityTool);
                                        } }, "View Used By Games")),
                                    steamCompatibilityTool.github_release != null && (window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { onClick: () => {
                                            if (steamCompatibilityTool.github_release !=
                                                null) {
                                                handleViewChangeLog(steamCompatibilityTool.github_release);
                                            }
                                        } }, "View Change Log")),
                                    steamCompatibilityTool.requires_restart && (window.SP_REACT.createElement(deckyFrontendLib.MenuItem, { disabled: !steamCompatibilityTool.requires_restart, onClick: () => {
                                            RestartSteamClient();
                                        } }, "Restart Steam"))), e.currentTarget ?? window) },
                                window.SP_REACT.createElement(FaEllipsisH, null)))));
                })))));
    }

    // THIS FILE IS AUTO GENERATED
    function SiDiscord (props) {
      return GenIcon({"tag":"svg","attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"title","attr":{},"child":[]},{"tag":"path","attr":{"d":"M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"}}]})(props);
    }function SiGithub (props) {
      return GenIcon({"tag":"svg","attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"title","attr":{},"child":[]},{"tag":"path","attr":{"d":"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"}}]})(props);
    }function SiKofi (props) {
      return GenIcon({"tag":"svg","attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"title","attr":{},"child":[]},{"tag":"path","attr":{"d":"M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"}}]})(props);
    }

    // THIS FILE IS AUTO GENERATED
    function HiOutlineQrCode (props) {
      return GenIcon({"tag":"svg","attr":{"fill":"none","viewBox":"0 0 24 24","strokeWidth":"1.5","stroke":"currentColor","aria-hidden":"true"},"child":[{"tag":"path","attr":{"strokeLinecap":"round","strokeLinejoin":"round","d":"M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"}},{"tag":"path","attr":{"strokeLinecap":"round","strokeLinejoin":"round","d":"M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"}}]})(props);
    }

    var lib = {};

    var mode$1 = {
    	MODE_NUMBER :		1 << 0,
    	MODE_ALPHA_NUM : 	1 << 1,
    	MODE_8BIT_BYTE : 	1 << 2,
    	MODE_KANJI :		1 << 3
    };

    var mode = mode$1;

    function QR8bitByte(data) {
    	this.mode = mode.MODE_8BIT_BYTE;
    	this.data = data;
    }

    QR8bitByte.prototype = {

    	getLength : function(buffer) {
    		return this.data.length;
    	},
    	
    	write : function(buffer) {
    		for (var i = 0; i < this.data.length; i++) {
    			// not JIS ...
    			buffer.put(this.data.charCodeAt(i), 8);
    		}
    	}
    };

    var _8BitByte = QR8bitByte;

    var ErrorCorrectLevel = {
    	L : 1,
    	M : 0,
    	Q : 3,
    	H : 2
    };

    // ErrorCorrectLevel
    var ECL = ErrorCorrectLevel;

    function QRRSBlock(totalCount, dataCount) {
    	this.totalCount = totalCount;
    	this.dataCount  = dataCount;
    }

    QRRSBlock.RS_BLOCK_TABLE = [

    	// L
    	// M
    	// Q
    	// H

    	// 1
    	[1, 26, 19],
    	[1, 26, 16],
    	[1, 26, 13],
    	[1, 26, 9],
    	
    	// 2
    	[1, 44, 34],
    	[1, 44, 28],
    	[1, 44, 22],
    	[1, 44, 16],

    	// 3
    	[1, 70, 55],
    	[1, 70, 44],
    	[2, 35, 17],
    	[2, 35, 13],

    	// 4		
    	[1, 100, 80],
    	[2, 50, 32],
    	[2, 50, 24],
    	[4, 25, 9],
    	
    	// 5
    	[1, 134, 108],
    	[2, 67, 43],
    	[2, 33, 15, 2, 34, 16],
    	[2, 33, 11, 2, 34, 12],
    	
    	// 6
    	[2, 86, 68],
    	[4, 43, 27],
    	[4, 43, 19],
    	[4, 43, 15],
    	
    	// 7		
    	[2, 98, 78],
    	[4, 49, 31],
    	[2, 32, 14, 4, 33, 15],
    	[4, 39, 13, 1, 40, 14],
    	
    	// 8
    	[2, 121, 97],
    	[2, 60, 38, 2, 61, 39],
    	[4, 40, 18, 2, 41, 19],
    	[4, 40, 14, 2, 41, 15],
    	
    	// 9
    	[2, 146, 116],
    	[3, 58, 36, 2, 59, 37],
    	[4, 36, 16, 4, 37, 17],
    	[4, 36, 12, 4, 37, 13],
    	
    	// 10		
    	[2, 86, 68, 2, 87, 69],
    	[4, 69, 43, 1, 70, 44],
    	[6, 43, 19, 2, 44, 20],
    	[6, 43, 15, 2, 44, 16],

    	// 11
    	[4, 101, 81],
    	[1, 80, 50, 4, 81, 51],
    	[4, 50, 22, 4, 51, 23],
    	[3, 36, 12, 8, 37, 13],

    	// 12
    	[2, 116, 92, 2, 117, 93],
    	[6, 58, 36, 2, 59, 37],
    	[4, 46, 20, 6, 47, 21],
    	[7, 42, 14, 4, 43, 15],

    	// 13
    	[4, 133, 107],
    	[8, 59, 37, 1, 60, 38],
    	[8, 44, 20, 4, 45, 21],
    	[12, 33, 11, 4, 34, 12],

    	// 14
    	[3, 145, 115, 1, 146, 116],
    	[4, 64, 40, 5, 65, 41],
    	[11, 36, 16, 5, 37, 17],
    	[11, 36, 12, 5, 37, 13],

    	// 15
    	[5, 109, 87, 1, 110, 88],
    	[5, 65, 41, 5, 66, 42],
    	[5, 54, 24, 7, 55, 25],
    	[11, 36, 12],

    	// 16
    	[5, 122, 98, 1, 123, 99],
    	[7, 73, 45, 3, 74, 46],
    	[15, 43, 19, 2, 44, 20],
    	[3, 45, 15, 13, 46, 16],

    	// 17
    	[1, 135, 107, 5, 136, 108],
    	[10, 74, 46, 1, 75, 47],
    	[1, 50, 22, 15, 51, 23],
    	[2, 42, 14, 17, 43, 15],

    	// 18
    	[5, 150, 120, 1, 151, 121],
    	[9, 69, 43, 4, 70, 44],
    	[17, 50, 22, 1, 51, 23],
    	[2, 42, 14, 19, 43, 15],

    	// 19
    	[3, 141, 113, 4, 142, 114],
    	[3, 70, 44, 11, 71, 45],
    	[17, 47, 21, 4, 48, 22],
    	[9, 39, 13, 16, 40, 14],

    	// 20
    	[3, 135, 107, 5, 136, 108],
    	[3, 67, 41, 13, 68, 42],
    	[15, 54, 24, 5, 55, 25],
    	[15, 43, 15, 10, 44, 16],

    	// 21
    	[4, 144, 116, 4, 145, 117],
    	[17, 68, 42],
    	[17, 50, 22, 6, 51, 23],
    	[19, 46, 16, 6, 47, 17],

    	// 22
    	[2, 139, 111, 7, 140, 112],
    	[17, 74, 46],
    	[7, 54, 24, 16, 55, 25],
    	[34, 37, 13],

    	// 23
    	[4, 151, 121, 5, 152, 122],
    	[4, 75, 47, 14, 76, 48],
    	[11, 54, 24, 14, 55, 25],
    	[16, 45, 15, 14, 46, 16],

    	// 24
    	[6, 147, 117, 4, 148, 118],
    	[6, 73, 45, 14, 74, 46],
    	[11, 54, 24, 16, 55, 25],
    	[30, 46, 16, 2, 47, 17],

    	// 25
    	[8, 132, 106, 4, 133, 107],
    	[8, 75, 47, 13, 76, 48],
    	[7, 54, 24, 22, 55, 25],
    	[22, 45, 15, 13, 46, 16],

    	// 26
    	[10, 142, 114, 2, 143, 115],
    	[19, 74, 46, 4, 75, 47],
    	[28, 50, 22, 6, 51, 23],
    	[33, 46, 16, 4, 47, 17],

    	// 27
    	[8, 152, 122, 4, 153, 123],
    	[22, 73, 45, 3, 74, 46],
    	[8, 53, 23, 26, 54, 24],
    	[12, 45, 15, 28, 46, 16],

    	// 28
    	[3, 147, 117, 10, 148, 118],
    	[3, 73, 45, 23, 74, 46],
    	[4, 54, 24, 31, 55, 25],
    	[11, 45, 15, 31, 46, 16],

    	// 29
    	[7, 146, 116, 7, 147, 117],
    	[21, 73, 45, 7, 74, 46],
    	[1, 53, 23, 37, 54, 24],
    	[19, 45, 15, 26, 46, 16],

    	// 30
    	[5, 145, 115, 10, 146, 116],
    	[19, 75, 47, 10, 76, 48],
    	[15, 54, 24, 25, 55, 25],
    	[23, 45, 15, 25, 46, 16],

    	// 31
    	[13, 145, 115, 3, 146, 116],
    	[2, 74, 46, 29, 75, 47],
    	[42, 54, 24, 1, 55, 25],
    	[23, 45, 15, 28, 46, 16],

    	// 32
    	[17, 145, 115],
    	[10, 74, 46, 23, 75, 47],
    	[10, 54, 24, 35, 55, 25],
    	[19, 45, 15, 35, 46, 16],

    	// 33
    	[17, 145, 115, 1, 146, 116],
    	[14, 74, 46, 21, 75, 47],
    	[29, 54, 24, 19, 55, 25],
    	[11, 45, 15, 46, 46, 16],

    	// 34
    	[13, 145, 115, 6, 146, 116],
    	[14, 74, 46, 23, 75, 47],
    	[44, 54, 24, 7, 55, 25],
    	[59, 46, 16, 1, 47, 17],

    	// 35
    	[12, 151, 121, 7, 152, 122],
    	[12, 75, 47, 26, 76, 48],
    	[39, 54, 24, 14, 55, 25],
    	[22, 45, 15, 41, 46, 16],

    	// 36
    	[6, 151, 121, 14, 152, 122],
    	[6, 75, 47, 34, 76, 48],
    	[46, 54, 24, 10, 55, 25],
    	[2, 45, 15, 64, 46, 16],

    	// 37
    	[17, 152, 122, 4, 153, 123],
    	[29, 74, 46, 14, 75, 47],
    	[49, 54, 24, 10, 55, 25],
    	[24, 45, 15, 46, 46, 16],

    	// 38
    	[4, 152, 122, 18, 153, 123],
    	[13, 74, 46, 32, 75, 47],
    	[48, 54, 24, 14, 55, 25],
    	[42, 45, 15, 32, 46, 16],

    	// 39
    	[20, 147, 117, 4, 148, 118],
    	[40, 75, 47, 7, 76, 48],
    	[43, 54, 24, 22, 55, 25],
    	[10, 45, 15, 67, 46, 16],

    	// 40
    	[19, 148, 118, 6, 149, 119],
    	[18, 75, 47, 31, 76, 48],
    	[34, 54, 24, 34, 55, 25],
    	[20, 45, 15, 61, 46, 16]
    ];

    QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
    	
    	var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
    	
    	if (rsBlock == undefined) {
    		throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
    	}

    	var length = rsBlock.length / 3;
    	
    	var list = new Array();
    	
    	for (var i = 0; i < length; i++) {

    		var count = rsBlock[i * 3 + 0];
    		var totalCount = rsBlock[i * 3 + 1];
    		var dataCount  = rsBlock[i * 3 + 2];

    		for (var j = 0; j < count; j++) {
    			list.push(new QRRSBlock(totalCount, dataCount) );	
    		}
    	}
    	
    	return list;
    };

    QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {

    	switch(errorCorrectLevel) {
    	case ECL.L :
    		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
    	case ECL.M :
    		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
    	case ECL.Q :
    		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
    	case ECL.H :
    		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
    	default :
    		return undefined;
    	}
    };

    var RSBlock$1 = QRRSBlock;

    function QRBitBuffer() {
    	this.buffer = new Array();
    	this.length = 0;
    }

    QRBitBuffer.prototype = {

    	get : function(index) {
    		var bufIndex = Math.floor(index / 8);
    		return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    	},
    	
    	put : function(num, length) {
    		for (var i = 0; i < length; i++) {
    			this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
    		}
    	},
    	
    	getLengthInBits : function() {
    		return this.length;
    	},
    	
    	putBit : function(bit) {
    	
    		var bufIndex = Math.floor(this.length / 8);
    		if (this.buffer.length <= bufIndex) {
    			this.buffer.push(0);
    		}
    	
    		if (bit) {
    			this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
    		}
    	
    		this.length++;
    	}
    };

    var BitBuffer$1 = QRBitBuffer;

    var QRMath = {

    	glog : function(n) {
    	
    		if (n < 1) {
    			throw new Error("glog(" + n + ")");
    		}
    		
    		return QRMath.LOG_TABLE[n];
    	},
    	
    	gexp : function(n) {
    	
    		while (n < 0) {
    			n += 255;
    		}
    	
    		while (n >= 256) {
    			n -= 255;
    		}
    	
    		return QRMath.EXP_TABLE[n];
    	},
    	
    	EXP_TABLE : new Array(256),
    	
    	LOG_TABLE : new Array(256)

    };
    	
    for (var i = 0; i < 8; i++) {
    	QRMath.EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i++) {
    	QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4]
    		^ QRMath.EXP_TABLE[i - 5]
    		^ QRMath.EXP_TABLE[i - 6]
    		^ QRMath.EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i++) {
    	QRMath.LOG_TABLE[QRMath.EXP_TABLE[i] ] = i;
    }

    var math$2 = QRMath;

    var math$1 = math$2;

    function QRPolynomial(num, shift) {

    	if (num.length == undefined) {
    		throw new Error(num.length + "/" + shift);
    	}

    	var offset = 0;

    	while (offset < num.length && num[offset] == 0) {
    		offset++;
    	}

    	this.num = new Array(num.length - offset + shift);
    	for (var i = 0; i < num.length - offset; i++) {
    		this.num[i] = num[i + offset];
    	}
    }

    QRPolynomial.prototype = {

    	get : function(index) {
    		return this.num[index];
    	},
    	
    	getLength : function() {
    		return this.num.length;
    	},
    	
    	multiply : function(e) {
    	
    		var num = new Array(this.getLength() + e.getLength() - 1);
    	
    		for (var i = 0; i < this.getLength(); i++) {
    			for (var j = 0; j < e.getLength(); j++) {
    				num[i + j] ^= math$1.gexp(math$1.glog(this.get(i) ) + math$1.glog(e.get(j) ) );
    			}
    		}
    	
    		return new QRPolynomial(num, 0);
    	},
    	
    	mod : function(e) {
    	
    		if (this.getLength() - e.getLength() < 0) {
    			return this;
    		}
    	
    		var ratio = math$1.glog(this.get(0) ) - math$1.glog(e.get(0) );
    	
    		var num = new Array(this.getLength() );
    		
    		for (var i = 0; i < this.getLength(); i++) {
    			num[i] = this.get(i);
    		}
    		
    		for (var i = 0; i < e.getLength(); i++) {
    			num[i] ^= math$1.gexp(math$1.glog(e.get(i) ) + ratio);
    		}
    	
    		// recursive call
    		return new QRPolynomial(num, 0).mod(e);
    	}
    };

    var Polynomial$2 = QRPolynomial;

    var Mode = mode$1;
    var Polynomial$1 = Polynomial$2;
    var math = math$2;

    var QRMaskPattern = {
    	PATTERN000 : 0,
    	PATTERN001 : 1,
    	PATTERN010 : 2,
    	PATTERN011 : 3,
    	PATTERN100 : 4,
    	PATTERN101 : 5,
    	PATTERN110 : 6,
    	PATTERN111 : 7
    };

    var QRUtil = {

        PATTERN_POSITION_TABLE : [
    	    [],
    	    [6, 18],
    	    [6, 22],
    	    [6, 26],
    	    [6, 30],
    	    [6, 34],
    	    [6, 22, 38],
    	    [6, 24, 42],
    	    [6, 26, 46],
    	    [6, 28, 50],
    	    [6, 30, 54],		
    	    [6, 32, 58],
    	    [6, 34, 62],
    	    [6, 26, 46, 66],
    	    [6, 26, 48, 70],
    	    [6, 26, 50, 74],
    	    [6, 30, 54, 78],
    	    [6, 30, 56, 82],
    	    [6, 30, 58, 86],
    	    [6, 34, 62, 90],
    	    [6, 28, 50, 72, 94],
    	    [6, 26, 50, 74, 98],
    	    [6, 30, 54, 78, 102],
    	    [6, 28, 54, 80, 106],
    	    [6, 32, 58, 84, 110],
    	    [6, 30, 58, 86, 114],
    	    [6, 34, 62, 90, 118],
    	    [6, 26, 50, 74, 98, 122],
    	    [6, 30, 54, 78, 102, 126],
    	    [6, 26, 52, 78, 104, 130],
    	    [6, 30, 56, 82, 108, 134],
    	    [6, 34, 60, 86, 112, 138],
    	    [6, 30, 58, 86, 114, 142],
    	    [6, 34, 62, 90, 118, 146],
    	    [6, 30, 54, 78, 102, 126, 150],
    	    [6, 24, 50, 76, 102, 128, 154],
    	    [6, 28, 54, 80, 106, 132, 158],
    	    [6, 32, 58, 84, 110, 136, 162],
    	    [6, 26, 54, 82, 110, 138, 166],
    	    [6, 30, 58, 86, 114, 142, 170]
        ],

        G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
        G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
        G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)	| (1 << 4) | (1 << 1),

        getBCHTypeInfo : function(data) {
    	    var d = data << 10;
    	    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
    		    d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) ) ); 	
    	    }
    	    return ( (data << 10) | d) ^ QRUtil.G15_MASK;
        },

        getBCHTypeNumber : function(data) {
    	    var d = data << 12;
    	    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
    		    d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) ) ); 	
    	    }
    	    return (data << 12) | d;
        },

        getBCHDigit : function(data) {

    	    var digit = 0;

    	    while (data != 0) {
    		    digit++;
    		    data >>>= 1;
    	    }

    	    return digit;
        },

        getPatternPosition : function(typeNumber) {
    	    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
        },

        getMask : function(maskPattern, i, j) {
    	    
    	    switch (maskPattern) {
    		    
    	    case QRMaskPattern.PATTERN000 : return (i + j) % 2 == 0;
    	    case QRMaskPattern.PATTERN001 : return i % 2 == 0;
    	    case QRMaskPattern.PATTERN010 : return j % 3 == 0;
    	    case QRMaskPattern.PATTERN011 : return (i + j) % 3 == 0;
    	    case QRMaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0;
    	    case QRMaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 == 0;
    	    case QRMaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 == 0;
    	    case QRMaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 == 0;

    	    default :
    		    throw new Error("bad maskPattern:" + maskPattern);
    	    }
        },

        getErrorCorrectPolynomial : function(errorCorrectLength) {

    	    var a = new Polynomial$1([1], 0);

    	    for (var i = 0; i < errorCorrectLength; i++) {
    		    a = a.multiply(new Polynomial$1([1, math.gexp(i)], 0) );
    	    }

    	    return a;
        },

        getLengthInBits : function(mode, type) {

    	    if (1 <= type && type < 10) {

    		    // 1 - 9

    		    switch(mode) {
    		    case Mode.MODE_NUMBER 	: return 10;
    		    case Mode.MODE_ALPHA_NUM 	: return 9;
    		    case Mode.MODE_8BIT_BYTE	: return 8;
    		    case Mode.MODE_KANJI  	: return 8;
    		    default :
    			    throw new Error("mode:" + mode);
    		    }

    	    } else if (type < 27) {

    		    // 10 - 26

    		    switch(mode) {
    		    case Mode.MODE_NUMBER 	: return 12;
    		    case Mode.MODE_ALPHA_NUM 	: return 11;
    		    case Mode.MODE_8BIT_BYTE	: return 16;
    		    case Mode.MODE_KANJI  	: return 10;
    		    default :
    			    throw new Error("mode:" + mode);
    		    }

    	    } else if (type < 41) {

    		    // 27 - 40

    		    switch(mode) {
    		    case Mode.MODE_NUMBER 	: return 14;
    		    case Mode.MODE_ALPHA_NUM	: return 13;
    		    case Mode.MODE_8BIT_BYTE	: return 16;
    		    case Mode.MODE_KANJI  	: return 12;
    		    default :
    			    throw new Error("mode:" + mode);
    		    }

    	    } else {
    		    throw new Error("type:" + type);
    	    }
        },

        getLostPoint : function(qrCode) {
    	    
    	    var moduleCount = qrCode.getModuleCount();
    	    
    	    var lostPoint = 0;
    	    
    	    // LEVEL1
    	    
    	    for (var row = 0; row < moduleCount; row++) {

    		    for (var col = 0; col < moduleCount; col++) {

    			    var sameCount = 0;
    			    var dark = qrCode.isDark(row, col);

    				for (var r = -1; r <= 1; r++) {

    				    if (row + r < 0 || moduleCount <= row + r) {
    					    continue;
    				    }

    				    for (var c = -1; c <= 1; c++) {

    					    if (col + c < 0 || moduleCount <= col + c) {
    						    continue;
    					    }

    					    if (r == 0 && c == 0) {
    						    continue;
    					    }

    					    if (dark == qrCode.isDark(row + r, col + c) ) {
    						    sameCount++;
    					    }
    				    }
    			    }

    			    if (sameCount > 5) {
    				    lostPoint += (3 + sameCount - 5);
    			    }
    		    }
    	    }

    	    // LEVEL2

    	    for (var row = 0; row < moduleCount - 1; row++) {
    		    for (var col = 0; col < moduleCount - 1; col++) {
    			    var count = 0;
    			    if (qrCode.isDark(row,     col    ) ) count++;
    			    if (qrCode.isDark(row + 1, col    ) ) count++;
    			    if (qrCode.isDark(row,     col + 1) ) count++;
    			    if (qrCode.isDark(row + 1, col + 1) ) count++;
    			    if (count == 0 || count == 4) {
    				    lostPoint += 3;
    			    }
    		    }
    	    }

    	    // LEVEL3

    	    for (var row = 0; row < moduleCount; row++) {
    		    for (var col = 0; col < moduleCount - 6; col++) {
    			    if (qrCode.isDark(row, col)
    					    && !qrCode.isDark(row, col + 1)
    					    &&  qrCode.isDark(row, col + 2)
    					    &&  qrCode.isDark(row, col + 3)
    					    &&  qrCode.isDark(row, col + 4)
    					    && !qrCode.isDark(row, col + 5)
    					    &&  qrCode.isDark(row, col + 6) ) {
    				    lostPoint += 40;
    			    }
    		    }
    	    }

    	    for (var col = 0; col < moduleCount; col++) {
    		    for (var row = 0; row < moduleCount - 6; row++) {
    			    if (qrCode.isDark(row, col)
    					    && !qrCode.isDark(row + 1, col)
    					    &&  qrCode.isDark(row + 2, col)
    					    &&  qrCode.isDark(row + 3, col)
    					    &&  qrCode.isDark(row + 4, col)
    					    && !qrCode.isDark(row + 5, col)
    					    &&  qrCode.isDark(row + 6, col) ) {
    				    lostPoint += 40;
    			    }
    		    }
    	    }

    	    // LEVEL4
    	    
    	    var darkCount = 0;

    	    for (var col = 0; col < moduleCount; col++) {
    		    for (var row = 0; row < moduleCount; row++) {
    			    if (qrCode.isDark(row, col) ) {
    				    darkCount++;
    			    }
    		    }
    	    }
    	    
    	    var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    	    lostPoint += ratio * 10;

    	    return lostPoint;		
        }
    };

    var util$1 = QRUtil;

    var BitByte = _8BitByte;
    var RSBlock = RSBlock$1;
    var BitBuffer = BitBuffer$1;
    var util = util$1;
    var Polynomial = Polynomial$2;

    function QRCode$1(typeNumber, errorCorrectLevel) {
    	this.typeNumber = typeNumber;
    	this.errorCorrectLevel = errorCorrectLevel;
    	this.modules = null;
    	this.moduleCount = 0;
    	this.dataCache = null;
    	this.dataList = [];
    }

    // for client side minification
    var proto = QRCode$1.prototype;

    proto.addData = function(data) {
    	var newData = new BitByte(data);
    	this.dataList.push(newData);
    	this.dataCache = null;
    };

    proto.isDark = function(row, col) {
    	if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
    		throw new Error(row + "," + col);
    	}
    	return this.modules[row][col];
    };

    proto.getModuleCount = function() {
    	return this.moduleCount;
    };

    proto.make = function() {
    	// Calculate automatically typeNumber if provided is < 1
    	if (this.typeNumber < 1 ){
    		var typeNumber = 1;
    		for (typeNumber = 1; typeNumber < 40; typeNumber++) {
    			var rsBlocks = RSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);

    			var buffer = new BitBuffer();
    			var totalDataCount = 0;
    			for (var i = 0; i < rsBlocks.length; i++) {
    				totalDataCount += rsBlocks[i].dataCount;
    			}

    			for (var i = 0; i < this.dataList.length; i++) {
    				var data = this.dataList[i];
    				buffer.put(data.mode, 4);
    				buffer.put(data.getLength(), util.getLengthInBits(data.mode, typeNumber) );
    				data.write(buffer);
    			}
    			if (buffer.getLengthInBits() <= totalDataCount * 8)
    				break;
    		}
    		this.typeNumber = typeNumber;
    	}
    	this.makeImpl(false, this.getBestMaskPattern() );
    };

    proto.makeImpl = function(test, maskPattern) {
    	
    	this.moduleCount = this.typeNumber * 4 + 17;
    	this.modules = new Array(this.moduleCount);
    	
    	for (var row = 0; row < this.moduleCount; row++) {
    		
    		this.modules[row] = new Array(this.moduleCount);
    		
    		for (var col = 0; col < this.moduleCount; col++) {
    			this.modules[row][col] = null;//(col + row) % 3;
    		}
    	}

    	this.setupPositionProbePattern(0, 0);
    	this.setupPositionProbePattern(this.moduleCount - 7, 0);
    	this.setupPositionProbePattern(0, this.moduleCount - 7);
    	this.setupPositionAdjustPattern();
    	this.setupTimingPattern();
    	this.setupTypeInfo(test, maskPattern);
    	
    	if (this.typeNumber >= 7) {
    		this.setupTypeNumber(test);
    	}

    	if (this.dataCache == null) {
    		this.dataCache = QRCode$1.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
    	}

    	this.mapData(this.dataCache, maskPattern);
    };

    proto.setupPositionProbePattern = function(row, col)  {
    	
    	for (var r = -1; r <= 7; r++) {
    		
    		if (row + r <= -1 || this.moduleCount <= row + r) continue;
    		
    		for (var c = -1; c <= 7; c++) {
    			
    			if (col + c <= -1 || this.moduleCount <= col + c) continue;
    			
    			if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
    					|| (0 <= c && c <= 6 && (r == 0 || r == 6) )
    					|| (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
    				this.modules[row + r][col + c] = true;
    			} else {
    				this.modules[row + r][col + c] = false;
    			}
    		}		
    	}		
    };

    proto.getBestMaskPattern = function() {

    	var minLostPoint = 0;
    	var pattern = 0;

    	for (var i = 0; i < 8; i++) {
    		
    		this.makeImpl(true, i);

    		var lostPoint = util.getLostPoint(this);

    		if (i == 0 || minLostPoint >  lostPoint) {
    			minLostPoint = lostPoint;
    			pattern = i;
    		}
    	}

    	return pattern;
    };

    proto.createMovieClip = function(target_mc, instance_name, depth) {

    	var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
    	var cs = 1;

    	this.make();

    	for (var row = 0; row < this.modules.length; row++) {
    		
    		var y = row * cs;
    		
    		for (var col = 0; col < this.modules[row].length; col++) {

    			var x = col * cs;
    			var dark = this.modules[row][col];
    		
    			if (dark) {
    				qr_mc.beginFill(0, 100);
    				qr_mc.moveTo(x, y);
    				qr_mc.lineTo(x + cs, y);
    				qr_mc.lineTo(x + cs, y + cs);
    				qr_mc.lineTo(x, y + cs);
    				qr_mc.endFill();
    			}
    		}
    	}
    	
    	return qr_mc;
    };

    proto.setupTimingPattern = function() {
    	
    	for (var r = 8; r < this.moduleCount - 8; r++) {
    		if (this.modules[r][6] != null) {
    			continue;
    		}
    		this.modules[r][6] = (r % 2 == 0);
    	}

    	for (var c = 8; c < this.moduleCount - 8; c++) {
    		if (this.modules[6][c] != null) {
    			continue;
    		}
    		this.modules[6][c] = (c % 2 == 0);
    	}
    };

    proto.setupPositionAdjustPattern = function() {

    	var pos = util.getPatternPosition(this.typeNumber);
    	
    	for (var i = 0; i < pos.length; i++) {
    	
    		for (var j = 0; j < pos.length; j++) {
    		
    			var row = pos[i];
    			var col = pos[j];
    			
    			if (this.modules[row][col] != null) {
    				continue;
    			}
    			
    			for (var r = -2; r <= 2; r++) {
    			
    				for (var c = -2; c <= 2; c++) {
    				
    					if (r == -2 || r == 2 || c == -2 || c == 2
    							|| (r == 0 && c == 0) ) {
    						this.modules[row + r][col + c] = true;
    					} else {
    						this.modules[row + r][col + c] = false;
    					}
    				}
    			}
    		}
    	}
    };

    proto.setupTypeNumber = function(test) {

    	var bits = util.getBCHTypeNumber(this.typeNumber);

    	for (var i = 0; i < 18; i++) {
    		var mod = (!test && ( (bits >> i) & 1) == 1);
    		this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
    	}

    	for (var i = 0; i < 18; i++) {
    		var mod = (!test && ( (bits >> i) & 1) == 1);
    		this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    	}
    };

    proto.setupTypeInfo = function(test, maskPattern) {

    	var data = (this.errorCorrectLevel << 3) | maskPattern;
    	var bits = util.getBCHTypeInfo(data);

    	// vertical		
    	for (var i = 0; i < 15; i++) {

    		var mod = (!test && ( (bits >> i) & 1) == 1);

    		if (i < 6) {
    			this.modules[i][8] = mod;
    		} else if (i < 8) {
    			this.modules[i + 1][8] = mod;
    		} else {
    			this.modules[this.moduleCount - 15 + i][8] = mod;
    		}
    	}

    	// horizontal
    	for (var i = 0; i < 15; i++) {

    		var mod = (!test && ( (bits >> i) & 1) == 1);
    		
    		if (i < 8) {
    			this.modules[8][this.moduleCount - i - 1] = mod;
    		} else if (i < 9) {
    			this.modules[8][15 - i - 1 + 1] = mod;
    		} else {
    			this.modules[8][15 - i - 1] = mod;
    		}
    	}

    	// fixed module
    	this.modules[this.moduleCount - 8][8] = (!test);
    };

    proto.mapData = function(data, maskPattern) {
    	
    	var inc = -1;
    	var row = this.moduleCount - 1;
    	var bitIndex = 7;
    	var byteIndex = 0;
    	
    	for (var col = this.moduleCount - 1; col > 0; col -= 2) {

    		if (col == 6) col--;

    		while (true) {

    			for (var c = 0; c < 2; c++) {
    				
    				if (this.modules[row][col - c] == null) {
    					
    					var dark = false;

    					if (byteIndex < data.length) {
    						dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
    					}

    					var mask = util.getMask(maskPattern, row, col - c);

    					if (mask) {
    						dark = !dark;
    					}
    					
    					this.modules[row][col - c] = dark;
    					bitIndex--;

    					if (bitIndex == -1) {
    						byteIndex++;
    						bitIndex = 7;
    					}
    				}
    			}
    							
    			row += inc;

    			if (row < 0 || this.moduleCount <= row) {
    				row -= inc;
    				inc = -inc;
    				break;
    			}
    		}
    	}
    };

    QRCode$1.PAD0 = 0xEC;
    QRCode$1.PAD1 = 0x11;

    QRCode$1.createData = function(typeNumber, errorCorrectLevel, dataList) {
    	
    	var rsBlocks = RSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
    	
    	var buffer = new BitBuffer();
    	
    	for (var i = 0; i < dataList.length; i++) {
    		var data = dataList[i];
    		buffer.put(data.mode, 4);
    		buffer.put(data.getLength(), util.getLengthInBits(data.mode, typeNumber) );
    		data.write(buffer);
    	}

    	// calc num max data.
    	var totalDataCount = 0;
    	for (var i = 0; i < rsBlocks.length; i++) {
    		totalDataCount += rsBlocks[i].dataCount;
    	}

    	if (buffer.getLengthInBits() > totalDataCount * 8) {
    		throw new Error("code length overflow. ("
    			+ buffer.getLengthInBits()
    			+ ">"
    			+  totalDataCount * 8
    			+ ")");
    	}

    	// end code
    	if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
    		buffer.put(0, 4);
    	}

    	// padding
    	while (buffer.getLengthInBits() % 8 != 0) {
    		buffer.putBit(false);
    	}

    	// padding
    	while (true) {
    		
    		if (buffer.getLengthInBits() >= totalDataCount * 8) {
    			break;
    		}
    		buffer.put(QRCode$1.PAD0, 8);
    		
    		if (buffer.getLengthInBits() >= totalDataCount * 8) {
    			break;
    		}
    		buffer.put(QRCode$1.PAD1, 8);
    	}

    	return QRCode$1.createBytes(buffer, rsBlocks);
    };

    QRCode$1.createBytes = function(buffer, rsBlocks) {

    	var offset = 0;
    	
    	var maxDcCount = 0;
    	var maxEcCount = 0;
    	
    	var dcdata = new Array(rsBlocks.length);
    	var ecdata = new Array(rsBlocks.length);
    	
    	for (var r = 0; r < rsBlocks.length; r++) {

    		var dcCount = rsBlocks[r].dataCount;
    		var ecCount = rsBlocks[r].totalCount - dcCount;

    		maxDcCount = Math.max(maxDcCount, dcCount);
    		maxEcCount = Math.max(maxEcCount, ecCount);
    		
    		dcdata[r] = new Array(dcCount);
    		
    		for (var i = 0; i < dcdata[r].length; i++) {
    			dcdata[r][i] = 0xff & buffer.buffer[i + offset];
    		}
    		offset += dcCount;
    		
    		var rsPoly = util.getErrorCorrectPolynomial(ecCount);
    		var rawPoly = new Polynomial(dcdata[r], rsPoly.getLength() - 1);

    		var modPoly = rawPoly.mod(rsPoly);
    		ecdata[r] = new Array(rsPoly.getLength() - 1);
    		for (var i = 0; i < ecdata[r].length; i++) {
                var modIndex = i + modPoly.getLength() - ecdata[r].length;
    			ecdata[r][i] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
    		}

    	}
    	
    	var totalCodeCount = 0;
    	for (var i = 0; i < rsBlocks.length; i++) {
    		totalCodeCount += rsBlocks[i].totalCount;
    	}

    	var data = new Array(totalCodeCount);
    	var index = 0;

    	for (var i = 0; i < maxDcCount; i++) {
    		for (var r = 0; r < rsBlocks.length; r++) {
    			if (i < dcdata[r].length) {
    				data[index++] = dcdata[r][i];
    			}
    		}
    	}

    	for (var i = 0; i < maxEcCount; i++) {
    		for (var r = 0; r < rsBlocks.length; r++) {
    			if (i < ecdata[r].length) {
    				data[index++] = ecdata[r][i];
    			}
    		}
    	}

    	return data;
    };

    var QRCode_1 = QRCode$1;

    var QRCodeSvg$1 = {};

    Object.defineProperty(QRCodeSvg$1, "__esModule", {
      value: true
    });

    var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _propTypes$1 = propTypes$2.exports;

    var _propTypes2$1 = _interopRequireDefault$1(_propTypes$1);

    var _react$1 = React__default["default"];

    var _react2$1 = _interopRequireDefault$1(_react$1);

    function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _objectWithoutProperties$1(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

    var propTypes$1 = {
      bgColor: _propTypes2$1.default.oneOfType([_propTypes2$1.default.object, _propTypes2$1.default.string]).isRequired,
      bgD: _propTypes2$1.default.string.isRequired,
      fgColor: _propTypes2$1.default.oneOfType([_propTypes2$1.default.object, _propTypes2$1.default.string]).isRequired,
      fgD: _propTypes2$1.default.string.isRequired,
      size: _propTypes2$1.default.number.isRequired,
      title: _propTypes2$1.default.string,
      viewBoxSize: _propTypes2$1.default.number.isRequired,
      xmlns: _propTypes2$1.default.string
    };

    var defaultProps$1 = {
      title: undefined,
      xmlns: "http://www.w3.org/2000/svg"
    };

    var QRCodeSvg = (0, _react$1.forwardRef)(function (_ref, ref) {
      var bgColor = _ref.bgColor,
          bgD = _ref.bgD,
          fgD = _ref.fgD,
          fgColor = _ref.fgColor,
          size = _ref.size,
          title = _ref.title,
          viewBoxSize = _ref.viewBoxSize,
          props = _objectWithoutProperties$1(_ref, ["bgColor", "bgD", "fgD", "fgColor", "size", "title", "viewBoxSize"]);

      return _react2$1.default.createElement(
        "svg",
        _extends$1({}, props, { height: size, ref: ref, viewBox: "0 0 " + viewBoxSize + " " + viewBoxSize, width: size }),
        title ? _react2$1.default.createElement(
          "title",
          null,
          title
        ) : null,
        _react2$1.default.createElement("path", { d: bgD, fill: bgColor }),
        _react2$1.default.createElement("path", { d: fgD, fill: fgColor })
      );
    });

    QRCodeSvg.displayName = "QRCodeSvg";
    QRCodeSvg.propTypes = propTypes$1;
    QRCodeSvg.defaultProps = defaultProps$1;

    QRCodeSvg$1.default = QRCodeSvg;

    Object.defineProperty(lib, "__esModule", {
      value: true
    });
    lib.QRCode = undefined;

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _QRCode = QRCode_1;

    var _QRCode2 = _interopRequireDefault(_QRCode);

    var _ErrorCorrectLevel = ErrorCorrectLevel;

    var _ErrorCorrectLevel2 = _interopRequireDefault(_ErrorCorrectLevel);

    var _propTypes = propTypes$2.exports;

    var _propTypes2 = _interopRequireDefault(_propTypes);

    var _react = React__default["default"];

    var _react2 = _interopRequireDefault(_react);

    var _QRCodeSvg = QRCodeSvg$1;

    var _QRCodeSvg2 = _interopRequireDefault(_QRCodeSvg);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } // A `qr.js` doesn't handle error level of zero (M) so we need to do it right, thus the deep require.


    var propTypes = {
      bgColor: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]),
      fgColor: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]),
      level: _propTypes2.default.string,
      size: _propTypes2.default.number,
      value: _propTypes2.default.string.isRequired
    };

    var defaultProps = {
      bgColor: "#FFFFFF",
      fgColor: "#000000",
      level: "L",
      size: 256
    };

    var QRCode = (0, _react.forwardRef)(function (_ref, ref) {
      var bgColor = _ref.bgColor,
          fgColor = _ref.fgColor,
          level = _ref.level,
          size = _ref.size,
          value = _ref.value,
          props = _objectWithoutProperties(_ref, ["bgColor", "fgColor", "level", "size", "value"]);

      // Use type === -1 to automatically pick the best type.
      var qrcode = new _QRCode2.default(-1, _ErrorCorrectLevel2.default[level]);
      qrcode.addData(value);
      qrcode.make();
      var cells = qrcode.modules;
      return _react2.default.createElement(_QRCodeSvg2.default, _extends({}, props, {
        bgColor: bgColor,
        bgD: cells.map(function (row, rowIndex) {
          return row.map(function (cell, cellIndex) {
            return !cell ? "M " + cellIndex + " " + rowIndex + " l 1 0 0 1 -1 0 Z" : "";
          }).join(" ");
        }).join(" "),
        fgColor: fgColor,
        fgD: cells.map(function (row, rowIndex) {
          return row.map(function (cell, cellIndex) {
            return cell ? "M " + cellIndex + " " + rowIndex + " l 1 0 0 1 -1 0 Z" : "";
          }).join(" ");
        }).join(" "),
        ref: ref,
        size: size,
        viewBoxSize: cells.length
      }));
    });

    lib.QRCode = QRCode;
    QRCode.displayName = "QRCode";
    QRCode.propTypes = propTypes;
    QRCode.defaultProps = defaultProps;

    var _default = lib.default = QRCode;

    const showQrModal = (url) => {
        deckyFrontendLib.showModal(window.SP_REACT.createElement(deckyFrontendLib.ModalRoot, null,
            window.SP_REACT.createElement("div", { style: {
                    margin: "0 auto 1.5em auto",
                    padding: "1em",
                    borderRadius: "2em",
                    background: "#F5F5F5",
                    boxShadow: "0 1em 2em rgba(0, 0, 0, 0.5)", // Dark gray shadow color
                } },
                window.SP_REACT.createElement(_default, { value: url, size: 256, fgColor: "#000000", bgColor: "#F5F5F5" })),
            window.SP_REACT.createElement("span", { style: { textAlign: "center", wordBreak: "break-word" } }, url)), window);
    };

    function _typeof(o) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
        return typeof o;
      } : function (o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
      }, _typeof(o);
    }

    function toInteger(dirtyNumber) {
      if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
        return NaN;
      }
      var number = Number(dirtyNumber);
      if (isNaN(number)) {
        return number;
      }
      return number < 0 ? Math.ceil(number) : Math.floor(number);
    }

    function requiredArgs(required, args) {
      if (args.length < required) {
        throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
      }
    }

    /**
     * @name toDate
     * @category Common Helpers
     * @summary Convert the given argument to an instance of Date.
     *
     * @description
     * Convert the given argument to an instance of Date.
     *
     * If the argument is an instance of Date, the function returns its clone.
     *
     * If the argument is a number, it is treated as a timestamp.
     *
     * If the argument is none of the above, the function returns Invalid Date.
     *
     * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
     *
     * @param {Date|Number} argument - the value to convert
     * @returns {Date} the parsed date in the local time zone
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // Clone the date:
     * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
     * //=> Tue Feb 11 2014 11:30:30
     *
     * @example
     * // Convert the timestamp to date:
     * const result = toDate(1392098430000)
     * //=> Tue Feb 11 2014 11:30:30
     */
    function toDate(argument) {
      requiredArgs(1, arguments);
      var argStr = Object.prototype.toString.call(argument);

      // Clone the date
      if (argument instanceof Date || _typeof(argument) === 'object' && argStr === '[object Date]') {
        // Prevent the date to lose the milliseconds when passed to new Date() in IE10
        return new Date(argument.getTime());
      } else if (typeof argument === 'number' || argStr === '[object Number]') {
        return new Date(argument);
      } else {
        if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
          // eslint-disable-next-line no-console
          console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
          // eslint-disable-next-line no-console
          console.warn(new Error().stack);
        }
        return new Date(NaN);
      }
    }

    var defaultOptions = {};
    function getDefaultOptions() {
      return defaultOptions;
    }

    /**
     * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
     * They usually appear for dates that denote time before the timezones were introduced
     * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
     * and GMT+01:00:00 after that date)
     *
     * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
     * which would lead to incorrect calculations.
     *
     * This function returns the timezone offset in milliseconds that takes seconds in account.
     */
    function getTimezoneOffsetInMilliseconds(date) {
      var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
      utcDate.setUTCFullYear(date.getFullYear());
      return date.getTime() - utcDate.getTime();
    }

    /**
     * @name compareAsc
     * @category Common Helpers
     * @summary Compare the two dates and return -1, 0 or 1.
     *
     * @description
     * Compare the two dates and return 1 if the first date is after the second,
     * -1 if the first date is before the second or 0 if dates are equal.
     *
     * @param {Date|Number} dateLeft - the first date to compare
     * @param {Date|Number} dateRight - the second date to compare
     * @returns {Number} the result of the comparison
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Compare 11 February 1987 and 10 July 1989:
     * const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
     * //=> -1
     *
     * @example
     * // Sort the array of dates:
     * const result = [
     *   new Date(1995, 6, 2),
     *   new Date(1987, 1, 11),
     *   new Date(1989, 6, 10)
     * ].sort(compareAsc)
     * //=> [
     * //   Wed Feb 11 1987 00:00:00,
     * //   Mon Jul 10 1989 00:00:00,
     * //   Sun Jul 02 1995 00:00:00
     * // ]
     */
    function compareAsc(dirtyDateLeft, dirtyDateRight) {
      requiredArgs(2, arguments);
      var dateLeft = toDate(dirtyDateLeft);
      var dateRight = toDate(dirtyDateRight);
      var diff = dateLeft.getTime() - dateRight.getTime();
      if (diff < 0) {
        return -1;
      } else if (diff > 0) {
        return 1;
        // Return 0 if diff is 0; return NaN if diff is NaN
      } else {
        return diff;
      }
    }

    /**
     * @name differenceInCalendarMonths
     * @category Month Helpers
     * @summary Get the number of calendar months between the given dates.
     *
     * @description
     * Get the number of calendar months between the given dates.
     *
     * @param {Date|Number} dateLeft - the later date
     * @param {Date|Number} dateRight - the earlier date
     * @returns {Number} the number of calendar months
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // How many calendar months are between 31 January 2014 and 1 September 2014?
     * const result = differenceInCalendarMonths(
     *   new Date(2014, 8, 1),
     *   new Date(2014, 0, 31)
     * )
     * //=> 8
     */
    function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
      requiredArgs(2, arguments);
      var dateLeft = toDate(dirtyDateLeft);
      var dateRight = toDate(dirtyDateRight);
      var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
      var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
      return yearDiff * 12 + monthDiff;
    }

    /**
     * @name differenceInMilliseconds
     * @category Millisecond Helpers
     * @summary Get the number of milliseconds between the given dates.
     *
     * @description
     * Get the number of milliseconds between the given dates.
     *
     * @param {Date|Number} dateLeft - the later date
     * @param {Date|Number} dateRight - the earlier date
     * @returns {Number} the number of milliseconds
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // How many milliseconds are between
     * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
     * const result = differenceInMilliseconds(
     *   new Date(2014, 6, 2, 12, 30, 21, 700),
     *   new Date(2014, 6, 2, 12, 30, 20, 600)
     * )
     * //=> 1100
     */
    function differenceInMilliseconds(dateLeft, dateRight) {
      requiredArgs(2, arguments);
      return toDate(dateLeft).getTime() - toDate(dateRight).getTime();
    }

    var roundingMap = {
      ceil: Math.ceil,
      round: Math.round,
      floor: Math.floor,
      trunc: function trunc(value) {
        return value < 0 ? Math.ceil(value) : Math.floor(value);
      } // Math.trunc is not supported by IE
    };

    var defaultRoundingMethod = 'trunc';
    function getRoundingMethod(method) {
      return method ? roundingMap[method] : roundingMap[defaultRoundingMethod];
    }

    /**
     * @name endOfDay
     * @category Day Helpers
     * @summary Return the end of a day for the given date.
     *
     * @description
     * Return the end of a day for the given date.
     * The result will be in the local timezone.
     *
     * @param {Date|Number} date - the original date
     * @returns {Date} the end of a day
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // The end of a day for 2 September 2014 11:55:00:
     * const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
     * //=> Tue Sep 02 2014 23:59:59.999
     */
    function endOfDay(dirtyDate) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate);
      date.setHours(23, 59, 59, 999);
      return date;
    }

    /**
     * @name endOfMonth
     * @category Month Helpers
     * @summary Return the end of a month for the given date.
     *
     * @description
     * Return the end of a month for the given date.
     * The result will be in the local timezone.
     *
     * @param {Date|Number} date - the original date
     * @returns {Date} the end of a month
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // The end of a month for 2 September 2014 11:55:00:
     * const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
     * //=> Tue Sep 30 2014 23:59:59.999
     */
    function endOfMonth(dirtyDate) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate);
      var month = date.getMonth();
      date.setFullYear(date.getFullYear(), month + 1, 0);
      date.setHours(23, 59, 59, 999);
      return date;
    }

    /**
     * @name isLastDayOfMonth
     * @category Month Helpers
     * @summary Is the given date the last day of a month?
     *
     * @description
     * Is the given date the last day of a month?
     *
     * @param {Date|Number} date - the date to check
     * @returns {Boolean} the date is the last day of a month
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // Is 28 February 2014 the last day of a month?
     * const result = isLastDayOfMonth(new Date(2014, 1, 28))
     * //=> true
     */
    function isLastDayOfMonth(dirtyDate) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate);
      return endOfDay(date).getTime() === endOfMonth(date).getTime();
    }

    /**
     * @name differenceInMonths
     * @category Month Helpers
     * @summary Get the number of full months between the given dates.
     *
     * @description
     * Get the number of full months between the given dates using trunc as a default rounding method.
     *
     * @param {Date|Number} dateLeft - the later date
     * @param {Date|Number} dateRight - the earlier date
     * @returns {Number} the number of full months
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // How many full months are between 31 January 2014 and 1 September 2014?
     * const result = differenceInMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))
     * //=> 7
     */
    function differenceInMonths(dirtyDateLeft, dirtyDateRight) {
      requiredArgs(2, arguments);
      var dateLeft = toDate(dirtyDateLeft);
      var dateRight = toDate(dirtyDateRight);
      var sign = compareAsc(dateLeft, dateRight);
      var difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight));
      var result;

      // Check for the difference of less than month
      if (difference < 1) {
        result = 0;
      } else {
        if (dateLeft.getMonth() === 1 && dateLeft.getDate() > 27) {
          // This will check if the date is end of Feb and assign a higher end of month date
          // to compare it with Jan
          dateLeft.setDate(30);
        }
        dateLeft.setMonth(dateLeft.getMonth() - sign * difference);

        // Math.abs(diff in full months - diff in calendar months) === 1 if last calendar month is not full
        // If so, result must be decreased by 1 in absolute value
        var isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign;

        // Check for cases of one full calendar month
        if (isLastDayOfMonth(toDate(dirtyDateLeft)) && difference === 1 && compareAsc(dirtyDateLeft, dateRight) === 1) {
          isLastMonthNotFull = false;
        }
        result = sign * (difference - Number(isLastMonthNotFull));
      }

      // Prevent negative zero
      return result === 0 ? 0 : result;
    }

    /**
     * @name differenceInSeconds
     * @category Second Helpers
     * @summary Get the number of seconds between the given dates.
     *
     * @description
     * Get the number of seconds between the given dates.
     *
     * @param {Date|Number} dateLeft - the later date
     * @param {Date|Number} dateRight - the earlier date
     * @param {Object} [options] - an object with options.
     * @param {String} [options.roundingMethod='trunc'] - a rounding method (`ceil`, `floor`, `round` or `trunc`)
     * @returns {Number} the number of seconds
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // How many seconds are between
     * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
     * const result = differenceInSeconds(
     *   new Date(2014, 6, 2, 12, 30, 20, 0),
     *   new Date(2014, 6, 2, 12, 30, 7, 999)
     * )
     * //=> 12
     */
    function differenceInSeconds(dateLeft, dateRight, options) {
      requiredArgs(2, arguments);
      var diff = differenceInMilliseconds(dateLeft, dateRight) / 1000;
      return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
    }

    var formatDistanceLocale = {
      lessThanXSeconds: {
        one: 'less than a second',
        other: 'less than {{count}} seconds'
      },
      xSeconds: {
        one: '1 second',
        other: '{{count}} seconds'
      },
      halfAMinute: 'half a minute',
      lessThanXMinutes: {
        one: 'less than a minute',
        other: 'less than {{count}} minutes'
      },
      xMinutes: {
        one: '1 minute',
        other: '{{count}} minutes'
      },
      aboutXHours: {
        one: 'about 1 hour',
        other: 'about {{count}} hours'
      },
      xHours: {
        one: '1 hour',
        other: '{{count}} hours'
      },
      xDays: {
        one: '1 day',
        other: '{{count}} days'
      },
      aboutXWeeks: {
        one: 'about 1 week',
        other: 'about {{count}} weeks'
      },
      xWeeks: {
        one: '1 week',
        other: '{{count}} weeks'
      },
      aboutXMonths: {
        one: 'about 1 month',
        other: 'about {{count}} months'
      },
      xMonths: {
        one: '1 month',
        other: '{{count}} months'
      },
      aboutXYears: {
        one: 'about 1 year',
        other: 'about {{count}} years'
      },
      xYears: {
        one: '1 year',
        other: '{{count}} years'
      },
      overXYears: {
        one: 'over 1 year',
        other: 'over {{count}} years'
      },
      almostXYears: {
        one: 'almost 1 year',
        other: 'almost {{count}} years'
      }
    };
    var formatDistance$1 = function formatDistance(token, count, options) {
      var result;
      var tokenValue = formatDistanceLocale[token];
      if (typeof tokenValue === 'string') {
        result = tokenValue;
      } else if (count === 1) {
        result = tokenValue.one;
      } else {
        result = tokenValue.other.replace('{{count}}', count.toString());
      }
      if (options !== null && options !== void 0 && options.addSuffix) {
        if (options.comparison && options.comparison > 0) {
          return 'in ' + result;
        } else {
          return result + ' ago';
        }
      }
      return result;
    };
    var formatDistance$2 = formatDistance$1;

    function buildFormatLongFn(args) {
      return function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        // TODO: Remove String()
        var width = options.width ? String(options.width) : args.defaultWidth;
        var format = args.formats[width] || args.formats[args.defaultWidth];
        return format;
      };
    }

    var dateFormats = {
      full: 'EEEE, MMMM do, y',
      long: 'MMMM do, y',
      medium: 'MMM d, y',
      short: 'MM/dd/yyyy'
    };
    var timeFormats = {
      full: 'h:mm:ss a zzzz',
      long: 'h:mm:ss a z',
      medium: 'h:mm:ss a',
      short: 'h:mm a'
    };
    var dateTimeFormats = {
      full: "{{date}} 'at' {{time}}",
      long: "{{date}} 'at' {{time}}",
      medium: '{{date}}, {{time}}',
      short: '{{date}}, {{time}}'
    };
    var formatLong = {
      date: buildFormatLongFn({
        formats: dateFormats,
        defaultWidth: 'full'
      }),
      time: buildFormatLongFn({
        formats: timeFormats,
        defaultWidth: 'full'
      }),
      dateTime: buildFormatLongFn({
        formats: dateTimeFormats,
        defaultWidth: 'full'
      })
    };
    var formatLong$1 = formatLong;

    var formatRelativeLocale = {
      lastWeek: "'last' eeee 'at' p",
      yesterday: "'yesterday at' p",
      today: "'today at' p",
      tomorrow: "'tomorrow at' p",
      nextWeek: "eeee 'at' p",
      other: 'P'
    };
    var formatRelative = function formatRelative(token, _date, _baseDate, _options) {
      return formatRelativeLocale[token];
    };
    var formatRelative$1 = formatRelative;

    function buildLocalizeFn(args) {
      return function (dirtyIndex, options) {
        var context = options !== null && options !== void 0 && options.context ? String(options.context) : 'standalone';
        var valuesArray;
        if (context === 'formatting' && args.formattingValues) {
          var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
          var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
          valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
        } else {
          var _defaultWidth = args.defaultWidth;
          var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
          valuesArray = args.values[_width] || args.values[_defaultWidth];
        }
        var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
        // @ts-ignore: For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
        return valuesArray[index];
      };
    }

    var eraValues = {
      narrow: ['B', 'A'],
      abbreviated: ['BC', 'AD'],
      wide: ['Before Christ', 'Anno Domini']
    };
    var quarterValues = {
      narrow: ['1', '2', '3', '4'],
      abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
      wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter']
    };

    // Note: in English, the names of days of the week and months are capitalized.
    // If you are making a new locale based on this one, check if the same is true for the language you're working on.
    // Generally, formatted dates should look like they are in the middle of a sentence,
    // e.g. in Spanish language the weekdays and months should be in the lowercase.
    var monthValues = {
      narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
    var dayValues = {
      narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
    var dayPeriodValues = {
      narrow: {
        am: 'a',
        pm: 'p',
        midnight: 'mi',
        noon: 'n',
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night'
      },
      abbreviated: {
        am: 'AM',
        pm: 'PM',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night'
      },
      wide: {
        am: 'a.m.',
        pm: 'p.m.',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night'
      }
    };
    var formattingDayPeriodValues = {
      narrow: {
        am: 'a',
        pm: 'p',
        midnight: 'mi',
        noon: 'n',
        morning: 'in the morning',
        afternoon: 'in the afternoon',
        evening: 'in the evening',
        night: 'at night'
      },
      abbreviated: {
        am: 'AM',
        pm: 'PM',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'in the morning',
        afternoon: 'in the afternoon',
        evening: 'in the evening',
        night: 'at night'
      },
      wide: {
        am: 'a.m.',
        pm: 'p.m.',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'in the morning',
        afternoon: 'in the afternoon',
        evening: 'in the evening',
        night: 'at night'
      }
    };
    var ordinalNumber = function ordinalNumber(dirtyNumber, _options) {
      var number = Number(dirtyNumber);

      // If ordinal numbers depend on context, for example,
      // if they are different for different grammatical genders,
      // use `options.unit`.
      //
      // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
      // 'day', 'hour', 'minute', 'second'.

      var rem100 = number % 100;
      if (rem100 > 20 || rem100 < 10) {
        switch (rem100 % 10) {
          case 1:
            return number + 'st';
          case 2:
            return number + 'nd';
          case 3:
            return number + 'rd';
        }
      }
      return number + 'th';
    };
    var localize = {
      ordinalNumber: ordinalNumber,
      era: buildLocalizeFn({
        values: eraValues,
        defaultWidth: 'wide'
      }),
      quarter: buildLocalizeFn({
        values: quarterValues,
        defaultWidth: 'wide',
        argumentCallback: function argumentCallback(quarter) {
          return quarter - 1;
        }
      }),
      month: buildLocalizeFn({
        values: monthValues,
        defaultWidth: 'wide'
      }),
      day: buildLocalizeFn({
        values: dayValues,
        defaultWidth: 'wide'
      }),
      dayPeriod: buildLocalizeFn({
        values: dayPeriodValues,
        defaultWidth: 'wide',
        formattingValues: formattingDayPeriodValues,
        defaultFormattingWidth: 'wide'
      })
    };
    var localize$1 = localize;

    function buildMatchFn(args) {
      return function (string) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var width = options.width;
        var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
        var matchResult = string.match(matchPattern);
        if (!matchResult) {
          return null;
        }
        var matchedString = matchResult[0];
        var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
        var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function (pattern) {
          return pattern.test(matchedString);
        }) : findKey(parsePatterns, function (pattern) {
          return pattern.test(matchedString);
        });
        var value;
        value = args.valueCallback ? args.valueCallback(key) : key;
        value = options.valueCallback ? options.valueCallback(value) : value;
        var rest = string.slice(matchedString.length);
        return {
          value: value,
          rest: rest
        };
      };
    }
    function findKey(object, predicate) {
      for (var key in object) {
        if (object.hasOwnProperty(key) && predicate(object[key])) {
          return key;
        }
      }
      return undefined;
    }
    function findIndex(array, predicate) {
      for (var key = 0; key < array.length; key++) {
        if (predicate(array[key])) {
          return key;
        }
      }
      return undefined;
    }

    function buildMatchPatternFn(args) {
      return function (string) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var matchResult = string.match(args.matchPattern);
        if (!matchResult) return null;
        var matchedString = matchResult[0];
        var parseResult = string.match(args.parsePattern);
        if (!parseResult) return null;
        var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
        value = options.valueCallback ? options.valueCallback(value) : value;
        var rest = string.slice(matchedString.length);
        return {
          value: value,
          rest: rest
        };
      };
    }

    var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
    var parseOrdinalNumberPattern = /\d+/i;
    var matchEraPatterns = {
      narrow: /^(b|a)/i,
      abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
      wide: /^(before christ|before common era|anno domini|common era)/i
    };
    var parseEraPatterns = {
      any: [/^b/i, /^(a|c)/i]
    };
    var matchQuarterPatterns = {
      narrow: /^[1234]/i,
      abbreviated: /^q[1234]/i,
      wide: /^[1234](th|st|nd|rd)? quarter/i
    };
    var parseQuarterPatterns = {
      any: [/1/i, /2/i, /3/i, /4/i]
    };
    var matchMonthPatterns = {
      narrow: /^[jfmasond]/i,
      abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
      wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
    };
    var parseMonthPatterns = {
      narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
      any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
    };
    var matchDayPatterns = {
      narrow: /^[smtwf]/i,
      short: /^(su|mo|tu|we|th|fr|sa)/i,
      abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
      wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
    };
    var parseDayPatterns = {
      narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
      any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
    };
    var matchDayPeriodPatterns = {
      narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
      any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
    };
    var parseDayPeriodPatterns = {
      any: {
        am: /^a/i,
        pm: /^p/i,
        midnight: /^mi/i,
        noon: /^no/i,
        morning: /morning/i,
        afternoon: /afternoon/i,
        evening: /evening/i,
        night: /night/i
      }
    };
    var match = {
      ordinalNumber: buildMatchPatternFn({
        matchPattern: matchOrdinalNumberPattern,
        parsePattern: parseOrdinalNumberPattern,
        valueCallback: function valueCallback(value) {
          return parseInt(value, 10);
        }
      }),
      era: buildMatchFn({
        matchPatterns: matchEraPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseEraPatterns,
        defaultParseWidth: 'any'
      }),
      quarter: buildMatchFn({
        matchPatterns: matchQuarterPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseQuarterPatterns,
        defaultParseWidth: 'any',
        valueCallback: function valueCallback(index) {
          return index + 1;
        }
      }),
      month: buildMatchFn({
        matchPatterns: matchMonthPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseMonthPatterns,
        defaultParseWidth: 'any'
      }),
      day: buildMatchFn({
        matchPatterns: matchDayPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseDayPatterns,
        defaultParseWidth: 'any'
      }),
      dayPeriod: buildMatchFn({
        matchPatterns: matchDayPeriodPatterns,
        defaultMatchWidth: 'any',
        parsePatterns: parseDayPeriodPatterns,
        defaultParseWidth: 'any'
      })
    };
    var match$1 = match;

    /**
     * @type {Locale}
     * @category Locales
     * @summary English locale (United States).
     * @language English
     * @iso-639-2 eng
     * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
     * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
     */
    var locale = {
      code: 'en-US',
      formatDistance: formatDistance$2,
      formatLong: formatLong$1,
      formatRelative: formatRelative$1,
      localize: localize$1,
      match: match$1,
      options: {
        weekStartsOn: 0 /* Sunday */,
        firstWeekContainsDate: 1
      }
    };
    var defaultLocale = locale;

    function assign(target, object) {
      if (target == null) {
        throw new TypeError('assign requires that input parameter not be null or undefined');
      }
      for (var property in object) {
        if (Object.prototype.hasOwnProperty.call(object, property)) {
          target[property] = object[property];
        }
      }
      return target;
    }

    function cloneObject(object) {
      return assign({}, object);
    }

    var MINUTES_IN_DAY = 1440;
    var MINUTES_IN_ALMOST_TWO_DAYS = 2520;
    var MINUTES_IN_MONTH = 43200;
    var MINUTES_IN_TWO_MONTHS = 86400;

    /**
     * @name formatDistance
     * @category Common Helpers
     * @summary Return the distance between the given dates in words.
     *
     * @description
     * Return the distance between the given dates in words.
     *
     * | Distance between dates                                            | Result              |
     * |-------------------------------------------------------------------|---------------------|
     * | 0 ... 30 secs                                                     | less than a minute  |
     * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
     * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
     * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
     * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
     * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
     * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
     * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
     * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
     * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
     * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
     * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
     * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
     * | N yrs ... N yrs 3 months                                          | about N years       |
     * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
     * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
     *
     * With `options.includeSeconds == true`:
     * | Distance between dates | Result               |
     * |------------------------|----------------------|
     * | 0 secs ... 5 secs      | less than 5 seconds  |
     * | 5 secs ... 10 secs     | less than 10 seconds |
     * | 10 secs ... 20 secs    | less than 20 seconds |
     * | 20 secs ... 40 secs    | half a minute        |
     * | 40 secs ... 60 secs    | less than a minute   |
     * | 60 secs ... 90 secs    | 1 minute             |
     *
     * @param {Date|Number} date - the date
     * @param {Date|Number} baseDate - the date to compare with
     * @param {Object} [options] - an object with options.
     * @param {Boolean} [options.includeSeconds=false] - distances less than a minute are more detailed
     * @param {Boolean} [options.addSuffix=false] - result indicates if the second date is earlier or later than the first
     * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
     * @returns {String} the distance in words
     * @throws {TypeError} 2 arguments required
     * @throws {RangeError} `date` must not be Invalid Date
     * @throws {RangeError} `baseDate` must not be Invalid Date
     * @throws {RangeError} `options.locale` must contain `formatDistance` property
     *
     * @example
     * // What is the distance between 2 July 2014 and 1 January 2015?
     * const result = formatDistance(new Date(2014, 6, 2), new Date(2015, 0, 1))
     * //=> '6 months'
     *
     * @example
     * // What is the distance between 1 January 2015 00:00:15
     * // and 1 January 2015 00:00:00, including seconds?
     * const result = formatDistance(
     *   new Date(2015, 0, 1, 0, 0, 15),
     *   new Date(2015, 0, 1, 0, 0, 0),
     *   { includeSeconds: true }
     * )
     * //=> 'less than 20 seconds'
     *
     * @example
     * // What is the distance from 1 January 2016
     * // to 1 January 2015, with a suffix?
     * const result = formatDistance(new Date(2015, 0, 1), new Date(2016, 0, 1), {
     *   addSuffix: true
     * })
     * //=> 'about 1 year ago'
     *
     * @example
     * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
     * import { eoLocale } from 'date-fns/locale/eo'
     * const result = formatDistance(new Date(2016, 7, 1), new Date(2015, 0, 1), {
     *   locale: eoLocale
     * })
     * //=> 'pli ol 1 jaro'
     */

    function formatDistance(dirtyDate, dirtyBaseDate, options) {
      var _ref, _options$locale;
      requiredArgs(2, arguments);
      var defaultOptions = getDefaultOptions();
      var locale = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions.locale) !== null && _ref !== void 0 ? _ref : defaultLocale;
      if (!locale.formatDistance) {
        throw new RangeError('locale must contain formatDistance property');
      }
      var comparison = compareAsc(dirtyDate, dirtyBaseDate);
      if (isNaN(comparison)) {
        throw new RangeError('Invalid time value');
      }
      var localizeOptions = assign(cloneObject(options), {
        addSuffix: Boolean(options === null || options === void 0 ? void 0 : options.addSuffix),
        comparison: comparison
      });
      var dateLeft;
      var dateRight;
      if (comparison > 0) {
        dateLeft = toDate(dirtyBaseDate);
        dateRight = toDate(dirtyDate);
      } else {
        dateLeft = toDate(dirtyDate);
        dateRight = toDate(dirtyBaseDate);
      }
      var seconds = differenceInSeconds(dateRight, dateLeft);
      var offsetInSeconds = (getTimezoneOffsetInMilliseconds(dateRight) - getTimezoneOffsetInMilliseconds(dateLeft)) / 1000;
      var minutes = Math.round((seconds - offsetInSeconds) / 60);
      var months;

      // 0 up to 2 mins
      if (minutes < 2) {
        if (options !== null && options !== void 0 && options.includeSeconds) {
          if (seconds < 5) {
            return locale.formatDistance('lessThanXSeconds', 5, localizeOptions);
          } else if (seconds < 10) {
            return locale.formatDistance('lessThanXSeconds', 10, localizeOptions);
          } else if (seconds < 20) {
            return locale.formatDistance('lessThanXSeconds', 20, localizeOptions);
          } else if (seconds < 40) {
            return locale.formatDistance('halfAMinute', 0, localizeOptions);
          } else if (seconds < 60) {
            return locale.formatDistance('lessThanXMinutes', 1, localizeOptions);
          } else {
            return locale.formatDistance('xMinutes', 1, localizeOptions);
          }
        } else {
          if (minutes === 0) {
            return locale.formatDistance('lessThanXMinutes', 1, localizeOptions);
          } else {
            return locale.formatDistance('xMinutes', minutes, localizeOptions);
          }
        }

        // 2 mins up to 0.75 hrs
      } else if (minutes < 45) {
        return locale.formatDistance('xMinutes', minutes, localizeOptions);

        // 0.75 hrs up to 1.5 hrs
      } else if (minutes < 90) {
        return locale.formatDistance('aboutXHours', 1, localizeOptions);

        // 1.5 hrs up to 24 hrs
      } else if (minutes < MINUTES_IN_DAY) {
        var hours = Math.round(minutes / 60);
        return locale.formatDistance('aboutXHours', hours, localizeOptions);

        // 1 day up to 1.75 days
      } else if (minutes < MINUTES_IN_ALMOST_TWO_DAYS) {
        return locale.formatDistance('xDays', 1, localizeOptions);

        // 1.75 days up to 30 days
      } else if (minutes < MINUTES_IN_MONTH) {
        var days = Math.round(minutes / MINUTES_IN_DAY);
        return locale.formatDistance('xDays', days, localizeOptions);

        // 1 month up to 2 months
      } else if (minutes < MINUTES_IN_TWO_MONTHS) {
        months = Math.round(minutes / MINUTES_IN_MONTH);
        return locale.formatDistance('aboutXMonths', months, localizeOptions);
      }
      months = differenceInMonths(dateRight, dateLeft);

      // 2 months up to 12 months
      if (months < 12) {
        var nearestMonth = Math.round(minutes / MINUTES_IN_MONTH);
        return locale.formatDistance('xMonths', nearestMonth, localizeOptions);

        // 1 year up to max Date
      } else {
        var monthsSinceStartOfYear = months % 12;
        var years = Math.floor(months / 12);

        // N years up to 1 years 3 months
        if (monthsSinceStartOfYear < 3) {
          return locale.formatDistance('aboutXYears', years, localizeOptions);

          // N years 3 months up to N years 9 months
        } else if (monthsSinceStartOfYear < 9) {
          return locale.formatDistance('overXYears', years, localizeOptions);

          // N years 9 months up to N year 12 months
        } else {
          return locale.formatDistance('almostXYears', years + 1, localizeOptions);
        }
      }
    }

    /**
     * @name formatDistanceToNow
     * @category Common Helpers
     * @summary Return the distance between the given date and now in words.
     * @pure false
     *
     * @description
     * Return the distance between the given date and now in words.
     *
     * | Distance to now                                                   | Result              |
     * |-------------------------------------------------------------------|---------------------|
     * | 0 ... 30 secs                                                     | less than a minute  |
     * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
     * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
     * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
     * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
     * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
     * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
     * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
     * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
     * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
     * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
     * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
     * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
     * | N yrs ... N yrs 3 months                                          | about N years       |
     * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
     * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
     *
     * With `options.includeSeconds == true`:
     * | Distance to now     | Result               |
     * |---------------------|----------------------|
     * | 0 secs ... 5 secs   | less than 5 seconds  |
     * | 5 secs ... 10 secs  | less than 10 seconds |
     * | 10 secs ... 20 secs | less than 20 seconds |
     * | 20 secs ... 40 secs | half a minute        |
     * | 40 secs ... 60 secs | less than a minute   |
     * | 60 secs ... 90 secs | 1 minute             |
     *
     * > ⚠️ Please note that this function is not present in the FP submodule as
     * > it uses `Date.now()` internally hence impure and can't be safely curried.
     *
     * @param {Date|Number} date - the given date
     * @param {Object} [options] - the object with options
     * @param {Boolean} [options.includeSeconds=false] - distances less than a minute are more detailed
     * @param {Boolean} [options.addSuffix=false] - result specifies if now is earlier or later than the passed date
     * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
     * @returns {String} the distance in words
     * @throws {TypeError} 1 argument required
     * @throws {RangeError} `date` must not be Invalid Date
     * @throws {RangeError} `options.locale` must contain `formatDistance` property
     *
     * @example
     * // If today is 1 January 2015, what is the distance to 2 July 2014?
     * const result = formatDistanceToNow(
     *   new Date(2014, 6, 2)
     * )
     * //=> '6 months'
     *
     * @example
     * // If now is 1 January 2015 00:00:00,
     * // what is the distance to 1 January 2015 00:00:15, including seconds?
     * const result = formatDistanceToNow(
     *   new Date(2015, 0, 1, 0, 0, 15),
     *   {includeSeconds: true}
     * )
     * //=> 'less than 20 seconds'
     *
     * @example
     * // If today is 1 January 2015,
     * // what is the distance to 1 January 2016, with a suffix?
     * const result = formatDistanceToNow(
     *   new Date(2016, 0, 1),
     *   {addSuffix: true}
     * )
     * //=> 'in about 1 year'
     *
     * @example
     * // If today is 1 January 2015,
     * // what is the distance to 1 August 2016 in Esperanto?
     * const eoLocale = require('date-fns/locale/eo')
     * const result = formatDistanceToNow(
     *   new Date(2016, 7, 1),
     *   {locale: eoLocale}
     * )
     * //=> 'pli ol 1 jaro'
     */
    function formatDistanceToNow(dirtyDate, options) {
      requiredArgs(1, arguments);
      return formatDistance(dirtyDate, Date.now(), options);
    }

    /**
     * @name fromUnixTime
     * @category Timestamp Helpers
     * @summary Create a date from a Unix timestamp.
     *
     * @description
     * Create a date from a Unix timestamp (in seconds). Decimal values will be discarded.
     *
     * @param {Number} unixTime - the given Unix timestamp (in seconds)
     * @returns {Date} the date
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // Create the date 29 February 2012 11:45:05:
     * const result = fromUnixTime(1330515905)
     * //=> Wed Feb 29 2012 11:45:05
     */
    function fromUnixTime(dirtyUnixTime) {
      requiredArgs(1, arguments);
      var unixTime = toInteger(dirtyUnixTime);
      return toDate(unixTime * 1000);
    }

    function About({ appState, socket, }) {
        return (window.SP_REACT.createElement(deckyFrontendLib.DialogBody, null,
            window.SP_REACT.createElement(deckyFrontendLib.DialogControlsSection, null,
                window.SP_REACT.createElement("div", null,
                    window.SP_REACT.createElement("p", null, "Wine Cellar is a compatibility tool manager for Steam. It allows you to install, uninstall, and update compatibility tools for Steam games.")),
                window.SP_REACT.createElement(deckyFrontendLib.DialogControlsSectionHeader, null, "Wine Cellar"),
                window.SP_REACT.createElement(SystemInformation, { appState: appState, socket: socket }),
                window.SP_REACT.createElement(deckyFrontendLib.DialogControlsSectionHeader, null, "Engage & Participate"),
                window.SP_REACT.createElement(ProjectInformation, null))));
    }
    function SystemInformation({ appState, socket, }) {
        return (window.SP_REACT.createElement(deckyFrontendLib.Focusable, { style: { display: "flex", flexDirection: "column" } }, appState != undefined && socket != undefined && (window.SP_REACT.createElement(deckyFrontendLib.Field, { label: "Compatibility Tools Updates", description: "Last checked: " +
                (appState.updater_last_check != null
                    ? formatDistanceToNow(fromUnixTime(appState.updater_last_check)) + " ago"
                    : "Never"), bottomSeparator: "none" },
            window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { disabled: appState.updater_state == UpdaterState.Checking, onClick: () => {
                    if (socket && socket.readyState === WebSocket.OPEN) {
                        const response = {
                            type: RequestType.Task,
                            task: {
                                type: TaskType.CheckForFlavorUpdates,
                            },
                        };
                        socket.send(JSON.stringify(response));
                    }
                    else {
                        error("WebSocket not alive...");
                    }
                } }, appState.updater_state == UpdaterState.Idle
                ? "Check For Updates"
                : "Checking...")))));
    }
    function ProjectInformation() {
        const socialLinks = [
            {
                label: "GitHub",
                icon: window.SP_REACT.createElement(SiGithub, null),
                link: "https://github.com/FlashyReese/decky-wine-cellar",
                buttonText: "Report an Issue",
            },
            {
                label: "Discord",
                icon: window.SP_REACT.createElement(SiDiscord, null),
                link: "https://discord.gg/MPHVG6MH4e",
                buttonText: "Join Us",
            },
            {
                label: "Ko-fi",
                icon: window.SP_REACT.createElement(SiKofi, null),
                link: "https://ko-fi.com/flashyreese",
                buttonText: "Support the Project!",
            },
        ];
        return (window.SP_REACT.createElement(deckyFrontendLib.Focusable, { style: { display: "flex", flexDirection: "column" } }, socialLinks.map((linkInfo, index) => (
        //padding compact is broken lol
        window.SP_REACT.createElement(deckyFrontendLib.Field, { key: index, label: linkInfo.label, icon: linkInfo.icon, bottomSeparator: "none", padding: "none" },
            window.SP_REACT.createElement(deckyFrontendLib.Focusable, { style: {
                    marginLeft: "auto",
                    boxShadow: "none",
                    display: "flex",
                    justifyContent: "right",
                    padding: "4px",
                } },
                window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { onClick: () => {
                        deckyFrontendLib.Navigation.NavigateToExternalWeb(linkInfo.link);
                    }, style: {
                        padding: "10px",
                        fontSize: "14px",
                    } }, linkInfo.buttonText),
                window.SP_REACT.createElement(deckyFrontendLib.DialogButton, { onClick: () => {
                        showQrModal(linkInfo.link);
                    }, style: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px",
                        maxWidth: "40px",
                        minWidth: "auto",
                        marginLeft: ".5em",
                    } },
                    window.SP_REACT.createElement(HiOutlineQrCode, null))))))));
    }

    function ManagePage() {
        const [appState, setAppState] = React.useState();
        const [socket, setSocket] = React.useState();
        React.useEffect(() => {
            const socket = new WebSocket("ws://localhost:8887");
            const uniqueId = v4(); // Generate a unique identifier
            setSocket(socket);
            socket.onopen = async () => {
                log("WebSocket connection established. Unique Identifier:", uniqueId); // Log the unique identifier on connection open
                const tools = await GetGlobalCompatTools();
                const response = {
                    type: RequestType.RequestState,
                    available_compat_tools: tools,
                };
                socket.send(JSON.stringify(response));
            };
            socket.onmessage = async (event) => {
                //log("Received message from server:", event.data);
                const response = JSON.parse(event.data);
                if (response.type == RequestType.UpdateState) {
                    if (response.app_state != null) {
                        setAppState(response.app_state);
                        log("Received app state update");
                    }
                }
            };
            socket.onerror = (error) => {
                log("WebSocket error:", error);
            };
            socket.onclose = () => {
                log("WebSocket connection closed. Unique Identifier:", uniqueId); // Log the unique identifier on connection close
            };
            return () => {
                socket.close(); // Close the WebSocket connection on component unmount
            };
        }, []);
        const pages = [];
        if (appState != null && socket != null) {
            // Regular dashboard
            pages.push({
                title: "Dashboard",
                content: window.SP_REACT.createElement(ManagerTab, { appState: appState, socket: socket }),
                route: "/wine-cellar/dashboard",
            });
            // Flavor pages
            appState.available_flavors.forEach((flavor) => {
                pages.push({
                    title: flavor.flavor,
                    content: (window.SP_REACT.createElement(FlavorTab, { appState: appState, flavor: flavor, socket: socket })),
                    route: "/wine-cellar/" + flavor.flavor,
                });
            });
        }
        else {
            // Loading page
            pages.push({
                title: "Preparing...",
                content: (window.SP_REACT.createElement("div", null, "Hang tight! We're preparing your Wine Cellar experience. If this is taking longer than expected, the backend might be having a siesta.")),
                route: "/wine-cellar/preparing",
            });
        }
        // About page
        pages.push({
            title: "About",
            content: window.SP_REACT.createElement(About, { appState: appState, socket: socket }),
            route: "/wine-cellar/about",
        });
        return window.SP_REACT.createElement(deckyFrontendLib.SidebarNavigation, { title: "Wine Cellar", showTitle: true, pages: pages });
    }

    let shouldReconnect = true; // Global flag to control reconnection
    let socket = null; // Global WebSocket reference
    const setupToasts = (serverAPI) => {
        const setupWebsocket = () => {
            if (!shouldReconnect) {
                return; // If reconnection is disabled, don't proceed
            }
            socket = new WebSocket("ws://localhost:8887");
            const uniqueId = v4(); // Generate a unique identifier using UUID
            socket.onopen = () => {
                log("WebSocket connection established. Unique Identifier: ", uniqueId);
            };
            socket.onmessage = (e) => {
                const response = JSON.parse(e.data);
                if (response.type == RequestType.Notification) {
                    if (response.notification != null && response.notification != "") {
                        let toastData = {
                            title: "Wine Cellar",
                            body: response.notification,
                            showToast: true,
                        };
                        serverAPI.toaster.toast(toastData);
                        log("Received backend notification: " + response.notification);
                    }
                }
            };
            socket.onclose = (e) => {
                if (shouldReconnect) {
                    log("Socket is closed. Unique Identifier:", uniqueId, "Reconnect will be attempted in 5 seconds.", e.reason);
                    setTimeout(() => {
                        setupWebsocket();
                    }, 5000);
                }
                else {
                    log("Socket is closed. Reconnection is disabled. Unique Identifier:", uniqueId);
                }
            };
            socket.onerror = (err) => {
                error("Socket encountered error: ", err.message, "Unique Identifier:", uniqueId);
                if (socket) {
                    socket.close();
                }
            };
        };
        setupWebsocket();
    };
    // Function to forcibly close the WebSocket and prevent reconnection
    const forceCloseToastsWebSocket = () => {
        shouldReconnect = false;
        if (socket) {
            socket.close();
        }
    };

    // THIS FILE IS AUTO GENERATED
    function GiCellarBarrels (props) {
      return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M266.5 45.39c-19.9 0-39.8 1.51-59.7 4.51-29.6 26.08-45.4 71.3-45.4 115.4 0 20.2 3.3 39.8 9.6 57 6.5-.3 12.9-.5 19.4-.5 18.5-.8 31.2 0 46.6 2.6-6.1-18.4-9.1-38.7-9.1-59.1 0-43.7 13.6-89.1 42.1-119.83h-3.5zm28.9 1.14c-32.3 25.42-49.5 72.67-49.5 118.77 0 22.2 3.9 43.6 11.5 61.9 12 1.9 23.9 4.3 35.9 7.2 5.8.2 11.5 1.4 16.9 3.4-12-21.2-19-48.7-19-78.8 0-31.8 7.8-60.77 21.1-82.38 6.2-10.15 13.9-18.81 22.6-25.13-13.2-2.3-26.3-3.97-39.5-4.96zm-118.3 8.95c-3.2.74-6.5 1.51-9.8 2.33l-.4.1-.3.1C96.79 69.64 80.62 173.7 118.1 228.1c11.4-2 22.8-3.5 34.2-4.6-5.9-18.1-8.9-38.1-8.9-58.2 0-39.2 10.9-79.7 33.7-109.82zm190.7 2.71c-14.7 0-29 9.74-40.1 27.87-11.2 18.14-18.5 44.14-18.5 72.94 0 28.8 7.3 54.8 18.5 72.9 11.1 18.2 25.4 27.9 40.1 27.9 14.7 0 29-9.7 40.1-27.9 11.2-18.1 18.5-44.1 18.5-72.9 0-28.8-7.3-54.8-18.5-72.94-11.1-18.13-25.4-27.87-40.1-27.87zm-.1 134.01h.2c7.2.1 11.6 5.3 13.9 10 2.3 4.7 3.4 10 3.4 15.9s-1.1 11.2-3.4 15.9c-2.3 4.7-6.7 9.9-13.9 10h-.2c-7.2-.1-11.6-5.3-13.9-10-2.3-4.7-3.4-10-3.4-15.9s1.1-11.2 3.4-15.9c2.3-4.7 6.7-9.9 13.9-10zm-177.3 47.5c-19.8 0-39.7 1.5-59.6 4.5-29.6 26.1-45.45 71.2-45.45 115.3 0 42 14.04 81.3 40.35 101.9 21.1 3.4 42.2 5.2 63.2 5.2-25-25.9-37-66.3-37-107 0-43.8 13.5-89.2 42.1-119.9zm29 1.1c-32.4 25.4-49.6 72.7-49.6 118.8 0 45 16.2 87 46.5 106.2 14.2-1 28.4-2.7 42.6-5.1-8.7-6.4-16.3-15-22.5-25.1-13.3-21.7-21.1-50.6-21.1-82.4 0-31.8 7.8-60.7 21.1-82.3 6.2-10.1 13.8-18.8 22.4-25.1-13.2-2.3-26.3-4-39.4-5zM101 249.9c-3.31.7-6.5 1.5-9.73 2.3h-.43l-.31.1c-90.831 15.1-90.831 186.8 0 201.9l.31.1h.43l3.65.9c-18.61-25.6-27.52-60.5-27.52-95.7 0-39.1 10.88-79.6 33.6-109.6zm190.8 2.5c-14.7 0-28.9 9.8-40.1 27.9-11.2 18.1-18.5 44.1-18.5 72.9 0 28.9 7.3 54.8 18.5 73 11.2 18.1 25.4 27.9 40.1 27.9 14.7 0 28.9-9.8 40.1-27.9 11.2-18.2 18.5-44.1 18.5-73 0-28.8-7.3-54.8-18.5-72.9-11.2-18.1-25.4-27.9-40.1-27.9zm139 0c-8.9.1-17.7 3.7-25.8 10.7-.2.2-.4.4-.6.5-4.9 4.4-9.5 10-13.6 16.8-11.1 18.1-18.4 44-18.4 72.8 0 28.8 7.3 54.8 18.5 72.9C402 444.3 416.3 454 431 454c14.7 0 29-9.7 40.1-27.9 11.2-18.1 18.5-44.1 18.5-72.9 0-28.8-7.3-54.8-18.5-72.9-11.1-18.2-25.4-27.9-40.1-27.9zm-139 134.1c7.2 0 11.7 5.2 14.1 9.9 2.3 4.7 3.3 10 3.3 16 0 5.9-1 11.3-3.3 15.9-2.4 4.8-6.9 9.9-14.1 9.9-7.2 0-11.7-5.1-14-9.9-2.4-4.6-3.4-10-3.4-15.9 0-6 1-11.3 3.4-16 2.3-4.7 6.8-9.9 14-9.9zm139.1 0h.2c7.2.1 11.6 5.3 13.9 10 2.3 4.7 3.4 10 3.4 15.9s-1.1 11.2-3.4 15.9c-2.3 4.7-6.7 9.9-13.9 10h-.2c-7.2-.1-11.6-5.3-13.9-10-2.3-4.7-3.4-10-3.4-15.9s1.1-11.2 3.4-15.9c2.3-4.7 6.7-9.9 13.9-10zm-69.5 16.8c-3.5 11.9-8.3 22.8-14.1 32.3-8.5 13.6-19.4 24.6-31.9 30.8 27.5.9 55.1-.9 82.6-5.7-8.6-6.3-16.3-15-22.5-25.1-5.8-9.5-10.6-20.4-14.1-32.3z"}}]})(props);
    }

    const Content = ({}) => {
        return (window.SP_REACT.createElement(deckyFrontendLib.PanelSection, { title: "Wine Cellar" },
            window.SP_REACT.createElement(deckyFrontendLib.PanelSectionRow, null,
                window.SP_REACT.createElement(deckyFrontendLib.ButtonItem, { layout: "below", onClick: () => {
                        deckyFrontendLib.Router.CloseSideMenus();
                        deckyFrontendLib.Router.Navigate("/wine-cellar");
                    } }, "Manage"))));
    };
    var index = deckyFrontendLib.definePlugin((serverApi) => {
        setupToasts(serverApi);
        serverApi.routerHook.addRoute("/wine-cellar", () => {
            return window.SP_REACT.createElement(ManagePage, null);
        });
        return {
            title: window.SP_REACT.createElement("div", { className: deckyFrontendLib.staticClasses.Title }, "Wine Cellar"),
            content: window.SP_REACT.createElement(Content, { serverAPI: serverApi }),
            icon: window.SP_REACT.createElement(GiCellarBarrels, null),
            onDismount() {
                forceCloseToastsWebSocket();
                serverApi.routerHook.removeRoute("/wine-cellar");
            },
        };
    });

    return index;

})(DFL, SP_REACT);
