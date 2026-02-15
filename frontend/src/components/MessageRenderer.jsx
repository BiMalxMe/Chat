import { useMemo } from 'react';

// Parse mentions from text
const parseMentions = (text) => {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      text: match[0],
      name: match[1],
      start: match.index,
      end: match.index + match[0].length
    });
  }
  
  return mentions;
};

function MessageRenderer({ text, className = "" }) {
  const renderedContent = useMemo(() => {
    if (!text) return text;
    
    const mentions = parseMentions(text);
    if (mentions.length === 0) return text;
    
    let parts = [];
    let lastIndex = 0;
    
    mentions.forEach((mention, index) => {
      // Add text before mention
      if (mention.start > lastIndex) {
        parts.push(text.substring(lastIndex, mention.start));
      }
      
      // Add highlighted mention
      parts.push(
        <span 
          key={`mention-${index}`} 
          className="text-orange-400 font-medium bg-orange-500/10 px-1 rounded"
        >
          {mention.text}
        </span>
      );
      
      lastIndex = mention.end;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  }, [text]);

  return (
    <span className={className}>
      {renderedContent}
    </span>
  );
}

export default MessageRenderer;
