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

    // Kirim file ke Uguu.se
    const uguuForm = new FormData();
    uguuForm.append('files[]', file);

    const response = await fetch('https://uguu.se/upload', {
      method: 'POST',
      body: uguuForm
    });

    const resultText = await response.text();
    let data;
    
    try {
      data = JSON.parse(resultText);
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: 'Gagal memproses server: ' + resultText.substring(0, 40) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Uguu.se mengembalikan struktur JSON dengan array files
    if (data.success && data.files && data.files.length > 0) {
      const fileUrl = data.files[0].url; // Contoh: https://uguu.se/abc123XYZ.mp4
      const fileCode = fileUrl.split('/').pop(); // Mengambil nama file akhirnya saja (abc123XYZ.mp4)
      
      return new Response(JSON.stringify({ success: true, filecode: fileCode }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Gagal mengunggah file ke Uguu' }), {
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
