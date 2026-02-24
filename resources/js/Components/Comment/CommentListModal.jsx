import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import Modal from '@/Components/Common/Modal';
import EditIcon from '@/Assets/icons/edit.svg';
import TrashIcon from '@/Assets/icons/trash.svg';

/**
 * コメント一覧モーダルコンポーネント
 * カーソルベースのページネーションでコメントを取得・表示する
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる関数
 * @param {number} props.labId - 研究室ID
 * @param {number} props.totalCount - コメント総数
 * @param {Function} props.onCommentPosted - コメント投稿後のコールバック
 * @param {Function} props.onDelete - 削除アイコン押下時のコールバック（コメントオブジェクトを引数に受け取る）
 */
const CommentListModal = ({ isOpen, onClose, labId, totalCount = 0, onCommentPosted, onDelete }) => {
  const { auth } = usePage().props;
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createValidationError, setCreateValidationError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editValidationError, setEditValidationError] = useState('');
  const textareaRef = useRef(null);
  const editTextareaRef = useRef(null);

  /**
   * テキストエリアの高さを内容に応じて自動調整する
   */
  const adjustTextareaHeight = (ref = textareaRef) => {
    const textarea = ref.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

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
        route('comments.index', labId),
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

  // 編集テキストエリアが表示されたとき高さを自動調整する
  useEffect(() => {
    if (editingCommentId !== null && editTextareaRef.current) {
      adjustTextareaHeight(editTextareaRef);
      editTextareaRef.current.focus();
    }
  }, [editingCommentId]);

  // モーダルが開かれたときにコメントを初期取得する
  useEffect(() => {
    if (isOpen) {
      setComments([]);
      setNextCursor(null);
      setHasMore(false);
      setIsInitialLoad(true);
      setIsFocused(false);
      setNewComment('');
      setCreateValidationError('');
      setEditingCommentId(null);
      setEditContent('');
      setEditValidationError('');
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

  /**
   * コメント投稿処理
   */
  const handleCreateSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setCreateValidationError('');
    try {
      await axios.post(route('comments.store', labId), {
        content: newComment,
      });
      setNewComment('');
      setIsFocused(false);
      // コメント一覧を再取得
      setComments([]);
      setNextCursor(null);
      setHasMore(false);
      fetchComments();
      onCommentPosted?.();
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        setCreateValidationError(errors?.content?.[0] || 'バリデーションエラーが発生しました。');
      } else {
        console.error('コメントの投稿に失敗しました', error);
        setCreateValidationError('コメントの投稿に失敗しました。');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * キャンセルボタン押下時の処理
   */
  const handleCancel = () => {
    setNewComment('');
    setCreateValidationError('');
    setIsFocused(false);
  };

  /**
   * 編集モードを開始する
   * @param {Object} comment - 編集対象のコメント
   */
  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setEditValidationError('');
  };

  /**
   * 編集キャンセル処理
   */
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent('');
    setEditValidationError('');
  };

  /**
   * 編集送信処理
   */
  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;

    setIsEditSubmitting(true);
    setEditValidationError('');
    try {
      await axios.put(route('comments.update', editingCommentId), {
        content: editContent,
      });
      setEditingCommentId(null);
      setEditContent('');
      // コメント一覧を再取得
      setComments([]);
      setNextCursor(null);
      setHasMore(false);
      fetchComments();
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        setEditValidationError(errors?.content?.[0] || 'バリデーションエラーが発生しました。');
      } else {
        console.error('コメントの編集に失敗しました', error);
        setEditValidationError('コメントの編集に失敗しました。');
      }
    } finally {
      setIsEditSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`コメント一覧（${totalCount}件）`} size="md">
      <div className="min-h-[60vh] max-h-[60vh] overflow-y-auto">
        {/* コメント投稿フォーム */}
        {auth?.user && (
          <div className="mb-4 border-b border-gray-200 pb-4">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                setCreateValidationError('');
                adjustTextareaHeight();
              }}
              onFocus={() => setIsFocused(true)}
              placeholder="コメントを入力..."
              rows={1}
              maxLength={1000}
              disabled={isSubmitting}
              className="w-full border-0 border-b border-gray-200 bg-[#EEF7FB] px-3 py-2 text-sm resize-none overflow-hidden focus:border-blue-500 focus:outline-none focus:ring-0 disabled:bg-gray-100"
            />
            <ErrorSlot message={createValidationError} />
            {isFocused && (
              <div className="mt-2 flex justify-end">
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="rounded-md bg-transparent px-3 py-1.5 text-sm text-[#747D8C] disabled:opacity-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleCreateSubmit}
                    disabled={isSubmitting || !newComment.trim()}
                    className="rounded-md bg-[#33E1ED] px-3 py-1.5 text-sm text-white disabled:opacity-50"
                  >
                    {isSubmitting ? '投稿中...' : 'コメントする'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isInitialLoad && isLoading ? (
          <p className="text-sm text-[#747D8C] text-center py-4">読み込み中...</p>
        ) : comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="border-b border-gray-200 pb-3">
                {editingCommentId === comment.id ? (
                  /* 編集モード */
                  <div>
                    <h3 className="text-sm font-medium text-black mb-1">
                      {comment.user?.name || '匿名'}
                    </h3>
                    <textarea
                      ref={editTextareaRef}
                      value={editContent}
                      onChange={(e) => {
                        setEditContent(e.target.value);
                        setEditValidationError('');
                        adjustTextareaHeight(editTextareaRef);
                      }}
                      rows={1}
                      maxLength={1000}
                      disabled={isEditSubmitting}
                      className="w-full border-0 border-b border-gray-200 bg-[#EEF7FB] px-3 py-2 text-sm resize-none overflow-hidden focus:border-blue-500 focus:outline-none focus:ring-0 disabled:bg-gray-100"
                    />
                    <ErrorSlot message={editValidationError} />
                    <div className="mt-2 flex justify-end">
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditCancel}
                          disabled={isEditSubmitting}
                          className="rounded-md bg-transparent px-3 py-1.5 text-sm text-[#747D8C] disabled:opacity-50"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={handleEditSubmit}
                          disabled={isEditSubmitting || !editContent.trim()}
                          className="rounded-md bg-[#33E1ED] px-3 py-1.5 text-sm text-white disabled:opacity-50"
                        >
                          {isEditSubmitting ? '編集中...' : '編集する'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 通常表示モード */
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-black">
                        {comment.user?.name || '匿名'}
                      </h3>
                      {auth?.user?.id === comment.user_id && (
                        <div className="flex items-center gap-2">
                          <button type="button" className="p-1 hover:opacity-70" onClick={() => handleEditStart(comment)}>
                            <img src={EditIcon} alt="編集" className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-1 hover:opacity-70" onClick={() => onDelete?.(comment)}>
                            <img src={TrashIcon} alt="削除" className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-[#747D8C] mt-1 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </>
                )}
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

const ErrorSlot = ({ message }) => (
  <p className="h-5 text-sm leading-5 text-red-500 overflow-hidden">
    {message ?? '\u00A0'}
  </p>
);

export default CommentListModal;
