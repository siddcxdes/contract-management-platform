// simple local storage helper functions
// these functions help us save and load data from browser storage

// get blueprints from storage
export const getBlueprints = () => {
  const data = localStorage.getItem('blueprints');
  return data ? JSON.parse(data) : [];
};

// save blueprints to storage
export const saveBlueprints = (blueprints) => {
  localStorage.setItem('blueprints', JSON.stringify(blueprints));
};

// get contracts from storage
export const getContracts = () => {
  const data = localStorage.getItem('contracts');
  return data ? JSON.parse(data) : [];
};

// save contracts to storage
export const saveContracts = (contracts) => {
  localStorage.setItem('contracts', JSON.stringify(contracts));
};

// generate unique id for new items
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
