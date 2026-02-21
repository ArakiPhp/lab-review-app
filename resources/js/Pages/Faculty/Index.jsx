import { Head, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import AppLayout from '@/Layouts/AppLayout';
import FacultyCard from '../../Components/Faculty/FacultyCard';
import Breadcrumb from '../../Components/Common/Breadcrumb';
import MenuPopover from "@/Components/Common/MenuPopover";
import KebabIcon from "@/Components/Common/KebabIcon";
import EditUniversityModal from "@/Components/University/EditUniversityModal";
import CreateFacultyModal from "@/Components/Faculty/CreateFacultyModal";

const Index = ({ faculties, university, query = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRef = useRef(null);

  const hasResults = faculties.length > 0;

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
   * メニューポップオーバーの「学部を追加する」クリック時の処理
   * @returns {void}
   */
  const handleAddFacultyClick = () => {
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
    router.get(route('university.history', { university: university.id }), { query });
  }

  return (
    <AppLayout title={`${university.name}の学部一覧`}>
      <Head title={`${university.name}の学部一覧`} />
      <div className="flex flex-col items-center min-h-full">
        {/* ヘッダー部分（共通） */}
        <div className="w-full flex flex-row items-center justify-between">
          {/* パンくずリスト 左寄せ */}
          <div>
            <Breadcrumb university={university} query={query} />
          </div>
          {/* 学部件数 + ケバブメニュー 右寄せ */}
          <div className="flex items-center gap-2">
            <p className="text-[#747D8C]">{faculties.length}件の学部</p>
            {/* ケバブメニュー */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full"
              >
                <KebabIcon />
              </button>
              {isMenuOpen && <MenuPopover addLabel="学部を追加する" onAddClick={handleAddFacultyClick} onEditClick={handleEditClick} onViewHistoryClick={handleViewHistoryClick} />}
            </div>
          </div>
        </div>

        {/* コンテンツ部分 */}
        {hasResults ? (
          <div className="w-full grid grid-cols-3 gap-6 mt-8 justify-items-center">
            {faculties.map(faculty => (
              <FacultyCard key={faculty.id} faculty={faculty} query={query} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#747D8C]">まだ学部が登録されていません。</p>
          </div>
        )}
      </div>
      {/* 学部作成モーダル */}
      <CreateFacultyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        university={university}
      />
      {/* 大学編集モーダル */}
      <EditUniversityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        university={university}
      />
    </AppLayout>
  );
};

export default Index;