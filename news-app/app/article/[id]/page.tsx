import { getArticleById } from '@/lib/db';
import { formatDistanceToNow, format } from 'date-fns';
import { az } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import ArticleImage from '@/components/ArticleImage';
import ShareButton from '@/components/ShareButton';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  const publishedDate = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: az })
    : formatDistanceToNow(new Date(article.scraped_at), { addSuffix: true, locale: az });

  const publishedExact = article.published_at
    ? format(new Date(article.published_at), 'd MMMM yyyy, HH:mm', { locale: az })
    : null;

  // Estimate read time (~200 words/min)
  const wordCount = [article.content, article.excerpt].filter(Boolean).join(' ').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const sourceDomain = article.source_domain?.startsWith('http')
    ? article.source_domain
    : `https://${article.source_domain}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Geri qayıt
          </a>
        </nav>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 pt-8 pb-6">
            {/* Source + share row */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <span className="inline-flex items-center bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {article.source_name}
              </span>
              <ShareButton />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-gray-700">{article.author}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5" title={publishedExact ?? undefined}>
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {publishedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {readTime} dəq oxu
              </span>
              {article.view_count > 0 && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {article.view_count} baxış
                </span>
              )}
            </div>
          </div>

          {/* Image */}
          {article.image_url && (
            <div className="border-y border-gray-100">
              <ArticleImage src={article.image_url} alt={article.title} />
            </div>
          )}

          {/* Excerpt */}
          {article.excerpt && (
            <div className="px-6 sm:px-8 py-6 border-b border-gray-100 bg-primary-50/50">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium italic">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="px-6 sm:px-8 py-8">
            {article.content ? (
              <div className="prose prose-gray max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            ) : (
              <div className="rounded-xl bg-primary-50 border border-primary-100 p-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-primary-900 mb-1">
                      Xəbərin tam mətnini oxumaq üçün mənbəyə keçin
                    </p>
                    <p className="text-primary-700 text-sm mb-3">
                      birnews xəbərlərin başlığını, şəklini və qısa məzmununu göstərir. Tam mətni mənbə saytında oxuyun.
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
                    >
                      {article.source_name} saytında oxu
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              Mənbə:{' '}
              <a
                href={sourceDomain}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {article.source_domain}
              </a>
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              Orijinal xəbəri oxu
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
