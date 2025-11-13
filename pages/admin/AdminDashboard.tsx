
import React from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { UsersIcon, PaymentsIcon, CreditsIcon } from '../../components/icons/IconComponents';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);


const AdminDashboard: React.FC = () => {
    const { state } = useGlobalState();
    const { users, payments, settings } = state;

    const pendingApprovals = payments.filter(p => p.status === 'pending').length;
    
    const approvedPayments = payments.filter(p => p.status === 'approved');
    const sessionRevenue = approvedPayments.reduce((total, payment) => {
        const pkg = settings.creditPackages.find(p => p.id === payment.packageId);
        return total + (pkg?.price || 0);
    }, 0);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Session Users" value={users.length} icon={<UsersIcon />} color="border-blue-500" />
                <StatCard title="Pending Approvals" value={pendingApprovals} icon={<PaymentsIcon />} color="border-yellow-500" />
                <StatCard title="Session Revenue" value={`৳${sessionRevenue.toLocaleString()}`} icon={<CreditsIcon />} color="border-green-500" />
            </div>
            {/* Additional charts or quick access panels can be added here */}
        </div>
    );
};

export default AdminDashboard;
