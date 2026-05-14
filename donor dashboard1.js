let content =
document.getElementById("content");

let balance =
Number(localStorage.getItem("balance")) || 0;

let totalDonations =
Number(localStorage.getItem("totalDonations")) || 0;

let familiesHelped =
Number(localStorage.getItem("familiesHelped")) || 0;

let history =
JSON.parse(localStorage.getItem("history")) || [];

function saveData(){

  localStorage.setItem(
    "balance",
    balance
  );

  localStorage.setItem(
    "totalDonations",
    totalDonations
  );

  localStorage.setItem(
    "familiesHelped",
    familiesHelped
  );

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

}

function showDashboard(){

  let historyHTML = "";

  for(let i = 0; i < history.length; i++){

    historyHTML += `

      <div class="request-card">

        <h3>
          ${history[i].title}
        </h3>

        <p>
          ${history[i].description}
        </p>

      </div>

    `;

  }

  if(history.length === 0){

    historyHTML = `

      <div class="request-card">

        <p>
          No donations yet
        </p>

      </div>

    `;

  }

  content.innerHTML = `

    <h1 class="title">
      Welcome, Donor 🌱
    </h1>

    <p class="subtitle">
      Give what you can, change someone's life
    </p>

    <div class="cards">

      <div class="card">

        <i class="fa-solid fa-wallet"></i>

        <h2>$${balance}</h2>

        <p>Wallet Balance</p>

      </div>

      <div class="card">

        <i class="fa-solid fa-heart"></i>

        <h2>${totalDonations}</h2>

        <p>Total Donations</p>

      </div>

      <div class="card">

        <i class="fa-solid fa-users"></i>

        <h2>${familiesHelped}</h2>

        <p>Families Helped</p>

      </div>

    </div>

    <br><br>

    <div class="requests-box">

      <h2>
        Donation History
      </h2>

      ${historyHTML}

    </div>

  `;

}

function showDonations(){

  content.innerHTML = `

    <div class="requests-box">

      <h1 class="title">
        Donation Requests
      </h1>

      <div class="request-card">

        <h3>
          🍲 Food Donation
        </h3>

        <p>
          Family needs food supplies
        </p>

        <input type="number"
        id="foodAmount"
        placeholder="Number of meals">

        <br><br>

        <button onclick="donateFood()">
          Donate Food
        </button>

      </div>

      <div class="request-card">

        <h3>
          👕 Clothes Donation
        </h3>

        <p>
          Children need winter clothes
        </p>

        <input type="number"
        id="clothesAmount"
        placeholder="Number of clothes">

        <br><br>

        <button onclick="donateClothes()">
          Donate Clothes
        </button>

      </div>

      <div class="request-card">

        <h3>
          💵 Money Donation
        </h3>

        <p>
          Donate from wallet balance
        </p>

        <button onclick="donateMoney()">
          Donate $50
        </button>

      </div>

    </div>

  `;

}

function showProfile(){

  let email =
  localStorage.getItem("userEmail");

  content.innerHTML = `

    <div class="profile-box">

      <h1 class="title">
        My Profile
      </h1>

      <br>

      <p>

        <strong>Email:</strong>

        ${email}

      </p>

      <p>

        <strong>Wallet Balance:</strong>

        $${balance}

      </p>

      <br>

      <h3>
        Add Money To Wallet
      </h3>

      <br>

      <input type="number"
      id="amount"
      placeholder="Enter amount">

      <br>

      <button class="wallet-btn"
      onclick="fawry()">

        Fawry

      </button>

      <button class="wallet-btn"
      onclick="instapay()">

        InstaPay

      </button>

      <button class="wallet-btn"
      onclick="credit()">

        Credit Card

      </button>

    </div>

  `;

}

function showSettings(){

  content.innerHTML = `

    <div class="settings-box">

      <h1 class="title">
        Settings
      </h1>

      <br>

      <label>
        Change Email
      </label>

      <br><br>

      <input type="email"
      placeholder="New Email">

      <br>

      <label>
        Change Password
      </label>

      <br><br>

      <input type="password"
      placeholder="New Password">

      <br>

      <label>
        Payment Method
      </label>

      <br><br>

      <select>

        <option>
          Fawry
        </option>

        <option>
          InstaPay
        </option>

        <option>
          Credit Card
        </option>

      </select>

      <br><br>

      <button class="save-btn"
      onclick="saveSettings()">

        Save Changes

      </button>

    </div>

  `;

}

function donateMoney(){

  if(balance < 50){

    alert("Wallet balance is low");

  }

  else{

    balance -= 50;

    totalDonations++;

    familiesHelped++;

    history.push({

      title : "💵 Money Donation",

      description :
      "You donated $50"

    });

    saveData();

    alert("Money Donation Successful");

    showDashboard();

  }

}

function donateFood(){

  let meals =
  document.getElementById("foodAmount").value;

  if(meals === ""){

    alert("Enter meals number");

  }

  else{

    totalDonations++;

    familiesHelped++;

    history.push({

      title : "🍲 Food Donation",

      description :
      "You donated " + meals + " meals"

    });

    saveData();

    alert("Food Donation Successful");

    showDashboard();

  }

}

function donateClothes(){

  let clothes =
  document.getElementById("clothesAmount").value;

  if(clothes === ""){

    alert("Enter clothes number");

  }

  else{

    totalDonations++;

    familiesHelped++;

    history.push({

      title : "👕 Clothes Donation",

      description :
      "You donated " + clothes + " clothes"

    });

    saveData();

    alert("Clothes Donation Successful");

    showDashboard();

  }

}

function fawry(){

  let amount =
  document.getElementById("amount").value;

  balance += Number(amount);

  saveData();

  alert("Balance Added By Fawry");

  showProfile();

}

function instapay(){

  let amount =
  document.getElementById("amount").value;

  balance += Number(amount);

  saveData();

  alert("Balance Added By InstaPay");

  showProfile();

}

function credit(){

  let amount =
  document.getElementById("amount").value;

  balance += Number(amount);

  saveData();

  alert("Balance Added By Credit Card");

  showProfile();

}

function saveSettings(){

  alert("Settings Updated");

}

function logout(){

  window.location.href =
  "home.html";

}

showDashboard();