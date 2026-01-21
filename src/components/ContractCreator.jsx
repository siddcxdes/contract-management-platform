import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ContractCreator = ({ onClose }) => {
    const { blueprints, addContract } = useApp();
    const [selectedBlueprint, setSelectedBlueprint] = useState('');
    const [contractName, setContractName] = useState('');

    // create contract from selected blueprint
    const handleCreate = async () => {
        if (!contractName) {
            alert('please enter contract name');
            return;
        }

        if (!selectedBlueprint) {
            alert('please select a blueprint');
            return;
        }

        try {
            await addContract(selectedBlueprint, contractName);
            onClose();
        } catch (error) {
            alert('Failed to create contract: ' + error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Create New Contract</h2>

                <div className="form-group">
                    <label>Contract Name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={contractName}
                        onChange={(e) => setContractName(e.target.value)}
                        placeholder="Enter contract name"
                    />
                </div>

                <div className="form-group">
                    <label>Select Blueprint</label>
                    <select
                        className="form-select"
                        value={selectedBlueprint}
                        onChange={(e) => setSelectedBlueprint(e.target.value)}
                    >
                        <option value="">Choose a Blueprint</option>
                        {blueprints.map(blueprint => (
                            <option key={blueprint._id} value={blueprint._id}>
                                {blueprint.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedBlueprint && (
                    <div className="card">
                        <h3 style={{ marginBottom: '10px' }}>
                            Blueprint Preview
                        </h3>
                        {blueprints.find(b => b._id === selectedBlueprint)?.fields.map((field, index) => (
                            <p key={index} style={{ fontSize: '14px', marginBottom: '5px' }}>
                                • {field.label} ({field.type})
                            </p>
                        ))}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        Create Contract
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContractCreator;
