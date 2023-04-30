import axios from "axios";
import { ICategory, IProduct, IProductListItem } from "./models/interfaces";

//Order
const orderIcon = document.getElementById("favorite-icon") as HTMLElement;
const orderContainer = document.querySelector(
  ".order-container"
) as HTMLDivElement;
const exitOrderBtn = document.querySelector(
  ".exit-order-btn"
) as HTMLButtonElement;
const order = document.querySelector(".order") as HTMLDivElement;

//Login variables
const loggedinUsername = document.querySelector(
  ".logged-in-username"
) as HTMLParagraphElement;
const loginIcon = document.getElementById("login-icon") as HTMLElement;
const bgPopup = document.querySelector(".bg-popup") as HTMLDivElement;
const loginPage = document.querySelector(".login-page") as HTMLDivElement;
const loginUser = document.querySelector(
  ".login-user-btn"
) as HTMLButtonElement;
const inputLoginUserMail = document.getElementById(
  "user-email"
) as HTMLInputElement;
const inputLoginUserPassword = document.getElementById(
  "user-password"
) as HTMLInputElement;

//Register variables
const registerUser = document.querySelector(
  ".user-register"
) as HTMLLinkElement;
const registerPage = document.querySelector(".register-page") as HTMLDivElement;
const registerUserBtn = document.querySelector(
  ".register-user-btn"
) as HTMLButtonElement;
const inputRegisterUsername = document.getElementById(
  "register-username"
) as HTMLInputElement;
const inputRegisterUserMail = document.getElementById(
  "register-user-email"
) as HTMLInputElement;
const inputRegisterUserPassword = document.getElementById(
  "register-user-password"
) as HTMLInputElement;

const allCategories = document.querySelector(".header") as HTMLHeadElement;

//Cart variables
const cartIcon = document.getElementById("cart-icon") as HTMLElement;
const cart = document.querySelector(".cart") as HTMLDivElement;
const cartContainer = document.querySelector(
  ".cart-container"
) as HTMLDivElement;
const cartCancelBtn = document.querySelector(
  ".cart-cancel-btn"
) as HTMLButtonElement;
const cartSendBtn = document.querySelector(
  ".cart-send-btn"
) as HTMLButtonElement;
const cartTotalSum = document.querySelector(
  ".cart-total-sum"
) as HTMLParagraphElement;

//Localstorage for logged in user
const savedLoginUser = localStorage.getItem("loggedInUser");
if (savedLoginUser) {
  const foundLoginUser = JSON.parse(savedLoginUser);
  loggedinUsername.innerHTML = foundLoginUser.name;
}

//Localstorage for cart. If cart is empty => start cart as empty array
const initCart = localStorage.getItem("cart");
if (!initCart) {
  localStorage.setItem("cart", JSON.stringify([]));
}

//Get all products
const configProduct = {
  headers: {
    "Content-type": "application/json",
  },
  method: "GET",
  url: "http://localhost:3000/api/products",
};

const productsContainer = document.querySelector(".products") as HTMLElement;
const initProduct = await axios(configProduct);
const categoriesId: ICategory[] = [];

// Add btns => add by one, and send it to cart
const plusBtn = () => {
  const addProductBtns = document.querySelectorAll(
    ".product-increase-btn"
  ) as NodeListOf<HTMLButtonElement>;

  addProductBtns.forEach((btn: HTMLButtonElement) => {
    btn.addEventListener("click", (e: MouseEvent) => {
      const getProductName = (e.currentTarget as HTMLElement).parentElement
        ?.nextElementSibling?.childNodes[1]
        .childNodes[0] as HTMLParagraphElement;
      const productName = getProductName.innerHTML;

      const getProductPrice = (e.currentTarget as HTMLElement).parentElement
        ?.nextElementSibling?.childNodes[3]
        .childNodes[0] as HTMLParagraphElement;
      const productPrice = getProductPrice.innerHTML;

      const productCount = (e.currentTarget as HTMLElement).parentElement
        ?.childNodes[3].childNodes[0] as HTMLSpanElement;

      const numbCount = Number(productCount.innerHTML);
      const addCount = numbCount + 1;
      const stringifyCount = String(addCount);

      productCount.innerHTML = stringifyCount;
      const foundProduct: { name: string; _id: string } = initProduct.data.find(
        (prod: { name: string }) => prod.name === productName
      );

      const product = {
        name: productName,
        count: addCount,
        price: productPrice,
        id: foundProduct._id,
      };

      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const newCart = currentCart.slice();

      const productIndex = newCart.findIndex(
        (prod: any) => prod.name === productName
      );

      //If productindex is more or equal to 0
      if (productIndex >= 0) {
        newCart[productIndex].count += 1;
      } else {
        newCart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(newCart));
    });
  });
};

// Subtract btns => reduce by one, cannot go below 0, and send it to cart
const minusBtn = () => {
  const subtractProductBtns = document.querySelectorAll(
    ".product-decrease-btn"
  ) as NodeListOf<HTMLButtonElement>;

  subtractProductBtns.forEach((btn: HTMLButtonElement) => {
    btn.addEventListener("click", (e: MouseEvent) => {
      const productCount = (e.currentTarget as HTMLElement).parentElement
        ?.childNodes[3].childNodes[0] as HTMLSpanElement;
      const numbCount = Number(productCount.innerHTML);

      const getProductName = (e.currentTarget as HTMLElement).parentElement
        ?.nextElementSibling?.childNodes[1]
        .childNodes[0] as HTMLParagraphElement;
      const productName = getProductName.innerHTML;

      if (numbCount > 0) {
        const subtractCount = numbCount - 1;
        const stringifyCount = String(subtractCount);
        productCount.innerHTML = stringifyCount;

        const foundProduct: { name: string; _id: string } =
          initProduct.data.find(
            (prod: { name: string }) => prod.name === productName
          );

        const product = {
          name: productName,
          count: subtractCount,
          price: productPrice,
          id: foundProduct._id,
        };

        const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const newCart = currentCart.slice();

        const productIndex = newCart.findIndex(
          (prod: any) => prod.name === productName
        );

        if (productIndex >= 0) {
          newCart[productIndex].count = subtractCount;
          if (subtractCount === 0) {
            newCart.splice(productIndex, 1);
          }
        } else {
          newCart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(newCart));
      }
    });
  });
};

//Create each products from database
const createProduct = async () => {
  const localStorageCart = JSON.parse(initCart!);
  const initProduct = await axios(configProduct);
  productsContainer.innerHTML = "";

  initProduct.data.forEach((product: IProduct) => {
    let newCount = 0;

    if (localStorageCart) {
      for (let i = 0; i < localStorageCart.length; i++) {
        const cartItem = localStorageCart[i];
        if (product.name === cartItem.name) {
          newCount = cartItem.count;
          break;
        }
      }
    }

    productsContainer.innerHTML += `
      <article class="product">
        <img class="product-img" src="assets/random-product.jpeg" alt="product info">
        <div class="product-counter-container">
            <button class="product-decrease-btn">-</button>
            <p><span class="product-count">${newCount}</span class"product-count"> st</p>
            <button class="product-increase-btn">+</button>
        </div>
        <div class="product-info">
            <p class="product-name"><b>${product.name}</b></p>
            <p><span class="product-price">${product.price}</span> kr</p>
        </div>
      </article>
    `;
  });
  plusBtn();
  minusBtn();
};

await createProduct();

// Create categories from db
const printCategories = async () => {
  const categoriesContainer = document.querySelector(
    ".categories-container"
  ) as HTMLElement;

  const configCategories = {
    headers: {
      "Content-type": "application/json",
    },
    method: "GET",
    url: "http://localhost:3000/api/categories/",
  };

  const { data: getCategories } = await axios(configCategories);

  getCategories.forEach((category: ICategory) => {
    categoriesContainer.innerHTML += `
      <button id="${category.name}-btn" class="category">${category.name}</button>
    `;
  });
};

await printCategories();

const getCategoriesId = async () => {
  const categoriesIdConfig = {
    headers: {
      "Content-type": "application/json",
    },
    method: "GET",
    url: `http://localhost:3000/api/categories/`,
  };

  const allCategories = await axios(categoriesIdConfig);
  const allCategoriesData = allCategories.data;
  allCategoriesData.forEach((category: ICategory) => {
    categoriesId.push(category);
  });
};

const productsCategory = async () => {
  getCategoriesId();

  const allCategories = document.querySelectorAll(
    ".category"
  ) as NodeListOf<HTMLButtonElement>;

  allCategories.forEach((categoryBtn: HTMLButtonElement) => {
    categoryBtn.addEventListener("click", async (e: MouseEvent) => {
      const categoryText = (e.target as HTMLElement).innerHTML;

      const category = categoriesId.find(
        (cat) => cat.name === (categoryText as string)
      );

      const configCategory = {
        headers: {
          "Content-type": "application/json",
        },
        method: "GET",
        url: category
          ? `http://localhost:3000/api/products/category/${category._id}`
          : "",
      };

      const productCategory = await axios(configCategory);
      const initCart = localStorage.getItem("cart");
      const localStorageCart = JSON.parse(initCart!);

      productsContainer.innerHTML = "";
      productCategory.data.forEach((product: IProduct) => {
        let newCount = 0;

        if (localStorageCart) {
          for (let i = 0; i < localStorageCart.length; i++) {
            const cartItem = localStorageCart[i];
            if (product.name === cartItem.name) {
              newCount = cartItem.count;
              break;
            }
          }
        }

        productsContainer.innerHTML += `
          <article class="product">
            <img class="product-img" src="assets/random-product.jpeg" alt="product info">
            <div class="product-counter-container">
                <button class="product-decrease-btn">-</button>
                <p><span class="product-count">${newCount}</span class"product-count"> st</p>
                <button class="product-increase-btn">+</button>
            </div>
            <div class="product-info">
                <p class="product-name"><b>${product.name}</b></p>
                <p><span class="product-price">${product.price}</span> kr</p>
            </div>
          </article>
          `;
      });
      plusBtn();
      minusBtn();
    });
  });
};

productsCategory();

// Show all categories
allCategories.addEventListener("click", async () => {
  await createProduct();
});

//Products variables. Must be after createproducts
// const productImg = document.querySelector(".product-img") as HTMLImageElement;
// const productName = document.querySelector(
//   ".product-name"
// ) as HTMLParagraphElement;
const productPrice = document.querySelector(
  ".product-price"
) as HTMLParagraphElement;

//Create cart with current content
const renderCart = (cart: any) => {
  cartContainer.innerHTML = ``;
  cart.forEach((product: { count: number; name: string; price: number }) => {
    cartContainer.innerHTML += `
    <div class="cart-product">
      <img class="cart-product-img" src="assets/random-product.jpeg" alt="product info" height="100px">
      <p><span class="cart-product-count">${product.count}</span> st</p>
      <div class="cart-product-info">
        <p class="cart-product-name">${product.name}</p>
        <p class="">Summa: <span class="cart-product-sum">${
          product.count * product.price
        }</span> kr</p>
      </div>
    </div>    
    `;
  });

  //Cart sum
  const totalSum = cart.reduce(
    (acc: number, product: { count: number; name: string; price: number }) =>
      acc + product.count * product.price,
    0
  );

  cartTotalSum.textContent = totalSum;
};

//Open login for user
loginIcon.addEventListener("click", () => {
  loginPage.classList.remove("hidden");
  bgPopup.classList.remove("hidden");
});

//Open register
registerUser.addEventListener("click", () => {
  registerPage.classList.remove("hidden");
});

//Login btn
loginUser.addEventListener("click", async () => {
  const configLoginUser = {
    method: "POST",
    url: "http://localhost:3000/api/users/login",
    headers: {
      "Content-type": "application/json",
    },
    data: {
      email: inputLoginUserMail.value,
      password: inputLoginUserPassword.value,
    },
  };

  const loginUser = await axios(configLoginUser);

  if (loginUser.status === 202) {
    loginPage.classList.add("hidden");
    bgPopup.classList.add("hidden");
    loggedinUsername.innerHTML = `${loginUser.data.name}`;
    localStorage.setItem("loggedInUser", JSON.stringify(loginUser.data));
  }
});

//Register user
registerUserBtn.addEventListener("click", async () => {
  registerPage.classList.add("hidden");
  bgPopup.classList.add("hidden");

  //post registered user
  const configRegisterUser = {
    method: "POST",
    url: "http://localhost:3000/api/users/add",
    headers: {
      "Content-type": "application/json",
    },
    data: {
      name: inputRegisterUsername.value,
      password: inputRegisterUserPassword.value,
      email: inputRegisterUserMail.value,
    },
  };

  const registeredUser = await axios(configRegisterUser);

  if (registeredUser.status === 201) {
    registerPage.classList.add("hidden");
    bgPopup.classList.add("hidden");
  }
});

//Open cart
cartIcon.addEventListener("click", () => {
  cart.classList.remove("hidden");
  bgPopup.classList.remove("hidden");

  const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
  renderCart(currentCart);
});

//Send order
cartSendBtn.addEventListener("click", async () => {
  const foundLoggedinUser = JSON.parse(
    localStorage.getItem("loggedInUser") || "[]"
  );

  if (Array.isArray(foundLoggedinUser)) {
    alert("Var vänlig, logga in :)");
    return;
  }

  const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
  const productList: IProductListItem[] = [];

  if (currentCart.length) {
    currentCart.forEach(
      (product: { name: string; count: number; price: string; id: string }) => {
        productList.push({ productId: product.id, quantity: product.count });
      }
    );
  }

  const configOrders = {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    url: "http://localhost:3000/api/orders/add",
    data: {
      user: foundLoggedinUser.id,
      products: productList,
    },
  };

  const sendOrder = await axios(configOrders);
  if (sendOrder.status === 201) {
    alert("Order skickad!");

    //Empty localstorage and productscontainer
    localStorage.setItem("cart", JSON.stringify([]));
    productsContainer.innerHTML = "";

    createProduct();
    cart.classList.add("hidden");
    bgPopup.classList.add("hidden");
  }
});

//Cancel cart btn
cartCancelBtn.addEventListener("click", () => {
  cart.classList.add("hidden");
  bgPopup.classList.add("hidden");
});

//Order = heart-icon
orderIcon.addEventListener("click", async () => {
  order.classList.remove("hidden");
  bgPopup.classList.remove("hidden");
  const foundLoggedinUser = JSON.parse(
    localStorage.getItem("loggedInUser") || "[]"
  );

  if (Array.isArray(foundLoggedinUser)) {
    alert("Var vänlig, logga in :)");
    return;
  }

  const configOrder = {
    method: "POST",
    url: "http://localhost:3000/api/orders/user",
    headers: {
      "Content-type": "application/json",
    },
    data: {
      user: foundLoggedinUser.id,
      token: "1234key1234",
    },
  };

  const seeOrders = await axios(configOrder);
  const userOrders = seeOrders.data;

  userOrders.forEach((order: any) => {
    orderContainer.innerHTML += `
      <p>Order-ID: ${order._id}</p>
      <ul>
        ${order.products
          .map(
            (product: any) => `
          <li>Produkt-ID: ${product.productId}<br>Antal: ${product.quantity}</li>
        `
          )
          .join("")}
      </ul>
    `;
  });
});

exitOrderBtn.addEventListener("click", () => {
  order.classList.add("hidden");
  bgPopup.classList.add("hidden");
});
