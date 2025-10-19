const PotholeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 8a6 6 0 0 0-6 6" />
        <path d="M18 12h-6" />
        <path d="m8 12 4 4" />
        <path d="M12 2v4" />
        <path d="m4.93 4.93 2.83 2.83" />
        <path d="m16.24 7.76 2.83-2.83" />
    </svg>
);

export default PotholeIcon;
