import React, { useEffect, useState } from "react";
import Sidebar_User from "./Sidebar_User";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserEditProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("accessToken");
        const id = localStorage.getItem("id");
        
        if (!token || !id) {
          setError("Please login to edit your profile");
          return;
        }

        console.log("Fetching user details with:", { id, token });
        
        const res = await axios.post(
          "http://localhost:3000/user/details",
          {
            id: id,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );

        console.log("User details response:", res.data);

        if (!res.data) {
          setError("Failed to load user details");
          return;
        }

        setName(res.data.name || "");
        setPhone(res.data.phone || "");
      } catch (err) {
        console.error("Error fetching user details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to load profile details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setUpdateSuccess(false);
      
      const token = localStorage.getItem("accessToken");
      const id = localStorage.getItem("id");
      
      if (!token || !id) {
        setError("Please login to update your profile");
        return;
      }

      const updateData = {
        userId: id,
        name: name,
        phone: phone,
      };

      if (password) {
        updateData.password = password;
      }

      console.log("Updating user with data:", updateData);

      const res = await axios.post(
        "http://localhost:3000/user/update",
        updateData,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );

      console.log("Update response:", res.data);

      if (res.status === 200) {
        setUpdateSuccess(true);
        setPassword(""); // Clear password after successful update
        setTimeout(() => {
          navigate("/user/profile");
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating profile:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200">
        <Sidebar_User />
        <div className="ml-64 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200">
      <Sidebar_User />
      <div className="ml-64 p-6 sm:p-10">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-purple-900 mb-8">Edit Profile</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {updateSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600">Profile updated successfully! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-purple-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-1">
                New Password (optional)
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-purple-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserEditProfile;
