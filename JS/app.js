document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('user-form');
    const productList = document.getElementById('product-list');
    const cartDiv = document.getElementById('cart');
    const searchBar = document.getElementById('search-bar');
    const productDiv = document.getElementById('products');
    const cartItemsUl = document.getElementById('cart-items');
    const totalP = document.getElementById('total');

    const productos = [
        { nombre: "FERNET", precio: 12000, stock: 6, img: 'img/fernet.jpg' },
        { nombre: "SMIRNOFF", precio: 7000, stock: 12, img: 'img/smirnoff.jpg' },
        { nombre: "WHISKY", precio: 10700, stock: 4, img: 'img/whisky.jpg' },
        { nombre: "GANCIA", precio: 4500, stock: 10, img: 'img/gancia.jpg' }
    ];

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let totalCompra = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    const displayProducts = (productos) => {
        productDiv.innerHTML = '';
        productos.forEach(producto => {
            let card = document.createElement('div');
            card.classList.add('col-md-3', 'mb-4');
            card.innerHTML = `
                <div class="card">
                    <img src="${producto.img}" class="card-img-top product-img" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">Precio: $${producto.precio}</p>
                        <p class="card-text">Stock: ${producto.stock}</p>
                        <input type="number" min="1" max="${producto.stock}" class="form-control mb-2" placeholder="Cantidad" id="quantity-${producto.nombre}">
                        <button class="btn btn-success btn-block add-to-cart" data-name="${producto.nombre}">Agregar al carrito</button>
                    </div>
                </div>
            `;
            productDiv.appendChild(card);
        });
    };

    const displayCart = () => {
        cartItemsUl.innerHTML = '';
        carrito.forEach((item, index) => {
            let li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.innerHTML = `
                ${item.cantidad} x ${item.nombre} - $${item.precio}
                <span class="remove-item badge badge-danger badge-pill" data-index="${index}">Eliminar</span>
            `;
            cartItemsUl.appendChild(li);
        });
        totalP.textContent = `Total: $${totalCompra}`;
    };

    const updateLocalStorage = () => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    };

    document.getElementById('submit-user').addEventListener('click', () => {
        const nombre = document.getElementById('nombre').value.trim().toUpperCase();
        const edad = parseInt(document.getElementById('edad').value);

        if (nombre && !isNaN(edad) && edad >= 18) {
            alert(`¡Bienvenido ${nombre}!`);
            userForm.style.display = 'none';
            productList.style.display = 'block';
            cartDiv.style.display = 'block';
            displayProducts(productos);
            displayCart();
        } else {
            alert('Por favor, ingrese un nombre válido y asegúrese de ser mayor de edad.');
        }
    });

    searchBar.addEventListener('input', () => {
        const searchString = searchBar.value.trim().toUpperCase();
        const filteredProducts = productos.filter(producto => {
            return producto.nombre.toUpperCase().includes(searchString);
        });
        displayProducts(filteredProducts);
    });

    document.getElementById('products').addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productName = event.target.dataset.name;
            const productQuantity = parseInt(document.getElementById(`quantity-${productName}`).value);
    
            let producto = productos.find(p => p.nombre === productName);
    
            if (producto && !isNaN(productQuantity) && productQuantity > 0 && productQuantity <= producto.stock) {
                producto.stock -= productQuantity; // Actualizar el stock del producto
    
                let itemInCart = carrito.find(item => item.nombre === producto.nombre);
                if (itemInCart) {
                    itemInCart.cantidad += productQuantity;
                } else {
                    carrito.push({ nombre: producto.nombre, precio: producto.precio, cantidad: productQuantity });
                }
                totalCompra += producto.precio * productQuantity;
                updateLocalStorage();
                displayCart();
    
                // Actualizar la cantidad disponible del producto en la interfaz
                displayProducts(productos);
            } else {
                alert('Cantidad inválida o no hay suficiente stock.');
            }
        }
    });

    document.getElementById('cart-items').addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const index = event.target.dataset.index;
            const item = carrito[index];
            if (item.cantidad > 1) {
                item.cantidad -= 1;
                totalCompra -= item.precio;
                productos.find(p => p.nombre === item.nombre).stock += 1;
            } else {
                productos.find(p => p.nombre === item.nombre).stock += item.cantidad;
                totalCompra -= item.precio * item.cantidad;
                carrito.splice(index, 1);
            }
            updateLocalStorage();
            displayCart();
        }
    });

    document.getElementById('checkout').addEventListener('click', () => {
        if (carrito.length > 0) {
            alert(`El total de su compra es $${totalCompra}. Gracias por su compra!`);
            carrito = [];
            totalCompra = 0;
            localStorage.removeItem('carrito');
            displayCart();
        } else {
            alert('El carrito está vacío.');
        }
    });

    // Inicializar la vista
    if (carrito.length > 0) {
        userForm.style.display = 'none';
        productList.style.display = 'block';
        cartDiv.style.display = 'block';
        displayProducts(productos);
        displayCart();
    }
});