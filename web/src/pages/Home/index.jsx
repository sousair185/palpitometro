import { useLocalStorage } from "react-use";
import { Navigate } from "react-router-dom";

export function Home() {
  const [auth] = useLocalStorage("auth", {});

  if (auth?.user?.id) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  return (
    <div className="h-screen bg-red-700 text-white flex flex-col items-center space-y-6">
      <header className="container flex justify-center max-w-5xl p-4">
        {/* <img
          src="/src/assets/logo/palpite.svg"
          className="w-40 max-w-max"
        /> */}
        <h1 className="text-3xl text-center md:text-left font-bold">Palpitômetro</h1>
      </header>
      <div className="container max-w-5xl p-6 flex-1 flex flex-col items-center md:items-start justify-center md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="md:flex-1 flex justify-center">
          <img src="/src/assets/imgs/bola.png" className="w-full max-w-md" />
        </div>
        <div className="md:flex-1 flex flex-col space-y-6">
          <h1 className="text-3xl text-center md:text-left font-bold">
            Tente acertar o placar nos jogos da Copa do Mundo do Catar 2022!
          </h1>

          <a
            href="/signup"
            className="text-red-700 bg-white text-xl px-8 py-4 text-center rounded-xl"
          >
            Criar minha conta
          </a>
          <a
            href="/login"
            className="text-white border boder-white text-xl px-8 py-4 text-center rounded-xl"
          >
            Fazer login
          </a>
        </div>
      </div>
    </div>
  );
}
