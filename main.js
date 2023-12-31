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
// Get Search
let search_mood = "title";
let searchField = document.querySelector("#search");

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
let modify_btn = document.querySelector("#modify-btn");
let update_btn = document.querySelector("#update-btn");
let delete_btn = document.querySelector("#delete-btn");
let tbody = document.querySelector("#tbody");
let allProducts = [];
// localStorage.clear();
if (localStorage.products)
  allProducts = JSON.parse(localStorage.getItem("products"));

function ShowData(arr = allProducts) {
  let tableInfo = "";

  for (let i = 0; i < arr.length; i++) {
    let row = `
        <tr>
          <td>${i + 1}</td>
          <td>${arr[i].title}</td>
          <td>${arr[i].price}</td>
          <td>${arr[i].taxes}</td>
          <td>${arr[i].ads}</td>
          <td>${arr[i].discount}</td>
          <td>${arr[i].total}</td>
          <td>${arr[i].category}</td>
          <td><button class='btn' id='update-btn' onclick ='updateProduct(${i})'>Update</button></td>
          <td><button class='btn' id='delete-btn' onclick='deleteProduct(${i})'>Delete</button></td>
        </tr>
    `;
    tableInfo += row;
  }
  tbody.innerHTML = tableInfo;

  if (arr.length) {
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
    ).innerHTML = `<button class='btn' onclick='deleteAllProducts()'>Delete All (${arr.length})</button>`;
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
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete them!'
  }).then((result) => {
    if (result.isConfirmed) {
      allProducts.length = 0;
      localStorage.products = JSON.stringify(allProducts);
      // ====================================
      // localStorage.clear(); => I prefer this
      // allProducts.splice(0);
      // ====================================
      ShowData();
      Swal.fire(
        'Deleted!',
        'Your Products have been deleted.',
        'success'
      )
    }
  })
}

// There is another way to activate the Update function:
// - create a variable to hold the (mood) of the programe. => let mood = 'create'; Global Variable.
// - at line 186 => this is where we add new product.
// - tho, when the mood is create, make the click event on the create_btn add new product.
// - if(mood === 'create') {}
// - if mood was 'update' or any thing except 'create'. => else {}
// - take the (productInfo) and add it in the array at the (same) index of the product you want to update.
// - Now, How we get the index of the desired product. => make a Global Variable called temp;
// - when you click update button, it will pass the index to the function and then assign it to the temp variable.
// - See the video Number 10.
// - this way makes you don't need to create another button or use the data-attribute in HTML.

function updateProduct(i) {
  let product = allProducts[i];
  // Show Information Of Product
  titleField.value = product.title;
  priceField.value = product.price;
  taxesField.value = product.taxes;
  adsField.value = product.ads;
  discountField.value = product.discount;
  calcTotal(
    priceField.value,
    taxesField.value,
    adsField.value,
    discountField.value
  );
  // There is no need for count field => user just modify the exsiting product
  // countField.value = product.count || 1; => X
  countField.style.display = "none";
  categoryField.value = product.category;
  // ==================================

  // Hide Create Button
  create_btn.classList.add("hide");

  // Pass The Index Of The Product => to target it in the array
  modify_btn.dataset.productIndex = i;

  scroll({
    top: 0,
    behavior: "smooth",
  });
}

modify_btn.addEventListener("click", () => {
  create_btn.classList.remove("hide");
  countField.style.display = "block";
  let positionInArr = modify_btn.dataset.productIndex;
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
  allProducts.splice(positionInArr, 1, productInfo);
  localStorage.setItem("products", JSON.stringify(allProducts));
  ShowData();
  Reset();
});

create_btn.addEventListener("click", (e) => {
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
  if(productInfo.title && productInfo.price && productInfo.category) {

    if (productInfo.count) {
      for (let i = 0; i < productInfo.count; i++) {
        allProducts.push(productInfo);
      }
    } else {
      allProducts.push(productInfo);
    }
  } else {
    Swal.fire({
      title: 'Not Enough Info',
      html: 'Required <b>Title, Price and Category</b>',
      icon: 'info',
  })
  }

  // ================= Saving Products  =================
  localStorage.setItem("products", JSON.stringify(allProducts));

  // ================= Clear Fields  =================
  Reset();

  // ================= Showing Products  =================
  ShowData();
});

function setSearchMood(id) {
  searchField.style.height = "35px";
  searchField.focus();
  searchField.value = "";
  if (!searchField.value) ShowData();
  searchField.placeholder = "search By Title";
  if (id === "searchByCategory") {
    search_mood = "category";
    searchField.placeholder = "search By Category";
  }
}

searchField.addEventListener("keyup", () => {
  search_value = searchField.value;
  const filterd_data = allProducts.filter(
    // Don't use === because this needs the user to know the product title as it stored in database.
    (item) => {
      if (search_mood === "title") {
        return item.title.toLowerCase().includes(search_value.toLowerCase());
      } else {
        return item.category.toLowerCase().includes(search_value.toLowerCase());
      }
    }
  );
  ShowData(filterd_data);
});
