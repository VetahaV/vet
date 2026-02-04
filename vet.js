(function () {

    var PLAYLIST_URL = 'http://pl.ru-tv.site/bcc73d92/33fcd1b1/line.m3u';

    function startPlugin() {
        Lampa.Activity.push({
            component: 'vet_iptv',
            title: 'VET IPTV',
            page: 1
        });
    }

    Lampa.Component.add('vet_iptv', {
        name: 'VET IPTV',

        render: function () {
            this.html = $('<div class="content"><div class="items"></div></div>');
            this.start();
        },

        start: function () {
            this.items = this.html.find('.items');
            this.items.text('Загрузка каналов...');
            loadPlaylist(this.items);
        }
    });

    function loadPlaylist(container) {
        Lampa.Request.get(PLAYLIST_URL, function (text) {
            parseM3U(text, container);
        }, function () {
            container.text('Ошибка загрузки плейлиста');
        });
    }

    function parseM3U(text, container) {
        var lines = text.split('\n');
        var html = '';
        var name = '';
        var url = '';

        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf('#EXTINF') === 0) {
                var parts = lines[i].split(',');
                name = parts.length > 1 ? parts[1].trim() : 'Канал';
            } else if (lines[i].indexOf('http') === 0) {
                url = lines[i].trim();

                html +=
                    '<div class="item selector" data-url="' + url + '">' +
                        '<div class="title">' + name + '</div>' +
                    '</div>';
            }
        }

        container.html(html);

        container.find('.item').on('click', function () {
            play($(this).data('url'));
        });
    }

    function play(url) {
        Lampa.Player.play({
            title: 'IPTV',
            url: url
        });
    }

    Lampa.Plugins.on('ready', startPlugin);

    return {
        name: 'Vet IPTV',
        version: '1.1',
        author: 'VetahaV'
    };

})();
