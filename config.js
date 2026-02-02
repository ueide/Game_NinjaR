/**
 * Game Configuration
 * Centralized configuration for game constants and settings
 */

const GAME_CONFIG = {
    // Canvas dimensions
    CANVAS_WIDTH: 1024,
    CANVAS_HEIGHT: 576,
    
    // Game states
    STATES: {
        LOAD_SCREEN: 0,
        MENU: 1,
        PLAYING: 2,
        RESTART: 3
    },
    
    // Player settings
    PLAYER: {
        START_X_OFFSET: 360,
        START_Y_OFFSET: 3,
        MOVE_SPEED: 2.2,
        JUMP_POWER: 140,
        GRAVITY: 2.2
    },
    
    // Camera settings
    CAMERA: {
        OFFSET: 360,
        LERP_SPEED: 0.1
    },
    
    // Parallax settings
    PARALLAX: {
        CLOUD_SPEED: 0.15,
        MOON_SPEED: 0.05
    },
    
    // Platform settings
    PLATFORM: {
        BASE_COLOR: [36, 135, 55],
        HIGHLIGHT_COLOR: [100, 200, 100],
        HEIGHT: 8
    },
    
    // Sound volumes
    SOUND_VOLUMES: {
        MUSIC: 0.4,
        MUSIC_REDUCED: 0.1,
        COIN: 0.5,
        JUMP: 0.3,
        FALL: 0.3,
        DEAD: 0.6,
        MENU: 0.3,
        LEVEL_COMPLETE: 0.3
    },
    
    // Floor settings
    FLOOR: {
        X_POS: 0,
        Y_POS: 500,
        WIDTH: 1024,
        HEIGHT: 76
    },
    
    // Particle settings
    PARTICLES: {
        COIN_COUNT: 8,
        HIT_BURST_COUNT: 12,
        COIN_GRAVITY: 0.15,
        COIN_DECAY: 8,
        HIT_DECAY: 10
    },
    
    // UI settings
    UI: {
        COIN_BOUNCE_AMPLITUDE: 3,
        COIN_BOUNCE_SPEED: 0.1,
        BUTTON_HOVER_COLOR: [180, 180, 180],
        BUTTON_NORMAL_COLOR: [255, 255, 255]
    },
    
    // Initial lives
    INITIAL_LIVES: 3
};

const FLOOR_CONFIG = {
    x_pos: GAME_CONFIG.FLOOR.X_POS,
    y_pos: GAME_CONFIG.FLOOR.Y_POS,
    width: GAME_CONFIG.FLOOR.WIDTH,
    height: GAME_CONFIG.FLOOR.HEIGHT
};
