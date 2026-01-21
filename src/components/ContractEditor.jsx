import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FIELD_TYPES } from '../utils/constants';

const ContractEditor = ({ contract, onClose }) => {
    const { updateContractFields } = useApp();
    const [fields, setFields] = useState(contract.fields);

    // update field value - fields from MongoDB don't have individual IDs, use index
    const handleFieldChange = (index, value) => {
        setFields(fields.map((field, i) => {
            if (i === index) {
                return { ...field, value };
            }
            return field;
        }));
    };

    // save changes
    const handleSave = async () => {
        try {
            await updateContractFields(contract._id, fields);
            onClose();
        } catch (error) {
            alert('Failed to save changes: ' + error.message);
        }
    };

    // check if contract is locked or revoked
    const isReadOnly = contract.state === 'locked' || contract.state === 'revoked';

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Contract: {contract.name}</h2>

                {isReadOnly && (
                    <div style={{
                        padding: '10px',
                        background: '#fed7d7',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        color: '#742a2a'
                    }}>
                        This contract is {contract.state} and cannot be edited
                    </div>
                )}

                <div className="blueprint-canvas">
                    {fields.map((field, index) => (
                        <div
                            key={index}
                            className="placed-field"
                            style={{
                                left: `${field.position.x}px`,
                                top: `${field.position.y}px`
                            }}
                        >
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                                {field.label}
                            </label>

                            {field.type === FIELD_TYPES.TEXT && (
                                <input
                                    type="text"
                                    className="form-input"
                                    value={field.value || ''}
                                    onChange={(e) => handleFieldChange(index, e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Enter text"
                                />
                            )}

                            {field.type === FIELD_TYPES.DATE && (
                                <input
                                    type="date"
                                    className="form-input"
                                    value={field.value || ''}
                                    onChange={(e) => handleFieldChange(index, e.target.value)}
                                    disabled={isReadOnly}
                                />
                            )}

                            {field.type === FIELD_TYPES.SIGNATURE && (
                                <input
                                    type="text"
                                    className="form-input"
                                    value={field.value || ''}
                                    onChange={(e) => handleFieldChange(index, e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="Signature"
                                    style={{ fontStyle: 'italic' }}
                                />
                            )}

                            {field.type === FIELD_TYPES.CHECKBOX && (
                                <input
                                    type="checkbox"
                                    checked={field.value === 'true'}
                                    onChange={(e) => handleFieldChange(index, e.target.checked.toString())}
                                    disabled={isReadOnly}
                                    style={{ width: '20px', height: '20px' }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    {!isReadOnly && (
                        <button className="btn btn-primary" onClick={handleSave}>
                            Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContractEditor;
