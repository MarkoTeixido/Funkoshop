const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository'); // We need to check stock
const orderRepository = require('../repositories/orderRepository');
const { sequelize } = require('../config/conn');
const AppError = require('../utils/AppError');
const { HTTP_CODES } = require('../utils/constants');

class CartService {
    async getCart(userId) {
        let cart = await cartRepository.findByUserId(userId);
        if (!cart) {
            cart = await cartRepository.create(userId);
            // Re-fetch to match structure or just return empty format
            return { cart_id: cart.cart_id, items: [] }; // matching current response structure
        }
        return cart; // Returns Sequelize model with includes
    }

    async addToCart(userId, productId, quantity) {
        let cart = await cartRepository.findByUserId(userId);
        if (!cart) {
            cart = await cartRepository.create(userId);
        }

        const existingItem = await cartRepository.findItem(cart.cart_id, productId);

        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
            await existingItem.save();
        } else {
            await cartRepository.addItem({
                cart_id: cart.cart_id,
                product_id: productId,
                quantity
            });
        }
        return true;
    }

    async removeItem(userId, productId) {
        const cart = await cartRepository.findByUserId(userId);
        if (!cart) throw new AppError('Carrito no encontrado', HTTP_CODES.NOT_FOUND);

        await cartRepository.removeItem(cart.cart_id, productId);
        return true;
    }

    async updateItem(userId, productId, quantity) {
        const cart = await cartRepository.findByUserId(userId);
        if (!cart) throw new AppError('Carrito no encontrado', HTTP_CODES.NOT_FOUND);

        const item = await cartRepository.findItem(cart.cart_id, productId);
        if (!item) throw new AppError('Item no encontrado en el carrito', HTTP_CODES.NOT_FOUND);

        item.quantity = quantity;
        await item.save();
        return true;
    }

    async checkout(userId, shippingData) {
        const transaction = await sequelize.transaction();
        try {
            const cart = await cartRepository.findByUserId(userId);

            if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
                throw new AppError('El carrito está vacío', HTTP_CODES.BAD_REQUEST);
            }

            let totalAmount = 0;

            // Validate Stock & Calculate Total
            for (const item of cart.CartItems) {
                // Ensure product data is loaded (it is via include in repo)
                if (item.Product.stock < item.quantity) {
                    throw new AppError(`No hay suficiente stock para ${item.Product.product_name}`, HTTP_CODES.BAD_REQUEST);
                }
                totalAmount += parseFloat(item.Product.price) * item.quantity;
            }

            // Create Order
            const order = await orderRepository.create({
                order_number: `ORD-${Date.now()}`,
                user_id: userId,
                total_amount: totalAmount,
                final_amount: totalAmount,
                shipping_street: shippingData.street,
                shipping_city: shippingData.city,
                shipping_state: shippingData.state,
                shipping_postal_code: shippingData.zip,
                shipping_country: shippingData.country,
                shipping_phone: shippingData.phone,
                payment_method: 'credit_card',
                status: 'pending'
            }, transaction);

            // Create Order Items & Deduct Stock
            for (const item of cart.CartItems) {
                await orderRepository.createItem({
                    order_id: order.order_id,
                    product_id: item.product_id,
                    product_name: item.Product.product_name,
                    product_sku: item.Product.sku,
                    quantity: item.quantity,
                    unit_price: item.Product.price,
                    subtotal: parseFloat(item.Product.price) * item.quantity
                }, transaction);

                // Deduct stock via ProductRepo (needs transaction support)
                await productRepository.decreaseStock(item.product_id, item.quantity, transaction);
            }

            // Clear Cart
            await cartRepository.clearCart(cart.cart_id, transaction);

            await transaction.commit();
            return order.order_number;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new CartService();
