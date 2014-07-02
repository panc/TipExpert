
exports.transformToGameForPlayer = function(game, userId) {
    var player = findUserObject(game.players, userId);
    var allPlayers = [];
    var tips = [];

    for (var i = 0; i < game.players.length; i++)
        allPlayers.push(transformPlayer(game.players[i]));

    for (var i = 0; i < game.matches.length; i++) 
        tips.push(transformTip(game.matches[i], userId));
    
    return {
        id: game._id,
        title: game.title,
        description: game.description,
        creator: game.creator.name,
        allPlayers: allPlayers,
        minStake: game.minStake,
        isFinished: game.isFinished,

        player: {
            id: player._id,
            stake: player.stake || game.minStake,
            stakeNotSet: player.stake == null,
            totalPoints: player.totalPoints,
            profit: player.profit,
            tips: tips
        }
    };
};

var transformTip = function(match, userId) {
    var storedTip = findUserObject(match.tips, userId) || { };

    return {
        id: storedTip._id,
        match: match._id,
        user: userId,
        homeTeam: match.match.homeTeam,
        guestTeam: match.match.guestTeam,
        homeTip: storedTip.homeScore,
        guestTip: storedTip.guestScore,
        homeResult: match.match.homeScore,
        guestResult: match.match.guestScore,
        points: storedTip.points || 0,
        finished: match.match.isFinished()
    };
}

var transformPlayer = function(player) {

    var user = player.user;
    var picture = '../images/noavatar.png';

    if (user.google)
        picture = user.google.picture;
    if (user.facebook)
        picture = user.facebook.picture.data.url;

    return {
        name: user.name,
        picture: picture,
        totalPoints: player.totalPoints,
        profit: player.profit
    };
};

var findUserObject = function(containers, id) {

    for (var i = 0; i < containers.length; i++) {
        var container = containers[i];
        if (container.user.id == id || container.user == id)
            return container;
    }

    return null;
};