import express from 'express';
import { Contract } from '../models/Contract.js';
import Blueprint from '../models/Blueprint.js';
import {
    contractCreationValidation,
    contractUpdateValidation,
    stateTransitionValidation,
    idValidation
} from '../middleware/validators.js';

const router = express.Router();

// GET /api/contracts - Get all contracts with optional filtering
router.get('/', async (req, res, next) => {
    try {
        const { status, filter } = req.query;
        let query = {};

        // Apply status filter
        if (status) {
            query.state = status;
        }

        // Apply grouped filters
        if (filter === 'active') {
            query.state = { $in: ['created', 'approved'] };
        } else if (filter === 'pending') {
            query.state = 'sent';
        } else if (filter === 'signed') {
            query.state = { $in: ['signed', 'locked'] };
        }

        const contracts = await Contract.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: contracts
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/contracts/:id - Get single contract
router.get('/:id', idValidation, async (req, res, next) => {
    try {
        const contract = await Contract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        res.json({
            success: true,
            data: contract
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/contracts - Create new contract from blueprint
router.post('/', contractCreationValidation, async (req, res, next) => {
    try {
        const blueprint = await Blueprint.findById(req.body.blueprintId);

        if (!blueprint) {
            return res.status(404).json({
                success: false,
                message: 'Blueprint not found'
            });
        }

        // Create contract with fields from blueprint
        const contract = new Contract({
            name: req.body.name,
            blueprintId: blueprint._id,
            blueprintName: blueprint.name,
            state: 'created',
            fields: blueprint.fields.map(field => ({
                type: field.type,
                label: field.label,
                position: field.position,
                value: ''
            }))
        });

        await contract.save();

        res.status(201).json({
            success: true,
            message: 'Contract created successfully',
            data: contract
        });
    } catch (error) {
        next(error);
    }
});

// PUT /api/contracts/:id - Update contract fields
router.put('/:id', contractUpdateValidation, async (req, res, next) => {
    try {
        const contract = await Contract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        // Check if contract is editable
        if (!contract.isEditable()) {
            return res.status(403).json({
                success: false,
                message: 'Cannot edit locked or revoked contracts'
            });
        }

        // Update fields if provided
        if (req.body.fields) {
            contract.fields = req.body.fields;
        }

        await contract.save();

        res.json({
            success: true,
            message: 'Contract updated successfully',
            data: contract
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /api/contracts/:id/state - Change contract state
router.patch('/:id/state', stateTransitionValidation, async (req, res, next) => {
    try {
        const contract = await Contract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        const { newState } = req.body;

        // Validate state transition
        if (!contract.canTransitionTo(newState)) {
            return res.status(400).json({
                success: false,
                message: `Invalid state transition from ${contract.state} to ${newState}`
            });
        }

        contract.state = newState;
        await contract.save();

        res.json({
            success: true,
            message: 'Contract state updated successfully',
            data: contract
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/contracts/:id - Delete contract
router.delete('/:id', idValidation, async (req, res, next) => {
    try {
        const contract = await Contract.findByIdAndDelete(req.params.id);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        res.json({
            success: true,
            message: 'Contract deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

export default router;
