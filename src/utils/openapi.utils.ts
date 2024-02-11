import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node express template API',
      version: '0.0.1',
      description: 'A simple Express API',
    },
    contact: {
      name: 'Amine Abdelli',
      email: 'amine.abdelli@outlook.fr',
      github: 'https://github.com/amine-abdelli',
    },
    servers: [
      {
        url: `${process.env.API_URL}/`,
      },
    ],
  },
  apis: ['./src/routers/**/*.ts'],
};
