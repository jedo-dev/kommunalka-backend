import jwt from 'jsonwebtoken';
import moment from 'moment/moment.js';
import userModel from '../models/User.js';
import UtilityBills from '../models/UtilityBills.js';
export const getAll = async (req, res) => {
  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    const decoded = jwt.verify(token, 'secret123');
    console.log(`token`, decoded)
    const posts = await UtilityBills.find({
      user: decoded._id
    }).populate('user').exec();
    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};

export const create = async (req, res) => {
  console.log(req.body);
  try {
    const doc = new UtilityBills({
      hotWater: req.body.hotWater,
      coldWater: req.body.coldWater,
      electric: req.body.electric,
      addPayment: req.body.addPayment,
      createDate: req.body.createDate,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось записать',
    });
  }
};
export const update = async (req, res) => {
  console.log(req.params);
  try {
    const postId = req.params.id;
    await UtilityBills.updateOne(
      {
        _id: postId,
      },
      {
        hotWater: req.body.hotWater,
        coldWater: req.body.coldWater,
        electric: req.body.electric,
        addPayment: req.body.addPayment,
        createDate: req.body.createDate,
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

export const getMultipleLinePlot = async (req, res) => {
  const totalSumm = (prev, next) => {
    if (prev && next) {
      return 0;
    }

    return next - prev;
  };
  try {
    const posts = await UtilityBills.find().populate('user').exec();
    let arr = [];

    const user = await userModel.findById(req.userId);
    for (let i = 0; i < posts.length; i++) {
      if (posts[i - 1]) {
        arr.push({
          name: 'Горячая вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].hotWater - posts[i - 1].hotWater,
        });
        arr.push({
          name: 'Холодная вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].coldWater - posts[i - 1].coldWater,
        });
        arr.push({
          name: 'Электричество',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].electric - posts[i - 1].electric,
        });

        arr.push({
          name: 'Оплачено',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp:
            (posts[i].coldWater - posts[i - 1].coldWater) * user.ratioCold +
            (posts[i].electric - posts[i - 1].electric) * user.ratioElec +
            (posts[i].hotWater - posts[i - 1].hotWater) * user.ratioHot +
            (posts[i].coldWater -
              posts[i - 1].coldWater +
              (posts[i].hotWater - posts[i - 1].hotWater)) *
            user.avatarUrl,
        });
      } else {
        arr.push({
          name: 'Горячая вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Холодная вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Электричество',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Оплачено',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
      }
    }
    console.log(user);
    // const result = posts.map((el, index) => {
    //   console.log(totalSumm(posts[index].hotWater, posts[index - 1].hotWater));
    //   return {
    //     hotWater: totalSumm(posts[index].hotWater, posts[index - 1].hotWater),
    //     coldWater: el.coldWater,
    //     electric: el.electric,
    //   };
    // });
    res.json(arr);
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};

export const getMeterGaugePlot = async (req, res) => {
  try {
    const posts = await UtilityBills.find().populate('user').exec();
    let arr = [];

    const user = await userModel.findById(req.userId);
    for (let i = 0; i < posts.length; i++) {
      if (posts[i - 1]) {
        arr.push({
          name: 'Горячая вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].hotWater - posts[i - 1].hotWater,
        });
        arr.push({
          name: 'Холодная вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].coldWater - posts[i - 1].coldWater,
        });
        arr.push({
          name: 'Электричество',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].electric - posts[i - 1].electric,
        });

        arr.push({
          name: 'Оплачено',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp:
            (posts[i].coldWater - posts[i - 1].coldWater) * user.ratioCold +
            (posts[i].electric - posts[i - 1].electric) * user.ratioElec +
            (posts[i].hotWater - posts[i - 1].hotWater) * user.ratioHot +
            (posts[i].coldWater -
              posts[i - 1].coldWater +
              (posts[i].hotWater - posts[i - 1].hotWater)) *
            user.avatarUrl,
        });
      } else {
        arr.push({
          name: 'Горячая вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Холодная вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Электричество',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Оплачено',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
      }
    }

    const average = arr
      .filter((el) => el.name === 'Оплачено')
      .reduce((acc, item, index, arr) => {
        const sum = acc + item.gdp;
        if (index === arr.length - 1) {
          return sum / arr.length;
        }

        return sum;
      }, 0);
    // total = total / test.length;
    const filtered = arr.filter((el) => el.name === 'Оплачено');
    console.log(average);
    // const result = posts.map((el, index) => {
    //   console.log(totalSumm(posts[index].hotWater, posts[index - 1].hotWater));
    //   return {
    //     hotWater: totalSumm(posts[index].hotWater, posts[index - 1].hotWater),
    //     coldWater: el.coldWater,
    //     electric: el.electric,
    //   };
    // });
    res.json((filtered[filtered.length - 1].gdp / average).toFixed(2));
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};
export const getLiquidHot = async (req, res) => {
  try {
    const posts = await UtilityBills.find().populate('user').exec();
    let arr = [];

    const user = await userModel.findById(req.userId);
    for (let i = 0; i < posts.length; i++) {
      if (posts[i - 1]) {
        arr.push({
          name: 'Горячая вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].hotWater - posts[i - 1].hotWater,
        });
        arr.push({
          name: 'Холодная вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].coldWater - posts[i - 1].coldWater,
        });
        arr.push({
          name: 'Электричество',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].electric - posts[i - 1].electric,
        });

        arr.push({
          name: 'Оплачено',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp:
            (posts[i].coldWater - posts[i - 1].coldWater) * user.ratioCold +
            (posts[i].electric - posts[i - 1].electric) * user.ratioElec +
            (posts[i].hotWater - posts[i - 1].hotWater) * user.ratioHot +
            (posts[i].coldWater -
              posts[i - 1].coldWater +
              (posts[i].hotWater - posts[i - 1].hotWater)) *
            user.avatarUrl,
        });
      } else {
        arr.push({
          name: 'Горячая вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Холодная вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Электричество',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Оплачено',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
      }
    }

    const average = arr
      .filter((el) => el.name === 'Горячая вода')
      .reduce((acc, item, index, arr) => {
        const sum = acc + item.gdp;
        if (index === arr.length - 1) {
          return sum / arr.length;
        }

        return sum;
      }, 0);
    // total = total / test.length;
    const filtered = arr.filter((el) => el.name === 'Горячая вода');
    console.log(average);
    // const result = posts.map((el, index) => {
    //   console.log(totalSumm(posts[index].hotWater, posts[index - 1].hotWater));
    //   return {
    //     hotWater: totalSumm(posts[index].hotWater, posts[index - 1].hotWater),
    //     coldWater: el.coldWater,
    //     electric: el.electric,
    //   };
    // });
    res.json((filtered[filtered.length - 1].gdp / average).toFixed(2));
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};
export const getLiquidCold = async (req, res) => {
  try {
    const posts = await UtilityBills.find().populate('user').exec();
    let arr = [];

    const user = await userModel.findById(req.userId);
    for (let i = 0; i < posts.length; i++) {
      if (posts[i - 1]) {
        arr.push({
          name: 'Горячая вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].hotWater - posts[i - 1].hotWater,
        });
        arr.push({
          name: 'Холодная вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].coldWater - posts[i - 1].coldWater,
        });
        arr.push({
          name: 'Электричество',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].electric - posts[i - 1].electric,
        });

        arr.push({
          name: 'Оплачено',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp:
            (posts[i].coldWater - posts[i - 1].coldWater) * user.ratioCold +
            (posts[i].electric - posts[i - 1].electric) * user.ratioElec +
            (posts[i].hotWater - posts[i - 1].hotWater) * user.ratioHot +
            (posts[i].coldWater -
              posts[i - 1].coldWater +
              (posts[i].hotWater - posts[i - 1].hotWater)) *
            user.avatarUrl,
        });
      } else {
        arr.push({
          name: 'Горячая вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Холодная вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Электричество',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Оплачено',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
      }
    }

    const average = arr
      .filter((el) => el.name === 'Холодная вода')
      .reduce((acc, item, index, arr) => {
        const sum = acc + item.gdp;
        if (index === arr.length - 1) {
          return sum / arr.length;
        }

        return sum;
      }, 0);
    // total = total / test.length;
    const filtered = arr.filter((el) => el.name === 'Холодная вода');
    console.log(average);
    // const result = posts.map((el, index) => {
    //   console.log(totalSumm(posts[index].hotWater, posts[index - 1].hotWater));
    //   return {
    //     hotWater: totalSumm(posts[index].hotWater, posts[index - 1].hotWater),
    //     coldWater: el.coldWater,
    //     electric: el.electric,
    //   };
    // });
    res.json((filtered[filtered.length - 1].gdp / average).toFixed(2));
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};
export const getLiquidElectric = async (req, res) => {
  try {
    const posts = await UtilityBills.find().populate('user').exec();
    let arr = [];

    const user = await userModel.findById(req.userId);
    for (let i = 0; i < posts.length; i++) {
      if (posts[i - 1]) {
        arr.push({
          name: 'Горячая вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].hotWater - posts[i - 1].hotWater,
        });
        arr.push({
          name: 'Холодная вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].coldWater - posts[i - 1].coldWater,
        });
        arr.push({
          name: 'Электричество',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: posts[i].electric - posts[i - 1].electric,
        });

        arr.push({
          name: 'Оплачено',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp:
            (posts[i].coldWater - posts[i - 1].coldWater) * user.ratioCold +
            (posts[i].electric - posts[i - 1].electric) * user.ratioElec +
            (posts[i].hotWater - posts[i - 1].hotWater) * user.ratioHot +
            (posts[i].coldWater -
              posts[i - 1].coldWater +
              (posts[i].hotWater - posts[i - 1].hotWater)) *
            user.avatarUrl,
        });
      } else {
        arr.push({
          name: 'Горячая вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Холодная вода',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Электричество',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
        arr.push({
          name: 'Оплачено',
          year: moment(posts[i].createDate).format('M.Y'),
          gdp: 0,
        });
      }
    }

    const average = arr
      .filter((el) => el.name === 'Электричество')
      .reduce((acc, item, index, arr) => {
        const sum = acc + item.gdp;
        if (index === arr.length - 1) {
          return sum / arr.length;
        }

        return sum;
      }, 0);
    // total = total / test.length;
    const filtered = arr.filter((el) => el.name === 'Электричество');
    console.log(average);
    // const result = posts.map((el, index) => {
    //   console.log(totalSumm(posts[index].hotWater, posts[index - 1].hotWater));
    //   return {
    //     hotWater: totalSumm(posts[index].hotWater, posts[index - 1].hotWater),
    //     coldWater: el.coldWater,
    //     electric: el.electric,
    //   };
    // });
    res.json((filtered[filtered.length - 1].gdp / average).toFixed(2));
  } catch (err) {
    res.status(500).json({
      message: 'Не получить статьи',
    });
  }
};
