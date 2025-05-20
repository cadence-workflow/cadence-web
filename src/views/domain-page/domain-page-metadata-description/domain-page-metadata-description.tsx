import { Button } from 'baseui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MdEdit } from 'react-icons/md';

import { type DomainPageTabsParams } from '../domain-page-tabs/domain-page-tabs.types';

import { styled } from './domain-page-metadata-description.styles';
import { type Props } from './domain-page-metadata-description.types';

export default function DomainPageMetadataDescription(props: Props) {
  const { domain: encodedDomain, cluster: encodedCluster } =
    useParams<DomainPageTabsParams>();

  return (
    <styled.DescriptionContainer>
      {props.description !== '' ? (
        props.description
      ) : (
        <styled.DescriptionPlaceholder>
          No description
        </styled.DescriptionPlaceholder>
      )}
      <Button
        kind="secondary"
        shape="pill"
        size="mini"
        startEnhancer={<MdEdit />}
        $as={Link}
        href={`/domains/${encodedDomain}/${encodedCluster}/settings`}
      >
        Edit in Settings
      </Button>
    </styled.DescriptionContainer>
  );
}
