// daynight.js - Система день/ночь с динамическим освещением (18 KB)

class DayNightCycle {
    constructor(scene) {
        this.scene = scene;
        this.time = 6000; // Начало в 6:00
        this.dayLength = 20 * 60 * 1000; // 20 минут - один день
        this.speed = 1; // Множитель скорости
        
        this.sunLight = null;
        this.moonLight = null;
        this.skyColor = new THREE.Color();
        this.ambientLight = null;
        
        this.initLights();
        this.updateSky();
    }
    
    initLights() {
        // Солнце
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 4096;
        this.sunLight.shadow.mapSize.height = 4096;
        this.scene.add(this.sunLight);
        
        // Луна
        this.moonLight = new THREE.DirectionalLight(0x4488ff, 0.3);
        this.moonLight.castShadow = true;
        this.moonLight.shadow.mapSize.width = 2048;
        this.moonLight.shadow.mapSize.height = 2048;
        this.scene.add(this.moonLight);
        
        // Окружающий свет
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.ambientLight);
    }
    
    update(deltaTime) {
        // Обновляем время
        this.time += deltaTime * this.speed * 1000;
        if (this.time >= 24000) {
            this.time = 0;
        }
        
        this.updateLighting();
        this.updateSky();
    }
    
    updateLighting() {
        // Позиция солнца основывается на времени дня
        const sunProgress = (this.time % 12000) / 12000; // 0-1 за полдня
        const sunAngle = (sunProgress - 0.5) * Math.PI; // -PI/2 до PI/2
        
        // Позиционируем солнце
        const sunDistance = 500;
        this.sunLight.position.set(
            Math.cos(sunAngle) * sunDistance,
            Math.sin(sunAngle) * sunDistance,
            100
        );
        
        // Интенсивность солнца
        let sunIntensity = Math.max(0, Math.sin(sunAngle));
        this.sunLight.intensity = sunIntensity;
        
        // Луна противоположна солнцу
        const moonAngle = sunAngle + Math.PI;
        this.moonLight.position.set(
            Math.cos(moonAngle) * sunDistance,
            Math.sin(moonAngle) * sunDistance,
            100
        );
        
        let moonIntensity = Math.max(0, Math.sin(moonAngle));
        this.moonLight.intensity = moonIntensity * 0.5;
        
        // Окружающее освещение меняется в течение дня
        const ambientIntensity = 0.4 + sunIntensity * 0.6;
        this.ambientLight.intensity = ambientIntensity;
        
        // Цвет подсветки меняется
        if (this.time < 6000 || this.time > 18000) {
            // Ночь - синее освещение
            this.ambientLight.color.setHex(0x4488ff);
        } else if (this.time < 8000) {
            // Восход - оранжевое/красное
            const t = (this.time - 6000) / 2000;
            this.ambientLight.color.setHSL(0.05, 1, 0.5);
        } else if (this.time > 16000) {
            // Закат - оранжевое/красное
            const t = (this.time - 16000) / 2000;
            this.ambientLight.color.setHSL(0.05, 1, 0.5);
        } else {
            // День - белое освещение
            this.ambientLight.color.setHex(0xffffff);
        }
    }
    
    updateSky() {
        // Цвет неба меняется в течение дня
        if (this.time < 6000) {
            // Ночь - тёмный
            this.skyColor.setHex(0x000033);
        } else if (this.time < 7000) {
            // Восход
            const t = (this.time - 6000) / 1000;
            this.skyColor.setHSL(0.6 - t * 0.4, 1, 0.3 + t * 0.3);
        } else if (this.time < 8000) {
            // Восход переходит в день
            const t = (this.time - 7000) / 1000;
            this.skyColor.setHSL(0.2, 0.7, 0.6 + t * 0.15);
        } else if (this.time < 16000) {
            // День - голубое небо
            this.skyColor.setHex(0x87ceeb);
        } else if (this.time < 17000) {
            // Закат начинается
            const t = (this.time - 16000) / 1000;
            this.skyColor.setHSL(0.05, 1, 0.6 - t * 0.1);
        } else if (this.time < 18000) {
            // Закат в ночь
            const t = (this.time - 17000) / 1000;
            this.skyColor.setHSL(0.6, 1, 0.3 - t * 0.2);
        } else {
            // Ночь
            this.skyColor.setHex(0x000033);
        }
        
        this.scene.background = this.skyColor;
    }
    
    getTimeString() {
        const hours = Math.floor((this.time / 1000) / 60) % 24;
        const minutes = Math.floor((this.time / 1000) % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    getTimeProgress() {
        return this.time / 24000;
    }
    
    isPaused() {
        return this.time >= 18000 || this.time < 6000;
    }
    
    setTime(hours, minutes = 0) {
        this.time = (hours * 1000 + minutes * 1000 / 60) % 24000;
    }
}
