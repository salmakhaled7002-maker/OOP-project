function login(){

  let email =
  document.querySelector('input[type="email"]').value;

  let password =
  document.querySelector('input[type="password"]').value;

  if(email === "" || password === ""){

    alert("Please enter email and password");

  }

  else{

    alert("Login Successful");

  }

}