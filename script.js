async function addProduct() {
    const name = document.getElementById('name').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    if (!name || isNaN(quantity) || isNaN(price)) {
        alert('Porfavor no te olvides nada!');
        return; // Exit the function if any field is empty
    }

    try {
        const response = await fetch('https://skull-rush-88e0ddb4adf5.herokuapp.com/add-item', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, quantity, price })
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

            const actionsCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = function() { deleteProduct(product._id); };
            actionsCell.appendChild(deleteButton);

            const checkboxCell = row.insertCell();
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; // Set type to checkbox
            checkbox.className = 'row-checkbox'; // Set class name for styling or selecting
            checkbox.value = product.id; // Set value to product id or other identifier
            checkboxCell.appendChild(checkbox);

            /*const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = function() { editProduct(product._id, product.sold ? 'Jesus' : 'Luis'); };
            actionsCell.appendChild(editButton);*/
        });
        addCheckboxListeners();
        updateStats(products);
    } catch (error) {
        console.error('Error during fetch operation: ', error);
    }
}

function updateStats(products) {
    let totalStock = 72;
    let productsSold = 0;
    let totalBenefit = -347.02;

    products.forEach(product => {
        totalStock -= product.quantity;  // Assuming 'quantity' represents stock
        if (product.price) {
            productsSold += product.quantity;  // Count sold products
            totalBenefit += product.price * product.quantity;  // Calculate benefit
        }
    });

    const benefitElement = document.getElementById('total-benefit');
    const euroSymbolElement = document.getElementById('euro');

    // Update HTML elements with calculated values
    document.getElementById('total-stock').textContent = totalStock;
    document.getElementById('products-sold').textContent = productsSold;
    document.getElementById('total-benefit').textContent = totalBenefit.toFixed(2);  // Rounded to 2 decimal places

    if (totalBenefit >= 0) {
        benefitElement.className = 'positive';  // Apply positive class if benefit is non-negative
        euroSymbolElement.className = 'positive';  // Apply positive class to euro symbol as well
    } else {
        benefitElement.className = 'negative';  // Apply negative class if benefit is negative
        euroSymbolElement.className = 'negative';  // Apply negative class to euro symbol as well
    }
}

async function deleteProduct(productId) {
    // Show a confirmation dialog
    const isConfirmed = confirm('¿Seguro que quiere eliminar?');

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

function addCheckboxListeners() {
    document.querySelectorAll('.row-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const isConfirmed = confirm('Seguro que quieres modificar el Pago?');
            if (isConfirmed) {
                const productId = this.value;
                const isChecked = this.checked;

                updateCheckboxState(productId, isChecked);
                if (this.checked) {
                    // Handle checkbox being checked, if necessary
                    console.log(`Checkbox for product ${productId} is checked.`);
                } else {
                    // Handle checkbox being unchecked, if necessary
                    console.log(`Checkbox for product ${productId} is unchecked.`);
                }
            } else {
                // If the user cancels the action, revert the checkbox state
                this.checked = !this.checked;
            }
        });
    });
}


function updateCheckboxState(productId, isChecked) {
    // Log the values being sent to ensure they're correct
    console.log('Updating checkbox state:', productId, isChecked);

    fetch('https://your-server-address/update-checkbox-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, isChecked })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the server response for debugging
        if (!data.success) {
            // Handle the error on client side if the server responds with success: false
            console.error('Failed to update checkbox state:', data.message);
        }
    })
    .catch(err => console.error('Error sending request:', err));
}




/*async function editProduct(productId, currentPago) {
    const isConfirmed = confirm('¿Quieres cambiar el pago?');
    if (!isConfirmed) return;

    const newPago = currentPago === 'Jesus' ? 'Luis' : 'Jesus'; // Toggle

    try {
        await fetch(`https://skull-rush-88e0ddb4adf5.herokuapp.com/edit-item/${productId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ sold: newPago === 'Jesus' ? true : false }) // Adjust based on server's expected format
        });
        loadProducts(); // Reload products after editing
    } catch (error) {
        console.error('Error during fetch operation: ', error);
    }
}*/



// Load products on initial page load
window.onload = function() {
    loadProducts();
    loadProductOptions();
};


  