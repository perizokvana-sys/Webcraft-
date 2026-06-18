// particles.js - Полная система частиц с эффектами разрушения, постройки, взрывов

class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.particleGroups = new Map();
        
        this.maxParticles = 5000;
        this.activeParticles = 0;
        
        this.init();
    }
    
    init() {
        this.setupParticleGeometries();
    }
    
    setupParticleGeometries() {
        // Кэшируем геометрии для производительности
        this.geometries = {
            cube: new THREE.BoxGeometry(0.1, 0.1, 0.1),
            sphere: new THREE.SphereGeometry(0.05, 4, 4),
            pyramid: new THREE.TetrahedronGeometry(0.08)
        };
        
        // Материалы
        this.materials = {
            dust: new THREE.MeshStandardMaterial({ 
                color: 0xd4a574, 
                emissive: 0x8b7355,
                metalness: 0,
                roughness: 0.8
            }),
            stone: new THREE.MeshStandardMaterial({ 
                color: 0x808080,
                metalness: 0.1,
                roughness: 0.6
            }),
            fire: new THREE.MeshStandardMaterial({ 
                color: 0xff6600,
                emissive: 0xff3300,
                metalness: 0,
                roughness: 1
            }),
            magic: new THREE.MeshStandardMaterial({ 
                color: 0x00ffff,
                emissive: 0x0088ff,
                metalness: 0.5,
                roughness: 0.3
            }),
            blood: new THREE.MeshStandardMaterial({ 
                color: 0xcc0000,
                emissive: 0x660000,
                metalness: 0,
                roughness: 0.9
            }),
            ice: new THREE.MeshStandardMaterial({ 
                color: 0x88ccff,
                emissive: 0x4488ff,
                metalness: 0.8,
                roughness: 0.2
            }),
            gold: new THREE.MeshStandardMaterial({ 
                color: 0xffcc00,
                emissive: 0xffaa00,
                metalness: 0.9,
                roughness: 0.1
            })
        };
    }
    
    createBlockDestructionEffect(position, blockType, count = 15) {
        const colors = {
            1: { material: 'stone', color: 0x808080 },
            2: { material: 'dust', color: 0x8b7355 },
            3: { material: 'dust', color: 0x00aa00 },
            4: { material: 'dust', color: 0xffff00 },
        };
        
        const config = colors[blockType] || colors[2];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = Math.random() * 0.15 + 0.05;
            
            const particle = {
                position: new THREE.Vector3(
                    position.x + Math.random() - 0.5,
                    position.y + Math.random() - 0.5,
                    position.z + Math.random() - 0.5
                ),
                velocity: new THREE.Vector3(
                    Math.cos(angle) * speed,
                    Math.random() * 0.2 + 0.05,
                    Math.sin(angle) * speed
                ),
                acceleration: new THREE.Vector3(0, -0.008, 0),
                life: 1.0,
                maxLife: 1.0,
                size: Math.random() * 0.08 + 0.04,
                rotation: Math.random() * Math.PI * 2,
                rotationVelocity: (Math.random() - 0.5) * 0.2,
                type: 'block_destruction',
                material: config.material,
                color: config.color
            };
            
            this.particles.push(particle);
            this.activeParticles++;
        }
    }
    
    createBlockPlacementEffect(position, blockType) {
        for (let i = 0; i < 10; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const distance = Math.random() * 0.3;
            
            const particle = {
                position: new THREE.Vector3(
                    position.x + Math.cos(angle) * distance,
                    position.y + Math.random() * 0.2,
                    position.z + Math.sin(angle) * distance
                ),
                velocity: new THREE.Vector3(
                    Math.cos(angle) * 0.08,
                    Math.random() * 0.1 + 0.02,
                    Math.sin(angle) * 0.08
                ),
                acceleration: new THREE.Vector3(0, -0.02, 0),
                life: 0.8,
                maxLife: 0.8,
                size: Math.random() * 0.06 + 0.02,
                type: 'block_placement',
                material: 'magic',
                color: 0x00ff88
            };
            
            this.particles.push(particle);
            this.activeParticles++;
        }
    }
    
    createExplosion(position, radius = 5, intensity = 1.0) {
        const particleCount = Math.floor(radius * intensity * 20);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const elevation = Math.random() * Math.PI - Math.PI / 2;
            const speed = Math.random() * 0.3 + 0.1;
            
            const particle = {
                position: position.clone(),
                velocity: new THREE.Vector3(
                    Math.cos(elevation) * Math.cos(angle) * speed,
                    Math.sin(elevation) * speed,
                    Math.cos(elevation) * Math.sin(angle) * speed
                ),
                acceleration: new THREE.Vector3(0, -0.02, 0),
                life: 1.2,
                maxLife: 1.2,
                size: Math.random() * 0.15 + 0.08,
                type: 'explosion',
                material: Math.random() > 0.5 ? 'fire' : 'dust',
                color: Math.random() > 0.5 ? 0xff6600 : 0xffaa00,
                scale: Math.random() * 0.5 + 1
            };
            
            this.particles.push(particle);
            this.activeParticles++;
        }
    }
    
    createMagicEffect(position, direction = null, count = 20) {
        for (let i = 0; i < count; i++) {
            let vel;
            if (direction) {
                const spread = 0.3;
                vel = direction.clone().multiplyScalar(0.15 + Math.random() * 0.05);
                vel.x += (Math.random() - 0.5) * spread;
                vel.y += (Math.random() - 0.5) * spread;
                vel.z += (Math.random() - 0.5) * spread;
            } else {
                const angle = Math.random() * Math.PI * 2;
                const elevation = Math.random() * Math.PI;
                const speed = Math.random() * 0.12 + 0.03;
                vel = new THREE.Vector3(
                    Math.cos(elevation) * Math.cos(angle) * speed,
                    Math.sin(elevation) * speed,
                    Math.cos(elevation) * Math.sin(angle) * speed
                );
            }
            
            const particle = {
                position: position.clone().add(
                    new THREE.Vector3(
                        (Math.random() - 0.5) * 0.5,
                        (Math.random() - 0.5) * 0.5,
                        (Math.random() - 0.5) * 0.5
                    )
                ),
                velocity: vel,
                acceleration: new THREE.Vector3(0, -0.01, 0),
                life: 0.8,
                maxLife: 0.8,
                size: Math.random() * 0.06 + 0.02,
                type: 'magic',
                material: 'magic',
                color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.4, 1, 0.5).getHex()
            };
            
            this.particles.push(particle);
            this.activeParticles++;
        }
    }
    
    createDamageEffect(position, direction = new THREE.Vector3(0, 1, 0)) {
        for (let i = 0; i < 12; i++) {
            const particle = {
                position: position.clone(),
                velocity: direction.clone().multiplyScalar(0.1 + Math.random() * 0.1).add(
                    new THREE.Vector3(
                        (Math.random() - 0.5) * 0.1,
                        Math.random() * 0.15,
                        (Math.random() - 0.5) * 0.1
                    )
                ),
                acceleration: new THREE.Vector3(0, -0.02, 0),
                life: 0.6,
                maxLife: 0.6,
                size: Math.random() * 0.05 + 0.02,
                type: 'damage',
                material: 'blood',
                color: 0xff3333
            };
            
            this.particles.push(particle);
            this.activeParticles++;
        }
    }
    
    createHealing(position) {
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const radius = 0.3;
            
            const particle = {
                position: new THREE.Vector3(
                    position.x + Math.cos(angle) * radius,
                    position.y + Math.random() * 0.2,
                    position.z + Math.sin(angle) * radius
                ),
                velocity: new THREE.Vector3(
                    Math.cos(angle) * 0.05,
                    Math.random() * 0.1 + 0.05,
                    Math.sin(angle) * 0.05
                ),
                acceleration: new THREE.Vector3(0, 0.01, 0),
                life: 1.0,
                maxLife: 1.0,
                size: Math.random() * 0.05 + 0.03,
                type: 'healing',
                material: 'magic',
                color: 0x00ff00
            };
            
            this.particles.push(particle);
            this.activeParticles++;
        }
    }
    
    createRain(position, count = 100) {
        for (let i = 0; i < count; i++) {
            const particle = {
                position: new THREE.Vector3(
                    position.x + (Math.random() - 0.5) * 40,
                    position.y + Math.random() * 20,
                    position.z + (Math.random() - 0.5) * 40
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    -0.3 - Math.random() * 0.2,
                    (Math.random() - 0.5) * 0.05
                ),
                acceleration: new THREE.Vector3(0, 0, 0),
                life: 3.0,
                maxLife: 3.0,
                size: 0.05,
                type: 'rain',
                material: 'ice',
                color: 0x4488ff
            };
            
            this.particles.push(particle);
            this.activeParticles++;
        }
    }
    
    createSmoke(position, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 0.5;
            
            const particle = {
                position: new THREE.Vector3(
                    position.x + Math.cos(angle) * distance,
                    position.y + Math.random() * 0.5,
                    position.z + Math.sin(angle) * distance
                ),
                velocity: new THREE.Vector3(
                    Math.cos(angle) * 0.02,
                    Math.random() * 0.08 + 0.05,
                    Math.sin(angle) * 0.02
                ),
                acceleration: new THREE.Vector3(0, 0.02, 0),
                life: 2.0,
                maxLife: 2.0,
                size: Math.random() * 0.3 + 0.1,
                opacity: 0.6,
                type: 'smoke',
                material: 'dust',
                color: 0x666666
            };
            
            this.particles.push(particle);
            this.activeParticles++;
        }
    }
    
    update(deltaTime) {
        let aliveCount = 0;
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                i--;
                continue;
            }
            
            // Обновляем физику
            p.velocity.add(p.acceleration.clone().multiplyScalar(deltaTime * 60));
            p.position.add(p.velocity.clone().multiplyScalar(deltaTime * 60));
            
            // Затухание жизни
            p.life -= deltaTime;
            
            if (p.rotationVelocity) {
                p.rotation += p.rotationVelocity;
            }
            
            aliveCount++;
        }
        
        this.activeParticles = aliveCount;
    }
    
    render(camera) {
        // Здесь можно добавить отрисовку частиц через instancing для производительности
        // Пока используем простой способ через частицы в сцене
    }
}

// Система поп-апов с числами урона/исцеления
class DamagePopup {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.popups = [];
        this.canvas = document.createElement('canvas');
        this.canvas.width = 256;
        this.canvas.height = 256;
    }
    
    createPopup(position, damage, type = 'damage') {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 64;
        
        const ctx = canvas.getContext('2d');
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const text = damage.toString();
        const color = type === 'damage' ? '#ff3333' : '#33ff33';
        
        ctx.fillStyle = color;
        ctx.fillText(text, 64, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        
        sprite.position.copy(position);
        sprite.position.y += 1.5;
        sprite.scale.set(1, 0.5, 1);
        
        this.scene.add(sprite);
        
        const popup = {
            sprite: sprite,
            life: 1.0,
            maxLife: 1.0,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                0.3,
                (Math.random() - 0.5) * 0.1
            )
        };
        
        this.popups.push(popup);
        
        return popup;
    }
    
    update(deltaTime) {
        for (let i = 0; i < this.popups.length; i++) {
            const popup = this.popups[i];
            
            popup.life -= deltaTime;
            popup.sprite.position.add(popup.velocity.clone().multiplyScalar(deltaTime * 60));
            
            // Затухание
            const alpha = popup.life / popup.maxLife;
            popup.sprite.material.opacity = alpha;
            
            if (popup.life <= 0) {
                this.scene.remove(popup.sprite);
                this.popups.splice(i, 1);
                i--;
            }
        }
    }
}
