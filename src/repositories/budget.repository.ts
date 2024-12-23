import { BudgetInterface } from "../database/interfaces/budget.interface";
import BudgetModel from "../database/models/budget.model";
import CategoryModel from "../database/models/category.model";
import { getNextBudgetId } from "../database/models/helpers/counter.service";
import TransactionModel from "../database/models/transaction.model";

export const createBudgetRepository = async (budget: BudgetInterface): Promise<string> => {
    try {

        const isAlreadyExists = await BudgetModel.findOne({ userId: budget.userId, category: budget.category });
        if (isAlreadyExists) {
            return 'exists';
        } else {
            const budgetId = await getNextBudgetId();

            const created = await BudgetModel.create(
                {
                    budgetId: budgetId,
                    userId: budget.userId,
                    amount: budget.amount,
                    spent: 0,
                    category: budget.category,
                    startDate: budget.startDate,
                    endDate: budget.endDate
                }
            );
            return created ? 'success' : 'error';
        }

    } catch (error) {
        console.error(error);
        return 'error';
    }
};

export const getBudgetsListRepository = async (userId: Number): Promise<any[]> => {
    try {

        const budgets = await BudgetModel.find({ userId }).sort({ createdAt: -1 }).exec();
        const results = await Promise.all(budgets.map(async (budget) => {
            const category = await CategoryModel.findOne({ categoryId: budget.category }).exec();

            return {
                budgetId: budget.budgetId,
                amount: budget.amount,
                spent: budget.spent,
                remaining: budget.amount - budget.spent,
                overage: budget.overage,
                percentageSpent: (budget.spent / budget.amount) * 100,
                category: category ? {
                    categoryId: category.categoryId,
                    name: category.name,
                    description: category.description
                } : null,
                startDate: budget.startDate,
                endDate: budget.endDate
            }
        }));

        return results;

    } catch (error) {
        return [];
    }
};

export const updateBudgetRepository = async (userId: number, budgetId: string, budget: BudgetInterface): Promise<string> => {
    try {
        const updated = await BudgetModel.updateOne({ budgetId: budgetId, userId: userId }, budget).exec();
        return updated ? 'success' : 'error';
    } catch (error) {
        console.error(error);
        return 'error';
    }
};

export const deleteBudgetRepository = async (budgetId: string): Promise<string> => {
    try {
        const deleted = await BudgetModel.deleteOne({ budgetId }).exec();
        return deleted ? 'success' : 'error';
    } catch (error) {
        console.error(error);
        return 'error';
    }
};

// export const checkNotificationsController = async (budgetId: string): Promise<void> => {
//     const budget = await BudgetModel.findOne({ budgetId });
//     if (!budget) {
//         throw new Error('Budget not found');
//     }
//     console.log(`Checking notifications for budget ${budgetId}`);
//     const percentageSpent = (budget.spent / budget.amount) * 100;
//     const thresholds = [50, 75, 100];

//     thresholds.forEach(async (threshold) => {
//         if (percentageSpent >= threshold && !budget.notificationsSent.get(threshold.toString())) {
//             console.log(`Send notification for ${threshold}%`);
//             budget.notificationsSent.set(threshold.toString(), true);
//         }
//     });
// };

