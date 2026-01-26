export default function plugin() {
  return {
    name: 'test-plugin',
    version: '1.0',
    icon: '',
    description: 'Тестовый плагин',

    async getList() {
      return [
        { name: 'Test Channel', url: 'http://example.com/stream.m3u8' }
      ];
    },

    play(channel) {
      return {
        url: channel.url,
        title: channel.name,
      };
    }
  };
}
