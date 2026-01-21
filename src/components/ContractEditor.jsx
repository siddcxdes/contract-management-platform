import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FIELD_TYPES } from '../utils/constants';

const ContractEditor = ({ contract, onClose }) => {
    const { updateContractFields } = useApp();
    const [fields, setFields] = useState(contract.fields);

    // update field value
    const handleFieldChange = (fieldId, value) => {
        setFields(fields.map(field => {
            if (field.id === fieldId) {
                return { ...field, value };
            }
            return field;
        }));
    };

    // save changes
    const handleSave = () => {
        updateContractFields(contract.id, fields);
        onClose();
    };

    // check if contract is locked or revoked
    const isReadOnly = contract.state === 'locked' || contract.state === 'revoked';

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>edit contract: {contract.name}</h2>

                {isReadOnly && (
                    <div style={{
                        padding: '10px',
                        background: '#fed7d7',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        color: '#742a2a'
                    }}>
                        this contract is {contract.state} and cannot be edited
                    </div>
                )}

                <div className="blueprint-canvas">
                    {fields.map(field => (
                        <div
                            key={field.id}
                            className="placed-field"
                            style={{
                                left: `${field.x}px`,
                                top: `${field.y}px`
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
                                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="enter text"
                                />
                            )}

                            {field.type === FIELD_TYPES.DATE && (
                                <input
                                    type="date"
                                    className="form-input"
                                    value={field.value || ''}
                                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                    disabled={isReadOnly}
                                />
                            )}

                            {field.type === FIELD_TYPES.SIGNATURE && (
                                <input
                                    type="text"
                                    className="form-input"
                                    value={field.value || ''}
                                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                    disabled={isReadOnly}
                                    placeholder="signature"
                                    style={{ fontStyle: 'italic' }}
                                />
                            )}

                            {field.type === FIELD_TYPES.CHECKBOX && (
                                <input
                                    type="checkbox"
                                    checked={field.value === 'true'}
                                    onChange={(e) => handleFieldChange(field.id, e.target.checked.toString())}
                                    disabled={isReadOnly}
                                    style={{ width: '20px', height: '20px' }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        close
                    </button>
                    {!isReadOnly && (
                        <button className="btn btn-primary" onClick={handleSave}>
                            save changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContractEditor;
