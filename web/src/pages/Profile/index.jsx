import { Icon, Card } from "~/components/";
import { DateSelect } from "../../components";
import { format } from "date-fns";

import { useAsyncFn, useLocalStorage } from "react-use";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export const Profile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [currentDate, setDate] = useState("2022-11-20T00:00:00-03:00");
  const [auth, setAuth] = useLocalStorage("auth", {});

  const [{ value: user, loading, error }, fetchHunches] = useAsyncFn(
    async () => {
      const res = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API_URL,
        url: `/${params.username}`,
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

  const logout = () => {
    setAuth({});
    navigate("/login");
  };

  const isLoading = games.loading || loading;
  const hasError = games.error || error;
  const isDone = !isLoading && !hasError;

  useEffect(() => {
    fetchGames({ gameTime: currentDate });
    fetchHunches();
  }, [currentDate]);

  return (
    <>
      <header className="bg-red-500 text-white">
        <div className="container max-w-3xl p-4 flex justify-between p-4">
          <img
            src="/src/assets/logo/logo-fundo-vermelho.svg"
            className="w-28 md:w-40"
          />
          <div onClick={logout} className="p-2 cursor-pointer">
            Sair
          </div>
        </div>
      </header>

      <main className="space-y-6">
        <section id="header" className="p-4 bg-red-500 text-white">
          <div className="container max-w-3xl space-y-2 p-4">
            <a href="/dashboard">
              <Icon name="back" className="w-10" />
            </a>
            <h3 className="text-2xl font-bold">{user?.name}</h3>
          </div>
        </section>

        <section id="content" className="p-4 container max-w-3xl space-y-4">
          <h2 className="text-red-500 text-xl font-bold">Seus palpites</h2>
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
                  homeTeamScore={user.hunches?.[game.id]?.homeTeamScore || " "}
                  awayTeamScore={user.hunches?.[game.id]?.awayTeamScore || " "}
                  disabled={true}
                />
              ))}
          </div>
        </section>
      </main>
    </>
  );
};
