
const jsonText = document.querySelector("#productData").textContent;
const products = JSON.parse(jsonText);
console.log("Products loaded:", products.length);

const cart = [];
let selectedSize = "";
let selectedColor = "";
let currentProduct = null;

function formatPrice(price) {
  let dollars = price - (price % 1);
  let cents = Math.round((price - dollars) * 100);
  let centsStr = "" + cents;
  if (cents < 10) {
    centsStr = "0" + cents;
  }
  return "$" + dollars + "." + centsStr;
}

const homeView = document.querySelector("#home");
const browseView = document.querySelector("#browse");
const singleProductView = document.querySelector("#singleproduct");
const cartView = document.querySelector("#cart");
const aboutDialog = document.querySelector("#about");

function showView(viewName) {
  homeView.style.display = "none";
  browseView.style.display = "none";
  singleProductView.style.display = "none";
  cartView.style.display = "none";

  if (viewName === "home") {
    homeView.style.display = "block";
  } else if (viewName === "browse") {
    browseView.style.display = "block";
    applyFiltersAndDisplay();
  } else if (viewName === "singleproduct") {
    singleProductView.style.display = "block";
  } else if (viewName === "cart") {
    cartView.style.display = "block";
    displayCart();
  }
}

document.querySelector("#homeLink").addEventListener("click", function(e) {
  e.preventDefault();
  showView("home");
});

document.querySelector("#logo").addEventListener("click", function() {
  showView("home");
});

document.querySelector("#browseLink").addEventListener("click", function(e) {
  e.preventDefault();
  showView("browse");
});

document.querySelector("#heroBrowseBtn").addEventListener("click", function() {
  showView("browse");
});

document.querySelector("#cartLink").addEventListener("click", function() {
  showView("cart");
});

document.querySelector("#aboutLink").addEventListener("click", function(e) {
  e.preventDefault();
  aboutDialog.showModal();
});

document.querySelector("#closeAboutX").addEventListener("click", function() {
  aboutDialog.close();
});

document.querySelector("#closeAboutBtn").addEventListener("click", function() {
  aboutDialog.close();
});

function buildFilters() {
  let categories = [];
  let sizes = [];
  let colors = [];

  for (let i = 0; i < products.length; i++) {
    let product = products[i];

    let catFound = false;
    for (let j = 0; j < categories.length; j++) {
      if (categories[j] === product.category) {
        catFound = true;
      }
    }
    if (catFound === false) {
      categories.push(product.category);
    }

    for (let s = 0; s < product.sizes.length; s++) {
      let sizeFound = false;
      for (let j = 0; j < sizes.length; j++) {
        if (sizes[j] === product.sizes[s]) {
          sizeFound = true;
        }
      }
      if (sizeFound === false) {
        sizes.push(product.sizes[s]);
      }
    }

    for (let c = 0; c < product.color.length; c++) {
      let colorFound = false;
      for (let j = 0; j < colors.length; j++) {
        if (colors[j] === product.color[c].name) {
          colorFound = true;
        }
      }
      if (colorFound === false) {
        colors.push(product.color[c].name);
      }
    }
  }

  categories.sort();
  sizes.sort();
  colors.sort();

  let catHTML = "";
  for (let i = 0; i < categories.length; i++) {
    catHTML = catHTML + "<label><input type='checkbox' value='" + categories[i] + "' class='filter-category'> " + categories[i] + "</label>";
  }
  document.querySelector("#categoryFilters").innerHTML = catHTML;

  let sizeHTML = "";
  for (let i = 0; i < sizes.length; i++) {
    sizeHTML = sizeHTML + "<label><input type='checkbox' value='" + sizes[i] + "' class='filter-size'> " + sizes[i] + "</label>";
  }
  document.querySelector("#sizeFilters").innerHTML = sizeHTML;

  let colorHTML = "";
  for (let i = 0; i < colors.length; i++) {
    colorHTML = colorHTML + "<label><input type='checkbox' value='" + colors[i] + "' class='filter-color'> " + colors[i] + "</label>";
  }
  document.querySelector("#colorFilters").innerHTML = colorHTML;
}

function getActiveFilters() {
  let filters = {
    genders: [],
    categories: [],
    sizes: [],
    colors: []
  };

  let genderBoxes = document.querySelectorAll(".filter-gender");
  for (let i = 0; i < genderBoxes.length; i++) {
    if (genderBoxes[i].checked) {
      filters.genders.push(genderBoxes[i].value);
    }
  }

  let catBoxes = document.querySelectorAll(".filter-category");
  for (let i = 0; i < catBoxes.length; i++) {
    if (catBoxes[i].checked) {
      filters.categories.push(catBoxes[i].value);
    }
  }

  let sizeBoxes = document.querySelectorAll(".filter-size");
  for (let i = 0; i < sizeBoxes.length; i++) {
    if (sizeBoxes[i].checked) {
      filters.sizes.push(sizeBoxes[i].value);
    }
  }

  let colorBoxes = document.querySelectorAll(".filter-color");
  for (let i = 0; i < colorBoxes.length; i++) {
    if (colorBoxes[i].checked) {
      filters.colors.push(colorBoxes[i].value);
    }
  }

  return filters;
}

function filterProducts() {
  let filters = getActiveFilters();
  let filtered = [];

  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    let passes = true;

    if (filters.genders.length > 0) {
      let genderMatch = false;
      for (let g = 0; g < filters.genders.length; g++) {
        if (product.gender === filters.genders[g]) {
          genderMatch = true;
        }
      }
      if (genderMatch === false) {
        passes = false;
      }
    }

    if (filters.categories.length > 0 && passes) {
      let catMatch = false;
      for (let c = 0; c < filters.categories.length; c++) {
        if (product.category === filters.categories[c]) {
          catMatch = true;
        }
      }
      if (catMatch === false) {
        passes = false;
      }
    }

    if (filters.sizes.length > 0 && passes) {
      let sizeMatch = false;
      for (let s = 0; s < filters.sizes.length; s++) {
        for (let ps = 0; ps < product.sizes.length; ps++) {
          if (product.sizes[ps] === filters.sizes[s]) {
            sizeMatch = true;
          }
        }
      }
      if (sizeMatch === false) {
        passes = false;
      }
    }

    if (filters.colors.length > 0 && passes) {
      let colorMatch = false;
      for (let c = 0; c < filters.colors.length; c++) {
        for (let pc = 0; pc < product.color.length; pc++) {
          if (product.color[pc].name === filters.colors[c]) {
            colorMatch = true;
          }
        }
      }
      if (colorMatch === false) {
        passes = false;
      }
    }

    if (passes) {
      filtered.push(product);
    }
  }

  return filtered;
}

function sortProducts(list) {
  let sortBy = document.querySelector("#sortSelect").value;
  let sorted = [];
  for (let i = 0; i < list.length; i++) {
    sorted.push(list[i]);
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    for (let j = 0; j < sorted.length - 1 - i; j++) {
      let swap = false;

      if (sortBy === "nameAZ") {
        if (sorted[j].name.localeCompare(sorted[j + 1].name) > 0) {
          swap = true;
        }
      } else if (sortBy === "nameZA") {
        if (sorted[j].name.localeCompare(sorted[j + 1].name) < 0) {
          swap = true;
        }
      } else if (sortBy === "priceLow") {
        if (sorted[j].price > sorted[j + 1].price) {
          swap = true;
        }
      } else if (sortBy === "priceHigh") {
        if (sorted[j].price < sorted[j + 1].price) {
          swap = true;
        }
      }

      if (swap) {
        let temp = sorted[j];
        sorted[j] = sorted[j + 1];
        sorted[j + 1] = temp;
      }
    }
  }

  return sorted;
}

function displayProducts(list) {
  let grid = document.querySelector("#productGrid");
  let noResults = document.querySelector("#noResults");
  grid.innerHTML = "";

  if (list.length === 0) {
    noResults.style.display = "block";
    return;
  }
  noResults.style.display = "none";

  for (let i = 0; i < list.length; i++) {
    let product = list[i];
    let card = document.createElement("div");
    card.className = "productCard";
    card.dataset.id = product.id;

    let cardHTML = "";
    cardHTML = cardHTML + "<div class='cardImage'>" + product.name + "</div>";
    cardHTML = cardHTML + "<div class='cardTitle'>" + product.name + "</div>";
    cardHTML = cardHTML + "<div class='cardPrice'>" + formatPrice(product.price) + "</div>";
    cardHTML = cardHTML + "<button class='cardBtn' data-id='" + product.id + "'>+ Add to Cart</button>";
    card.innerHTML = cardHTML;

    grid.appendChild(card);
  }
}

function displayActiveFilters() {
  let filters = getActiveFilters();
  let container = document.querySelector("#activeFilters");
  let clearBtn = document.querySelector("#clearAllBtn");
  container.innerHTML = "";

  let allFilters = [];
  for (let i = 0; i < filters.genders.length; i++) {
    if (filters.genders[i] === "womens") {
      allFilters.push("Female");
    } else {
      allFilters.push("Male");
    }
  }
  for (let i = 0; i < filters.categories.length; i++) {
    allFilters.push(filters.categories[i]);
  }
  for (let i = 0; i < filters.sizes.length; i++) {
    allFilters.push(filters.sizes[i]);
  }
  for (let i = 0; i < filters.colors.length; i++) {
    allFilters.push(filters.colors[i]);
  }

  if (allFilters.length > 0) {
    clearBtn.style.display = "inline-block";
    for (let i = 0; i < allFilters.length; i++) {
      let tag = document.createElement("span");
      tag.className = "filterTag";
      tag.textContent = allFilters[i] + " x";
      tag.dataset.filter = allFilters[i];
      tag.addEventListener("click", function() {
        removeFilter(tag.dataset.filter);
      });
      container.appendChild(tag);
    }
  } else {
    clearBtn.style.display = "none";
  }
}

function removeFilter(filterName) {
  let checkValue = filterName;
  if (filterName === "Female") {
    checkValue = "womens";
  } else if (filterName === "Male") {
    checkValue = "mens";
  }

  let allBoxes = document.querySelectorAll("#filter input[type='checkbox']");
  for (let i = 0; i < allBoxes.length; i++) {
    if (allBoxes[i].value === checkValue) {
      allBoxes[i].checked = false;
    }
  }
  applyFiltersAndDisplay();
}

function applyFiltersAndDisplay() {
  let filtered = filterProducts();
  let sorted = sortProducts(filtered);
  displayProducts(sorted);
  displayActiveFilters();
  document.querySelector("#resultCount").textContent = sorted.length + " Results";
}


function setupFilterListeners() {
  document.querySelector("#clearAllBtn").addEventListener("click", function() {
    let allBoxes = document.querySelectorAll("#filter input[type='checkbox']");
    for (let i = 0; i < allBoxes.length; i++) {
      allBoxes[i].checked = false;
    }
    applyFiltersAndDisplay();
  });
}


document.querySelector("#filter").addEventListener("click", function(e) {
  if (e.target.type === "checkbox") {
    applyFiltersAndDisplay();
  }
});


document.querySelector("#sortSelect").addEventListener("change", function() {
  applyFiltersAndDisplay();
});


function displaySingleProduct(product) {
  currentProduct = product;
  selectedSize = product.sizes[0];
  selectedColor = product.color[0].name;

  document.querySelector("#productTitle").textContent = product.name;
  document.querySelector("#productPrice").textContent = formatPrice(product.price);
  document.querySelector("#productDescription").textContent = product.description;
  document.querySelector("#productMaterial").textContent = product.material;
  document.querySelector("#quantityInput").value = 1;

  
  let genderDisplay = "Womens";
  if (product.gender === "mens") {
    genderDisplay = "Mens";
  }
  document.querySelector("#breadcrumb").innerHTML = "<a href='#'>Home</a> > " + genderDisplay + " > " + product.category + " > " + product.name;

  
  let sizesContainer = document.querySelector("#productSizes");
  sizesContainer.innerHTML = "";
  for (let i = 0; i < product.sizes.length; i++) {
    let btn = document.createElement("span");
    btn.className = "sizeBtn";
    btn.textContent = product.sizes[i];
    btn.dataset.size = product.sizes[i];
    if (product.sizes[i] === selectedSize) {
      btn.classList.add("selected");
    }
    btn.addEventListener("click", function() {
      selectedSize = btn.dataset.size;
      let allSizeBtns = document.querySelectorAll(".sizeBtn");
      for (let j = 0; j < allSizeBtns.length; j++) {
        allSizeBtns[j].classList.remove("selected");
      }
      btn.classList.add("selected");
    });
    sizesContainer.appendChild(btn);
  }

  
  let colorsContainer = document.querySelector("#productColors");
  colorsContainer.innerHTML = "";
  for (let i = 0; i < product.color.length; i++) {
    let swatch = document.createElement("span");
    swatch.className = "colorSwatch";
    swatch.style.backgroundColor = product.color[i].hex;
    swatch.dataset.color = product.color[i].name;
    swatch.title = product.color[i].name;
    if (product.color[i].name === selectedColor) {
      swatch.classList.add("selected");
    }
    swatch.addEventListener("click", function() {
      selectedColor = swatch.dataset.color;
      let allSwatches = document.querySelectorAll(".colorSwatch");
      for (let j = 0; j < allSwatches.length; j++) {
        allSwatches[j].classList.remove("selected");
      }
      swatch.classList.add("selected");
    });
    colorsContainer.appendChild(swatch);
  }

  document.querySelector("#addedNotification").style.display = "none";
}


document.querySelector("#addToCartBtn").addEventListener("click", function() {
  if (currentProduct === null) {
    return;
  }
  let qty = document.querySelector("#quantityInput").value * 1;
  if (qty < 1) {
    qty = 1;
  }
  addToCart(currentProduct, selectedSize, selectedColor, qty);

  let notification = document.querySelector("#addedNotification");
  notification.style.display = "block";
  notification.textContent = currentProduct.name + " added to cart!";
});

function addToCart(product, size, color, quantity) {
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id && cart[i].size === size && cart[i].color === color) {
      cart[i].quantity = cart[i].quantity + quantity;
      found = true;
    }
  }

  if (found === false) {
    let item = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: size,
      color: color,
      quantity: quantity,
      colorHex: ""
    };
    for (let c = 0; c < product.color.length; c++) {
      if (product.color[c].name === color) {
        item.colorHex = product.color[c].hex;
      }
    }
    cart.push(item);
  }

  updateCartCount();
}

function updateCartCount() {
  let totalItems = 0;
  for (let i = 0; i < cart.length; i++) {
    totalItems = totalItems + cart[i].quantity;
  }
  document.querySelector("#cartCount").textContent = totalItems;
}

function displayCart() {
  let rowsContainer = document.querySelector("#cartRows");
  let emptyMsg = document.querySelector("#emptyCartMsg");
  let tableWrap = document.querySelector("#cartTableWrap");
  let bottomSection = document.querySelector("#cartBottom");
  rowsContainer.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    tableWrap.style.display = "none";
    bottomSection.style.display = "none";
    return;
  }

  emptyMsg.style.display = "none";
  tableWrap.style.display = "block";
  bottomSection.style.display = "flex";

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    let subtotal = item.price * item.quantity;

    let row = document.createElement("div");
    row.className = "cartRow";

    let rowHTML = "";
    rowHTML = rowHTML + "<div class='cartItemInfo'>";
    rowHTML = rowHTML + "<button class='removeBtn' data-index='" + i + "'>-</button>";
    rowHTML = rowHTML + "<div class='cartItemImage'></div>";
    rowHTML = rowHTML + "<span>" + item.name + "</span>";
    rowHTML = rowHTML + "</div>";
    rowHTML = rowHTML + "<span><span class='cartColorBox' style='background-color:" + item.colorHex + ";'></span></span>";
    rowHTML = rowHTML + "<span>" + item.size + "</span>";
    rowHTML = rowHTML + "<span>" + formatPrice(item.price) + "</span>";
    rowHTML = rowHTML + "<span>" + item.quantity + "</span>";
    rowHTML = rowHTML + "<span>" + formatPrice(subtotal) + "</span>";

    row.innerHTML = rowHTML;
    rowsContainer.appendChild(row);
  }

  updateSummary();
}


function updateSummary() {
  let merchandise = 0;
  for (let i = 0; i < cart.length; i++) {
    merchandise = merchandise + (cart[i].price * cart[i].quantity);
  }

  let shippingType = document.querySelector("#shippingType").value;
  let destination = document.querySelector("#destination").value;
  let shipping = 0;

  if (merchandise > 500) {
    shipping = 0;
  } else if (shippingType === "standard") {
    if (destination === "canada") { shipping = 10; }
    else if (destination === "us") { shipping = 15; }
    else { shipping = 20; }
  } else if (shippingType === "express") {
    if (destination === "canada") { shipping = 25; }
    else if (destination === "us") { shipping = 25; }
    else { shipping = 30; }
  } else if (shippingType === "priority") {
    if (destination === "canada") { shipping = 35; }
    else if (destination === "us") { shipping = 50; }
    else { shipping = 50; }
  }

  let tax = 0;
  if (destination === "canada") {
    tax = merchandise * 0.05;
  }

  let total = merchandise + shipping + tax;

  document.querySelector("#merchandiseTotal").textContent = formatPrice(merchandise);
  document.querySelector("#shippingCost").textContent = formatPrice(shipping);
  document.querySelector("#taxAmount").textContent = formatPrice(tax);
  document.querySelector("#orderTotal").textContent = formatPrice(total);
}


document.querySelector("#shippingType").addEventListener("change", function() {
  updateSummary();
});

document.querySelector("#destination").addEventListener("change", function() {
  updateSummary();
});

document.querySelector("#checkoutBtn").addEventListener("click", function() {
  if (cart.length === 0) {
    return;
  }
  alert("Thank you for your purchase!");
  cart.length = 0;
  updateCartCount();
  showView("home");
});




document.querySelector("#productGrid").addEventListener("click", function(e) {
  if (e.target.className === "cardBtn") {
    let productId = e.target.dataset.id;
    for (let j = 0; j < products.length; j++) {
      if (products[j].id === productId) {
        let product = products[j];
        let defaultSize = product.sizes[0];
        let defaultColor = product.color[0].name;
        addToCart(product, defaultSize, defaultColor, 1);
      }
    }
    return;
  }

  let target = e.target;
  let card = null;
  while (target !== null && target !== e.currentTarget) {
    if (target.className === "productCard") {
      card = target;
      target = null;
    } else {
      target = target.parentNode;
    }
  }

  if (card !== null) {
    let clickedId = card.dataset.id;
    for (let j = 0; j < products.length; j++) {
      if (products[j].id === clickedId) {
        displaySingleProduct(products[j]);
        showView("singleproduct");
      }
    }
  }
});


document.querySelector("#cartRows").addEventListener("click", function(e) {
  if (e.target.className === "removeBtn") {
    let index = e.target.dataset.index * 1;
    let newCart = [];
    for (let i = 0; i < cart.length; i++) {
      if (i !== index) {
        newCart.push(cart[i]);
      }
    }
    cart.length = 0;
    for (let i = 0; i < newCart.length; i++) {
      cart.push(newCart[i]);
    }
    updateCartCount();
    displayCart();
  }
});


function setupCategoryCards() {
  let cards = document.querySelectorAll(".categoryCard");
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function() {
      let category = cards[i].dataset.category;
      let allBoxes = document.querySelectorAll("#filter input[type='checkbox']");
      for (let j = 0; j < allBoxes.length; j++) {
        allBoxes[j].checked = false;
      }
      let catBoxes = document.querySelectorAll(".filter-category");
      for (let j = 0; j < catBoxes.length; j++) {
        if (catBoxes[j].value === category) {
          catBoxes[j].checked = true;
        }
      }
      showView("browse");
    });
  }
}

buildFilters();
setupFilterListeners();
setupCategoryCards();
applyFiltersAndDisplay();

// ============================================================
// References
//localecompare method used for ascending and descending of (A-Z) site: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

// ============================================================
