/**
 * Builds an (unsigned) iOS configuration profile of Web Clips: one home-screen icon per app,
 * each opening that app's URL scheme. Every Y2K Home profile shares one identifier, so
 * installing a new set replaces the last one, and removing the profile removes all its icons.
 */
export type ProfileIcon = { label: string; url: string; pngBase64: string };

const PROFILE_ID = 'com.jaylonwlv.y2khome.icons';

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function uuid() {
  const hex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16));
  hex[12] = '4';
  hex[16] = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  const s = hex.join('');
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`.toUpperCase();
}

function webClip({ label, url, pngBase64 }: ProfileIcon, index: number) {
  const id = uuid();
  return `    <dict>
      <key>FullScreen</key>
      <true/>
      <key>Icon</key>
      <data>${pngBase64}</data>
      <key>IsRemovable</key>
      <true/>
      <key>Label</key>
      <string>${escape(label)}</string>
      <key>PayloadDisplayName</key>
      <string>${escape(label)}</string>
      <key>PayloadIdentifier</key>
      <string>${PROFILE_ID}.clip${index}.${id}</string>
      <key>PayloadType</key>
      <string>com.apple.webClip.managed</string>
      <key>PayloadUUID</key>
      <string>${id}</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>Precomposed</key>
      <true/>
      <key>URL</key>
      <string>${escape(url)}</string>
    </dict>`;
}

export function buildIconProfile(themeName: string, icons: ProfileIcon[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>PayloadContent</key>
    <array>
${icons.map(webClip).join('\n')}
    </array>
    <key>PayloadDescription</key>
    <string>${escape(
      `Adds ${icons.length} ${themeName} icons to your Home Screen. It only adds icons: it can't see your data, messages or browsing. Remove this profile to remove them.`
    )}</string>
    <key>PayloadDisplayName</key>
    <string>${escape(`Y2K Home icons (${themeName})`)}</string>
    <key>PayloadIdentifier</key>
    <string>${PROFILE_ID}</string>
    <key>PayloadOrganization</key>
    <string>Y2K Home</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${uuid()}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
  </dict>
</plist>
`;
}
