// main.js - Главный цикл игры, меню и интеграция всех систем

class GameManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.world = null;
        this.player = null;
        this.inventory = null;
        
        this.gameState = 'MENU'; // MENU, PLAYING, PAUSED, LOADING
        this.gameMode = 'SINGLEPLAYER'; // SINGLEPLAYER, MULTIPLAYER
        this.sessionCode = null;
        this.isMultiplayer = false;
        
        this.init();
    }
    
    init() {
        this.setupMenu();
        this.setupEventListeners();
    }
    
    setupMenu() {
        // Создаем HTML меню если его нет
        if (!document.getElementById('main-menu')) {
            this.createMainMenu();
        }
    }
    
    createMainMenu() {
        const menuHTML = `
            <div id="main-menu" class="main-menu">
                <div class="menu-container">
                    <h1 class="menu-title">🎮 WebCraft</h1>
                    <p class="menu-subtitle">Block Building Game</p>
                    
                    <div class="menu-buttons">
                        <button id="btn-singleplayer" class="menu-btn singleplayer-btn">
                            🎮 Одиночная игра
                        </button>
                        <button id="btn-multiplayer" class="menu-btn multiplayer-btn">
                            👥 Мультиплеер
                        </button>
                        <button id="btn-settings" class="menu-btn settings-btn">
                            ⚙️ Настройки
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="multiplayer-menu" class="multiplayer-menu hidden">
                <div class="menu-container">
                    <h2 class="menu-title">Мультиплеер</h2>
                    
                    <div class="multiplayer-options">
                        <button id="btn-create-server" class="menu-btn create-btn">
                            ➕ Создать сервер
                        </button>
                        <button id="btn-join-server" class="menu-btn join-btn">
                            🔗 Присоединиться
                        </button>
                        <button id="btn-back-multiplayer" class="menu-btn back-btn">
                            ← Назад
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="session-input-menu" class="session-input-menu hidden">
                <div class="menu-container">
                    <h2 class="menu-title" id="session-title">Создание сервера</h2>
                    
                    <div class="session-input-content">
                        <div class="input-group">
                            <label for="session-code-input">Код сессии:</label>
                            <input 
                                type="text" 
                                id="session-code-input" 
                                class="session-code-input"
                                placeholder="Введите или оставьте пусто для автогенерации"
                                maxlength="10"
                            >
                        </div>
                        
                        <div class="code-display hidden" id="code-display">
                            <p>Ваш код сессии:</p>
                            <div class="code-box" id="session-code-display">????</div>
                            <button id="btn-copy-code" class="menu-btn copy-btn">📋 Копировать</button>
                        </div>
                        
                        <div class="button-group">
                            <button id="btn-confirm-session" class="menu-btn confirm-btn">
                                ✓ Начать
                            </button>
                            <button id="btn-back-session" class="menu-btn back-btn">
                                ← Назад
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="pause-menu" class="pause-menu hidden">
                <div class="menu-container">
                    <h2 class="menu-title">Пауза</h2>
                    
                    <div class="pause-buttons">
                        <button id="btn-resume" class="menu-btn resume-btn">
                            ▶️ Продолжить
                        </button>
                        <button id="btn-save-game" class="menu-btn save-btn">
                            💾 Сохранить
                        </button>
                        <button id="btn-settings-pause" class="menu-btn settings-btn">
                            ⚙️ Настройки
                        </button>
                        <button id="btn-main-menu" class="menu-btn menu-btn">
                            🏠 Главное меню
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Вставляем меню в начало body
        document.body.insertAdjacentHTML('afterbegin', menuHTML);
        
        // Добавляем стили меню
        this.addMenuStyles();
    }
    
    addMenuStyles() {
        if (document.getElementById('menu-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'menu-styles';
        style.textContent = `
            .main-menu, .multiplayer-menu, .session-input-menu, .pause-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(20, 20, 30, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                backdrop-filter: blur(5px);
            }
            
            .main-menu.hidden, .multiplayer-menu.hidden, .session-input-menu.hidden, .pause-menu.hidden {
                display: none;
            }
            
            .menu-container {
                text-align: center;
                background: rgba(30, 30, 50, 0.9);
                padding: 40px;
                border-radius: 15px;
                border: 3px solid #0f0;
                box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
                max-width: 400px;
                width: 90%;
            }
            
            .menu-title {
                color: #0f0;
                font-size: 48px;
                margin-bottom: 10px;
                text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
                font-weight: bold;
            }
            
            .menu-subtitle {
                color: #aaa;
                font-size: 16px;
                margin-bottom: 30px;
            }
            
            .menu-buttons, .multiplayer-options, .pause-buttons {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .menu-btn {
                padding: 15px 25px;
                font-size: 16px;
                border: 2px solid #0f0;
                background: rgba(0, 100, 0, 0.3);
                color: #0f0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
                font-weight: bold;
                user-select: none;
                -webkit-user-select: none;
            }
            
            .menu-btn:hover {
                background: rgba(0, 150, 0, 0.5);
                box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
                transform: scale(1.05);
            }
            
            .menu-btn:active {
                transform: scale(0.98);
                background: rgba(0, 200, 0, 0.6);
            }
            
            .button-group {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            
            .button-group .menu-btn {
                flex: 1;
                padding: 12px;
                font-size: 14px;
            }
            
            .input-group {
                margin-bottom: 20px;
                text-align: left;
            }
            
            .input-group label {
                display: block;
                color: #0f0;
                margin-bottom: 8px;
                font-weight: bold;
            }
            
            .session-code-input {
                width: 100%;
                padding: 12px;
                background: rgba(20, 20, 30, 0.8);
                border: 2px solid #0f0;
                color: #0f0;
                border-radius: 5px;
                font-size: 16px;
                font-family: 'Courier New', monospace;
            }
            
            .session-code-input::placeholder {
                color: #0f0;
                opacity: 0.5;
            }
            
            .session-code-input:focus {
                outline: none;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
            }
            
            .code-display {
                background: rgba(0, 50, 0, 0.3);
                padding: 15px;
                border-radius: 8px;
                border: 2px solid #0f0;
                margin: 20px 0;
            }
            
            .code-display.hidden {
                display: none;
            }
            
            .code-display p {
                color: #0f0;
                margin-bottom: 10px;
            }
            
            .code-box {
                background: rgba(20, 20, 30, 0.9);
                border: 2px solid #0f0;
                padding: 12px;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                font-size: 24px;
                color: #0f0;
                font-weight: bold;
                letter-spacing: 2px;
                margin-bottom: 10px;
            }
            
            @media (max-width: 480px) {
                .menu-container {
                    padding: 25px;
                    max-width: 100%;
                }
                
                .menu-title {
                    font-size: 36px;
                }
                
                .menu-btn {
                    padding: 12px 15px;
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        // Главное меню
        document.getElementById('btn-singleplayer')?.addEventListener('click', () => this.startSingleplayer());
        document.getElementById('btn-multiplayer')?.addEventListener('click', () => this.showMultiplayerMenu());
        
        // Мультиплеер меню
        document.getElementById('btn-create-server')?.addEventListener('click', () => this.showSessionInput('create'));
        document.getElementById('btn-join-server')?.addEventListener('click', () => this.showSessionInput('join'));
        document.getElementById('btn-back-multiplayer')?.addEventListener('click', () => this.showMainMenu());
        
        // Сессия ввод
        document.getElementById('btn-confirm-session')?.addEventListener('click', () => this.confirmSession());
        document.getElementById('btn-back-session')?.addEventListener('click', () => this.showMultiplayerMenu());
        document.getElementById('btn-copy-code')?.addEventListener('click', () => this.copySessionCode());
        
        // Пауза меню
        document.getElementById('btn-resume')?.addEventListener('click', () => this.resumeGame());
        document.getElementById('btn-save-game')?.addEventListener('click', () => this.saveGame());
        document.getElementById('btn-main-menu')?.addEventListener('click', () => this.returnToMainMenu());
        
        // Клавиша ESC для паузы
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && this.gameState === 'PLAYING') {
                this.togglePauseMenu();
            }
        });
    }
    
    startSingleplayer() {
        this.gameMode = 'SINGLEPLAYER';
        this.isMultiplayer = false;
        this.sessionCode = null;
        this.startGame();
    }
    
    showMainMenu() {
        document.getElementById('main-menu').classList.remove('hidden');
        document.getElementById('multiplayer-menu').classList.add('hidden');
        document.getElementById('session-input-menu').classList.add('hidden');
    }
    
    showMultiplayerMenu() {
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('multiplayer-menu').classList.remove('hidden');
    }
    
    showSessionInput(mode) {
        document.getElementById('multiplayer-menu').classList.add('hidden');
        document.getElementById('session-input-menu').classList.remove('hidden');
        
        const title = document.getElementById('session-title');
        const input = document.getElementById('session-code-input');
        const codeDisplay = document.getElementById('code-display');
        
        if (mode === 'create') {
            title.textContent = 'Создание сервера';
            codeDisplay.classList.remove('hidden');
            input.placeholder = 'Оставьте пусто для автогенерации';
            this.sessionMode = 'create';
        } else {
            title.textContent = 'Присоединиться к серверу';
            codeDisplay.classList.add('hidden');
            input.placeholder = 'Введите код сессии';
            this.sessionMode = 'join';
        }
        
        input.value = '';
        input.focus();
        
        // Автогенерация кода при создании
        if (mode === 'create') {
            input.addEventListener('input', () => this.updateCodeDisplay());
            this.generateSessionCode();
        }
    }
    
    generateSessionCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        this.sessionCode = code;
        this.updateCodeDisplay();
    }
    
    updateCodeDisplay() {
        const input = document.getElementById('session-code-input');
        const display = document.getElementById('session-code-display');
        
        if (input.value) {
            this.sessionCode = input.value.toUpperCase();
        } else if (this.sessionMode === 'create') {
            this.generateSessionCode();
        }
        
        display.textContent = this.sessionCode || '????';
    }
    
    copySessionCode() {
        navigator.clipboard.writeText(this.sessionCode).then(() => {
            const btn = document.getElementById('btn-copy-code');
            const originalText = btn.textContent;
            btn.textContent = '✓ Скопировано!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }
    
    confirmSession() {
        const input = document.getElementById('session-code-input');
        
        if (this.sessionMode === 'create') {
            this.isMultiplayer = true;
            this.gameMode = 'MULTIPLAYER';
        } else if (this.sessionMode === 'join') {
            if (!input.value) {
                alert('Введите код сессии!');
                return;
            }
            this.sessionCode = input.value.toUpperCase();
            this.isMultiplayer = true;
            this.gameMode = 'MULTIPLAYER';
        }
        
        console.log(`Подключение к сессии: ${this.sessionCode}`);
        this.startGame();
    }
    
    startGame() {
        // Скрываем все меню
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('multiplayer-menu').classList.add('hidden');
        document.getElementById('session-input-menu').classList.add('hidden');
        
        this.gameState = 'LOADING';
        this.initThreeJS();
        this.setupGame();
        this.gameState = 'PLAYING';
        this.gameLoop();
    }
    
    initThreeJS() {
        const container = document.getElementById('game-container');
        
        // Сцена
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Небо
        
        // Камера
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        // Рендерер
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        container.appendChild(this.renderer.domElement);
        
        // Освещение - простое и приятное
        // Окружающий свет
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Направленный свет (солнце)
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(100, 100, 100);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.camera.left = -200;
        sunLight.shadow.camera.right = 200;
        sunLight.shadow.camera.top = 200;
        sunLight.shadow.camera.bottom = -200;
        this.scene.add(sunLight);
        
        // Небольшой контровой свет для глубины
        const rimLight = new THREE.DirectionalLight(0x4488ff, 0.3);
        rimLight.position.set(-100, 50, -100);
        this.scene.add(rimLight);
        
        // Обработка resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupGame() {
        // Создаем мир
        this.world = new World(this.scene);
        
        // Создаем игрока
        this.player = new Player(this.scene, this.world, this.camera);
        
        // Создаем инвентарь
        this.inventory = new Inventory();
        
        // Информируем об игровом режиме
        console.log(`🎮 Игра запущена: ${this.gameMode}`);
        if (this.isMultiplayer) {
            console.log(`🌐 Код сессии: ${this.sessionCode}`);
            console.log('💡 Мультиплеер - функционал в разработке');
        }
    }
    
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        
        if (this.gameState !== 'PLAYING') return;
        
        // Обновляем игрока
        this.player.update();
        
        // Обновляем мир
        this.world.update(
            this.player.position.x,
            this.player.position.y,
            this.player.position.z
        );
        
        // Обновляем координаты в HUD
        const coordsDiv = document.getElementById('coordinates');
        coordsDiv.textContent = 
            `X: ${Math.floor(this.player.position.x)} ` +
            `Y: ${Math.floor(this.player.position.y)} ` +
            `Z: ${Math.floor(this.player.position.z)}`;
        
        // Рендерим сцену
        this.renderer.render(this.scene, this.camera);
    }
    
    togglePauseMenu() {
        if (this.gameState === 'PLAYING') {
            this.gameState = 'PAUSED';
            document.getElementById('pause-menu').classList.remove('hidden');
        } else if (this.gameState === 'PAUSED') {
            this.gameState = 'PLAYING';
            document.getElementById('pause-menu').classList.add('hidden');
        }
    }
    
    resumeGame() {
        this.gameState = 'PLAYING';
        document.getElementById('pause-menu').classList.add('hidden');
    }
    
    saveGame() {
        const gameData = {
            playerPos: {
                x: this.player.position.x,
                y: this.player.position.y,
                z: this.player.position.z
            },
            inventory: this.inventory.save(),
            gameMode: this.gameMode,
            sessionCode: this.sessionCode,
            timestamp: Date.now()
        };
        
        localStorage.setItem('webcraft_save', JSON.stringify(gameData));
        console.log('💾 Игра сохранена');
        
        const btn = document.getElementById('btn-save-game');
        const originalText = btn.textContent;
        btn.textContent = '✓ Сохранено!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }
    
    returnToMainMenu() {
        this.gameState = 'MENU';
        document.getElementById('pause-menu').classList.add('hidden');
        this.renderer.domElement.remove();
        this.showMainMenu();
        this.setupEventListeners();
    }
    
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Запускаем игру когда документ загружен
document.addEventListener('DOMContentLoaded', () => {
    window.game = new GameManager();
});
