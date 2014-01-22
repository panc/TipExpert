function initializeMatchHandler(settings) {

    var loadMatches = function(item) {
        $('.league-item').removeClass('selected');
        item.addClass('selected');
        
        var id = item.attr('id');
        $.get(settings.getMatchesUrl + id, function(data) {
            $('.main-content').html(data);
        });
    };

//    if (settings.selectedLeague)
//        loadMatches($('#' + settings.selectedLeague));

    $('.league-item').on('click', function() {
        loadMatches($(this));
    });

    var addLeague = function() {
        $.ajax({
            url: settings.addLeagueUrl,
            type: 'post',
            data: { _csrf: $('._csrf').val(), name: $('#new-league-name').val() }
        })
        .done(function(league) {
            $('#new-league-name').val('');
            $('<li>').html(
                $('<div>',
                    {
                        'id': league.id,
                        'class': 'league-item',
                        'html': league.name
                    }))
                .insertBefore($('.new-item'));
        })
        .fail(function() {
            alert('failure'); // todo: handle alert correctly with a popup
        });
    };

    $('.add-league').on('click', function() {
        addLeague();
    });

    $('#new-league-name').keypress(function(e) {
        if (e.which == 13)
            addLeague();
    });
};