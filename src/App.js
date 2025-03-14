import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    try {
      // This is where you would make your actual API call to your AI service
      // For now, I'll simulate a response with setTimeout
      setTimeout(() => {
        const mockRecommendations = [
          {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            description: "A classic novel about the American Dream.",
          },
          {
            id: 2,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            description: "A powerful story about racial injustice.",
          },
          {
            id: 3,
            title: "Sapiens",
            author: "Yuval Noah Harari",
            description: "A brief history of humankind.",
          },
        ];
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 1500);

      /* 
      Actual API call would look something like:
      
      const response = await fetch('your-ai-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      setRecommendations(data.recommendations);
      */
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>BookMind</h1>
        <p>AI-Powered Book Recommendations</p>
      </header>

      <main>
        <section className="search-section">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe what you're looking for... (e.g., 'A sci-fi novel with strong female characters')"
                aria-label="Book search query"
              />
              <button type="submit" disabled={loading}>
                {loading ? "Finding books..." : "Get Recommendations"}
              </button>
            </div>
          </form>
        </section>

        <section className="results-section">
          {loading ? (
            <div className="loading">
              <p>Finding the perfect books for you...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="recommendations">
              <h2>Recommended Books</h2>
              <ul>
                {recommendations.map((book) => (
                  <li key={book.id} className="book-card">
                    <h3>{book.title}</h3>
                    <p className="author">by {book.author}</p>
                    <p className="description">{book.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </main>

      <footer>
        <p>
          © {new Date().getFullYear()} BookMind - AI-Powered Book
          Recommendations
        </p>
      </footer>
    </div>
  );
}

export default App;
