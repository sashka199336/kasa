// Получаем элементы из HTML
const  ticketsContainer = document.getElementById('tickets-container');
const   showTicketsButton = document.getElementById('show-tickets-btn');

const createTicketForm = document.getElementById('create-ticket-form'); // Форма для создания обращения

// Фильтрация по дате
const filterDateForm = document.getElementById('filter-date-form');

const filterDateInput = document.getElementById ('filter-date');

// Фильтр ация по диапазону дат
const filterRangeForm = document.getElementById ('filter-range-form');

const filterStartDateInput =document.getElementById ('filter-start-date');
const filterEndDateInput=document.getElementById('filter-end-date');

// Скрыть список обращений
const hideTicketsButton = document.createElement('button');
hideTicketsButton.textContent ="Скрыть список обращений";

hideTicketsButton.style.display  =  'none'; // Скрываем кнопку по умолчанию
document.body.insertBefore  (hideTicketsButton,  ticketsContainer.nextSibling ) ; // Вставляем в DOM

// КОтмена обращений
const cancelAllButton =document.getElementById('cancel-all-in-work');

// Функция для создания нового обращения
async function createTicket( topic, description) {
  try {

    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {

        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ topic, description }),
    });

    if  (!response.ok) {
      throw  new Error  ( 'Ошибка при создании обращения' );
    }

    const newTicket =   await  response.json();
    alert ( `Обращение успешно создано: ID ${newTicket.id }`);
    fetchTickets(); // Обновляем список после создания
  } catch (error)  {
    console.error ('Ошибка:', error);
    alert ('Не удалось создать обращение');
  }
}


createTicketForm.addEventListener ('submit', (event) => {
  event.preventDefault(); // Останавливаем стандартное поведение формы

  // пОЛУЧЕНИЕ ДАННЫХ ИЗ ФОРМ
  const  topic=document.getElementById('topic').value;

  const description =document.getElementById('description').value;

  if (!topic || !description) {

    alert ('Тема и описание обязательны!');
    return;
  }

  // сОЗДАНИЕ ОБРАЩЕНИЯ
  createTicket (topic, description);


  createTicketForm.reset();
});

// пОЛУЧЕНИЕ СПИСКА ОБРАЩЕНИЙ
async function fetchTickets() {
  try {
    // Показываем индикатор загрузки
    ticketsContainer.innerHTML = '<p>Загрузка...</p>';

    ticketsContainer.style.display= 'block';

    hideTicketsButton.style.display = 'inline-block';
    showTicketsButton.style.display = 'none';

    // Отправка запроса на сервер
    const response =await fetch('/api/tickets'); // Эндпоинт для получения списка обращений
    if (!response.ok) {

      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const tickets = await response.json();

    renderTickets(tickets);

  } catch (error)  {
    console.error( 'Ошибка при загрузке обращений:',  error);
    ticketsContainer.innerHTML= '<p>Ошибка при загрузке обращений. Попробуйте позже.</p>';
  }
}

// Список обращений
function renderTickets(tickets) {

  ticketsContainer.innerHTML = ''; // Очищаем контейнер

  if ( tickets.length===0) {
    ticketsContainer.innerHTML = '<p>Нет доступных обращений.</p>';

    return;
  }

  tickets.forEach((ticket) => {

    const ticketElement = document.createElement('div');

    ticketElement.className = 'ticket';


    ticketElement.innerHTML = `
      <p><strong>Тема:</strong> ${ticket.topic}</p>
      
      <p><strong>Описание:</strong> ${ticket.description}</p>
      
      <p><strong>Статус:</strong> ${ticket.status}</p>
      <p><strong>Создано:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
    `;

    // Кнопки управления обращениями
    if (ticket.status === 'Новое') {
      const takeInWorkButton = document.createElement('button');

      takeInWorkButton.textContent = 'Взять в работу';

      takeInWorkButton.onclick = () => takeTicketInWork(ticket.id);
      ticketElement.appendChild(takeInWorkButton);
    }

    if (ticket.status === 'В работе') {
      const completeButton = document.createElement('button');
      completeButton.textContent ='Завершить';
      completeButton.onclick = () => completeTicket(ticket.id);
      ticketElement.appendChild(completeButton);
    }

    if (ticket.status !== 'Отменено' && ticket.status !== 'Завершено') {
      const cancelButton =document.createElement('button');

      cancelButton.textContent = 'Отменить';

      cancelButton.onclick = () => cancelTicket(ticket.id);
      ticketElement.appendChild(cancelButton);
    }

    ticketsContainer.appendChild(ticketElement);
  });
}

// Скрыть обращения
function hideTickets() {
  ticketsContainer.style.display= 'none';

  hideTicketsButton.style.display='none';

  showTicketsButton.style.display ='inline-block';
}

// Функция для фильтрации по конкретной дате
filterDateForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  const date = filterDateInput.value;

  if (!date) {
    alert('Укажите дату для фильтрации!');

    return;
  }

  try {
    ticketsContainer.innerHTML = '<p>Загрузка...</p>';

    ticketsContainer.style.display = 'block';

    const response = await fetch(`/api/tickets?date=${date}`);

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const tickets =await response.json();
    renderTickets (tickets);
  } catch (error )  {
    console.error('Ошибка при фильтрации по дате:', error);

    ticketsContainer.innerHTML = '<p>Ошибка при загрузке обращений. Попробуйте позже.</p>';
  }
});

// Фильтрация по диапазоНу дат
filterRangeForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const startDate = filterStartDateInput.value;
  const endDate = filterEndDateInput.value;

  if (!startDate || !endDate) {
    alert('Укажите обе даты для фильтрации!');
    return;
  }

  try {
    ticketsContainer.innerHTML = '<p>Загрузка...</p>';

    ticketsContainer.style.display = 'block';

    const response = await fetch(`/api/tickets?startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok)   {
      throw new Error(`Ошибка сервера: ${response.status}`);

    }

    const tickets = await response.json();

    renderTickets(tickets);
  } catch (error) {

    console.error('Ошибка при фильтрации по диапазону дат:', error);
    ticketsContainer.innerHTML = '<p>Ошибка при загрузке обращений. Попробуйте позже.</p>';
  }
});

  // Взятие обращения в работу
async function takeTicketInWork(ticketId) {
  try   {

    const response = await fetch(`/api/tickets/${ticketId}/work`, { method: 'PUT' });

    if (!response.ok) {

      throw new Error('Ошиббка при взятии обращения в работу');
    }

    alert('Обраще успешно взято в работу');
    fetchTickets();
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Не удалось взять обращение в работу');
  }
}

// Функция для завершения обращения
async function completeTicket(ticketId) {

  const resolution = prompt('Введите решение для обращения:');
  if (!resolution) return;

  try {
    const response = await fetch(`/api/tickets/${ticketId}/complete`, {
      method: 'PUT',

      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution }),
    });

    if (!response.ok) {

      throw new Error('Ошибка при завершении обращения');
    }

    alert('Обращение успешно завершено');
    fetchTickets();

  } catch (error) {
    console.error('Ошибка:', error);

    alert('Не удалось завершить обращение');
  }
}

// Функция для отмены обращения
async function cancelTicket(ticketId) {
  const reason =prompt('Введите причину отмены:');
  if (!reason) return;

  try {
    const response =await fetch(`/api/tickets/${ticketId}/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ cancellationReason: reason }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при отмене обращения');
    }

    alert('Обращение успешно отменено');
    fetchTickets();
  } catch (error) {
    console.error('Ошибка:', error);

    alert('Не удалось отменить обращение');
  }
}

// Функция для массовой отмены обращений со статусом "В работе"
async function cancelAllInWorkTickets() {
  try {

    const response = await fetch('/api/tickets/cancel-all-in-work', { method: 'PUT' });

    if (!response.ok) {
      throw new Error('Ошибка при массовой отмене обращений');
    }

    alert('Все обращения со статусом "В работе" успешно отменены');
    fetchTickets(); // Обновляем список после массовой отмены
  } catch (error) {

    console.error('Ошибка:', error);
    alert('Не удалось отменить обращения');
  }
}

// Привязываем обработчики событий
showTicketsButton.addEventListener('click', fetchTickets);

hideTicketsButton.addEventListener('click', hideTickets);

cancelAllButton.addEventListener('click', cancelAllInWorkTickets);

// Добавляем горячую клавишу для создания обращения
document.addEventListener('keydown', (e) => {
  if (e.key === 'n') {

    const topic = prompt('Введите тему обращения:');
    const description = prompt('Введите описание обращения:');
    if (topic && description) {
      createTicket(topic, description);
    }
  }
});