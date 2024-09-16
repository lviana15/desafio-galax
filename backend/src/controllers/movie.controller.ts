import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MovieService } from 'src/services/movie.service';
import { Movie } from 'src/models/movie.schema';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @Get()
    async getAllMovies(): Promise<Movie[]> {
        return this.movieService.findAll();
    }

    @Get(':id')
    async getMovieById(@Param('id') id: string): Promise<Movie | null> {
        return this.movieService.findById(id);
    }

    @Post()
    async createMovie(@Body() createMovieDto: Partial<Movie>): Promise<Movie> {
        return this.movieService.create(createMovieDto);
    }


    @Put(':id')
    async updateMovie(
        @Param('id') id: string,
        @Body() updateMovieDto: Partial<Movie>
    ): Promise<Movie | null> {
        return this.movieService.update(id, updateMovieDto);
    }

    @Delete(':id')
    async deleteMovie(@Param('id') id: string): Promise<Movie | null> {
        return this.movieService.delete(id);
    }

    @Get('producer/longest-interval')
    async getLongestIntervalProducer() {
        const producer = await this.movieService.findLongestWinningIntervalProducer();
        return producer;
    }

    @Get('producer/shortest-interval')
    async getShortestIntervalProducer() {
        const producer = await this.movieService.findShortestWinningIntervalProducer();
        return producer;
    }
}

