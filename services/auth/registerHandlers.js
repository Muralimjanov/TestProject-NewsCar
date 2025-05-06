import { User } from '../../Models/UserModels.js';
import {
    registerUserSchema,
    registerCompanySchema,
    registerAdminSchema
} from '../../Validations/AuthValidation.js';
import { validateInn } from '../../utils/validateInn.js';
import { fetchCompanyInfoByInn } from '../innService.js';

export const handleUserRegistration = async (body) => {
    const validated = await registerUserSchema.validateAsync(body);
    if (!validated.termsAccepted) {
        throw new Error('Вы должны согласиться с условиями пользовательского соглашения');
    }
    return validated;
};

export const handleCompanyRegistration = async (body) => {
    const validated = await registerCompanySchema.validateAsync(body);

    if (!validated.authorizedRepresentative || !validated.termsAccepted) {
        throw new Error('Подтвердите, что вы представитель и согласны с условиями');
    }

    if (!validateInn(validated.inn)) {
        throw new Error('Некорректный ИНН');
    }

    const innCheck = await fetchCompanyInfoByInn(validated.inn);
    if (!innCheck.success) {
        throw new Error(innCheck.message);
    }

    validated.organizationName = innCheck.name;

    const existingInn = await User.findOne({ inn: validated.inn });
    if (existingInn) {
        throw new Error('Компания с таким ИНН уже зарегистрирована');
    }

    return validated;
};

export const handleAdminRegistration = async (body) => {
    return await registerAdminSchema.validateAsync(body);
};
