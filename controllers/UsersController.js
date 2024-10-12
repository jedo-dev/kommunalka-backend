import jwt from 'jsonwebtoken';

import userModel from '../models/User.js';
import bcrypt from 'bcrypt';
export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);
    const doc = new userModel({
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      fullName: req.body.fullName,
      hash: pass,
      ratioHot: req.body.ratioHot,
      ratioCold: req.body.ratioCold,
      ratioElec: req.body.ratioElec,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );
    const { hash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};
export const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.hash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { hash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const { hash, ...userData } = user._doc;
    res.json({ ...userData });
  } catch (err) {
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
