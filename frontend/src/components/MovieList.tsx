import { useState, useEffect } from 'react'
import { getMovies, deleteMovie, updateMovie, createMovie, getLongestIntervalProducer, getShortestIntervalProducer } from '../services/movieService';
import { Movie, ProducerInterval } from '../types';
import MovieListItem from './MovieListItem'
import './movielist.css'
import MovieModal from './MovieModal';
import IntervalModal from './IntervalModal';

function MovieList() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isIntervalModalOpen, setIsIntervalModalOpen] = useState<boolean>(false);
    const [longestProducer, setLongestProducer] = useState<ProducerInterval | null>(null);
    const [shortestProducer, setShortestProducer] = useState<ProducerInterval | null>(null);


    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movies = await getMovies();
                setMovies(movies)
            } catch (error) {
                console.log('Erro fetch movies', error);
            }
        };

        fetchMovies();
    }, []);

    const handleAdd = async (newMovie: Omit<Movie, '_id'>) => {
        try {
            const createdMovie = await createMovie(newMovie);
            setMovies([...movies, createdMovie]);
            movies.sort();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Erro adicionando');
        }
    }

    const handleShowIntervals = async () => {
        try {
            const longest = await getLongestIntervalProducer();
            const shortest = await getShortestIntervalProducer();
            setLongestProducer(longest);
            setShortestProducer(shortest);
            setIsIntervalModalOpen(true);
        } catch (error) {
            console.error('Erro fetch intervalos', error);
        }
    }

    const handleEdit = async (id: string, updatedMovie: Partial<Movie>) => {
        try {
            const updated = await updateMovie(id, updatedMovie);
            setMovies(movies.map(movie => movie._id === id ? updated : movie))
        } catch (error) {
            console.error('Erro editando', error)
        }
    }


    const handleDelete = async (id: string) => {
        try {
            await deleteMovie(id);
            setMovies(movies.filter(movie => movie._id !== id))
        } catch (error) {
            console.error('Erro delete', error);
        }
    };

    return (
        <div className='movielist'>
            <header className='header'>
                <h2>Título</h2>
                <span>Ano</span>
                <span>Estudios</span>
                <span>Produtores</span>
                <span>Premio</span>
                <span className='buttons'>
                    <button onClick={() => setIsAddModalOpen(true)}>Adicionar</button>
                    <button onClick={handleShowIntervals}>Intervalos</button>
                </span>
            </header>
            {movies.map(movie => (
                <MovieListItem
                    key={movie._id}
                    movie={movie}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}

            <MovieModal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                movie={null}
                onSave={handleAdd}
            />

            <IntervalModal
                isOpen={isIntervalModalOpen}
                onRequestClose={() => setIsIntervalModalOpen(false)}
                longest={longestProducer}
                shortest={shortestProducer}
            />
        </div>
    );
}

export default MovieList;
