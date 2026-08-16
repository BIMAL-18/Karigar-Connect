import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-black">
            Karigar Connect
          </h1>
        </div>
      </header>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;