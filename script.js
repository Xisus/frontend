async function addProduct() {
    const name = document.getElementById('name').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const sold = document.getElementById('sold').value === "true";

    try {
        const response = await fetch('https://skull-rush-88e0ddb4adf5.herokuapp.com/add-item', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, quantity, price, sold })
        });

        const result = await response.json();
        console.log(result);
        loadProducts(); // Reload products after adding a new one

        document.getElementById('product-form').reset();

    } catch (error) {
        console.error('Error during fetch operation: ', error);
    }
}

async function loadProductOptions() {
    try {
        const response = await fetch('https://your-server.com/get-product-list');
        const products = await response.json();
        const select = document.getElementById('name');
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error during fetch operation: ', error);
    }
}


async function loadProducts() {
    try {
        const response = await fetch('https://skull-rush-88e0ddb4adf5.herokuapp.com/get-items');
        const products = await response.json();
        const tbody = document.querySelector("#product-table tbody");
        tbody.innerHTML = "";

        products.forEach(product => {
            const row = tbody.insertRow();
            row.insertCell().textContent = product.name;
            row.insertCell().textContent = product.quantity;
            row.insertCell().textContent = product.price;
            row.insertCell().textContent = product.sold ? "Bizum" : "Efectivo";

            const actionsCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = function() { deleteProduct(product._id); };
            actionsCell.appendChild(deleteButton);

            /*const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = function() { editProduct(product._id); };
            actionsCell.appendChild(editButton);*/
        });
    } catch (error) {
        console.error('Error during fetch operation: ', error);
    }
}

async function deleteProduct(productId) {
    // Show a confirmation dialog
    const isConfirmed = confirm('Are you sure you want to delete this product?');

    // Proceed with deletion if the user clicked "OK"
    if (isConfirmed) {
        try {
            await fetch(`https://skull-rush-88e0ddb4adf5.herokuapp.com/delete-item/${productId}`, {method: 'DELETE'});
            loadProducts(); // Reload products after deletion
        } catch (error) {
            console.error('Error during fetch operation: ', error);
        }
    } else {
        console.log('Deletion cancelled by user.');
    }
}


async function editProduct(productId) {
    const newName = prompt('Enter new product name:');
    try {
        await fetch(`https://skull-rush-88e0ddb4adf5.herokuapp.com/edit-item/${productId}`, {
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
window.onload = function() {
    loadProducts();
    loadProductOptions();
};


  