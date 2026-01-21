import { createContext, useContext, useState, useEffect } from 'react';
import { blueprintAPI, contractAPI } from '../services/api';
import { CONTRACT_STATES, canTransition } from '../utils/constants';

// create context for app state
const AppContext = createContext();

// custom hook to use app context
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useapp must be used within appprovider');
    }
    return context;
};

// provider component that wraps the app
export const AppProvider = ({ children }) => {
    const [blueprints, setBlueprints] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // load data from API when app starts
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [blueprintsRes, contractsRes] = await Promise.all([
                blueprintAPI.getAll(),
                contractAPI.getAll()
            ]);
            setBlueprints(blueprintsRes.data || []);
            setContracts(contractsRes.data || []);
        } catch (err) {
            setError(err.message);
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    // add a new blueprint
    const addBlueprint = async (blueprint) => {
        setLoading(true);
        setError(null);
        try {
            const response = await blueprintAPI.create(blueprint);
            const newBlueprint = response.data;
            setBlueprints([...blueprints, newBlueprint]);
            return newBlueprint;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // add a new contract from a blueprint
    const addContract = async (blueprintId, contractName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractAPI.create({
                name: contractName,
                blueprintId: blueprintId
            });
            const newContract = response.data;
            setContracts([...contracts, newContract]);
            return newContract;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // update contract field values
    const updateContractFields = async (contractId, updatedFields) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractAPI.updateFields(contractId, updatedFields);
            const updatedContract = response.data;
            setContracts(contracts.map(contract =>
                contract._id === contractId ? updatedContract : contract
            ));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // change contract state
    const changeContractState = async (contractId, newState) => {
        setLoading(true);
        setError(null);
        try {
            const response = await contractAPI.changeState(contractId, newState);
            const updatedContract = response.data;
            setContracts(contracts.map(contract =>
                contract._id === contractId ? updatedContract : contract
            ));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // refresh data
    const refreshData = async () => {
        await loadInitialData();
    };

    const value = {
        blueprints,
        contracts,
        loading,
        error,
        addBlueprint,
        addContract,
        updateContractFields,
        changeContractState,
        refreshData
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

