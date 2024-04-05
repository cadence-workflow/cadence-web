"use client";
import React from 'react';
import { Badge } from 'baseui/badge';
import { StyleObject } from 'styletron-react';
import { Theme } from 'baseui';

type Props = {
	content: string | number
}

export default function DomainsPageTitleBadge({ content }: Props) {

	return (
		<Badge
			content={content}
			overrides={{
				Badge: {
					style: ({ $theme }: { $theme: Theme }): StyleObject => ({
						color: $theme.colors.contentPrimary,
						backgroundColor: $theme.colors.backgroundTertiary,
						borderRadius: '20px',
						padding: `${$theme.sizing.scale0} ${$theme.sizing.scale300}`,
						...$theme.typography.LabelXSmall
					}),
				},
			}}
		/>
	);
}
