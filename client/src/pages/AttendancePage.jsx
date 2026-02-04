import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import AttendanceService from "../services/attendance.service";

const AttendancePage = () => {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [imgSrc, setImgSrc] = useState(null);
  const [message, setMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    loadData();
    getLocation();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      AttendanceService.getTodayStatus(),
      AttendanceService.getHistory()
    ]).then(
      ([statusRes, historyRes]) => {
        setCurrentStatus(statusRes.data);
        setHistory(historyRes.data);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    );
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude},${position.coords.longitude}`);
          setLocationError("");
        },
        (error) => {
          setLocationError("Gagal mendapatkan lokasi. Pastikan GPS aktif.");
        }
      );
    } else {
      setLocationError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  // Helper to convert dataURI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleClockIn = () => {
    let file = null;
    if (imgSrc) {
      const blob = dataURItoBlob(imgSrc);
      file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
    }

    AttendanceService.clockIn(file, location, "")
      .then((response) => {
        setMessage("Absen Masuk Berhasil!");
        loadData();
        setImgSrc(null);
        setIsCameraActive(false);
      })
      .catch((e) => {
        const resMessage =
          (e.response && e.response.data && e.response.data.message) ||
          e.message ||
          e.toString();
        setMessage(resMessage);
      });
  };

  const handleClockOut = () => {
    if (window.confirm("Apakah Anda yakin ingin absen pulang?")) {
      AttendanceService.clockOut(location)
        .then((response) => {
          setMessage("Absen Pulang Berhasil!");
          loadData();
        })
        .catch((e) => {
          const resMessage =
            (e.response && e.response.data && e.response.data.message) ||
            e.message ||
            e.toString();
          setMessage(resMessage);
        });
    }
  };

  const handleUserMedia = () => {
    console.log("Camera permission granted");
    getLocation();
  };

  const handleUserMediaError = (err) => {
    console.error("Camera error:", err);
    setIsCameraActive(false);
    setMessage("Gagal mengakses kamera: " + err + ". Mohon izinkan akses kamera.");
  };

  const handleStartAttendance = () => {
    setMessage("");
    setIsCameraActive(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Absensi</h2>

      {message && (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 mb-4" role="alert">
          <p className="font-bold">Info</p>
          <p className="text-sm">{message}</p>
        </div>
      )}

      {locationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{locationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Action Panel */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Status Hari Ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
          
          <div className="mb-6">
            {currentStatus ? (
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Jam Masuk:</span>
                  <span className="font-semibold text-green-600">{currentStatus.check_in_time}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                   <span className="text-gray-600">Status:</span>
                   <span className={`font-semibold ${currentStatus.is_late ? 'text-red-600' : 'text-blue-600'}`}>
                     {currentStatus.is_late ? 'Terlambat' : 'Tepat Waktu'}
                   </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Jam Pulang:</span>
                  <span className="font-semibold text-orange-600">{currentStatus.check_out_time || '-'}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Belum melakukan absen hari ini.</p>
            )}
          </div>

          {!currentStatus || !currentStatus.id ? (
            // Clock In Section
            <div className="space-y-4">
              {!isCameraActive ? (
                 <div className="border rounded-lg bg-gray-100 flex flex-col items-center justify-center p-8 text-center" style={{ minHeight: '240px' }}>
                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <p className="text-gray-600 mb-4">Silakan pilih metode absensi:</p>
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button 
                            onClick={handleStartAttendance}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium w-full"
                        >
                            Absen Dengan Foto
                        </button>
                        <button 
                            onClick={handleClockIn}
                            className="px-6 py-2 rounded font-medium w-full text-white bg-green-600 hover:bg-green-700"
                        >
                            Absen Tanpa Foto
                        </button>
                    </div>
                 </div>
              ) : (
              <div className="border rounded-lg overflow-hidden bg-black relative flex items-center justify-center" style={{ minHeight: '240px' }}>
                {imgSrc ? (
                  <img src={imgSrc} alt="Selfie" className="w-full h-auto" />
                ) : (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-auto relative z-10"
                      videoConstraints={{ facingMode: "user" }}
                      onUserMedia={handleUserMedia}
                      onUserMediaError={handleUserMediaError}
                    />
                    <div className="absolute z-0 text-white text-sm">Memuat Kamera...</div>
                  </>
                )}
              </div>
              )}
              
              {isCameraActive && (
              <div className="flex space-x-2">
                {!imgSrc ? (
                  <button
                    onClick={capture}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Ambil Foto
                  </button>
                ) : (
                  <button
                    onClick={retake}
                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                  >
                    Foto Ulang
                  </button>
                )}
                
                {imgSrc && (
                   <button
                   onClick={handleClockIn}
                   className="flex-1 py-2 rounded text-white bg-green-600 hover:bg-green-700"
                 >
                   Absen Masuk
                 </button>
                )}
              </div>
              )}
            </div>
          ) : (
             // Clock Out Section
             !currentStatus.check_out_time && (
               <div className="mt-4">
                 <button
                   onClick={handleClockOut}
                   className="w-full py-3 rounded text-white font-bold bg-orange-500 hover:bg-orange-600"
                 >
                   Absen Pulang
                 </button>
               </div>
             )
          )}
        </div>

        {/* Right Column: History */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Riwayat Absensi (30 Hari Terakhir)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Masuk</th>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pulang</th>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td className="px-3 py-4 border-b border-gray-200 bg-white text-sm">
                      {record.date}
                    </td>
                    <td className="px-3 py-4 border-b border-gray-200 bg-white text-sm">
                      {record.check_in_time ? record.check_in_time.slice(0, 5) : '-'}
                    </td>
                    <td className="px-3 py-4 border-b border-gray-200 bg-white text-sm">
                      {record.check_out_time ? record.check_out_time.slice(0, 5) : '-'}
                    </td>
                    <td className="px-3 py-4 border-b border-gray-200 bg-white text-sm">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.is_late ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {record.is_late ? 'Late' : 'On Time'}
                      </span>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                    <tr>
                        <td colSpan="4" className="px-3 py-4 text-center text-gray-500">Belum ada riwayat.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
