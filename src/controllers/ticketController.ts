import {Request,Response } from 'express';
import {Op} from 'sequelize';
import Ticket from '../models/Ticket';
import dayjs from 'dayjs';


// Создать обращен ие
export const createTicket = async ( req: Request, res: Response): Promise<void> => {
    const {topic, description,createdAt } = req.body;

    try {

        const creationDate = createdAt ? dayjs( createdAt ).toISOString() : dayjs().toISOString();

        const ticket = await Ticket.create(   {
            topic,
            description,
            status: 'Новое',
            createdAt: creationDate
        });

        res.status(201 ).json( ticket );
    }   catch (error ) {
        console.error('Ошибка при создании обращения:' , error);   // Лог ошибки
        res.status( 500).json( {error:'Не получилось создать обращение'});   // Сообщение об ошибки
    }
};


// Статус В работе
export const takeTicketInWork = async(req: Request,res:Response): Promise<void> => {
    const { id} = req.params;

    try{
        const ticket = await Ticket.findByPk( id );   // Ищем тикет в базе

        if ( !ticket ) {
            res.status( 404 ).json( { error: 'Обращение не найдено' } );   // Если тикет не найден
            return;   // Завершаем выполнение
        }

        ticket.status = 'В работе';   // Меняем статус
        await ticket.save();   // Сохраняем изменения
        res.json( ticket );   // Отправляем обновлённый тикет
    }   catch   ( error ) {
        console.error( 'Ошибка при переводе обращения в работу:' ,   error );
        res.status( 500 ).json( {   error:   'Не получилось перевести тикет в работу'   } );
    }
};


// Завершение обращения
export const completeTicket = async ( req: Request, res: Response ): Promise<void> => {
    const { id} = req.params;
    const   { resolution} = req.body;

    try {
        const ticket = await Ticket.findByPk( id );   // Ищем тикет в базе

        if ( !ticket ) {
            res.status( 404 ).json( { error: 'Обращение не найдено' } );
            return;
        }

        ticket.status = 'Завершено';   // Меняем статус на "Завершено"
        ticket.resolution = resolution;   // Добавляем решение
        await ticket.save();
        res.json( ticket);
    }   catch (error ) {
        console.error( 'Ошибка при завершении обращения:',error) ;
        res.status( 500 ).json( {error:'Не получилось завершить обращение'});
    }
};



export const cancelTicket = async(req: Request, res:Response): Promise<void> => {
    const   {id} = req.params;
    const   { cancellationReason} = req.body;

    try {
        const ticket=await Ticket.findByPk( id );

        if(!ticket) {
            res.status( 404).json({ error: 'Обращение не найдено'});
            return;
        }

        ticket.status = 'Отменено';   // Меняем статус на "Отменено"

        ticket.cancellationReason = cancellationReason;   // Указываем причину отмены
        await ticket.save();

        res.json( ticket );
    }   catch ( error ){
        console.error( 'Ошибка при отмене обращения:' ,error);

        res.status( 500 ).json( { error: 'Не получилось отменить тикет'} );
    }
};



export const getTickets = async ( req: Request, res: Response ): Promise<void> => {
    const {date, startDate, endDate } =req.query;

    try {
        const whereClause: any ={};   // Условие для фильтрации

        // Если указана конкретная дата
        if (date) {
            whereClause.createdAt = {
                [Op.gte ]: `${ date }T00:00:00.000Z`,

                [ Op.lt ]: `${ date }T23:59:59.999Z`,
            };
        }

        // Если указан диапазон дат
        if (startDate && endDate ) {
            whereClause.createdAt = {
                [ Op.between ]: [
                    `${ startDate }T00:00:00.000Z`,
                    `${ endDate }T23:59:59.999Z`,
                ],
            };
        }

        const tickets = await Ticket.findAll( { where: whereClause } );   // Получаем тикеты из базы
        res.json(tickets );   // Отправляем тикеты обратно клиенту
    }   catch (error ) {
        console.error('Ошибка при получении списка обращений:' ,   error );
        res.status( 500).json( {error:'Не получилось получить список тикетов'} );
    }
};


// Отмена всех обращений
export const cancelAllInWorkTickets = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const updatedCount = await Ticket.update(
          {status:'Отменено'},
          {where: { status:'В работе'}}
        );

        res.json({ message:`Обновлено ${ updatedCount[ 0 ] } тикетов в статусе "В работе".`});
    }   catch (error ) {
        console.error('Ошибка при массовой отмене тикетов:' ,   error );
        res.status(500).json( {error:'Не получилось отменить тикеты в работе'} );
    }
};



export const sendMessage = async ( req: Request, res: Response ): Promise<void> => {
    const{message   }   =   req.body;

    try{
        console.log( 'Сообщение получено:' ,   message );   // Логируем сообщение
        res.status(200).json( {message: 'Сообщение успешно обработано!'   } );   // Отправляем ответ
    }   catch (error) {
        console.error('Ошибка при обработке сообщения:' , error );
        res.status(500).json( { error:   'Не получилось обработать сообщение' } );
    }
};