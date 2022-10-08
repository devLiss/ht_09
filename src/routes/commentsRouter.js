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
exports.commentsRouter = void 0;
const express_1 = require("express");
const comments_service_1 = require("../domain/comments-service");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const express_validator_1 = require("express-validator");
const inputValidationMiddleware_1 = require("../middlewares/inputValidationMiddleware");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_service_1.commentService.getCommentByID(req.params.id);
    if (!comment) {
        res.send(404);
        return;
    }
    res.status(200).send(comment);
}));
exports.commentsRouter.delete('/:commentId', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_service_1.commentService.getCommentByID(req.params.commentId);
    if (!comment) {
        res.send(404);
        return;
    }
    //@ts-ignore
    if (comment.userId.toString() !== req.user.userId.toString()) {
        res.send(403);
        return;
    }
    const isDeleted = yield comments_service_1.commentService.deleteComment(comment.id);
    res.send(204);
}));
exports.commentsRouter.put('/:commentId', authMiddleware_1.authMiddleware, (0, express_validator_1.body)('content').trim().isLength({ min: 20, max: 300 }), inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_service_1.commentService.getCommentByID(req.params.commentId);
    if (!comment) {
        res.send(404);
        return;
    }
    console.log(comment.userId);
    //@ts-ignore
    console.log(req.user.userId);
    //@ts-ignore
    if (comment.userId.toString() !== req.user.userId.toString()) {
        res.send(403);
        return;
    }
    const isModified = yield comments_service_1.commentService.updateComment(comment.id, req.body.content);
    res.send(204);
}));
