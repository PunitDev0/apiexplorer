"use client";

import { useTheme } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ExplorerSidebar } from "@/components/explorer/sidebar";
import { ExplorerHeader } from "@/components/explorer/header";
import { ExplorerWorkspace } from "@/components/explorer/workspace";
import { FloatingActionButton } from "@/components/explorer/floating-action-button";
import { RequestProvider } from "@/components/explorer/request-context";
import Layout from "./Layout/Layout";


export function ApiExplorer() {
  const { theme, setTheme } = useTheme();

  return (
          <div className="flexh-full flex-1  flex-col">
            <ExplorerWorkspace />
          <FloatingActionButton />
          </div>
  );
} 