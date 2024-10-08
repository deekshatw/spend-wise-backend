"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserRepository = exports.createUserRepository = void 0;
const counter_service_1 = require("../database/models/helpers/counter.service");
const user_model_1 = __importDefault(require("../database/models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUserRepository = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = userData;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    try {
        const isAlreadyExists = yield user_model_1.default.findOne({ email });
        if (isAlreadyExists) {
            return 'exists';
        }
        else {
            const userId = yield (0, counter_service_1.getNextUserId)();
            const created = yield user_model_1.default.create({
                userId,
                name,
                email,
                password: hashedPassword
            });
            return created ? 'success' : 'error';
        }
    }
    catch (error) {
        return "error";
    }
});
exports.createUserRepository = createUserRepository;
const loginUserRepository = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return null;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        return isMatch ? user : null;
    }
    catch (error) {
        return null;
    }
});
exports.loginUserRepository = loginUserRepository;
