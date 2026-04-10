const jsonText = document.querySelector("#productData").textContent;
const products = JSON.parse(jsonText);

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

document.querySelector("#cartLink").addEventListener("click", function() {
  showView("cart");
});

function updateCartCount() {
  let totalItems = 0;
  for (let i = 0; i < cart.length; i++) {
    totalItems = totalItems + cart[i].quantity;
  }
  document.querySelector("#cartCount").textContent = totalItems;
}

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
function buildFilters() {
  let categories = [];
  let sizes = [];
  let colors = [];

  for (let i = 0; i < products.length; i++) {
    let product = products[i];

    let catFound = false;
    for (let j = 0; j < categories.length; j++) {
      if (categories[j] === product.category) { catFound = true; }
    }
    if (catFound === false) { categories.push(product.category); }

  }

  categories.sort();
  let catHTML = "";
  for (let i = 0; i < categories.length; i++) {
    catHTML = catHTML + "<label><input type='checkbox' value='" + categories[i] + "' class='filter-category'> " + categories[i] + "</label>";
  }
  document.querySelector("#categoryFilters").innerHTML = catHTML;

}

function sortProducts(list) {
  let sortBy = document.querySelector("#sortSelect").value;
  let sorted = [];
  for (let i = 0; i < list.length; i++) { sorted.push(list[i]); }

  if (sortBy === "name") {
    sorted.sort(function(a, b) {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  } else if (sortBy === "priceLow") {
    sorted.sort(function(a, b) { return a.price - b.price; });
  } else if (sortBy === "priceHigh") {
    sorted.sort(function(a, b) { return b.price - a.price; });
  }
  return sorted;
}

function displayActiveFilters() {
  let tag = document.createElement("span");
  tag.className = "filterTag";
  tag.textContent = allFilters[i] + " x";
  tag.addEventListener("click", function() { removeFilter(tag.dataset.filter); });
}

function removeFilter(filterName) {

}

document.querySelector("#clearAllBtn").addEventListener("click", function() {
  let allBoxes = document.querySelectorAll("#filter input[type='checkbox']");
  for (let i = 0; i < allBoxes.length; i++) { allBoxes[i].checked = false; }
  applyFiltersAndDisplay();
});

function displayCart() {
 
  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    tableWrap.style.display = "none";
    bottomSection.style.display = "none";
    return;
  }

}

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

