import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const router = useRouter();
    const pathname = usePathname();
//    const userMenuRef = useRef<menu>(null);
    const navigationItems = [
        {name: "Home", href: "/", icon: "pi pi-home"},
        {name: "Usuarios", href: "/users", icon: "pi pi-user"},
        {name: "Roles", href: "/roles", icon: "pi pi-pencil"},
        {name: "Vacaciones", href: "/vacations", icon: "pi pi-car"}

    ]

//    const topbarItems: Menu

    ]


  return (
    <div className="min-h-screen w-full flex items-center justify-center">
        
        {children}
    </div> 
  );
}