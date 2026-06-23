const EMAIL_SHAPED_ACTOR_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function isEmailShapedActor(actor: string) {
  return EMAIL_SHAPED_ACTOR_PATTERN.test(actor);
}
