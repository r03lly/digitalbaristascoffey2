/**
 * Membangun payload QRIS dinamis: kode statis merchant + nominal tagihan.
 * Nominal disisipkan pada tag 54 dan CRC (tag 63) dihitung ulang.
 */

// Kode QRIS statis merchant Scoffey (NMID ID1026470781497).
export const QRIS_STATIC =
  "00020101021126570011ID.DANA.WWW011893600915300028286702090002828670303UMI51440014ID.CO.QRIS.WWW0215ID10264707814970303UMI5204581253033605802ID5907SCOFFEY6015Kota Banjarbaru6105707146304466D";

function crc16(input: string): string {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function tag(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

export function buildQrisPayload(amount: number, base: string = QRIS_STATIC): string {
  // Buang CRC lama (tag 63 di akhir payload).
  let body = base.slice(0, -8).endsWith("6304") ? base.slice(0, -8) : base.replace(/6304[0-9A-Fa-f]{4}$/, "");

  // Ubah point of initiation 11 (statis) menjadi 12 (dinamis).
  body = body.replace("010211", "010212");

  const value = Math.round(amount).toString();
  const amountTag = tag("54", value);

  // Sisipkan nominal tepat sebelum tag 58 (country code).
  const idx = body.indexOf("5802ID");
  const withAmount =
    idx >= 0 ? `${body.slice(0, idx)}${amountTag}${body.slice(idx)}` : `${body}${amountTag}`;

  const payload = `${withAmount}6304`;
  return `${payload}${crc16(payload)}`;
}
