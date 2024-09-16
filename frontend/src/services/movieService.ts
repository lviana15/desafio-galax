import axiosInstance from './axiosInstance'

import { Movie, ProducerInterval } from '../types'

export async function getMovies(): Promise<Movie[]> {
    const response = await axiosInstance.get<Movie[]>('/movies');
    return response.data;
}

export async function getMovieById(id: string): Promise<Movie> {
    const response = await axiosInstance.get<Movie>(`/movies/${id}`);
    return response.data;
}

export async function createMovie(newMovie: Partial<Movie>): Promise<Movie> {
    const response = await axiosInstance.post<Movie>('/movies', newMovie);
    return response.data;
}

export async function updateMovie(id: string, updatedMovie: Partial<Movie>): Promise<Movie> {
    const response = await axiosInstance.put<Movie>(`/movies/${id}`, updatedMovie);
    return response.data;
}

export async function deleteMovie(id: string): Promise<Movie> {
    const response = await axiosInstance.delete<Movie>(`/movies/${id}`);
    return response.data;
}

export async function getLongestIntervalProducer(): Promise<ProducerInterval> {
    const response = await axiosInstance.get<ProducerInterval>('/movies/producer/longest-interval');
    return response.data;
}

export async function getShortestIntervalProducer(): Promise<ProducerInterval> {
    const response = await axiosInstance.get<ProducerInterval>('/movies/producer/shortest-interval');
    return response.data;
}
