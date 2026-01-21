import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getNextStates } from '../utils/constants';
import ContractEditor from './ContractEditor';
import LifecycleTimeline from './LifecycleTimeline';

const ContractDashboard = () => {
    const { contracts, changeContractState } = useApp();
    const [filter, setFilter] = useState('all');
    const [selectedContract, setSelectedContract] = useState(null);
    const [editingContract, setEditingContract] = useState(null);

    // filter contracts based on status
    const getFilteredContracts = () => {
        if (filter === 'all') return contracts;

        if (filter === 'active') {
            return contracts.filter(c =>
                c.state === 'created' || c.state === 'approved'
            );
        }

        if (filter === 'pending') {
            return contracts.filter(c => c.state === 'sent');
        }

        if (filter === 'signed') {
            return contracts.filter(c =>
                c.state === 'signed' || c.state === 'locked'
            );
        }

        return contracts;
    };

    // handle state change
    const handleStateChange = (contractId, newState) => {
        changeContractState(contractId, newState);
    };

    const filteredContracts = getFilteredContracts();

    return (
        <div className="container">
            <h2 style={{ marginBottom: '20px', textTransform: 'lowercase' }}>
                contract dashboard
            </h2>

            {/* filters */}
            <div className="filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    all contracts
                </button>
                <button
                    className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                >
                    active
                </button>
                <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    pending
                </button>
                <button
                    className={`filter-btn ${filter === 'signed' ? 'active' : ''}`}
                    onClick={() => setFilter('signed')}
                >
                    signed
                </button>
            </div>

            {/* contracts table */}
            {filteredContracts.length === 0 ? (
                <div className="empty-state">
                    <h3>no contracts found</h3>
                    <p>create a new contract to get started</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>contract name</th>
                                <th>blueprint</th>
                                <th>status</th>
                                <th>created date</th>
                                <th>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContracts.map(contract => (
                                <tr key={contract.id}>
                                    <td>{contract.name}</td>
                                    <td>{contract.blueprintName}</td>
                                    <td>
                                        <span className={`status-badge status-${contract.state}`}>
                                            {contract.state}
                                        </span>
                                    </td>
                                    <td>{new Date(contract.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="btn btn-secondary btn-small"
                                                onClick={() => setSelectedContract(contract)}
                                            >
                                                view
                                            </button>
                                            <button
                                                className="btn btn-primary btn-small"
                                                onClick={() => setEditingContract(contract)}
                                            >
                                                edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* contract detail modal */}
            {selectedContract && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{selectedContract.name}</h2>

                        <div className="card">
                            <p><strong>blueprint:</strong> {selectedContract.blueprintName}</p>
                            <p><strong>created:</strong> {new Date(selectedContract.createdAt).toLocaleDateString()}</p>
                            <p><strong>current status:</strong> <span className={`status-badge status-${selectedContract.state}`}>{selectedContract.state}</span></p>
                        </div>

                        <LifecycleTimeline currentState={selectedContract.state} />

                        {/* state transition buttons */}
                        <div style={{ marginTop: '20px' }}>
                            <h3 style={{ marginBottom: '10px', textTransform: 'lowercase' }}>
                                change status
                            </h3>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {getNextStates(selectedContract.state).map(state => (
                                    <button
                                        key={state}
                                        className={`btn ${state === 'revoked' ? 'btn-danger' : 'btn-success'} btn-small`}
                                        onClick={() => {
                                            handleStateChange(selectedContract.id, state);
                                            setSelectedContract({ ...selectedContract, state });
                                        }}
                                    >
                                        mark as {state}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setSelectedContract(null)}>
                                close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* contract editor modal */}
            {editingContract && (
                <ContractEditor
                    contract={editingContract}
                    onClose={() => setEditingContract(null)}
                />
            )}
        </div>
    );
};

export default ContractDashboard;
