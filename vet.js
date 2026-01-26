export default function plugin() {
  return {
    name: 'example-plugin',
    version: '1.0',
    icon: '',
    description: 'Пример плагина для Lampa',

    async getList() {
      // Возвращаем пустой список каналов для проверки
      return [];
    },

    play(channel) {
      return {
        url: channel.url,
        title: channel.name,
      };
    }
  };
}
