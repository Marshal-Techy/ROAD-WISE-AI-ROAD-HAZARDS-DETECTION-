const DebrisIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        <path d="M15 12l-2.5 2.5-2.5-5L7.5 12 5 14.5 2.5 12 5 9.5 7.5 12l2.5-2.5L12.5 12l2.5-2.5L17.5 12l-2.5 2.5z" />
        <path d="M21.5 12L19 14.5l-2.5-2.5L19 9.5l2.5 2.5z" />
    </svg>
);

export default DebrisIcon;
