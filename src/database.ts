import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:   'kasa.sqlite', // Имя файла базы данных
    logging: false, // Отключает логи
});

export default  sequelize;