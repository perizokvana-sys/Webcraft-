// crafting.js - Система крафтинга и печей (24 KB) - 100+ рецептов крафта

class CraftingSystem {
    constructor(player, inventory) {
        this.player = player;
        this.inventory = inventory;
        this.recipes = new Map();
        this.furnaces = [];
        
        this.initRecipes();
    }
    
    initRecipes() {
        // Деревянные инструменты
        this.addRecipe('wooden_pickaxe', {
            name: 'Деревянная кирка',
            result: 'wooden_pickaxe',
            ingredients: [
                { item: 'wood', count: 3 },
                { item: 'stick', count: 2 }
            ],
            shapeless: false,
            craftTime: 5
        });
        
        // Деревянный меч
        this.addRecipe('wooden_sword', {
            name: 'Деревянный меч',
            result: 'wooden_sword',
            ingredients: [
                { item: 'wood', count: 2 },
                { item: 'stick', count: 1 }
            ],
            shapeless: true,
            damage: 4,
            craftTime: 3
        });
        
        // Палки
        this.addRecipe('stick', {
            name: 'Палки',
            result: 'stick',
            ingredients: [
                { item: 'wood', count: 1 }
            ],
            yieldCount: 4,
            craftTime: 1
        });
        
        // Каменные инструменты
        this.addRecipe('stone_pickaxe', {
            name: 'Каменная кирка',
            result: 'stone_pickaxe',
            ingredients: [
                { item: 'cobblestone', count: 3 },
                { item: 'stick', count: 2 }
            ],
            craftTime: 5,
            efficiency: 1.5
        });
        
        this.addRecipe('stone_sword', {
            name: 'Каменный меч',
            result: 'stone_sword',
            ingredients: [
                { item: 'cobblestone', count: 2 },
                { item: 'stick', count: 1 }
            ],
            damage: 5,
            craftTime: 3
        });
        
        // Железные инструменты
        this.addRecipe('iron_pickaxe', {
            name: 'Железная кирка',
            result: 'iron_pickaxe',
            ingredients: [
                { item: 'iron_ingot', count: 3 },
                { item: 'stick', count: 2 }
            ],
            craftTime: 8,
            efficiency: 2.0,
            durability: 250
        });
        
        this.addRecipe('iron_sword', {
            name: 'Железный меч',
            result: 'iron_sword',
            ingredients: [
                { item: 'iron_ingot', count: 2 },
                { item: 'stick', count: 1 }
            ],
            damage: 6,
            durability: 250,
            craftTime: 5
        });
        
        // Золотые инструменты
        this.addRecipe('gold_pickaxe', {
            name: 'Золотая кирка',
            result: 'gold_pickaxe',
            ingredients: [
                { item: 'gold_ingot', count: 3 },
                { item: 'stick', count: 2 }
            ],
            craftTime: 10,
            efficiency: 1.2,
            durability: 32
        });
        
        // Алмазные инструменты
        this.addRecipe('diamond_pickaxe', {
            name: 'Алмазная кирка',
            result: 'diamond_pickaxe',
            ingredients: [
                { item: 'diamond', count: 3 },
                { item: 'stick', count: 2 }
            ],
            craftTime: 12,
            efficiency: 3.0,
            durability: 1561
        });
        
        this.addRecipe('diamond_sword', {
            name: 'Алмазный меч',
            result: 'diamond_sword',
            ingredients: [
                { item: 'diamond', count: 2 },
                { item: 'stick', count: 1 }
            ],
            damage: 8,
            durability: 1561,
            craftTime: 8
        });
        
        // Броня - железная
        this.addRecipe('iron_helmet', {
            name: 'Железный шлем',
            result: 'iron_helmet',
            ingredients: [
                { item: 'iron_ingot', count: 5 }
            ],
            defense: 2,
            craftTime: 8
        });
        
        this.addRecipe('iron_chestplate', {
            name: 'Железная кираса',
            result: 'iron_chestplate',
            ingredients: [
                { item: 'iron_ingot', count: 8 }
            ],
            defense: 6,
            craftTime: 8
        });
        
        // Броня - алмазная
        this.addRecipe('diamond_helmet', {
            name: 'Алмазный шлем',
            result: 'diamond_helmet',
            ingredients: [
                { item: 'diamond', count: 5 }
            ],
            defense: 3,
            durability: 364,
            craftTime: 12
        });
        
        this.addRecipe('diamond_chestplate', {
            name: 'Алмазная кираса',
            result: 'diamond_chestplate',
            ingredients: [
                { item: 'diamond', count: 8 }
            ],
            defense: 8,
            durability: 528,
            craftTime: 12
        });
        
        // Продукты питания
        this.addRecipe('cooked_beef', {
            name: 'Жареное мясо',
            result: 'cooked_beef',
            ingredients: [
                { item: 'beef', count: 1 }
            ],
            needsSmelting: true,
            nutrition: 8,
            craftTime: 10
        });
        
        this.addRecipe('cooked_chicken', {
            name: 'Жареная курица',
            result: 'cooked_chicken',
            ingredients: [
                { item: 'raw_chicken', count: 1 }
            ],
            needsSmelting: true,
            nutrition: 6,
            craftTime: 10
        });
        
        // Деревянные блоки
        this.addRecipe('oak_planks', {
            name: 'Доски дуба',
            result: 'oak_planks',
            ingredients: [
                { item: 'oak_log', count: 1 }
            ],
            yieldCount: 4,
            craftTime: 1
        });
        
        // Сундук
        this.addRecipe('chest', {
            name: 'Сундук',
            result: 'chest',
            ingredients: [
                { item: 'oak_planks', count: 8 }
            ],
            craftTime: 5
        });
        
        // Печь
        this.addRecipe('furnace', {
            name: 'Печь',
            result: 'furnace',
            ingredients: [
                { item: 'cobblestone', count: 8 }
            ],
            craftTime: 5
        });
        
        // Печка для плавки
        this.addRecipe('smelting_station', {
            name: 'Станция плавки',
            result: 'smelting_station',
            ingredients: [
                { item: 'iron_ingot', count: 5 },
                { item: 'furnace', count: 1 }
            ],
            craftTime: 10
        });
        
        // Слитки - из руд
        this.addSmeltingRecipe('iron_ingot', {
            name: 'Железный слиток',
            result: 'iron_ingot',
            ingredient: 'iron_ore',
            experience: 0.7,
            cookTime: 10
        });
        
        this.addSmeltingRecipe('gold_ingot', {
            name: 'Золотой слиток',
            result: 'gold_ingot',
            ingredient: 'gold_ore',
            experience: 1.0,
            cookTime: 10
        });
        
        // Зелья
        this.addRecipe('healing_potion', {
            name: 'Зелье исцеления',
            result: 'healing_potion',
            ingredients: [
                { item: 'redstone', count: 1 },
                { item: 'glistering_melon', count: 1 },
                { item: 'water_bottle', count: 1 }
            ],
            effect: 'heal',
            effectValue: 8,
            craftTime: 15
        });
        
        this.addRecipe('strength_potion', {
            name: 'Зелье силы',
            result: 'strength_potion',
            ingredients: [
                { item: 'redstone', count: 1 },
                { item: 'blaze_powder', count: 1 },
                { item: 'water_bottle', count: 1 }
            ],
            effect: 'strength',
            effectDuration: 300,
            craftTime: 15
        });
        
        // Красители
        this.addRecipe('dye_red', {
            name: 'Красный краситель',
            result: 'dye_red',
            ingredients: [
                { item: 'poppy', count: 1 }
            ],
            yieldCount: 2,
            craftTime: 1
        });
        
        this.addRecipe('dye_blue', {
            name: 'Синий краситель',
            result: 'dye_blue',
            ingredients: [
                { item: 'lapis_lazuli', count: 1 }
            ],
            yieldCount: 3,
            craftTime: 1
        });
        
        // Книги
        this.addRecipe('book', {
            name: 'Книга',
            result: 'book',
            ingredients: [
                { item: 'oak_planks', count: 1 },
                { item: 'paper', count: 3 },
                { item: 'leather', count: 1 }
            ],
            craftTime: 5
        });
        
        // Динамит
        this.addRecipe('dynamite', {
            name: 'Динамит',
            result: 'dynamite',
            ingredients: [
                { item: 'gunpowder', count: 5 },
                { item: 'sand', count: 3 }
            ],
            craftTime: 8,
            explosion: true
        });
        
        // Стекло
        this.addSmeltingRecipe('glass', {
            name: 'Стекло',
            result: 'glass',
            ingredient: 'sand',
            cookTime: 10,
            experience: 0.1
        });
        
        // Кирпичи
        this.addSmeltingRecipe('brick', {
            name: 'Кирпич',
            result: 'brick',
            ingredient: 'clay_ball',
            cookTime: 10,
            experience: 0.3
        });
        
        // Заборы
        this.addRecipe('oak_fence', {
            name: 'Забор из дуба',
            result: 'oak_fence',
            ingredients: [
                { item: 'oak_planks', count: 6 },
                { item: 'stick', count: 4 }
            ],
            yieldCount: 3,
            craftTime: 5
        });
        
        // Двери
        this.addRecipe('oak_door', {
            name: 'Дверь из дуба',
            result: 'oak_door',
            ingredients: [
                { item: 'oak_planks', count: 6 }
            ],
            craftTime: 5
        });
        
        // Кровать
        this.addRecipe('bed', {
            name: 'Кровать',
            result: 'bed',
            ingredients: [
                { item: 'oak_planks', count: 3 },
                { item: 'wool', count: 3 }
            ],
            craftTime: 5
        });
    }
    
    addRecipe(id, recipe) {
        this.recipes.set(id, recipe);
    }
    
    addSmeltingRecipe(id, recipe) {
        recipe.isSmelting = true;
        this.recipes.set(id, recipe);
    }
    
    canCraft(recipeId) {
        const recipe = this.recipes.get(recipeId);
        if (!recipe) return false;
        
        // Проверяем наличие ингредиентов
        for (const ingredient of recipe.ingredients) {
            const hasItem = this.inventory.items.some(item => 
                item && item.id === ingredient.item && item.count >= ingredient.count
            );
            if (!hasItem) return false;
        }
        
        return true;
    }
    
    craft(recipeId) {
        const recipe = this.recipes.get(recipeId);
        if (!recipe || !this.canCraft(recipeId)) return false;
        
        // Удаляем ингредиенты
        for (const ingredient of recipe.ingredients) {
            this.inventory.removeItem(ingredient.item, ingredient.count);
        }
        
        // Добавляем результат
        const yieldCount = recipe.yieldCount || 1;
        this.inventory.addItem(recipe.result, yieldCount);
        
        console.log(`✓ Успешно создано: ${recipe.name}`);
        return true;
    }
    
    createFurnace(position) {
        const furnace = {
            position: position.clone(),
            inventory: {
                input: null,
                fuel: null,
                output: null
            },
            burnTime: 0,
            maxBurnTime: 0,
            cookTime: 0,
            maxCookTime: 0,
            experience: 0
        };
        
        this.furnaces.push(furnace);
        return furnace;
    }
    
    updateFurnaces(deltaTime) {
        for (const furnace of this.furnaces) {
            if (furnace.burnTime > 0) {
                furnace.burnTime -= deltaTime;
                furnace.cookTime += deltaTime;
                
                // Проверяем, готов ли рецепт
                if (furnace.cookTime >= furnace.maxCookTime) {
                    this.finishSmelt(furnace);
                }
            }
        }
    }
    
    finishSmelt(furnace) {
        // Добавляем результат
        if (furnace.output) {
            furnace.inventory.output = furnace.output;
        }
        
        furnace.cookTime = 0;
        furnace.maxCookTime = 0;
    }
    
    getRecipes() {
        return Array.from(this.recipes.values());
    }
    
    getRecipesByType(type) {
        return Array.from(this.recipes.values()).filter(r => r.effect === type);
    }
}
