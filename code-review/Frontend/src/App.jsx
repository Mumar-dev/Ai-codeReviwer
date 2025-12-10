import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState(``)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    if (!code.trim()) return
    
    setIsLoading(true)
    setReview('')
    
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
      const response = await axios.post(`${BACKEND_URL}/ai/get-review`, { code })
      setReview(response.data)
    } catch (error) {
      setReview('##  Error\nFailed to analyze code. Please try again.')
      console.error('Review error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <header className="app-header">
        <h1>🚀 AI Code Reviewer</h1>
        <p className="subtitle">By Wajaht Don</p>
      </header>
      
      <main className="main-container">
        <div className="editor-section">
          <div className="section-header">
            <h2>💻 Your Code</h2>
            <button 
              onClick={reviewCode}
              disabled={isLoading || !code.trim()}
              className="review-btn"
            >
              {isLoading ? '🔄 Analyzing...' : '🔍 Review Code'}
            </button>
          </div>
          
          <div className="code-editor-container">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={20}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 14,
                background: '#0f172a',
                color: '#e2e8f0',
                borderRadius: '12px',
                height: '400px',
                width: '100%',
                border: '2px solid #334155'
              }}
            />
          </div>
        </div>

        <div className="review-section">
          <div className="section-header">
            <h2>📊 AI Analysis</h2>
          </div>
          
          <div className="review-content">
            {isLoading ? (
              <div className="loading-container">
                <div className="ai-thinking">
                  <div className="pulse-animation"></div>
                  <h3>🤖 AI Analyzing Code...</h3>
                  <p>Please wait while our AI reviews your code</p>
                </div>
                
                {/* Skeleton Loading */}
                <div className="skeleton-loading">
                  <div className="skeleton-line skeleton-title"></div>
                  <div className="skeleton-line skeleton-medium"></div>
                  <div className="skeleton-line skeleton-long"></div>
                  <div className="skeleton-line skeleton-short"></div>
                  <div className="skeleton-line skeleton-medium"></div>
                </div>
              </div>
            ) : review ? (
              <Markdown
                rehypePlugins={[rehypeHighlight]}
                className="markdown-content"
              >
                {review}
              </Markdown>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">👨‍💻</div>
                <h3>Ready for Code Review</h3>
                <p>Write your code on the left and click Review Code to get AI-powered analysis</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
export default App