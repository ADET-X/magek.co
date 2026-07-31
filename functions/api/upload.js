export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const file = formData.get('fileInput');

    if (!file) {
      return new Response(JSON.stringify({ error: 'File tidak ditemukan' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const DOOD_API_KEY = '156828yoh1omg61gsw0tgo';

    // 1. Ambil server upload aktif dari Doodstream
    const reqServer = await fetch(`https://doodapi.com/api/upload/server?key=${DOOD_API_KEY}`);
    const serverJson = await reqServer.json();
    
    if (serverJson.status !== 200 || !serverJson.result) {
      return new Response(JSON.stringify({ error: 'Gagal mendapat server Doodstream' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Sesuai dokumentasi: URL target ditambah parameter key
    const uploadUrl = `${serverJson.result}?${DOOD_API_KEY}`;

    // 2. Kirim file dengan parameter 'file' dan 'api_key' sesuai standar Doodstream
    const doodForm = new FormData();
    doodForm.append('api_key', DOOD_API_KEY);
    doodForm.append('file', file);

    const uploadReq = await fetch(uploadUrl, {
      method: 'POST',
      body: doodForm
    });

    const resultText = await uploadReq.text();

    return new Response(resultText, {
      status: uploadReq.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
