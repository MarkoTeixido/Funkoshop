const orderRepository = require('../repositories/orderRepository');

class OrderService {
    async getOrdersForReport(period) {
        let dateFilter = new Date();

        switch (period) {
            case 'day':
                dateFilter.setDate(dateFilter.getDate() - 1);
                break;
            case 'week':
                dateFilter.setDate(dateFilter.getDate() - 7);
                break;
            case 'month':
                dateFilter.setMonth(dateFilter.getMonth() - 1);
                break;
            case 'year':
                dateFilter.setFullYear(dateFilter.getFullYear() - 1);
                break;
            default:
                dateFilter = new Date(0); // All time
        }

        return await orderRepository.findAllByDate(dateFilter);
        return await orderRepository.findAllByDate(dateFilter);
    }

    async getAllOrders() {
        return await orderRepository.findAll();
    }

    async getUserOrders(userId) {
        // Auto-complete orders older than 24h
        await orderRepository.updatePendingToCompleted(userId);
        return await orderRepository.findAllByUserId(userId);
    }
}

module.exports = new OrderService();
