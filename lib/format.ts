const timestampFormat = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" });
const dateFormat = new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeZone: "Europe/Berlin" });

export const formatTimestamp = (date: Date) => timestampFormat.format(date);
export const formatDate = (date: Date) => dateFormat.format(date);

export const threadPath = (communitySlug: string, postId: string) => `/c/${encodeURIComponent(communitySlug)}/post/${encodeURIComponent(postId)}`;
export const profilePath = (nickname: string) => `/u/${encodeURIComponent(nickname)}`;
