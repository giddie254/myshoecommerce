// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark px-4 py-10">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden grid md:grid-cols-2">
        {/* Side Banner */}
        <div className="hidden md:flex items-center justify-center bg-primary text-white p-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isLogin ? 'Welcome Back!' : 'Join SokoHive Today'}
            </h2>
            <p className="text-sm">
              {isLogin
                ? 'Login to explore amazing products at unbeatable deals.'
                : 'Create an account to enjoy personalized shopping experiences.'}
            </p>
          </div>
        </div>

        {/* Form Area */}
        <div className="p-8 md:p-10">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isLogin ? 'Login to SokoHive' : 'Create Your SokoHive Account'}
          </h1>
          <AuthForm isLogin={isLogin} toggleMode={() => setIsLogin(!isLogin)} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
