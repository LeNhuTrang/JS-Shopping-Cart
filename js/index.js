var productList = [];

var mapData = function (data) {
  var mappedProduct;
  var mappedArr = [];

  for (i = 0; i < data.length; i++) {
    mappedProduct = new Product(
      data[i].id,
      data[i].name,
      data[i].price,
      data[i].img,
      data[i].type,
      data[i].desc,
      data[i].quantity
    );

    mappedArr.push(mappedProduct);
  }
  return mappedArr;
};

//CREATE LIST TO SHOW ON BROWSER
var showList = function (data) {
  if (!data) data = productList;

  var content = "";

  for (i = 0; i < data.length; i++) {
    content += `<div class="oneProduct mx-3 my-5">
        <img src="${data[i].img}" class="picture w-100">
        <h3 class="my-4">${data[i].name}</h3>
        <p class="h6 py-4 text-justify">${data[i].desc}</p>
        <p class =" h4 text-danger font-weight-bold">$${data[i].price}</p>
        <button onclick="addToCart('${data[i].id}')" class="my-3 px-4 py-3 btn btn-primary"><span class="h4">Thêm vào giỏ</span></button>
        </div>`;
  }
  document.getElementById("showProduct").innerHTML = content;
};

//FETCH LIST
var fetchList = function () {
  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
    method: "GET",
  })
    .then(function (res) {
      productList = mapData(res.data);
      console.log(productList);
      showList();
    })
    .catch(function (err) {
      console.log(err);
    });
};
fetchList();

// FILTER LIST: 
var showListOfType = function (typeSelected) {
  var filteredList = [];

  var typeSelected = document.getElementById("select").value;

  if (typeSelected === "displayAll") filteredList = productList;
  else {
    for (var i = 0; i < productList.length; i++) {
      if (typeSelected.toLowerCase() === productList[i].type.toLowerCase()) {
        filteredList.push(productList[i]);
      }
    }
  }
  console.log(filteredList);
  showList(filteredList);
};

//CART
var cart = [];

var addToCart = function (id) {
  var index = findIndexInCart(id);

  if (index === -1) {
    var i = findIndexInProductList(id);
    var itemCart = new Product(
      productList[i].id,
      productList[i].name,
      productList[i].price,
      productList[i].img,
      productList[i].type,
      productList[i].desc,
      1
    );
    cart.push(itemCart);
  } else {
    cart[index].quantity++;
  }
  console.log(cart);
  showCart();
  saveData();
};

// FIND INDEX:
var findIndexInCart = function (id) {
  for (i = 0; i < cart.length; i++) {
    if (id === cart[i].id) {
      return i;
    }
  }
  return -1;
};

var findIndexInProductList = function (id) {
  for (i = 0; i < productList.length; i++) {
    if (id === productList[i].id) {
      return i;
    }
  }
  return -1;
};

//CREATE TABLE:
var showCart = function () {
  var content = "";
  var sum = 0;

  for (i = 0; i < cart.length; i++) {
    content += `<tr class="text-center">
        <td>${i + 1}</td>
        <td><img src="${cart[i].img}" class = "picture" width="200" "</td>
        <td>${cart[i].price}</td>
        <td>${cart[i].quantity}
        <button onclick="plus('${
          cart[i].id
        }')" type="button" class = "btn btn-primary">+</button>
        <button onclick="minus('${
          cart[i].id
        }')" type="button" class = "btn btn-primary">-</button>
        </td>
        <td>${cart[i].total()}</td>
        <td>
        <button onclick="deleteCart('${
          cart[i].id
        }')" type="button" class = "btn btn-primary m-0">Xóa</button>
        </td>
        </tr>`;

    sum += cart[i].total();
  }
  document.getElementById("cartContent").innerHTML = content;
  document.getElementById("sum").innerHTML =
    "Tổng cộng: " + sum.toLocaleString();
};

//SAVE DATA
var saveData = function () {
  localStorage.setItem("cartList", JSON.stringify(cart));
  console.log(JSON.stringify(cart));
};

//FETCH DATA
var fetchCart = function () {
  var cartLocalStorage = localStorage.getItem("cartList"); 
  if (cartLocalStorage) {
    var parsedCart = JSON.parse(cartLocalStorage); 
    cart = mapData(parsedCart); 
    showCart();
  }
};
fetchCart();

//PLUS
var plus = function (id) {
  var i = findIndexInCart(id);
  if (i === -1) {
    return;
  } else {
    cart[i].quantity++;
  }
  showCart();
  saveData();
};

//MINUS
var minus = function (id) {
  var i = findIndexInCart(id);
  if (i === -1) {
    return;
  } else if (i !== -1 && cart[i].quantity > 1) {
    cart[i].quantity--;
  }
  showCart();
  saveData();
};

//DELETE
var deleteCart = function (id) {
  var i = findIndexInCart(id);
  if (i === -1) return;
  else {
    cart.splice(i, 1);
  }
  showCart();
  saveData();
};

//CLEAR CART
var clearCart = function () {
  cart = [];
  showCart();
  saveData();
};
