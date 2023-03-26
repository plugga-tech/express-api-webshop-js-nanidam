import axios from "axios";

const loginIcon = document.getElementById("login-icon") as HTMLElement;
const cartIcon = document.getElementById("cart-icon") as HTMLElement;
const bgPopup = document.querySelector(".bg-popup") as HTMLDivElement;

//Login variables
const loginPage = document.querySelector(".login-page") as HTMLDivElement;
const loginUser = document.querySelector(
  ".login-user-btn"
) as HTMLButtonElement;

//Register variables
const registerUser = document.querySelector(
  ".user-register"
) as HTMLLinkElement;
const registerPage = document.querySelector(".register-page") as HTMLDivElement;
const registerUserBtn = document.querySelector(
  ".register-user-btn"
) as HTMLButtonElement;

//Cart variables
const cart = document.querySelector(".cart") as HTMLDivElement;
const cartCancelBtn = document.querySelector(
  ".cart-cancel-btn"
) as HTMLButtonElement;
const cartSendBtn = document.querySelector(
  ".cart-send-btn"
) as HTMLButtonElement;

//Products
const productsContainer = document.querySelector(".products") as HTMLElement;
const productImg = document.querySelector(".product-img") as HTMLImageElement;
const subtractProductBtn = document.querySelector(
  ".product-decrease-btn"
) as HTMLImageElement;
const addProductBtn = document.querySelector(
  ".product-increase-btn"
) as HTMLImageElement;
const productName = document.querySelector(
  ".product-name"
) as HTMLParagraphElement;
const productPrice = document.querySelector(
  ".product-price"
) as HTMLParagraphElement;

// get all products
const productConfig = {
  headers: {
    "Content-type": "application/json",
  },
  method: "GET",
  url: "http://localhost:3000/api/products",
};

const initProduct = await axios(productConfig);
console.log(initProduct.data);

interface IProduct {
  name: string;
  description: string;
  price: number;
  lager: number;
  category: number;
  token: string | undefined;
}
const createProduct = () => {
  initProduct.data.forEach((product: IProduct) => {
    productsContainer.innerHTML += `
    <article class="product">
              <img class="product-img" src="assets/random-product.jpeg" alt="product info">
              <div class="product-counter-container">
                  <button class="product-decrease-btn">-</button>
                  <p><span class="product-count"></span class"product-count"> st</p>
                  <button class="product-increase-btn">+</button>
              </div>
              <div class="product-info">
                  <p class="product-name"><b>${product.name}</b></p>
                  <p><span class="product-price">${product.price}</span> kr</p>
              </div>
          </article>
    `;
  });
};

createProduct();

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
cartIcon.addEventListener("click", () => {
  cart.classList.remove("hidden");
  bgPopup.classList.remove("hidden");
});

//Cancel cart
cartCancelBtn.addEventListener("click", () => {
  cart.classList.add("hidden");
  bgPopup.classList.add("hidden");
});
