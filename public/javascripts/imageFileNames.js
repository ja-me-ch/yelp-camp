const fileInput = document.getElementById('imageInput');
const ul = document.getElementById('image-file-list');
const imagePreview = document.getElementById('image-preview');

const updateImagePreview = function (event) {
    imagePreview.replaceChildren();
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const src = URL.createObjectURL(files[i]);
        const img = document.createElement('img');
        img.src = src;
        img.title = files[i].name;
        img.classList.add('img-fluid');
        img.classList.add('img-thumbnail');
        img.style.width = '6.5em';
        img.style.height = '6.5em';
        img.style.objectFit = 'cover'

        const span = document.createElement('span');
        span.innerText = files[i].name;
        span.style.fontSize = '0.7em';

        const div = document.createElement('div');
        div.classList.add('d-flex');
        div.classList.add('flex-column');
        div.classList.add('mb-3');
        div.classList.add('text-truncate');
        div.classList.add('d-inline-block');
        div.classList.add('text-center')
        div.classList.add('align-items-center');
        div.appendChild(img);
        div.appendChild(span);
        div.style.width = '7em';
        div.style.maxWidth = '8em';
        div.style.maxHeight = '8em';
        div.style.height = '8em';
        imagePreview.appendChild(div);
    }

}


if (fileInput) {
    fileInput.addEventListener('change', updateImagePreview);
}
