document.addEventListener('DOMContentLoaded', function() {
    const trades = JSON.parse(localStorage.getItem('trades')) || [];
    
    function renderTrades() {
        const tbody = document.getElementById('tradesList');
        tbody.innerHTML = '';
        
        trades.forEach((trade, index) => {
            const tr = document.createElement('tr');
            const total = trade.price * trade.quantity;
            
            tr.innerHTML = `
                <td>${trade.date}</td>
                <td>${trade.ticker}</td>
                <td>${trade.operation === 'buy' ? 'Покупка' : 'Продажа'}</td>
                <td>${trade.price.toFixed(2)}</td>
                <td>${trade.quantity}</td>
                <td>${total.toFixed(2)}</td>
                <td><button class="delete-btn" data-index="${index}">Удалить</button></td>
            `;
            
            tbody.appendChild(tr);
        });
        
        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                trades.splice(index, 1);
                localStorage.setItem('trades', JSON.stringify(trades));
                renderTrades();
            });
        });
    }
    
    document.getElementById('addTrade').addEventListener('click', function() {
        const ticker = document.getElementById('ticker').value.trim().toUpperCase();
        const operation = document.getElementById('operation').value;
        const price = parseFloat(document.getElementById('price').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const date = document.getElementById('date').value;
        
        if (ticker && !isNaN(price) && !isNaN(quantity) && date) {
            trades.push({
                ticker,
                operation,
                price,
                quantity,
                date
            });
            
            localStorage.setItem('trades', JSON.stringify(trades));
            renderTrades();
            
            // Очищаем поля формы
            document.getElementById('ticker').value = '';
            document.getElementById('price').value = '';
            document.getElementById('quantity').value = '';
        } else {
            alert('Пожалуйста, заполните все поля корректно!');
        }
    });
    
    // Устанавливаем сегодняшнюю дату по умолчанию
    document.getElementById('date').valueAsDate = new Date();
    
    // Первоначальная отрисовка
    renderTrades();
});
