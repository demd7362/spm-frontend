import React, {useContext, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link, useLocation} from "react-router-dom";
import {ContextStore} from "../../router/AppRouter";
import {IoLogInOutline, IoPersonAddOutline} from "react-icons/io5";

interface MenuItem {
    label: string;
    path?: string;
    subMenuItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
    { label: 'AI Chat', path: '/chat' },
    {
        label: '게시판',
        subMenuItems: [
            { label: '방명록', path: '/board/1' },
        ],
    },
];

export default function Menu() {
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const location = useLocation();
    const {menu} = useContext(ContextStore);

    const toggleMenu = (label: string) => {
        setOpenMenus((prevOpenMenus) =>
            prevOpenMenus.includes(label)
                ? prevOpenMenus.filter((menu) => menu !== label)
                : [...prevOpenMenus, label]
        );
    };

    return (
        <div className="fixed inset-y-0 left-0 bg-gray-800 text-white w-64 overflow-y-auto flex flex-col">
            <div className="px-4 py-6 flex-grow">
                {menuItems.map((menuItem) => (
                    <div key={menuItem.label} className="mb-4">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleMenu(menuItem.label)}>
                            {menuItem.path ? (
                                <Link to={menuItem.path} className={`${
                                    location.pathname === menuItem.path ? 'text-blue-500' : ''
                                }`}>
                                    {menuItem.label}
                                </Link>
                            ) : (
                                <span>{menuItem.label}</span>
                            )} {menuItem.subMenuItems && (
                            <span>
                  {openMenus.includes(menuItem.label) ? '-' : '+'}
                </span>
                        )}
                        </div>
                        <AnimatePresence>
                            {menuItem.subMenuItems && openMenus.includes(menuItem.label) && (
                                <motion.div initial={{height: 0, opacity: 0}} animate={{
                                    height: 'auto',
                                    opacity: 1
                                }} exit={{height: 0, opacity: 0}} transition={{duration: 0.3}} className="pl-4 mt-2">
                                    {menuItem.subMenuItems.map((subMenuItem) => (
                                        <div key={subMenuItem.label} className="mb-2">
                                            {subMenuItem.path ? (
                                                <Link to={subMenuItem.path} className={`${
                                                    location.pathname === subMenuItem.path
                                                        ? 'text-blue-500'
                                                        : ''
                                                }`}>
                                                    {subMenuItem.label}
                                                </Link>
                                            ) : (
                                                <span>{subMenuItem.label}</span>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
            <div className="text-white pl-3 pb-6">{menu.authMenu}</div>
        </div>
    );
};
