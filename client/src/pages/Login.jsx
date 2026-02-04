import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      nip: "",
      password: "",
    },
    validationSchema: Yup.object({
      nip: Yup.string().required("NIP wajib diisi"),
      password: Yup.string().required("Password wajib diisi"),
    }),
    onSubmit: async (values) => {
      setMessage("");
      setLoading(true);
      try {
        await login(values.nip, values.password);
        navigate("/dashboard");
      } catch (error) {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          LaragonDocs Absensi
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="nip"
            >
              NIP
            </label>
            <input
              id="nip"
              type="text"
              {...formik.getFieldProps("nip")}
              className={`w-full rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none focus:shadow-outline ${
                formik.touched.nip && formik.errors.nip
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Masukkan NIP"
            />
            {formik.touched.nip && formik.errors.nip ? (
              <p className="mt-1 text-xs italic text-red-500">
                {formik.errors.nip}
              </p>
            ) : null}
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
              className={`w-full rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none focus:shadow-outline ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="******************"
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="mt-1 text-xs italic text-red-500">
                {formik.errors.password}
              </p>
            ) : null}
          </div>
          {message && (
            <div className="mb-4 rounded bg-red-100 p-3 text-center text-sm text-red-700">
              {message}
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="focus:shadow-outline w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
            >
              {loading ? "Loading..." : "Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
