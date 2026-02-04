import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import HrService from "../services/hr.service";

const HrSettings = () => {
  const [settings, setSettings] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [activeTab, setActiveTab] = useState("general");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    HrService.getSettings().then(
      (response) => {
        setSettings(response.data);
        formikSettings.setValues(response.data);
      },
      (error) => {
        console.log(error);
      }
    );

    HrService.getHolidays().then(
      (response) => {
        setHolidays(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const formikSettings = useFormik({
    initialValues: {
      work_start_time: "08:00:00",
      work_end_time: "17:00:00",
      late_tolerance_minutes: 15,
      overtime_rate: 0,
    },
    validationSchema: Yup.object({
      work_start_time: Yup.string().required("Required"),
      work_end_time: Yup.string().required("Required"),
      late_tolerance_minutes: Yup.number().required("Required"),
      overtime_rate: Yup.number().required("Required"),
    }),
    onSubmit: (values) => {
      HrService.updateSettings(values).then(
        (response) => {
          setMessage("Pengaturan berhasil disimpan.");
          setSettings(response.data.data);
          setTimeout(() => setMessage(""), 3000);
        },
        (error) => {
          setMessage("Gagal menyimpan pengaturan.");
        }
      );
    },
  });

  const formikHoliday = useFormik({
    initialValues: {
      name: "",
      date: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nama libur wajib diisi"),
      date: Yup.date().required("Tanggal wajib diisi"),
    }),
    onSubmit: (values, { resetForm }) => {
      HrService.addHoliday(values).then(
        (response) => {
          setHolidays([...holidays, response.data]);
          resetForm();
          setMessage("Hari libur berhasil ditambahkan.");
          setTimeout(() => setMessage(""), 3000);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setMessage("Gagal menambahkan hari libur: " + resMessage);
        }
      );
    },
  });

  const deleteHoliday = (id) => {
    if (window.confirm("Hapus hari libur ini?")) {
      HrService.deleteHoliday(id).then(
        () => {
          setHolidays(holidays.filter((h) => h.id !== id));
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Setting HR</h2>
      
      {message && (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 mb-4" role="alert">
          <p className="font-bold">Info</p>
          <p className="text-sm">{message}</p>
        </div>
      )}

      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 ${activeTab === 'general' ? 'text-blue-600 border-blue-600 active' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              onClick={() => setActiveTab('general')}
            >
              Pengaturan Umum
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 ${activeTab === 'holidays' ? 'text-blue-600 border-blue-600 active' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`}
              onClick={() => setActiveTab('holidays')}
            >
              Hari Libur
            </button>
          </li>
        </ul>
      </div>

      {activeTab === 'general' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Jam Kerja & Lembur</h3>
          <form onSubmit={formikSettings.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Jam Masuk</label>
                <input
                  type="time"
                  name="work_start_time"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  value={formikSettings.values.work_start_time}
                  onChange={formikSettings.handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Jam Pulang</label>
                <input
                  type="time"
                  name="work_end_time"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  value={formikSettings.values.work_end_time}
                  onChange={formikSettings.handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Toleransi Keterlambatan (Menit)</label>
                <input
                  type="number"
                  name="late_tolerance_minutes"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  value={formikSettings.values.late_tolerance_minutes}
                  onChange={formikSettings.handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Rate Lembur (per jam)</label>
                <input
                  type="number"
                  name="overtime_rate"
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  value={formikSettings.values.overtime_rate}
                  onChange={formikSettings.handleChange}
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Simpan Pengaturan
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'holidays' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Daftar Hari Libur</h3>
          
          <form onSubmit={formikHoliday.handleSubmit} className="mb-8 bg-gray-50 p-4 rounded">
            <h4 className="text-md font-medium mb-2">Tambah Hari Libur</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nama Libur"
                  className="shadow border rounded w-full py-2 px-3"
                  value={formikHoliday.values.name}
                  onChange={formikHoliday.handleChange}
                />
              </div>
              <div>
                <input
                  type="date"
                  name="date"
                  className="shadow border rounded w-full py-2 px-3"
                  value={formikHoliday.values.date}
                  onChange={formikHoliday.handleChange}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                >
                  Tambah
                </button>
              </div>
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Keterangan</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday) => (
                  <tr key={holiday.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {holiday.date}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {holiday.name}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => deleteHoliday(holiday.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrSettings;
