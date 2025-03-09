const socket = io();

const formularioAgregarProducto = document.getElementById("form-agregar-producto");

formularioAgregarProducto.addEventListener("submit", (e) => {
    e.preventDefault();

    const datosFormulario = new FormData(formularioAgregarProducto);
    const productoDatos = {};

    datosFormulario.forEach((value, key) => {
        productoDatos[key] = value;
    });
    console.log("Enviando producto:", productoDatos);
    socket.emit("nuevoProducto", productoDatos);

    formularioAgregarProducto.reset();

    const modal = bootstrap.Modal.getInstance(document.getElementById("agregarProductoModal"));
    if (modal) {
        modal.hide();
    }
});

socket.on("productoAgregado", (nuevoProducto) => {
    const contenedorProductos = document.getElementById("contenedorDeProductos");

    const productoDiv = document.createElement("div");
    productoDiv.classList.add("card", "m-2", "d-flex", "flex-column");
    productoDiv.style.width = "18rem";
    productoDiv.style.minHeight = "400px";
    productoDiv.id = `producto${nuevoProducto.id}`;

    productoDiv.innerHTML = `
        <img src="${nuevoProducto.urlImagen}" class="card-img-top" alt="Imagen del producto" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column" style="flex-grow: 1;">
            <h5 class="card-title">${nuevoProducto.titulo}</h5>
            <p class="card-text">${nuevoProducto.descripcion}</p>
            <p><span>Precio:</span> ${nuevoProducto.precio}</p>
            <div class="d-flex align-items-center justify-content-center mt-auto ">
                <button type="button" class="btn btn-personalized-2 fw-bold" id="boton-registrarse"
                    data-bs-toggle="modal" data-bs-target="#editar${nuevoProducto.id}ProductoModal">
                    Editar
                </button>
                <!-- Modal Editar Producto-->
                <section class="modal fade" id="editar${nuevoProducto.id}ProductoModal" tabindex="-1" aria-labelledby="editar${nuevoProducto.id}ProductoModal" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header bg-color-principal">
                                <h5 class="modal-title text-white" id="editar${nuevoProducto.id}ProductoModal">Editar Producto</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body bg-color-fondo">
                                <form id="editar${nuevoProducto.id}Producto" action="http://localhost:8081/user" method="POST">
                                    <div class="mb-3">
                                        <label for="editar${nuevoProducto.id}tituloProducto" class="form-label fw-bolder">Titulo</label>
                                        <input type="text" class="form-control bg-input" id="editar${nuevoProducto.id}tituloProducto" 
                                        placeholder="Ingrese titulo del producto" value="${nuevoProducto.titulo}" minlength="3" maxlength="25" name="titulo" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="editar${nuevoProducto.id}descripcionProducto" class="form-label fw-bolder">Descripción producto</label>
                                        <textarea class="form-control bg-input" id="editar${nuevoProducto.id}descripcionProducto" rows="3" placeholder="Ingrese la descripción del producto">${nuevoProducto.descripcion}</textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label for="editar${nuevoProducto.id}precioProducto" class="form-label fw-bolder">Precio</label>
                                        <input type="number" class="form-control bg-input" id="editar${nuevoProducto.id}precioProducto" 
                                        placeholder="Ingrese el precio" value="${nuevoProducto.precio}" min="1" name="precio" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="editar${nuevoProducto.id}categoriaProducto" class="form-label fw-bolder">Categoria</label>
                                        <input type="text" class="form-control bg-input" id="editar${nuevoProducto.id}categoriaProducto" 
                                        placeholder="Ingrese categoria del producto" value="${nuevoProducto.categoria}" minlength="3" maxlength="25" name="categoria" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="editar${nuevoProducto.id}codigoProducto" class="form-label fw-bolder">Codigo</label>
                                        <input type="text" class="form-control bg-input" id="editar${nuevoProducto.id}codigoProducto" 
                                        placeholder="Ingrese codigo del producto" value="${nuevoProducto.codigo}" minlength="3" maxlength="25" name="codigo" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="editar${nuevoProducto.id}stockProducto" class="form-label fw-bolder">Stock</label>
                                        <input type="number" class="form-control bg-input" id="editar${nuevoProducto.id}stockProducto" 
                                        placeholder="Ingrese el stock" value="${nuevoProducto.stock}" min="1" name="stock" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="editar${nuevoProducto.id}urlImagenProducto" class="form-label fw-bolder">Url Imagen</label>
                                        <input type="text" class="form-control bg-input" id="editar${nuevoProducto.id}urlImagenProducto" 
                                        placeholder="Ingrese la URL Imagen" value="${nuevoProducto.urlImagen}" minlength="3" name="urlImagen" required />
                                    </div>
                                    <div class="d-flex align-items-center justify-content-center">
                                        <button type="submit" id="botonRegistrarse" class="btn btn-personalized-3 mx-1 fw-bold" aria-label="Agregar">Agregar</button>
                                        <button type="reset" class="btn btn-personalized-1 mx-1 fw-bold" aria-label="Cancelar">Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <button class="btn btn-personalized-1 m-1 fw-bold" onclick="eliminarProducto(${nuevoProducto.id})">Eliminar</button>
            </div>
        </div>
    `;
    contenedorProductos.appendChild(productoDiv);
});


function eliminarProducto(productId) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            socket.emit("eliminarProducto", productId);
        }
    });
}

socket.on("productoEliminado", (productoId) => {
    const productoElement = document.getElementById(`producto${productoId}`);
    if (productoElement) {
        productoElement.remove();
        Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
    }
});

socket.on("productoRemovido", (productoId) => {
    const productoElement = document.getElementById(`producto${productoId}`);
    if (productoElement) {
        productoElement.remove();
    }
});

