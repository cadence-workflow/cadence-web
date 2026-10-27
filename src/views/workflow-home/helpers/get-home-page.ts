import homePageResultSchema from '../schemas/home-page-result-schema';
import { type HomePage } from '../workflow-home.types';

export default function getHomePage(result: unknown): HomePage | undefined {
  const parsed = homePageResultSchema.safeParse(result);
  if (!parsed.success) return undefined;

  const { data: content, title } = parsed.data;
  return {
    content,
    ...(title !== undefined && { title }),
  };
}
