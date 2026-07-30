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

    // Menggunakan endpoint langsung Gofile
    const gofileForm = new FormData();
    gofileForm.append('file', file);

    const uploadRes = await fetch('https://upload.gofile.io/uploadfile', {
      method: 'POST',
      body: gofileForm
    });

    const resultText = await uploadRes.text();
    let data;
    try {
      data = JSON.parse(resultText);
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: 'Gagal merespons server Gofile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (data.status === 'ok' && data.data && data.data.code) {
      const fileCode = data.data.code; // Mengambil ID unik file dari Gofile
      return new Response(JSON.stringify({ success: true, filecode: fileCode }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: data.status || 'Gagal mengunggah ke Gofile' }), {
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
