/**
 * Particle System Classes
 * Handles visual effects for coin collection and enemy collisions
 */

/**
 * Particle class for coin collection effects
 * Creates golden particles with gravity and velocity
 */
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-2, 2);
        this.vy = random(-4, -1);
        this.gravity = GAME_CONFIG.PARTICLES.COIN_GRAVITY;
        this.life = 255;
        this.decay = GAME_CONFIG.PARTICLES.COIN_DECAY;
        this.size = random(4, 8);
        this.rotation = random(TWO_PI);
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= this.decay;
        this.rotation += 0.1;
    }
    
    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        fill(255, 223, 0, this.life);
        noStroke();
        ellipse(0, 0, this.size);
        fill(196, 167, 53, this.life);
        ellipse(0, 0, this.size * 0.5);
        pop();
    }
    
    displayWithOffset(cameraOffset) {
        push();
        translate(this.x - cameraOffset, this.y);
        rotate(this.rotation);
        fill(255, 223, 0, this.life);
        noStroke();
        ellipse(0, 0, this.size);
        fill(196, 167, 53, this.life);
        ellipse(0, 0, this.size * 0.5);
        pop();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

/**
 * HitEffect class for enemy collision visual feedback
 * Creates expanding rings and burst particles on impact
 */
class HitEffect {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.maxRadius = 50;
        this.life = 255;
        this.decay = GAME_CONFIG.PARTICLES.HIT_DECAY;
        this.particles = [];
        
        // Create burst particles in all directions
        for(let i = 0; i < GAME_CONFIG.PARTICLES.HIT_BURST_COUNT; i++) {
            let angle = (TWO_PI / GAME_CONFIG.PARTICLES.HIT_BURST_COUNT) * i;
            this.particles.push({
                x: x,
                y: y,
                vx: cos(angle) * 3,
                vy: sin(angle) * 3,
                life: 255
            });
        }
    }
    
    update() {
        this.radius += 1.8;
        this.life -= this.decay;
        // Update burst particles
        for(let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 15;
        }
    }
    
    display() {
        push();
        // Draw expanding rings
        stroke(255, 100, 100, this.life);
        strokeWeight(3);
        noFill();
        ellipse(this.x, this.y, this.radius);
        
        stroke(255, 150, 100, this.life * 0.6);
        strokeWeight(2);
        ellipse(this.x, this.y, this.radius * 0.6);
        
        // Draw burst particles
        fill(255, 100, 100, this.life);
        noStroke();
        for(let p of this.particles) {
            if(p.life > 0) {
                ellipse(p.x, p.y, 4);
            }
        }
        pop();
    }
    
    displayWithOffset(cameraOffset) {
        push();
        // Draw expanding rings with camera offset
        stroke(255, 100, 100, this.life);
        strokeWeight(3);
        noFill();
        ellipse(this.x - cameraOffset, this.y, this.radius);
        
        stroke(255, 150, 100, this.life * 0.6);
        strokeWeight(2);
        ellipse(this.x - cameraOffset, this.y, this.radius * 0.6);
        
        // Draw burst particles with camera offset
        fill(255, 100, 100, this.life);
        noStroke();
        for(let p of this.particles) {
            if(p.life > 0) {
                ellipse(p.x - cameraOffset, p.y, 4);
            }
        }
        pop();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

/**
 * Enemy class for game enemies
 */
function Enemy(x, y, range) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.inc = 1.4;
    this.facingLeft = false;

    this.update = function() {
        this.current_x += this.inc;
        if(this.current_x > this.x + this.range) {
            this.inc = -1.4;
            this.facingLeft = true;
        }
        if(this.current_x < this.x) {
            this.inc = 1.4;
            this.facingLeft = false;
        }
    }

    this.draw = function() {
        this.update();
        createEnemies(this.current_x, this.y, this.facingLeft);
    }
    
    this.checkEnemies = function(char_x, char_y) {
        var d = dist(char_x, char_y, this.current_x, this.y);
        if(d < 30) {
            return true;
        }
        return false;
    }
}
