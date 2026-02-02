/**
 * Utility Functions
 * Helper functions for sound management and common operations
 */

/**
 * Verify and play a sound if it's not already playing
 * @param {p5.Sound} sound - The sound object to play
 */
function verifySound(sound) {
    if(sound && sound.isPlaying && sound.isPlaying() == false) {
        sound.play();
    }
}

/**
 * Stop a sound if it's playing
 * @param {p5.Sound} sound - The sound object to stop
 */
function stopSound(sound) {
    if(sound && sound.isPlaying && sound.isPlaying() == true) {
        sound.stop();
    }
}

/**
 * Set sound volume safely
 * @param {p5.Sound} sound - The sound object
 * @param {number} volume - Volume level (0-1)
 */
function setSoundVolume(sound, volume) {
    if(sound) {
        sound.setVolume(volume);
    }
}

/**
 * Linear interpolation between two values
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Get distance between two points
 * @param {number} x1 - First x coordinate
 * @param {number} y1 - First y coordinate
 * @param {number} x2 - Second x coordinate
 * @param {number} y2 - Second y coordinate
 * @returns {number} Distance between points
 */
function getDistance(x1, y1, x2, y2) {
    return dist(x1, y1, x2, y2);
}

/**
 * Map a value from one range to another
 * @param {number} value - Value to map
 * @param {number} start1 - Start of original range
 * @param {number} end1 - End of original range
 * @param {number} start2 - Start of new range
 * @param {number} end2 - End of new range
 * @returns {number} Mapped value
 */
function mapValue(value, start1, end1, start2, end2) {
    return map(value, start1, end1, start2, end2);
}
