import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const markdownComponents: Components = {
  img: ({ node: _node, className, alt, src, ...rest }) => (
    <img
      src={src}
      alt={alt ?? ''}
      className={`my-3 max-h-[min(70vh,520px)] w-auto max-w-full rounded-md border border-border object-contain ${className ?? ''}`}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  ),
};

type IdeaMarkdownProps = {
  text: string | null;
  className?: string;
};

export function IdeaMarkdown({ text, className }: IdeaMarkdownProps) {
  if (!text?.trim()) {
    return null;
  }
  return (
    <div
      className={
        className ??
        'text-sm text-muted-foreground [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p]:last:mb-0 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5'
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={markdownComponents}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
