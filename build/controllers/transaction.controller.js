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
exports.updateTransactionController = exports.deleteTransactionController = exports.getTransactionSummaryController = exports.getAllTransactionsOfOneUserController = exports.createTransactionController = void 0;
const transaction_repository_1 = require("../repositories/transaction.repository");
const createTransactionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = req.body.transaction;
    const userAction = req.body.userAction;
    console.log(transaction);
    try {
        const response = yield (0, transaction_repository_1.createTransactionRepository)(transaction, userAction);
        console.log(response);
        if (response === 'success') {
            res.status(201).json({
                "success": true,
                "message": "Transaction created successfully"
            });
        }
        else if (response === 'overage') {
            res.status(400).json({
                "success": false,
                "message": "Budget exceeded!"
            });
        }
        else {
            res.status(500).json({
                "success": false,
                "message": "Internal server error"
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            "success": false,
            "message": error
        });
    }
});
exports.createTransactionController = createTransactionController;
const getAllTransactionsOfOneUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    console.log(userId);
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
    }
    const { startDate, endDate, type } = req.query;
    const filters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        type: type
    };
    try {
        const transactions = yield (0, transaction_repository_1.getAllTransactionsOfOneUserRepository)(userId, filters);
        res.status(200).json({
            "success": true,
            "data": transactions
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            "success": false,
            "message": error
        });
    }
});
exports.getAllTransactionsOfOneUserController = getAllTransactionsOfOneUserController;
const getTransactionSummaryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
        return;
    }
    try {
        const summary = yield (0, transaction_repository_1.getUserTransactionSummaryRepository)(userId.toString());
        res.status(200).json({
            success: true,
            data: summary
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching transaction summary'
        });
    }
});
exports.getTransactionSummaryController = getTransactionSummaryController;
const deleteTransactionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const transactionId = req.params.transactionId;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
    }
    try {
        const response = yield (0, transaction_repository_1.deleteTransactionRepository)(transactionId);
        if (response) {
            res.status(200).json({
                success: true,
                message: 'Transaction deleted successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting transaction'
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting transaction'
        });
    }
});
exports.deleteTransactionController = deleteTransactionController;
const updateTransactionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const transactionId = req.params.transactionId;
    const transaction = req.body;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
    }
    try {
        const response = yield (0, transaction_repository_1.updateTransactionRepository)(transactionId, transaction);
        if (response) {
            res.status(200).json({
                success: true,
                message: 'Transaction updated successfully'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating transaction'
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error
        });
    }
});
exports.updateTransactionController = updateTransactionController;
