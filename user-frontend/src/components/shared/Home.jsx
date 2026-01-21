
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Welcome Home 🏠
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          This is your home page. You can customize it as you like!
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md">
          Explore Dashboard
        </button>
      </div>
    </div>
  );
};

export default Home;

