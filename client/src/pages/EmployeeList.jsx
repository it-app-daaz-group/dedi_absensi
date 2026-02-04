import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/user.service";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    retrieveEmployees();
  }, []);

  const retrieveEmployees = () => {
    UserService.getAll()
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((e) => {
        console.log(e);
        if (e.response && e.response.status === 401) {
             // Handle unauthorized (maybe redirect to login or show error)
             setMessage("Unauthorized. Please login.");
        }
      });
  };

  const deleteEmployee = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      UserService.remove(id)
        .then((response) => {
          retrieveEmployees();
          setMessage("Karyawan berhasil dihapus!");
        })
        .catch((e) => {
          console.log(e);
          setMessage("Gagal menghapus karyawan.");
        });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
          <h2 className="text-2xl leading-tight">Master Karyawan</h2>
          <div className="text-end">
            <Link
              to="/dashboard/employees/add"
              className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
            >
              Tambah Karyawan
            </Link>
          </div>
        </div>
        {message && (
            <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 my-4" role="alert">
                <p className="font-bold">Info</p>
                <p className="text-sm">{message}</p>
            </div>
        )}
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    NIP
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Jabatan
                  </th>
                   <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{employee.nip}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{employee.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{employee.email}</p>
                    </td>
                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{employee.position}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${employee.role === 'admin' ? 'text-green-900' : 'text-gray-900'}`}>
                        <span aria-hidden="true" className={`absolute inset-0 ${employee.role === 'admin' ? 'bg-green-200' : 'bg-gray-200'} opacity-50 rounded-full`}></span>
                        <span className="relative">{employee.role}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <Link to={`/dashboard/employees/edit/${employee.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                            Edit
                        </Link>
                        <button onClick={() => deleteEmployee(employee.id)} className="text-red-600 hover:text-red-900">
                            Delete
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
