// contract lifecycle states and transitions
// this defines the valid states and what transitions are allowed

export const CONTRACT_STATES = {
    CREATED: 'created',
    APPROVED: 'approved',
    SENT: 'sent',
    SIGNED: 'signed',
    LOCKED: 'locked',
    REVOKED: 'revoked'
};

// define which state can transition to which other states
export const STATE_TRANSITIONS = {
    [CONTRACT_STATES.CREATED]: [CONTRACT_STATES.APPROVED, CONTRACT_STATES.REVOKED],
    [CONTRACT_STATES.APPROVED]: [CONTRACT_STATES.SENT, CONTRACT_STATES.REVOKED],
    [CONTRACT_STATES.SENT]: [CONTRACT_STATES.SIGNED, CONTRACT_STATES.REVOKED],
    [CONTRACT_STATES.SIGNED]: [CONTRACT_STATES.LOCKED],
    [CONTRACT_STATES.LOCKED]: [],
    [CONTRACT_STATES.REVOKED]: []
};

// check if a state transition is valid
export const canTransition = (currentState, newState) => {
    const allowedTransitions = STATE_TRANSITIONS[currentState] || [];
    return allowedTransitions.includes(newState);
};

// get next possible states for current state
export const getNextStates = (currentState) => {
    return STATE_TRANSITIONS[currentState] || [];
};

// field types available for blueprints
export const FIELD_TYPES = {
    TEXT: 'text',
    DATE: 'date',
    SIGNATURE: 'signature',
    CHECKBOX: 'checkbox'
};
