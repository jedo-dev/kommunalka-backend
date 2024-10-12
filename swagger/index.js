import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import swaggerAutogen from 'swagger-autogen';

const _dirname = dirname(fileURLToPath(import.meta.url));

// const doc = ...
const doc = {
  // общая информация
  // { ... },

  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  info: {
    title: 'Kommunalka API',
    description: 'запроы для приложения',
  },
  // что-то типа моделей
  definitions: {
    // модель задачи
    UtilityBill: {
      hotWater: {
        type: Number,
        required: true,
      },
      coldWater: {
        type: Number,
        required: true,
      },
      electric: {
        type: Number,
        required: true,
      },
      addPayment: {
        type: Array,
        default: [],
      },

      user: {
        ref: 'User',
        required: true,
      },

      createDate: Date,
    },

    // модель массива задач
    UtilityBills: [
      {
        hotWater: {
          type: Number,
          required: true,
        },
        coldWater: {
          type: Number,
          required: true,
        },
        electric: {
          type: Number,
          required: true,
        },
        addPayment: {
          type: Array,
          default: [],
        },

        user: {
          ref: 'User',
          required: true,
        },

        createDate: Date,
      },
    ],
    // модель объекта с текстом новой задачи
    register: {
      password: 'string',
      fullName: 'string',
      avatarUrl: 'string',
      email: 'string',
    },
    login: {
      email: 'alex@gmail.com',
      password: '12345',
    },
    // модель объекта с изменениями существующей задачи
    Changes: {
      changes: {
        text: 'test',
        done: true,
      },
    },
  },
  host: 'localhost:4444',
  schemes: ['http'],
};

// путь и название генерируемого файла
const outputFile = join(_dirname, 'output.json');
// массив путей к роутерам
const endpointsFiles = [join(_dirname, '../index.js')];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(async (success) => {
  await import('./index.js'); // Your project's root file
  return console.log(`Generated: ${success}`);
});
