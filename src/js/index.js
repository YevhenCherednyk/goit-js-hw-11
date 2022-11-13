import '../css/styles.css';
import Notiflix from 'notiflix';
import PhotoApiService from './fetchImg';
import createCardMarkup from './cardMarkup';

const refs = {
  formRef: document.querySelector('#search-form'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const photoApiService = new PhotoApiService();

refs.formRef.addEventListener('submit', onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSearchBtnClick(evt) {
  evt.preventDefault();

  photoApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
  photoApiService.resetPage();

  if (!photoApiService.query) {
    clearMarup();
    return;
  }

  photoApiService
    .fetchImg()
    .then(hits => {
      clearMarup();
      appendCardMarkup(hits);
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtnClick(evt) {
  photoApiService
    .fetchImg()
    .then(appendCardMarkup)
    .catch(error => console.log(error));
}

function appendCardMarkup(hits) {
  refs.galleryRef.insertAdjacentHTML('beforeend', createCardMarkup(hits));
}

function clearMarup() {
  refs.galleryRef.innerHTML = '';
}
