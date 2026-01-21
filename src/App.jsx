import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import BlueprintCreator from './components/BlueprintCreator';
import BlueprintList from './components/BlueprintList';
import ContractCreator from './components/ContractCreator';
import ContractDashboard from './components/ContractDashboard';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showBlueprintCreator, setShowBlueprintCreator] = useState(false);
  const [showContractCreator, setShowContractCreator] = useState(false);

  return (
    <AppProvider>
      <div>
        {/* header */}
        <div className="header">
          <div className="container">
            <div className="header-content">
              <h1>contract management platform</h1>
              <div className="nav-buttons">
                <button
                  className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCurrentView('dashboard')}
                >
                  dashboard
                </button>
                <button
                  className={`btn ${currentView === 'blueprints' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCurrentView('blueprints')}
                >
                  blueprints
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* action buttons */}
        <div className="container" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowBlueprintCreator(true)}
            >
              + create blueprint
            </button>
            <button
              className="btn btn-success"
              onClick={() => setShowContractCreator(true)}
            >
              + create contract
            </button>
          </div>
        </div>

        {/* main content */}
        {currentView === 'dashboard' && <ContractDashboard />}
        {currentView === 'blueprints' && <BlueprintList />}

        {/* modals */}
        {showBlueprintCreator && (
          <BlueprintCreator onClose={() => setShowBlueprintCreator(false)} />
        )}
        {showContractCreator && (
          <ContractCreator onClose={() => setShowContractCreator(false)} />
        )}
      </div>
    </AppProvider>
  );
}

export default App;
