import React, { useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";

const PostTuition = () => {
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const tuitionData = {
      studentName: user?.displayName,
      studentEmail: user?.email,
      subject: form.subject.value,
      location: form.location.value,
      salary: form.salary.value,
      description: form.description.value,
      status: "pending", // Admin will approve this
      createdAt: new Date(),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/tuitions`,
        tuitionData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.insertedId) {
        toast.success("Tuition post published successfully!");
        form.reset();
      }
    } catch (err) {
      toast.error("Failed to post tuition");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Post New Tuition
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              name="subject"
              type="text"
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Mathematics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary (BDT)
            </label>
            <input
              name="salary"
              type="number"
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: 5000"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            name="location"
            type="text"
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: Mirpur, Dhaka"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows="4"
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Detail your requirements..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-200"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default PostTuition;
