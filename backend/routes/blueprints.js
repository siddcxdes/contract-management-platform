import express from 'express';
import Blueprint from '../models/Blueprint.js';
import { blueprintValidation, idValidation } from '../middleware/validators.js';

const router = express.Router();

// GET /api/blueprints - Get all blueprints
router.get('/', async (req, res, next) => {
    try {
        const blueprints = await Blueprint.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: blueprints
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/blueprints/:id - Get single blueprint
router.get('/:id', idValidation, async (req, res, next) => {
    try {
        const blueprint = await Blueprint.findById(req.params.id);

        if (!blueprint) {
            return res.status(404).json({
                success: false,
                message: 'Blueprint not found'
            });
        }

        res.json({
            success: true,
            data: blueprint
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/blueprints - Create new blueprint
router.post('/', blueprintValidation, async (req, res, next) => {
    try {
        const blueprint = new Blueprint({
            name: req.body.name,
            fields: req.body.fields
        });

        await blueprint.save();

        res.status(201).json({
            success: true,
            message: 'Blueprint created successfully',
            data: blueprint
        });
    } catch (error) {
        next(error);
    }
});

// PUT /api/blueprints/:id - Update blueprint
router.put('/:id', idValidation, blueprintValidation, async (req, res, next) => {
    try {
        const blueprint = await Blueprint.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                fields: req.body.fields
            },
            { new: true, runValidators: true }
        );

        if (!blueprint) {
            return res.status(404).json({
                success: false,
                message: 'Blueprint not found'
            });
        }

        res.json({
            success: true,
            message: 'Blueprint updated successfully',
            data: blueprint
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/blueprints/:id - Delete blueprint
router.delete('/:id', idValidation, async (req, res, next) => {
    try {
        const blueprint = await Blueprint.findByIdAndDelete(req.params.id);

        if (!blueprint) {
            return res.status(404).json({
                success: false,
                message: 'Blueprint not found'
            });
        }

        res.json({
            success: true,
            message: 'Blueprint deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

export default router;
