const amountEl = document.getElementById('amount');
const fromEl   = document.getElementById('from');
const toEl     = document.getElementById('to');
const resultEl = document.getElementById('result');
const convertBtn = document.getElementById('convert');

let rates = {};

async function loadRates() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();

    if (data.result !== "success") {
      throw new Error("API error");
    }

    rates = data.rates;
    populateSelects(Object.keys(rates));
  } catch (error) {
    console.error("Error fetching rates:", error);
    resultEl.textContent = "Failed to load exchange rates.";
  }
}

function populateSelects(currencyCodes) {
  currencyCodes.sort();
  for (let code of currencyCodes) {
    fromEl.add(new Option(code, code));
    toEl.add(new Option(code, code));
  }
  fromEl.value = 'USD';
  toEl.value = 'INR';
}

function convert() {
  const amount = parseFloat(amountEl.value);
  const from = fromEl.value;
  const to = toEl.value;

  if (!amount || !rates[from] || !rates[to]) {
    resultEl.textContent = 'Invalid input.';
    return;
  }

  const usdAmount = amount / rates[from];
  const converted = usdAmount * rates[to];

  resultEl.textContent = `${amount.toFixed(2)} ${from} = ${converted.toFixed(2)} ${to}`;
}

convertBtn.addEventListener('click', convert);
loadRates();
