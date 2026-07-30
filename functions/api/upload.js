export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ success: false, error: 'File video tidak ditemukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // API Key Pixeldrain milikmu yang aman di sisi server
    const apiKey = '54e8830d-8b00-4544-9156-485a97354373';
    const credentials = btoa('api:' + apiKey);
    const fileName = file.name || 'video.mp4';

    // Pixeldrain menggunakan metode PUT dengan format kirim binary data
    const response = await fetch(`https://pixeldrain.com/api/file/${encodeURIComponent(fileName)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${credentials}`
      },
      body: file.stream()
    });

    const data = await response.json();

    if (data.success) {
      return new Response(JSON.stringify({ success: true, filecode: data.id }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: data.value || 'Gagal upload ke Pixeldrain' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
