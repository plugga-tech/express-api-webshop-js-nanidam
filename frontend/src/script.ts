const loginIcon = document.getElementById("login-icon") as HTMLElement;
const cartIcon = document.getElementById("cart-icon") as HTMLElement;
const loginPage = document.querySelector(".login-page") as HTMLDivElement;
const loginUser = document.querySelector(
  ".login-user-btn"
) as HTMLButtonElement;

const registerUser = document.querySelector(
  ".user-register"
) as HTMLLinkElement;

const registerPage = document.querySelector(".register-page") as HTMLDivElement;
const registerUserBtn = document.querySelector(
  ".register-user-btn"
) as HTMLButtonElement;
const bgPopup = document.querySelector(".bg-popup") as HTMLDivElement;

//Open login for user
loginIcon.addEventListener("click", () => {
  loginPage.classList.remove("hidden");
  bgPopup.classList.remove("hidden");
});

registerUser.addEventListener("click", () => {
  registerPage.classList.remove("hidden");
  loginPage.classList.add("hidden");
});

//Login btn
loginUser.addEventListener("click", () => {
  loginPage.classList.add("hidden");
  bgPopup.classList.add("hidden");
});

//Register user
registerUserBtn.addEventListener("click", () => {
  registerPage.classList.add("hidden");
  bgPopup.classList.add("hidden");
});

//Open cart
cartIcon.addEventListener("click", () => {});
