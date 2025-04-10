import { body } from 'express-validator';

export const newsInterestingValidation = [
    body('header')
        .isString().withMessage('Header должен быть строкой')
        .notEmpty().withMessage('Header обязателен'),

    body('preview')
        .isString().withMessage('Preview должен быть строкой')
        .matches(/^\/images\/[\w\-]+\.(jpg|png|jpeg)$/).withMessage('Неверный формат preview'),

    body('content')
        .isString().withMessage('Content должен быть строкой')
        .notEmpty().withMessage('Content обязателен'),

    body('date')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Дата должна быть в формате YYYY-MM-DD'),

    body('images')
        .isArray().withMessage('Images должен быть массивом')
        .custom((arr) => arr.every(item => /^\/images\/[\w\-]+\.(jpg|png|jpeg)$/.test(item)))
        .withMessage('Каждое изображение должно быть в формате /images/name.jpg'),

    body('tags')
        .isArray().withMessage('Tags должен быть массивом')
        .custom((arr) => arr.every(tag => typeof tag === 'string' && tag.length <= 15))
        .withMessage('Каждый тег должен быть строкой до 15 символов'),

    body('views')
        .optional()
        .isNumeric().withMessage('Views должен быть числом'),

    body('note')
        .isString().withMessage('Note должен быть строкой')
        .isLength({ max: 70 }).withMessage('Note не должен превышать 70 символов')
];
