"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moviedb_js_1 = require("./moviedb.js");
const utils_js_1 = __importDefault(require("./utils.js"));
require("@popperjs/core/dist/umd/popper.min.js");
require("bootstrap/dist/js/bootstrap.min.js");
require("bootstrap/dist/css/bootstrap.min.css");
require("../assets/global_styles.css");
addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    // create an instance of movies api
    const movies_api = yield moviedb_js_1.API.create();
    // Get Url Parameters
    let page = Number(utils_js_1.default.getParameterByName('page'));
    if (!page)
        page = 1;
    let id = utils_js_1.default.getParameterByName('id');
    let query = utils_js_1.default.getParameterByName('query');
    if (id) {
        const movie = yield moviedb_js_1.Movie.create(movies_api, Number(id));
        load_movie_details(movies_api, movie);
    }
    else if (query) {
        // update the pagination based on page number
        utils_js_1.default.update_pagination(page);
        // get all the movie ids, create a Movie object of each one of them and then add it to the html as a card
        yield movies_api.get_movies_ids_using_query(page, query)
            .then(ids => update_movie_cards(movies_api, ids))
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));
    }
    else {
        // update the pagination based on page number
        utils_js_1.default.update_pagination(page);
        // get all the movie ids, create a Movie object of each one of them and then add it to the html as a card
        yield movies_api.get_movies_ids(page)
            .then(ids => update_movie_cards(movies_api, ids))
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));
    }
}));
function redirect_movie_details(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const movie_id = event.target.getAttribute('data-id');
        window.location.href = `/movie-details.html?id=${movie_id}`;
    });
}
;
function load_movie_details(movies_api, movie) {
    return __awaiter(this, void 0, void 0, function* () {
        // create the Movie header first showing all the details (except movie images) 
        const details_div = document.createElement('div');
        details_div.classList.add('container-md');
        const body = document.querySelector('body');
        const genre_names = movie.genres.map(genre => `<h4><span class="badge text-bg-success me-2">${genre}</span></h4>`);
        const images = yield movie.load_images();
        details_div.innerHTML = `
    <div class="card text-light border border-0 text-center fade-out-container" style="width: 100%; height: 70vh;">
        <img src="${movie.poster_url}" class="card-img fade-out-content" alt="poster photo of ${movie.title} Movie" style="width: 100%; height: 100%;">
        <div class="fade-out"></div>
            <div class="card-img-overlay d-flex justify-content-start align-items-start">
                <img src="${movie.poster_url}" class="card-img fade-out-content my-5 me-5" alt="poster photo of ${movie.title} Movie" style="width: 30%; height: 85%; display: cover;">
                <div class="mt-5 pt-5 text-start lh-md">
                    <h2 class="card-title kanit-bold fs-1">${movie.title}</h2>
                    <p class="card-text kanit-light-italic">
                        <i class="fa-regular fa-star me-2"></i>${movie.vote_average}
                        <i class="fa-regular fa-thumbs-up me-2 ms-5"></i>${movie.vote_count}
                    </p>
                    <p class="card-text kanit-medium">
                        <i class="fa-solid fa-calendar-days me-2"></i>${movie.date}
                    </p>
                    <p class="card-text kanit-light">
                        
                    </p>
                    <h3 class="card-text kanit-bold">
                        overview
                    </h3>
                    <p class="card-text kanit-light">
                        ${movie.overview}
                    </p>
                    <div class="movie-genres d-flex">
                        ${genre_names.join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
        // add 5 images of the movie to view
        const imgs_section = document.createElement('div');
        imgs_section.classList.add('container-sm');
        images.forEach((img, idx) => {
            if (idx > 4) {
                return;
            }
            const img_element = document.createElement('img');
            img_element.style.width = '80%';
            img_element.style.height = '50%';
            img_element.style.display = 'cover';
            img_element.src = movies_api.get_full_url(img.file_path);
            img_element.classList.add('mb-3');
            imgs_section.appendChild(img_element);
        });
        imgs_section.classList.add('mx-auto');
        if (body) {
            body.appendChild(details_div);
            body.appendChild(imgs_section);
        }
    });
}
function update_movie_cards(movies_api, movies_ids) {
    // remove previous list of movies
    const movies_section = document.querySelector('.movies-list');
    const prev_list = document.querySelector('.movies-list div');
    const curr_list = document.createElement('div');
    curr_list.classList.add(...("row row-cols-1 row-cols-md-3 row-cols-lg-4 gap-5 m-5 justify-content-center".split(' ')));
    if (movies_section && prev_list)
        movies_section.removeChild(prev_list);
    movies_ids.forEach((id) => __awaiter(this, void 0, void 0, function* () {
        const movie = yield moviedb_js_1.Movie.create(movies_api, id);
        const genre_names = movie.genres.map(genre => `<a class="badge rounded-pill text-bg-success me-2 nav-link">${genre}</a>`);
        const movie_card = document.createElement('div');
        movie_card.classList.add('col');
        movie_card.classList.add('movie-card');
        movie_card.onclick = redirect_movie_details;
        // movie_card['data-id'] = id;
        movie_card.innerHTML = `
            <div class="card text-light border border-0 text-center" style="width: 16rem; height: 20rem;">
                <img src="${movie.poster_url}" class="card-img" alt="poster photo of ${movie.title} Movie" style="width: 100%; height: 100%;">
                <div class="card-img-overlay d-flex flex-column align-items-center justify-content-end">
                    <h5 class="card-title kanit-bold fs-2">${movie.title}</h5>
                    <div class="movie-genres">
                        ${genre_names.join('')}
                    </div>
                </div>
                <div class="card-img-overlay d-flex align-items-start justify-content-between" data-id=${id}>
                    <p class="card-text kanit-medium">${movie.date}</p>
                    <p class="card-text kanit-light-italic"><span class="badge text-bg-success" style="opacity: 0.8;">${movie.vote_average}</span></p>
                </div>
            </div>
        `;
        curr_list.appendChild(movie_card);
    }));
    if (movies_section)
        movies_section.appendChild(curr_list);
    return movies_ids;
}
