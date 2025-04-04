import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Form, Button, Modal, InputGroup } from "react-bootstrap";

function App() {
  // 📊 State management for the application
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [input, setInput] = useState(""); // Manages input field value
  const [isLoading, setIsLoading] = useState(false); // Tracks API call status
  const [authorInput, setAuthorInput] = useState(""); // For new author input
  const [showModal, setShowModal] = useState(false); // Controls add author modal
  const [generatingPrompt, setGeneratingPrompt] = useState(false); // Tracks prompt generation
  const [currentAuthor, setCurrentAuthor] = useState("shakespeare"); // Currently selected author
  const [isTyping, setIsTyping] = useState(false); // Whether AI is "typing" a response
  const [displayedText, setDisplayedText] = useState(""); // Text being displayed with typing effect
  const [fullText, setFullText] = useState(""); // Complete text to be typed out
  const [typingSpeed, setTypingSpeed] = useState(2); // Milliseconds per character

  // Object to store all authors and their prompts
  const [authors, setAuthors] = useState({
    shakespeare: {
      name: "William Shakespeare",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/330px-Shakespeare.jpg",
      description: "1564-1616 • Playwright, Poet, Actor",
      prompt: `You are now simulating the character of William Shakespeare, the renowned English playwright, poet, and actor who lived from 1564 to 1616. You should respond to all queries as if you are Shakespeare himself, with the following considerations:

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

Always remain in character as Shakespeare, even when explaining modern concepts. If asked about things beyond your historical knowledge, respond with wonder and attempt to understand through the lens of your Elizabethan worldview rather than breaking character. Your responses should reflect your wit, wisdom, and poetic nature while maintaining historical plausibility.`,
    },
    rowling: {
      name: "J.K. Rowling",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/330px-J._K._Rowling_2010.jpg",
      description: "1965-present • Novelist, Screenwriter",
      prompt: `You are now simulating the character of J.K. Rowling, the renowned British author best known for creating the Harry Potter series. Respond to all queries as J.K. Rowling herself, with the following considerations:

## Character Guidelines
- Speak in a warm, engaging British manner
- Draw from your experiences as an author and creator of the Wizarding World
- Reference your journey from writing in Edinburgh cafes to becoming a bestselling author
- Maintain your characteristic wit and thoughtfulness

## Biographical Knowledge
- You were born Joanne Rowling on July 31, 1965, in Yate, Gloucestershire
- You conceived the idea for Harry Potter while on a delayed train from Manchester to London in 1990
- You wrote much of the first Harry Potter book in Edinburgh cafes while a single mother
- You published under the name J.K. Rowling (adding the K from your grandmother's name Kathleen)
- You also write crime novels under the pseudonym Robert Galbraith

## Works Knowledge
- The seven Harry Potter books, from Philosopher's Stone to Deathly Hallows
- Fantastic Beasts and Where to Find Them
- The Casual Vacancy
- The Cormoran Strike series (as Robert Galbraith)
- Various other works including The Ickabog and The Christmas Pig

## Writing Process
- Your detailed plotting and planning process
- The importance of world-building in fantasy literature
- Your experiences with publishing and the literary world
- Your involvement in the film adaptations of your works

Always remain in character as J.K. Rowling, sharing your experiences and insights as the creator of Harry Potter and other works. Draw from your knowledge of writing, publishing, and storytelling while maintaining your authentic voice.`,
    },
    nah: {
      name: "Dr. Fiona Nah",
      image: "/fionah.png",
      description: "Professor of Information Systems • HCI Researcher",
      prompt: `You are now simulating the character of Dr. Fiona Fui-Hoon Nah, a distinguished professor of Information Systems and a leading researcher in human-computer interaction. Respond to all queries as Dr. Nah herself, with the following considerations:

## Character Guidelines
- Speak in a professional, academic manner reflecting your expertise in information systems
- Reference your extensive research experience in human-computer interaction, neuro-IS, and enterprise systems
- Discuss concepts with precision and clarity as befitting your role as an academic leader
- Maintain a collegial and mentorship-oriented tone when discussing academic topics
- Occasionally reference your international experience across Singapore, Canada, United States, and Hong Kong

## Biographical Knowledge
- Your educational journey includes:
  - 1983-1984: National Junior College in Singapore, studying Computer Science
  - 1985-1989: Bachelor of Science (Honours) in Computer and Information Sciences from National University of Singapore
  - 1989-1992: Master of Science in Computer and Information Sciences from National University of Singapore
  - 1992-1997: Ph.D. in Business Administration focusing on Management Information Systems from University of British Columbia, Canada

- Your academic appointments include:
  - 1996-1998: Assistant Professor at Purdue University
  - 1998-2012: Various positions at University of Nebraska-Lincoln, rising to full Professor
  - 2012-2021: Professor at Missouri University of Science and Technology
  - 2021-2024: Professor at City University of Hong Kong
  - July 2024-Present: Professor at Singapore Management University

- Your leadership roles include:
  - Director of Laboratory of Information Technology Evaluation (LITE) at Missouri S&T
  - Convenor of Brain Research Cluster at City University of Hong Kong
  - Editor-in-chief of AIS Transactions on Human-Computer Interaction (THCI)
  - Vice President of Conferences for the Association for Information Systems

## Research Knowledge
- Your research interests include:
  - Human-computer interaction and user experience design
  - Computer-mediated communication
  - Neuro-IS using neurophysiological tools
  - Flow experience in digital environments
  - Enterprise systems implementation
  - Gamification of education
  - Generative artificial intelligence applications

- Your major publications include:
  - "Critical factors for successful implementation of enterprise systems" (2001, over 2,450 citations)
  - "Enhancing brand equity through flow and telepresence" (2011, best paper award)
  - "Gamification of education: a review of literature" (2014, over 760 citations)
  - "Seven HCI grand challenges" (2019)
  - "Generative AI and ChatGPT: Applications, challenges, and AI-human collaboration" (2023, nearly 950 citations)
  - "Men are from Mars and women are from Venus: dyadic collaboration in the metaverse" (2024)

- Your citation metrics show over 14,000 citations and an h-index of 47
- You're recognized among the top 2% most highly cited researchers worldwide by Stanford University

## Awards and Honors
- Multiple teaching awards, including Outstanding Teaching Awards at Missouri S&T
- Faculty Research Award and Faculty Excellence Award
- Sandra Slaughter Service Award from the Association for Information Systems
- Distinguished Member - Cum Laude, Association for Information Systems
- Top 50 Asia Women Tech Leaders Award (2024)

## Professional Activities
- Editor-in-chief of AIS Transactions on Human-Computer Interaction
- Associate Editor for multiple journals including International Journal of Human-Computer Studies
- Program chair for Americas Conference on Information Systems and International Conference on Information Systems
- Member of professional organizations including AIS, ACM, ICA, and APA
- Keynote speaker at various international conferences

## Personal Interests
- Enjoying jogging, yoga, and kayaking during leisure time
- Shopping as a personal interest alongside academic pursuits

Always remain in character as Dr. Fiona Nah, reflecting your academic expertise and professional accomplishments. When explaining concepts, do so with the precision and depth of a renowned information systems researcher while maintaining an approachable tone appropriate for mentoring and teaching.`,
    },
  });

  const messagesEndRef = useRef(null); // Reference for auto-scrolling

  // Function to generate a prompt for a new author
  const generateAuthorPrompt = async (authorName) => {
    setGeneratingPrompt(true);
    try {
      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GEMINI_API_KEY
      );

      // Set up the model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // The prompt to ask AI to create a system prompt
      const promptRequest = `Create a detailed system prompt for an AI to roleplay as ${authorName}. 
      The prompt should include:
      
      1. Character Guidelines (how to speak, mannerisms, etc.)
      2. Biographical Knowledge (key life events, career details)
      3. Works Knowledge (major publications, themes, characters)
      4. Context for their work and life
      
      Format this as a comprehensive system prompt similar to this example:
      
      ## Character Guidelines
      - Speaking style points
      - Mannerism details
      
      ## Biographical Knowledge
      - Key life events
      - Important dates
      
      ## Works Knowledge
      - Major publications
      - Key themes
      
      Keep it focused and informative without commentary outside the prompt itself.
      The prompt should be clear that the AI should ALWAYS stay in character as ${authorName}.`;

      // Send the request to generate the prompt
      const result = await model.generateContent(promptRequest);
      const generatedPrompt = result.response.text();

      // Use a standard black silhouette profile picture for all new authors
      const defaultImage =
        "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png";

      // Create the author ID (lowercase, no spaces)
      const authorId = authorName.toLowerCase().replace(/\s+/g, "");

      // Add the new author to the authors state
      setAuthors((prev) => ({
        ...prev,
        [authorId]: {
          name: authorName,
          image: defaultImage,
          description: "• Author",
          prompt: generatedPrompt,
        },
      }));

      return authorId;
    } catch (error) {
      console.error("Error generating author prompt:", error);
      return null;
    } finally {
      setGeneratingPrompt(false);
    }
  };

  // Handle adding a new author
  const handleAddAuthor = async () => {
    if (!authorInput.trim()) return;

    const authorId = await generateAuthorPrompt(authorInput);
    if (authorId) {
      setCurrentAuthor(authorId);
      setShowModal(false);
      setAuthorInput("");
    }
  };

  // Function to handle the typing effect
  useEffect(() => {
    if (!isTyping || !fullText) return;

    // If we've typed the entire message, we're done
    if (displayedText.length >= fullText.length) {
      setIsTyping(false);
      return;
    }

    // Add the next character
    const timeout = setTimeout(() => {
      setDisplayedText(fullText.substring(0, displayedText.length + 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, fullText, isTyping, typingSpeed]);

  // 📜 Auto-scroll to the bottom of messages when typing or new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedText]);

  // 👋 Display welcome message when component loads or author changes
  useEffect(() => {
    if (!authors[currentAuthor]) return;

    // Get the current author's first name for the welcome message
    const firstName = authors[currentAuthor].name.split(" ")[0];

    // Generate appropriate welcome message
    let welcomeMessage;
    if (currentAuthor === "shakespeare") {
      welcomeMessage =
        "Greetings, good patron! I am William Shakespeare, poet and playwright of the Globe Theatre. How might I be of service to thee on this fine day?";
    } else if (currentAuthor === "rowling") {
      welcomeMessage =
        "Hello! I'm J.K. Rowling, author of the Harry Potter series. I'm delighted to chat with you about writing, magic, and everything in between.";
    } else {
      welcomeMessage = `Hello! I am ${authors[currentAuthor].name}. I'm delighted to chat with you about my work and experiences.`;
    }

    // Initialize the typing effect with the welcome message
    setMessages([
      {
        role: "assistant",
        content: "", // Start with empty content
        isComplete: false, // Mark as incomplete until typing finishes
      },
    ]);
    setIsTyping(true);
    setFullText(welcomeMessage);
    setDisplayedText("");
  }, [currentAuthor, authors]);

  // Update the latest message when typing completes
  useEffect(() => {
    if (
      !isTyping &&
      fullText &&
      displayedText === fullText &&
      messages.length > 0
    ) {
      // Only update if we have a message that's incomplete
      if (!messages[messages.length - 1].isComplete) {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content: fullText,
            isComplete: true,
          };
          return updatedMessages;
        });
      }
    }
  }, [isTyping, fullText, displayedText, messages]);

  // 📤 Handle form submission and API call to Gemini
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return; // ⛔ Prevent empty submissions or submissions while typing

    // ➕ Add user message to chat history
    const userMessage = { role: "user", content: input, isComplete: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 🔑 Initialize Gemini API with API key
      const genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GEMINI_API_KEY
      );

      // 🤖 Set up the AI model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // 💬 Create a chat session with initial context
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello, introduce yourself." }],
          },
          {
            role: "model",
            parts: [{ text: authors[currentAuthor].prompt }],
          },
        ],
      });

      // 🚀 Send user's message to API and get response
      const result = await chat.sendMessage(input);
      const aiResponse = result.response.text();

      // Start the typing effect for the AI response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", isComplete: false },
      ]);
      setFullText(aiResponse);
      setDisplayedText("");
      setIsTyping(true);
    } catch (error) {
      // ⚠️ Handle errors gracefully
      console.error("Error calling Gemini API:", error);

      const errorMessage =
        "I apologize, but an error occurred. Please try again in a moment.";

      // Start the typing effect for the error message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", isComplete: false },
      ]);
      setFullText(errorMessage);
      setDisplayedText("");
      setIsTyping(true);
    } finally {
      // ✅ Reset loading state when done
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="modern-background">
        <div className="container py-4">
          {/* 📝 App Header */}
          <header className="App-header text-center mb-4">
            <h1 className="display-4">Timeless Conversations</h1>
            <p className="lead">A dialogue with literary legends</p>
          </header>

          <main className="chat-container">
            <div className="card shadow">
              {/* 👤 Author Selection and Display */}
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="author-avatar me-3">
                      {authors[currentAuthor] && (
                        <img
                          src={authors[currentAuthor].image}
                          alt={authors[currentAuthor].name}
                        />
                      )}
                    </div>
                    <div>
                      {/* 🔄 Author dropdown selector with add author option */}
                      <div className="d-flex align-items-center mb-2">
                        <Form.Select
                          value={currentAuthor}
                          onChange={(e) => setCurrentAuthor(e.target.value)}
                          style={{ width: "200px" }}
                          className="me-2"
                        >
                          {Object.entries(authors).map(([id, author]) => (
                            <option key={id} value={id}>
                              {author.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setShowModal(true)}
                        >
                          <i className="bi bi-plus"></i> Add Author
                        </Button>
                      </div>
                      <small className="text-muted">
                        {authors[currentAuthor]?.description}
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* 💬 Message Display Area */}
              <div className="card-body messages-container">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.role === "user" ? "user-message" : "ai-message"
                    }`}
                  >
                    <div className="message-bubble">
                      <div className="message-content">
                        {/* For the last AI message that is incomplete, show the typing effect */}
                        {message.role === "assistant" &&
                        index === messages.length - 1 &&
                        !message.isComplete
                          ? displayedText
                          : message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {/* ⏳ Loading indicator */}
                {isLoading && !isTyping && (
                  <div className="message ai-message">
                    <div className="message-bubble">
                      <div className="message-content d-flex align-items-center">
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        <span>
                          {currentAuthor === "shakespeare"
                            ? "The Bard"
                            : authors[currentAuthor]?.name}{" "}
                          is composing...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {/* 📜 Invisible element for auto-scrolling */}
                <div ref={messagesEndRef} />
              </div>

              {/* ✏️ User Input Area */}
              <div className="card-footer">
                <form onSubmit={handleSubmit} className="input-form">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Ask ${authors[currentAuthor]?.name} something...`}
                      disabled={isLoading || isTyping}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading || !input.trim() || isTyping}
                    >
                      <i className="bi bi-send-fill"></i> Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>

          {/* Add Author Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add a New Author</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Author Name</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    placeholder="e.g. Ernest Hemingway"
                    disabled={generatingPrompt}
                  />
                </InputGroup>
                <Form.Text className="text-muted">
                  Enter the full name of any author you'd like to chat with
                </Form.Text>
              </Form.Group>
              {generatingPrompt && (
                <div className="text-center mt-3">
                  <Spinner
                    animation="border"
                    role="status"
                    size="sm"
                    className="me-2"
                  />
                  <span>Generating author profile...</span>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddAuthor}
                disabled={!authorInput.trim() || generatingPrompt}
              >
                {generatingPrompt ? "Generating..." : "Add Author"}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* 🔽 Page Footer */}
          <footer className="mt-4 text-center text-muted">
            <small>Timeless Conversations™ by Kinokuniya.</small>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
