(function () {

    function startPlugin() {
        console.log('VET plugin started');

        Lampa.Activity.push({
            url: '',
            title: 'VET TV',
            component: 'vet_tv',
            page: 1
        });
    }

    Lampa.Component.add('vet_tv', {
        name: 'VET TV',
        render: function () {
            var html = '<div class="content">' +
                '<h2>Каналы</h2>' +
                '<div id="vet_list">Загрузка...</div>' +
            '</div>';

            this.html = $(html);
            this.start();
        },

        start: function () {
            loadPlaylist();
        }
    });

    function loadPlaylist() {
        var url = 'https://example.com/playlist.m3u';

        Lampa.Request.get(url, function (data) {
            parseM3U(data);
        }, function () {
            $('#vet_list').text('Ошибка загрузки плейлиста');
        });
    }

    function parseM3U(text) {
        var lines = text.split('\n');
        var html = '';

        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf('#EXTINF') === 0) {
                var name = lines[i].split(',')[1];
                var stream = lines[i + 1];

                html += '<div class="channel">' + name + '</div>';
            }
        }

        $('#vet_list').html(html);
    }

    Lampa.Plugins.on('ready', startPlugin);

    return {
        name: 'Vet IPTV',
        version: '1.0',
        author: 'VetahaV'
    };

})();
