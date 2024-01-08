import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './comicsList.scss';

const ComicsList = () => {
	const [comicsList, setComicsList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [comicsEnded, setComicsEnded] = useState(false);

	const { loading, error, getAllComics } = useMarvelService();

	useEffect(() => {
		onRequest(offset, true);
	}, []);

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllComics(offset).then(onComicsLoaded);
	};

	const onComicsLoaded = newComicsList => {
		let ended = false;
		if (newComicsList.length < 8) {
			ended = true;
		}

		setComicsList(comicsList => [...comicsList, ...newComicsList]);
		setNewItemLoading(false);
		setOffset(offset => offset + 8);
		setComicsEnded(ended);
	};

	function renderItems(arr) {
		const items = arr.map((item, i) => {
			return (
				<CSSTransition
					key={i}
					timeout={500}
					classNames='comics__item'
				>
					<NavLink
						to={`/comics/${item.id}`}
						className='comics__item'
						key={i}
					>
						<img
							src={item.thumbnail}
							alt={item.title}
							className='comics__item-img'
						/>
						<div className='comics__item-name'>{item.title}</div>
						<div className='comics__item-price'>{item.price}</div>
					</NavLink>
				</CSSTransition>
			);
		});

		return (
			<ul className='comics__grid'>
				<TransitionGroup component={null}>{items}</TransitionGroup>
			</ul>
		);
	}

	const items = renderItems(comicsList);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading && !newItemLoading ? <Spinner /> : null;

	return (
		<div className='comics__list'>
			{errorMessage}
			{spinner}
			{items}
			<button
				className='button button__main button__long'
				style={{ display: comicsEnded ? 'none' : 'block' }}
				disabled={newItemLoading}
				onClick={() => onRequest(offset)}
			>
				<div className='inner'>load more</div>
			</button>
		</div>
	);
};

export default ComicsList;
