angular.module('play').factory("scorer", function($q, $timeout) {

    /*

    peruspisteenlasku: 
    (1/(millisekunnit/1000))^1,5*10*oikein/väärin(eli 1/0), 

    perfect round multiplier 1,25x, 
    perfect healthy food multiplier 1,1x, 
    perfect unhealthy food multiplier 1,1x, 

    */
    var perfectGameMultiplier = 1.25;
    var perfectHealthyFoodMultiplier = 1.1;
    var perfectUnhealthyFoodMultiplier = 1.1;

    var scoreFoodRound = function(reaction_time) {
        if (reaction_time < 300) {
            reaction_time = 300;
        }
        var score = Math.pow(1 / (reaction_time / 1000), 1.5) * 10;
        return score;
    };

    var scoreAttributeRound = function(reaction_time) {
        if (reaction_time < 300) {
            reaction_time = 300;
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


    return {
        scoreFoodRound: scoreFoodRound,
        scoreAttributeRound: scoreAttributeRound,
        calculateTotalScore: calculateTotalScore


    };

});