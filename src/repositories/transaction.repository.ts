import { TransactionInterface } from "../database/interfaces/transaction.interface";
import BudgetModel from "../database/models/budget.model";
import CategoryModel from "../database/models/category.model";
import { getNextTransactionId } from "../database/models/helpers/counter.service";
import TransactionModel from "../database/models/transaction.model";


export const createTransactionRepository = async (
    transaction: TransactionInterface,
    userAction: 'increase-budget' | 'ignore'
): Promise<string> => {
    try {
        // Check if the transaction is an expense
        if (transaction.transactionType === 'expense') {
            const budget = await BudgetModel.findOne({
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
                        await budget.save();
                        console.log('Overage recorded and budget updated.');
                    } else if (userAction === 'increase-budget') {
                        budget.amount = budget.amount + overageAmount;
                        budget.spent = newTotalSpent;
                        await budget.save();
                        console.log('Budget increased and updated.');
                    }
                    return 'overage';
                } else {
                    // Normal case: Budget not exceeded
                    budget.spent = newTotalSpent;
                    await budget.save();
                    console.log('Budget updated without exceeding.');
                }

                await budget.save(); // Save the notificationsSent map
            } else {
                console.log('No valid budget found for this expense.');
            }
        }

        // Create the transaction after budget handling
        const transactionId = await getNextTransactionId();
        const created = await TransactionModel.create({
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
    } catch (error) {
        console.error(error);
        return 'error';
    }
};


export const getAllTransactionsOfOneUserRepository = async (
    userId: number,
    filters: FilterOptions = {}
): Promise<any[]> => {
    try {
        const query: any = { userId };
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

        const transactions = await TransactionModel.find(query).sort({ date: -1, createdAt: -1 }).exec();

        const result = await Promise.all(transactions.map(async (transaction) => {
            const category = await CategoryModel.findOne({ categoryId: transaction.categoryId }).exec();
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
        }));

        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getUserTransactionSummaryRepository = async (userId: string): Promise<{ income: number, expense: number, balance: number }> => {
    try {
        const result = await TransactionModel.aggregate([
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
        } else {
            return { income: 0, expense: 0, balance: 0 };
        }
    } catch (error) {
        return { income: 0, expense: 0, balance: 0 };
    }
};

export const deleteTransactionRepository = async (transactionId: string): Promise<boolean> => {
    try {
        const deleted = await TransactionModel.deleteOne({ transactionId });
        return deleted.deletedCount === 1;
    } catch (error) {
        return false;
    }
}

export const updateTransactionRepository = async (
    transactionId: string,
    updatedTransaction: TransactionInterface
): Promise<boolean> => {
    try {
        console.log(`Updating transaction with ID: ${transactionId}`); // Log the transactionId

        // Update the transaction by its custom transactionId field
        const result = await TransactionModel.updateOne(
            { transactionId: transactionId },  // Query by transactionId field
            { $set: updatedTransaction }        // Use $set to update specific fields
        );

        console.log(result); // Logs the result object, helpful for debugging

        // Check if the document was modified
        return result.modifiedCount > 0;  // Returns true if at least one document was modified
    } catch (error) {
        console.error('Error updating transaction:', error); // Logs the error message
        return false;
    }
};



interface FilterOptions {
    startDate?: Date;
    endDate?: Date;
    type?: 'income' | 'expense' | 'all';
}