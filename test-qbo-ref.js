async function test() {
  const payload = {
    amount: 1000,
    items: [
      {
        id: "test-ref-eq",
        name: "Test Refrigeration Equipment with a very long name that might cause issues maybe? Let's add some special chars & * % $ @ !",
        price: 1000,
        quantity: 1,
        category: "refrigeration-equipment",
        sku: "LONG-SKU-123456789012345678901234567890"
      }
    ],
    email: "test@example.com",
    fullName: "Test User",
    phone: "1234567890",
    address: "123 Test St, Test City, TS 12345"
  };

  console.log("Sending checkout request...");
  const res = await fetch('http://localhost:3000/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log("Response:", data);
}

test();
