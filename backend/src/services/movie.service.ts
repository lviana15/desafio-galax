import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../models/movie.schema';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as path from 'path';

@Injectable()
export class MovieService implements OnModuleInit {
    private importStatusFilePath = path.resolve(process.cwd(), 'src/import-status.json');
    private csvFilePath = path.resolve(process.cwd(), 'src/assets/movielist.csv');

    constructor(@InjectModel(Movie.name) private readonly movieModel: Model<Movie>) { }

    async onModuleInit() {
        if (!(await this.hasBeenImported())) {
            await this.importFromCSV();
            await this.setImportedFlag();
        }
    }

    findAll(): Promise<Movie[]> {
        return this.movieModel.find().exec();
    }

    async findById(id: string): Promise<Movie | null> {
        return this.movieModel.findById(id).exec();
    }

    async create(createMovieDto: Partial<Movie>): Promise<Movie> {
        const newMovie = new this.movieModel(createMovieDto);
        return newMovie.save();
    }

    async update(id: string, updateMovieDto: Partial<Movie>): Promise<Movie | null> {
        return this.movieModel.findByIdAndUpdate(id, updateMovieDto, { new: true }).exec();
    }

    async delete(id: string): Promise<Movie | null> {
        return this.movieModel.findByIdAndDelete(id).exec();
    }

    async findLongestWinningIntervalProducer(): Promise<[string, number]> {
        const winners = await this.movieModel.find({ winner: true }).exec();
        const producerYears = this.calculateInterval(winners);
        const producerIntervals = [];

        for (const [producer, years] of producerYears) {
            years.sort((a, b) => a - b);

            let maxInterval = 0;
            for (let i = 1; i < years.length; i++) {
                const interval = years[i] - years[i - 1];
                maxInterval = maxInterval > interval ? maxInterval : interval;
            }

            producerIntervals.push({ producer, maxInterval });
        }

        const longestIntervalProducer = producerIntervals.reduce((prev, curr) => {
            return prev.maxInterval > curr.maxInterval ? prev : curr;
        })

        return longestIntervalProducer;
    }

    async findShortestWinningIntervalProducer() {
        const winners = await this.movieModel.find({ winner: true }).exec();
        const producerYears = this.calculateInterval(winners);
        const producerIntervals = [];

        for (const [producer, years] of producerYears) {
            years.sort((a, b) => a - b);

            if (years.length < 2) continue;

            let minInterval = Number.MAX_VALUE;
            for (let i = 1; i < years.length; i++) {
                const interval = years[i] - years[i - 1];
                minInterval = Math.min(minInterval, interval);
            }

            producerIntervals.push({ producer, minInterval });
        }

        const shortestIntervalProducer = producerIntervals.reduce((prev, curr) => {
            return prev.minInterval < curr.minInterval ? prev : curr;
        })

        return shortestIntervalProducer;
    }

    private calculateInterval(winners: Movie[]) {
        const producerYearsMap = new Map<string, number[]>();

        winners.forEach(movie => {
            movie.producers.forEach(producer => {
                const years = producerYearsMap.get(producer) ? producerYearsMap.get(producer) : [];
                years.push(movie.year);
                producerYearsMap.set(producer, years);
            })
        })

        return producerYearsMap;
    }

    private async hasBeenImported(): Promise<boolean> {
        try {
            const status = JSON.parse(await fs.promises.readFile(this.importStatusFilePath, 'utf-8'));
            return status.imported;
        } catch {
            return false;
        }
    }

    private async setImportedFlag(): Promise<void> {
        try {
            await fs.promises.writeFile(this.importStatusFilePath, JSON.stringify({ imported: true }), 'utf-8');
        } catch (e) {
            console.error('Erro atualizando import status:', e);
        }
    }

    async importFromCSV(): Promise<void> {
        const movies: Movie[] = [];

        fs.createReadStream(this.csvFilePath)
            .pipe(csv({ separator: ';' }))
            .on('data', (movie: any) => {
                movie.year = parseInt(movie.year, 10);
                movie.winner = movie.winner === 'yes' ? true : null;
                movie.studios = movie.studios.split(',').map((studio: string) => studio.trim());
                movie.producers = movie.producers.split(/,|and/i).map((producer: string) => producer.trim());

                movies.push(movie);
            })
            .on('end', async () => {
                try {
                    await this.movieModel.insertMany(movies);
                    console.log('Filmes importados');
                } catch (e) {
                    console.error('Erro importando filmes:', e);
                }
            });
    }
}

