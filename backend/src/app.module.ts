import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './models/movie.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MovieController } from './controllers/movie.controller';
import { MovieService } from './services/movie.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
            }),
        }),
        MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    ],
    controllers: [MovieController],
    providers: [MovieService],
})
export class AppModule { }
