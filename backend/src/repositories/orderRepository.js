const Order = require('../models/model_order');
const User = require('../models/model_user');
const { sequelize } = require('../config/conn');

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
                created_at: { [sequelize.Sequelize.Op.gte]: dateFilter }
            },
            include: [{ model: User, attributes: ['name', 'email'] }]
        });
    }

    async findAll() {
        return await Order.findAll({
            order: [['created_at', 'DESC']],
            include: [
                { model: User, attributes: ['name', 'email', 'lastname'] }
            ]
        });
    }

    async create(orderData, transaction) {
        return await Order.create(orderData, { transaction });
    }

    async createItem(itemData, transaction) {
        const OrderItem = require('../models/model_order_item');
        return await OrderItem.create(itemData, { transaction });
    }

    async findAllByUserId(userId) {
        const OrderItem = require('../models/model_order_item');
        return await Order.findAll({
            where: { user_id: userId },
            include: [{ model: OrderItem }],
            order: [['created_at', 'DESC']]
        });
    }

    async updatePendingToCompleted(userId) {
        const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        return await Order.update(
            { status: 'completed' },
            {
                where: {
                    user_id: userId,
                    status: 'pending',
                    created_at: {
                        [sequelize.Sequelize.Op.lte]: cutoffDate
                    }
                }
            }
        );
    }
}

module.exports = new OrderRepository();
