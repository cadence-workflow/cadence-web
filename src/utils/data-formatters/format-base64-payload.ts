export default function formatBase64Payload(payload: string) {
  return Buffer.from(payload, 'base64').toString('utf-8');
}
