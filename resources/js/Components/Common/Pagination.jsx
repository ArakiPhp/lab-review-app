import { Link } from '@inertiajs/react';

const Pagination = ({ paginator }) => {
  const canGoPrev = paginator.current_page > 1;
  const canGoNext = paginator.current_page < paginator.last_page;

  // 1ページしかないときはそもそも出さない
  if (paginator.last_page <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center text-sm">
      <div className="w-8 flex justify-end">
        {canGoPrev && (
          <Link
            href={paginator.prev_page_url}
            preserveScroll
            className="text-2xl text-[#747D8C] hover:text-gray-600"
          >
            ≪
          </Link>
        )}
      </div>

      <span className="mx-4 text-[#747D8C]">
        {paginator.current_page} / {paginator.last_page}
      </span>

      <div className="w-8 flex justify-start">
        {canGoNext && (
          <Link
            href={paginator.next_page_url}
            preserveScroll
            className="text-2xl text-[#747D8C] hover:text-gray-600"
          >
            ≫
          </Link>
        )}
      </div>
    </div>
  );
}

export default Pagination;