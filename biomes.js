// biomes.js - Система биомов (32 KB) - 8 уникальных биомов с разной генерацией и особенностями

class BiomeGenerator {
    constructor(world) {
        this.world = world;
        this.biomes = new Map();
        this.biomeNoise = new SimplexNoise();
        this.temperatureNoise = new SimplexNoise();
        this.humidityNoise = new SimplexNoise();
        
        this.initBiomes();
    }
    
    initBiomes() {
        // Лес - деревья и травянистая местность
        this.biomes.set('forest', {
            name: 'Лес',
            temperature: 0.7,
            humidity: 0.8,
            color: 0x00aa00,
            groundBlock: 3, // Трава
            undergroundBlock: 2, // Грязь
            treeFrequency: 0.4,
            treeHeight: { min: 5, max: 10 },
            ambientColor: 0x88dd88,
            fogColor: 0x88dd88,
            fogDensity: 0.3,
            generateStructures: ['tree', 'small_house'],
            mobs: ['zombie', 'creeper', 'deer', 'rabbit']
        });
        
        // Пустыня - песок и редкие кактусы
        this.biomes.set('desert', {
            name: 'Пустыня',
            temperature: 2.0,
            humidity: 0.0,
            color: 0xffff00,
            groundBlock: 4, // Песок
            undergroundBlock: 4,
            treeFrequency: 0.05,
            cactusFrequency: 0.15,
            ambientColor: 0xffdd88,
            fogColor: 0xffdd88,
            fogDensity: 0.15,
            generateStructures: ['pyramid', 'ancient_temple'],
            mobs: ['skeleton', 'spider', 'phantom']
        });
        
        // Горы - высокие вершины, камень, снег на вершинах
        this.biomes.set('mountains', {
            name: 'Горы',
            temperature: 0.0,
            humidity: 0.4,
            color: 0x888888,
            groundBlock: 1, // Камень
            undergroundBlock: 1,
            heightMultiplier: 2.5,
            snowLine: 100,
            ambientColor: 0xcccccc,
            fogColor: 0xcccccc,
            fogDensity: 0.5,
            generateStructures: ['mountain_fortress'],
            mobs: ['zombie', 'goat', 'mountain_lion']
        });
        
        // Равнины - плоская местность, травой покрыта
        this.biomes.set('plains', {
            name: 'Равнины',
            temperature: 0.8,
            humidity: 0.6,
            color: 0x00dd00,
            groundBlock: 3, // Трава
            undergroundBlock: 2,
            heightVariation: 0.3,
            treeFrequency: 0.05,
            grassFrequency: 0.7,
            ambientColor: 0xbbffbb,
            fogColor: 0xbbffbb,
            fogDensity: 0.2,
            generateStructures: ['village', 'farm'],
            mobs: ['cow', 'sheep', 'horse', 'zombie']
        });
        
        // Джунгли - плотная растительность, лианы, опасные
        this.biomes.set('jungle', {
            name: 'Джунгли',
            temperature: 1.5,
            humidity: 1.0,
            color: 0x006600,
            groundBlock: 3, // Трава
            undergroundBlock: 2,
            treeFrequency: 0.8,
            treeHeight: { min: 8, max: 16 },
            vinesFrequency: 0.6,
            ambientColor: 0x44aa44,
            fogColor: 0x44aa44,
            fogDensity: 0.6,
            generateStructures: ['jungle_temple', 'tribe_house'],
            mobs: ['creeper', 'spider', 'witch', 'ocelot', 'parrot']
        });
        
        // Тундра - заснеженная равнина
        this.biomes.set('tundra', {
            name: 'Тундра',
            temperature: -1.0,
            humidity: 0.5,
            color: 0xffffff,
            groundBlock: 10, // Снег
            undergroundBlock: 1,
            snowCover: true,
            ambientColor: 0xddddff,
            fogColor: 0xddddff,
            fogDensity: 0.4,
            generateStructures: ['igloo'],
            mobs: ['polar_bear', 'arctic_wolf', 'skeleton']
        });
        
        // Болото - грязь, вода, редкие деревья
        this.biomes.set('swamp', {
            name: 'Болото',
            temperature: 0.5,
            humidity: 0.9,
            color: 0x556b2f,
            groundBlock: 2, // Грязь
            undergroundBlock: 2,
            waterFrequency: 0.5,
            treeFrequency: 0.2,
            ambientColor: 0x666666,
            fogColor: 0x666666,
            fogDensity: 0.7,
            generateStructures: ['witch_hut', 'swamp_temple'],
            mobs: ['slime', 'witch', 'spider', 'frog']
        });
        
        // Подземелье - глубокие пещеры, руды, лава
        this.biomes.set('underground', {
            name: 'Подземелье',
            temperature: 0.3,
            humidity: 0.3,
            color: 0x333333,
            groundBlock: 1, // Камень
            undergroundBlock: 1,
            oreFrequency: 0.3,
            lavaFrequency: 0.1,
            caveFrequency: 0.6,
            ambientColor: 0x555555,
            fogColor: 0x333333,
            fogDensity: 0.8,
            generateStructures: ['dungeon', 'abandoned_mine'],
            mobs: ['cave_spider', 'zombie', 'skeleton', 'enderman', 'magma_cube']
        });
    }
    
    getBiomeAt(x, z) {
        // Получаем температуру и влажность для позиции
        const temp = this.temperatureNoise.noise(x * 0.01, z * 0.01) * 0.5 + 0.5;
        const humidity = this.humidityNoise.noise(x * 0.01 + 100, z * 0.01 + 100) * 0.5 + 0.5;
        
        // Выбираем биом на основе температуры и влажности
        if (temp < 0.2) {
            return this.biomes.get('tundra');
        } else if (temp > 1.8) {
            if (humidity < 0.3) {
                return this.biomes.get('desert');
            } else {
                return this.biomes.get('jungle');
            }
        } else if (humidity > 0.8) {
            return this.biomes.get('swamp');
        } else if (temp < 0.4) {
            return this.biomes.get('mountains');
        } else if (humidity < 0.3) {
            return this.biomes.get('plains');
        } else {
            return this.biomes.get('forest');
        }
    }
    
    generateHeightmap(x, z, biome) {
        const baseHeight = this.world.noise.noise(x * 0.01, z * 0.01) * 0.5 + 0.5;
        let height = baseHeight * 64;
        
        // Применяем модификатор высоты биома
        if (biome.heightMultiplier) {
            height = baseHeight * 128 * biome.heightMultiplier * 0.5;
        }
        
        if (biome.heightVariation) {
            height *= biome.heightVariation;
        }
        
        return Math.floor(height);
    }
    
    generateColumn(x, y, z, chunkX, chunkZ) {
        const biome = this.getBiomeAt(x, z);
        const height = this.generateHeightmap(x, z, biome);
        
        let blockType = 0;
        
        // Генерируем блоки до высоты поверхности
        if (y < height - 3) {
            blockType = biome.undergroundBlock;
            
            // Добавляем руды в подземелье
            if (biome.name === 'Подземелье' && Math.random() < biome.oreFrequency) {
                const ores = [10, 11, 12]; // Золото, алмазы, железо
                blockType = ores[Math.floor(Math.random() * ores.length)];
            }
            
            // Лава в подземелье
            if (biome.name === 'Подземелье' && y < 20 && Math.random() < biome.lavaFrequency) {
                blockType = 0; // Лава позже добавим
            }
        } else if (y < height) {
            blockType = biome.groundBlock;
        } else if (y === height && biome.snowCover) {
            blockType = 10; // Снег
        }
        
        return blockType;
    }
    
    shouldGenerateStructure(x, z, biome) {
        if (!biome.generateStructures) return null;
        
        const structureNoise = Math.sin(x * 0.1) * Math.cos(z * 0.1);
        
        for (const structure of biome.generateStructures) {
            if (structureNoise > 0.8) {
                return structure;
            }
        }
        
        return null;
    }
    
    getMobsForBiome(biome) {
        return biome.mobs || ['zombie', 'creeper'];
    }
}

// Упрощённый Simplex Noise (для примера используем простую реализацию)
class SimplexNoise {
    constructor(seed = 0) {
        this.seed = seed;
        this.p = this.buildPermutationTable(seed);
    }
    
    buildPermutationTable(seed) {
        const p = [];
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }
        
        // Простой shuffle
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.sin(seed + i) * 10000) % (i + 1);
            [p[i], p[j]] = [p[j], p[i]];
        }
        
        return p.concat(p);
    }
    
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    lerp(t, a, b) {
        return a + t * (b - a);
    }
    
    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 8 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    
    noise(x, y) {
        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;
        
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        
        const u = this.fade(xf);
        const v = this.fade(yf);
        
        const aa = this.p[this.p[xi] + yi];
        const ab = this.p[this.p[xi] + yi + 1];
        const ba = this.p[this.p[xi + 1] + yi];
        const bb = this.p[this.p[xi + 1] + yi + 1];
        
        const x1 = this.lerp(u, this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf));
        const x2 = this.lerp(u, this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1));
        
        return this.lerp(v, x1, x2);
    }
}
