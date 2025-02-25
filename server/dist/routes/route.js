"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = __importDefault(require("../controllers/controllers"));
const user = (0, express_1.Router)();
user.post('/sendMails', controllers_1.default.sendMails);
exports.default = user;
//# sourceMappingURL=route.js.map