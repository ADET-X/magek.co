export async function onRequestPost(context) {
  try {
    // 1. Terima dan bongkar file dari browser secara normal
    const formData = await context.request.formData();
    const file = formData.get('fileToUpload');
    const userhash = formData.get('userhash');
    const reqtype = formData.get('reqtype');

    if (!file) {
      return new Response('File tidak ditemukan', { status: 400 });
    }

    // 2. Susun ulang paket khusus untuk Catbox
    const catboxForm = new FormData();
    catboxForm.append('reqtype', reqtype || 'fileupload');
    if (userhash) catboxForm.append('userhash', userhash);
    catboxForm.append('fileToUpload', file);

    // 3. Kirim ke Catbox secara aman
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: catboxForm
    });

    const resultText = await response.text();

    // 4. Kembalikan jawaban ke browser pengunjung
    return new Response(resultText, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain'
      }
    });

  } catch (err) {
    return new Response('Proxy Error: ' + err.message, { status: 500 });
  }
}
