const orderRepository = require('../repositories/orderRepository');
const { product: Product } = require('../models/model_product');
const { sequelize } = require('../config/conn');

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
    }

    async getAllOrders() {
        return await orderRepository.findAll();
    }

    async getUserOrders(userId) {
        return await orderRepository.findAllByUserId(userId);
    }

    async updateStatus(orderId, status) {
        // Admin Force Update
        return await orderRepository.updateStatus(orderId, status);
    }

    async deleteOrder(orderId) {
        return await orderRepository.delete(orderId);
    }

    async cancelUserOrder(orderId, userId) {
        const order = await orderRepository.findById(orderId);

        if (!order) throw new Error('Pedido no encontrado');
        if (order.user_id !== userId) throw new Error('No autorizado');

        const nonCancellableStatuses = ['shipped', 'delivered', 'completed', 'cancelled'];
        if (nonCancellableStatuses.includes(order.status)) {
            throw new Error('No se puede cancelar el pedido en este estado');
        }

        // Use repository logic ideally, but since we need transaction wrapping here similar to cron...
        // Actually, let's reuse a logic similar to repository or just do it here. 
        // Best practice: The Service orchestrates, the Repo does DB checks.
        // But stock restoration logic is in Repo's cron method.
        // Let's implement a single cancel method in Repo that takes an Order instance or ID?
        // Or just do it here manually for now to save time/complexity.

        const transaction = await sequelize.transaction();
        try {
            // Restore Stock
            if (order.OrderItems) {
                for (const item of order.OrderItems) {
                    await Product.increment('stock', {
                        by: item.quantity,
                        where: { product_id: item.product_id },
                        transaction
                    });
                }
            }

            await order.update({ status: 'cancelled' }, { transaction });
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new OrderService();
