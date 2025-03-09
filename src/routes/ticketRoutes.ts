import { Router } from 'express';

import {
    createTicket,
    takeTicketInWork,
    completeTicket,
    cancelTicket,
    getTickets,
    cancelAllInWorkTickets,
    sendMessage, // Импортируем метод для обработки сообщений
} from '../controllers/ticketController';

const  router = Router();

// Маршруты для работы с обращениями
router.post('/tickets', createTicket); // Создать обращение
router.put  ('/tickets/:id/work', takeTicketInWork); // Взять обращение в работу

router.put('/tickets/:id/complete', completeTicket); // Завершить обращение
router.put  ('/tickets/:id/cancel', cancelTicket); // Отменить обращение
router.get(  '/tickets', getTickets); // Получить список обращений
router.put ('/tickets/cancel-all-in-work', cancelAllInWorkTickets); // Отменить все обращения в работе

// Новый маршрут для отправки сообщений
router.post ('/messages', sendMessage) ; // Обработка отправленного сообщения

export default router;