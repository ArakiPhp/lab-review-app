import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from '@/Components/Common/Modal';

/**
 * コメント一覧モーダルコンポーネント
 * カーソルベースのページネーションでコメントを取得・表示する
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる関数
 * @param {number} props.labId - 研究室ID
 * @param {number} props.totalCount - コメント総数
 */
const CommentListModal = ({ isOpen, onClose, labId, totalCount = 0 }) => {
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  /**
   * コメントをAPIから取得する
   * @param {number|null} cursor - カーソル（次のページの開始位置）
   */
  const fetchComments = useCallback(async (cursor = null) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '20' });
      if (cursor) params.append('cursor', cursor);

      const response = await axios.get(
        route('comment.index', labId),
        { params: { limit: 20, ...(cursor ? { cursor } : {}) } }
      );
      const data = response.data;

      setComments(prev => cursor ? [...prev, ...(data.comments || [])] : (data.comments || []));
      setHasMore(data.hasMore ?? false);
      setNextCursor(data.nextCursor ?? null);
    } catch (error) {
      console.error('コメントの取得に失敗しました', error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [labId]);

  // モーダルが開かれたときにコメントを初期取得する
  useEffect(() => {
    if (isOpen) {
      setComments([]);
      setNextCursor(null);
      setHasMore(false);
      setIsInitialLoad(true);
      fetchComments();
    }
  }, [isOpen, fetchComments]);

  /**
   * 「もっと読み込む」ボタン押下時の処理
   */
  const handleLoadMore = () => {
    if (nextCursor && !isLoading) {
      fetchComments(nextCursor);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`コメント一覧（${totalCount}件）`} size="md">
      <div className="max-h-[400px] overflow-y-auto">
        {isInitialLoad && isLoading ? (
          <p className="text-sm text-[#747D8C] text-center py-4">読み込み中...</p>
        ) : comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="border-b border-gray-200 pb-3">
                <h3 className="text-sm font-medium text-black">
                  {comment.user?.name || '匿名'}
                </h3>
                <p className="text-sm text-[#747D8C] mt-1 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full text-sm text-[#747D8C] hover:text-black hover:underline py-2"
              >
                {isLoading ? '読み込み中...' : 'もっと読み込む'}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-[#747D8C] text-center py-4">コメントがありません</p>
        )}
      </div>
    </Modal>
  );
};

export default CommentListModal;
