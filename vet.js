(function () {
    'use strict';

    const PLUGIN_NAME = 'vet';
    const PLAYLIST_URL = 
  'https://cors.isomorphic-git.org/http://ТВОЙ_ПЛЕЙЛИСТ.m3u';

    const EPG_URL = 'http://epg.ru-tv.site/14.xml';

    let channels = [];
    let groups = {};

    function log(msg) {
        console.log('[IPTV]', msg);
    }

    function parseM3U(data) {
        const lines = data.split('\n');
        let current = null;
        channels = [];
        groups = {};

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('#EXTINF')) {
                const name = line.split(',').pop();

                const logo = /tvg-logo="([^"]+)"/.exec(line);
                const group = /group-title="([^"]+)"/.exec(line);

                current = {
                    name: name,
                    logo: logo ? logo[1] : '',
                    group: group ? group[1] : 'Без группы',
                    url: ''
                };
            } else if (line && !line.startsWith('#') && current) {
                current.url = line;
                channels.push(current);

                if (!groups[current.group]) groups[current.group] = [];
                groups[current.group].push(current);

                current = null;
            }
        });
    }

    function loadPlaylist(callback) {
        fetch(PLAYLIST_URL)
            .then(r => r.text())
            .then(text => {
                parseM3U(text);
                callback();
            })
            .catch(e => {
                log('Ошибка загрузки плейлиста');
                console.error(e);
            });
    }

    function openChannel(channel) {
        Lampa.Player.play({
            title: channel.name,
            url: channel.url,
            poster: channel.logo,
            timeline: true,
            epg: {
                url: EPG_URL
            }
        });
    }

    function buildGroups() {
        return Object.keys(groups).map(name => ({
            title: name,
            channels: groups[name]
        }));
    }

    Lampa.Component.add('iptv', {
        create: function () {
            const scroll = new Lampa.Scroll({
                mask: true
            });

            loadPlaylist(() => {
                const list = buildGroups();

                list.forEach(group => {
                    scroll.append($('<div class="iptv-group">' + group.title + '</div>'));

                    group.channels.forEach(ch => {
                        const item = $(`
                            <div class="iptv-channel selector">
                                <img src="${ch.logo}" />
                                <span>${ch.name}</span>
                            </div>
                        `);

                        item.on('click', () => openChannel(ch));
                        scroll.append(item);
                    });
                });

                scroll.render();
            });

            return scroll.render();
        }
    });

    function addMenu() {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                Lampa.Activity.push({
                    title: PLUGIN_NAME,
                    component: 'iptv',
                    page: 1
                });
            }
        });
    }

    addMenu();

})();


