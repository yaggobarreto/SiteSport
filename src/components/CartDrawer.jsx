const handleCheckout = async () => {
  const itemsFormatted = items.map((item) => ({
    description: `${item.name} (Tam: ${item.size})`,
    quantity: item.quantity,
    price: Math.round(item.price * 100) // 👈 CONVERTE PRA CENTAVOS
  }));

  try {
    const response = await fetch("https://api.checkout.infinitepay.io/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        handle: "fabyo-65685396-6f9",
        items: itemsFormatted
      })
    });

    const data = await response.json();

    if (!data.url) {
      console.error(data);
      alert("Erro ao gerar pagamento");
      return;
    }

    // 🚀 REDIRECIONA PRO PAGAMENTO
    window.location.href = data.url;

  } catch (err) {
    console.error(err);
    alert("Erro ao processar pagamento");
  }
};