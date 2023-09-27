document.getElementById('product-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const sold = document.getElementById('sold').value === "true";
  
    const response = await fetch('https://git.heroku.com/thawing-journey-41823.git/add-item', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, quantity, price, sold })
    });
  
    const result = await response.json();
    console.log(result);
    loadProducts(); // Reload products after adding a new one
  });
  
  async function loadProducts() {
    const response = await fetch('https://git.heroku.com/thawing-journey-41823.git/get-items');
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
  }
  
  async function deleteProduct(productId) {
    await fetch(`https://git.heroku.com/thawing-journey-41823.git/${productId}`, {method: 'DELETE'});
    loadProducts(); // Reload products after deletion
  }
  
  async function editProduct(productId) {
    const newName = prompt('Enter new product name:');
    await fetch(`https://git.heroku.com/thawing-journey-41823.git/${productId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: newName})
    });
    loadProducts(); // Reload products after editing
  }
  
  // Load products on initial page load
  loadProducts();
  
  