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

    // API Key Pixeldrain milikmu
    const apiKey = '54e8830d-8b00-4544-9156-485a97354373';
    const credentials = btoa('api:' + apiKey);

    // KUNCI PERBAIKAN: Gunakan FormData dan method POST (Sama seperti sistem Doodstream yang sukses sebelumnya)
    const pdForm = new FormData();
    pdForm.append('file', file);

    const response = await fetch('https://pixeldrain.com/api/file', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`
      },
      body: pdForm
    });

    // Baca respons mentah agar Cloudflare tidak bingung jika Pixeldrain membalas string kosong
    const resultText = await response.text();
    let data;
    
    try {
      data = JSON.parse(resultText);
    } catch(e) {
      return new Response(JSON.stringify({ success: false, error: 'Server Pixeldrain error: ' + resultText.substring(0, 50) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (data.success) {
      return new Response(JSON.stringify({ success: true, filecode: data.id }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: data.value || data.message || 'Gagal dari Pixeldrain' }), {
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
