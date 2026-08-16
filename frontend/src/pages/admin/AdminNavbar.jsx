const AdminNavbar = () => {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || "{}"
  );

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">

      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Admin Panel
        </h2>
      </div>

      <div className="flex items-center gap-3">

        <div className="text-right">
          <p className="font-medium text-gray-800">
            {userInfo?.name || "Administrator"}
          </p>

          <p className="text-sm text-gray-500">
            Admin
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 font-bold text-white">
          {userInfo?.name
            ? userInfo.name.charAt(0).toUpperCase()
            : "A"}
        </div>

      </div>

    </header>
  );
};

export default AdminNavbar;