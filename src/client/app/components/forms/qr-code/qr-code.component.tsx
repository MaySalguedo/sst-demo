export function QrCodeComponent({ url }: { url: string }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(url)}`;
  return (
    <img
      src={qrUrl}
      alt="Código QR"
      className="rounded-xl border border-slate-200 bg-white p-2"
      width={140}
      height={140}
    />
  );
}
