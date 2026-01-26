(function () {
    'use strict';

    if (!window.Lampa || !Lampa.Source) return;

    const SOURCE_ID = 'iptv_source';
    const SOURCE_NAME = 'IPTV';
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

    Lampa.Source.add({
        id: SOURCE_ID,
        title: SOURCE_NAME,
        search: function (query, page, success, error) {
            Lampa.Utils.request({
                url: PLAYLIST_URL,
                success: function (data) {
                    parseM3U(data);

                    let items = [];
                    Object.keys(groups).forEach(g => {
                        groups[g].forEach(ch => {
                            items.push({
                                title: ch.name,
                                poster: ch.logo,
                                url: ch.url,
                                group: g,
                                epg: EPG_URL
                            });
                        });
                    });

                    success(items, false);
                },
                error: error
            });
        },
        play: function (item) {
            Lampa.Player.play({
                title: item.title,
                url: item.url,
                poster: item.poster,
                epg: { url: EPG_URL }
            });
        }
    });

})();
