export default function plugin() {
  return {
    name: 'ru-tv-ipltv',
    version: '1.0',
    icon: 'https://pl.ru-tv.site/favicon.ico', // иконка плагина
    description: 'Плагин для просмотра IPTV плейлиста ru-tv.site',

    // Метод для получения списка каналов
    async getList() {
      const playlistUrl = 'http://pl.ru-tv.site/bcc73d92/33fcd1b1/tv.m3u';

      try {
        const response = await fetch(playlistUrl);
        const text = await response.text();

        // Парсим M3U плейлист
        const channels = parseM3U(text);

        return channels;
      } catch (e) {
        console.error('Ошибка загрузки плейлиста:', e);
        return [];
      }
    },

    // Метод для запуска воспроизведения
    play(channel) {
      return {
        url: channel.url,
        title: channel.name,
        // Дополнительные параметры, если нужны
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
      // Получаем название канала
      const nameMatch = line.match(/,(.*)$/);
      currentChannel = {
        name: nameMatch ? nameMatch[1] : 'Unknown',
        url: ''
      };
    } else if (line && !line.startsWith('#')) {
      // URL канала
      currentChannel.url = line;
      channels.push(currentChannel);
      currentChannel = {};
    }
  }

  return channels;
}
