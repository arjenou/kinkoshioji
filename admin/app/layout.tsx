import './globals.css'

export const metadata = {
  title: '商品管理 - 金興商事株式会社',
  description: '商品管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
