import { showToast } from "./sentalert";
import React, { useState, useEffect } from "react";
import axios from "axios"; 

const Personal = ({ userData, setUserData }) => { 
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    email: userData?.email || '',
    telephone: userData?.telephone || '',
    firstname: userData?.firstname || '',
    lastname: userData?.lastname || '',
  });

  useEffect(() => {
    if (userData) {
      setEditedData({
        email: userData.email || '',
        telephone: userData.telephone || '',
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/users/${userData.id}/2`, editedData);

      setUserData({ ...userData, ...editedData });
      showToast("success", response.data.message || "แก้ไขโปรไฟล์สำเร็จ");
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : error.message;
      showToast("error", errorMessage);
    }
    setIsEditing(false);
  };

  return (
    <div className="relative lg:min-w-[400px] mt-0 lg:mt-12 p-6 pb-32 bg-white border border-gray-300 rounded-2xl">
      <p className="mb-6 underline underline-offset-2 decoration-blue-500">จัดการบัญชี</p>
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-xs text-gray-600">อีเมล</p>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editedData.email}
              onChange={handleChange}
              className="text-gray-800 border-b border-gray-400"
            />
          ) : (
            <h1 className="text-gray-800">{userData?.email}</h1>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-600">เบอร์</p>
          {isEditing ? (
            <input
              type="text"
              name="telephone"
              value={editedData.telephone}
              onChange={handleChange}
              className="text-gray-800 border-b border-gray-400"
            />
          ) : (
            <h1 className="text-gray-800">{userData?.telephone}</h1>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-600">ชื่อ - สกุล</p>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                name="firstname"
                value={editedData.firstname}
                onChange={handleChange}
                className="text-gray-800 border-b border-gray-400"
              />
              <input
                type="text"
                name="lastname"
                value={editedData.lastname}
                onChange={handleChange}
                className="text-gray-800 border-b border-gray-400 w-40"
              />
            </div>
          ) : (
            <h1 className="text-gray-800">
              {userData?.firstname} {userData?.lastname}
            </h1>
          )}
        </div>
      </div>

      <div className="absolute left-6 bottom-6 w-full pr-12">
        <div className="flex gap-2 mb-3">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-gray-100 p-2.5 text-sm text-gray-800 whitespace-nowrap rounded-xl transition duration-300 hover:bg-gray-200"
            >
              <i className="far fa-save" /> บันทึกข้อมูล
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full bg-gray-100 p-2.5 text-sm text-gray-800 whitespace-nowrap rounded-xl transition duration-300 hover:bg-gray-200"
            >
              <i className="far fa-edit" /> แก้ไขข้อมูลส่วนตัว
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Personal;
