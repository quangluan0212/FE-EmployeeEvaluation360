import { Download } from "lucide-react";

const StatsCard = ({ title, icon, count, onClick, onExport, color }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 bg-${color}-100 rounded-full`}>{icon}</div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{count}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExport();
          }}
          className={`flex items-center text-sm text-gray-500 hover:text-${color}-600`}
        >
          <Download className="h-4 w-4 mr-1" />
          Xuất Excel
        </button>
      </div>
    </div>
  );
};

export default StatsCard;
