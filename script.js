document.getElementById('itemForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtiene el ID del ítem ingresado por el usuario
    const itemId = document.getElementById('itemId').value;
    
    // Realiza la solicitud al servidor o procesa localmente
    fetch('items.json')  // Cambia aquí si el nombre del archivo es diferente
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const item = data.find(item => item.dofusID == itemId);
            if (!item) {
                throw new Error(`No se encontró ningún ítem con el ID: ${itemId}`);
            }
            
            // Construye el HTML para mostrar la información del ítem
            const itemInfoHtml = `
                <div class="item-info">
                    <h2>Nombre del Ítem: ${item.name.en}</h2>
                    <p>ID del Ítem: ${item.dofusID}</p>
                    <p>Tipo del Ítem: ${item.itemType}</p>
                    <p>Nivel del Ítem: ${item.level}</p>
                    <p>Peso rúnico perfecto: ${calculatePerfectWeight(item.stats)}</p>
                    <p>Peso rúnico mínimo: ${calculateMinimumWeight(item.stats)}</p>
                    <p>Eficiencia mínima: ${calculateMinimumEfficiency(item.stats)}%</p>
                    <img src="${item.imageUrl}" alt="Imagen del ítem" class="img-fluid">
                    <h3>Estadísticas:</h3>
                    <ul>
                        ${generateStatsList(item.stats)}
                    </ul>
                </div>
            `;
            
            // Inserta el contenido en el contenedor destinado
            document.getElementById('itemInfoContainer').innerHTML = itemInfoHtml;
        })
        .catch(error => {
            console.error('Error al obtener información del ítem:', error);
            // Aquí puedes manejar el error según tus necesidades
        });
});

// Función para calcular el peso rúnico perfecto
function calculatePerfectWeight(stats) {
    let perfectWeight = 0;
    stats.forEach(stat => {
        if (stat.maxStat !== null) {
            perfectWeight += stat.maxStat * getWeight(stat.stat);
        }
    });
    return perfectWeight.toFixed(2);
}

// Función para calcular el peso rúnico mínimo
function calculateMinimumWeight(stats) {
    let minimumWeight = 0;
    stats.forEach(stat => {
        if (stat.minStat !== null) {
            minimumWeight += stat.minStat * getWeight(stat.stat);
        }
    });
    return minimumWeight.toFixed(2);
}

// Función para calcular la eficiencia mínima
function calculateMinimumEfficiency(stats) {
    let totalWeight = calculatePerfectWeight(stats);
    let minimumWeight = calculateMinimumWeight(stats);
    
    if (totalWeight === 0) return 0; // Evitar división por cero
    
    let efficiency = (minimumWeight / totalWeight) * 100;
    return efficiency.toFixed(2);
}

// Función para generar la lista de estadísticas
function generateStatsList(stats) {
    let statsHtml = '';
    stats.forEach(stat => {
        statsHtml += `<li>${stat.stat}: ${stat.minStat} - ${stat.maxStat}</li>`;
    });
    return statsHtml;
}

// Función para obtener el peso según la estadística
function getWeight(stat) {
    const weights = {
        "Vitality": 0.2,
        "Strength": 1,
        "Intelligence": 1,
        "Luck": 1,
        "Agility": 1,
        "Neutral Resistance": 6,
        "Earth Resistance": 6,
        "Fire Resistance": 6,
        "Water Resistance": 6,
        "Air Resistance": 6,
        "Pushback Resistance": 6,
        "Critical Resistance": 2,
        "Chance": 1,
        "Power": 2,
        "Prospecting": 3,
        "Water Damage": 5,
        "Air Damage": 5,
        "Earth Damage": 5,
        "Fire Damage": 5,
        "Heals": 10,
        "Range": 51,
        "Summons": 30,
        "Pushback Damage": 5,
        "Critical": 10,
        "PA": 100,
        "PM": 90,
        "Trap Power": 2,
        "Trap Damage": 5,
        "Reflect Damage": 10,
        "Melee Damage %": 15,
        "Distance Damage %": 15,
        "Spell Damage %": 15,
        "Weapon Damage %": 15,
        "Melee Resistance %": 15,
        "Distance Resistance %": 15
    };
    return weights[stat] || 0;
}
