import Link from "next/link";
import { profilePath } from "@/lib/format";

type AuthorLinkProps = { nickname: string; authorId: string | null };

export const AuthorLink = ({ nickname, authorId }: AuthorLinkProps) => authorId
  ? <Link className="hover:text-accent" href={profilePath(nickname)}>u/{nickname}</Link>
  : <span title="Autor ohne verknüpftes Nutzerkonto">u/{nickname}</span>;
