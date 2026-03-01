'use client';

import React, { useMemo } from 'react';
import { jsonToHighlightedHtml } from './utils';

export function JsonHighlight({
  data,
  inline,
}: {
  data: string | object;
  inline?: boolean;
}) {
  const html = useMemo(() => {
    const str =
      typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return jsonToHighlightedHtml(str);
  }, [data]);

  if (inline) {
    return (
      <span
        className="pm-flow-json-inline"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <pre
      className="pm-flow-data-json pm-flow-data-json-highlight"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
