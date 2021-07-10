import './sass/main.scss';
import galleryItemTpl from './templates/galleryItemTpl.hbs';
import refs from './js/refs.js';
import ApiService from './js/apiService.js';
import notification from './js/notification.js';
import * as basicLightbox from 'basiclightbox';

const apiService = new ApiService();
refs.loader.classList.add('hide');
refs.form.addEventListener('submit', handleBtnSubmit);

function handleBtnSubmit(event) {
    event.preventDefault();
    refs.loader.classList.add('hide');
    apiService.query = event.currentTarget.elements.query.value;

    if (apiService.query.trim() === '') {
        return refs.input.classList.add('invalid');
    }
    refs.input.classList.remove('invalid');
    apiService.resetPage();
    clearContainer();
    fetchImages();
    refs.input.value = '';

    const ioCallback = (entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            fetchImages();
        })
    };

    const observer = new IntersectionObserver(ioCallback, { threshold: 0.2 });

    observer.observe(refs.anchor);

};

function fetchImages() {
    refs.loader.classList.remove('hide');
    apiService.fetchImages()
        .then(images => {
            appendImagesMarkup(images);
            refs.loader.classList.add('hide');
        })
        .catch(() => {
            notification.fetchError();
        });
}

function appendImagesMarkup(images) {
    refs.imagesContainer.insertAdjacentHTML('beforeend', galleryItemTpl(images));
}

function clearContainer() {
    refs.imagesContainer.innerHTML = '';
}

refs.imagesContainer.onclick = (e) => {

    const instance = basicLightbox.create(`
		<img src="${e.target.alt}">
	`);
    instance.show(e);
}