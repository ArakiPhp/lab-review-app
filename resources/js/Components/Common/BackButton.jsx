import { router } from "@inertiajs/react";

const BackButton = ({ routerName, params = {}}) => {
  return (
    <button
        className="px-16 py-2 bg-[#EEF7FB] text-[#747D8C] shadow-md font-bold rounded-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => router.get(route(routerName, params))}
      >
        戻る
    </button>
  );
}

export default BackButton;