import fetchImages from './fetchData';
import './sass/main.scss';
import Notiflix from 'notiflix';

const refs = {
	inputEl: document.querySelector('input'),
	btnEl: document.querySelector('.btn'),
	listEl: document.querySelector('.list'),
	btnLoaderEl: document.querySelector('.btn-load'),
};

let searchKey = null;
let totalHits = null;
let counter = 1;

function inputValue(e) {
	searchKey = e.currentTarget.value;
}

function createMarkup() {
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
	});
}

function markup(photos) {
	const markup = photos
		.map(({ webformatURL, tags, likes, views, comments, downloads }) => {
			return `<div class="photo-card">
						<img src="${webformatURL}" alt="${tags}" width="250px" heigth="140px" loading="lazy" />
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

refs.inputEl.addEventListener('input', inputValue);
refs.btnEl.addEventListener('click', createMarkup);
refs.btnLoaderEl.addEventListener('click', loadMorePhotos);
