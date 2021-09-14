const featchURL =async (url) =>{
  const res = await fetch(url);
  const data = await res.json();
  return data;
  
}

const loadProducts = () => {
  featchURL(`./db.json`).then(data=>{
    showProducts(data);
  });
};
loadProducts();

// show all product in UI with Rating
const showProducts = (products) => {
  // const allProducts = products.map((pd) => pd);
  for (const product of products) {
    const image = product.image; // correction 
    const starPercentetage = (product.rating.rate/5) * 100;
    const starPercentetageRounded = `${Math.round(starPercentetage/10) * 10}%`
    const div = document.createElement('div');
    div.classList.add('col');
    div.innerHTML=`
    <div class="card h-100 shadow p-3 mb-5 rounded">
        <img src="${image}" class="product-image" alt="...">
        <div class="card-body mt-5">
          <h4 class="card-title">${product.title}</h4>
          <h6>Category: ${product.category}</h6>
          <h3>Price: $ ${product.price}</h3>
          <h6 class="card-text">
          <div>
          Rating :
          <div class="star-outer my-3">
            <div class="star-inner" style="width : ${starPercentetageRounded}"></div>
            </div>(${product.rating.rate})</div>
          <div>
          Rating Count : 
          <i class="fas fa-user mx-.50"></i>
          <span>${product.rating.count} </span></h6>
        </div>
        <div class="card-footer d-flex justify-content-between">
        <button onclick="addToCart(${product.price})" class="btn button-color px-2">add to cart</button>
        <button class="btn button-color px-2" onclick="showDetails(${product.id})" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>
      </div>
    </div>
    `
    document.getElementById("all-products").appendChild(div);  
  }  
};
let count = 0;
const addToCart = price => {
  count ++;
  updatePrice("price", price);

  updateTaxAndCharge();
  document.getElementById("total-Products").innerText = count;
};

const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseFloat(element); //change parseInt
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const convertPrice = parseFloat(value);
  const total = convertedOldPrice + convertPrice;
  document.getElementById(id).innerText = parseFloat(total).toFixed(2);//remove Math.round// 
};

// set innerText function
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = parseFloat(value).toFixed(2);  //remove Math.round
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("price");
  if (priceConverted > 200) {
    setInnerText("delivery-charge", 30);
    setInnerText("total-tax", priceConverted * 0.2);
  }
  else if (priceConverted > 400) {
    setInnerText("delivery-charge", 50);
    setInnerText("total-tax", priceConverted * 0.3);
  }
  else if (priceConverted > 500) {
    setInnerText("delivery-charge", 60);
    setInnerText("total-tax", priceConverted * 0.4);
  }
  
  // call updateTotal() 
  updateTotal();
};

//grandTotal update function
const updateTotal = () => {
  const grandTotal = 
    parseFloat(getInputValue("price") )
    + getInputValue("delivery-charge") +
    getInputValue("total-tax");
  document.getElementById("total").innerText = grandTotal.toFixed(2);
};

// search product and empty error
const searchProducts=()=>{
    const searchValue = document.getElementById('input-field').value.toLowerCase();
    const productSearch = document.getElementsByClassName("col");
    const allProduct  = document.getElementById('all-products')
    const errorMsg = document.getElementById('error-msg');
    const noFound = document.getElementById('noresult-found');

    // if search value empty
    if(searchValue===''){
      errorMsg.innerText = 'Please Enter a product name!!!';
      noFound.textContent = '';
      document.getElementById('input-field').value = '';
      return;
    }

    for (const element of productSearch) {      
     if (element.innerText.toLowerCase().includes(searchValue)){
        element.style.display = "block";
        
      } 
      else {
        element.style.display = "none";
      }
    }
    
    // no result found
    if(!allProduct.innerText.toLowerCase().includes(searchValue)){
      noFound.innerText = 'NO Product Found!!!';
      errorMsg.textContent = '';
      document.getElementById('input-field').value = '';
      return;
    } 
    noFound.textContent = '';  
    errorMsg.textContent = '';
    document.getElementById('input-field').value = '';
  };


  // show details
  const showDetails=(id)=>{
    const url = `https://fakestoreapi.com/products/${id}`;
    featchURL(url).then(data=>{
      const starPercentetage = (data.rating.rate/5) * 100;
    const starPercentetageRounded = `${Math.round(starPercentetage/10) * 10}%`
      const modalBody = document.getElementById('modal-body');
      modalBody.innerHTML =`
    <div class="modal-card">
    <img  src="${data.image}" class=" modal-img" alt="product img">
    <div class="card-body">
      <h5 class="card-title">${data.title}</h5>
      <p class="card-text">${data.description}</p>
      <div>
          Rating :
          <div class="star-outer my-3">
            <div class="star-inner" style="width : ${starPercentetageRounded}"></div>
            </div>(${data.rating.rate})</div>
          <div>
          Rating Count : 
          <i class="fas fa-user mx-.50"></i>
          <span>${data.rating.count} </span></h6>
        </div>
    </div>
  </div> `;
    });
  }