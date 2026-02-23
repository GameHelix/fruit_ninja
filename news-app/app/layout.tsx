import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'birnews | Bir mənbə, bütün xəbərlər',
  description: 'Azərbaycanın bütün xəbərləri bir yerdə - Sonxeber, APA, Report, Modern, Axar, Banker, Fed, Marja, Oxu, Qafqazinfo və Trend-dən ən son xəbərlər',
  keywords: 'birnews, azerbaijan news, xəbərlər, news aggregator, bir mənbə, sonxeber, apa, report, modern, axar, banker, fed, marja, oxu, qafqazinfo, trend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />

          <main className="flex-1">
            {children}
          </main>

          <footer className="bg-gray-900 text-gray-400 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-primary-600 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                      </svg>
                    </div>
                    <span className="text-white font-bold text-lg">birnews</span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    Bir mənbə, bütün xəbərlər. Azərbaycanın aparıcı xəbər
                    portallarından ən son xəbərlər avtomatik toplanır.
                  </p>
                </div>

                <div id="sources">
                  <h3 className="text-white font-semibold mb-3">Mənbələr</h3>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <li><a href="https://sonxeber.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">Sonxeber.az</a></li>
                    <li><a href="https://apa.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">APA.az</a></li>
                    <li><a href="https://report.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">Report.az</a></li>
                    <li><a href="https://modern.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">Modern.az</a></li>
                    <li><a href="https://axar.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">Axar.az</a></li>
                    <li><a href="https://banker.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">Banker.az</a></li>
                    <li><a href="https://fed.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">Fed.az</a></li>
                    <li><a href="https://marja.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">Marja.az</a></li>
                    <li><a href="https://oxu.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">Oxu.az</a></li>
                    <li><a href="https://qafqazinfo.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">Qafqazinfo.az</a></li>
                    <li><a href="https://az.trend.az" target="_blank" rel="noopener" className="hover:text-white transition-colors">Trend.az</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">Haqqında</h3>
                  <p className="text-sm leading-relaxed">
                    Avtomatik yenilənən xəbər aqreqatoru. Gündə 3 dəfə —
                    səhər, günorta və axşam — bütün mənbələr yenilənir.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} birnews. Bütün hüquqlar qorunur.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
