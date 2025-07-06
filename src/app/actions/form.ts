'use server';

export async function submitForm(data: any, token: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/inbox/submit/${token}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.API_KEY!,
      },
      body: JSON.stringify({data: data})
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('Form submission failed:', json);

      return { success: false, error: 'Form submission failed', response: json };
    }

    return { success: true, response: json };
  } catch (err) {
    console.error('Form submit error', err);

    return { 
      success: false, 
      error: 'Unexpected server error',
    };
  }
}
