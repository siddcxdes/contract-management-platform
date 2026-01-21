import { useApp } from '../context/AppContext';

const BlueprintList = () => {
    const { blueprints } = useApp();

    return (
        <div className="container">
            <h2 style={{ marginBottom: '20px' }}>
                Blueprints
            </h2>

            {blueprints.length === 0 ? (
                <div className="empty-state">
                    <h3>No Blueprints Yet</h3>
                    <p>Create your first blueprint to get started</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {blueprints.map(blueprint => (
                        <div key={blueprint._id} className="card">
                            <h3 style={{ marginBottom: '15px', color: '#2563eb' }}>
                                {blueprint.name}
                            </h3>

                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ fontSize: '14px' }}>
                                    Fields ({blueprint.fields.length}):
                                </strong>
                            </div>

                            <div className="field-builder">
                                {blueprint.fields.map((field, index) => (
                                    <div key={index} className="field-item">
                                        <h4>{field.label}</h4>
                                        <p>Type: {field.type}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '15px', fontSize: '12px', color: '#718096' }}>
                                Created: {new Date(blueprint.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlueprintList;
