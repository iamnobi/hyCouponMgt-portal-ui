import * as forge from 'node-forge';

/**
 * 加密相關元件庫
 */
export class Crypto {
  publicKey;

  /**
   * 建構子
   */
  constructor() {}

  /**
   * 後台提供的公鑰
   * @param {string} key 公鑰
   */
  usePublicKey(key) {
    this.publicKey = forge.pki.publicKeyFromPem(key);
  }

  /**
   * RSA 加密函式，使用 RSAES-OAEP/SHA-256/MGF1-SHA-1 進行加密（相容 Java 的 RSA/ECB/OAEPWithSHA-256AndMGF1Padding）
   * @param {string} data 欲加密的明文
   * @returns 加密的密文
   */
  encrypt(data) {
    if (!this.publicKey) {
      // TODO: i18n message
      console.log('Missing public key');
      return;
    }

    try {
      // encrypt data with a public key using RSAES-OAEP/SHA-256/MGF1-SHA-1
      // compatible with Java's RSA/ECB/OAEPWithSHA-256AndMGF1Padding
      return this.publicKey.encrypt(data, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha256.create()
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Encode a string to base64 format
   * @param {string} bytes Data to encode
   * @returns {string} A base64 encoded string
   */
  encodeBase64(bytes) {
    return forge.util.encode64(bytes);
  }

  /**
   * Decode a base64 encoded string
   * @param {string} bytes Decode a base64 format string
   * @returns {string} A plain text string
   */
  decodeBase64(bytes) {
    return forge.util.decode64(bytes);
  }
}
