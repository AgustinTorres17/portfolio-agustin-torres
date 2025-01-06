export default `"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMovieData } from "@/services/movieService";
import { Leading } from "@/components/Leading";
import { MovieData } from "@/types/Movie";
import Image from "next/legacy/image";
import { ProducedBy } from "@/components/details/ProducedBy";
import { MovieInfo } from "@/components/details/MovieInfo";
import { BudgetRevenue } from "@/components/details/BudgetRevenue";
import { VoteCircle } from "@/components/details/VoteCircle";
import { Genres } from "@/components/details/Genres";
import { LoadingScreen } from "@/app/components/LoadingScreen";

export default function Movie() {
    const { id } = useParams();
    const movieId = Array.isArray(id) ? id[0] : id;
    const [movieData, setMovieData] = useState<MovieData | null>(null);

    useEffect(() => {
        if (!movieId) return;
        const fetchData = async () => {
            const response: MovieData = await getMovieData(movieId);
            setMovieData(response);
        };
        fetchData();

        return () => {
            setMovieData(null);
        };
    }, [movieId]);

    if (!movieData) return <LoadingScreen />;

    return (
        <div className="relative min-h-full w-full overflow-x-hidden lg:flex overflow-y-auto lg:items-start lg:justify-center">
            <div className="flex flex-col md:grid md:grid-cols-2 items-start lg:w-[80%] justify-start gap-5 z-10 relative">
                <div className="w-full flex flex-col items-center justify-start gap-8 pt-8 md:sticky md:top-0">
                    <MovieInfo
                        title={movieData.title}
                        poster_path={movieData.poster_path}
                        homepage={movieData.homepage}
                        release_date={movieData.release_date}
                    />
                    <Genres genres={movieData.genres} />
                    {movieData.vote_average && (
                        <VoteCircle voteAverage={movieData.vote_average} />
                    )}
                </div>
                <div className="h-full w-full flex flex-col items-center justify-start gap-4 p-8 pt-0 md:pt-8">
                    {movieData.overview && (
                        <div className="w-full text-center lg:max-w-full text-lg flex flex-col gap-2">
                            <Leading variant={"h3"}>Sinópsis</Leading>
                            <p className="text-pretty">{movieData.overview}</p>
                        </div>
                    )}

                    {movieData.budget > 0 && movieData.revenue > 0 && (
                        <div className="w-full flex justify-center">
                            <BudgetRevenue
                                budget={movieData.budget}
                                revenue={movieData.revenue}
                            />
                        </div>
                    )}
                    <ProducedBy companies={movieData.production_companies} />
                </div>
            </div>
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none select-none">
                <Image
                    src={\`http://image.tmdb.org/t/p/original\${movieData.backdrop_path}\`}
                    alt={movieData.title}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
        </div>
    );
}
`;
