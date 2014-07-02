
exports.transformToGameForPlayer = function(game, userId) {
    var player = findUserObject(game.players, userId);
    var allPlayers = [];
    var tips = [];

    for (var i = 0; i < game.players.length; i++)
        allPlayers.push(transformPlayer(game.players[i]));

    for (var i = 0; i < game.matches.length; i++) 
        tips.push(transformTip(game.matches[i], userId));
    
	sortTips(tips, game.matches, allPlayers);
	
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
    var userTip = findUserObject(match.tips, userId) || { };
	var finishedTipsOfAllPlayers = [];
    
	if (match.match.isFinished()) {
		for (var i = 0; i < match.tips.length; i++) {
			var tip = match.tips[i];
			
			finishedTipsOfAllPlayers.push({
				user: tip.user,
				homeTip: tip.homeScore,
				guestTip: tip.guestScore,
				points: tip.points || 0
			});
		}
	}
	
	/*finishedTipsOfAllPlayers.sort(function(tip1, tip2){
		return tip2.points - tip1.points;
	});*/
	
	return {
        id: userTip._id,
        match: match._id,
        user: userId,
        homeTeam: match.match.homeTeam,
        guestTeam: match.match.guestTeam,
        homeTip: userTip.homeScore,
        guestTip: userTip.guestScore,
        homeResult: match.match.homeScore,
        guestResult: match.match.guestScore,
        points: userTip.points || 0,
        finished: match.match.isFinished(),
		finishedTipsOfAllPlayers: finishedTipsOfAllPlayers
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

var sortTips = function(tips, matches, players) {

	var userPoints = {};
	
	matches.forEach(function(match){
		match.tips.forEach(function(tip) {
			var points = userPoints[tip.user] || 0;
			userPoints[tip.user] = points + tip.points;
		});
	});
	
	tips.forEach(function(tip){
		tip.finishedTipsOfAllPlayers.sort(function(x, y){
			pointsX = userPoints[x.user];
			pointsY = userPoints[y.user];
			
			return pointsY - pointsX;
		});
	});
};

var findUserObject = function(containers, id) {

    for (var i = 0; i < containers.length; i++) {
        var container = containers[i];
        if (container.user.id == id || container.user == id)
            return container;
    }

    return null;
};