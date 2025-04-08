let auctions = [];
let currentId = 1;

export const getAll = () => auctions;

export const getOne = (id) => auctions.find(item => item.id === id);

export const create = (data) => {
    const newAuction = { id: currentId++, ...data };
    auctions.push(newAuction);
    return newAuction;
};

export const update = (id, updates) => {
    const index = auctions.findIndex(item => item.id === id);
    if (index === -1) {
        return null;
    }
    auctions[index] = { ...auctions[index], ...updates };
    return auctions[index];
};

export const remove = (id) => {
    const index = auctions.findIndex(item => item.id === id);
    if (index === -1) {
        return false;
    }
    auctions.splice(index, 1);
    return true;
};

