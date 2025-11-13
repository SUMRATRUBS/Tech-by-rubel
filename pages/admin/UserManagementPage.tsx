
import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { User } from '../../types';
import Modal from '../../components/Modal';

const UserManagementPage: React.FC = () => {
    const { state, updateUserCredits, toggleUserBlock } = useGlobalState();
    const { users } = state;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [credits, setCredits] = useState(0);

    const openCreditModal = (user: User) => {
        setSelectedUser(user);
        setCredits(user.credits);
        setIsModalOpen(true);
    };

    const handleCreditUpdate = () => {
        if (selectedUser) {
            updateUserCredits(selectedUser.id, credits);
            setIsModalOpen(false);
            setSelectedUser(null);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-white">User Management</h2>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Credits</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4">{user.credits}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isBlocked ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => openCreditModal(user)} className="font-medium text-blue-500 hover:underline">Edit Credits</button>
                                        <button onClick={() => toggleUserBlock(user.id)} className={`font-medium ${user.isBlocked ? 'text-green-500 hover:underline' : 'text-red-500 hover:underline'}`}>
                                            {user.isBlocked ? 'Unblock' : 'Block'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit Credits for ${selectedUser.name}`}>
                    <div className="space-y-4">
                        <p>Current Credits: {selectedUser.credits}</p>
                        <div>
                            <label htmlFor="credits" className="block text-sm font-medium text-gray-300 mb-1">New Credit Amount</label>
                            <input
                                type="number"
                                id="credits"
                                value={credits}
                                onChange={(e) => setCredits(parseInt(e.target.value, 10) || 0)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button onClick={() => setIsModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">Cancel</button>
                            <button onClick={handleCreditUpdate} className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-purple-700">Save Changes</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UserManagementPage;
