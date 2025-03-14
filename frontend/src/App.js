import React, { useState, useEffect } from "react";
import { ChromaClient } from "chromadb";
import cosineSimilarity from "compute-cosine-similarity";

const App = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [similarDocuments, setSimilarDocuments] = useState([]);
  const chromaClient = new ChromaClient({ path: "http://localhost:8000" });

  useEffect(() => {
    const fetchSimilarDocuments = async () => {
      if (userPrompt.trim() === "") return;

      const collection = await chromaClient.getCollection("my-collection");
      const embeddings = await collection.get(); // Fetch stored documents and embeddings

      const queryEmbedding = await generateEmbedding(userPrompt); // Generate embedding for the user prompt
      const results = embeddings.documents.map((doc, index) => ({
        document: doc,
        similarity: cosineSimilarity(
          queryEmbedding,
          embeddings.embeddings[index]
        ),
        metadata: embeddings.metadatas[index],
      }));

      const filteredResults = results
        .filter((item) => item.similarity > 0.5) // Filter by similarity threshold
        .sort((a, b) => b.similarity - a.similarity); // Sort by similarity

      setSimilarDocuments(filteredResults);
    };

    fetchSimilarDocuments();
  }, [userPrompt]);

  const handleGenerateResponse = async () => {
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama2-uncensored",
          prompt: userPrompt,
          options: { temperature: 0.7, max_tokens: 150 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResponse(data.text);
      } else {
        console.error("Error generating response:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateEmbedding = async (text) => {
    // Replace with an actual embedding function or API call
    return [
      /* embedding vector */
    ];
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Text Generation with ChromaDB</h1>
      <textarea
        rows="4"
        cols="50"
        placeholder="Enter your prompt here..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
      <button onClick={handleGenerateResponse}>Generate Response</button>
      <div>
        <h2>Generated Response:</h2>
        <p>{response}</p>
      </div>
      <div>
        <h2>Similar Documents:</h2>
        <ul>
          {similarDocuments.map((item, index) => (
            <li key={index}>
              <strong>Document:</strong> {item.document} <br />
              <strong>Similarity:</strong> {item.similarity.toFixed(2)} <br />
              <strong>Metadata:</strong> {JSON.stringify(item.metadata)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
