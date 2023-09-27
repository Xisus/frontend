document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = document.getElementById('itemForm');
    
    // Check if we are in edit mode
    if(form.dataset.isEdit) {
        // Update the existing item
        updateItem(form.dataset.rowIndex);
    } else {
        // Add new item
        addItem();
    }
    
    // Clear form
    form.reset();
    form.dataset.isEdit = '';
    form.dataset.rowIndex = '';
});

function addItem() {
    // Get values
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = document.getElementById('itemQuantity').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const itemPaid = document.getElementById('itemPaid').checked;

    // Add to table
    const row = document.createElement('tr');
    row.innerHTML = createRowHTML(itemName, itemQuantity, itemPrice, itemPaid);
    document.querySelector('#itemList tbody').appendChild(row);
}

function createRowHTML(itemName, itemQuantity, itemPrice, itemPaid) {
    return `
        <td>${itemName}</td>
        <td>${itemQuantity}</td>
        <td>${itemPrice}</td>
        <td>${itemPaid ? 'Yes' : 'No'}</td>
        <td>
            <button onclick="editItem(this)">Edit</button>
            <button onclick="removeItem(this)">Remove</button>
        </td>
    `;
}

function removeItem(button) {
    button.parentElement.parentElement.remove();
}

function editItem(button) {
    const row = button.parentElement.parentElement;
    const columns = row.children;

    // Populate form with item data
    document.getElementById('itemName').value = columns[0].textContent;
    document.getElementById('itemQuantity').value = columns[1].textContent;
    document.getElementById('itemPrice').value = columns[2].textContent;
    document.getElementById('itemPaid').checked = columns[3].textContent === 'Yes';

    // Set the form to edit mode
    const form = document.getElementById('itemForm');
    form.dataset.isEdit = 'true';
    form.dataset.rowIndex = Array.from(row.parentElement.children).indexOf(row);
}

function updateItem(rowIndex) {
    // Get the updated values from form
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = document.getElementById('itemQuantity').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const itemPaid = document.getElementById('itemPaid').checked;

    // Get the row to be updated and set the new values
    const row = document.querySelector('#itemList tbody').children[rowIndex];
    row.innerHTML = createRowHTML(itemName, itemQuantity, itemPrice, itemPaid);
}
