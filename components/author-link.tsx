import Link from "next/link";
import { profilePath } from "@/lib/format";

type AuthorLinkProps = { nickname: string; authorId: string | null };

export const AuthorLink = ({ nickname, authorId }: AuthorLinkProps) => authorId
  ? <Link href={profilePath(nickname)}>u/{nickname}</Link>
  : <span title="Autor ohne verknüpftes Nutzerkonto">u/{nickname}</span>;
