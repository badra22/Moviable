const base_url: string = 'https://api.themoviedb.org/3';
const global_options: object = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        // Authorization: `Bearer ${process.env.MOVIE_API_TOKEN}`
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODQzYzczYTdjMGJmMDI0OGQ4YmMxMTA1ZjNkNzM1MSIsIm5iZiI6MTcyMDM4NTU0NC40NjM2MjcsInN1YiI6IjY2OGFmZWJmYTNjMDgyMWJmYWFlNDE5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0nP1EVjvPNtlEtJVdloeYvLvyWf_tV87i4cMjeXzwCs'
    }
};

type Image = {
    aspect_ratio: number,
    height: number,
    iso_639_1: any,
    file_path: string,
    vote_average: number,
    vote_count: number,
    width: number
};


export class API {
    private configs : any;
    private discover_movies_route: string = '/discover/movie';
    private search_movies_route: string = '/search/movie?include_adult=false&language=en-US';
    private constructor(configs: object) {
        this.configs = configs;
    }

    public static async create() {
        const configs : object = await fetch(`${base_url}/configuration`, global_options).then(res => res.json());
        return new API(configs);
    }

    public async get_movies_ids(page: number) : Promise<Array<number>> {
        if(!page)page = 1;
        const fetch_url = `${base_url}${this.discover_movies_route}?page=${page}`;
        return await fetch(fetch_url, global_options)
        .then(res => res.json()).then(res => res.results.map(movie => movie.id));
    }

    public async get_movies_ids_using_query(page: number, query: string) {
        if(!page)page = 1;
        const fetch_url = `${base_url}${this.search_movies_route}&query=${query}&page=${page}`;
        return await fetch(fetch_url, global_options)
        .then(res => res.json()).then(res => res.results.map(movie => movie.id));
    }
    get images_configs() {
        return this.configs.images;
    }

    public get_full_url(path: string) : string {
        return `${this.images_configs.base_url}${this.images_configs.poster_sizes[5]}${path}`;
    }
}


export class Movie {
    public static fetch_movie_details_route: string;
    id: number;
    genres: Array<string>;
    homePage: string;
    countries: Array<string>;
    language: string;
    title: string;
    overview: string;
    poster_url: string;
    date: string;
    vote_average: number;
    vote_count: number;
    images: Array<Image>;
    fetch_url : string;
    images_fetch_url : string;

    private constructor(moviedb_api: API, details) {
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

    public static async create(moviedb_api: API, id: number) {
        const details: object = await fetch(`${base_url}/movie/${id}?language=en-US`, global_options).then(res => res.json());
        return new Movie(moviedb_api, details);
    }

    public async load_images() : Promise<Array<Image>> {
        this.images = await fetch(this.images_fetch_url, global_options).then(res => res.json()).then(res => res.backdrops);
        return this.images;
    }

}