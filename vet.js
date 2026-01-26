(function () {
    'use strict';

    if (!window.Lampa) return;

    const PLUGIN = 'IPTV';
    const PLAYLIST_URL = 'https://falling-recipe-749e.vetahav83.workers.dev/';
    const EPG_URL = 'http://epg.ru-tv.site/14.xml';

    let groups = {};

    function parseM3U(text) {
        let lines = text.split('\n');
        let ch = null;
        groups = {};

        lines.forEach(line => {
            line = line.trim();

            if (line.indexOf('#EXTINF') === 0) {
                let name = line.split(',').pop();
                let logo = /tvg-logo="([^"]+)"/.exec(line);
                let group = /group-title="([^"]+)"/.exec(line);

                ch = {
                    name: name,
                    logo: logo ? logo[1] : '',
                    group: group ? group[1] : 'Без группы',
                    url: ''
                };
            }
            else if (line && line[0] !== '#' && ch) {
                ch.url = line;

                if (!groups[ch.group]) groups[ch.group] = [];
                groups[ch.group].push(ch);

                ch = null;
            }
        });
    }

    function loadPlaylist(done) {
        Lampa.Utils.request({
            url: PLAYLIST_URL,
            success: function (data) {
                parseM3U(data);
                done();
            },
            error: function () {
                Lampa.Noty.show('Ошибка загрузки IPTV плейлиста');
            }
        });
    }

    function play(ch) {
        Lampa.Player.play({
            title: ch.name,
            url: ch.url,
            poster: ch.logo,
            epg: {
                url: EPG_URL
            }
        });
    }

    Lampa.Component.add('iptv', {
        create: function () {
            let html = $('<div class="iptv"></div>');

            loadPlaylist(function () {
                Object.keys(groups).forEach(group => {
                    html.append('<div class="iptv-group">' + group + '</div>');

                    groups[group].forEach(ch => {
                        let item = $(`
                            <div class="iptv-item selector">
                                ${ch.logo ? `<img src="${ch.logo}">` : ''}
                                <span>${ch.name}</span>
                            </div>
                        `);

                        item.on('click', () => play(ch));
                        html.append(item);
                    });
                });
            });

            return html;
        }
    });

    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            Lampa.Activity.push({
                title: PLUGIN,
                component: 'iptv',
                page: 1
            });
        }
    });

})();
