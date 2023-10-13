import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
const PORT = 3000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'tech_test',
      version: '1.0.0',
      description: 'A simple API for user sign-up and sign-in',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ... other code

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});