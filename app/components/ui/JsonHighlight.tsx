'use client';

import React, { useMemo } from 'react';
import { jsonToHighlightedHtml } from './utils/jsonHighlight';

type JsonHighlightProps = {
  data: string | object;
  inline?: boolean;
  className?: string;
};

export function JsonHighlight({
  data,
  inline = false,
  className = '',
}: JsonHighlightProps) {
  const html = useMemo(() => {
    const str = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return jsonToHighlightedHtml(str);
  }, [data]);

  const baseClass = inline ? 'ds-json-inline' : 'ds-json-pre';
  const combinedClass = `${baseClass} ${className}`.trim();

  if (inline) {
    return (
      <span
        className={combinedClass}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <pre
      className={combinedClass}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
