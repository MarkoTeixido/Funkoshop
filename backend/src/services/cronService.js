const OrderRepository = require('../repositories/orderRepository');

class CronService {
    constructor() {
        // 1 minute interval for checking
        this.checkInterval = 60 * 1000;
    }

    start() {
        console.log('[CronService] Service started.');

        // Execute immediately on start
        this.runTasks();

        // Schedule periodic execution
        setInterval(() => this.runTasks(), this.checkInterval);
    }

    async runTasks() {
        try {
            // Task 1: Cancel pending orders older than 24 hours
            // Using 24 * 60 * 60 * 1000 ms
            // For demo purposes, the repository will handle the time logic
            const cancelledCount = await OrderRepository.cancelExpiredOrders();
            if (cancelledCount > 0) {
                console.log(`[CronService] Cancelled ${cancelledCount} expired orders.`);
            }

            // Task 2: Complete shipped orders older than 1 hour
            const completedCount = await OrderRepository.completeShippedOrders();
            if (completedCount > 0) {
                console.log(`[CronService] Completed ${completedCount} shipped orders.`);
            }

            // Task 3: Move Paid orders to Processing older than 1 hour
            const processingCount = await OrderRepository.processPaidOrders();
            if (processingCount > 0) {
                console.log(`[CronService] Processed ${processingCount} paid orders.`);
            }
            // Task 4: Clean up Cancelled Orders > 24h
            const deletedCount = await OrderRepository.deleteExpiredCancelledOrders();
            if (deletedCount > 0) {
                console.log(`[CronService] Deleted ${deletedCount} expired cancelled orders.`);
            }

        } catch (error) {
            console.error('[CronService] Error running tasks:', error);
        }
    }
}

module.exports = new CronService();
