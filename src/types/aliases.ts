import { NotFoundException } from '@nestjs/common';

export type OrNotFound<T> = Promise<T | NotFoundException>;