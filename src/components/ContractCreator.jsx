import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ContractCreator = ({ onClose }) => {
    const { blueprints, addContract } = useApp();
    const [selectedBlueprint, setSelectedBlueprint] = useState('');
    const [contractName, setContractName] = useState('');

    // create contract from selected blueprint
    const handleCreate = () => {
        if (!contractName) {
            alert('please enter contract name');
            return;
        }

        if (!selectedBlueprint) {
            alert('please select a blueprint');
            return;
        }

        addContract(selectedBlueprint, contractName);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>create new contract</h2>

                <div className="form-group">
                    <label>contract name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={contractName}
                        onChange={(e) => setContractName(e.target.value)}
                        placeholder="enter contract name"
                    />
                </div>

                <div className="form-group">
                    <label>select blueprint</label>
                    <select
                        className="form-select"
                        value={selectedBlueprint}
                        onChange={(e) => setSelectedBlueprint(e.target.value)}
                    >
                        <option value="">choose a blueprint</option>
                        {blueprints.map(blueprint => (
                            <option key={blueprint.id} value={blueprint.id}>
                                {blueprint.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedBlueprint && (
                    <div className="card">
                        <h3 style={{ marginBottom: '10px', textTransform: 'lowercase' }}>
                            blueprint preview
                        </h3>
                        {blueprints.find(b => b.id === selectedBlueprint)?.fields.map(field => (
                            <p key={field.id} style={{ fontSize: '14px', marginBottom: '5px' }}>
                                • {field.label} ({field.type})
                            </p>
                        ))}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        create contract
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContractCreator;
