import fetchImages from './fetchData';
import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
	inputEl: document.querySelector('input'),
	btnEl: document.querySelector('.btn'),
	listEl: document.querySelector('.gallery'),
	btnLoaderEl: document.querySelector('.btn-load'),
};

let searchKey = null;
let totalHits = null;
let counter = 1;

function inputValue(e) {
	searchKey = e.currentTarget.value;
}

function createMarkup() {
	counter = 1;
	fetchImages(searchKey, counter)
		.then(promise => {
			totalHits = promise.totalHits;
			return promise.hits;
		})
		.then(promise => {
			if (promise.length === 0) {
				Notiflix.Notify.failure(
					'Sorry, there are no images matching your search query. Please try again.',
				);
				refs.btnLoaderEl.classList.remove('is-active');
			}
			if (promise.length > 0) {
				Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
			}
			if (promise.length > 39) {
				refs.btnLoaderEl.classList.add('is-active');
			}
			refs.listEl.innerHTML = markup(promise);
			gallery.refresh();
			smoothScroll();
		});
}

function loadMorePhotos() {
	counter += 1;
	fetchImages(searchKey, counter).then(promise => {
		if (totalHits - 40 < refs.listEl.children.length) {
			Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
			refs.btnLoaderEl.classList.remove('is-active');
		}
		refs.listEl.insertAdjacentHTML('beforeend', markup(promise.hits));
		gallery.refresh();
		smoothScroll();
	});
}

function markup(photos) {
	const markup = photos
		.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
			return `<div class="photo-card">
					<a class="gallery-item" href="${largeImageURL}">
						<img src="${webformatURL}" alt="${tags}" title="${tags}" width="250px" heigth="140px" loading="lazy" />
						</a>
						<div class="info">
						<p class="info-item">
							<b class="info-heading">Likes</b>
							<br>
							${likes}
						</p>
						<p class="info-item">
							<b class="info-heading">Views</b>
							<br>
							${views}
						</p>
						<p class="info-item">
							<b class="info-heading">Comments</b>
							<br>
							${comments}
						</p>
						<p class="info-item">
							<b class="info-heading">Downloads</b>
							<br>
							${downloads}
						</p>
						</div>
					</div>`;
		})
		.join('');
	return markup;
}

function smoothScroll() {
	const { height: cardHeight } = refs.listEl.firstElementChild.getBoundingClientRect();
	window.scrollBy({
		top: cardHeight * 2,
		behavior: 'smooth',
	});
}

refs.inputEl.addEventListener('input', inputValue);
refs.btnEl.addEventListener('click', createMarkup);
refs.btnLoaderEl.addEventListener('click', loadMorePhotos);

let gallery = new SimpleLightbox('.gallery a', { captionDelay: 250 });
gallery.on('show.simplelightbox', function () {});
