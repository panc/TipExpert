function initializeMatchHandler(settings) {

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