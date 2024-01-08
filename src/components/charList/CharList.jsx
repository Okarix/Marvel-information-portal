import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';

const CharList = props => {
	const [charList, setCharList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const { loading, error, getAllCharacters } = useMarvelService();

	useEffect(() => {
		onRequest(offset, true);
	}, []);

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllCharacters(offset).then(onCharListLoaded);
	};

	const onCharListLoaded = newCharList => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

		setCharList(charList => [...charList, ...newCharList]);
		setNewItemLoading(false);
		setOffset(offset => offset + 9);
		setCharEnded(ended);
	};

	const itemRefs = useRef([]);

	const focusOnItem = id => {
		itemRefs.current.forEach(item => item.classList.remove('char__item__selected'));
		itemRefs.current[id].classList.add('char__item__selected');
		itemRefs.current[id].focus();
	};

	function renderItems(arr) {
		const items = arr.map((item, i) => {
			let imgStyle = { objectFit: 'cover' };
			if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				imgStyle = { objectFit: 'fill' };
			}

			return (
				<CSSTransition
					key={item.id}
					timeout={500}
					classNames='char__item'
				>
					<li
						className='char__item'
						tabIndex={0}
						key={i}
						ref={el => (itemRefs.current[i] = el)}
						onClick={() => {
							props.onCharSelected(item.id);
							focusOnItem(i);
						}}
						onKeyDown={e => {
							if (e.key === ' ' || e.key === 'Enter') {
								props.onCharSelected(item.id);
								focusOnItem(i);
							}
						}}
					>
						<img
							src={item.thumbnail}
							alt={item.name}
							style={imgStyle}
						/>
						<div className='char__name'>{item.name}</div>
					</li>
				</CSSTransition>
			);
		});

		return (
			<ul className='char__grid'>
				<TransitionGroup component={null}> {items}</TransitionGroup>
			</ul>
		);
	}

	const items = renderItems(charList);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading && !newItemLoading ? <Spinner /> : null;

	return (
		<li className='char__list'>
			{errorMessage}
			{spinner}
			{items}
			<button
				style={{ display: charEnded ? 'none' : 'block' }}
				disabled={newItemLoading}
				onClick={() => onRequest(offset)}
				className='button button__main button__long'
			>
				<div className='inner'>load more</div>
			</button>
		</li>
	);
};

CharList.propTypes = {
	onCharSelected: PropTypes.func,
};

export default CharList;
