import React from 'react'
import { SidebarDemo } from '../components/SideBar'

const Page = () => {
  return (
    <SidebarDemo>
        <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex gap-2">
            <div
                className="h-20 w-full text-center py-7 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
            >
                <h1>SETARI</h1>
            </div>
            </div>
        </div>
        </div>
    </SidebarDemo>
  )
}

export default Page