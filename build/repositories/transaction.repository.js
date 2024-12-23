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
exports.updateTransactionRepository = exports.deleteTransactionRepository = exports.getUserTransactionSummaryRepository = exports.getAllTransactionsOfOneUserRepository = exports.createTransactionRepository = void 0;
const budget_model_1 = __importDefault(require("../database/models/budget.model"));
const category_model_1 = __importDefault(require("../database/models/category.model"));
const counter_service_1 = require("../database/models/helpers/counter.service");
const transaction_model_1 = __importDefault(require("../database/models/transaction.model"));
const createTransactionRepository = (transaction, userAction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the transaction is an expense
        if (transaction.transactionType === 'expense') {
            const budget = yield budget_model_1.default.findOne({
                userId: transaction.userId,
                category: transaction.categoryId,
                startDate: { $lte: transaction.date },
                endDate: { $gte: transaction.date },
            }).exec();
            if (budget) {
                const newTotalSpent = Number(budget.spent) + Number(transaction.amount); // Ensure both are numbers
                let overageAmount = 0;
                // Check if budget will be exceeded
                if (newTotalSpent > budget.amount) {
                    overageAmount = newTotalSpent - budget.amount; // Calculate the amount of overage
                    console.log(`Budget exceeded by ${overageAmount}`);
                    // Update overage if user chooses to ignore
                    if (userAction === 'ignore') {
                        budget.overage = overageAmount;
                        budget.spent = newTotalSpent;
                        yield budget.save();
                        console.log('Overage recorded and budget updated.');
                    }
                    else if (userAction === 'increase-budget') {
                        budget.amount = budget.amount + overageAmount;
                        budget.spent = newTotalSpent;
                        yield budget.save();
                        console.log('Budget increased and updated.');
                    }
                    return 'overage';
                }
                else {
                    // Normal case: Budget not exceeded
                    budget.spent = newTotalSpent;
                    yield budget.save();
                    console.log('Budget updated without exceeding.');
                }
                yield budget.save(); // Save the notificationsSent map
            }
            else {
                console.log('No valid budget found for this expense.');
            }
        }
        // Create the transaction after budget handling
        const transactionId = yield (0, counter_service_1.getNextTransactionId)();
        const created = yield transaction_model_1.default.create({
            transactionId: transactionId,
            amount: transaction.amount,
            title: transaction.title,
            description: transaction.description,
            date: transaction.date,
            userId: transaction.userId,
            categoryId: transaction.categoryId,
            transactionType: transaction.transactionType,
        });
        return created ? 'success' : 'error';
    }
    catch (error) {
        console.error(error);
        return 'error';
    }
});
exports.createTransactionRepository = createTransactionRepository;
const getAllTransactionsOfOneUserRepository = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, filters = {}) {
    try {
        const query = { userId };
        if (filters.startDate || filters.endDate) {
            query.date = {};
            if (filters.startDate) {
                query.date.$gte = filters.startDate;
            }
            if (filters.endDate) {
                query.date.$lte = filters.endDate;
            }
        }
        if (filters.type) {
            query.transactionType = filters.type;
        }
        const transactions = yield transaction_model_1.default.find(query).sort({ date: -1, createdAt: -1 }).exec();
        const result = yield Promise.all(transactions.map((transaction) => __awaiter(void 0, void 0, void 0, function* () {
            const category = yield category_model_1.default.findOne({ categoryId: transaction.categoryId }).exec();
            return {
                transactionId: transaction.transactionId,
                amount: transaction.amount,
                title: transaction.title,
                description: transaction.description,
                date: transaction.date,
                // userId: transaction.userId,
                category: category ? {
                    categoryId: category.categoryId,
                    name: category.name,
                    description: category.description
                } : null,
                transactionType: transaction.transactionType,
            };
        })));
        return result;
    }
    catch (error) {
        console.error(error);
        return [];
    }
});
exports.getAllTransactionsOfOneUserRepository = getAllTransactionsOfOneUserRepository;
const getUserTransactionSummaryRepository = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield transaction_model_1.default.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: {
                            $cond: [{ $eq: ["$transactionType", "income"] }, "$amount", 0]
                        }
                    },
                    totalExpense: {
                        $sum: {
                            $cond: [{ $eq: ["$transactionType", "expense"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    income: "$totalIncome",
                    expense: "$totalExpense",
                    balance: { $subtract: ["$totalIncome", "$totalExpense"] }
                }
            }
        ]);
        if (result.length > 0) {
            const summary = result[0];
            return summary;
        }
        else {
            return { income: 0, expense: 0, balance: 0 };
        }
    }
    catch (error) {
        return { income: 0, expense: 0, balance: 0 };
    }
});
exports.getUserTransactionSummaryRepository = getUserTransactionSummaryRepository;
const deleteTransactionRepository = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield transaction_model_1.default.deleteOne({ transactionId });
        return deleted.deletedCount === 1;
    }
    catch (error) {
        return false;
    }
});
exports.deleteTransactionRepository = deleteTransactionRepository;
const updateTransactionRepository = (transactionId, updatedTransaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Updating transaction with ID: ${transactionId}`); // Log the transactionId
        // Update the transaction by its custom transactionId field
        const result = yield transaction_model_1.default.updateOne({ transactionId: transactionId }, // Query by transactionId field
        { $set: updatedTransaction } // Use $set to update specific fields
        );
        console.log(result); // Logs the result object, helpful for debugging
        // Check if the document was modified
        return result.modifiedCount > 0; // Returns true if at least one document was modified
    }
    catch (error) {
        console.error('Error updating transaction:', error); // Logs the error message
        return false;
    }
});
exports.updateTransactionRepository = updateTransactionRepository;
