// world.js - Система генерации и управления миром

class World {
    constructor(scene) {
        this.scene = scene;
        this.chunks = new Map(); // Хранилище чанков
        this.chunkSize = 16; // Размер чанка (16x16x16 блоков)
        this.blockSize = 1;
        this.renderDistance = 2; // Дальность отрисовки в чанках
        this.blocks = new Map(); // Все блоки с их типами
        
        // Типы блоков
        this.blockTypes = {
            0: { name: 'Воздух', color: 0xffffff, walkable: true },
            1: { name: 'Камень', color: 0x808080, walkable: false },
            2: { name: 'Грязь', color: 0x8b7355, walkable: false },
            3: { name: 'Трава', color: 0x00aa00, walkable: false },
            4: { name: 'Песок', color: 0xffff00, walkable: false },
            5: { name: 'Вода', color: 0x0066ff, walkable: false, transparent: true },
        };
        
        this.raycaster = new THREE.Raycaster();
        this.targetBlocks = []; // Для определения целевого блока
        
        this.init();
    }
    
    init() {
        // Инициализация мира - загрузим чанки вокруг спавна
        this.loadChunksAround(0, 0, 0);
    }
    
    // Простой шум Перлина (упрощённая версия для генерации высот)
    perlin(x, z, seed = 0) {
        const n = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453;
        return n - Math.floor(n);
    }
    
    // Улучшенный шум с интерполяцией
    smoothNoise(x, z) {
        const xi = Math.floor(x);
        const zi = Math.floor(z);
        const xf = x - xi;
        const zf = z - zi;
        
        // Интерполяционная функция
        const interpolate = (a, b, t) => {
            const ft = t * Math.PI;
            const f = (1 - Math.cos(ft)) * 0.5;
            return a * (1 - f) + b * f;
        };
        
        const n00 = this.perlin(xi, zi);
        const n10 = this.perlin(xi + 1, zi);
        const n01 = this.perlin(xi, zi + 1);
        const n11 = this.perlin(xi + 1, zi + 1);
        
        const nx0 = interpolate(n00, n10, xf);
        const nx1 = interpolate(n01, n11, xf);
        return interpolate(nx0, nx1, zf);
    }
    
    // Генерация высоты местности
    generateHeight(x, z) {
        let height = 0;
        let amplitude = 1;
        let frequency = 1;
        let maxValue = 0;
        
        // Несколько октав шума для более естественного рельефа
        for (let i = 0; i < 4; i++) {
            height += this.smoothNoise(x * frequency * 0.05, z * frequency * 0.05) * amplitude;
            maxValue += amplitude;
            amplitude *= 0.5;
            frequency *= 2;
        }
        
        height = (height / maxValue) * 16 + 32; // Высота от 32 до 48 блоков
        return Math.floor(height);
    }
    
    // Генерация чанка
    generateChunk(chunkX, chunkZ) {
        const chunkKey = `${chunkX},${chunkZ}`;
        
        if (this.chunks.has(chunkKey)) {
            return this.chunks.get(chunkKey);
        }
        
        const chunk = {
            x: chunkX,
            z: chunkZ,
            blocks: {},
            mesh: null,
            geometry: null,
            needsUpdate: true
        };
        
        // Генерируем блоки для чанка
        const startX = chunkX * this.chunkSize;
        const startZ = chunkZ * this.chunkSize;
        
        for (let x = 0; x < this.chunkSize; x++) {
            for (let z = 0; z < this.chunkSize; z++) {
                const worldX = startX + x;
                const worldZ = startZ + z;
                const height = this.generateHeight(worldX, worldZ);
                
                for (let y = 0; y < 64; y++) {
                    let blockType = 0; // Воздух по умолчанию
                    
                    if (y < height - 3) {
                        blockType = 1; // Камень
                    } else if (y < height - 1) {
                        blockType = 2; // Грязь
                    } else if (y < height) {
                        blockType = 3; // Трава
                    } else if (y < 32) {
                        blockType = 5; // Вода
                    }
                    
                    const blockKey = `${worldX},${y},${worldZ}`;
                    const localKey = `${x},${y},${z}`;
                    
                    chunk.blocks[localKey] = blockType;
                    this.blocks.set(blockKey, blockType);
                }
            }
        }
        
        this.chunks.set(chunkKey, chunk);
        this.updateChunkMesh(chunk);
        
        return chunk;
    }
    
    // Обновление mesh чанка
    updateChunkMesh(chunk) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        const startX = chunk.x * this.chunkSize;
        const startZ = chunk.z * this.chunkSize;
        
        // Перебираем все блоки в чанке
        for (let x = 0; x < this.chunkSize; x++) {
            for (let z = 0; z < this.chunkSize; z++) {
                for (let y = 0; y < 64; y++) {
                    const localKey = `${x},${y},${z}`;
                    const blockType = chunk.blocks[localKey];
                    
                    if (blockType === 0) continue; // Пропускаем воздух
                    
                    const blockInfo = this.blockTypes[blockType];
                    const color = new THREE.Color(blockInfo.color);
                    
                    const worldX = startX + x;
                    const worldZ = startZ + z;
                    
                    // Добавляем куб для каждого блока
                    this.addBlockGeometry(
                        vertices, colors, 
                        worldX, y, worldZ,
                        color, blockType
                    );
                }
            }
        }
        
        if (vertices.length > 0) {
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
            
            const material = new THREE.MeshStandardMaterial({
                vertexColors: true,
                roughness: 0.8,
                metalness: 0.1,
                wireframe: false
            });
            
            // Удаляем старый mesh если существует
            if (chunk.mesh) {
                this.scene.remove(chunk.mesh);
                chunk.geometry.dispose();
                chunk.mesh.material.dispose();
            }
            
            const mesh = new THREE.Mesh(geometry, material);
            chunk.mesh = mesh;
            chunk.geometry = geometry;
            
            this.scene.add(mesh);
        }
        
        chunk.needsUpdate = false;
    }
    
    // Добавление геометрии куба для блока
    addBlockGeometry(vertices, colors, x, y, z, color, blockType) {
        const size = this.blockSize;
        
        // Проверяем соседние блоки
        const neighbors = {
            top: this.getBlock(x, y + 1, z) === 0,
            bottom: this.getBlock(x, y - 1, z) === 0,
            front: this.getBlock(x, z + 1, y) === 0,
            back: this.getBlock(x, z - 1, y) === 0,
            right: this.getBlock(x + 1, y, z) === 0,
            left: this.getBlock(x - 1, y, z) === 0
        };
        
        // Только добавляем видимые грани
        if (neighbors.top) this.addFace(vertices, colors, x, y + size, z, 'top', color, size);
        if (neighbors.bottom) this.addFace(vertices, colors, x, y, z, 'bottom', color, size);
        if (neighbors.front) this.addFace(vertices, colors, x, y, z + size, 'front', color, size);
        if (neighbors.back) this.addFace(vertices, colors, x, y, z, 'back', color, size);
        if (neighbors.right) this.addFace(vertices, colors, x + size, y, z, 'right', color, size);
        if (neighbors.left) this.addFace(vertices, colors, x, y, z, 'left', color, size);
    }
    
    // Добавление грани куба
    addFace(vertices, colors, x, y, z, face, color, size) {
        const positions = {
            top: [
                [x, y, z], [x + size, y, z], [x + size, y, z + size],
                [x, y, z], [x + size, y, z + size], [x, y, z + size]
            ],
            bottom: [
                [x, y, z], [x, y, z + size], [x + size, y, z + size],
                [x, y, z], [x + size, y, z + size], [x + size, y, z]
            ],
            front: [
                [x, y, z + size], [x + size, y, z + size], [x + size, y + size, z + size],
                [x, y, z + size], [x + size, y + size, z + size], [x, y + size, z + size]
            ],
            back: [
                [x, y, z], [x, y + size, z], [x + size, y + size, z],
                [x, y, z], [x + size, y + size, z], [x + size, y, z]
            ],
            right: [
                [x + size, y, z], [x + size, y + size, z], [x + size, y + size, z + size],
                [x + size, y, z], [x + size, y + size, z + size], [x + size, y, z + size]
            ],
            left: [
                [x, y, z], [x, y, z + size], [x, y + size, z + size],
                [x, y, z], [x, y + size, z + size], [x, y + size, z]
            ]
        };
        
        const facePositions = positions[face];
        for (let pos of facePositions) {
            vertices.push(pos[0], pos[1], pos[2]);
            colors.push(color.r, color.g, color.b);
        }
    }
    
    // Получение блока по координатам
    getBlock(x, y, z) {
        if (y < 0 || y >= 64) return 0; // Воздух за пределами высоты
        
        const blockKey = `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
        return this.blocks.get(blockKey) || 0;
    }
    
    // Установка блока
    setBlock(x, y, z, blockType) {
        x = Math.floor(x);
        y = Math.floor(y);
        z = Math.floor(z);
        
        const blockKey = `${x},${y},${z}`;
        this.blocks.set(blockKey, blockType);
        
        // Определяем чанк, который нужно обновить
        const chunkX = Math.floor(x / this.chunkSize);
        const chunkZ = Math.floor(z / this.chunkSize);
        
        // Обновляем чанк и соседние если нужно
        this.updateChunkIfExists(chunkX, chunkZ);
        if (x % this.chunkSize === 0) this.updateChunkIfExists(chunkX - 1, chunkZ);
        if (z % this.chunkSize === 0) this.updateChunkIfExists(chunkX, chunkZ - 1);
    }
    
    // Обновление чанка если он существует
    updateChunkIfExists(chunkX, chunkZ) {
        const chunkKey = `${chunkX},${chunkZ}`;
        if (this.chunks.has(chunkKey)) {
            const chunk = this.chunks.get(chunkKey);
            this.updateChunkMesh(chunk);
        }
    }
    
    // Загрузка чанков вокруг позиции
    loadChunksAround(playerX, playerY, playerZ) {
        const chunkX = Math.floor(playerX / this.chunkSize);
        const chunkZ = Math.floor(playerZ / this.chunkSize);
        
        for (let cx = chunkX - this.renderDistance; cx <= chunkX + this.renderDistance; cx++) {
            for (let cz = chunkZ - this.renderDistance; cz <= chunkZ + this.renderDistance; cz++) {
                this.generateChunk(cx, cz);
            }
        }
    }
    
    // Raycast для определения целевого блока
    getTargetBlock(camera, maxDistance = 5) {
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        
        const targetBlocks = [];
        for (let chunk of this.chunks.values()) {
            if (chunk.mesh) {
                targetBlocks.push(chunk.mesh);
            }
        }
        
        const intersects = this.raycaster.intersectObjects(targetBlocks);
        
        if (intersects.length > 0) {
            const intersection = intersects[0];
            const point = intersection.point;
            const normal = intersection.face.normal;
            
            // Определяем целевой блок и его соседа для установки
            const targetPos = {
                x: Math.floor(point.x),
                y: Math.floor(point.y),
                z: Math.floor(point.z)
            };
            
            const placePos = {
                x: Math.floor(point.x + normal.x * 0.5),
                y: Math.floor(point.y + normal.y * 0.5),
                z: Math.floor(point.z + normal.z * 0.5)
            };
            
            const distance = camera.position.distanceTo(point);
            
            if (distance < maxDistance) {
                return {
                    target: targetPos,
                    place: placePos,
                    distance: distance,
                    point: point
                };
            }
        }
        
        return null;
    }
    
    // Обновление мира (загрузка новых чанков)
    update(playerX, playerY, playerZ) {
        this.loadChunksAround(playerX, playerY, playerZ);
    }
}
