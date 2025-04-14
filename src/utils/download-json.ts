import losslessJsonStringify from './lossless-json-stringify';

export default function downloadJson(jsonData: any, filename: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const blob = new Blob([losslessJsonStringify(jsonData, null, '\t')], {
    type: 'application/json',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
