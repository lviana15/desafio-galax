import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MovieDocument = HydratedDocument<Movie>;

@Schema()
export class Movie {
    @Prop()
    year: number;

    @Prop()
    title: string;

    @Prop([String])
    studios: string;

    @Prop([String])
    producers: string[];

    @Prop({ required: false })
    winner: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie)
