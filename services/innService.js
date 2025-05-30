import axios from 'axios';
import config from 'config';

export const fetchCompanyInfoByInn = async (inn) => {
    try {
        const response = await axios.get(`https://api-fns.ru/api/egr`, {
            params: {
                req: inn,
                key: config.get("API_KEY_INN"),
            },
        });

        const { data } = response;

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
        console.error('ИНН API error:', error?.response?.data || error.message);
        return {
            success: false,
            message: 'Ошибка при проверке ИНН',
        };
    }
};