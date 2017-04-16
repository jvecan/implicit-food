angular.module('play').factory("attributeGame", function($q, $timeout, dbFactory, roundManager, player) {
    var healthyFood = []; // left/right side item
    var unhealthyFood = []; // left/right side item
    var combinedItems = []; // game item array that is randomized

    var playerLevel = 0;

    var positiveCategoryId = 1;
    var negativeCategoryId = 2;

    var positiveWords = [];
    var negativeWords = [];

    var leftFoodData = [];
    var rightFoodData = [];

    var currentRound = 0;
    var maxRounds = 10;

    var startTime;
    var endTime;

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var getMaxRounds = function() {
        return maxRounds;
    };

    var getHealthyFood = function() {
        return healthyFood;
    };

    var getUnhealthyFood = function() {
        return unhealthyFood;
    };

    var getPositiveWords = function() {
        return positiveWords;
    };

    var getNegativeWords = function() {
        return negativeWords;
    };

    var resetHealthyFood = function() {
        healthyFood.length = 0;
    };

    var resetUnhealthyFood = function() {
        unhealthyFood.length = 0;
    };

    var resetPositiveWords = function() {
        positiveWords.length = 0;
    };

    var resetNegativeWords = function() {
        negativeWords.length = 0;
    };

    var getStartTime = function() {
        return startTime;
    };

    function setStartTime(time) {
        startTime = time;
    }

    var getEndTime = function() {
        return endTime;
    };

    var getCurrentRound = function() {
        return currentRound;
    };

    var setupFoodPositions = function() {
        var randomCat = randomIntFromInterval(1, 2);
        if (randomCat == 1) {
            leftFoodData = healthyFood;
            rightFoodData = unhealthyFood;
        } else {
            leftFoodData = unhealthyFood;
            rightFoodData = healthyFood;
        }
    }

    var getLeftTouchAreaData = function() {
        return leftFoodData[0];
    };

    var getRightTouchAreaData = function() {
        return rightFoodData[0];
    };

    function advanceRoundCounter() {
        currentRound++;
    }

    function setupCombinedArray(arrayOne, arrayTwo) {
        arrayOne = shuffle(arrayOne);
        arrayTwo = shuffle(arrayTwo);

        if (arrayOne[arrayOne.length - 1].name === arrayTwo[0].name) { // ensure no consecutives
            arrayTwo.reverse();
        }

        Array.prototype.push.apply(arrayOne, arrayTwo);
        return arrayOne;
    };

    var getNextDisplayItem = function() {
        if (currentRound == 0) {
            startTime = Date.now();
            combinedItems = setupCombinedArray(positiveWords, negativeWords);
            combinedItems = shuffle(combinedItems);
        }
        return combinedItems[currentRound];
    };

    var initializeHealthyFood = function() {
        var query = 'SELECT food.id AS food_id, name, level, food_attribute_category.attribute_category_id AS attribute_category_id FROM food, food_attribute_category ' +
            'WHERE level <= ' + playerLevel + ' AND food_attribute_category.attribute_category_id = ' + positiveCategoryId +
            ' AND food_attribute_category.food_id = food.id ORDER BY RANDOM() LIMIT 1';
        dbFactory.execute(query, [], healthyFood);
    };

    var initializeUnhealthyFood = function() {
        var query = 'SELECT food.id AS food_id, name, level, food_attribute_category.attribute_category_id AS attribute_category_id FROM food, food_attribute_category ' +
            'WHERE level <= ' + playerLevel + ' AND food_attribute_category.attribute_category_id = ' + negativeCategoryId +
            ' AND food_attribute_category.food_id = food.id ORDER BY RANDOM() LIMIT 1';
        dbFactory.execute(query, [], unhealthyFood);
    };

    var setupRoundInfo = function(maximumRounds) {
        currentRound = 0;
        maxRounds = maximumRounds;
    };

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };


    return {
        getPositiveWords: getPositiveWords,
        getNegativeWords: getNegativeWords,
        getNextDisplayItem: getNextDisplayItem,
        getLeftTouchAreaData: getLeftTouchAreaData,
        getRightTouchAreaData: getRightTouchAreaData,
        getHealthyFood: getHealthyFood,
        getUnhealthyFood: getUnhealthyFood,
        setupRoundInfo: setupRoundInfo,
        getMaxRounds: getMaxRounds,
        getCurrentRound: getCurrentRound,
        setStartTime: setStartTime,
        getStartTime: getStartTime,
        getEndTime: getEndTime,
        advanceRoundCounter: advanceRoundCounter,

        initializePositiveWords: function() {
            combinedItems.length = 0;

            player.getPlayerInfoFromDb().then(function() {
                var playerData = player.getPlayerInfo();
                playerLevel = playerData.level;

                resetPositiveWords();
                resetHealthyFood();
                initializeHealthyFood();

                var query = 'SELECT attribute_word_id, name, attribute_category_id FROM attribute_category_word, attribute_word ' +
                    'WHERE attribute_category_word.id IN (SELECT id FROM attribute_category_word WHERE attribute_category_id = ' + positiveCategoryId +
                    ' ORDER BY RANDOM() LIMIT 5) AND attribute_word.id = attribute_category_word.attribute_word_id';
                dbFactory.execute(query, [], positiveWords);
                return positiveWords; // Return promise for resolve in routing. 
            });

        },
        initializeNegativeWords: function() {
            combinedItems.length = 0;

            player.getPlayerInfoFromDb().then(function() {
                var playerData = player.getPlayerInfo();
                playerLevel = playerData.level;

                resetNegativeWords();
                resetUnhealthyFood();
                initializeUnhealthyFood();
                setupFoodPositions();

                var query = 'SELECT attribute_word_id, name, attribute_category_id FROM attribute_category_word, attribute_word ' +
                    'WHERE attribute_category_word.id IN (SELECT id FROM attribute_category_word WHERE attribute_category_id = ' + negativeCategoryId +
                    ' ORDER BY RANDOM() LIMIT 5) AND attribute_word.id = attribute_category_word.attribute_word_id';
                dbFactory.execute(query, [], negativeWords);

                return negativeWords; // Return promise for resolve in routing. 
            });
        }



    };

});