// Данные для графа
const skillsData = {
    nodes: [
        { id: 1, name: "Аналитика", group: "analytics", level: 3 },
        { id: 2, name: "Инвестиции", group: "investments", level: 3 },
        { id: 3, name: "Python", group: "analytics", level: 2 },
        { id: 4, name: "Статистика", group: "analytics", level: 2 },
        { id: 5, name: "Визуализация", group: "analytics", level: 2 },
        { id: 6, name: "Основы Python", group: "analytics", level: 1 },
        { id: 7, name: "Pandas", group: "analytics", level: 1 },
        { id: 8, name: "SQL", group: "analytics", level: 2 },
        { id: 9, name: "A/B тестирование", group: "analytics", level: 2 },

    ],
    links: [
        { source: 1, target: 2, value: 2 },
        { source: 1, target: 3, value: 2 },
        { source: 1, target: 4, value: 2 },
        { source: 1, target: 5, value: 2 },
        { source: 3, target: 6, value: 2 },
        { source: 3, target: 7, value: 2 },
        { source: 1, target: 8, value: 2 },
        { source: 1, target: 9, value: 2 },

    ]
};

// Инициализация графа
function initGraph() {
    const container = document.getElementById('skills-graph');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select("#skills-graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const colorScale = d3.scaleOrdinal()
        .domain(["analytics", "investments"])
        .range(["#3498db", "#e74c3c"]);

    const sizeScale = d3.scaleLinear()
        .domain([1, 3])
        .range([15, 35]);

    const simulation = d3.forceSimulation(skillsData.nodes)
        .force("link", d3.forceLink(skillsData.links).id(d => d.id).distance(120))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => sizeScale(d.level) + 5));

    const link = svg.append("g")
        .selectAll("line")
        .data(skillsData.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .selectAll(".node-group")
        .data(skillsData.nodes)
        .enter().append("g")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("circle")
        .attr("class", "node")
        .attr("r", d => sizeScale(d.level))
        .attr("fill", d => colorScale(d.group))
        .on("click", handleNodeClick);

    node.append("text")
        .attr("class", "node-label")
        .text(d => d.name)
        .attr("dy", d => -sizeScale(d.level) - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", d => sizeScale(d.level) / 2 + "px")
        .on("click", handleNodeClick);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function handleNodeClick(event, d) {
        showInfoBlock(d.name);
    }
}

function showInfoBlock(sectionName) {
    const section = document.getElementById('chart-section');
    const infoContainer = document.getElementById('investment-info');
    const title = document.getElementById('section-title');
    
    // Обновляем заголовок
    title.textContent = sectionName;
    
    // Устанавливаем одинаковый контент для всех разделов
    infoContainer.innerHTML = `
        <div class="info-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p>Информация дополняется</p>
            <small>Раздел находится в разработке</small>
        </div>
    `;
    
    // Показываем блок с анимацией
    section.classList.remove('hidden');
    section.classList.add('visible');
    
    // Плавный скролл
    setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initGraph);
