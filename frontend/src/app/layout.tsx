import '@/app/globals.css'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const ApolloWrapper = dynamic(() => import('../lib/apollo-wrapper').then(mod => mod.ApolloWrapper), {
  ssr: false
})

export const metadata = {
  title: 'TODO アプリ',
  description: 'シンプルなTODOアプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={inter.className}>
      <body>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  )
}
