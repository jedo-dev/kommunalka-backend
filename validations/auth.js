import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'неверный формат почты').isEmail(),
  body('password').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'неверный формат почты').isEmail(),
  body('password').isLength({ min: 5 }),
  body('fullName').isLength({ min: 3 }),
  body('avatarUrl').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'неверный формат хаголовка').isLength({ min: 3 }).isString(),
  body('text', 'неверный текст статьи').isLength({ min: 10 }).isString(),
  body('tags', 'неверный формат тегов').optional().isString(),
  body('imageUrl', 'неверная ссылка изображения').optional().isString(),
];
