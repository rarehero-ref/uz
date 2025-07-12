// script.js

const apiKey = "bf624499-2ae8-4a99-a716-040a68fbc6bf";
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const resultDiv = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");

const popularCurrencies = [
  "BTC", "ETH", "TON", "USDT", "BNB",
  "USD", "UZS", "EUR", "RUB"
];

async function loadCurrencies() {
  const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";
  const res = await fetch(url, {
    headers: { "X-CMC_PRO_API_KEY": apiKey }
  });
  const data = await res.json();

  const currencyCodes = data.data
    .filter(item => popularCurrencies.includes(item.symbol))
    .map(item => item.symbol);

  for (const code of currencyCodes) {
    const option1 = document.createElement("option");
    option1.value = code;
    option1.textContent = code;
    fromCurrency.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = code;
    option2.textContent = code;
    toCurrency.appendChild(option2);
  }

  fromCurrency.value = "TON";
  toCurrency.value = "UZS";
}

async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || amount <= 0) {
    resultDiv.textContent = "Iltimos, to‘g‘ri miqdor kiriting.";
    return;
  }

  resultDiv.textContent = "Hisoblanmoqda...";

  try {
    const url = `https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=${amount}&symbol=${from}&convert=${to}`;
    const res = await fetch(url, {
      headers: { "X-CMC_PRO_API_KEY": apiKey }
    });
    const data = await res.json();

    const price = data.data.quote[to].price;
    resultDiv.textContent = `${amount} ${from} = ${price.toFixed(2)} ${to}`;
  } catch (err) {
    resultDiv.textContent = "Xatolik yuz berdi. Keyinroq urinib ko‘ring.";
    console.error(err);
  }
}

convertBtn.addEventListener("click", convertCurrency);

window.addEventListener("load", loadCurrencies);
