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
import { useParams } from "next/navigation";
export default function Example({children}) {
 const {workspaceid} = useParams()
 console.log(workspaceid);
 
  return (
    <Layout workspaceid={workspaceid}>
          <ApiExplorer />
    </Layout>
  );
}
