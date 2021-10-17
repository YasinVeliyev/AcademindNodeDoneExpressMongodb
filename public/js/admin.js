const deleteProduct = elem => {
    let csrf = document.querySelector("[name='_csrf']").value;
    let productId = document.querySelector("[name='id']").value;
    fetch(`/admin/product/${productId}`, {
        method: "DELETE",
        headers: { "csrf-token": csrf },
    })
        .then(result => {
            elem.closest("article").parentElement.removeChild(elem.closest("article"));
            return result.json();
        })
        .then(data => console.log(data))
        .catch(err => console.error(err));
};
