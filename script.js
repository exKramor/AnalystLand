document.addEventListener('DOMContentLoaded', function() {
    const assets = JSON.parse(localStorage.getItem('assets')) || [];
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    
    let currentAssetIndex = null;
    
    // Элементы модального окна
    const modal = document.getElementById('sellModal');
    const closeBtn = document.querySelector('.close');
    const sellTickerSpan = document.getElementById('sellTicker');
    const availableQuantitySpan = document.getElementById('availableQuantity');
    
    function renderAssets() {
        const tbody = document.getElementById('assetsList');
        tbody.innerHTML = '';
        
        assets.forEach((asset, index) => {
            if (asset.quantity > 0) {
                const tr = document.createElement('tr');
                const total = asset.price * asset.quantity;
                
                tr.innerHTML = `
                    <td>${asset.date}</td>
                    <td>${asset.ticker}</td>
                    <td>${asset.price.toFixed(2)}</td>
                    <td>${asset.quantity}</td>
                    <td>${total.toFixed(2)}</td>
                    <td>
                        <button class="sell-btn" data-index="${index}">Продать</button>
                        <button class="delete-btn" data-index="${index}">Удалить</button>
                    </td>
                `;
                
                tbody.appendChild(tr);
            }
        });
        
        // Обработчики для кнопок продажи
        document.querySelectorAll('.sell-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                currentAssetIndex = parseInt(this.getAttribute('data-index'));
                const asset = assets[currentAssetIndex];
                
                sellTickerSpan.textContent = asset.ticker;
                availableQuantitySpan.textContent = asset.quantity;
                document.getElementById('sellQuantity').max = asset.quantity;
                document.getElementById('sellQuantity').value = asset.quantity;
                document.getElementById('sellDate').valueAsDate = new Date();
                
                modal.style.display = 'block';
            });
        });
        
        // Обработчики для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (confirm('Удалить эту покупку?')) {
                    assets.splice(index, 1);
                    saveAndRender();
                }
            });
        });
    }
    
    function renderSales() {
        const tbody = document.getElementById('salesList');
        tbody.innerHTML = '';
        
        sales.forEach(sale => {
            const tr = document.createElement('tr');
            const profit = (sale.sellPrice - sale.buyPrice) * sale.quantity;
            const profitClass = profit >= 0 ? 'profit-positive' : 'profit-negative';
            
            tr.innerHTML = `
                <td>${sale.buyDate}</td>
                <td>${sale.sellDate}</td>
                <td>${sale.ticker}</td>
                <td>${sale.buyPrice.toFixed(2)}</td>
                <td>${sale.sellPrice.toFixed(2)}</td>
                <td>${sale.quantity}</td>
                <td class="${profitClass}">${profit.toFixed(2)}</td>
            `;
            
            tbody.appendChild(tr);
        });
    }
    
    function saveAndRender() {
        localStorage.setItem('assets', JSON.stringify(assets));
        localStorage.setItem('sales', JSON.stringify(sales));
        renderAssets();
        renderSales();
    }
    
    // Добавление покупки
    document.getElementById('addPurchase').addEventListener('click', function() {
        const ticker = document.getElementById('ticker').value.trim().toUpperCase();
        const price = parseFloat(document.getElementById('price').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const date = document.getElementById('date').value;
        
        if (ticker && !isNaN(price) && !isNaN(quantity) && date) {
            assets.push({
                ticker,
                price,
                quantity,
                date
            });
            
            // Очищаем поля формы
            document.getElementById('ticker').value = '';
            document.getElementById('price').value = '';
            document.getElementById('quantity').value = '';
            
            saveAndRender();
        } else {
            alert('Пожалуйста, заполните все поля корректно!');
        }
    });
    
    // Подтверждение продажи
    document.getElementById('confirmSell').addEventListener('click', function() {
        const sellPrice = parseFloat(document.getElementById('sellPrice').value);
        const sellQuantity = parseInt(document.getElementById('sellQuantity').value);
        const sellDate = document.getElementById('sellDate').value;
        
        if (!isNaN(sellPrice) && !isNaN(sellQuantity) && sellDate) {
            const asset = assets[currentAssetIndex];
            
            if (sellQuantity > asset.quantity) {
                alert('Недостаточно акций для продажи!');
                return;
            }
            
            // Добавляем запись о продаже
            sales.push({
                ticker: asset.ticker,
                buyPrice: asset.price,
                sellPrice,
                quantity: sellQuantity,
                buyDate: asset.date,
                sellDate
            });
            
            // Обновляем количество оставшихся акций
            asset.quantity -= sellQuantity;
            
            // Закрываем модальное окно
            modal.style.display = 'none';
            saveAndRender();
        } else {
            alert('Пожалуйста, заполните все поля корректно!');
        }
    });
    
    // Закрытие модального окна
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Устанавливаем сегодняшнюю дату по умолчанию
    document.getElementById('date').valueAsDate = new Date();
    
    // Первоначальная отрисовка
    renderAssets();
    renderSales();
});
