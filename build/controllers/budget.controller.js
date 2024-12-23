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
exports.deleteBudgetController = exports.updateBudgetController = exports.getAllBudgetsOfOneUserController = exports.createBudgetController = void 0;
const budget_repository_1 = require("../repositories/budget.repository");
const createBudgetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const budget = req.body;
    try {
        const response = yield (0, budget_repository_1.createBudgetRepository)(budget);
        if (response === 'exists') {
            res.status(409).json({
                "success": false,
                "message": "This budget already exists!"
            });
        }
        else if (response == 'success') {
            res.status(201).json({
                "success": true,
                "message": "Budget created successfully"
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
exports.createBudgetController = createBudgetController;
const getAllBudgetsOfOneUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
    }
    try {
        const budgets = yield (0, budget_repository_1.getBudgetsListRepository)(userId);
        res.status(200).json({
            "success": true,
            "data": budgets
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
exports.getAllBudgetsOfOneUserController = getAllBudgetsOfOneUserController;
const updateBudgetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const budgetId = req.params.budgetId;
    const budget = req.body;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
    }
    try {
        const response = yield (0, budget_repository_1.updateBudgetRepository)(userId, budgetId, budget);
        if (response === 'success') {
            res.status(200).json({
                "success": true,
                "message": "Budget updated successfully"
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
exports.updateBudgetController = updateBudgetController;
const deleteBudgetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const budgetId = req.params.budgetId;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
    }
    try {
        const response = yield (0, budget_repository_1.deleteBudgetRepository)(budgetId);
        if (response === 'success') {
            res.status(200).json({
                "success": true,
                "message": "Budget deleted successfully"
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
exports.deleteBudgetController = deleteBudgetController;
