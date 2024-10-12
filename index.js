import cors from 'cors';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';
import { PostController, UsersController, UtilityBillsControllers } from './controllers/index.js';
import { loginValidation, postCreateValidation, registerValidation } from './validations/auth.js';

import { checkAuth, handleValidatopnErrors } from './utils/index.js';
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URL)
  .then((rea) => console.log('connected'))
  .catch(() => console.log('not connected'));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(cors());
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json'));
const upload = multer({ storage });
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.post('/auth/login', loginValidation, handleValidatopnErrors, UsersController.login, () => {
  /*  #swagger.auto = false
  #swagger.parameters['obj'] = {
   in:  'body',
   type: 'string',
 
   
   schema: {
                $email: 'alex@gmail.com',
      $password: '12345',
                    
                }
 } */
});
app.post(
  '/auth/register',
  registerValidation,
  handleValidatopnErrors,
  UsersController.register,
  () => {
    /* #swagger.parameters['obj'] = {
   in: 'body',
   type: 'object',
   required: true,
   schema: { $ref: '#/definitions/register' }
 } */
  },
);

app.get('/auth/me', checkAuth, UsersController.getMe, () => {
  /* #swagger.security = [{
               "bearerAuth": []
        }] */
});
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidatopnErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.deleteOne);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidatopnErrors,
  PostController.update,
);

app.post('/bills', checkAuth, handleValidatopnErrors, UtilityBillsControllers.create);
app.get(
  '/multiple-line-plot',
  checkAuth,
  handleValidatopnErrors,
  UtilityBillsControllers.getMultipleLinePlot,
);
app.get(
  '/meter-gauge-plot',
  checkAuth,
  handleValidatopnErrors,
  UtilityBillsControllers.getMeterGaugePlot,
);
app.get('/liquid-hot', checkAuth, handleValidatopnErrors, UtilityBillsControllers.getLiquidHot);
app.get('/liquid-cold', checkAuth, handleValidatopnErrors, UtilityBillsControllers.getLiquidCold);
app.get(
  '/liquid-electric',
  checkAuth,
  handleValidatopnErrors,
  UtilityBillsControllers.getLiquidElectric,
);

app.get('/bills', checkAuth, handleValidatopnErrors, UtilityBillsControllers.getAll);
app.patch('/bills/:id', checkAuth, handleValidatopnErrors, UtilityBillsControllers.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log('running servers');
  }
});
