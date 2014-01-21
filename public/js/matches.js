function initializeMatchHandler(settings) {

    $('.add-league').on('click', function() {
        $.ajax({
            url: settings.addLeagueUrl,
            type: 'post',
            data: { _csrf: $('._csrf').val(), name: $('#new-league-name').val() }
        })
        .done(function(league) {
            alert(league.name);
        })
        .fail(function() {
            alert('failure');
        });
    });
};