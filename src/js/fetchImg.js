const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '31186773-8484a0bc913959b467e4295b5';

export default class PhotoApiService {
  constructor() {
    this.name = '';
    this.PARE_PAGE = 40;
    this.page = 1;
  }

  fetchImg() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.PARE_PAGE}&page=${this.page}`;

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        this.page += 1;
        return data.hits;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.name;
  }

  set query(newName) {
    this.name = newName;
  }
}
