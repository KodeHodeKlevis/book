import { Book } from './components/Book';

export default function Home() {
  const pages = [
    { content: <div>Page 1 content</div>, pageNumber: 1 },
    { content: <div>Page 2 content</div>, pageNumber: 2 },
    { content: <div>Page 3 content</div>, pageNumber: 3 },
    { content: <div>Page 4 content</div>, pageNumber: 4 },
    // Add more pages as needed
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Book pages={pages} width={600} height={800} />
    </main>
  );
}
