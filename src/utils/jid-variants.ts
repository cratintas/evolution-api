export function jidLookupValues(remoteJid?: string): string[] {
  if (!remoteJid) return [];

  const values = new Set<string>([remoteJid]);
  const [user, server] = remoteJid.split('@');
  const digits = (user || '').replace(/\D/g, '');

  if (!digits) return [...values];

  const numbers = new Set<string>([digits, user]);

  if (digits.startsWith('55') && digits.length === 12) {
    numbers.add(`${digits.slice(0, 4)}9${digits.slice(4)}`);
  }
  if (digits.startsWith('55') && digits.length === 13 && digits[4] === '9') {
    numbers.add(`${digits.slice(0, 4)}${digits.slice(5)}`);
  }
  if ((digits.startsWith('52') || digits.startsWith('54')) && digits.length === 12) {
    const prefix = digits.startsWith('52') ? '1' : '9';
    numbers.add(`${digits.slice(0, 2)}${prefix}${digits.slice(2)}`);
  }
  if ((digits.startsWith('52') || digits.startsWith('54')) && digits.length === 13) {
    numbers.add(`${digits.slice(0, 2)}${digits.slice(3)}`);
  }

  const servers = new Set<string>(['s.whatsapp.net', 'lid']);
  if (server) servers.add(server);

  for (const number of numbers) {
    for (const suffix of servers) {
      values.add(`${number}@${suffix}`);
    }
  }

  return [...values];
}

export function isLidJid(jid?: string | null): boolean {
  return !!jid?.includes('@lid');
}

export function isGroupJid(jid?: string | null): boolean {
  return !!jid?.includes('@g.us');
}

export function isBroadcastJid(jid?: string | null): boolean {
  return !!jid?.includes('@broadcast');
}

export function jidUser(jid?: string | null): string {
  if (!jid) return '';
  return jid.split('@')[0].split(':')[0];
}

export function isValidPublicPhoneDigits(digits?: string | null): boolean {
  if (!digits) return false;
  if (digits.length < 10 || digits.length > 15) return false;
  if (digits.startsWith('55')) return digits.length === 12 || digits.length === 13;
  return true;
}

export function isPlaceholderContactName(name?: string | null, jid?: string | null): boolean {
  if (!name) return true;
  const normalized = name.trim().toLowerCase();
  if (!normalized || normalized === 'você' || normalized === 'voce' || normalized === 'you') return true;
  const digits = normalized.replace(/\D/g, '');
  if (digits.length > 15) return true;
  if (jid && jidUser(jid) === digits) return true;
  return false;
}

export function isPublicPhoneJid(jid?: string | null): boolean {
  if (!jid || isLidJid(jid) || isGroupJid(jid) || isBroadcastJid(jid) || jid.includes('@hosted')) return false;
  return isValidPublicPhoneDigits(jidUser(jid).replace(/\D/g, ''));
}

export function phoneJidFromKey(key?: {
  remoteJid?: string | null;
  remoteJidAlt?: string | null;
} | null): string | undefined {
  if (!key) return undefined;
  if (isPublicPhoneJid(key.remoteJid)) return key.remoteJid || undefined;
  if (isPublicPhoneJid(key.remoteJidAlt)) return key.remoteJidAlt || undefined;
  if (key.remoteJid && !isLidJid(key.remoteJid) && !isGroupJid(key.remoteJid)) return key.remoteJid;
  if (key.remoteJidAlt && !isLidJid(key.remoteJidAlt)) return key.remoteJidAlt;
  return key.remoteJid || key.remoteJidAlt || undefined;
}

export function publicPhoneDigits(jid?: string | null): string {
  if (!jid || isLidJid(jid) || isGroupJid(jid) || isBroadcastJid(jid) || jid.includes('@hosted')) return '';
  const digits = jidUser(jid).replace(/\D/g, '');
  return isValidPublicPhoneDigits(digits) ? digits : '';
}

export function toPublicPhoneJid(jid?: string | null): string | undefined {
  const digits = publicPhoneDigits(jid);
  return digits ? `${digits}@s.whatsapp.net` : undefined;
}
