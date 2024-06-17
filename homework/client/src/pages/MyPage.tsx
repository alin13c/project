import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const MyPage = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      try {
        const response = await fetch("/docs/xinde.md");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdownText = await response.text();
        setContent(markdownText);
      } catch (error) {
        console.error("Error fetching Markdown content:", error);
      }
    };

    fetchMarkdownContent();
  }, []);
  return (
    <div className="markdown-body">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MyPage;
