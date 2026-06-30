import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';

export type Props = {
  json: PrettyJsonValue | null;
  title?: string;
};
