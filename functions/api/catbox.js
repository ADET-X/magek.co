export async function onRequestPost(context) {
  try {
    // Teruskan paket mentah (streaming) langsung ke Catbox
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      headers: {
        // Ambil header asli dari browser (terutama tipe form-data)
        'Content-Type': context.request.headers.get('Content-Type')
      },
      // Lempar body mentah-mentah ke Catbox
      body: context.request.body,
      duplex: 'half'
    });

    const resultText = await response.text();

    // Kembalikan jawaban dari Catbox ke browser pengunjung
    return new Response(resultText, {
      status: response.status,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*' // Buka blokir CORS untuk websitemu
      }
    });

  } catch (err) {
    return new Response('Proxy Error: ' + err.message, { status: 500 });
  }
}
