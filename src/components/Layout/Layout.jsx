"use client";
import { useState, useEffect } from "react";
import { ExplorerHeader } from "@/components/explorer/header";
import { ExplorerSidebar } from "@/components/explorer/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Navbar } from "../HeroPage/navbar";

export default function Layout({ children, workspaceid }) {
  const [sidebarWidth, setSidebarWidth] = useState(18); // Default width
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load sidebar width from localStorage after component mounts (client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedWidth = parseInt(localStorage.getItem("sidebarWidth"));
      if (!isNaN(storedWidth)) {
        setSidebarWidth(storedWidth);
        setIsCollapsed(storedWidth < 10);
      }
    }
  }, []);

  // Save sidebar width to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarWidth", sidebarWidth.toString());
    }
  }, [sidebarWidth]);

  const handleResize = (size) => {
    const newSize = size < 10 ? 5 : Math.min(size, 40);
    setSidebarWidth(newSize);
    setIsCollapsed(newSize < 10);
  };


  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1"
      >
        <ResizablePanel
          defaultSize={sidebarWidth}
          minSize={5}
          maxSize={40}
          onResize={handleResize}
          className="transition-all duration-200 ease-out"
        >
          <ExplorerSidebar 
            sidebarWidth={sidebarWidth}
            isCollapsed={isCollapsed}
            workspaceid={workspaceid}
          />
        </ResizablePanel>

        <ResizableHandle 
          withHandle 
          className="bg-gray-200 dark:bg-gray-800"
        />

        <ResizablePanel className="flex flex-col">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}