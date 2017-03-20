angular.module('play').factory("gameItems", function($q, $timeout, dbFactory) {
    var healthyFoods = [];
    var unhealthyFoods = [];
    var combinedItems = [];

    var positiveAttributeCategory = [];
    var negativeAttributeCategory = [];

    var positiveAttributeWords = [];
    var negativeAttributeWords = [];

    var maximumRounds = 20;
    var currentRound = 0;

    var roundData = [];

    var previousItemId;

    var startTime;
    var endTime;

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var getRoundData = function() {
        return roundData;
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
    }

    function setStartTime(time) {
        startTime = time;
    }

    function setEndTime(time) {
        endTime = time;
    }

    function setEndTime() {
        endTime = startTime;
    }

    function differenceMilliseconds() {
        return getStartTime() - getEndTime();
    }

    function advanceRoundCounter() {
        currentRound++;
    }

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
    }


    function setupCombinedArray(arrayOne, arrayTwo) {
        //var combined = [];
        //var shuffledArrayOne = arrayOne;

        // console.log(arrayOne);
        arrayOne = shuffle(arrayOne);
        arrayTwo = shuffle(arrayTwo);
        //        console.log(arrayOne);

        //shuffle(arrayTwo);

        //console.log(arrayOne);
        // console.log(arrayTwo);

        if (arrayOne[arrayOne.length - 1].name === arrayTwo[0].name) { // ensure no consecutives
            arrayTwo.reverse();
        }

        // arrayOne.concat(arrayTwo);

        //combined = arrayOne;

        Array.prototype.push.apply(arrayOne, arrayTwo);

        console.log("inside" + arrayOne);

        return arrayOne;
    }





    var getRandomFoodItem = function() {
        //endTime = startTime;
        //startTime = Date.now();

        //endTime = startTime;
        //startTime = Date.now();

        /*
        currentRound++;
        var randomizedFoodType = randomIntFromInterval(1, 2);
        if (randomizedFoodType == 1) {
            return healthyFoods[Math.floor(Math.random() * healthyFoods.length)];
        } else if (randomizedFoodType == 2) {
            return unhealthyFoods[Math.floor(Math.random() * unhealthyFoods.length)];
        }
        */
        if (currentRound == 0) { // don't save roundData on showing first image

            startTime = Date.now();
            combinedItems = setupCombinedArray(healthyFoods, unhealthyFoods);
            combinedItems = shuffle(combinedItems);
            //console.log(combinedItems);
        }





        //console.log(combinedItems);

        //return combinedItems[Math.floor(Math.random() * combinedItems.length)];


        return combinedItems[currentRound];



        /*
        var randomizedFoodType = randomIntFromInterval(1, 2);
        if (randomizedFoodType == 1) {
            return healthyFoods[Math.floor(Math.random() * healthyFoods.length)];
        } else if (randomizedFoodType == 2) {
            return unhealthyFoods[Math.floor(Math.random() * unhealthyFoods.length)];
        }
        */

        /*
        currentRound++;
        var randomizedFoodType = randomIntFromInterval(1, 2);
        if (randomizedFoodType == 1) {
            return healthyFoods[Math.floor(Math.random() * healthyFoods.length)];
        } else if (randomizedFoodType == 2) {
            return unhealthyFoods[Math.floor(Math.random() * unhealthyFoods.length)];
        }

        */


    }



    return {
        getHealthyItems: getHealthyFoods,
        getUnhealthyItems: getUnhealthyFoods,
        getRandomItem: getRandomFoodItem,
        differenceInMilliseconds: differenceMilliseconds,
        getRoundSummary: getRoundData,
        getCurrentRound: getRound,
        setStartTime: setStartTime,
        setEndTime: setEndTime,
        getStartTime: getStartTime,
        getEndTime: getEndTime,
        resetRoundData: resetRoundData,
        advanceRoundCounter: advanceRoundCounter,
        initializeHealthyItems() {
            combinedItems.length = 0;
            resetHealthyFoods();
            resetRoundData();

            currentRound = 0;
            var type = 1;
            var query = 'SELECT food_id, name, attribute_category_id FROM food_attribute_category, food ' +
                'WHERE food_attribute_category.id IN (SELECT id FROM food_attribute_category WHERE attribute_category_id = ' + type +
                ' ORDER BY RANDOM() LIMIT 5) AND food.id = food_attribute_category.food_id';
            var params = [];
            dbFactory.execute(query, params, healthyFoods);
            return getHealthyFoods();

        },
        initializeUnhealthyItems() {
            combinedItems.length = 0;
            resetUnhealthyFoods();
            resetRoundData();


            currentRound = 0;
            var type = 2;
            var query = 'SELECT food_id, name, attribute_category_id FROM food_attribute_category, food ' +
                'WHERE food_attribute_category.id IN (SELECT id FROM food_attribute_category WHERE attribute_category_id = ' + type +
                ' ORDER BY RANDOM() LIMIT 5) AND food.id = food_attribute_category.food_id';
            var params = [];
            dbFactory.execute(query, params, unhealthyFoods);


            return getUnhealthyFoods();
        },
        addRoundInfo(side, foodName, difference) {

            var roundObj = { 'side': side, 'name': foodName, 'time': difference };
            //var roundObj = { 'name': side, 'url':'https://davidwalsh.name', 'girl':'Kristina'}
            roundData.push(roundObj);
            //
            //roundData.push("side: " + side + ", foodName: " + foodName + ", difference: " + difference + " milliseconds");

        }

    };

});