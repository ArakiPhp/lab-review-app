import { router } from "@inertiajs/react";

const FacultyCard = ({ faculty, query }) => {
  return (
    <div
      className="bg-[#EEF7FB] rounded-lg shadow-md px-4 py-2 hover:shadow-lg transition-shadow cursor-pointer
                 flex items-center justify-center w-full max-w-[250px] min-h-[56px]"
      onClick={() => router.get(route('labs.index', { faculty: faculty.id, query }))}
    >
      <span
        className="text-2xl font-bold text-[#747D8C] text-center leading-tight truncate w-full"
        title={faculty.name}
      >
        {faculty.name}
      </span>
    </div>
  );
};

export default FacultyCard;
