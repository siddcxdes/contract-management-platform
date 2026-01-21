import mongoose from 'mongoose';

// Contract states
const CONTRACT_STATES = {
    CREATED: 'created',
    APPROVED: 'approved',
    SENT: 'sent',
    SIGNED: 'signed',
    LOCKED: 'locked',
    REVOKED: 'revoked'
};

// Valid state transitions
const STATE_TRANSITIONS = {
    [CONTRACT_STATES.CREATED]: [CONTRACT_STATES.APPROVED, CONTRACT_STATES.REVOKED],
    [CONTRACT_STATES.APPROVED]: [CONTRACT_STATES.SENT, CONTRACT_STATES.REVOKED],
    [CONTRACT_STATES.SENT]: [CONTRACT_STATES.SIGNED, CONTRACT_STATES.REVOKED],
    [CONTRACT_STATES.SIGNED]: [CONTRACT_STATES.LOCKED],
    [CONTRACT_STATES.LOCKED]: [],
    [CONTRACT_STATES.REVOKED]: []
};

const contractFieldSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['text', 'date', 'signature', 'checkbox']
    },
    label: {
        type: String,
        required: true
    },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        default: ''
    }
}, { _id: false });

const contractSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    blueprintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blueprint',
        required: true
    },
    blueprintName: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        enum: Object.values(CONTRACT_STATES),
        default: CONTRACT_STATES.CREATED
    },
    fields: {
        type: [contractFieldSchema],
        required: true
    }
}, {
    timestamps: true
});

// Method to check if state transition is valid
contractSchema.methods.canTransitionTo = function (newState) {
    const allowedTransitions = STATE_TRANSITIONS[this.state] || [];
    return allowedTransitions.includes(newState);
};

// Method to check if contract is editable
contractSchema.methods.isEditable = function () {
    return this.state !== CONTRACT_STATES.LOCKED && this.state !== CONTRACT_STATES.REVOKED;
};

const Contract = mongoose.model('Contract', contractSchema);

export { Contract, CONTRACT_STATES, STATE_TRANSITIONS };
