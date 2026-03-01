'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Badge,
  ProsConsList,
  Grid,
} from '../../ui';

const ProseMirrorVisualizer = dynamic(
  () => import('../Visualizer/ProseMirrorVisualizer'),
  { ssr: false },
);

const LIBRARIES = [
  {
    name: 'prosemirror-model',
    badge: 'Document',
    badgeVariant: 'blue' as const,
    description: 'Document structure: Node, Fragment, Schema. Defines the data shape.',
    pros: [
      { type: 'pro' as const, text: 'Node types, marks' },
      { type: 'pro' as const, text: 'Content expressions' },
    ],
  },
  {
    name: 'prosemirror-state',
    badge: 'State',
    badgeVariant: 'green' as const,
    description: 'EditorState, selection, transactions. Single source of truth.',
    pros: [
      { type: 'pro' as const, text: 'Immutable updates' },
      { type: 'pro' as const, text: 'Plugin state' },
    ],
  },
  {
    name: 'prosemirror-view',
    badge: 'UI',
    badgeVariant: 'purple' as const,
    description: 'DOM rendering, event handling, contentEditable. Derives from state.',
    pros: [
      { type: 'pro' as const, text: 'Efficient diffing' },
      { type: 'pro' as const, text: 'Native cursor' },
    ],
  },
  {
    name: 'prosemirror-transform',
    badge: 'Changes',
    badgeVariant: 'orange' as const,
    description: 'Steps, transforms, invertible operations. Enables undo & collab.',
    pros: [
      { type: 'pro' as const, text: 'Invertible steps' },
      { type: 'pro' as const, text: 'Step maps' },
    ],
  },
];

export default function ProseMirrorOverview() {
  return (
    <>
      <Card className="prosemirror-section overview-libraries">
        <CardHeader>
          <h3>Core Libraries</h3>
        </CardHeader>
        <CardContent>
          <p>
            ProseMirror is not a single monolithic library but a collection of
            small, focused modules, each of which handles one concern. Together,
            they form a toolkit for building rich text editors with full control
            over document structure, state management, rendering, and change
            tracking.
          </p>
          <Grid cols={4}>
            {LIBRARIES.map((lib) => (
              <Card key={lib.name}>
                <CardHeader>
                  <h3>{lib.name}</h3>
                  <Badge variant={lib.badgeVariant}>{lib.badge}</Badge>
                </CardHeader>
                <CardContent>
                  <p>{lib.description}</p>
                </CardContent>
                <CardFooter>
                  <ProsConsList items={lib.pros} />
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <ProseMirrorVisualizer />
    </>
  );
}
