const AdminStatsCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {value ?? 0}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl">
          {icon}
        </div>

      </div>

    </div>
  );
};

export default AdminStatsCard;