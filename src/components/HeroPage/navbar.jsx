"use client";

import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  PanelLeft, Plus, History, Moon, Sun, Share2, Download, HelpCircle,
  User, Bell, Zap, LogOut, Settings, Key,
} from "lucide-react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Auth/logo";
import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar({ toggleSidebar, toggleTheme, isDarkMode }) {
  const { user, logout } = useContext(AuthContext); // Get user and logout from AuthContext
  const [notifications, setNotifications] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const badgeVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
    },
  };

  const handleNotificationClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setNotifications(0);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <header className="flex h-14 items-center border-b border-gray-800 px-4 bg-black sticky top-0 shadow-md">
      <Link href={'/'} className="flex items-center gap-3">
        <Logo className="h-8 w-8 md:h-10 md:w-10" /> {/* Responsive size */}
        <p
          className="text-base md:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6800] to-purple-300 whitespace-nowrap"
        >
          API Explorer
        </p>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link href={'/request'}>
             <Button
                variant="outline"
                size="sm"
                className="gap-2 hidden md:flex bg-gray-900 text-gray-200 border-gray-700 hover:bg-gray-800 hover:text-white transition-colors duration-200 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">New Request</span>
              </Button>
             </Link>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Create a new request</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden bg-[#FF6800] text-white border-[#FF6800] hover:bg-[#E65C00] rounded-full transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </motion.div>

        {user ? ( // If user is authenticated
          <>
            <div className="hidden md:flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-[#FF6800] hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
                      >
                        <History className="h-5 w-5" />
                        <span className="sr-only">History</span>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">View history</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-[#FF6800] hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
                      >
                        <Share2 className="h-5 w-5" />
                        <span className="sr-only">Share</span>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Share request</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-[#FF6800] hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
                      >
                        <Download className="h-5 w-5" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Export request</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="border-l border-gray-800 h-6 mx-2 hidden md:block" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div variants={buttonVariants} whileHover="hoverA" whileTap="tap">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNotificationClick}
                      className="relative text-gray-400 hover:text-[#FF6800] hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
                    >
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <motion.div
                          variants={badgeVariants}
                          initial="initial"
                          animate={isAnimating ? "animate" : "initial"}
                          className="absolute -top-1 -right-1"
                        >
                          <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-600 text-white border-gray-800">
                            {notifications}
                          </Badge>
                        </motion.div>
                      )}
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Notifications</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-gray-400 hover:text-[#FF6800] hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
                    >
                      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Toggle theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-[#FF6800] hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
                    >
                      <HelpCircle className="h-5 w-5" />
                      <span className="sr-only">Help</span>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Help & Documentation</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-[#FF6800] hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 text-gray-200 border-gray-800 shadow-lg w-48">
                <DropdownMenuLabel className="text-[#FF6800] font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" /> {user.name} {/* Display user's name */}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 flex items-center gap-2">
                  <User className="h-4 w-4" /> {user.email} {/* Display user's email */}
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800 flex items-center gap-2">
                  <Key className="h-4 w-4" /> API Keys
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  onClick={logout} // Trigger logout function
                  className="hover:bg-gray-800 focus:bg-gray-800 flex items-center gap-2 text-red-400"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : ( // If user is not authenticated
          <div className="flex items-center gap-2">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-[#FF6800] border-[#FF6800] hover:bg-[#FF6800] hover:text-white transition-colors duration-200 shadow-sm"
                >
                  Login
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link href="/signup">
                <Button
                  variant="solid"
                  size="sm"
                  className="bg-[#FF6800] text-white border-[#FF6800] hover:bg-[#E65C00] transition-colors duration-200 shadow-sm"
                >
                  Signup
                </Button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </header>
  );
}