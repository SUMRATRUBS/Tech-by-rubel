
import React from 'react';

const iconProps = {
    className: "w-6 h-6",
    strokeWidth: 1.5,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor"
};

export const DashboardIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.085-1.085-1.085m1.085 1.085V18m-1.085-1.085l1.085 1.085m0 0l1-1.085m-1.085 1.085L12 21.75l2.146-2.146m0 0l1.085-1.085-1.085-1.085m0 0h-2.25m-7.5 0h7.5" /></svg>
);

export const GenerateIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624l.21-1.031a2.25 2.25 0 00-1.634-2.528l-1.03- .212a2.25 2.25 0 00-2.53 1.634L12 21.75l.48 2.373a2.25 2.25 0 002.53 1.634l1.03.212a2.25 2.25 0 001.634-2.528l-.21-1.031z" /></svg>
);

export const CreditsIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m-6 2.25h6M12 9.75l1.5 1.5-1.5 1.5M12 14.25l1.5-1.5-1.5-1.5M3.75 9.75l-1.5 1.5 1.5 1.5M3.75 14.25l-1.5-1.5 1.5-1.5" /></svg>
);

export const UsersIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 5.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
);

export const PaymentsIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.75 11 12 11c-.75 0-1.536.21-2.121.659l-.879.659zM12 6a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>
);

export const SettingsIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
);

export const LogoutIcon = () => (
    <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
);

export const CloseIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
