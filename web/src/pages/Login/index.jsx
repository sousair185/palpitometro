import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLocalStorage } from "react-use";
import { ToastContainer, toast } from "react-toastify";

import { Icon, Input } from "~/components/";
import { Navigate } from "react-router-dom";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Informe um e-mail válido")
    .required("Preencha com seu e-mail"),
  password: yup.string().required("Insira uma senha"),
});

export const Login = () => {
  const [auth, setAuth] = useLocalStorage("auth", {});
  const formik = useFormik({
    onSubmit: async (values) => {
      const res = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API_URL,
        url: "/login",
        auth: {
          username: values.email,
          password: values.password,
        },
      });
      setAuth(res.data);
      toast("Usuário criado com sucesso!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    },
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
  });

  if (auth?.user?.id) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  return (
    <div>
      <header className="p-4 border-b border-red-300">
        <div className="container max-w-5xl flex justify-center ">
          {/* <img
            src="/src/assets/logo/logo-fundo-branco.svg"
            className="w-32 md:w-40 max-w-max"
          /> */}
          <h1 className="text-3xl text-center md:text-left font-bold">
            Palpitômetro
          </h1>
        </div>
      </header>
      <main className="container max-w-xl p-4">
        <div className="p-4 flex space-x-4 items-center">
          <a href="/">
            <Icon name="back" className="w-10" />
          </a>
          <h2 className="text-xl font-bold">Entre na sua conta</h2>
        </div>
        <form className="p-4 space-y-6" onSubmit={formik.handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Digite seu e-mail"
            label="Seu e-mail"
            error={formik.touched.email && formik.errors.phone}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Input
            type="password"
            name="password"
            id="email"
            placeholder="Digite sua senha"
            label="Sua senha"
            error={formik.touched.password && formik.errors.password}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <button
            disabled={!formik.isValid || formik.isSubmitting}
            type="submit"
            className="block w-full text-white bg-red-500 border boder-white px-6 py-3 text-center rounded-xl disabled:opacity-50"
          >
            {formik.isSubmitting ? "Logando..." : "Entrar"}
          </button>
        </form>
      </main>
    </div>
  );
};
