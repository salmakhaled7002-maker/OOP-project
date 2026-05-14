window.onload = function(){

  let rememberedEmail =
  localStorage.getItem("rememberEmail");

  let rememberedPassword =
  localStorage.getItem("rememberPassword");

  if(rememberedEmail && rememberedPassword){

    document.querySelector(
      'input[type="email"]'
    ).value = rememberedEmail;

    document.querySelector(
      'input[type="password"]'
    ).value = rememberedPassword;

    document.getElementById(
      "remember"
    ).checked = true;

  }

}

function login(){

  let email =
  document.querySelector(
    'input[type="email"]'
  ).value;

  let password =
  document.querySelector(
    'input[type="password"]'
  ).value;

  let remember =
  document.getElementById(
    "remember"
  ).checked;

  let savedEmail =
  localStorage.getItem(
    "userEmail"
  );

  let savedPassword =
  localStorage.getItem(
    "userPassword"
  );

  let savedRole =
  localStorage.getItem(
    "userRole"
  );

  if(email === "" || password === ""){

    alert(
      "Please enter email and password"
    );

  }

  else if(email === savedEmail &&
          password === savedPassword){

    if(remember){

      localStorage.setItem(
        "rememberEmail",
        email
      );

      localStorage.setItem(
        "rememberPassword",
        password
      );

    }

    else{

      localStorage.removeItem(
        "rememberEmail"
      );

      localStorage.removeItem(
        "rememberPassword"
      );

    }

    alert("Login Successful");

    if(savedRole === "donor"){

      window.location.href =
      "donor dashboard.html";

    }

    else{

      window.location.href =
      "recipient dashboard.html";

    }

  }

  else{

    alert(
      "Wrong Email Or Password"
    );

  }

}