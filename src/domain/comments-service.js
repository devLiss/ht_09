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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentService = void 0;
const comment_db_repo_1 = require("../repositories/comment-db-repo");
exports.commentService = {
    createComment(content, postId, userId, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = {
                content: content,
                postId: postId,
                userId: userId,
                userLogin: userName,
                createdAt: new Date().toISOString()
            };
            const createdComment = yield comment_db_repo_1.commentRepo.createComment(newComment);
            return createdComment;
        });
    },
    getCommentByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_db_repo_1.commentRepo.getCommentById(id);
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_db_repo_1.commentRepo.deleteComment(id);
        });
    },
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_db_repo_1.commentRepo.updateComment(id, content);
        });
    },
    getCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_db_repo_1.commentRepo.getCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection);
        });
    }
};
