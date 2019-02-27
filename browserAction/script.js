document.getElementById("myHeading").style.color = "red";

const loginForm = document.getElementById("loginForm");
const status = document.getElementById("status");

const url = "https://api.pinboard.in/v1/user/api_token";
const options = {
  method: "GET",
  mode: "cors",
  headers: {
    "Content-Type": "application/json"
  }
};

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const token = document.getElementById("apitoken").value;
  fetch(url + `?auth_token=${token}`, options)
    .then(response => {
      console.log("RESPONSE", response);
      status.innerHTML = "Successfully logged in";
    })
    .catch(err => {
      console.error(err);
      status.innerHTML = "Error during login";
    });
  status.innerHTML = "Submitted";
});
