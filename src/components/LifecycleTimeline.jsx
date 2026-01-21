import { CONTRACT_STATES } from '../utils/constants';

const LifecycleTimeline = ({ currentState }) => {
    // define the order of states in timeline
    const states = [
        CONTRACT_STATES.CREATED,
        CONTRACT_STATES.APPROVED,
        CONTRACT_STATES.SENT,
        CONTRACT_STATES.SIGNED,
        CONTRACT_STATES.LOCKED
    ];

    // find current state index
    const currentIndex = states.indexOf(currentState);

    // check if state is completed
    const isCompleted = (index) => {
        if (currentState === CONTRACT_STATES.REVOKED) return false;
        return index < currentIndex;
    };

    // check if state is active
    const isActive = (index) => {
        if (currentState === CONTRACT_STATES.REVOKED) return false;
        return index === currentIndex;
    };

    return (
        <div>
            {currentState === CONTRACT_STATES.REVOKED && (
                <div style={{
                    padding: '15px',
                    background: '#fed7d7',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    color: '#742a2a',
                    fontWeight: '600'
                }}>
                    this contract has been revoked
                </div>
            )}

            <div className="lifecycle-timeline">
                {states.map((state, index) => (
                    <div key={state} className="lifecycle-step">
                        <div className={`lifecycle-circle ${isActive(index) ? 'active' : ''} ${isCompleted(index) ? 'completed' : ''}`}>
                            {index + 1}
                        </div>
                        <div className="lifecycle-label">{state}</div>
                        {index < states.length - 1 && (
                            <div className={`lifecycle-line ${isCompleted(index + 1) ? 'completed' : ''}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LifecycleTimeline;
