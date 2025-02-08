let inputs = document.querySelectorAll("input"); 
let btn = document.querySelector('#form-section button'); 
let productsRow = document.querySelector("#card-section .row"); 
let editMode = false; 
let editIndex = null;  

// جلب المنتجات من localStorage أو تهيئة مصفوفة جديدة
let products = JSON.parse(localStorage.getItem('products')) || []; 

// دالة تنظيف المدخلات
function clearInputs() {
    inputs.forEach((input) => {
        input.value = '';
    });
    inputs[5].checked = false;
}

// دالة إنشاء/تعديل المنتج
function createProduct() {
    // التحقق من أن جميع الحقول ممتلئة
    if (
        inputs[0].value.trim() === "" ||
        inputs[1].value.trim() === "" ||
        inputs[2].value.trim() === "" ||
        inputs[3].value.trim() === "" ||
        inputs[4].value.trim() === ""
    ) {
        alert("Please enter product information !");
        return;
    }
    const product = {
        title: inputs[0].value,
        description: inputs[1].value,
        amount: inputs[2].value,
        price: inputs[3].value,
        image: inputs[4].value,
        sale: inputs[5].checked,
    };
    if (editMode) {
        products[editIndex] = product;
        btn.classList.replace("warning-btn", "create-btn");
        btn.innerText = "Submit";
        editIndex = null;
        editMode = false;
    } else {
        products.push(product);
    }
    localStorage.setItem("products", JSON.stringify(products));
    clearInputs();
    readProducts();
}
// دالة عرض المنتجات
function readProducts() {
    productsRow.innerHTML = '';

    products.forEach((element, index) => {
        let discountedPrice = (element.sale) ? (element.price * 0.8).toFixed(2) : element.price; // خصم 20%
        let priceHTML = element.sale 
            ? `<p class="card-text">Price: <span style="text-decoration: line-through; color: gray;">${element.price}$</span> 
                <span>${discountedPrice}$</span></p>` 
            : `<p class="card-text">Price: ${element.price}$</p>`;

        productsRow.innerHTML += `
            <div class="col-lg-4 col-md-6 mb-20">
                <div class="card">
                    <img src="${element.image}" alt="" class="card-img-top"/>
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text">${element.description}</p>
                        ${priceHTML}
                        <p class="card-text">Amount: ${element.amount} units</p>
                        <div class="text-center">
                            <button class="btn1" onclick='editProducts(${index})'>
                                <i class="fa-regular fa-pen-to-square"></i> Edit
                            </button>
                            <button class="btn2" onclick='deleteProducts(${index})'>
                                <i class="fa-regular fa-trash-can"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}
// دالة حذف المنتج
function deleteProducts(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    readProducts();
}

// دالة تعديل المنتج
function editProducts(index) {
    inputs[0].value = products[index].title;
    inputs[1].value = products[index].description;
    inputs[2].value = products[index].amount;
    inputs[3].value = products[index].price;
    inputs[4].value = products[index].image;
    inputs[5].checked = products[index].sale;
    
    btn.classList.replace('create-btn', "warning-btn");
    btn.innerText = "Edit";
    
    editIndex = index;
    editMode = true;
}

readProducts();
btn.addEventListener('click', createProduct);
