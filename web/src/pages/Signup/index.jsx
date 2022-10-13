import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { useLocalStorage } from "react-use";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Icon, Input } from "~/components/";

const validationSchema = yup.object().shape({
  name: yup.string().required("Preencha com seu nome"),
  phone: yup.string().required("Preencha com seu telefone de contato"),
  username: yup
    .string()
    .min(4, "mínimo 04 caractéres para usuário")
    .required("Escolha um nome de usuário"),
  email: yup
    .string()
    .email("Informe um e-mail válido")
    .required("Preencha com seu e-mail"),
  password: yup
    .string()
    .min(4, "mínimo de 04 caractéres para senha")
    .required("Insira uma senha"),
});

export const Signup = () => {
  const [auth, setAuth] = useLocalStorage("auth", {});

  const navigate = useNavigate();

  if (auth?.user?.id) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  const formik = useFormik({
    onSubmit: async (values) => {
      await axios({
        method: "post",
        baseURL: import.meta.env.VITE_API_URL,
        url: "/users",
        data: values,
      })
        .then((response) => {
          localStorage.setItem("auth", JSON.stringify(response.data));
          setAuth(response.data);
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
          navigate("/login");
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    initialValues: {
      name: "",
      phone: "",
      username: "",
      email: "",
      password: "",
    },
    validationSchema,
  });

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
          <h2 className="text-xl font-bold">Crie sua conta</h2>
        </div>
        <form className="p-4 space-y-6" onSubmit={formik.handleSubmit}>
          <Input
            type="text"
            name="name"
            label="Digite seu nome"
            error={formik.touched.name && formik.errors.name}
            placeholder="Seu nome"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Input
            type="tel"
            name="phone"
            label="Seu telefone"
            error={formik.touched.phone && formik.errors.phone}
            placeholder="Seu telefone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Input
            type="text"
            name="username"
            label="Seu nome de usuário"
            error={formik.touched.username && formik.errors.username}
            placeholder="Digite seu nome de usuário"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Input
            type="email"
            name="email"
            label="Seu e-mail"
            error={formik.touched.email && formik.errors.phone}
            placeholder="Digite seu e-mail"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Input
            type="password"
            name="password"
            label="Sua senha"
            error={formik.touched.password && formik.errors.password}
            placeholder="Digite sua senha"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <button
            type="submit"
            className="block w-full text-white bg-red-500 border boder-white px-6 py-3 text-center rounded-xl disabled:opacity-50"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>
      </main>
    </div>
  );
};
