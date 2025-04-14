import './globals.css'; 
export const metadata = {
  title: 'GPT Chatbot',
  description: 'Styled by Tailwind ✨',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
