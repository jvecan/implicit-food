angular.module('play').factory("foodGame", function($q, $timeout, dbFactory, roundManager) {
    var healthyFoods = [];
    var unhealthyFoods = [];
    var combinedItems = [];

    var positiveCategoryId = 1;
    var negativeCategoryId = 2;

    var positiveCategoryData = [];
    var negativeCategoryData = [];

    var leftCategoryData = [];
    var rightCategoryData = [];

    var currentRound = 0;
    var maxRounds = 10;

    var roundData = [];

    var startTime;
    var endTime;

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var getMaxRounds = function() {
        return maxRounds;
    };

    var getPositiveItems = function() {
        return healthyFoods;
    };
    var getNegativeItems = function() {
        return unhealthyFoods;
    };

    var resetPositiveItems = function() {
        healthyFoods.length = 0;
    };

    var resetNegativeItems = function() {
        unhealthyFoods.length = 0;
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


    function setStartTime(time) {
        startTime = time;
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


    var getNextDisplayItem = function() {
        if (currentRound == 0) {

            startTime = Date.now();
            combinedItems = setupCombinedArray(healthyFoods, unhealthyFoods);
            combinedItems = shuffle(combinedItems);

        }
        return combinedItems[currentRound];
    };


    var initializePositiveCategory = function() {

        var query = 'SELECT id, name FROM attribute_category WHERE id =  ' + positiveCategoryId
        dbFactory.execute(query, [], positiveCategoryData);

    };

    var initializeNegativeCategory = function() {
        var query = 'SELECT id, name FROM attribute_category WHERE id =  ' + negativeCategoryId
        dbFactory.execute(query, [], negativeCategoryData);
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
        getPositiveItems: getPositiveItems,
        getNegativeItems: getNegativeItems,
        getNextDisplayItem: getNextDisplayItem,
        getLeftTouchAreaData: getLeftTouchAreaData,
        getRightTouchAreaData: getRightTouchAreaData,

        getMaxRounds: getMaxRounds,
        getCurrentRound: getRound,
        setStartTime: setStartTime,
        getStartTime: getStartTime,
        getEndTime: getEndTime,
        resetRoundData: resetRoundData,

        advanceRoundCounter: advanceRoundCounter,
        initializeHealthyItems: function() {
            combinedItems.length = 0;
            resetPositiveItems();
            resetRoundData();
            currentRound = 0;

            positiveCategoryData.length = 0;
            negativeCategoryData.length = 0;
            leftCategoryData.length = 0;
            rightCategoryData.length = 0;

            initializePositiveCategory();


            var query = 'SELECT food_id, name, attribute_category_id FROM food_attribute_category, food ' +
                'WHERE food_attribute_category.id IN (SELECT id FROM food_attribute_category WHERE attribute_category_id = ' + positiveCategoryId +
                ' ORDER BY RANDOM() LIMIT 5) AND food.id = food_attribute_category.food_id';
            dbFactory.execute(query, [], healthyFoods);
            return healthyFoods; // Return promise for resolve in routing. 

        },
        initializeUnhealthyItems: function() {
            combinedItems.length = 0;
            resetNegativeItems();
            resetRoundData();

            currentRound = 0;


            initializeNegativeCategory();
            setupCategoryPositions();
            var query = 'SELECT food_id, name, attribute_category_id FROM food_attribute_category, food ' +
                'WHERE food_attribute_category.id IN (SELECT id FROM food_attribute_category WHERE attribute_category_id = ' + negativeCategoryId +
                ' ORDER BY RANDOM() LIMIT 5) AND food.id = food_attribute_category.food_id';
            dbFactory.execute(query, [], unhealthyFoods);

            return unhealthyFoods; // Return promise for resolve in routing. 
        }


    };

});