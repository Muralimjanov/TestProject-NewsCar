export const validateInn = (inn) => {
    if (!/^\d{10}$|^\d{12}$/.test(inn)) return false;

    const getChecksum = (inn, coefficients) =>
        coefficients.reduce((sum, coef, i) => sum + coef * parseInt(inn[i]), 0) % 11 % 10;

    if (inn.length === 10) {
        return getChecksum(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]) === parseInt(inn[9]);
    }

    if (inn.length === 12) {
        const n11 = getChecksum(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0]);
        const n12 = getChecksum(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        return n11 === parseInt(inn[10]) && n12 === parseInt(inn[11]);
    }

    return false;
};
