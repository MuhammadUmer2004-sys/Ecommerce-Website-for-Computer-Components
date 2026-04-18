const Payment = require('../models/Payment');

const updatePayment = async (req, res) => {
    try {
        const { payment_id, status, payment_note } = req.body;
        const result = await Payment.updatePaymentStatus(payment_id, status, payment_note);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getPaymentsByOrderId = async (req, res) => {
    try {
        const result = await Payment.getPaymentsByOrderId(req.query.order_id);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const getPaymentById = async (req, res) => {
    try {
        const result = await Payment.getPaymentById(req.query.payment_id);
        res.status(200).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { updatePayment, getPaymentsByOrderId, getPaymentById };
