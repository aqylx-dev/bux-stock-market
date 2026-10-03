let cash = 10000;

let interestRate = 4;

let selectedRange = 30;

let newsText = "The market is open.";

let stocks = [
  {
    name: "JuiceCo",
    price: 50,
    shares: 0,
    prices: [50]
  },

  {
    name: "Byte Industries",
    price: 100,
    shares: 0,
    prices: [100]
  },

  {
    name: "VaultO'Bux Inc.",
    price: 75,
    shares: 0,
    prices: [75]
  }
];


// ========================
// SAVE GAME
// ========================

function saveGame() {

  let game = {
    cash: cash,
    interestRate: interestRate,
    stocks: stocks,
    newsText: newsText
  };

  localStorage.setItem(
    "buxStockMarket",
    JSON.stringify(game)
  );
}


// ========================
// LOAD GAME
// ========================

function loadGame() {

  let saved =
    localStorage.getItem("buxStockMarket");

  if (!saved) return;

  let game = JSON.parse(saved);

  cash = game.cash;
  interestRate = game.interestRate;
  stocks = game.stocks;
  newsText = game.newsText || "The market is open.";
}


// ========================
// RANDOM NEWS
// ========================

let news = [

  {
    text: "JuiceCo released a suspiciously delicious new drink.",
    stock: 0,
    effect: 0.15
  },

  {
    text: "Byte Industries lost several mobile-data customers.",
    stock: 1,
    effect: -0.12
  },

  {
    text: "VaultO'Bux announced a new banking service.",
    stock: 2,
    effect: 0.10
  },

  {
    text: "A mysterious investor bought a huge amount of JuiceCo.",
    stock: 0,
    effect: 0.20
  },

  {
    text: "Byte Industries' servers experienced problems.",
    stock: 1,
    effect: -0.18
  },

  {
    text: "VaultO'Bux reported record profits.",
    stock: 2,
    effect: 0.17
  },

  {
    text: "Investors are nervous for absolutely no reason.",
    stock: -1,
    effect: -0.05
  },

  {
    text: "The market is having a completely normal day.",
    stock: -1,
    effect: 0
  },
  
  {
  text: "JuiceCo released ICED JUICES AND CUSTOMERS LOVED IT!!!",
  stock: 0,
  effect: 0.12
  },

  {
  text: "Byte Industries introduced more 5G data.",
  stock: 1,
  effect: 0.08
  },

  {
  text: "JuiceCo ran out of oranges. oh crap.",
  stock: 0,
  effect: -0.14
  },

  {
  text: "JuiceCo released... Fruity Tea?!?!?! WHAT?!?!",
  stock: 0,
  effect: 0.10
  },

  {
  text: 'Byte Industries says: "10 GB mobile data!!1!1!1!"',
  stock: 1,
  effect: 0.15
  },
  
  {
  text: "holy crap JuiceCo skyrocketed",
  stock: 0,
  effect: 0.25
  },

  {
  text: "VaultO'Bux did... nothing.",
  stock: 2,
  effect: 0
  },

  {
  text: "Byte Industries are selling... rams??",
  stock: 1,
  effect: 0.13
  },

  {
  text: "Byte Industries are... selling bytes. as usual",
  stock: 1,
  effect: 0.03
  },

  {
  text: "g",
  stock: -1,
  effect: -0.25
  },

  {
  text: "Byte Industries did... nothing.",
  stock: -1,
  effect: 0
  },

  {
  text: "stocks are skyrocketing vro",
  stock: -1,
  effect: 0
  },
  
];


function generateNews() {

  let event =
    news[Math.floor(Math.random() * news.length)];

  newsText = event.text;

  if (event.stock >= 0) {

    stocks[event.stock].price *=
      1 + event.effect;

  }

  renderNews();
}


// ========================
// CHART RANGE
// ========================

function setRange(days) {

  selectedRange = days;

  renderStocks();

}


// ========================
// RENDER STOCKS
// ========================

function renderStocks() {

  let container =
    document.getElementById("stocks");

  container.innerHTML = "";

  stocks.forEach((stock, index) => {

    container.innerHTML += `

      <div class="stock-card">

        <h2>${stock.name}</h2>

        <div class="price">
          βx ${stock.price.toFixed(2)}
        </div>

        <div class="change">
          ${getChange(stock)}
        </div>

        <canvas id="chart-${index}"></canvas>

        <div class="chart-buttons">

          <button onclick="setRange(1)">
            1D
          </button>

          <button onclick="setRange(7)">
            1W
          </button>

          <button onclick="setRange(30)">
            1M
          </button>

        </div>

        <button onclick="buy(${index})">
          BUY
        </button>

        <button onclick="sell(${index})">
          SELL
        </button>

        <p>
          You own:
          <b>${stock.shares}</b>
          shares
        </p>

      </div>

    `;

  });


  stocks.forEach((stock, index) => {

    drawChart(stock, index);

  });


  updateBalance();
}


// ========================
// CHART
// ========================

function drawChart(stock, index) {

  let canvas =
    document.getElementById("chart-" + index);

  let ctx =
    canvas.getContext("2d");

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  let data =
    stock.prices.slice(-selectedRange);


  if (data.length < 2) return;


  let min = Math.min(...data);
  let max = Math.max(...data);


  if (min === max) {

    min -= 1;
    max += 1;

  }


  for (let i = 1; i < data.length; i++) {

    let x1 =
      ((i - 1) / (data.length - 1))
      * canvas.width;

    let y1 =
      canvas.height -
      ((data[i - 1] - min) /
      (max - min)) *
      canvas.height;


    let x2 =
      (i / (data.length - 1))
      * canvas.width;

    let y2 =
      canvas.height -
      ((data[i] - min) /
      (max - min)) *
      canvas.height;


    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);


    if (data[i] >= data[i - 1]) {

      ctx.strokeStyle = "#00ff66";

    } else {

      ctx.strokeStyle = "#ff3b3b";

    }


    ctx.lineWidth = 3;

    ctx.stroke();

  }

}


// ========================
// BUY
// ========================

function buy(index) {

  let stock = stocks[index];

  if (cash >= stock.price) {

    cash -= stock.price;

    stock.shares++;

    saveGame();

    renderStocks();

  } else {

    alert("Not enough βx!");

  }

}


// ========================
// SELL
// ========================

function sell(index) {

  let stock = stocks[index];

  if (stock.shares > 0) {

    cash += stock.price;

    stock.shares--;

    saveGame();

    renderStocks();

  } else {

    alert("You don't own this stock!");

  }

}


// ========================
// NEXT MARKET DAY
// ========================

function nextDay() {

  stocks.forEach(stock => {

    let change =
      (Math.random() * 20 - 10) / 100;

    stock.price *=
      1 + change;


    if (stock.price < 1) {

      stock.price = 1;

    }


    stock.prices.push(stock.price);

  });


  // Random news

  generateNews();


  // Interest rate changes occasionally

  if (Math.random() < 0.15) {

    let change =
      (Math.random() * 2 - 1);

    interestRate += change;

    interestRate =
      Math.max(
        0,
        Math.min(15, interestRate)
      );

  }


  // Pay interest on cash

  cash *=
    1 + (interestRate / 100 / 365);


  saveGame();

  renderStocks();

  updateInterest();

}


// ========================
// PORTFOLIO
// ========================

function updateBalance() {

  let portfolio = 0;


  stocks.forEach(stock => {

    portfolio +=
      stock.price *
      stock.shares;

  });


  let total =
    cash + portfolio;


  document.getElementById("cash")
    .textContent =
    cash.toFixed(2);


  document.getElementById("portfolio")
    .textContent =
    portfolio.toFixed(2);


  document.getElementById("total")
    .textContent =
    total.toFixed(2);

}


// ========================
// INTEREST RATE
// ========================

function updateInterest() {

  document.getElementById("interest")
    .textContent =
    interestRate.toFixed(2);

}


// ========================
// NEWS DISPLAY
// ========================

function renderNews() {

  document.getElementById("news")
    .innerHTML = `

      <div class="news">

        📰 <b>MARKET NEWS</b>

        <p>${newsText}</p>

      </div>

    `;

}


// ========================
// PRICE CHANGE
// ========================

function getChange(stock) {

  if (stock.prices.length < 2) {

    return "+0.00%";

  }


  let oldPrice =
    stock.prices[0];

  let change =
    ((stock.price - oldPrice) /
    oldPrice) * 100;


  return (
    change >= 0 ? "+" : ""
  ) +
  change.toFixed(2) +
  "%";

}

 let resetCooldown = false;

function resetProgress() {

  if (resetCooldown) {
    alert("The gamble legally button is on cooldown!");
    return;
  }

  if (!confirm(
    "dont do it vro\n\n" +
    "This will reset all yo progress\n\n" +
    "You will lose your cash, stocks, and history."
  )) {
    return;
  }
  
  if (!confirm(
    "i beg you vro 😭\n\n" +
    "are you ABSOLUTELY sure vro\n\n" +
    "You have a 12.5% chance of getting +0.05% VaultO'Bux interest.\n\n" +
    "THIS ACTION CANNOT BE UNDONE"
  )) {
    return;
  }

  if (!confirm(
    "LAST WARNING vro\n\n" +
    "DUDE JUST DONT DO IT VRO😢\n\n" +
    "Press OK to GAMBLE!!! legally."
  )) {
    return;
  }

  resetCooldown = true;

  // 12.5% chance
  if (Math.random() < 0.125) {
    interestRate += 0.05;
    alert( "hol up wait, i just hit the jack pot!!!!! \nVaultO'Bux interest increased by 0.05%!");
  } else {
    alert("you got nothing vro, keep gambling!!");
  }

  // Reset everything except the interest-rate bonus
  cash = 10000;

  stocks = [
    {
      name: "JuiceCo",
      price: 50,
      shares: 0,
      prices: [50]
    },
    {
      name: "Byte Industries",
      price: 100,
      shares: 0,
      prices: [100]
    },
    {
      name: "VaultO'Bux Inc.",
      price: 75,
      shares: 0,
      prices: [75]
    }
  ];

  newsText = "The market is open.";

  saveGame();
  renderStocks();
  renderNews();
  updateInterest();

  setTimeout(() => {
    resetCooldown = false;
  }, 30000);
}

// ========================
// START GAME
// ========================

loadGame();

renderStocks();

renderNews();

updateInterest();