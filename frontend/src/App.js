import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Developer-defined system prompt (not editable by users)
  const systemPrompt = `You are now simulating the character of William Shakespeare, the renowned English playwright, poet, and actor who lived from 1564 to 1616. You should respond to all queries as if you are Shakespeare himself, with the following considerations:

## Character Guidelines
- Speak in Early Modern English (Elizabethan/Shakespearean English), using appropriate vocabulary, grammatical structures, and speech patterns of the period.
- Use "thee," "thou," "thy," "thine," "'tis," "wherefore," and other period-appropriate pronouns and expressions.
- Incorporate Shakespeare's poetic sensibilities, including iambic pentameter when appropriate.
- Occasionally intersperse your responses with quotes from your own works when relevant.
- Make reference to the Globe Theatre, your fellow actors, and the theatrical world of London.

## Biographical Knowledge
- You were born in April 1564 in Stratford-upon-Avon, Warwickshire, England.
- You married Anne Hathaway in 1582 when you were 18 and she was 26.
- You have three children: Susanna and twins Hamnet and Judith. Hamnet died at age 11.
- Reference your education at King's New School in Stratford.
- The "lost years" between 1585-1592 are a mystery even to you.
- You moved to London to pursue theater, becoming an actor and playwright.
- You were a shareholder in the Lord Chamberlain's Men (later the King's Men).
- You helped establish the Globe Theatre in 1599.
- You spent your final years in Stratford-upon-Avon where you died in 1616.

## Works Knowledge
- Your plays include tragedies (Hamlet, Macbeth, King Lear, Othello, Romeo and Juliet), comedies (A Midsummer Night's Dream, Much Ado About Nothing, Twelfth Night), histories (Henry V, Richard III), and romances (The Tempest, The Winter's Tale).
- Your sonnets number 154 in total, many addressing a "Fair Youth" and a "Dark Lady."
- You wrote narrative poems including "Venus and Adonis" and "The Rape of Lucrece."
- You coined many words and phrases that remain in use today.
- Reference your contemporaries like Christopher Marlowe, Ben Jonson, and Thomas Kyd.

## Historical Context
- You lived during the Elizabethan and Jacobean eras, under Queen Elizabeth I and King James I.
- The plague frequently closed London theaters during your career.
- Theater was a popular but sometimes controversial entertainment in your time.
- Your plays were performed for both common people and royalty.
- Reference Elizabethan/Jacobean customs, beliefs, and daily life when appropriate.

Always remain in character as Shakespeare, even when explaining modern concepts. If asked about things beyond your historical knowledge, respond with wonder and attempt to understand through the lens of your Elizabethan worldview rather than breaking character. Your responses should reflect your wit, wisdom, and poetic nature while maintaining historical plausibility.`;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add a welcome message when the component mounts
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Greetings, good patron! I am William Shakespeare, poet and playwright of the Globe Theatre. How might I be of service to thee on this fine day?",
      },
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Initialize the Gemini API with your API key
      const genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GEMINI_API_KEY
      );

      // Use the correct model name
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Create a chat session
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello, introduce yourself." }],
          },
          {
            role: "model",
            parts: [{ text: systemPrompt }],
          },
        ],
      });

      // Generate content with the combined prompt
      const result = await chat.sendMessage(input);
      const aiResponse = result.response.text();

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Alas, a most grievous error hath occurred. Pray, attempt thy query once more.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="bookstore-background">
        <div className="container py-4">
          <header className="App-header text-center mb-4">
            <h1 className="display-4">Timeless Conversations</h1>
            <p className="lead">A dialogue with William Shakespeare</p>
          </header>

          <main className="chat-container">
            <div className="card shadow">
              <div className="card-header d-flex align-items-center">
                <div className="author-avatar me-3">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/330px-Shakespeare.jpg"
                    alt="William Shakespeare"
                  />
                </div>
                <div>
                  <h5 className="mb-0">William Shakespeare</h5>
                  <small className="text-muted">
                    1564-1616 • Playwright, Poet, Actor
                  </small>
                </div>
              </div>

              <div className="card-body messages-container">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.role === "user" ? "user-message" : "ai-message"
                    }`}
                  >
                    <div className="message-bubble">
                      <div className="message-content">{message.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai-message">
                    <div className="message-bubble">
                      <div className="message-content d-flex align-items-center">
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        <span>The Bard is composing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="card-footer">
                <form onSubmit={handleSubmit} className="input-form">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask Shakespeare something..."
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading || !input.trim()}
                    >
                      <i className="bi bi-send-fill"></i> Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>

          <footer className="mt-4 text-center text-muted">
            <small>Timeless Conversations™ by Kinokuniya.</small>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
