import { Book } from './components/Book';

export default function Home() {
  const pages = [
    {
      content: (
        <div className="page-content">
          <h2>Chapter 1: The Beginning</h2>
          <p>The journey began on a misty morning in late autumn...</p>
        </div>
      ),
      pageNumber: 1
    },
    {
      content: (
        <div className="page-content">
          <h2>The Adventure Begins</h2>
          <p>As the sun rose over the distant mountains...</p>
        </div>
      ),
      pageNumber: 2
    },
    {
      content: (
        <div className="page-content">
          <h2>Chapter 2: The Forest</h2>
          <p>The forest grew darker as they ventured deeper...</p>
        </div>
      ),
      pageNumber: 3
    },
    {
      content: (
        <div className="page-content">
          <h2>Into the Unknown</h2>
          <p>Strange sounds echoed through the ancient trees...</p>
        </div>
      ),
      pageNumber: 4
    },
    // Adding new pages
    {
      content: (
        <div className="page-content">
          <h2>Chapter 3: The Mountain</h2>
          <p>The steep cliffs loomed ahead, challenging their resolve...</p>
        </div>
      ),
      pageNumber: 5
    },
    {
      content: (
        <div className="page-content">
          <h2>The Ascent</h2>
          <p>Each step brought them closer to the clouded peak...</p>
        </div>
      ),
      pageNumber: 6
    },
    {
      content: (
        <div className="page-content">
          <h2>Chapter 4: The Cave</h2>
          <p>Deep within the mountain, they discovered an ancient passage...</p>
        </div>
      ),
      pageNumber: 7
    },
    {
      content: (
        <div className="page-content">
          <h2>Hidden Secrets</h2>
          <p>The walls were covered in mysterious symbols...</p>
        </div>
      ),
      pageNumber: 8
    },
    {
      content: (
        <div className="page-content">
          <h2>Chapter 5: The Discovery</h2>
          <p>In the heart of the cave, a golden light illuminated...</p>
        </div>
      ),
      pageNumber: 9
    },
    {
      content: (
        <div className="page-content">
          <h2>The Revelation</h2>
          <p>What they found would change everything...</p>
        </div>
      ),
      pageNumber: 10
    }
  ];

  // Add more bookmarks to match new chapters
  const bookmarks = [
    { label: "Chapter 1", pageNumber: 1, color: "#e74c3c" },
    { label: "Chapter 2", pageNumber: 3, color: "#3498db" },
    { label: "Chapter 3", pageNumber: 5, color: "#2ecc71" },
    { label: "Chapter 4", pageNumber: 7, color: "#f1c40f" },
    { label: "Chapter 5", pageNumber: 9, color: "#9b59b6" }
  ];

  return (
    <main className="h-screen overflow-hidden flex items-center justify-center">
      <Book
        title="The Great Adventure"
        author="John Smith"
        pages={pages}
        bookmarks={bookmarks}
      />
    </main>
  );
}
