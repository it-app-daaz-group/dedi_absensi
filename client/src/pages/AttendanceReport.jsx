import React, { useState, useEffect } from "react";
import AttendanceService from "../services/attendance.service";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AttendanceReport = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");

  const fetchReports = () => {
    setLoading(true);
    AttendanceService.getReports(startDate, endDate, department)
      .then((response) => {
        setAttendances(response.data);
        setLoading(false);
        setMessage(response.data.length === 0 ? "Tidak ada data ditemukan." : "");
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
        setMessage("Gagal mengambil data laporan.");
      });
  };

  useEffect(() => {
    // Initial fetch optional, or wait for user to click filter
    // fetchReports();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      attendances.map((item) => ({
        Tanggal: item.date,
        NIP: item.user?.nip || "-",
        Nama: item.user?.name || "-",
        Departemen: item.user?.department || "-",
        Masuk: item.check_in_time,
        Pulang: item.check_out_time,
        Status: item.is_late ? "Terlambat" : "Tepat Waktu",
        Keterangan: item.status
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Absensi");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(data, `laporan_absensi_${new Date().getTime()}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Absensi Karyawan", 14, 15);
    doc.setFontSize(10);
    doc.text(`Periode: ${startDate || 'Semua'} s/d ${endDate || 'Semua'}`, 14, 22);

    const tableColumn = ["Tanggal", "NIP", "Nama", "Dept", "Masuk", "Pulang", "Status"];
    const tableRows = [];

    attendances.forEach((item) => {
      const rowData = [
        item.date,
        item.user?.nip || "-",
        item.user?.name || "-",
        item.user?.department || "-",
        item.check_in_time || "-",
        item.check_out_time || "-",
        item.is_late ? "Late" : "On Time",
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save(`laporan_absensi_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Laporan Absensi</h2>

      {/* Filter Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Dari Tanggal</label>
            <input
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Sampai Tanggal</label>
            <input
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Departemen (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: IT"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 w-full"
            >
              Tampilkan Data
            </button>
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      {attendances.length > 0 && (
        <div className="flex space-x-4 mb-4">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 flex items-center"
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 flex items-center"
          >
            Export PDF
          </button>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading data...</div>
        ) : attendances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NIP</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dept</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Masuk</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pulang</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.date}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.user?.nip}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.user?.name}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{item.user?.department}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-green-600 font-semibold">{item.check_in_time}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-orange-600 font-semibold">{item.check_out_time || '-'}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_late ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {item.is_late ? 'Terlambat' : 'Tepat Waktu'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">{message || "Silakan filter data untuk menampilkan laporan."}</div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
