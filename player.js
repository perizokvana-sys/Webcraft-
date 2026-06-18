// player.js - Управление игроком, камерой и движением

class Player {
    constructor(scene, world, camera) {
        this.scene = scene;
        this.world = world;
        this.camera = camera;
        
        // Позиция
        this.position = new THREE.Vector3(8, 65, 8);
        this.camera.position.copy(this.position);
        
        // Скорость и ускорение
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        
        // Параметры движения
        this.moveSpeed = 0.15; // Скорость ходьбы
        this.sprintSpeed = 0.25; // Скорость бега
        this.jumpForce = 0.8;
        this.gravity = 0.04;
        this.friction = 0.85;
        this.maxVelocity = 0.5;
        
        // Состояние
        this.isJumping = false;
        this.isGrounded = false;
        this.isSprinting = false;
        this.canJump = true;
        
        // Направление взгляда
        this.yaw = 0;
        this.pitch = 0;
        this.mouseSensitivity = 0.003;
        
        // Входные команды
        this.moveInput = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            sprint: false
        };
        
        // Размер игрока (для коллизий)
        this.width = 0.6;
        this.height = 1.8;
        this.depth = 0.6;
        
        this.setupInput();
        this.setupCamera();
    }
    
    setupCamera() {
        // Улучшенные настройки камеры
        this.camera.fov = 75;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.near = 0.1;
        this.camera.far = 1000;
        this.camera.updateProjectionMatrix();
        
        // Bob камеры (покачивание при ходьбе)
        this.bobAmount = 0;
        this.bobSpeed = 0.1;
        this.bobPhase = 0;
    }
    
    setupInput() {
        // Клавиатура (для десктопа)
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Мышь для взгляда
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('click', () => document.body.requestPointerLock?.());
        
        // Сенсор для мобилки
        document.addEventListener('deviceorientation', (e) => this.handleDeviceOrientation(e));
    }
    
    handleKeyDown(e) {
        switch(e.code) {
            case 'KeyW': this.moveInput.forward = true; break;
            case 'KeyS': this.moveInput.backward = true; break;
            case 'KeyA': this.moveInput.left = true; break;
            case 'KeyD': this.moveInput.right = true; break;
            case 'Space': 
                this.moveInput.jump = true;
                this.tryJump();
                break;
            case 'ShiftLeft': this.moveInput.sprint = true; break;
        }
    }
    
    handleKeyUp(e) {
        switch(e.code) {
            case 'KeyW': this.moveInput.forward = false; break;
            case 'KeyS': this.moveInput.backward = false; break;
            case 'KeyA': this.moveInput.left = false; break;
            case 'KeyD': this.moveInput.right = false; break;
            case 'Space': this.moveInput.jump = false; break;
            case 'ShiftLeft': this.moveInput.sprint = false; break;
        }
    }
    
    handleMouseMove(e) {
        if (document.pointerLockElement) {
            this.yaw -= e.movementX * this.mouseSensitivity;
            this.pitch -= e.movementY * this.mouseSensitivity;
            
            // Ограничиваем pitch
            this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
        }
    }
    
    handleDeviceOrientation(e) {
        // Для мобильных устройств с гироскопом
        if (e.alpha !== undefined) {
            this.yaw = THREE.MathUtils.degToRad(e.alpha) * 0.5;
            this.pitch = THREE.MathUtils.degToRad(e.beta) * 0.3;
            this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
        }
    }
    
    updateCameraDirection() {
        // Обновляем направление камеры на основе yaw и pitch
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
    }
    
    getForwardVector() {
        this.camera.getWorldDirection(this._forward || (this._forward = new THREE.Vector3()));
        return this._forward;
    }
    
    getRightVector() {
        return this.camera.getWorldDirection(this._forward || (this._forward = new THREE.Vector3()))
            .cross(this.camera.up)
            .normalize();
    }
    
    handleMovement() {
        const forward = this.getForwardVector();
        const right = this.getRightVector();
        
        // Зануляем Y компоненту для горизонтального движения
        forward.y = 0;
        forward.normalize();
        right.y = 0;
        right.normalize();
        
        const currentSpeed = this.moveInput.sprint ? this.sprintSpeed : this.moveSpeed;
        
        // Применяем входные команды
        if (this.moveInput.forward) {
            this.acceleration.addScaledVector(forward, currentSpeed);
        }
        if (this.moveInput.backward) {
            this.acceleration.addScaledVector(forward, -currentSpeed * 0.5);
        }
        if (this.moveInput.right) {
            this.acceleration.addScaledVector(right, currentSpeed);
        }
        if (this.moveInput.left) {
            this.acceleration.addScaledVector(right, -currentSpeed);
        }
    }
    
    tryJump() {
        if (this.isGrounded && this.canJump) {
            this.velocity.y = this.jumpForce;
            this.isJumping = true;
            this.canJump = false;
            this.isGrounded = false;
        }
    }
    
    checkCollisions() {
        const newPos = new THREE.Vector3(
            this.position.x + this.velocity.x,
            this.position.y + this.velocity.y,
            this.position.z + this.velocity.z
        );
        
        // Проверяем столкновения по осям
        const checkX = new THREE.Vector3(newPos.x, this.position.y, this.position.z);
        if (!this.isColliding(checkX)) {
            this.position.x = newPos.x;
        }
        
        const checkY = new THREE.Vector3(this.position.x, newPos.y, this.position.z);
        if (!this.isColliding(checkY)) {
            this.position.y = newPos.y;
        } else {
            // Проверяем столкновение с полом
            if (this.velocity.y < 0) {
                this.velocity.y = 0;
                this.isGrounded = true;
                this.canJump = true;
            } else if (this.velocity.y > 0) {
                // Столкновение с потолком
                this.velocity.y = 0;
            }
        }
        
        const checkZ = new THREE.Vector3(this.position.x, this.position.y, newPos.z);
        if (!this.isColliding(checkZ)) {
            this.position.z = newPos.z;
        }
    }
    
    isColliding(pos) {
        const minX = pos.x - this.width / 2;
        const maxX = pos.x + this.width / 2;
        const minY = pos.y;
        const maxY = pos.y + this.height;
        const minZ = pos.z - this.depth / 2;
        const maxZ = pos.z + this.depth / 2;
        
        // Проверяем все блоки в области коллизии
        for (let x = Math.floor(minX); x <= Math.floor(maxX); x++) {
            for (let y = Math.floor(minY); y <= Math.floor(maxY); y++) {
                for (let z = Math.floor(minZ); z <= Math.floor(maxZ); z++) {
                    const blockType = this.world.getBlock(x, y, z);
                    if (blockType !== 0 && !this.world.blockTypes[blockType].walkable) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    applyPhysics() {
        // Применяем гравитацию
        this.velocity.y -= this.gravity;
        
        // Ограничиваем максимальную скорость падения
        if (this.velocity.y < -0.5) {
            this.velocity.y = -0.5;
        }
        
        // Применяем трение
        this.velocity.x *= this.friction;
        this.velocity.z *= this.friction;
        
        // Ограничиваем горизонтальную скорость
        const horizontalSpeed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
        if (horizontalSpeed > this.maxVelocity) {
            this.velocity.x = (this.velocity.x / horizontalSpeed) * this.maxVelocity;
            this.velocity.z = (this.velocity.z / horizontalSpeed) * this.maxVelocity;
        }
        
        // Применяем ускорение к скорости
        this.velocity.add(this.acceleration);
        this.acceleration.set(0, 0, 0);
    }
    
    updateCameraBob() {
        if (this.moveInput.forward || this.moveInput.backward || 
            this.moveInput.left || this.moveInput.right) {
            this.bobPhase += this.bobSpeed;
            this.bobAmount = Math.sin(this.bobPhase) * 0.02;
        } else {
            this.bobAmount *= 0.9;
        }
        
        this.camera.position.y = this.position.y + this.height * 0.9 + this.bobAmount;
    }
    
    update() {
        this.handleMovement();
        this.applyPhysics();
        this.checkCollisions();
        
        // Обновляем позицию камеры
        this.updateCameraDirection();
        this.camera.position.x = this.position.x;
        this.camera.position.z = this.position.z;
        this.updateCameraBob();
        
        // Проверяем, не упал ли игрок в пустоту
        if (this.position.y < -100) {
            this.position.set(8, 65, 8);
            this.velocity.set(0, 0, 0);
        }
    }
}
