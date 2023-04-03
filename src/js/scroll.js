export { handleScroll, handleClickBtn };

const topBtnEl = document.querySelector('.btn-to-top');

window.addEventListener('scroll', handleScroll);
topBtnEl.addEventListener('click', handleClickBtn);

function handleScroll() {
  const scrolled = window.pageYOffset;
  const coordinates = document.documentElement.clientHeight;

  if (scrolled > coordinates) {
    topBtnEl.classList.add('btn-to-top--visible');
  }
  if (scrolled < coordinates) {
    topBtnEl.classList.remove('btn-to-top--visible');
  }
}

function handleClickBtn() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
