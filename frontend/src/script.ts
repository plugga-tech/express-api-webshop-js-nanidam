const loginIcon = document.getElementById("login-icon") as HTMLElement;
const cartIcon = document.getElementById("cart-icon") as HTMLElement;

loginIcon.addEventListener("click", () => {
  console.log("clicked on the user-icon");
});

cartIcon.addEventListener("click", () => {
  console.log("clicked on the cart-icon");
});


