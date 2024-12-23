"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const budget_controller_1 = require("../controllers/budget.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const notification_service_1 = require("../services/notification.service");
const budgetRoute = (0, express_1.Router)();
budgetRoute.post('/create', auth_middleware_1.authenticateToken, budget_controller_1.createBudgetController);
budgetRoute.get('/all', auth_middleware_1.authenticateToken, budget_controller_1.getAllBudgetsOfOneUserController);
budgetRoute.put('/update/:budgetId', auth_middleware_1.authenticateToken, budget_controller_1.updateBudgetController);
budgetRoute.delete('/delete/:budgetId', auth_middleware_1.authenticateToken, budget_controller_1.deleteBudgetController);
budgetRoute.post('/notification/send', (req, res) => {
    (0, notification_service_1.sendNotification)("fetBgAF_QoCkXk7CpyYjwe:APA91bFyOXKKPhRl4ISPj5CiQIRu6bjY6uzwfTW9LeIDs0XBvqB1ll7U98x5l04bg0ND7t2LQgWy5A-F7u0u0VMLEwCO2GKp0UEMuQPxdaqgVqQyQvXsLrM", "Test", "This is a test notification", { test: "test" })
        .then(() => res.send("Notification sent successfully"))
        .catch((error) => res.status(500).send(error));
});
exports.default = budgetRoute;
