'use client';
import React, { useRef } from 'react';

import { useServerInsertedHTML } from 'next/navigation';
import { type Server } from 'styletron-engine-monolithic';

import { styletron } from '@/styletron';

export default function StyledJsxRegistry() {
  const isServerInserted = useRef(false);
  useServerInsertedHTML(() => {
    if (!isServerInserted.current) {
      isServerInserted.current = true;
      const stylesheets = (styletron as Server).getStylesheets();
      return (
        <>
          {stylesheets.map((sheet, i) => (
            <style
              key={i}
              className="_styletron_hydrate_"
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs['data-hydrate']}
            />
          ))}
        </>
      );
    }
  });

  return null;
}
