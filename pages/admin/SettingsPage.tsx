
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { PaymentDetails, CreditPackage } from '../../types';
import Modal from '../../components/Modal';
import { CloseIcon } from '../../components/icons/IconComponents';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
    const { state, updatePaymentSettings, setQrCode, addCreditPackage, updateCreditPackage, deleteCreditPackage } = useGlobalState();
    const { settings } = state;

    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(settings.paymentDetails);
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);
    const [newPackage, setNewPackage] = useState({ name: '', credits: 0, price: 0 });

    const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
    };

    const handlePaymentSubmit = (e: FormEvent) => {
        e.preventDefault();
        updatePaymentSettings(paymentDetails);
    };

    const handleQrUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrCode(reader.result as string);
            };
            reader.onerror = () => {
                toast.error("Failed to read file.");
            }
            reader.readAsDataURL(file);
        }
    };

    const openPackageModal = (pkg: CreditPackage | null) => {
        setEditingPackage(pkg);
        if (pkg) {
            setNewPackage({ name: pkg.name, credits: pkg.credits, price: pkg.price });
        } else {
            setNewPackage({ name: '', credits: 0, price: 0 });
        }
        setIsPackageModalOpen(true);
    };

    const handlePackageSubmit = () => {
        if (editingPackage) {
            updateCreditPackage({ ...editingPackage, ...newPackage });
        } else {
            addCreditPackage(newPackage);
        }
        setIsPackageModalOpen(false);
    };
    
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Full Website Configuration</h2>
            
            {/* Payment Settings */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Payment Settings</h3>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Method Name</label>
                            <input name="methodName" value={paymentDetails.methodName} onChange={handlePaymentChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Account Number</label>
                            <input name="accountNumber" value={paymentDetails.accountNumber} onChange={handlePaymentChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"/>
                        </div>
                    </div>
                     <div className="flex items-end space-x-4">
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-gray-300 mb-1">QR Code</label>
                            <div className="flex items-center space-x-4">
                                <img src={paymentDetails.qrCodeUrl} alt="QR Code" className="w-24 h-24 rounded-md bg-white p-1"/>
                                <label htmlFor="qr-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Upload New QR
                                    <input id="qr-upload" type="file" className="hidden" accept="image/*" onChange={handleQrUpload} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-brand-purple text-white px-6 py-2 rounded-md hover:bg-purple-700">Save Payment Settings</button>
                    </div>
                </form>
            </div>

            {/* Credit Packages */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Credit Packages</h3>
                    <button onClick={() => openPackageModal(null)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Add New Package</button>
                </div>
                <div className="space-y-3">
                    {settings.creditPackages.map(pkg => (
                        <div key={pkg.id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-white">{pkg.name}</p>
                                <p className="text-sm text-gray-300">{pkg.credits} Credits for ৳{pkg.price}</p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => openPackageModal(pkg)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                <button onClick={() => deleteCreditPackage(pkg.id)} className="text-red-400 hover:text-red-300">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Package Modal */}
            <Modal isOpen={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} title={editingPackage ? "Edit Credit Package" : "Add New Credit Package"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Package Name</label>
                        <input value={newPackage.name} onChange={e => setNewPackage({...newPackage, name: e.target.value})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Credits</label>
                        <input type="number" value={newPackage.credits} onChange={e => setNewPackage({...newPackage, credits: parseInt(e.target.value) || 0})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Price (৳)</label>
                        <input type="number" value={newPackage.price} onChange={e => setNewPackage({...newPackage, price: parseInt(e.target.value) || 0})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                    </div>
                     <div className="flex justify-end pt-2">
                        <button onClick={() => setIsPackageModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">Cancel</button>
                        <button onClick={handlePackageSubmit} className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-purple-700">Save Package</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SettingsPage;
