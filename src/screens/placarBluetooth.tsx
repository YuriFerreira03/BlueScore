import { Buffer } from "buffer";

const cnum = [0xb0, 0x31, 0x32, 0xb3, 0x34, 0xb5, 0xb6, 0x37, 0x38, 0xb9];

export const basePack = [
  0x02, 0x92, 0xbf, 0xb0, 0xb3, 0x45, 0x31, 0xb9, 0xb9, 0xbf, 0x32, 0xb0, 0xb0,
  0xb0, 0xb0, 0xbf, 0x34, 0xb0, 0xb0, 0x32, 0x34, 0x32, 0xb0, 0x00, 0xd9, 0x02,
  0x21, 0x23,
];

export function atualizarEquipeA(gols: number, buffer: number[]) {
  const c = Math.floor(gols / 100);
  buffer[2] = c === 0 ? 0xbf : cnum[c];
  buffer[3] = cnum[Math.floor((gols % 100) / 10)];
  buffer[4] = cnum[gols % 10];
}

export function calcularCRC8(data: number[], poly = 0x01, init = 0x80) {
  let crc = init;
  for (let i = 0; i < 24; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 0x80) {
        crc = (crc << 1) ^ poly;
      } else {
        crc <<= 1;
      }
    }
  }
  return crc & 0xff;
}

export function gerarPacoteBase64(golsEquipeA: number) {
  let buffer = [...basePack];
  atualizarEquipeA(golsEquipeA, buffer);
  buffer[24] = calcularCRC8(buffer);
  console.log("Pacote gerado:", buffer);
  return Buffer.from(buffer).toString("base64");
}
