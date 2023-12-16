/*! For license information please see default-src_atoms_ui_CSSTransition_CSSTransition_tsx.js.LICENSE.txt */
"use strict";(self.webpackChunkgallery=self.webpackChunkgallery||[]).push([["default-src_atoms_ui_CSSTransition_CSSTransition_tsx"],{"./src/atoms/ui/CSSTransition/CSSTransition.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _CSSTransition_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CSSTransition.scss */ "./src/atoms/ui/CSSTransition/CSSTransition.scss");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");\n\n\n\nfunction CSSTransition(_ref) {\n  let {\n    isShow,\n    duration,\n    timingFunction = \'linear\',\n    className,\n    children\n  } = _ref;\n  /**\r\n   * Toggle css class according to isShow\r\n   */\n  const containerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);\n  const [isRender, setIsRender] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(isShow);\n  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n    const container = containerRef.current;\n    if (!container) return;\n    let timeoutID;\n    if (isShow) {\n      // Initiate class\n      setIsRender(true);\n      container.classList.remove("".concat(className, "--enter"));\n      container.classList.remove("".concat(className, "--leave"));\n\n      // Enter animation\n      timeoutID = setTimeout(() => {\n        container.classList.add("".concat(className, "--enter"));\n      }, 50);\n    } else if (!isShow && isRender) {\n      // Leave animation\n      container.classList.remove("".concat(className, "--enter"));\n      container.classList.add("".concat(className, "--leave"));\n\n      // Destroy the component\n      timeoutID = setTimeout(() => {\n        setIsRender(false);\n      }, duration);\n    }\n    return () => {\n      timeoutID && clearTimeout(timeoutID);\n    };\n  }, [isShow, duration]);\n\n  /**\r\n   * Set the duration & timing function as css variable\r\n   */\n  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n    const container = containerRef.current;\n    if (!container) return;\n    container.style.setProperty(\'--duration\', "".concat(duration, "ms"));\n    container.style.setProperty(\'--timing-function\', timingFunction);\n  }, [isRender, duration, timingFunction]);\n  if (!isShow && !isRender) return null;\n  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {\n    className: "transition ".concat(className),\n    ref: containerRef,\n    children: children\n  });\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSSTransition);\n\n//# sourceURL=webpack://gallery/./src/atoms/ui/CSSTransition/CSSTransition.tsx?')},"./src/atoms/ui/CSSTransition/CSSTransition.scss":()=>{eval("// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://gallery/./src/atoms/ui/CSSTransition/CSSTransition.scss?")}}]);