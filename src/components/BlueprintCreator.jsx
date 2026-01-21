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
        x: 50,
        y: 50
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
            x: 50,
            y: 50
        });
    };

    // remove field from blueprint
    const handleRemoveField = (fieldId) => {
        setFields(fields.filter(f => f.id !== fieldId));
    };

    // save blueprint
    const handleSave = () => {
        if (!blueprintName) {
            alert('please enter blueprint name');
            return;
        }

        if (fields.length === 0) {
            alert('please add at least one field');
            return;
        }

        addBlueprint({
            name: blueprintName,
            fields: fields
        });

        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>create new blueprint</h2>

                <div className="form-group">
                    <label>blueprint name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={blueprintName}
                        onChange={(e) => setBlueprintName(e.target.value)}
                        placeholder="enter blueprint name"
                    />
                </div>

                <div className="form-group">
                    <label>add field</label>
                    <input
                        type="text"
                        className="form-input"
                        value={currentField.label}
                        onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
                        placeholder="field label"
                    />
                </div>

                <div className="form-group">
                    <label>field type</label>
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
                    <label>position (x, y)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="number"
                            className="form-input"
                            value={currentField.x}
                            onChange={(e) => setCurrentField({ ...currentField, x: parseInt(e.target.value) })}
                            placeholder="x position"
                        />
                        <input
                            type="number"
                            className="form-input"
                            value={currentField.y}
                            onChange={(e) => setCurrentField({ ...currentField, y: parseInt(e.target.value) })}
                            placeholder="y position"
                        />
                    </div>
                </div>

                <button className="btn btn-secondary" onClick={handleAddField}>
                    add field
                </button>

                {/* field preview */}
                {fields.length > 0 && (
                    <div className="field-builder">
                        {fields.map(field => (
                            <div key={field.id} className="field-item">
                                <h4>{field.label}</h4>
                                <p>type: {field.type}</p>
                                <p>position: ({field.x}, {field.y})</p>
                                <button
                                    className="btn btn-danger btn-small"
                                    onClick={() => handleRemoveField(field.id)}
                                    style={{ marginTop: '8px' }}
                                >
                                    remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        save blueprint
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlueprintCreator;
