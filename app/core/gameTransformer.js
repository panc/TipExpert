
exports.transformToGameForPlayer = function(game, userId) {
    var player = findUserObject(game.players, userId);
    var userPoints = calculateUserPoints(game.matches);
	
	var allPlayers = [];
    var tips = [];

    for (var i = 0; i < game.players.length; i++)
        allPlayers.push(transformPlayer(game.players[i], userPoints));

    for (var i = 0; i < game.matches.length; i++) 
        tips.push(transformTip(game.matches[i], userId));
    
	sortTips(tips, userPoints);
	sortPlayers(allPlayers, userPoints);
	
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

var transformPlayer = function(player, userPoints) {

    var user = player.user;
    var picture = '../images/noavatar.png';
	var points = userPoints[user._id];

    if (user.google)
        picture = user.google.picture;
    if (user.facebook)
        picture = user.facebook.picture.data.url;

    return {
		userId: user._id,
        name: user.name,
        picture: picture,
		points: userPoints[user._id],
        totalPoints: player.totalPoints,
        profit: player.profit
    };
};

var calculateUserPoints = function(matches){

	var userPoints = {};
	
	matches.forEach(function(match){
		match.tips.forEach(function(tip) {
			var points = userPoints[tip.user] || 0;
			userPoints[tip.user] = points + tip.points;
		});
	});
	
	return userPoints;
}

var sortTips = function(tips, userPoints) {
	
	tips.forEach(function(tip){
		tip.finishedTipsOfAllPlayers.sort(function(x, y){
			pointsX = userPoints[x.user];
			pointsY = userPoints[y.user];
			
			return pointsY - pointsX;
		});
	});
};

var sortPlayers = function(players, userPoints) {
	
	players.sort(function(x, y){
		pointsX = userPoints[x.userId];
		pointsY = userPoints[y.userId];
		
		return y.points - x.points;
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