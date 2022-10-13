import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLocalStorage } from "react-use";

const validationSchema = yup.object().shape({
  homeTeamScore: yup.string().required("Digite um valor"),
  awayTeamScore: yup.string().required("Digite um valor"),
});

export const Card = ({
  disabled,
  homeTeam,
  awayTeam,
  gameTime,
  gameId,
  homeTeamScore,
  awayTeamScore,
}) => {
  const [auth] = useLocalStorage("auth");
  const formik = useFormik({
    onSubmit: (values) => {
      axios({
        method: "post",
        baseURL: import.meta.env.VITE_API_URL,
        url: "/hunches",
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
        data: {
          ...values,
          gameId,
        },
      });
    },
    initialValues: {
      homeTeamScore,
      awayTeamScore,
    },
    validationSchema,
  });

  return (
    <div className="rounded-xl border border-gray-300 p-4 text-center space-y-4">
      <span className="text-sm md:text-base text-gray-700 font-bold">
        {gameTime}
      </span>
      <form className="flex space-x-4 justify-center items-center">
        <span className="uppercase">{homeTeam}</span>
        <img src={`/src/assets/bandeiras/${homeTeam}.png`} />
        <input
          name="homeTeamScore"
          value={formik.values.homeTeamScore}
          onChange={formik.handleChange}
          onBlur={formik.handleSubmit}
          disabled={disabled}
          type="number"
          className="bg-red-300/[0.2] text-red-700 w-12 h-12 text-center"
        />
        <span>X</span>
        <input
          name="awayTeamScore"
          value={formik.values.awayTeamScore}
          onChange={formik.handleChange}
          onBlur={formik.handleSubmit}
          disabled={disabled}
          type="number"
          className="bg-red-300/[0.2] text-red-700 w-12 h-12 text-center"
        />
        <img src={`/src/assets/bandeiras/${awayTeam}.png`} />
        <span className="uppercase">{awayTeam}</span>
      </form>
    </div>
  );
};
