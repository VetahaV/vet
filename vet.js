(function () {

    var PLAYLIST_URL = 'http://pl.ru-tv.site/bcc73d92/33fcd1b1/line.m3u'; // <-- ТУТ СВОЙ URL

    function startPlugin() {
        Lampa.Listener.send('activity', {
            type: 'add',
            data: {
                title: 'VET IPTV',
                component: 'vet_iptv'
            }
        });
    }

    Lampa.Component.add('vet_iptv', {
        name: 'VET IPTV',

        render: function () {
            this.html = $('<div class="content"><div class="items" id="vet_items">Загрузка...</div></div>');
            this.start();
        },

        start: function () {
            loadPlaylist();
        }
    });

    function loadPlaylist() {
        Lampa.Request.get(PLAYLIST_URL, function (text) {
            parseM3U(text);
        }, function () {
            $('#vet_items').html('Ошибка загрузки плейлиста');
        });
    }

    function parseM3U(text) {
        var lines = text.split('\n');
        var html = '';

        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf('#EXTINF') === 0) {
                var name = lines[i].split(',')[1] || 'Канал';
                var stream = lines[i + 1];

                html += '<div class="item" data-url="' + stream + '">' + name + '</div>';
            }
        }

        $('#vet_items').html(html);

        $('.item').on('click', function () {
            playChannel($(this).data('url'));
        });
    }

    function playChannel(url) {
        Lampa.Player.play({
            title: 'IPTV',
            url: url
        });
    }

    Lampa.Plugins.on('ready', startPlugin);

    return {
        name: 'Vet IPTV',
        version: '1.0',
        author: 'VetahaV'
    };

})();
