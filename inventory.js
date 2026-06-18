// inventory.js - Система инвентаря и управления предметами

class Inventory {
    constructor() {
        this.slots = 9; // 9 слотов для предметов
        this.items = new Array(this.slots).fill(null);
        this.selectedSlot = 0;
        
        // Типы предметов
        this.itemTypes = {
            1: { name: 'Камень', id: 1, stackable: true, maxStack: 64 },
            2: { name: 'Грязь', id: 2, stackable: true, maxStack: 64 },
            3: { name: 'Трава', id: 3, stackable: true, maxStack: 64 },
            4: { name: 'Песок', id: 4, stackable: true, maxStack: 64 },
            5: { name: 'Вода', id: 5, stackable: false, maxStack: 1 },
        };
        
        // Инициализируем стартовые предметы
        this.initStartItems();
        this.setupUI();
    }
    
    initStartItems() {
        // Даем игроку стартовые предметы
        this.addItem(3, 64); // 64 травы
        this.addItem(1, 32); // 32 камня
        this.addItem(4, 32); // 32 песка
    }
    
    setupUI() {
        const slotsContainer = document.getElementById('inventory-slots');
        
        for (let i = 0; i < this.slots; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.id = `slot-${i}`;
            slot.dataset.slotIndex = i;
            
            slot.addEventListener('click', (e) => this.selectSlot(i));
            slot.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.selectSlot(i);
            });
            
            slotsContainer.appendChild(slot);
        }
        
        // Кнопки управления инвентарем
        document.getElementById('btn-inventory').addEventListener('click', () => this.toggleInventory());
        document.getElementById('btn-close-inventory').addEventListener('click', () => this.closeInventory());
        
        // Кнопки действий
        document.getElementById('btn-destroy').addEventListener('click', () => this.destroyBlock());
        document.getElementById('btn-place').addEventListener('click', () => this.placeBlock());
        
        this.updateUI();
    }
    
    addItem(itemId, count = 1) {
        if (!this.itemTypes[itemId]) return false;
        
        const itemType = this.itemTypes[itemId];
        let remaining = count;
        
        // Пытаемся добавить в существующие стеки
        if (itemType.stackable) {
            for (let i = 0; i < this.slots; i++) {
                if (this.items[i] && this.items[i].id === itemId) {
                    const canAdd = itemType.maxStack - this.items[i].count;
                    const toAdd = Math.min(remaining, canAdd);
                    this.items[i].count += toAdd;
                    remaining -= toAdd;
                    
                    if (remaining === 0) {
                        this.updateUI();
                        return true;
                    }
                }
            }
        }
        
        // Добавляем в пустые слоты
        for (let i = 0; i < this.slots; i++) {
            if (!this.items[i]) {
                const toAdd = itemType.stackable ? Math.min(remaining, itemType.maxStack) : 1;
                this.items[i] = {
                    id: itemId,
                    name: itemType.name,
                    count: toAdd
                };
                remaining -= toAdd;
                
                if (remaining === 0 || !itemType.stackable) {
                    this.updateUI();
                    return true;
                }
            }
        }
        
        this.updateUI();
        return remaining === 0;
    }
    
    removeItem(itemId, count = 1) {
        let removed = 0;
        
        for (let i = 0; i < this.slots; i++) {
            if (this.items[i] && this.items[i].id === itemId) {
                const toRemove = Math.min(count - removed, this.items[i].count);
                this.items[i].count -= toRemove;
                removed += toRemove;
                
                if (this.items[i].count === 0) {
                    this.items[i] = null;
                }
                
                if (removed === count) {
                    this.updateUI();
                    return true;
                }
            }
        }
        
        this.updateUI();
        return removed === count;
    }
    
    getSelectedItem() {
        return this.items[this.selectedSlot];
    }
    
    selectSlot(index) {
        if (index >= 0 && index < this.slots) {
            this.selectedSlot = index;
            this.updateUI();
        }
    }
    
    updateUI() {
        // Обновляем отображение слотов
        for (let i = 0; i < this.slots; i++) {
            const slotElement = document.getElementById(`slot-${i}`);
            const item = this.items[i];
            
            slotElement.innerHTML = '';
            
            if (i === this.selectedSlot) {
                slotElement.classList.add('selected');
            } else {
                slotElement.classList.remove('selected');
            }
            
            if (item) {
                slotElement.textContent = this.getItemEmoji(item.id);
                
                if (item.count > 1) {
                    const countDiv = document.createElement('div');
                    countDiv.className = 'inventory-slot-count';
                    countDiv.textContent = item.count;
                    slotElement.appendChild(countDiv);
                }
            }
        }
        
        // Обновляем выбранный блок в HUD
        const selectedItem = this.getSelectedItem();
        const selectedBlockDiv = document.getElementById('selected-block');
        if (selectedItem) {
            selectedBlockDiv.textContent = `${selectedItem.name} (${selectedItem.count})`;
        } else {
            selectedBlockDiv.textContent = 'Пусто';
        }
    }
    
    getItemEmoji(itemId) {
        const emojis = {
            1: '🪨', // Камень
            2: '🟤', // Грязь
            3: '🟢', // Трава
            4: '🟡', // Песок
            5: '💧', // Вода
        };
        return emojis[itemId] || '?';
    }
    
    toggleInventory() {
        const panel = document.getElementById('inventory-panel');
        panel.classList.toggle('hidden');
    }
    
    closeInventory() {
        const panel = document.getElementById('inventory-panel');
        panel.classList.add('hidden');
    }
    
    // Методы для интеграции с игровыми действиями
    placeBlock(world, player) {
        const selectedItem = this.getSelectedItem();
        if (!selectedItem) return;
        
        const targetBlock = world.getTargetBlock(player.camera);
        if (targetBlock) {
            const placePos = targetBlock.place;
            world.setBlock(placePos.x, placePos.y, placePos.z, selectedItem.id);
            this.removeItem(selectedItem.id, 1);
        }
    }
    
    destroyBlock(world, player) {
        const targetBlock = world.getTargetBlock(player.camera);
        if (targetBlock) {
            const targetPos = targetBlock.target;
            const blockType = world.getBlock(targetPos.x, targetPos.y, targetPos.z);
            
            if (blockType !== 0) {
                world.setBlock(targetPos.x, targetPos.y, targetPos.z, 0);
                this.addItem(blockType, 1);
            }
        }
    }
    
    // Сохранение инвентаря
    save() {
        return JSON.stringify(this.items);
    }
    
    // Загрузка инвентаря
    load(data) {
        try {
            this.items = JSON.parse(data);
            this.updateUI();
            return true;
        } catch (e) {
            console.error('Ошибка загрузки инвентаря:', e);
            return false;
        }
    }
}
