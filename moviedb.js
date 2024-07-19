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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = exports.API = void 0;
const base_url = 'https://api.themoviedb.org/3';
const global_options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        // Authorization: `Bearer ${process.env.MOVIE_API_TOKEN}`
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODQzYzczYTdjMGJmMDI0OGQ4YmMxMTA1ZjNkNzM1MSIsIm5iZiI6MTcyMDM4NTU0NC40NjM2MjcsInN1YiI6IjY2OGFmZWJmYTNjMDgyMWJmYWFlNDE5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0nP1EVjvPNtlEtJVdloeYvLvyWf_tV87i4cMjeXzwCs'
    }
};
class API {
    constructor(configs) {
        this.discover_movies_route = '/discover/movie';
        this.search_movies_route = '/search/movie?include_adult=false&language=en-US';
        this.configs = configs;
    }
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            const configs = yield fetch(`${base_url}/configuration`, global_options).then(res => res.json());
            return new API(configs);
        });
    }
    get_movies_ids(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!page)
                page = 1;
            const fetch_url = `${base_url}${this.discover_movies_route}?page=${page}`;
            return yield fetch(fetch_url, global_options)
                .then(res => res.json()).then(res => res.results.map(movie => movie.id));
        });
    }
    get_movies_ids_using_query(page, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!page)
                page = 1;
            const fetch_url = `${base_url}${this.search_movies_route}&query=${query}&page=${page}`;
            return yield fetch(fetch_url, global_options)
                .then(res => res.json()).then(res => res.results.map(movie => movie.id));
        });
    }
    get images_configs() {
        return this.configs.images;
    }
    get_full_url(path) {
        return `${this.images_configs.base_url}${this.images_configs.poster_sizes[5]}${path}`;
    }
}
exports.API = API;
class Movie {
    constructor(moviedb_api, details) {
        this.id = details.id;
        this.genres = details.genres.map(genre => genre.name);
        this.homePage = details.homepage;
        this.countries = details.origin_country;
        this.language = details.original_language;
        this.title = details.original_title;
        this.overview = details.overview;
        this.poster_url = `${moviedb_api.images_configs.base_url}${moviedb_api.images_configs.poster_sizes[2]}${details.poster_path}`;
        this.date = details.release_date;
        this.vote_average = details.vote_average;
        this.vote_count = details.vote_count;
        this.fetch_url = `${base_url}/movie/${this.id}`;
        this.images_fetch_url = `${base_url}/movie/${this.id}/images`;
    }
    static create(moviedb_api, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = yield fetch(`${base_url}/movie/${id}?language=en-US`, global_options).then(res => res.json());
            return new Movie(moviedb_api, details);
        });
    }
    load_images() {
        return __awaiter(this, void 0, void 0, function* () {
            this.images = yield fetch(this.images_fetch_url, global_options).then(res => res.json()).then(res => res.backdrops);
            return this.images;
        });
    }
}
exports.Movie = Movie;
