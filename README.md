# IS215 Final Project - *Kinokuniya Timeless Conversations Web App*

Made by IS215 G11 Team 1.

## Team Members

* Astin Tay Wee Loon
* Gabriel Ong Zhe Mian
* Keith Tang Zi Heng
* Nicholas Lam Zhan Teng
* Nichole Bun Wen Xuan

## Screenshot

<div style="display: flex; justify-content: space-between;">
  <img src="https://github.com/user-attachments/assets/5daaeeaa-9093-40cf-b996-3d50a6d58444" width="48%">
  <img src="https://github.com/user-attachments/assets/cc164af1-7b52-4fd6-84b9-eab37d55671d" width="48%">
</div>

## Stack

* React
* ChromaDB
* GemeniAPI

## Architecture

### Overview

```mermaid
sequenceDiagram
  actor User as Frontend User
  participant Frontend
  participant Backend
  participant GeminiModel as Pretrained Gemini Model
  participant VectorDB as Remote Vector Database
  
  User->>Frontend: Enter prompt
  Frontend->>Backend: Send prompt request
  activate Backend
  Backend->>Backend: Tokenize user data
  Backend->>VectorDB: Query vector database with embeddings
  activate VectorDB
  VectorDB-->>Backend: Return matching authors and content relationships
  deactivate VectorDB
  Backend->>GeminiModel: Call pretrained Gemini model for tailored response
  activate GeminiModel
  GeminiModel-->>Backend: Return author-tailored response
  deactivate GeminiModel
  Backend-->>Frontend: Return author-tailored response
  deactivate Backend
  Frontend-->>User: Display response
```

### DB

```mermaid
erDiagram
    BOOK {
        string BookID PK
        string Title
        string ISBN
        string Genre
        string CategoryID FK
    }
    AUTHOR {
        string AuthorID PK
        string FirstName
        string LastName
        date DateOfBirth
        string CountryOfOrigin
    }
    CATEGORY {
        string CategoryID PK
        string Name
    }
    BOOK_AUTHOR {
        string BookID FK
        string AuthorID FK
    }

    BOOK ||--o| CATEGORY : "belongs to"
    BOOK ||--o| BOOK_AUTHOR : "has"
    AUTHOR ||--o| BOOK_AUTHOR : "writes"
```
