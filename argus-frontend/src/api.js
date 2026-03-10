import API_BASE from "./config";

export async function analyzeWallet(wallet) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wallet }), // must match backend
  });

  if (!response.ok) {
    throw new Error("Wallet analysis failed");
  }

  return response.json();
}
