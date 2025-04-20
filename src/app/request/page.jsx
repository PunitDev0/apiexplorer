'use client'
import { Children, useState } from "react";
import { ApiExplorer } from "@/components/api-explorer";
import { ExplorerHeader } from "@/components/explorer/header";
import { ExplorerSidebar } from "@/components/explorer/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Layout from "@/components/Layout/Layout";

export default function Example({children}) {

  return (
    <Layout>
          <ApiExplorer />
    </Layout>
  );
}
