import { EncryptJWT, jwtDecrypt } from 'jose';
import { createSecretKey } from 'crypto';
import { JWEPayload } from '../types';

const secretKey = createSecretKey(
    Buffer.from(process.env.JWE_SECRET!, 'base64')
);

export async function encrypt(payload: JWEPayload): Promise<string> {
    const token = await new EncryptJWT(payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .encrypt(secretKey);

    return token;
}

export async function decrypt(token: string): Promise<JWEPayload> {
    const { payload } = await jwtDecrypt(token, secretKey);
    return payload as JWEPayload;
}
