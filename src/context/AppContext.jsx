import { createContext, useContext, useState, useEffect } from 'react';
import { getBlueprints, saveBlueprints, getContracts, saveContracts, generateId } from '../utils/storage';
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

    // load data from storage when app starts
    useEffect(() => {
        setBlueprints(getBlueprints());
        setContracts(getContracts());
    }, []);

    // save blueprints whenever they change
    useEffect(() => {
        saveBlueprints(blueprints);
    }, [blueprints]);

    // save contracts whenever they change
    useEffect(() => {
        saveContracts(contracts);
    }, [contracts]);

    // add a new blueprint
    const addBlueprint = (blueprint) => {
        const newBlueprint = {
            ...blueprint,
            id: generateId(),
            createdAt: new Date().toISOString()
        };
        setBlueprints([...blueprints, newBlueprint]);
        return newBlueprint;
    };

    // add a new contract from a blueprint
    const addContract = (blueprintId, contractName) => {
        const blueprint = blueprints.find(b => b.id === blueprintId);
        if (!blueprint) return null;

        const newContract = {
            id: generateId(),
            name: contractName,
            blueprintId: blueprint.id,
            blueprintName: blueprint.name,
            state: CONTRACT_STATES.CREATED,
            fields: blueprint.fields.map(field => ({
                ...field,
                value: ''
            })),
            createdAt: new Date().toISOString()
        };

        setContracts([...contracts, newContract]);
        return newContract;
    };

    // update contract field values
    const updateContractFields = (contractId, updatedFields) => {
        setContracts(contracts.map(contract => {
            if (contract.id === contractId) {
                return {
                    ...contract,
                    fields: updatedFields
                };
            }
            return contract;
        }));
    };

    // change contract state
    const changeContractState = (contractId, newState) => {
        setContracts(contracts.map(contract => {
            if (contract.id === contractId) {
                // check if transition is valid
                if (canTransition(contract.state, newState)) {
                    return {
                        ...contract,
                        state: newState
                    };
                }
            }
            return contract;
        }));
    };

    const value = {
        blueprints,
        contracts,
        addBlueprint,
        addContract,
        updateContractFields,
        changeContractState
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
