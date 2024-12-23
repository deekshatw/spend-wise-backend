import { Router } from "express";
import { createBudgetController, deleteBudgetController, getAllBudgetsOfOneUserController, updateBudgetController } from "../controllers/budget.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { sendNotification } from "../services/notification.service";

const budgetRoute = Router();

budgetRoute.post('/create', authenticateToken, createBudgetController);
budgetRoute.get('/all', authenticateToken, getAllBudgetsOfOneUserController);
budgetRoute.put('/update/:budgetId', authenticateToken, updateBudgetController);
budgetRoute.delete('/delete/:budgetId', authenticateToken, deleteBudgetController);
budgetRoute.post('/notification/send', (req, res) => {
    sendNotification("fetBgAF_QoCkXk7CpyYjwe:APA91bFyOXKKPhRl4ISPj5CiQIRu6bjY6uzwfTW9LeIDs0XBvqB1ll7U98x5l04bg0ND7t2LQgWy5A-F7u0u0VMLEwCO2GKp0UEMuQPxdaqgVqQyQvXsLrM", "Test", "This is a test notification", { test: "test" })
        .then(() => res.send("Notification sent successfully"))
        .catch((error) => res.status(500).send(error));
});


export default budgetRoute;