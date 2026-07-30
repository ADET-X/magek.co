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

    const gofileForm = new FormData();
    gofileForm.append('file', file);
    gofileForm.append('token', gofileToken);

    const uploadRes = await fetch('https://upload.gofile.io/uploadfile', {
      method: 'POST',
      body: gofileForm
    });

    const resultText = await uploadRes.text();
    
    let data;
    try {
      data = JSON.parse(resultText);
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: 'Respon server bukan JSON: ' + resultText.substring(0, 80) }), {
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
