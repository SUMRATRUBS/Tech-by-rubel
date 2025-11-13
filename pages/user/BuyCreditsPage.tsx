
import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import Modal from '../../components/Modal';
import { CreditPackage } from '../../types';

const BuyCreditsPage: React.FC = () => {
    const { state, requestPayment } = useGlobalState();
    const { settings } = state;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
    const [transactionId, setTransactionId] = useState('');

    const handleBuyNow = (pkg: CreditPackage) => {
        setSelectedPackage(pkg);
        setIsModalOpen(true);
    };

    const handlePaymentSubmit = () => {
        if (selectedPackage && transactionId.trim()) {
            requestPayment(selectedPackage.id, transactionId);
            setIsModalOpen(false);
            setTransactionId('');
            setSelectedPackage(null);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Buy Credits</h2>
            <p className="text-gray-400 mb-8">Choose a package that suits your needs. After sending the payment, enter the Transaction ID to submit your request.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {settings.creditPackages.map(pkg => (
                    <div key={pkg.id} className="bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col text-center items-center transform hover:-translate-y-2 transition-transform duration-300">
                        <h3 className="text-2xl font-semibold text-brand-purple">{pkg.name}</h3>
                        <p className="text-5xl font-bold my-4 text-white">{pkg.credits}</p>
                        <p className="text-gray-400 mb-6">Credits</p>
                        <div className="text-3xl font-bold text-green-400 mb-6">
                            ৳{pkg.price}
                        </div>
                        <button 
                            onClick={() => handleBuyNow(pkg)}
                            className="w-full bg-brand-purple text-white font-bold py-3 rounded-md hover:bg-purple-700 transition-colors duration-300"
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>

            {selectedPackage && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Purchase ${selectedPackage.name}`}>
                    <div className="space-y-4 text-gray-300">
                        <p>To purchase <span className="font-bold text-white">{selectedPackage.credits} credits</span> for <span className="font-bold text-green-400">৳{selectedPackage.price}</span>, please follow the instructions below:</p>
                        
                        <div className="bg-gray-700 p-4 rounded-lg text-center">
                            <p className="text-sm">Send payment via <span className="font-semibold">{settings.paymentDetails.methodName}</span> to:</p>
                            <p className="text-lg font-bold text-white my-1">{settings.paymentDetails.accountNumber}</p>
                            <div className="mt-4 flex justify-center">
                                {settings.paymentDetails.qrCodeUrl && <img src={settings.paymentDetails.qrCodeUrl} alt="Payment QR Code" className="w-40 h-40 rounded-md" />}
                            </div>
                        </div>

                        <p>After completing the payment, enter the Transaction ID (TrxID) below and submit.</p>

                        <div>
                            <label htmlFor="trxId" className="block text-sm font-medium text-gray-300 mb-1">Transaction ID (TrxID)</label>
                            <input
                                type="text"
                                id="trxId"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple transition"
                                placeholder="Enter your TrxID here"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="mr-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaymentSubmit}
                                disabled={!transactionId.trim()}
                                className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-purple-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default BuyCreditsPage;
