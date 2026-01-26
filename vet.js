export default {
  async fetch(request) {
    const url = 'https://falling-recipe-749e.vetahav83.workers.dev/';

    const response = await fetch(url);
    const text = await response.text();

    return new Response(text, {
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
