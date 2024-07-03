import json

# Define los pesos de las estadísticas según tu tabla
weights = {
    "Vitality": 0.2,
    "Strength": 1,
    "Intelligence": 1,
    "Luck": 1,
    "Agility": 1,
    "Wisdom": 3,
    "Power": 2,
    "Critical": 10,
    "PA": 100,
    "PM": 90,
    "Range": 51,
    "Summon": 30,
    "Damage": 20,
    "Neutral Resistance": 6,
    "Earth Resistance": 6,
    "Fire Resistance": 6,
    "Water Resistance": 6,
    "Air Resistance": 6,
    "Neutral % Resistance": 6,
    "Earth % Resistance": 6,
    "Fire % Resistance": 6,
    "Water % Resistance": 6,
    "Air % Resistance": 6,
    "Heals": 10,
    "Prospecting": 3,
    "Initiative": 0.1,
    "Pods": 0.25,
    "Pushback Resistance": 6,
    "Critical Resistance": 2,
    "Pushback Damage": 5,
    "Trap Power": 2,
    "Trap Damage": 5,
    "Reflect Damage": 10,
    "Melee Damage %": 15,
    "Distance Damage %": 15,
    "Spell Damage %": 15,
    "Weapon Damage %": 15,
    "Melee Resistance %": 15,
    "Distance Resistance %": 15
}

# Carga los datos del archivo JSON
def load_items_from_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        items = json.load(file)
    return items

# Calcula la eficiencia mínima y el peso rúnico perfecto del ítem
def calculate_min_efficiency_and_perfect_runic_weight(item, weights):
    perfect_weight = 0
    min_stats_weight = 0
    
    for stat in item['stats']:
        stat_name = stat['stat']
        if stat_name in weights:
            min_stat = stat['minStat'] if stat['minStat'] is not None else 0
            max_stat = stat['maxStat'] if stat['maxStat'] is not None else 0
            perfect_weight += max_stat * weights[stat_name]
            min_stats_weight += min_stat * weights[stat_name]
    
    # Calcular la eficiencia mínima
    min_efficiency = (min_stats_weight / perfect_weight) * 100 if perfect_weight > 0 else 0
    
    return perfect_weight, min_stats_weight, min_efficiency

# Función para mostrar la información del ítem
def display_item_info(item, perfect_weight, min_stats_weight, min_efficiency):
    item_name = item['name']['en']
    item_id = item['dofusID']
    item_type = item['itemType']
    
    print(f"Nombre del ítem: {item_name}")
    print(f"ID del ítem: {item_id}")
    print(f"Tipo del ítem: {item_type}")
    print(f"Peso rúnico perfecto: {perfect_weight:.2f}")
    print(f"Peso rúnico mínimo: {min_stats_weight:.2f}")
    print(f"- Eficiencia mínima: {min_efficiency:.2f}%")

# Función principal
def main():
    filename = 'items.json'  # Nombre del archivo JSON
    
    # Cargar los ítems desde el archivo JSON
    items = load_items_from_json(filename)
    
    while True:
        try:
            item_id = input("Ingresa el DofusID del ítem (o 'q' para salir): ")
            if item_id.lower() == 'q':
                break
            
            item_id = int(item_id)  # Convertir a entero
            
            # Buscar el ítem por su ID
            found_item = None
            for item in items:
                if int(item['dofusID']) == item_id:
                    found_item = item
                    break
            
            if found_item:
                # Calcular eficiencia mínima y peso rúnico perfecto del ítem
                perfect_weight, min_stats_weight, min_efficiency = calculate_min_efficiency_and_perfect_runic_weight(found_item, weights)
                
                # Mostrar la información del ítem
                display_item_info(found_item, perfect_weight, min_stats_weight, min_efficiency)
                print()
            else:
                print(f"No se encontró ningún ítem con el DofusID '{item_id}'. Inténtalo de nuevo.\n")
        
        except ValueError:
            print("Por favor, ingresa un número válido para el DofusID o 'q' para salir.\n")
    
    print("¡Gracias por usar el programa!")

# Ejecutar el programa principal
if __name__ == "__main__":
    main()
