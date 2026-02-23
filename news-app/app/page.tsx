import { getArticles, getNewsSources, getArticleCount, searchArticles, getSearchCount, isValidSourceId } from '@/lib/db';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

const ARTICLES_PER_PAGE = 24;

interface HomeProps {
  searchParams: { page?: string; source?: string; q?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  let sourceId = searchParams.source ? parseInt(searchParams.source, 10) : undefined;
  const searchQuery = searchParams.q?.trim();

  if (sourceId && !isNaN(sourceId)) {
    const isValid = await isValidSourceId(sourceId);
    if (!isValid) {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (currentPage > 1) params.set('page', currentPage.toString());
      redirect(params.toString() ? `/?${params.toString()}` : '/');
    }
  } else if (sourceId) {
    sourceId = undefined;
  }

  const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

  const [articles, sources, totalCount] = await Promise.all([
    searchQuery
      ? searchArticles(searchQuery, ARTICLES_PER_PAGE, offset, sourceId)
      : getArticles(ARTICLES_PER_PAGE, offset, sourceId),
    getNewsSources(),
    searchQuery
      ? getSearchCount(searchQuery, sourceId)
      : getArticleCount(sourceId),
  ]);

  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  // Build base URL for pagination (no page param)
  const paginationBase = (() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (sourceId) params.set('source', sourceId.toString());
    return params.toString() ? `/?${params.toString()}` : '/';
  })();

  // Build source filter URL (preserves search query)
  const buildSourceUrl = (sid?: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (sid) params.set('source', sid.toString());
    return params.toString() ? `/?${params.toString()}` : '/';
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-blue-600 text-white overflow-hidden">
        <div className="hero-pattern absolute inset-0 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3 tracking-tight">
              Azərbaycan Xəbərləri
            </h1>
            <p className="text-primary-100 text-base sm:text-lg mb-2">
              {sources.length} mənbədən ən son xəbərlər bir yerdə
            </p>

            {/* Stats pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-sm">
              <span className="bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full font-medium">
                {totalCount.toLocaleString()} xəbər
              </span>
              <span className="bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full font-medium">
                {sources.length} mənbə
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Avtomatik yenilənir
              </span>
            </div>

            {/* Search */}
            <SearchBar initialQuery={searchQuery} sourceId={sourceId} />

            {/* Source filter — horizontally scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
              <a
                href={buildSourceUrl()}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !sourceId
                    ? 'bg-white text-primary-700 shadow-md'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                Hamısı
              </a>
              {sources.map((source) => (
                <a
                  key={source.id}
                  href={buildSourceUrl(source.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sourceId === source.id
                      ? 'bg-white text-primary-700 shadow-md'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  {source.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {searchQuery ? 'Axtarış Nəticələri' : sourceId ? sources.find(s => s.id === sourceId)?.name ?? 'Xəbərlər' : 'Son Xəbərlər'}
            </h2>
            {searchQuery && (
              <p className="text-gray-500 mt-1 text-sm">
                &ldquo;{searchQuery}&rdquo; üçün{' '}
                <span className="font-semibold text-gray-700">{totalCount}</span> nəticə tapıldı
              </p>
            )}
            {!searchQuery && (
              <p className="text-gray-500 mt-1 text-sm">
                <span className="font-semibold text-gray-700">{totalCount.toLocaleString()}</span> xəbər,{' '}
                səhifə {currentPage} / {totalPages}
              </p>
            )}
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Nəticə tapılmadı</h3>
            <p className="text-gray-500 text-sm">Xahiş edirik başqa açar söz sınayın</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={paginationBase}
            />
          </>
        )}
      </section>
    </div>
  );
}
