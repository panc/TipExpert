function initializeMatchHandler(settings) {

    // load match view
    
    var loadMatches = function(item) {
        $('.league-item').removeClass('selected');
        item.addClass('selected');
        
        var id = item.attr('id');
        var url = settings.getMatchesUrl.replace('#id#', id);
        $.ajax({
            type: 'GET',
            url: url
        })
        .done(function(data) {
            History.pushState(null, null, url);
            $('.main-content').html(data);
        })
        .fail(function(error) {
            alert('error: ');
        });
    };

    if (settings.selectedLeague)
        loadMatches($('#' + settings.selectedLeague));

    $('.left-area').on('click', '.league-item', function() {
        loadMatches($(this));
    });

    // add matches

    $('.main-content').on('click', '.show-add-match-items', function() {
        $(this).hide();
        $('.add-new-match-area').show();
    });

    $('.main-content').on('click', '.save-match', function() {
        $.ajax({
            url: settings.saveMatchUrl,
            type: 'post',
            data: {
                 _csrf: $('._csrf').val(), 
                 homeTeam: $('.home-team').val(),
                 guestTeam: $('.guest-team').val(),
                 dueDate: $('.due-date').val(),
                 league: $('.league-item.selected').attr('id')
            }
        })
        .done(function(match) {
            alert('success');
        })
        .fail(function() {
            alert('failure'); // todo: handle alert correctly with a popup
        });
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
                        'id': league._id,
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