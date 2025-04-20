import { ExplorerWorkspace } from '@/components/explorer/workspace'
import { Navbar } from '@/components/HeroPage/navbar'
import Layout from '@/components/Layout/Layout'
import Workspaces from '@/components/workspace/Workspace'
import React from 'react'

function page() {
  return (
    <>
    <Navbar/>
      <Workspaces/>
    </>
  )
}

export default page
