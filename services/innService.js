import axios from 'axios';

export const fetchCompanyInfoByInn = async (inn) => {
    try {
        const response = await axios.get(`https://api-fns.ru/api/egr?req=${inn}`);
        const {data} = response;

        if (data && data.items && data.items.length > 0) {
            return {
                success: true,
                name: data.items[0].name,
            };
        } else {
            return {
                success: false,
                message: 'Организация не найдена по ИНН',
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Ошибка при проверке ИНН',
        };
    }
};
