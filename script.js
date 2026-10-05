function Category(id, name) {
    this.id = id;
    this.name = name;
}

function Product(id, name, categoryId) {
    this.id = id;
    this.name = name;
    this.categoryId = categoryId;
}

let categories = [
    new Category(1, "Електроніка"),
    new Category(2, "Книги"),
    new Category(3, "Посуд (порожня)")
];

let products = [
    new Product(101, "Ноутбук", 1),
    new Product(102, "Смартфон", 1),
    new Product(103, "Підручник JS", 2)
];

Array.prototype.hasLinkedProduct = function(categoryId, index) {
    index = index ?? 0;

    if (index >= this.length) {
        return false;
    }

    if (this[index].categoryId === categoryId) {
        return true;
    }

    return this.hasLinkedProduct(categoryId, index + 1);
};

Array.prototype.removeById = function(id) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].id === id) {
            this.splice(i, 1);
            return true;
        }
    }
    return false;
};

Array.prototype.findById = function(id, index) {
    index = index ?? 0;

    if (index >= this.length) {
        return null;
    }

    if (this[index].id === id) {
        return this[index];
    }

    return this.findById(id, index + 1);
};

const categoriesBody = document.getElementById("categoriesBody");
const productsBody = document.getElementById("productsBody");

function renderCategories() {
    categoriesBody.innerHTML = "";

    for (let i = 0; i < categories.length; i++) {
        let cat = categories[i];
        let row = document.createElement("tr");

        let tdId = document.createElement("td");
        tdId.textContent = cat.id;

        let tdName = document.createElement("td");
        tdName.textContent = cat.name;
        tdName.className = "editable";
        tdName.onclick = function() {
            makeEditable(tdName, cat, "name");
        };

        let tdDel = document.createElement("td");
        tdDel.textContent = "✖";
        tdDel.className = "delete-btn";
        tdDel.onclick = function() {
            deleteCategory(cat.id);
        };

        row.appendChild(tdId);
        row.appendChild(tdName);
        row.appendChild(tdDel);
        categoriesBody.appendChild(row);
    }
}

// Відображення товарів
function renderProducts() {
    productsBody.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        let prod = products[i];
        let row = document.createElement("tr");

        let tdId = document.createElement("td");
        tdId.textContent = prod.id;

        let tdName = document.createElement("td");
        tdName.textContent = prod.name;
        tdName.className = "editable";
        tdName.onclick = function() {
            makeEditable(tdName, prod, "name");
        };

        let tdCatId = document.createElement("td");
        tdCatId.textContent = prod.categoryId;

        let tdDel = document.createElement("td");
        tdDel.textContent = "✖";
        tdDel.className = "delete-btn";
        tdDel.onclick = function() {
            deleteProduct(prod.id);
        };

        row.appendChild(tdId);
        row.appendChild(tdName);
        row.appendChild(tdCatId);
        row.appendChild(tdDel);
        productsBody.appendChild(row);
    }
}

// Видалення категорії з перевіркою зв'язку через метод масиву
function deleteCategory(categoryId) {
    if (products.hasLinkedProduct(categoryId)) {
        alert("Помилка! Дані використовуються в іншій таблиці, тому наразі видалити їх неможливо.");
        return;
    }

    categories.removeById(categoryId);
    renderCategories();
}

// Видалення товару
function deleteProduct(productId) {
    products.removeById(productId);
    renderProducts();
}

// Редагування комірки по кліку
function makeEditable(cell, entity, field) {
    if (cell.querySelector("input")) {
        return;
    }

    let input = document.createElement("input");
    input.type = "text";
    input.value = entity[field];

    cell.textContent = "";
    cell.appendChild(input);
    input.focus();

    function applyChange() {
        let value = input.value.trim();
        entity[field] = value.length > 0 ? value : entity[field];
        cell.textContent = entity[field];
    }

    input.onblur = function() {
        applyChange();
    };

    input.onkeydown = function(e) {
        if (e.key === "Enter") {
            input.blur();
        }
    };
}

renderCategories();
renderProducts();