import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ওয়েবসাইট থেকে আসা মেসেজটি সার্ভারের ভেতর দিয়ে n8n-এ পাঠানো হচ্ছে (No CORS issue!)
    const n8nResponse = await fetch("http://localhost:5678/webhook/584e5bd8-efd8-428c-ad7a-2f8135859163", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await n8nResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("n8n Connection Error:", error);
    return NextResponse.json(
      { output: "Sorry, the AI Assistant is currently offline. Please try again later." },
      { status: 500 }
    );
  }
}