"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; 
import { Button } from "@/components/ui/button";
import { PanelLeft, Plus, History, Moon, Sun, Share2, Download, HelpCircle, User, Bell, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Navbar({ toggleSidebar, toggleTheme, isDarkMode }) {
  const { user, loading, logout } = useContext(AuthContext); // Get user, loading, and logout from AuthContext

  return (
    <header className="flex h-14 items-center border-b border-gray-800 px-4 bg-black sticky top-0 z-10 shadow-md">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-100 tracking-tight">API Explorer</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Create a new request</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="outline"
          size="icon"
          className="md:hidden bg-gray-900 text-gray-200 border-gray-700 hover:bg-gray-800 hover:text-white rounded-full transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <div className="hidden md:flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
                >
                  <History className="h-5 w-5" />
                  <span className="sr-only">History</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">View history</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Share request</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
                >
                  <Download className="h-5 w-5" />
                  <span className="sr-only">Download</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Export request</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="border-l border-gray-800 h-6 mx-2 hidden md:block" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-400 hover:text-white hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-600 text-white border-gray-800">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-400 hover:text-white hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Toggle theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
              >
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Help</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-gray-200 border-gray-700">Help & Documentation</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-800/80 rounded-full transition-all duration-200 p-2"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 text-gray-200 border-gray-800 shadow-lg">
            {user ? (
              <>
                <DropdownMenuLabel className="text-gray-100 font-semibold">
                  {user.name} {/* Display user's name */}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">
                  {user.email} {/* Display user's email */}
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">Profile</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">Settings</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">API Keys</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  onClick={logout} // Trigger logout function
                  className="hover:bg-gray-800 focus:bg-gray-800"
                >
                  Log out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuLabel className="text-gray-100 font-semibold">Guest</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  onClick={() => window.location.href = "/login"} // Redirect to login if not authenticated
                  className="hover:bg-gray-800 focus:bg-gray-800"
                >
                  Log in
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}