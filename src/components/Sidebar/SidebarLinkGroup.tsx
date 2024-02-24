"use client";
import { ReactNode, useState } from "react";
import {
  Codesandbox,
  History,
  Home,
  Layers3,
  LayoutGrid,
  Settings,
  User2,
} from "lucide-react";
import { useSession } from "next-auth/react";


interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
}

const SidebarLinkGroup = ({
  children,
  activeCondition,
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };
  
 const {data:session,status}=useSession();

  const adminLinks = [
   
    {
      title: "Profile",
      icon: User2,
      href: "/profile",
    },
    {
      title: "Members",
      icon: User2,
      href: "/member",
    },
    {
      title: "Staffs",
      icon: User2,
      href: "/staffs",
    },
    {
      title: "Careplan",
      icon: Layers3,
      href: "/careplans",
    },
    {
      title: "Transaction",
      icon: Layers3,
      href: "/transactions",
    },
    {
      title: "Categories",
      icon: LayoutGrid,
      href: "/categories",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];
  const doctorLinks = [
   
    {
      title: "Profile",
      icon: User2,
      href: "/profile",
    },
    {
      title: "Package",
      icon: Layers3,
      href: "/careplans",
    },
    {
      title: "Support",
      icon: LayoutGrid,
      href: "/support",
    },
    
  ];
  const memberLinks = [
    
    {
      title: "Profile",
      icon: User2,
      href: "/profile",
    },
    {
      title: "Package",
      icon: Layers3,
      href: "/careplans",
    },
    {
      title: "Task",
      icon: Layers3,
      href: "/tasks",
    },
    {
      title: "Support",
      icon: LayoutGrid,
      href: "/support",
    },
    
  ];
  const staffLinks = [
    
    {
      title: "Profile",
      icon: User2,
      href: "/profile",
    },
    {
      title: "Update",
      icon: Layers3,
      href: "/update",
    },
 
  ];
  const userLinks = [
 
    {
      title: "Care Plan",
      icon: User2,
      href: "/careplan",
    },
    
    {
      title: "contact",
      icon: Settings,
      href: "/contact",
    },
  ];

  const navLinks=
  session?.user?.role==='ADMIN'
  ?adminLinks
  :session?.user?.role==='DOCTOR'
  ?doctorLinks
  :session?.user?.role==='MEMBER'
  ?memberLinks
  :session?.user?.role==='STAFF'
  ?staffLinks
  :userLinks;
  console.log(navLinks);

  return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;
