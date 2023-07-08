// Calculate Total.
let inputFields = document.querySelectorAll(".price-options input");
let titleField = document.querySelector("#title");
let priceField = document.querySelector("#price");
let taxesField = document.querySelector("#taxes");
let adsField = document.querySelector("#ads");
let discountField = document.querySelector("#discount");
let totalField = document.querySelector("#total");
let countField = document.querySelector("#count");
let categoryField = document.querySelector("#category");

for (let i = 0; i < inputFields.length; i++) {
  inputFields[i].addEventListener("input", () => {
    let price = +priceField.value;
    let taxes = +taxesField.value;
    let ads = +adsField.value;
    let discount = +discountField.value;
    calcTotal(price, taxes, ads, discount);
  });
}

function calcTotal(p, t, a, d) {
  if (p) {
    let result = p + t + a - d;
    totalField.innerHTML = result;
    totalField.style.backgroundColor = "#008000";
  } else {
    totalField.innerHTML = "";
    totalField.style.backgroundColor = "#a00d02";
  }
}
// Add New Product
let create_btn = document.querySelector("#create-btn");
let updateProduct_btn = document.querySelector("#updateProduct_btn");
let update_btn = document.querySelector("#update-btn");
let delete_btn = document.querySelector("#delete-btn");
let tbody = document.querySelector("#tbody");
let allProducts = [];
// localStorage.clear();
if (localStorage.products)
  allProducts = JSON.parse(localStorage.getItem("products"));

function ShowData() {
  let tableInfo = "";

  for (let i = 0; i < allProducts.length; i++) {
    let row = `
        <tr>
          <td>${i + 1}</td>
          <td>${allProducts[i].title}</td>
          <td>${allProducts[i].price}</td>
          <td>${allProducts[i].taxes}</td>
          <td>${allProducts[i].ads}</td>
          <td>${allProducts[i].discount}</td>
          <td>${allProducts[i].total}</td>
          <td>${allProducts[i].category}</td>
          <td><button class='btn' id='update-btn' onclick ='updateProduct(${JSON.stringify(allProducts[i])})'>Update</button></td>
          <td><button class='btn' id='delete-btn' onclick='deleteProduct(${i})'>Delete</button></td>
        </tr>
    `;
    tableInfo += row;
  }
  tbody.innerHTML = tableInfo;

  if (allProducts.length) {
    // ====================================
    // This code will create a button every time you add a product
    // let deleteAll_btn = document.createElement("button");
    // deleteAll_btn.classList.add("btn");
    // deleteAll_btn.id = "deleteAll-btn";
    // deleteAll_btn.innerText = "Delete All";
    // document.querySelector("#deleteAll-box").appendChild(deleteAll_btn);
    // ====================================
    document.querySelector(
      "#deleteAll-box"
    ).innerHTML = `<button class='btn' onclick='deleteAllProducts()'>Delete All (${allProducts.length})</button>`;
  } else {
    document.querySelector("#deleteAll-box").innerHTML = "";
  }
}
ShowData();

function Reset() {
  totalField.innerText = "";
  totalField.style.backgroundColor = "#a00d02";

  let allInputs = document.querySelectorAll(".main input");
  for (let i = 0; i < allInputs.length; i++) {
    allInputs[i].value = "";
  }
}

function deleteProduct(i) {
  // Delete this product from Local Storage.
  const updatedData = allProducts.filter((item, index) => index !== i);
  // ========================================
  // You can Use .splice to remove directly from the allPorducts array.
  // allproducts.splice(remove from this index, number of elements to remove);
  // allPorducts.splice(i, 1); => tho You don't need a new array and you can remove line 88 now.
  // ========================================

  // Update products Info in Local Storage.
  localStorage.products = JSON.stringify(updatedData);

  // Update all products array to call ShowData() function.
  allProducts = updatedData;
  ShowData();
}

function deleteAllProducts() {
  allProducts.length = 0;
  localStorage.products = JSON.stringify(allProducts);
  // ====================================
  // localStorage.clear(); => I prefer this
  // allProducts.splice(0);
  // ====================================
  ShowData();
}

function updateProduct(product) {
  titleField.value = product.title;
  priceField.value = product.price;
  taxesField.value = product.taxes;
  adsField.value = product.ads;
  discountField.value = product.discount;
  totalField.innerHTML = product.total;
  countField.value = product.count || 1;
  categoryField.value = product.category;
  create_btn.classList.toggle('hidebtn')

  updateProduct_btn.addEventListener('click', () => {
    product.title = titleField.value;
    // priceField.value = product.price;
    // taxesField.value = product.taxes;
    // adsField.value = product.ads;
    // discountField.value = product.discount;
    // totalField.innerHTML = product.total;
    // countField.value = product.count || 1;
    // categoryField.value = product.category;
  })  

}

create_btn.addEventListener("click", () => {
  // ================= Product Info =================
  const productInfo = {
    title: titleField.value,
    price: priceField.value,
    taxes: taxesField.value,
    ads: adsField.value,
    discount: discountField.value,
    total: totalField.innerText,
    count: +countField.value,
    category: categoryField.value,
  };
  // Create Specific Number of Products
  if(productInfo.count) {
    for (let i = 0; i < productInfo.count; i++) {
      allProducts.push(productInfo);
    }
  } else {
    allProducts.push(productInfo);
  }

  // ================= Saving Products  =================
  localStorage.setItem("products", JSON.stringify(allProducts));

  // ================= Clear Fields  =================
  Reset();

  // ================= Showing Products  =================
  ShowData();
});
