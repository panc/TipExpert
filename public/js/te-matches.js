function initializeMatchHandler(settings) {

    // load match view
    
    var loadMatches = function(item) {
        $('.league-item').removeClass('selected');
        item.addClass('selected');
        
        var id = item.attr('id');
        var url = settings.getMatchesUrl.replace('#id#', id);
        $.get(url, function(data) {
            $('.main-content').html(data);
        });
    };

    if (settings.selectedLeague)
        loadMatches($('#' + settings.selectedLeague));

    $('.league-item').on('click', function() {
        loadMatches($(this));
    });

    // add matches

    $('.main-content').on('click', '.show-add-match-items', function() {
        $(this).hide();
        $('.add-new-match-area').show();
    });

    var addMatch = function() {
        $.ajax({
            url: settings.addMatchUrl,
            type: 'post',
            data: {
                 _csrf: $('._csrf').val(), 
                 homeTeam: $('#new-home-team').val(),
                 guestTeam: $('#new-home-team').val(),
                 dueDate: $('#new-due-date').val()
            }
        })
        .done(function(league) {
            // todo
        })
        .fail(function() {
            alert('failure'); // todo: handle alert correctly with a popup
        });
    };

    $('.add-match').on('click', function() {
        addMatch();
    });
    
    
    // add leagues
    
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