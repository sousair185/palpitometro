import { Icon, Card } from "~/components/";
import { DateSelect } from "../../components";
import { format } from "date-fns";

import { useAsyncFn, useLocalStorage } from "react-use";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const [currentDate, setDate] = useState("2022-11-20T00:00:00-03:00");
  const [auth] = useLocalStorage("auth", {});

  const [{ value: user, loading, error }, fetchHunches] = useAsyncFn(
    async () => {
      const res = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API_URL,
        url: `/${auth.user.username}`,
      });
      const hunches = res.data.hunches.reduce((acc, hunch) => {
        acc[hunch.gameId] = hunch;
        return acc;
      }, {});
      return {
        ...res.data,
        hunches,
      };
    }
  );

  const [games, fetchGames] = useAsyncFn(async (params) => {
    const res = await axios({
      method: "get",
      baseURL: import.meta.env.VITE_API_URL,
      url: "/games",
      params,
    });
    return res.data;
  });

  const isLoading = games.loading || loading;
  const hasError = games.error || error;
  const isDone = !isLoading && !hasError;

  useEffect(() => {
    fetchGames({ gameTime: currentDate });
    fetchHunches();
  }, [currentDate]);

  if (!auth?.user?.id) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <header className="bg-red-500 text-white">
        <div className="container max-w-3xl p-4 flex justify-between p-4">
          {/* <img
            src="/src/assets/logo/palpite.svg"
            className="w-28 md:w-40"
          /> */}
          <h1 className="text-3xl text-center md:text-left font-bold">Palpitômetro</h1>
          <a href={`/${auth?.user?.username}`}>
            <Icon name="profile" className="w-10" />
          </a>
        </div>
      </header>

      <main className="space-y-6">
        <section id="header" className="p-4 bg-red-500 text-white">
          <div className="container max-w-3xl space-y-2 p-4">
            <span>Olá, {auth.user.name}</span>
            <h3 className="text-2xl font-bold">Qual é o seu palpite</h3>
          </div>
        </section>
        <section id="content" className="p-4 container max-w-3xl space-y-4">
          <DateSelect currentDate={currentDate} onChange={setDate} />

          <div className="space-y-4">
            {isLoading && "Carregando..."}
            {hasError && "Não foi possível carregar os jogos"}

            {isDone &&
              games.value?.map((game, index) => (
                <Card
                  key={index}
                  gameId={game.id}
                  homeTeam={game.homeTeam}
                  awayTeam={game.awayTeam}
                  gameTime={format(new Date(game.gameTime), "H:mm")}
                  homeTeamScore={user?.hunches?.[game.id]?.homeTeamScore || ""}
                  awayTeamScore={user?.hunches?.[game.id]?.awayTeamScore || ""}
                />
              ))}
            {/* {games.map((game, index) => (
              <Card
                key={index}
                homeTeamScore={{ slug: game.homeTeam }}
                awayTeamScore={{ slug: game.awayTeam }}
                gameTime={{ time: format(new Date(game.gameTime), "H:mm") }}
              />
            ))} */}
          </div>
        </section>
      </main>
    </>
  );
};
