import React from 'react';

// The recursive node parser
function renderTiptapNode(node: Record<string, unknown>, key: number | string): React.ReactNode {
  if (!node) return null;

  if (node.type === 'text' && typeof node.text === 'string') {
    let el: React.ReactNode = node.text;
    const marks = node.marks as Array<{ type: string }> | undefined;
    if (marks) {
      for (const mark of marks) {
        switch (mark.type) {
          case 'bold': el = <strong key={key}>{el}</strong>; break;
          case 'italic': el = <em key={key}>{el}</em>; break;
          case 'underline': el = <u key={key}>{el}</u>; break;
          case 'strike': el = <s key={key}>{el}</s>; break;
          case 'code': el = <code key={key}>{el}</code>; break;
        }
      }
    }
    return el;
  }

  const children = (node.content as Record<string, unknown>[] | undefined)?.map(
    (child, i) => renderTiptapNode(child, i)
  );

  switch (node.type) {
    case 'doc': return <>{children}</>;
    case 'paragraph': return <p key={key}>{children}</p>;
    case 'heading': {
      const level = (node.attrs as { level?: number })?.level ?? 1;
      if (level === 1) return <h1 key={key}>{children}</h1>;
      if (level === 2) return <h2 key={key}>{children}</h2>;
      if (level === 3) return <h3 key={key}>{children}</h3>;
      if (level === 4) return <h4 key={key}>{children}</h4>;
      return <h5 key={key}>{children}</h5>;
    }
    case 'bulletList': return <ul key={key}>{children}</ul>;
    case 'orderedList': return <ol key={key}>{children}</ol>;
    case 'listItem': return <li key={key}>{children}</li>;
    case 'blockquote': return <blockquote key={key}>{children}</blockquote>;
    case 'codeBlock': return <pre key={key}><code>{children}</code></pre>;
    case 'horizontalRule': return <hr key={key} />;
    case 'hardBreak': return <br key={key} />;
    default: return children ? <>{children}</> : null;
  }
}

// The main exported component
export default function ChapterRenderer({ content, contentType }: { content: unknown, contentType: string }) {
  if (contentType === 'html' && typeof content === 'string') {
    return <div className="tiptap ProseMirror" dangerouslySetInnerHTML={{ __html: content }} />;
  }
  if (typeof content === 'object' && content !== null) {
    return <div className="tiptap ProseMirror">{renderTiptapNode(content as Record<string, unknown>, 'root')}</div>;
  }
  if (typeof content === 'string') {
    return <div className="tiptap ProseMirror whitespace-pre-wrap">{content}</div>;
  }
  return null;
}