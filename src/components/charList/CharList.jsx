import {Component} from 'react';
import PropTypes from 'prop-types'
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

let total = 1;
class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        if (total === 1) {
            this.onRequest();
            total--;
        }
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }


    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }


        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    renderItems(arr) {
        const items = arr.map(item => {
            let imgStyle = {'objectFit' : 'cover'}
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'fill'}
            }

            return (
                <li className="char__item" key={item.id} onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render () {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {items}
                <button style={{'display': charEnded ? 'none' : 'block'}} disabled={newItemLoading} onClick={() => this.onRequest(offset)} className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;