const express = require('express');
const router = express.Router();
const { DailyPrice, Room } = require('../models');

// GET /api/daily-prices?lodgeId=&month=YYYY-MM
// Returns all price overrides for a lodge in a given month
router.get('/', async (req, res) => {
    try {
        const { lodgeId, month } = req.query;
        if (!lodgeId || !month) {
            return res.status(400).json({ message: 'lodgeId and month are required' });
        }
        // month format: YYYY-MM — match all dates starting with this prefix
        const prices = await DailyPrice.find({
            lodgeId,
            date: { $regex: `^${month}` }
        });
        res.json(prices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/daily-prices — upsert a price override
// Body: { lodgeId, date, roomType, price }
router.post('/', async (req, res) => {
    try {
        const { lodgeId, date, roomType, price } = req.body;
        if (!lodgeId || !date || !roomType || price === undefined) {
            return res.status(400).json({ message: 'lodgeId, date, roomType, and price are required' });
        }
        const doc = await DailyPrice.findOneAndUpdate(
            { lodgeId, date, roomType },
            { price },
            { upsert: true, new: true }
        );
        res.json(doc);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/daily-prices/:id — remove a price override
router.delete('/:id', async (req, res) => {
    try {
        await DailyPrice.findByIdAndDelete(req.params.id);
        res.json({ message: 'Price override removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
