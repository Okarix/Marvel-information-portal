import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
	const { loading, request, error, clearError } = useHttp();

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _apiKey = 'apikey=fcdb2bfcdfaed7af723ea8764bec1190';
	const _baseOffset = 210;

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

	const getCharacter = async id => {
		const res = await request(`${_apiBase}characters/${id}?&${_apiKey}`);
		return _transformCharacter(res.data.results[0]);
	};

	const getAllComics = async (offset = 0) => {
		const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
		return res.data.results.map(_transformComics);
	};

	const getComic = async id => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	};

	const _transformCharacter = char => {
		const description = (descr, num) => {
			if (descr) {
				return descr.slice(0, num) + '...';
			} else {
				return "Sorry, we don't have a description for this character.";
			}
		};
		return {
			id: char.id,
			name: char.name,
			description: description(char.description, 210),
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items,
		};
	};

	const _transformComics = comics => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.textObjects && comics.textObjects[0] ? comics.textObjects[0].text : 'There is no description',
			pageCount: comics.pageCount ? `${comics.pageCount} pages` : 'No information about the number of pages',
			thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || 'en-us',
			price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available',
		};
	};

	return { loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic };
};

export default useMarvelService;
