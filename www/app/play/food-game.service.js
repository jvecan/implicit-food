angular.module('play').factory("foodGame", function($q, $timeout, dbFactory, roundManager, player) {
    var positiveCategoryData = [];
    var negativeCategoryData = [];
    var combinedItems = [];

    var playerLevel = 0;

    var positiveCategoryId = 1;
    var negativeCategoryId = 2;

    var healthyFoods = [];
    var unhealthyFoods = [];

    var leftCategoryData = [];
    var rightCategoryData = [];

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

    var getPositiveCategory = function() {
        return positiveCategoryData;
    };

    var getNegativeCategory = function() {
        return negativeCategoryData;
    };

    var getHealthyFoods = function() {
        return healthyFoods;
    };

    var getUnhealthyFoods = function() {
        return unhealthyFoods;
    };

    var resetHealthyFoods = function() {
        healthyFoods.length = 0;
    };

    var resetUnhealthyFoods = function() {
        unhealthyFoods.length = 0;
    };

    var resetPositiveCategory = function() {
        positiveCategoryData.length = 0;
    };

    var resetNegativeCategory = function() {
        negativeCategoryData.length = 0;
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

    var setupCategoryPositions = function() {
        var randomCat = randomIntFromInterval(1, 2);
        if (randomCat == 1) {
            leftCategoryData = positiveCategoryData;
            rightCategoryData = negativeCategoryData;
        } else {
            leftCategoryData = negativeCategoryData;
            rightCategoryData = positiveCategoryData;
        }
    };

    var getLeftTouchAreaData = function() {
        return leftCategoryData[0];
    };

    var getRightTouchAreaData = function() {
        return rightCategoryData[0];
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
            combinedItems = setupCombinedArray(healthyFoods, unhealthyFoods);
            combinedItems = shuffle(combinedItems);
        }
        return combinedItems[currentRound];
    };

    var initializePositiveCategory = function() {
        var query = 'SELECT attribute_word_id AS item_id, name, attribute_category_id FROM attribute_category_word, attribute_word ' +
            'WHERE attribute_category_word.id IN (SELECT id FROM attribute_category_word WHERE attribute_category_id = ' + positiveCategoryId +
            ' ORDER BY RANDOM() LIMIT 1) AND attribute_word.id = attribute_category_word.attribute_word_id';
        dbFactory.execute(query, [], positiveCategoryData);
    };

    var initializeNegativeCategory = function() {
        var query = 'SELECT attribute_word_id AS item_id, name, attribute_category_id FROM attribute_category_word, attribute_word ' +
            'WHERE attribute_category_word.id IN (SELECT id FROM attribute_category_word WHERE attribute_category_id = ' + negativeCategoryId +
            ' ORDER BY RANDOM() LIMIT 1) AND attribute_word.id = attribute_category_word.attribute_word_id';
        dbFactory.execute(query, [], negativeCategoryData);
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
        getHealthyFoods: getHealthyFoods,
        getUnhealthyFoods: getUnhealthyFoods,
        getNextDisplayItem: getNextDisplayItem,
        getLeftTouchAreaData: getLeftTouchAreaData,
        getRightTouchAreaData: getRightTouchAreaData,
        getPositiveCategory: getPositiveCategory,
        getNegativeCategory: getNegativeCategory,
        setupRoundInfo: setupRoundInfo,
        getMaxRounds: getMaxRounds,
        getCurrentRound: getCurrentRound,
        setStartTime: setStartTime,
        getStartTime: getStartTime,
        getEndTime: getEndTime,
        advanceRoundCounter: advanceRoundCounter,

        initializeHealthyItems: function() {
            combinedItems.length = 0;

            player.getPlayerInfoFromDb().then(function() {
                var playerData = player.getPlayerInfo();
                playerLevel = playerData.level;

                resetHealthyFoods();
                resetPositiveCategory();
                initializePositiveCategory();

                var query = 'SELECT food.id AS food_id, name, level, food_attribute_category.attribute_category_id AS attribute_category_id FROM food, food_attribute_category ' +
                    'WHERE level <= ' + playerLevel + ' AND food_attribute_category.attribute_category_id = ' + positiveCategoryId +
                    ' AND food_attribute_category.food_id = food.id ORDER BY RANDOM() LIMIT 5';
                dbFactory.execute(query, [], healthyFoods);
                return healthyFoods; // Return promise for resolve in routing. 
            });

        },
        initializeUnhealthyItems: function() {
            combinedItems.length = 0;

            player.getPlayerInfoFromDb().then(function() {
                var playerData = player.getPlayerInfo();
                playerLevel = playerData.level;

                resetUnhealthyFoods();
                resetNegativeCategory();
                initializeNegativeCategory();
                setupCategoryPositions();

                var query = 'SELECT food.id AS food_id, name, level, food_attribute_category.attribute_category_id AS attribute_category_id FROM food, food_attribute_category ' +
                    'WHERE level <= ' + playerLevel + ' AND food_attribute_category.attribute_category_id = ' + negativeCategoryId +
                    ' AND food_attribute_category.food_id = food.id ORDER BY RANDOM() LIMIT 5';
                dbFactory.execute(query, [], unhealthyFoods);

                return unhealthyFoods; // Return promise for resolve in routing. 
            });
        }


    };

});