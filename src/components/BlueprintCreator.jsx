import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FIELD_TYPES } from '../utils/constants';

const BlueprintCreator = ({ onClose }) => {
    const { addBlueprint } = useApp();
    const [blueprintName, setBlueprintName] = useState('');
    const [fields, setFields] = useState([]);
    const [currentField, setCurrentField] = useState({
        label: '',
        type: FIELD_TYPES.TEXT,
        position: { x: 50, y: 50 }
    });

    // add field to blueprint
    const handleAddField = () => {
        if (!currentField.label) {
            alert('please enter field label');
            return;
        }

        const newField = {
            ...currentField,
            id: Date.now().toString()
        };

        setFields([...fields, newField]);
        setCurrentField({
            label: '',
            type: FIELD_TYPES.TEXT,
            position: { x: 50, y: 50 }
        });
    };

    // remove field from blueprint
    const handleRemoveField = (fieldId) => {
        setFields(fields.filter(f => f.id !== fieldId));
    };

    // save blueprint
    const handleSave = async () => {
        if (!blueprintName) {
            alert('please enter blueprint name');
            return;
        }

        if (fields.length === 0) {
            alert('please add at least one field');
            return;
        }

        try {
            // Remove temporary IDs before sending to backend
            const fieldsToSave = fields.map(({ id, ...field }) => field);
            await addBlueprint({
                name: blueprintName,
                fields: fieldsToSave
            });
            onClose();
        } catch (error) {
            alert('Failed to create blueprint: ' + error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Create New Blueprint</h2>

                <div className="form-group">
                    <label>Blueprint Name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={blueprintName}
                        onChange={(e) => setBlueprintName(e.target.value)}
                        placeholder="Enter blueprint name"
                    />
                </div>

                <div className="form-group">
                    <label>Add Field</label>
                    <input
                        type="text"
                        className="form-input"
                        value={currentField.label}
                        onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
                        placeholder="Field label"
                    />
                </div>

                <div className="form-group">
                    <label>Field Type</label>
                    <select
                        className="form-select"
                        value={currentField.type}
                        onChange={(e) => setCurrentField({ ...currentField, type: e.target.value })}
                    >
                        <option value={FIELD_TYPES.TEXT}>text</option>
                        <option value={FIELD_TYPES.DATE}>date</option>
                        <option value={FIELD_TYPES.SIGNATURE}>signature</option>
                        <option value={FIELD_TYPES.CHECKBOX}>checkbox</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Position (X, Y)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="number"
                            className="form-input"
                            value={currentField.position.x}
                            onChange={(e) => setCurrentField({ ...currentField, position: { ...currentField.position, x: parseInt(e.target.value) } })}
                            placeholder="X position"
                        />
                        <input
                            type="number"
                            className="form-input"
                            value={currentField.position.y}
                            onChange={(e) => setCurrentField({ ...currentField, position: { ...currentField.position, y: parseInt(e.target.value) } })}
                            placeholder="Y position"
                        />
                    </div>
                </div>

                <button className="btn btn-secondary" onClick={handleAddField}>
                    Add Field
                </button>

                {/* field preview */}
                {fields.length > 0 && (
                    <div className="field-builder">
                        {fields.map(field => (
                            <div key={field.id} className="field-item">
                                <h4>{field.label}</h4>
                                <p>type: {field.type}</p>
                                <p>position: ({field.position.x}, {field.position.y})</p>
                                <button
                                    className="btn btn-danger btn-small"
                                    onClick={() => handleRemoveField(field.id)}
                                    style={{ marginTop: '8px' }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Blueprint
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlueprintCreator;
