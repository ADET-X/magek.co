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

    // API Key Doodstream milikmu yang aman di sisi server
    const apiKey = '156828yoh1omg61gsw0tgo';

    // 1. Minta URL server upload dari Doodstream
    const serverRes = await fetch(`https://doodapi.co/api/upload/server?key=${apiKey}`);
    const serverData = await serverRes.json();

    if (serverData.msg !== "OK") {
      return new Response(JSON.stringify({ success: false, error: 'Gagal mendapat server Doodstream' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const uploadUrl = serverData.result;

    // 2. Teruskan file video ke server Doodstream
    const doodForm = new FormData();
    doodForm.append('api_key', apiKey);
    doodForm.append('file', file);

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      body: doodForm
    });

    const uploadData = await uploadRes.json();

    if (uploadData.msg === "OK") {
      const fileCode = uploadData.result[0].filecode;
      return new Response(JSON.stringify({ success: true, filecode: fileCode }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Gagal upload ke Doodstream' }), {
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

