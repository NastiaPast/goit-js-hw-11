import '../css/styles.css';
import { fetchImages } from './fetch-photo';
import { renderGallery } from './render-gallery';
import { handleScroll, handleClickBtn } from './scroll';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const containerEl = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('.btn-load-more');
let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

formEl.addEventListener('submit', handleSubmit);
loadBtnEl.addEventListener('click', handleClick);

handleScroll();
handleClickBtn();

async function handleSubmit(event) {
  event.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  query = event.currentTarget.searchQuery.value.trim();
  containerEl.innerHTML = '';
  loadBtnEl.classList.add('is-hidden');

  if (query === '') {
    Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  try {
    const { data } = await fetchImages(query, page, perPage);
    if (data.totalHits === 0) {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    } else {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);

      if (data.totalHits > perPage) {
        loadBtnEl.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    formEl.reset();
  }
}

async function handleClick() {
  page += 1;
  simpleLightBox.destroy();

  try {
    const { data } = await fetchImages(query, page, perPage);
    renderGallery(data.hits);
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    const totalPages = Math.ceil(data.totalHits / perPage);

    if (page > totalPages) {
      loadBtnEl.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    smoothScroll();
  } catch (error) {
    console.log(error);
  }
}
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
