import DomainPage from '@/views/domain-page/domain-page';
import { type Props } from '@/views/domain-page/domain-page.types';

export default async function DomainPageLayout(props: {
  params: Promise<Props['params']>;
  children: React.ReactNode;
}) {
  return <DomainPage params={await props.params}>{props.children}</DomainPage>;
}
