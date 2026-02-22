import { Head, router } from "@inertiajs/react";
import AppLayout from '@/Layouts/AppLayout';
import LabCard from '../../Components/Lab/LabCard';
import Pagination from "../../Components/Common/Pagination";
import Breadcrumb from "../../Components/Common/Breadcrumb";
import MenuPopover from "@/Components/Common/MenuPopover";
import KebabIcon from "@/Components/Common/KebabIcon";
import EditFacultyModal from "@/Components/Faculty/EditFacultyModal";
import CreateLabModal from "@/Components/Lab/CreateLabModal";
import { useState, useEffect, useRef } from "react";

/**
 * ソートオプションの定義
 */
const sortOptions = [
  { value: 'overall', label: '総合評価の高い順' },
  { value: 'reviews_count', label: 'レビュー数の多い順' },
  { value: 'mentorship_style', label: '指導スタイルの高い順' },
  { value: 'lab_atmosphere', label: '雰囲気・文化の高い順' },
  { value: 'achievement_activity', label: '成果・活動の高い順' },
  { value: 'constraint_level', label: '拘束度の高い順' },
  { value: 'facility_quality', label: '設備の高い順' },
  { value: 'work_style', label: '働き方の高い順' },
  { value: 'student_balance', label: '人数バランスの高い順' },
];

/**
 * 研究室一覧ページコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {Object} props.labs - ページネーション付き研究室データ
 * @param {Object} props.faculty - 学部オブジェクト
 * @param {string} props.query - 検索クエリ文字列
 * @param {string} props.sort - ソート条件
 * @returns {JSX.Element} コンポーネントのJSX
 */
const Index = ({ labs, faculty, query, sort = 'overall' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRef = useRef(null);
  const hasResults = labs.data.length > 0;

  // 外側クリックでメニューポップオーバーを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  /**
   * メニューポップオーバーの「研究室を追加する」クリック時の処理
   * @returns {void}
   */
  const handleAddLabClick = () => {
    setIsMenuOpen(false);
    setIsCreateModalOpen(true);
  }

  /**
   * メニューポップオーバーの「編集する」クリック時の処理
   * @returns {void}
   */
  const handleEditClick = () => {
    setIsMenuOpen(false);
    setIsEditModalOpen(true);
  }

  /**
   * メニューポップオーバーの「編集履歴を見る」クリック時の処理
   * @returns {void}
   */
  const handleViewHistoryClick = () => {
    setIsMenuOpen(false);
    router.get(route('faculty.history', { faculty: faculty.id }), { query });
  }

  /**
   * メニューポップオーバーの「削除依頼をする」クリック時の処理
   * @returns {void}
   */
  const handleDeletionRequestClick = () => {
    setIsMenuOpen(false);
    router.get(route('deletion_requests.create', { type: 'faculty', id: faculty.id }), { query });
  }

  /**
   * ソート条件変更時のハンドラ
   * @param {Event} e - イベントオブジェクト
   */
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    router.get(route('labs.index', { faculty: faculty.id }), {
      query,
      sort: newSort,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AppLayout title={`${faculty.university.name} ${faculty.name}`}>
      <Head title={`${faculty.university.name} ${faculty.name}`} />

      <div className="flex flex-col items-center min-h-full">
        <div className="w-full flex flex-row items-center justify-between">
          {/* パンくずリスト 左寄せ */}
          <div>
            <Breadcrumb university={faculty.university} faculty={faculty} query={query} />
          </div>
          {/* 研究室件数 + ケバブメニュー 右寄せ＋ソート */}
          <div className="flex items-center gap-2">
            <p className="text-[#747D8C]">{labs.total}件の研究室</p>
            <select
              value={sort}
              onChange={handleSortChange}
              className="text-sm text-[#747D8C] bg-[#EEF5F9] border border-[#747D8C] rounded px-3 py-1 pr-8 outline-none focus:outline-none focus:ring-0 focus:border-[#747D8C]"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* ケバブメニュー */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full"
              >
                <KebabIcon />
              </button>
              {isMenuOpen && <MenuPopover addLabel="研究室を追加する" onAddClick={handleAddLabClick} onEditClick={handleEditClick} onViewHistoryClick={handleViewHistoryClick} onDeletionRequestClick={handleDeletionRequestClick} />}
            </div>
          </div>
        </div>
        {hasResults ? (
          <>
            <div className="w-full max-w-xl space-y-6 mt-8">
              {labs.data.map(lab => (
                <LabCard key={lab.id} lab={lab} query={query} sort={sort} />
              ))}
            </div>
            {/* ページネーション */}
            <Pagination paginator={labs} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#747D8C]">まだ研究室は登録されていません。</p>
          </div>
        )}
      </div>
      {/* 研究室追加モーダル */}
      <CreateLabModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        faculty={faculty}
      />
      {/* 学部編集モーダル */}
      <EditFacultyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        faculty={faculty}
      />
    </AppLayout>
  )
};

export default Index;