angular.module('play').factory("scorer", function($q, $timeout, dbFactory) {

    /*

    peruspisteenlasku: 
    (1/(millisekunnit/1000))^1,5*10*oikein/väärin(eli 1/0), 

    perfect round multiplier 1,25x, 
    perfect healthy food multiplier 1,1x, 
    perfect unhealthy food multiplier 1,1x, 

    */

    var bonusInfo = {};

    var getBonusInfo = function() {
        return bonusInfo;
    }

    var scoreFoodRound = function(reaction_time) {
        if (reaction_time < 300) {
            reaction_time = 300;
        }
        if (reaction_time > 2000) {
            reaction_time = 2000;
        }
        var score = Math.pow(1 / (reaction_time / 1000), 1.5) * 10;
        return score;
    };

    var scoreAttributeRound = function(reaction_time) {
        if (reaction_time < 300) {
            reaction_time = 300;
        }
        if (reaction_time > 2000) {
            reaction_time = 2000;
        }
        var score = Math.pow(1 / (reaction_time / 1000), 1.5) * 10;
        return score;
    };

    var calculateTotalScore = function(roundData) {
        var totalScore = 0;
        for (var i = 0; i < roundData.length; i++) {
            totalScore = totalScore + roundData[i].points;
        }
        return totalScore;
    };

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    var giveTotalBonuses = function(totalScore, roundStatistics, roundData) {
        bonusInfo = {};

        console.log(roundStatistics["correctResponses"]);

        if (roundStatistics["correctResponses"] == roundData.length) {
            bonusInfo.perfectRound = " (25 point bonus)";
            totalScore += 25;
            if (roundStatistics["averageReactionTime"] <= 700) {
                totalScore += 50;
                bonusInfo.perfectFastRound = " (50 point bonus)";
            }
        }
        if (Math.floor(Math.random() * (7 - 1 + 1) + 1) == 4) {
            var randomFood = [];
            var query = 'SELECT food.name as food_name, attribute_word.name as word_name FROM attribute_word, food ORDER BY RANDOM() limit 1';
            dbFactory.execute(query, [], randomFood).then(function() {
                bonusInfo.surpriseBonus = "The magical appearance of " + randomFood[0].word_name + " " + capitalize(randomFood[0].food_name) + " grants you 100 extra points!";
            });
            totalScore += 100;
        }

        return totalScore;

    };


    return {
        scoreFoodRound: scoreFoodRound,
        scoreAttributeRound: scoreAttributeRound,
        calculateTotalScore: calculateTotalScore,
        giveTotalBonuses: giveTotalBonuses,
        getBonusInfo: getBonusInfo
    };

});