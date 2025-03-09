document.addEventListener('DOMContentLoaded', () => {

  const showTicketsBtn =   document.getElementById('show-tickets-btn');
  const   hideTicketsBtn = document.getElementById('hide-tickets-btn');
  const  ticketListDiv = document.getElementById('ticket-list');

  // Кнопка, чтобы показывать список обращений
  showTicketsBtn.addEventListener('click', async () => {

    try {
      // Запрос к серверу, чтобы получить обращения
      const  response = await fetch('http://localhost:3000/api/tickets');


      if (!response.ok) {
         throw new Error('Не удалось загрузить список обращений, проверьте сервер');
      }

      // Ответ от сервера в JSON
      const tickets =await response.json();

      // Очистка списка
      ticketListDiv.innerHTML = '';

      // Пустой список
      if (tickets.length ===0) {
        ticketListDiv.innerHTML = '<p>Нет доступных обращений.</p>';
      } else {
        // Перебор обращений
        tickets.forEach(ticket => {
          const ticketDiv =document.createElement('div');

          // Добавление класса
          ticketDiv.classList.add('ticket');

          // Блок об обращении
          ticketDiv.innerHTML = `
            <p><strong>Тема:</strong> ${ticket.topic}</p>  
            <p><strong>Описание:</strong> ${ticket.description}</p>  
            <p><strong>Статус:</strong> ${ticket.status}</p>  
          `;

          // Добавление обращения в б лок
          ticketListDiv.appendChild(ticketDiv);
        });
      }

      // Показываю блок со списком
      ticketListDiv.style.display= 'block';

    } catch (error) {
      // ЕСообщение об ошибки
      alert(error.message);
    }

  });

  // Скрыть обращения
  hideTicketsBtn.addEventListener('click', () => {
    // Блок обращений
    ticketListDiv.style.display = 'none';
  });

});