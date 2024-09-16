import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { Movie } from '../types';
import './modal.css'

interface MovieModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    movie: Movie | null;
    onSave: (updatedMovie: Movie) => void;
}

Modal.setAppElement('#root');

export function MovieModal({ isOpen, onRequestClose, movie, onSave }: MovieModalProps) {
    const [updatedMovie, setUpdatedMovie] = useState<Movie>({} as Movie);
    const [studiosString, setStudiosString] = useState<string>('');
    const [producersString, setProducersString] = useState<string>('');

    useEffect(() => {
        if (movie) {
            setUpdatedMovie(movie);
            setStudiosString(movie.studios?.join(', ') || '');
            setProducersString(movie.producers?.join(', ') || '');

        }
    }, [movie]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setUpdatedMovie((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setUpdatedMovie((prev) => ({
                ...prev,
                [name]: type === 'number' ? parseInt(value, 10) : value,
            }));
        }
    };

    const handleStudiosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStudiosString(e.target.value);
    };

    const handleProducersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProducersString(e.target.value);
    };

    const handleSubmit = () => {
        if (
            updatedMovie.year &&
            updatedMovie.title &&
            updatedMovie.studios &&
            updatedMovie.producers
        ) {
            const parsedUpdatedMovie = {
                ...updatedMovie,
                studios: studiosString.split(',').map(studio => studio.trim()),
                producers: producersString.split(',').map(producer => producer.trim()),
            };
            onSave(parsedUpdatedMovie);
            onRequestClose();
        } else {
            alert('Preencha todos campos');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='modal-content'
            overlayClassName='modal-overlay'
            shouldCloseOnEsc={false}
            shouldFocusAfterRender={false}
        >
            <h2>{movie ? 'Editar Filme' : 'Adicionar Filme'}</h2>
            <div>
                <label>Título:</label>
                <input
                    type='text'
                    name='title'
                    value={updatedMovie.title}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Ano:</label>
                <input
                    type='text'
                    name='year'
                    value={updatedMovie.year}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Estúdios:</label>
                <input
                    type='text'
                    name='studios'
                    value={studiosString}
                    onChange={handleStudiosChange}
                />
            </div>
            <div>
                <label>Produtores:</label>
                <input
                    type='text'
                    name='producers'
                    value={producersString}
                    onChange={handleProducersChange}
                />
            </div>
            <div>
                <label>Vencedor:</label>
                <input
                    type='checkbox'
                    name='winner'
                    checked={!!updatedMovie.winner}
                    onChange={(e) => setUpdatedMovie({ ...updatedMovie, winner: e.target.checked })}
                />
            </div>
            <button onClick={handleSubmit}>Salvar</button>
            <button onClick={onRequestClose}>Cancelar</button>
        </Modal>
    );
}

export default MovieModal;

