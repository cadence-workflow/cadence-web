import 'server-only';
// cache is not present in stable React 18's type definitions
// It is available only in their canary, or with Next.js
// eslint-disable-next-line import/named
import { cache } from 'react';

import { getAllDomains } from './get-all-domains';

const getCachedAllDomains = cache(getAllDomains);
export default getCachedAllDomains;
