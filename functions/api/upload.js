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

    // Token akun Gofile kamu
    const gofileToken = 'dMwihfjFH7HvzJIxUn0wJ2xmyjCuOndM';

    // 1. Dapatkan server upload terbaik dari Gofile secara otomatis
    let uploadUrl = 'https://upload.gofile.io/uploadfile';
    try {
      const serverRes = await fetch('https://api.gofile.io/servers', {
        headers: {
          'Authorization': `Bearer ${gofileToken}`
        }
      });
      const serverData = await serverRes.json();
      if (serverData.status === 'ok' && serverData.data && serverData.data.servers && serverData.data.servers.length > 0) {
        const serverName = serverData.data.servers[0].name;
        uploadUrl = `https://${serverName}.gofile.io/contents/uploadfile`;
      }
    } catch (e) {
      // Jika gagal mendeteksi server, gunakan endpoint global default
    }

    // 2. Siapkan file untuk diunggah
    const gofileForm = new FormData();
    gofileForm.append('file', file);

    // 3. Kirim ke Gofile dengan Autentikasi Header (Standar API Terbaru)
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${gofileToken}`
      },
      body: gofileForm
    });

    const resultText = await uploadRes.text();
    let data;
    try {
      data = JSON.parse(resultText);
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: 'Respon server tidak valid: ' + resultText.substring(0, 50) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (data.status === 'ok' && data.data && data.data.code) {
      return new Response(JSON.stringify({ success: true, filecode: data.data.code }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Gofile menolak: ' + (data.status || JSON.stringify(data)) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'Sistem Error: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
