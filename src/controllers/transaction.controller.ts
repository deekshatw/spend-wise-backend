import { Request, Response } from "express";
import { createTransactionRepository, deleteTransactionRepository, getAllTransactionsOfOneUserRepository, getUserTransactionSummaryRepository, updateTransactionRepository } from "../repositories/transaction.repository";

export const createTransactionController = async (req: Request, res: Response) => {
    const transaction = req.body.transaction;
    const userAction = req.body.userAction;
    console.log(transaction);
    try {
        const response = await createTransactionRepository(transaction, userAction);
        console.log(response);
        if (response === 'success') {
            res.status(201).json({
                "success": true,
                "message": "Transaction created successfully"
            });
        } else if (response === 'overage') {
            res.status(400).json({
                "success": false,
                "message": "Budget exceeded!"
            });

        } else {
            res.status(500).json({
                "success": false,
                "message": "Internal server error"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "success": false,
            "message": error
        });
    }
};

export const getAllTransactionsOfOneUserController = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    console.log(userId);
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
    }

    const { startDate, endDate, type } = req.query;
    const filters = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        type: type as 'income' | 'expense'
    };

    try {
        const transactions = await getAllTransactionsOfOneUserRepository(userId!, filters);
        res.status(200).json({
            "success": true,
            "data": transactions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "success": false,
            "message": error
        });
    }
};

export const getTransactionSummaryController = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
        return;
    }

    try {
        const summary = await getUserTransactionSummaryRepository(userId.toString());
        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching transaction summary'
        });
    }
};

export const deleteTransactionController = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const transactionId = req.params.transactionId;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
    }

    try {
        const response = await deleteTransactionRepository(transactionId);
        if (response) {
            res.status(200).json({
                success: true,
                message: 'Transaction deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting transaction'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting transaction'
        });
    }
};

export const updateTransactionController = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const transactionId = req.params.transactionId;
    const transaction = req.body;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID not found" });
    }

    try {
        const response = await updateTransactionRepository(transactionId, transaction);
        if (response) {
            res.status(200).json({
                success: true,
                message: 'Transaction updated successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating transaction'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

