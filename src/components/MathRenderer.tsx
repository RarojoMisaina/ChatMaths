import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  math: string;
  display?: 'inline' | 'block';
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  display = 'inline',
  className = ''
}) => {
  // Sanitize input to prevent errors
  const sanitizedMath = React.useMemo(() => {
    try {
      // Basic sanitization
      return math.trim();
    } catch (error) {
      console.error('Error sanitizing math expression:', error);
      return '';
    }
  }, [math]);

  if (!sanitizedMath) {
    return null;
  }

  return (
    <div className={className}>
      {display === 'inline' ? (
        <InlineMath math={sanitizedMath} />
      ) : (
        <BlockMath math={sanitizedMath} />
      )}
    </div>
  );
};

export default MathRenderer;