import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import mjolnir from '../../assets/img/mjolnir.png';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import './randomChar.scss';

const RandomChar = () => {
	const [char, setChar] = useState({});

	const { getCharacter, clearError, process, setProcess } = useMarvelService();

	useEffect(() => {
		updateChar();

		const timerId = setInterval(updateChar, 60000);

		return () => {
			clearInterval(timerId);
		};
	}, []);

	const onCharLoaded = char => {
		setChar(char);
	};

	const updateChar = () => {
		clearError();
		const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
		getCharacter(id)
			.then(onCharLoaded)
			.then(() => setProcess('confirmed'));
	};

	return (
		<div className='randomchar'>
			{setContent(process, View, char)}
			<div className='randomchar__static'>
				<p className='randomchar__title'>
					Random character for today!
					<br />
					Do you want to get to know him better?
				</p>
				<p className='randomchar__title'>Or choose another one</p>
				<button className='button button__main'>
					<div
						className='inner'
						onClick={updateChar}
					>
						try it
					</div>
				</button>
				<img
					src={mjolnir}
					alt='mjolnir'
					className='randomchar__decoration'
				/>
			</div>
		</div>
	);
};

const View = ({ data }) => {
	const { name, description, thumbnail, wiki, id } = data;
	let imgStyle = { objectFit: 'cover' };
	if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
		imgStyle = { objectFit: 'contain' };
	}

	return (
		<div className='randomchar__block'>
			<img
				src={thumbnail}
				alt='Random Character'
				className='randomchar__img'
				style={imgStyle}
			/>
			<div className='randomchar__info'>
				<p className='randomchar__name'>{name}</p>
				<p className='randomchar__descr'>{description.slice(0, 210)}</p>
				<div className='randomchar__btns'>
					<NavLink
						to={`/characters/${id}`}
						className='button button__main'
					>
						<div className='inner'>homepage</div>
					</NavLink>
					<a
						href={wiki}
						className='button button__secondary'
					>
						<div className='inner'>Wiki</div>
					</a>
				</div>
			</div>
		</div>
	);
};

export default RandomChar;
