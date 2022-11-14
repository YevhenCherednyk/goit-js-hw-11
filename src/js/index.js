import '../css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PhotoApiService from './fetchImg';
import createCardMarkup from './cardMarkup';
import LoadMoreBtn from './loadMoreBtn';

const refs = {
  formRef: document.querySelector('#search-form'),
  galleryRef: document.querySelector('.gallery'),
  // loadMoreBtn: document.querySelector('.load-more'),
};

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const photoApiService = new PhotoApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

refs.formRef.addEventListener('submit', onSearchBtnClick);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtnClick);
// refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSearchBtnClick(evt) {
  evt.preventDefault();

  photoApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
  photoApiService.resetPage();

  if (!photoApiService.query) {
    clearMarup();
    loadMoreBtn.hide();
    return Notiflix.Notify.warning('Please enter a valid value');
  }

  loadMoreBtn.show();
  loadMoreBtn.disable();

  photoApiService
    .fetchImg()
    .then(({ totalHits, hits }) => {
      clearMarup();
      const totalPages = Math.ceil(totalHits / hits.length);
      const currentPage = photoApiService.page - 1;

      if (hits.length === 0) {
        loadMoreBtn.hide();
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

        if (totalPages <= currentPage) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          loadMoreBtn.hide();
        }
      }

      appendCardMarkup(hits);
      loadMoreBtn.enable();
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtnClick(evt) {
  loadMoreBtn.disable();

  photoApiService
    .fetchImg()
    .then(({ totalHits, hits }) => {
      const totalPages = Math.ceil(totalHits / hits.length);
      const currentPage = photoApiService.page - 1;
      if (totalPages <= currentPage) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.hide();
      }
      appendCardMarkup(hits);
      loadMoreBtn.enable();

      // smooth scroll start

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      // smooth scroll end
    })
    .catch(error => console.log(error));
}

function appendCardMarkup(hits) {
  refs.galleryRef.insertAdjacentHTML('beforeend', createCardMarkup(hits));
  gallery.refresh();
}

function clearMarup() {
  refs.galleryRef.innerHTML = '';
}
