export default function plugin() {
  return {
    name: 'iptv-proxy-lampa',
    version: '1.0',
    icon: '', // Можно добавить URL иконки
    description: 'Плагин Lampa для просмотра IPTV через Cloudflare Worker прокси',

    async getList() {
      const playlistUrl = 'https://falling-recipe-749e.vetahav83.workers.dev/';

      try {
        const response = await fetch(playlistUrl);
        const text = await response.text();

        return parseM3U(text);
      } catch (e) {
        console.error('Ошибка загрузки плейлиста:', e);
        return [];
      }
    },

    play(channel) {
      return {
        url: channel.url,
        title: channel.name,
      };
    }
  };
}

// Функция для парсинга M3U плейлиста в массив каналов
function parseM3U(data) {
  const lines = data.split('\n');
  const channels = [];
  let currentChannel = {};

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#EXTINF')) {
      const nameMatch = line.match(/,(.*)$/);
      currentChannel = {
        name: nameMatch ? nameMatch[1] : 'Unknown',
        url: ''
      };
    } else if (line && !line.startsWith('#')) {
      currentChannel.url = line;
      channels.push(currentChannel);
      currentChannel = {};
    }
  }

  return channels;
}
