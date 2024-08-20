import { BadRequestException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';
export function checkIfUserIdIsValid(userId: string) {
  if (!userId) {
    throw new BadRequestException('User id is required');
  }
  // if (!isUUID(userId)) {
  //   throw new BadRequestException('Invalid user id');
  // }
}

export function checkIfIdIsValid(organizationId: string, label: string) {
  let lowerCaseLabel = label.toLowerCase();
  if (!organizationId) {
    throw new BadRequestException(
      makeTitleCase(lowerCaseLabel) + `id is required`,
    );
  }
  if (!isUUID(organizationId)) {
    throw new BadRequestException(`Invalid ${lowerCaseLabel} id`);
  }
}

export function makeTitleCase(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
