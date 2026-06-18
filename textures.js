// textures.js - Система текстур и материалов для блоков

class TextureManager {
    constructor() {
        this.textures = new Map();
        this.materials = new Map();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.blockSize = 16; // Размер пиксела текстуры
        this.init();
    }
    
    init() {
        // Генерируем текстуры для всех блоков
        this.generateBlockTextures();
        this.createMaterials();
    }
    
    // Генерация текстур через canvas
    generateBlockTextures() {
        // Камень - серый с трещинами
        this.textures.set('stone', this.createStoneTexture());
        
        // Грязь - коричневая
        this.textures.set('dirt', this.createDirtTexture());
        
        // Трава - зелёная с коричневым снизу
        this.textures.set('grass', this.createGrassTexture());
        
        // Песок - жёлтый с зёрнами
        this.textures.set('sand', this.createSandTexture());
        
        // Дерево - коричневое с кольцами
        this.textures.set('wood', this.createWoodTexture());
        
        // Листья - зелёные с текстурой
        this.textures.set('leaves', this.createLeavesTexture());
        
        // Кирпич - красный с раствором
        this.textures.set('brick', this.createBrickTexture());
        
        // Булыжник - серый каменный
        this.textures.set('cobblestone', this.createCobblestoneTexture());
        
        // Обсидиан - чёрный блестящий
        this.textures.set('obsidian', this.createObsidianTexture());
        
        // Золотая руда
        this.textures.set('gold_ore', this.createGoldOreTexture());
        
        // Алмазная руда
        this.textures.set('diamond_ore', this.createDiamondOreTexture());
        
        // Железная руда
        this.textures.set('iron_ore', this.createIronOreTexture());
        
        // Вода - полупрозрачная голубая
        this.textures.set('water', this.createWaterTexture());
        
        // Стекло - прозрачное
        this.textures.set('glass', this.createGlassTexture());
        
        // Песчаник
        this.textures.set('sandstone', this.createSandstoneTexture());
        
        // Снег
        this.textures.set('snow', this.createSnowTexture());
        
        // Ледяной блок
        this.textures.set('ice', this.createIceTexture());
        
        // Глина
        this.textures.set('clay', this.createClayTexture());
        
        // Мох
        this.textures.set('moss', this.createMossTexture());
        
        // Светящийся камень
        this.textures.set('glowstone', this.createGlowstoneTexture());
    }
    
    // Функции для создания текстур
    createStoneTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        // Основной цвет
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 16, 16);
        
        // Трещины
        ctx.strokeStyle = '#606060';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            const x1 = Math.random() * 16;
            const y1 = Math.random() * 16;
            const x2 = x1 + (Math.random() - 0.5) * 10;
            const y2 = y1 + (Math.random() - 0.5) * 10;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // Шум
        this.addNoise(canvas, 0.1);
        
        return canvas;
    }
    
    createDirtTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        // Основной цвет
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, 0, 16, 16);
        
        // Частицы
        ctx.fillStyle = '#a0826d';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            const size = Math.random() * 1;
            ctx.fillRect(x, y, size, size);
        }
        
        this.addNoise(canvas, 0.15);
        
        return canvas;
    }
    
    createGrassTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        // Нижняя часть - грязь
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, 8, 16, 8);
        
        // Верхняя часть - трава
        ctx.fillStyle = '#00aa00';
        ctx.fillRect(0, 0, 16, 8);
        
        // Травинки
        ctx.strokeStyle = '#00cc00';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 16; i++) {
            const x = Math.random() * 16;
            ctx.beginPath();
            ctx.moveTo(x, 8);
            ctx.lineTo(x, Math.random() * 4 + 2);
            ctx.stroke();
        }
        
        this.addNoise(canvas, 0.1);
        
        return canvas;
    }
    
    createSandTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        // Основной цвет
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(0, 0, 16, 16);
        
        // Зёрна песка
        ctx.fillStyle = '#ffdd00';
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            const size = Math.random() * 0.5 + 0.5;
            ctx.fillRect(x, y, size, size);
        }
        
        this.addNoise(canvas, 0.2);
        
        return canvas;
    }
    
    createWoodTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        // Основной цвет
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(0, 0, 16, 16);
        
        // Кольца дерева
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 0.5;
        for (let r = 2; r < 8; r += 2) {
            ctx.beginPath();
            ctx.arc(8, 8, r, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Трещина
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(8, 16);
        ctx.stroke();
        
        this.addNoise(canvas, 0.12);
        
        return canvas;
    }
    
    createLeavesTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        // Основной цвет
        ctx.fillStyle = '#00bb00';
        ctx.fillRect(0, 0, 16, 16);
        
        // Листья
        ctx.fillStyle = '#00dd00';
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.beginPath();
            ctx.ellipse(x, y, Math.random() * 1.5 + 0.5, Math.random() * 1 + 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.addNoise(canvas, 0.15);
        
        return canvas;
    }
    
    createBrickTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        // Кирпичи
        ctx.fillStyle = '#cc4400';
        ctx.fillRect(0, 0, 16, 16);
        
        // Линии раствора
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(8, 16);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.lineTo(16, 8);
        ctx.stroke();
        
        this.addNoise(canvas, 0.1);
        
        return canvas;
    }
    
    createCobblestoneTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#707070';
        ctx.fillRect(0, 0, 16, 16);
        
        // Булыжники
        ctx.strokeStyle = '#505050';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, 8, 8);
        ctx.strokeRect(8, 0, 8, 8);
        ctx.strokeRect(0, 8, 8, 8);
        ctx.strokeRect(8, 8, 8, 8);
        
        this.addNoise(canvas, 0.15);
        
        return canvas;
    }
    
    createObsidianTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, 16, 16);
        
        // Блеск
        ctx.fillStyle = 'rgba(100, 100, 150, 0.3)';
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, Math.random() * 2 + 1, Math.random() * 2 + 1);
        }
        
        return canvas;
    }
    
    createGoldOreTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 16, 16);
        
        // Золотые вкрапления
        ctx.fillStyle = '#ffcc00';
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
        }
        
        this.addNoise(canvas, 0.1);
        
        return canvas;
    }
    
    createDiamondOreTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 16, 16);
        
        // Алмазы
        ctx.fillStyle = '#00ffff';
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.beginPath();
            ctx.moveTo(x, y - 2);
            ctx.lineTo(x + 2, y);
            ctx.lineTo(x, y + 2);
            ctx.lineTo(x - 2, y);
            ctx.closePath();
            ctx.fill();
        }
        
        this.addNoise(canvas, 0.1);
        
        return canvas;
    }
    
    createIronOreTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 16, 16);
        
        // Железо
        ctx.fillStyle = '#cccccc';
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.fillRect(x, y, Math.random() * 2 + 1, Math.random() * 2 + 1);
        }
        
        this.addNoise(canvas, 0.1);
        
        return canvas;
    }
    
    createWaterTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        // Волны
        const gradient = ctx.createLinearGradient(0, 0, 16, 16);
        gradient.addColorStop(0, '#0066ff');
        gradient.addColorStop(1, '#0044cc');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
        
        // Рябь
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * 16, Math.random() * 16, Math.random() * 3 + 1, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    createGlassTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        // Полупрозрачное
        ctx.fillStyle = 'rgba(200, 220, 255, 0.3)';
        ctx.fillRect(0, 0, 16, 16);
        
        // Блик
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(2, 2, 3, 3);
        
        return canvas;
    }
    
    createSandstoneTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#f4a460';
        ctx.fillRect(0, 0, 16, 16);
        
        // Слои
        ctx.fillStyle = '#daa520';
        ctx.fillRect(0, 0, 16, 4);
        ctx.fillRect(0, 12, 16, 4);
        
        // Текстура
        this.addNoise(canvas, 0.15);
        
        return canvas;
    }
    
    createSnowTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 16, 16);
        
        // Тень
        ctx.fillStyle = 'rgba(200, 200, 220, 0.3)';
        for (let i = 0; i < 15; i++) {
            ctx.fillRect(Math.random() * 16, Math.random() * 16, Math.random() * 2, Math.random() * 2);
        }
        
        return canvas;
    }
    
    createIceTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#b4e7ff';
        ctx.fillRect(0, 0, 16, 16);
        
        // Лёд с трещинами
        ctx.strokeStyle = '#a0d8ff';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * 16, 0);
            ctx.lineTo(Math.random() * 16, 16);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    createClayTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#c9b59a';
        ctx.fillRect(0, 0, 16, 16);
        
        this.addNoise(canvas, 0.2);
        
        return canvas;
    }
    
    createMossTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#6b8e23';
        ctx.fillRect(0, 0, 16, 16);
        
        // Мох
        ctx.fillStyle = '#7cb342';
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            ctx.beginPath();
            ctx.ellipse(x, y, Math.random() * 1 + 0.5, Math.random() * 0.5 + 0.3, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.addNoise(canvas, 0.1);
        
        return canvas;
    }
    
    createGlowstoneTexture() {
        const canvas = this.createCanvas();
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(0, 0, 16, 16);
        
        // Свечение
        ctx.fillStyle = 'rgba(255, 255, 100, 0.4)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 16;
            const y = Math.random() * 16;
            const r = Math.random() * 1 + 0.5;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
            gradient.addColorStop(0, 'rgba(255, 255, 150, 0.6)');
            gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return canvas;
    }
    
    // Вспомогательные функции
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        return canvas;
    }
    
    addNoise(canvas, intensity) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, 16, 16);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * intensity * 100;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    // Создание материалов
    createMaterials() {
        const textureLoader = new THREE.CanvasTexture;
        
        const blockConfig = [
            { id: 1, name: 'stone', textureKey: 'stone', color: 0x808080 },
            { id: 2, name: 'dirt', textureKey: 'dirt', color: 0x8b7355 },
            { id: 3, name: 'grass', textureKey: 'grass', color: 0x00aa00 },
            { id: 4, name: 'sand', textureKey: 'sand', color: 0xffff00 },
            { id: 5, name: 'water', textureKey: 'water', color: 0x0066ff, transparent: true },
            { id: 6, name: 'wood', textureKey: 'wood', color: 0x8b4513 },
            { id: 7, name: 'leaves', textureKey: 'leaves', color: 0x00bb00, transparent: true },
            { id: 8, name: 'brick', textureKey: 'brick', color: 0xcc4400 },
            { id: 9, name: 'cobblestone', textureKey: 'cobblestone', color: 0x707070 },
            { id: 10, name: 'obsidian', textureKey: 'obsidian', color: 0x0a0a0a },
        ];
        
        blockConfig.forEach(config => {
            const textureCanvas = this.textures.get(config.textureKey);
            const texture = new THREE.CanvasTexture(textureCanvas);
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                color: config.color,
                roughness: 0.8,
                metalness: 0.1,
                transparent: config.transparent || false,
                side: THREE.FrontSide
            });
            
            this.materials.set(config.id, material);
        });
    }
    
    getMaterial(blockId) {
        return this.materials.get(blockId) || this.materials.get(1); // Камень по умолчанию
    }
}
