import Link from 'next/link';
import { NAV_LINKS } from '@/lib/constants';
import Logo from '@/components/icons/Logo';

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/">
              <Logo />
            </Link>
            <p className="mt-2 text-muted-foreground text-sm">Drive Smarter, Drive Safer.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 md:mb-0">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="text-center md:text-right">
             <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} RoadWise. All Rights Reserved.</p>
             <p className="text-xs text-muted-foreground/80 mt-1">Project by Team Integrated Innovators BLR</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
