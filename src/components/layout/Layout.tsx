import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


function Layout() {


  return(
    <main className="flex flex-col relative   h-screen overflow-y-scroll md:overflow-hidden">
      <div className="flex flex-row h-full font-inter bg-white dark:bg-slate-950 dark:text-slate-50">
        <Sidebar />
        <section className="w-[100%] flex flex-col">
          <Navbar />
          <Outlet />
        </section>
      </div>
    </main>
  )
}

export default Layout;
