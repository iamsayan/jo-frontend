"use server";

export async function submitModel(model: string, data: any, documentId: string | null = null) {
  if (!process.env.API_URL || !process.env.API_KEY) {
    console.error("Missing API_URL or API_KEY environment variable");
    return { success: false, error: "Server configuration error" };
  }

  const url = documentId ? `${process.env.API_URL}/${model}/${documentId}` : `${process.env.API_URL}/${model}`;

  try {
    const response = await fetch(url, {
      method: documentId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({ data }),
    });

    let json;
    try {
      json = await response.json();
    } catch (jsonErr) {
      console.error("Failed to parse JSON response:", jsonErr);
      return { success: false, error: "Invalid server response" };
    }

    if (!response.ok) {
      console.error("Model submission failed:", json);
      return {
        success: false,
        error: "Model submission failed",
        response: json,
      };
    }

    return { success: true, response: json };
  } catch (err) {
    console.error("Model submit error", err);
    return {
      success: false,
      error: "Unexpected server error",
    };
  }
}
