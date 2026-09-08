import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { buildQrisPayload } from "@/lib/qris";

type Props = {
  amount: number;
  className?: string;
  alt?: string;
};

/** Menampilkan kode QRIS dinamis yang nominalnya sesuai total tagihan. */
export function QrisCode({ amount, className, alt = "Kode QRIS pembayaran Scoffey" }: Props) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(buildQrisPayload(amount), {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 768,
      color: { dark: "#0b1220", light: "#ffffff" },
    })
      .then((url) => {
        if (alive) setSrc(url);
      })
      .catch(() => {
        if (alive) setSrc("");
      });
    return () => {
      alive = false;
    };
  }, [amount]);

  if (!src) {
    return <div className={`${className ?? ""} animate-pulse bg-muted/40`} aria-hidden />;
  }

  return <img src={src} alt={alt} width={768} height={768} className={className} />;
}
