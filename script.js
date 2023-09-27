async function addProduct() {
    const name = document.getElementById('name').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const sold = document.getElementById('sold').value === "true";

    try {
        const response = await fetch('https://skull-rush.herokuapp.com/add-item', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, quantity, price, sold })
        });

        const result = await response.json();
        console.log(result);
        loadProducts(); // Reload products after adding a new one
    } catch (error) {
        console.error('Error during fetch operation: ', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch('https://skull-rush.herokuapp.com/get-items');
        const products = await response.json();
        const tbody = document.querySelector("#product-table tbody");
        tbody.innerHTML = "";

        products.forEach(product => {
            const row = tbody.insertRow();
            row.insertCell().textContent = product.name;
            row.insertCell().textContent = product.quantity;
            row.insertCell().textContent = product.price;
            row.insertCell().textContent = product.sold ? "Yes" : "No";

            const actionsCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() { deleteProduct(product._id); };
            actionsCell.appendChild(deleteButton);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = function() { editProduct(product._id); };
            actionsCell.appendChild(editButton);
        });
    } catch (error) {
        console.error('Error during fetch operation: ', error);
    }
}

async function deleteProduct(productId) {
    try {
        await fetch(`https://skull-rush.herokuapp.com/delete-item/${productId}`, {method: 'DELETE'});
        loadProducts(); // Reload products after deletion
    } catch (error) {
        console.error('Error during fetch operation: ', error);
    }
}

async function editProduct(productId) {
    const newName = prompt('Enter new product name:');
    try {
        await fetch(`https://skull-rush.herokuapp.com/edit-item/${productId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: newName})
        });
        loadProducts(); // Reload products after editing
    } catch (error) {
        console.error('Error during fetch operation: ', error);
    }
}

// Load products on initial page load
window.onload = loadProducts;

  