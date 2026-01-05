import { router } from "@inertiajs/react";

/**
 * レビュー作成ボタンコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {string} props.routerName - 遷移先のルート名
 * @param {Object} [props.params={}] - ルートに渡すパラメータ
 * @returns {JSX.Element} コンポーネントのJSX
 */
const CreateReviewButton = ({ routerName, params = {}}) => {
  return (
    <button
        className="p-1 bg-[#EEF7FB] shadow-md rounded-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => router.get(route(routerName, params))}
      >
        <span className="px-14 py-1 block border-2 border-[#33E1ED] rounded text-[#747D8C] font-bold">
          レビューする
        </span>
    </button>
  );
}

export default CreateReviewButton;