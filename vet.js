(function () {
    'use strict';

    if (!window.Lampa || !Lampa.Extension) return;

    const PLAYLIST_URL = 'https://falling-recipe-749e.vetahav83.workers.dev/';
    const EPG_URL = 'http://epg.ru-tv.site/14.xml';

    let groups = {};

    function parseM3U(text) {
        let lines = text.split('\n');
        let ch = null;
        groups = {};

        lines.forEach(line => {
            line = line.trim();

            if (line.startsWith('#EXTINF')) {
                ch = {
                    name: line.split(',').pop(),
                    logo: (/tvg-logo="([^"]+)"/.exec(line) || [])[1] || '',
                    group: (/group-title="([^"]+)"/.exec(line) || [])[1] || 'Без группы',
                    url: ''
                };
            }
            else if (line && !line.startsWith('#') && ch) {
                ch.url = line;
                (groups[ch.group] = groups[ch.group] || []).push(ch);
                ch = null;
            }
        });
    }

    function openIPTV() {
        let html = $('<div class="iptv"></div>');

        Lampa.Utils.request({
            url: PLAYLIST_URL,
            success: function (data) {
                parseM3U(data);

                Object.keys(groups).forEach(group => {
                    html.append('<div class="iptv-group">' + group + '</div>');

                    groups[group].forEach(ch => {
                        let item = $(`
                            <div class="iptv-item selector">
                                ${ch.logo ? `<img src="${ch.logo}">` : ''}
                                <span>${ch.name}</span>
                            </div>
                        `);

                        item.on('click', () => {
                            Lampa.Player.play({
                                title: ch.name,
                                url: ch.url,
                                poster: ch.logo,
                                epg: { url: EPG_URL }
                            });
                        });

                        html.append(item);
                    });
                });
            },
            error: function () {
                Lampa.Noty.show('Ошибка загрузки IPTV');
            }
        });

        Lampa.Activity.push({
            title: 'IPTV',
            component: 'content',
            page: 1,
            html: html
        });
    }

    Lampa.Extension.add({
        name: 'IPTV',
        description: 'IPTV плейлист',
        version: '1.0',
        onClick: openIPTV
    });

})();
