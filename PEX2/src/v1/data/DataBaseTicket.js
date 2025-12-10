const { getData, saveData } = require("./storage");

// Get all objects
const getAllObjects = () => {
    return getData();
}

// Add object
const addObject = (object) => {
    const objects = getData();
    const id = objects.length ? objects[objects.length - 1].id + 1 : 1;

    const newObj = { id, ...object };
    objects.push(newObj);
    saveData(objects);

    return newObj;
}


// Get object by id
const getObjectById = (id) => {
    return getData().find(obj => obj.id === parseInt(id)) || null;
}

// Delete object by id
const deleteObjectById = (id) => {
    const objects = getData();
    const filtered = objects.filter(obj => obj.id !== parseInt(id));

    if (filtered.length === objects.length) return false;

    saveData(filtered);
    return true;
}

// Update object by id
const updateObjectById = (id, updatedObject) => {
    const objects = getData();
    const index = objects.findIndex(obj => obj.id === parseInt(id));

    if (index === -1) return null;

    objects[index] = { ...objects[index], ...updatedObject };
    saveData(objects);

    return objects[index];
}


module.exports = {
    getAllObjects,
    addObject,
    getObjectById,
    deleteObjectById,
    updateObjectById
}