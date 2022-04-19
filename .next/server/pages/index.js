"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/index";
exports.ids = ["pages/index"];
exports.modules = {

/***/ "./src/pages/index.tsx":
/*!*****************************!*\
  !*** ./src/pages/index.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getServerSideProps\": () => (/* binding */ getServerSideProps)\n/* harmony export */ });\n/* harmony import */ var src_shared_utils_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/shared/utils/fetch */ \"./src/shared/utils/fetch.ts\");\n\nconst getServerSideProps = async ()=>{\n    const blogPosts = await (0,src_shared_utils_fetch__WEBPACK_IMPORTED_MODULE_0__.fetch)('/api/blog-posts');\n    return {\n        props: {\n            blogPosts\n        }\n    };\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvaW5kZXgudHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQThDO0FBRXZDLEtBQUssQ0FBQ0Msa0JBQWtCLGFBQStDLENBQUM7SUFDM0UsS0FBSyxDQUFDQyxTQUFTLEdBQUcsS0FBSyxDQUFDRiw2REFBSyxDQUFDLENBQWlCO0lBQy9DLE1BQU0sQ0FBQyxDQUFDO1FBQUNHLEtBQUssRUFBRSxDQUFDO1lBQUNELFNBQVM7UUFBQyxDQUFDO0lBQUMsQ0FBQztBQUNuQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdHJhbnNjZW5kZW5jZS8uL3NyYy9wYWdlcy9pbmRleC50c3g/MTlhMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmZXRjaCB9IGZyb20gJ3NyYy9zaGFyZWQvdXRpbHMvZmV0Y2gnO1xuXG5leHBvcnQgY29uc3QgZ2V0U2VydmVyU2lkZVByb3BzOiBHZXRTZXJ2ZXJTaWRlUHJvcHM8VEhvbWVQcm9wcz4gPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYmxvZ1Bvc3RzID0gYXdhaXQgZmV0Y2goJy9hcGkvYmxvZy1wb3N0cycpO1xuICAgIHJldHVybiB7IHByb3BzOiB7IGJsb2dQb3N0cyB9IH07XG59O1xuIl0sIm5hbWVzIjpbImZldGNoIiwiZ2V0U2VydmVyU2lkZVByb3BzIiwiYmxvZ1Bvc3RzIiwicHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/pages/index.tsx\n");

/***/ }),

/***/ "./src/shared/constants/env.ts":
/*!*************************************!*\
  !*** ./src/shared/constants/env.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"isServer\": () => (/* binding */ isServer),\n/* harmony export */   \"isClient\": () => (/* binding */ isClient),\n/* harmony export */   \"NODE_ENV\": () => (/* binding */ NODE_ENV),\n/* harmony export */   \"PORT\": () => (/* binding */ PORT)\n/* harmony export */ });\nconst isServer = \"undefined\" === 'undefined';\nconst isClient = !isServer;\nconst NODE_ENV = \"development\";\nconst PORT = process.env.PORT || 3000;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2hhcmVkL2NvbnN0YW50cy9lbnYudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFPLEtBQUssQ0FBQ0EsUUFBUSxHQUFHLENBQWEsZUFBSyxDQUFXO0FBRTlDLEtBQUssQ0FBQ0MsUUFBUSxJQUFJRCxRQUFRO0FBRTFCLEtBQUssQ0FBQ0UsUUFBUSxHQUpyQixDQUFhO0FBTU4sS0FBSyxDQUFDQyxJQUFJLEdBQUdDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDRixJQUFJLElBQUksSUFBSSIsInNvdXJjZXMiOlsid2VicGFjazovL3RyYW5zY2VuZGVuY2UvLi9zcmMvc2hhcmVkL2NvbnN0YW50cy9lbnYudHM/NzMzOCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgaXNTZXJ2ZXIgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJztcblxuZXhwb3J0IGNvbnN0IGlzQ2xpZW50ID0gIWlzU2VydmVyO1xuXG5leHBvcnQgY29uc3QgTk9ERV9FTlYgPSBwcm9jZXNzLmVudi5OT0RFX0VOVjtcblxuZXhwb3J0IGNvbnN0IFBPUlQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDA7XG4iXSwibmFtZXMiOlsiaXNTZXJ2ZXIiLCJpc0NsaWVudCIsIk5PREVfRU5WIiwiUE9SVCIsInByb2Nlc3MiLCJlbnYiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/shared/constants/env.ts\n");

/***/ }),

/***/ "./src/shared/utils/fetch.ts":
/*!***********************************!*\
  !*** ./src/shared/utils/fetch.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"fetch\": () => (/* binding */ envAwareFetch)\n/* harmony export */ });\n/* harmony import */ var _constants_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/env */ \"./src/shared/constants/env.ts\");\n\nconst envAwareFetch = (url, options)=>{\n    const fetchUrl = _constants_env__WEBPACK_IMPORTED_MODULE_0__.isServer && url.startsWith('/') ? `http://localhost:${_constants_env__WEBPACK_IMPORTED_MODULE_0__.PORT}${url}` : url;\n    return fetch(fetchUrl, options).then((res)=>res.json()\n    );\n};\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2hhcmVkL3V0aWxzL2ZldGNoLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQWlEO0FBRWpELEtBQUssQ0FBQ0UsYUFBYSxJQUFJQyxHQUFXLEVBQUVDLE9BQWlDLEdBQUssQ0FBQztJQUN2RSxLQUFLLENBQUNDLFFBQVEsR0FDVkwsb0RBQVEsSUFBSUcsR0FBRyxDQUFDRyxVQUFVLENBQUMsQ0FBRyxPQUFLLGlCQUFpQixFQUFFTCxnREFBSSxHQUFHRSxHQUFHLEtBQUtBLEdBQUc7SUFFNUUsTUFBTSxDQUFDSSxLQUFLLENBQUNGLFFBQVEsRUFBRUQsT0FBTyxFQUFFSSxJQUFJLEVBQUVDLEdBQUcsR0FBS0EsR0FBRyxDQUFDQyxJQUFJOztBQUMxRCxDQUFDO0FBRWlDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdHJhbnNjZW5kZW5jZS8uL3NyYy9zaGFyZWQvdXRpbHMvZmV0Y2gudHM/ZDY0YyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1NlcnZlciwgUE9SVCB9IGZyb20gJy4uL2NvbnN0YW50cy9lbnYnO1xuXG5jb25zdCBlbnZBd2FyZUZldGNoID0gKHVybDogc3RyaW5nLCBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICBjb25zdCBmZXRjaFVybCA9XG4gICAgICAgIGlzU2VydmVyICYmIHVybC5zdGFydHNXaXRoKCcvJykgPyBgaHR0cDovL2xvY2FsaG9zdDoke1BPUlR9JHt1cmx9YCA6IHVybDtcblxuICAgIHJldHVybiBmZXRjaChmZXRjaFVybCwgb3B0aW9ucykudGhlbigocmVzKSA9PiByZXMuanNvbigpKTtcbn07XG5cbmV4cG9ydCB7IGVudkF3YXJlRmV0Y2ggYXMgZmV0Y2ggfTtcbiJdLCJuYW1lcyI6WyJpc1NlcnZlciIsIlBPUlQiLCJlbnZBd2FyZUZldGNoIiwidXJsIiwib3B0aW9ucyIsImZldGNoVXJsIiwic3RhcnRzV2l0aCIsImZldGNoIiwidGhlbiIsInJlcyIsImpzb24iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/shared/utils/fetch.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/index.tsx"));
module.exports = __webpack_exports__;

})();