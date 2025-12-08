import { router } from "@inertiajs/react";
import TypeBadge from "./TypeBadge";

const UniversityCard = ({ university }) => {
  return (
    <div
      className="bg-[#EEF7FB] rounded-lg shadow-md px-4 py-3 hover:shadow-lg transition-shadow cursor-pointer flex items-center gap-4"
      onClick={() => router.get(`/universities/${university.id}/faculties`)}
    >
      <TypeBadge type={university.type} className="flex-shrink-0 text-3xl" />
      <span className="text-2xl font-bold text-[#747D8C]">
        {university.name}
      </span>
    </div>
  );
}

export default UniversityCard;