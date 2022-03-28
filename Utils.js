// create a function that takes xp points and assigns a level on a difficulty curve
function getLevel(xp) {
    if (xp < 100) {
        return 1;
    } else if (xp < 1000) {
        return 2;
    } else if (xp < 10000) {
        return 3;
    } else if (xp < 100000) {
        return 4;
    } else if (xp < 1000000) {
        return 5;
    } else if (xp < 10000000) {
        return 6;
    } else if (xp < 100000000) {
        return 7;
    } else if (xp < 1000000000) {
        return 8;
    } else if (xp < 10000000000) {
        return 9;
    } else if (xp < 100000000000) {
        return 10;
    } else {
        return 11;
    }
}

// create a function to get the multiplier for the sandwich, based on the user's level and upgrades
function getMultiplier(data) {
    var multiplier = 1;
    if (data.upgrade_qualityIngredients === 0) {
        multiplier *= 1;
    } else if (data.upgrade_qualityIngredients === 1) {
        multiplier *= 1.25;
    } else if (data.upgrade_qualityIngredients === 2) {
        multiplier *= 1.5;
    } else if (data.upgrade_qualityIngredients === 3) {
        multiplier *= 1.75;
    } else if (data.upgrade_qualityIngredients === 4) {
        multiplier *= 2;
    } else if (data.upgrade_qualityIngredients === 5) {
        multiplier *= 2.25;
    } else if (data.upgrade_qualityIngredients === 6) {
        multiplier *= 2.5;
    } else if (data.upgrade_qualityIngredients === 7) {
        multiplier *= 2.75;
    } else if (data.upgrade_qualityIngredients === 8) {
        multiplier *= 3;
    } else if (data.upgrade_qualityIngredients === 9) {
        multiplier *= 3.25;
    } else {
        multiplier *= 3.5;
    }


    return multiplier * data.sandwichMultiplier;
}

module.exports = { getLevel, getMultiplier };
