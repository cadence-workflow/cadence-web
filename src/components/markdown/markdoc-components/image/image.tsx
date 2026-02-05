export type ImageProps = {
  src: string;
  alt?: string;
  title?: string;
  width?: string;
  height?: string;
};

export default function Image({ src, alt, title, width, height }: ImageProps) {
  const style: React.CSSProperties = {};

  if (width) {
    // Add 'px' if it's just a number
    style.width = width.match(/^\d+$/) ? `${width}px` : width;
    style.maxWidth = 'none'; // Override CSS maxWidth rule
    // When width is set, keep height auto unless explicitly set
    if (!height) {
      style.height = 'auto';
    }
  }

  if (height) {
    // Add 'px' if it's just a number
    style.height = height.match(/^\d+$/) ? `${height}px` : height;
    // When height is set, keep width auto unless explicitly set
    if (!width) {
      style.width = 'auto';
      style.maxWidth = 'none'; // Override CSS maxWidth rule
    }
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} title={title} style={style} />;
}
