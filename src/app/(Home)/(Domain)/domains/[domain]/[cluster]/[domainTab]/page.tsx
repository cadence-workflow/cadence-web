import DomainPageContent from '@/views/domain-page/domain-page-content/domain-page-content';
import { type Props } from '@/views/domain-page/domain-page-content/domain-page-content.types';

export default async function DomainPageContentPage(props: {
  params: Promise<Props['params']>;
}) {
  return <DomainPageContent params={await props.params} />;
}
