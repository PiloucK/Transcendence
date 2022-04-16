"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRelation = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["IS_GUEST"] = "IS_GUEST";
    UserStatus["IS_42API"] = "IS_42API";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var UserRelation;
(function (UserRelation) {
    UserRelation["NO_FRIEND"] = "NO_FRIEND";
    UserRelation["IS_REQ"] = "IS_REQ";
    UserRelation["REQ_SENT"] = "REQ_SENT";
    UserRelation["FRIEND"] = "FRIEND";
    UserRelation["BLOCK"] = "BLOCK";
})(UserRelation = exports.UserRelation || (exports.UserRelation = {}));
//# sourceMappingURL=user-status.enum.js.map