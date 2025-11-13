
import React, { useState, FormEvent } from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { APP_NAME } from '../../constants';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, signup } = useGlobalState();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      login(email, password);
    } else {
      signup(name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-brand-purple">{APP_NAME}</h1>
            <p className="text-gray-400 mt-2">The future of image generation is here.</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8">
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setIsLoginView(true)}
              className={`w-1/2 py-3 text-sm font-semibold transition-colors duration-300 ${isLoginView ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-400 hover:text-white'}`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setIsLoginView(false)}
              className={`w-1/2 py-3 text-sm font-semibold transition-colors duration-300 ${!isLoginView ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-400 hover:text-white'}`}
            >
              SIGN UP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLoginView}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple transition"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-purple text-white font-bold py-3 rounded-md hover:bg-purple-700 transition-transform transform hover:scale-105 duration-300"
            >
              {isLoginView ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
