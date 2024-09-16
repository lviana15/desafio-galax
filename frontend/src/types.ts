export interface Movie {
    _id: string;
    year: number;
    title: string;
    studios: string[];
    producers: string[];
    winner: boolean | null;
}

export interface ProducerInterval {
    producer: string;
    maxInterval?: number;
    minInterval?: number;
}
