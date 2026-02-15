import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import StarRating from '@/Components/Lab/Star/StarRating';
import Breadcrumb from '@/Components/Common/Breadcrumb';
import CreateReviewModal from '@/Components/Review/CreateReviewModal';
import EditReviewModal from '@/Components/Review/EditReviewModal';
import MenuPopover from '@/Components/Common/MenuPopover';
import KebabIcon from '@/Components/Common/KebabIcon';
import EditLabModal from '@/Components/Lab/EditLabModal';
import AlertModal from '@/Components/Common/AlertModal';
import CommentListModal from '@/Components/Comment/CommentListModal';
import { formatRating } from '@/utils/formatRating';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Chart.jsのコンポーネントを登録
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/**
 * 研究室詳細ページコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {Object} props.lab - 研究室オブジェクト
 * @param {Object} props.averagePerItem - 各評価項目の平均値
 * @param {number} props.overallAverage - 総合評価の平均値
 * @param {Array} props.comments - コメント一覧
 * @param {Object} props.auth - 認証情報
 * @param {Object|null} props.userReview - ログインユーザーのレビュー
 * @param {Object|null} props.userBookmark - ログインユーザーのブックマーク
 * @param {number} props.bookmarkCount - ブックマーク数
 * @param {string} props.query - 検索クエリ文字列
 * @returns {JSX.Element} コンポーネントのJSX
 */

const Show = ({
  lab,
  averagePerItem,
  overallAverage,
  comments,
  auth,
  userReview,
  userBookmark,
  bookmarkCount,
  query,
}) => {
  const [isCommentListModalOpen, setIsCommentListModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLabEditModalOpen, setIsLabEditModalOpen] = useState(false);
  const [isReviewEditModalOpen, setIsReviewEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  // 外側クリックでメニューポップオーバーを閉じる
  useEffect(() => {
    const handleClickOutside = event => {
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
   * メニューポップオーバーの「レビューを投稿する」クリック時の処理
   * @returns {void}
   */
  const handleAddReviewClick = () => {
    setIsMenuOpen(false);
    setIsCreateModalOpen(true);
  };

  /**
   * メニューポップオーバーの「編集する」クリック時の処理
   * @returns {void}
   */
  const handleLabEditClick = () => {
    setIsMenuOpen(false);
    setIsLabEditModalOpen(true);
  };

  // ブックマーク状態とカウントをローカルstateで管理
  const [isBookmarked, setIsBookmarked] = useState(auth?.user && userBookmark);
  const [currentBookmarkCount, setCurrentBookmarkCount] = useState(bookmarkCount || 0);
  const [bookmarkId, setBookmarkId] = useState(userBookmark?.id || null);

  /**
   * ブックマークのトグル処理
   * ログインしていない場合は何もしない。
   * 既にブックマーク済みなら解除、未ブックマークなら追加する。
   * @returns {void}
   */
  const handleBookmarkClick = () => {
    // ログインしていない場合は何もしない
    if (!auth?.user) {
      return;
    }

    if (isBookmarked) {
      // ブックマーク解除
      router.delete(route('bookmark.destroy', bookmarkId), {
        preserveScroll: true,
        onSuccess: () => {
          setIsBookmarked(false);
          setCurrentBookmarkCount(prev => Math.max(0, prev - 1));
          setBookmarkId(null);
        },
      });
    } else {
      // ブックマーク追加
      router.post(
        route('bookmark.store'),
        {
          lab_id: lab.id,
        },
        {
          preserveScroll: true,
          onSuccess: page => {
            setIsBookmarked(true);
            setCurrentBookmarkCount(prev => prev + 1);
            // 新しいブックマークIDを取得（ページデータから）
            if (page.props.userBookmark) {
              setBookmarkId(page.props.userBookmark.id);
            }
          },
        }
      );
    }
  };

  // 7つの評価指標のラベル
  const labels = [
    '指導スタイル',
    '雰囲気・文化',
    '成果・活動',
    '拘束度',
    '設備',
    '働き方',
    '人数バランス',
  ];

  // LabControllerから渡された平均評価データを配列に変換
  const averageRatings = averagePerItem
    ? [
        averagePerItem.mentorship_style || 0,
        averagePerItem.lab_atmosphere || 0,
        averagePerItem.achievement_activity || 0,
        averagePerItem.constraint_level || 0,
        averagePerItem.facility_quality || 0,
        averagePerItem.work_style || 0,
        averagePerItem.student_balance || 0,
      ]
    : [0, 0, 0, 0, 0, 0, 0];

  // ログインユーザーのレビューデータを配列に変換
  const userRatings = userReview
    ? [
        userReview.mentorship_style || 0,
        userReview.lab_atmosphere || 0,
        userReview.achievement_activity || 0,
        userReview.constraint_level || 0,
        userReview.facility_quality || 0,
        userReview.work_style || 0,
        userReview.student_balance || 0,
      ]
    : null;

  // レーダーチャートのデータセットを構築
  const datasets = [
    {
      label: '全投稿者の平均評価',
      data: averageRatings,
      backgroundColor: 'rgba(51, 225, 237, 0.2)',
      borderColor: 'rgba(51, 225, 237, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(51, 225, 237, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(51, 225, 237, 1)',
    },
  ];

  // ログインユーザーのレビューがある場合、データセットに追加
  if (userRatings) {
    datasets.push({
      label: 'あなたの投稿済み評価',
      data: userRatings,
      backgroundColor: 'rgba(244, 187, 66, 0.2)',
      borderColor: 'rgba(244, 187, 66, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(244, 187, 66, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(244, 187, 66, 1)',
    });
  }

  // レーダーチャートのデータ
  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  // レーダーチャートのオプション
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
        pointLabels: {
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: context => {
            return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <AppLayout title={`${lab.faculty.university.name} ${lab.faculty.name} ${lab.name}`}>
      <Head title={`${lab.faculty.university.name} ${lab.faculty.name} ${lab.name}`} />
      {/* パンくずリスト＋レビュー投稿状態＋ケバブメニュー 横並び */}
      <div className="w-full flex flex-row items-center justify-between">
        {/* パンくずリスト 左寄せ */}
        <div>
          <Breadcrumb
            university={lab.faculty.university}
            faculty={lab.faculty}
            lab={lab}
            query={query}
          />
        </div>
        {/* レビュー投稿状態 + ケバブメニュー 右寄せ */}
        <div className="flex items-center gap-2">
          {auth?.user && userReview ? (
            <button
              type="button"
              onClick={() => setIsReviewEditModalOpen(true)}
              className="text-[#747D8C] hover:underline cursor-pointer"
            >
              レビューを投稿済みです。
            </button>
          ) : (
            <p className="text-[#747D8C]">まだ、レビューを投稿していません。</p>
          )}
          {/* ケバブメニュー */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full">
              <KebabIcon />
            </button>
            {isMenuOpen && (
              <MenuPopover
                {...(!userReview ? { addLabel: 'レビューを投稿する', onAddClick: handleAddReviewClick } : {})}
                onEditClick={handleLabEditClick}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col min-h-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 左側: レーダーチャート */}
            <div className="flex justify-center items-start">
              <div className="w-full max-w-sm">
                <Radar data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* 右側: 総合評価と研究室概要 */}
            <div>
              {/* 総合評価 */}
              <div className="mb-4">
                <h2 className="text-base font-semibold text-black mb-2">
                  総合評価({lab.reviews?.length || 0})
                </h2>
                {lab.reviews && lab.reviews.length > 0 ? (
                  <div className="flex items-center gap-2 ml-4">
                    <StarRating rating={overallAverage || 0} />
                    <span className="text-sm text-[#F4BB42]">
                      {formatRating(overallAverage, '0.00')}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-[#747D8C] ml-4">まだ評価がありません</p>
                )}
              </div>

              {/* 研究室概要 */}
              <h2 className="text-base font-semibold text-black mb-2">研究室概要</h2>
              <p className="text-sm text-[#747D8C] whitespace-pre-wrap leading-tight ml-4">
                {lab.description || '概要はまだ登録されていません'}
              </p>

              {/* 研究室ページ */}
              <div className="mt-4">
                <h2 className="text-base font-semibold text-black mb-2">研究室ページ</h2>
                {lab.url ? (
                  <a
                    href={lab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#747D8C] hover:text-black hover:underline break-all ml-4"
                  >
                    {lab.url}
                  </a>
                ) : (
                  <p className="text-sm text-[#747D8C] ml-4">URLはまだ登録されていません</p>
                )}
              </div>

              {/* 教授 */}
              <div className="mt-4">
                <h2 className="text-base font-semibold text-black mb-2">教授</h2>
                {lab.professor_name ? (
                  lab.professor_url ? (
                    <a
                      href={lab.professor_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#747D8C] hover:text-black hover:underline break-all ml-4"
                    >
                      {`${lab.professor_name} 先生`}
                    </a>
                  ) : (
                    <p className="text-sm text-[#747D8C] ml-4">{`${lab.professor_name} 先生`}</p>
                  )
                ) : (
                  <p className="text-sm text-[#747D8C] ml-4">教授名はまだ登録されていません</p>
                )}
              </div>

              {/* 男女比 */}
              <div className="mt-4">
                <h2 className="text-base font-semibold text-black mb-2">
                  男女比
                  {lab.gender_ratio_male != null &&
                    lab.gender_ratio_female != null &&
                    `(${lab.gender_ratio_male}:${lab.gender_ratio_female})`}
                </h2>
                {lab.gender_ratio_male != null && lab.gender_ratio_female != null ? (
                  <div className="flex w-full h-6 rounded overflow-hidden text-sm text-white font-medium ml-4">
                    {lab.gender_ratio_male > 0 && (
                      <div
                        className="flex items-center justify-center"
                        style={{
                          backgroundColor: '#7BB3CE',
                          width: `${(lab.gender_ratio_male / (lab.gender_ratio_male + lab.gender_ratio_female)) * 100}%`,
                        }}
                      >
                        男
                      </div>
                    )}
                    {lab.gender_ratio_female > 0 && (
                      <div
                        className="flex items-center justify-center"
                        style={{
                          backgroundColor: '#E89EB9',
                          width: `${(lab.gender_ratio_female / (lab.gender_ratio_male + lab.gender_ratio_female)) * 100}%`,
                        }}
                      >
                        女
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#747D8C] ml-4">男女比はまだ登録されていません</p>
                )}
              </div>

              {/* コメント一覧 */}
              <div className="mt-4">
                <h2 className="text-base font-semibold text-black mb-2">
                  {comments?.length || 0}件のコメント
                </h2>
                {comments && comments.length > 0 ? (
                  <div className="space-y-3 ml-4">
                    {/* 最初の1件は常に表示 */}
                    <div key={comments[0].id} className="border-b border-gray-200 pb-3">
                      <h3 className="text-sm font-medium text-black">
                        {comments[0].user?.name || '匿名'}
                      </h3>
                      <p className="text-sm text-[#747D8C] mt-1 whitespace-pre-wrap">
                        {comments[0].content}
                      </p>
                    </div>

                    {/* 2件以上の場合、もっと見るボタンを表示 */}
                    {comments.length > 1 && (
                      <button
                        onClick={() => setIsCommentListModalOpen(true)}
                        className="text-sm text-[#747D8C] hover:text-black hover:underline"
                      >
                        もっと見る...
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#747D8C] ml-4">まだコメントがありません</p>
                )}
              </div>

              {/* ブックマークアイコン */}
              <div className="mt-4 flex items-center justify-end">
                <div className="flex items-center gap-1 min-w-[50px] justify-end">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleBookmarkClick}
                    className={`flex-shrink-0 ${auth?.user ? 'cursor-pointer hover:opacity-70' : 'cursor-default'}`}
                  >
                    <path
                      d="M5 2C4.44772 2 4 2.44772 4 3V21C4 21.3746 4.21048 21.7178 4.54555 21.8892C4.88062 22.0606 5.28335 22.0315 5.59026 21.8137L12 17.229L18.4097 21.8137C18.7166 22.0315 19.1194 22.0606 19.4545 21.8892C19.7895 21.7178 20 21.3746 20 21V3C20 2.44772 19.5523 2 19 2H5Z"
                      fill={isBookmarked ? '#747D8C' : 'transparent'}
                      stroke="#747D8C"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="text-sm text-gray-600 tabular-nums min-w-[1.5ch] text-left">
                    {currentBookmarkCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* レビュー作成モーダル */}
      <CreateReviewModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        lab={lab}
      />
      {/* レビュー編集モーダル */}
      <EditReviewModal
        isOpen={isReviewEditModalOpen}
        onClose={() => setIsReviewEditModalOpen(false)}
        review={userReview}
        onDelete={() => {
          setIsReviewEditModalOpen(false);
          setIsDeleteAlertOpen(true);
        }}
      />

      {/* レビュー削除確認モーダル */}
      <AlertModal
        isOpen={isDeleteAlertOpen}
        onClose={() => {
          setIsDeleteAlertOpen(false);
          setIsReviewEditModalOpen(true);
        }}
        title="レビューの削除"
        message="投稿済みのレビューを削除します。本当に削除しますか？"
        actionLabel="削除する"
        cancelLabel="キャンセル"
        isProcessing={isDeleting}
        onAction={() => {
          setIsDeleting(true);
          router.delete(route('review.destroy', userReview.id), {
            preserveScroll: true,
            onSuccess: () => {
              setIsDeleteAlertOpen(false);
              setIsDeleting(false);
            },
            onError: () => {
              setIsDeleting(false);
            },
          });
        }}
      />

      {/* 研究室編集モーダル */}
      <EditLabModal
        isOpen={isLabEditModalOpen}
        onClose={() => setIsLabEditModalOpen(false)}
        lab={lab}
      />

      {/* コメント一覧表示モーダル */}
      <CommentListModal
        isOpen={isCommentListModalOpen}
        onClose={() => setIsCommentListModalOpen(false)}
        labId={lab.id}
        totalCount={comments?.length || 0}
      />
    </AppLayout>
  );
};

export default Show;
