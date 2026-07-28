import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '../../common/constants';

/**
 * Public decorator
 * Marks a route as publicly accessible (bypasses JWT authentication).
 */
export const Public = () => SetMetadata(PUBLIC_KEY, true);
