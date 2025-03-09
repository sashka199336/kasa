import express from 'express';
import path from 'path';

import sequelize  from './database';
import ticketRoutes from './routes/ticketRoutes';
import Ticket from './models/Ticket';

const app = express();
const PORT = 3000;


app.use(express.json());



app.use (express.static(path.join(__dirname, '../public')));

// Подключение маршр утов API
app.use('/api', ticketRoutes);

// Подключение к базе данных и запуск сервера
sequelize.sync().then(() => {
    console.log('Database is ready!');

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});