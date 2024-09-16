import { Movie } from '../types'
import './movielist-item.css'
import { useState } from 'react';
import MovieModal from './MovieModal';

interface MovieListItemProps {
    movie: Movie;
    onEdit: (id: string, updatedMovie: Partial<Movie>) => void;
    onDelete: (id: string) => void;
}

export function MovieListItem({ movie, onEdit, onDelete }: MovieListItemProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        onDelete(movie._id);
    };

    const handleSave = (updatedMovie: Partial<Movie>) => {
        onEdit(movie._id, updatedMovie);
        setIsModalOpen(false);
    };

    return (
        <div className='movielist-item'>
            <h2>{movie.title}</h2>
            <span>{movie.year}</span>
            <p>{movie.studios.join(', ')}</p>
            <p>{movie.producers?.join(', ')}</p>
            <p>{movie.winner ? 'Sim' : 'Não'}</p>
            <span className='buttons'>
                <button onClick={handleEditClick}>Editar</button>
                <button onClick={handleDelete}>Apagar</button>
            </span>

            <MovieModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                movie={movie}
                onSave={handleSave}
            />
        </div>
    );
}

export default MovieListItem;
