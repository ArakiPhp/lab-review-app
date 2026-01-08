
/**
 * パンくずリストを表示する共通コンポーネント。
 *
 * @param {Object} props
 * @param {Object} [props.university] - 大学オブジェクト（省略可）
 * @param {Object} [props.faculty] - 学部オブジェクト（省略可）
 * @param {Object} [props.lab] - 研究室オブジェクト（省略可）
 * @param {string} [props.query] - 検索クエリ（省略可）
 * @returns {JSX.Element}
 */
import { Link } from "@inertiajs/react";


/**
 * クエリが存在する場合はパラメータに含めて返す
 * @param {Object} baseParams - ベースとなるパラメータ
 * @returns {Object} クエリを含めたパラメータ
 */
const Breadcrumb = ({ university, faculty, lab, query }) => {
  const buildParams = (baseParams) => {
    if (query) {
      return { ...baseParams, query };
    }
    return baseParams;
  };

  return (
    <nav className="text-sm text-[#747D8C] mb-4">
      <ol className="flex items-center gap-2 flex-wrap">
        {/* 検索クエリがある場合、検索結果へのリンクを表示 */}
        {query && (
          <>
            <li>
              <Link
               href={route('universities.index', { query })}
               className="hover:text-black hover:underline"
              >
                「{query}」の検索結果
              </Link>
            </li>
            <li>{'>'}</li>
          </>
        )}

        {/* 大学 */}
        {university && (
          <>
            <li>
              <Link
                href={route('faculties.index', buildParams({ university: university.id }))}
                className="hover:text-black hover:underline"
              >
                {university.name}
              </Link>
            </li>
            {faculty && <li>{'>'}</li>}
          </>
        )}

        {/* 学部 */}
        {faculty && (
          <>
            <li>
              <Link
                href={route('labs.index', buildParams({ faculty: faculty.id }))}
                className="hover:text-black hover:underline"
              >
                {faculty.name}
              </Link>
            </li>
            {lab && <li>{'>'}</li>}
          </>
        )}

        {/* 研究室 */}
        {lab && (
          <>
            <li>
              <Link
                href={route('labs.show', buildParams({ lab: lab.id }))}
                className="hover:text-black hover:underline"
              >
                {lab.name}
              </Link>
            </li>
          </>
        )}
      </ol>
    </nav>
  )
}

export default Breadcrumb;