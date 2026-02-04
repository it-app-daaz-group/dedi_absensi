import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import UserService from "../services/user.service";

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAddMode = !id;
  const [message, setMessage] = useState("");

  const initialValues = {
    nip: "",
    name: "",
    email: "",
    password: "",
    department: "",
    position: "",
    phone: "",
    address: "",
    role: "employee",
    status: "active"
  };

  const validationSchema = Yup.object().shape({
    nip: Yup.string().required("NIP wajib diisi"),
    name: Yup.string().required("Nama wajib diisi"),
    email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
    password: Yup.string()
      .concat(isAddMode ? Yup.string().required("Password wajib diisi") : Yup.string())
      .min(6, "Password minimal 6 karakter"),
    role: Yup.string().required("Role wajib dipilih"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      saveEmployee(values, setSubmitting);
    },
  });

  useEffect(() => {
    if (!isAddMode) {
      UserService.get(id)
        .then((response) => {
          const fields = ["nip", "name", "email", "department", "position", "phone", "address", "role", "status"];
          fields.forEach(field => formik.setFieldValue(field, response.data[field] || "", false));
        })
        .catch((e) => {
          console.log(e);
          setMessage("Gagal mengambil data karyawan.");
        });
    }
  }, [id, isAddMode]);

  const saveEmployee = (data, setSubmitting) => {
    setMessage("");
    // Remove password if empty in edit mode to avoid overwriting with empty string (though backend handles it, cleaner here)
    if (!isAddMode && !data.password) {
        delete data.password;
    }

    const request = isAddMode
      ? UserService.create(data)
      : UserService.update(id, data);

    request
      .then(() => {
        navigate("/dashboard/employees");
      })
      .catch((e) => {
        setSubmitting(false);
        const resMessage =
          (e.response &&
            e.response.data &&
            e.response.data.message) ||
          e.message ||
          e.toString();
        setMessage(resMessage);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md">
        <div className="py-4 px-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{isAddMode ? "Tambah Karyawan" : "Edit Karyawan"}</h2>
            {message && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{message}</span>
                </div>
            )}
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nip">
                        NIP
                    </label>
                    <input
                        id="nip"
                        name="nip"
                        type="text"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.nip && formik.errors.nip ? 'border-red-500' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nip}
                    />
                    {formik.touched.nip && formik.errors.nip ? (
                        <p className="text-red-500 text-xs italic">{formik.errors.nip}</p>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nama Lengkap
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <p className="text-red-500 text-xs italic">{formik.errors.name}</p>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <p className="text-red-500 text-xs italic">{formik.errors.email}</p>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password {isAddMode ? "" : "(Biarkan kosong jika tidak ingin mengubah)"}
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="text-red-500 text-xs italic">{formik.errors.password}</p>
                    ) : null}
                </div>

                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                        Departemen
                    </label>
                    <input
                        id="department"
                        name="department"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.department}
                    />
                </div>

                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
                        Jabatan
                    </label>
                    <input
                        id="position"
                        name="position"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.position}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.role}
                    >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                        <option value="hr">HR</option>
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={formik.isSubmitting}
                    >
                        {isAddMode ? "Simpan" : "Update"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/employees")}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
