document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('productForm');
    const productList = document.getElementById('productList');

    function loadProducts() {
        fetch('http://thawing-journey-41823.herokuapp.com/products')
            .then(response => response.json())
            .then(data => {
                productList.innerHTML = '';  // Clear the list first
                data.forEach(product => addProductToTable(product));
            });
    }

    loadProducts();

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const product = {
            name: document.getElementById('productName').value,
            quantity: document.getElementById('quantity').value,
            price: document.getElementById('price').value,
            paid: document.getElementById('paid').checked
        };

        if (form.getAttribute('data-editing')) {
            updateProduct(form.getAttribute('data-editing'), product);
        } else {
            addProduct(product);
        }
    });

    productList.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('edit-btn')) {
            const productId = e.target.getAttribute('data-id');
            fetch(`http://thawing-journey-41823.herokuapp.com/products/${productId}`)
                .then(response => response.json())
                .then(product => {
                    document.getElementById('productName').value = product.name;
                    document.getElementById('quantity').value = product.quantity;
                    document.getElementById('price').value = product.price;
                    document.getElementById('paid').checked = product.paid;

                    form.setAttribute('data-editing', productId);
                });
        }
    });

    function addProductToTable(product) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
            <td>${product.paid ? 'Yes' : 'No'}</td>
            <td><button class="edit-btn" data-id="${product._id}">Edit</button></td>
        `;
        productList.appendChild(row);
    }

    function addProduct(product) {
        fetch('http://thawing-journey-41823.herokuapp.com/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
            loadProducts();
        });
    }

    function updateProduct(productId, updatedProduct) {
        fetch(`http://thawing-journey-41823.herokuapp.com/update/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
            form.removeAttribute('data-editing');
            loadProducts();
        });
    }
});
