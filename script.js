document.addEventListener('DOMContentLoaded', function() {
    const purchases = JSON.parse(localStorage.getItem('stockPurchases')) || [];
    
    function renderPurchases() {
        const tbody = document.getElementById('purchasesList');
        tbody.innerHTML = '';
        
        purchases.forEach((purchase, index) => {
            const tr = document.createElement('tr');
            const total = purchase.price * purchase.quantity;
            
            tr.innerHTML = `
                <td>${purchase.date}</td>
                <td>${purchase.ticker.toUpperCase()}</td>
                <td>${purchase.price.toFixed(2)}</td>
                <td>${purchase.quantity}</td>
                <td>${total.toFixed(2)}</td>
                <td class="comment" title="${purchase.comment || ''}">${purchase.comment || '-'}</td>
                <td><button class="delete-btn" data-index="${index}">Удалить</button></td>
            `;
            
            tbody.appendChild(tr);
        });
        
        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm('Удалить эту покупку?')) {
                    purchases.splice(index, 1);
                    saveAndRender();
                }
            });
        });
    }
    
    function saveAndRender() {
        localStorage.setItem('stockPurchases', JSON.stringify(purchases));
        renderPurchases();
    }
    
    // Добавление покупки
    document.getElementById('addPurchase').addEventListener('click', function() {
        const ticker = document.getElementById('ticker').value.trim();
        const price = parseFloat(document.getElementById('price').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const date = document.getElementById('date').value;
        const comment = document.getElementById('comment').value.trim();
        
        if (ticker && !isNaN(price) && !isNaN(quantity) && date) {
            purchases
