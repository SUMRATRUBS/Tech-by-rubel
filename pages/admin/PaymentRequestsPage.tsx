
import React from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { PaymentRequest } from '../../types';

const PaymentRequestsPage: React.FC = () => {
    const { state, approvePayment, rejectPayment } = useGlobalState();
    const { payments } = state;
    
    const pendingPayments = payments.filter(p => p.status === 'pending');

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Payment Verification Queue</h2>
            {pendingPayments.length === 0 ? (
                <p className="text-gray-400">No pending payment requests.</p>
            ) : (
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">User Email</th>
                                    <th scope="col" className="px-6 py-3">Package</th>
                                    <th scope="col" className="px-6 py-3">TrxID</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingPayments.map((payment: PaymentRequest) => (
                                    <tr key={payment.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-medium text-white">{payment.userEmail}</td>
                                        <td className="px-6 py-4">{payment.packageName}</td>
                                        <td className="px-6 py-4 font-mono">{payment.transactionId}</td>
                                        <td className="px-6 py-4">{new Date(payment.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => approvePayment(payment.id)} className="font-medium text-green-500 hover:underline">Approve</button>
                                            <button onClick={() => rejectPayment(payment.id)} className="font-medium text-red-500 hover:underline">Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentRequestsPage;
