angular.module('play').factory("attributeGame", function($q, $timeout, dbFactory, roundManager) {
    var healthyFood = [];
    var unhealthyFood = [];
    var combinedItems = [];

    var positiveCategoryId = 1;
    var negativeCategoryId = 2;

    var positiveWords = [];
    var negativeWords = [];

    var leftFoodData = [];
    var rightFoodData = [];

    var currentRound = 0;

    var roundData = [];

    var startTime;
    var endTime;

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var getRoundData = function() {
        return roundData;
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

    var resetRoundData = function() {
        roundData.length = 0;
    };

    var getStartTime = function() {
        return startTime;
    };

    var getEndTime = function() {
        return endTime;
    };

    var getRound = function() {
        return currentRound;
    };

    var setupFoodPositions = function() {
        var randomCat = randomIntFromInterval(1, 2);

        if (randomCat == 1) {
            console.log("ykkösrandom");
            leftFoodData = healthyFood;
            rightFoodData = unhealthyFood;
        } else {
            console.log("kakkosrandom");
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

    function setStartTime(time) {
        startTime = time;
    }

    function differenceMilliseconds() {
        return getStartTime() - getEndTime();
    }

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

        console.log("inside" + arrayOne);

        return arrayOne;
    };

    // refactored
    var getNextDisplayItem = function() {
        if (currentRound == 0) {

            startTime = Date.now();
            combinedItems = setupCombinedArray(positiveWords, negativeWords);
            combinedItems = shuffle(combinedItems);

        }
        return combinedItems[currentRound];
    };


    var initializeHealthyFood = function() {
        var query = 'SELECT food_id, name, attribute_category_id AS id FROM food_attribute_category, food ' +
            'WHERE food_attribute_category.id IN (SELECT id FROM food_attribute_category WHERE attribute_category_id = ' + positiveCategoryId +
            ' ORDER BY RANDOM() LIMIT 1) AND food.id = food_attribute_category.food_id';
        dbFactory.execute(query, [], healthyFood);
    };

    var initializeUnhealthyFood = function() {
        var query = 'SELECT food_id, name, attribute_category_id AS id FROM food_attribute_category, food ' +
            'WHERE food_attribute_category.id IN (SELECT id FROM food_attribute_category WHERE attribute_category_id = ' + negativeCategoryId +
            ' ORDER BY RANDOM() LIMIT 1) AND food.id = food_attribute_category.food_id';
        dbFactory.execute(query, [], unhealthyFood);
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
        // yhteisiä
        differenceInMilliseconds: differenceMilliseconds,
        getRoundSummary: getRoundData,
        getCurrentRound: getRound,
        setStartTime: setStartTime,
        getStartTime: getStartTime,
        getEndTime: getEndTime,
        resetRoundData: resetRoundData,
        advanceRoundCounter: advanceRoundCounter,
        // yhteisiä loppuu
        initializePositiveWords: function() {
            combinedItems.length = 0;
            resetPositiveWords();
            resetRoundData();
            resetUnhealthyFood();
            resetHealthyFood();

            currentRound = 0;

            initializeHealthyFood();

            var query = 'SELECT attribute_word_id, name, attribute_category_id FROM attribute_category_word, attribute_word ' +
                'WHERE attribute_category_word.id IN (SELECT id FROM attribute_category_word WHERE attribute_category_id = ' + positiveCategoryId +
                ' ORDER BY RANDOM() LIMIT 5) AND attribute_word.id = attribute_category_word.attribute_word_id';
            dbFactory.execute(query, [], positiveWords);

            return positiveWords; // Return promise for resolve in routing. 

        },
        initializeNegativeWords: function() {
            combinedItems.length = 0;
            resetNegativeWords();
            resetRoundData();
            currentRound = 0;

            initializeUnhealthyFood();

            setupFoodPositions();

            console.log(healthyFood);
            console.log(unhealthyFood);

            var query = 'SELECT attribute_word_id, name, attribute_category_id FROM attribute_category_word, attribute_word ' +
                'WHERE attribute_category_word.id IN (SELECT id FROM attribute_category_word WHERE attribute_category_id = ' + negativeCategoryId +
                ' ORDER BY RANDOM() LIMIT 5) AND attribute_word.id = attribute_category_word.attribute_word_id';

            dbFactory.execute(query, [], negativeWords);

            return negativeWords; // Return promise for resolve in routing. 
        },
        addRoundInfo: function(side, correctSide, foodName, difference) {
            var roundObj = { 'side': side, 'correctSide': correctSide, 'name': foodName, 'time': difference };
            roundData.push(roundObj);
        }

    };

});