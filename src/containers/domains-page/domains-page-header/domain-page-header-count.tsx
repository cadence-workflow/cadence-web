import React from 'react';
import { Badge } from 'baseui/badge';
import { StyleObject } from 'styletron-react';
import { Theme } from 'baseui';

type Props = {
	count: number;
};

export default function DomainPageHeaderCount({ count }: Props) {
	return (
		<Badge
			content={count}
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
