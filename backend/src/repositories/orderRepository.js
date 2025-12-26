const Order = require('../models/model_order');
const OrderItem = require('../models/model_order_item');
const { product: Product } = require('../models/model_product');
const User = require('../models/model_user');
const { sequelize } = require('../config/conn');
const { Op } = require('sequelize');

class OrderRepository {
    async countByStatus(status) {
        return await Order.count({
            where: { status }
        });
    }

    async findRecent(limit = 5) {
        return await Order.findAll({
            limit,
            order: [['created_at', 'DESC']],
            include: [{ model: User, attributes: ['name', 'lastname'] }]
        });
    }

    async findAllByDate(dateFilter) {
        return await Order.findAll({
            where: {
                created_at: { [Op.gte]: dateFilter }
            },
            include: [{ model: User, attributes: ['name', 'email'] }]
        });
    }

    async findAll() {
        return await Order.findAll({
            order: [['created_at', 'DESC']],
            include: [
                { model: User, attributes: ['name', 'email', 'lastname'] },
                { model: OrderItem }
            ]
        });
    }

    async create(orderData, transaction) {
        return await Order.create(orderData, { transaction });
    }

    async createItem(itemData, transaction) {
        return await OrderItem.create(itemData, { transaction });
    }

    async findAllByUserId(userId) {
        return await Order.findAll({
            where: { user_id: userId },
            include: [{ model: OrderItem }],
            order: [['created_at', 'DESC']]
        });
    }

    async findById(orderId) {
        return await Order.findByPk(orderId, {
            include: [
                { model: OrderItem },
                { model: User, attributes: ['name', 'lastname', 'email'] }
            ]
        });
    }

    async updateStatus(orderId, status) {
        return await Order.update({ status }, {
            where: { order_id: orderId }
        });
    }

    // Cron Task: Cancel Pending Orders > 24h
    async cancelExpiredOrders() {
        const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find orders to cancel
        const ordersToCancel = await Order.findAll({
            where: {
                status: 'pending',
                created_at: { [Op.lte]: cutoffDate }
            },
            include: [{ model: OrderItem }]
        });

        if (ordersToCancel.length === 0) return 0;

        const transaction = await sequelize.transaction();
        try {
            for (const order of ordersToCancel) {
                // Restore Stock
                for (const item of order.OrderItems) {
                    await Product.increment('stock', {
                        by: item.quantity,
                        where: { product_id: item.product_id },
                        transaction
                    });
                }

                // Update Status
                await order.update({ status: 'cancelled' }, { transaction });
            }
            await transaction.commit();
            return ordersToCancel.length;
        } catch (error) {
            await transaction.rollback();
            console.error('Error cancelling expired orders:', error);
            return 0;
        }
    }

    // Cron Task: Complete Shipped Orders > 1h
    async completeShippedOrders() {
        // We assume 'updated_at' reflects the time it was moved to 'shipped'
        // This is an approximation. Ideally we'd have a 'shipped_at' field.
        const cutoffDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

        const [updatedCount] = await Order.update(
            { status: 'completed' },
            {
                where: {
                    status: 'shipped',
                    updated_at: { [Op.lte]: cutoffDate }
                }
            }
        );
        return updatedCount;
    }

    // Cron Task: Process Paid Orders > 1h
    async processPaidOrders() {
        const cutoffDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

        const [updatedCount] = await Order.update(
            { status: 'processing' },
            {
                where: {
                    status: 'paid',
                    updated_at: { [Op.lte]: cutoffDate }
                }
            }
        );
        return updatedCount;
    }


    async delete(orderId) {
        return await Order.destroy({
            where: { order_id: orderId }
        });
    }

    // Cron Task: Clean up Cancelled Orders > 24h
    async deleteExpiredCancelledOrders() {
        const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

        return await Order.destroy({
            where: {
                status: 'cancelled',
                updated_at: { [Op.lte]: cutoffDate }
            }
        });
    }

    // Check if product belongs to active orders (Rule: active = paid, processing, shipped, delivered)
    async hasActiveOrders(productId) {
        const count = await Order.count({
            where: {
                status: { [Op.or]: ['paid', 'processing', 'shipped', 'delivered'] }
            },
            include: [{
                model: OrderItem,
                where: { product_id: productId },
                required: true
            }]
        });
        return count > 0;
    }
}

module.exports = new OrderRepository();
