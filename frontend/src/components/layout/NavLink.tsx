'use client'
import { usePathname } from 'next/navigation';
import Link from "next/link";

export default function NavLink({children, href, className, activeClassName} : any){
    const pathname = usePathname()
    return (
        <Link href={href} className={`${className} ${pathname === href ? activeClassName : ''}`}>
           {children}
        </Link>
    )
}