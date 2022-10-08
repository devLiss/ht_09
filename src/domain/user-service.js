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
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_db_repo_1 = require("../repositories/user-db-repo");
exports.userService = {
    createUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("create user");
            const passwordSalt = yield bcrypt_1.default.genSalt(12);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            console.log(passwordHash);
            const newUser = {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString()
            };
            return user_db_repo_1.userRepo.createUser(newUser);
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    },
    checkCredentials(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_db_repo_1.userRepo.findByLogin(login);
            console.log("User in creds with login ---> " + login);
            console.log(user);
            if (!user)
                return null;
            const passwordHash = yield this._generateHash(password, user.passwordSalt);
            if (user.passwordHash !== passwordHash) {
                return null;
            }
            return user;
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_db_repo_1.userRepo.deleteUser(id);
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_db_repo_1.userRepo.findById(id);
            return user;
        });
    },
    getUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_db_repo_1.userRepo.getUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection);
        });
    }
};
