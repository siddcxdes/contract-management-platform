import { useApp } from '../context/AppContext';

const BlueprintList = () => {
    const { blueprints } = useApp();

    return (
        <div className="container">
            <h2 style={{ marginBottom: '20px', textTransform: 'lowercase' }}>
                blueprints
            </h2>

            {blueprints.length === 0 ? (
                <div className="empty-state">
                    <h3>no blueprints yet</h3>
                    <p>create your first blueprint to get started</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {blueprints.map(blueprint => (
                        <div key={blueprint.id} className="card">
                            <h3 style={{ marginBottom: '15px', color: '#667eea', textTransform: 'lowercase' }}>
                                {blueprint.name}
                            </h3>

                            <div style={{ marginBottom: '10px' }}>
                                <strong style={{ fontSize: '14px', textTransform: 'lowercase' }}>
                                    fields ({blueprint.fields.length}):
                                </strong>
                            </div>

                            <div className="field-builder">
                                {blueprint.fields.map(field => (
                                    <div key={field.id} className="field-item">
                                        <h4>{field.label}</h4>
                                        <p>type: {field.type}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '15px', fontSize: '12px', color: '#718096' }}>
                                created: {new Date(blueprint.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlueprintList;
