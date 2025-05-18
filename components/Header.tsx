import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";   // ← added

const Header: React.FC = () => {
    const router = useRouter();
    const isActive = (pathname: string) => router.pathname === pathname;

    /* ───────────────────────────── Auth state ───────────────────────────── */
    const { data: session, status } = useSession();        // ← added

    /* ──────────────────────────── Left side ─────────────────────────────── */
    const left = (
        <div className="left">
            <Link href="/">
                <a className="bold" data-active={isActive("/")}>
                    Feed
                </a>
            </Link>

            {/* Shown only when the user is logged in (tutorial addition) */}
            {session && (
                <Link href="/drafts">
                    <a data-active={isActive("/drafts")}>My drafts</a>
                </Link>
            )}

            <style jsx>{`
        .bold {
          font-weight: bold;
        }
        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }
        .left a[data-active="true"] {
          color: gray;
        }
        a + a {
          margin-left: 1rem;
        }
      `}</style>
        </div>
    );

    /* ──────────────────────────── Right side ────────────────────────────── */
    let right = null;

    // 1. While session is being fetched
    if (status === "loading") {
        right = <p>Validating session …</p>;
    }

    // 2. Not signed in
    if (!session && status !== "loading") {
        right = (
            <div className="right">
                <Link href="/api/auth/signin">
                    <a data-active={isActive("/signin")}>Log in</a>
                </Link>
                <style jsx>{`
          .right {
            margin-left: auto;
          }
          a {
            border: 1px solid #000;
            padding: 0.5rem 1rem;
            border-radius: 3px;
            text-decoration: none;
            color: #000;
          }
        `}</style>
            </div>
        );
    }

    // 3. Signed in
    if (session) {
        right = (
            <div className="right">
                <p>
                    {session.user?.name} ({session.user?.email})
                </p>

                <Link href="/create">
                    <button>
                        <a>New post</a>
                    </button>
                </Link>

                <button onClick={() => signOut()}>
                    <a>Log out</a>
                </button>

                <style jsx>{`
          .right {
            display: flex;
            align-items: center;
            margin-left: auto;
          }
          p {
            margin: 0;
            margin-right: 1rem;
            font-size: 13px;
          }
          a {
            border: 1px solid #000;
            padding: 0.5rem 1rem;
            border-radius: 3px;
            text-decoration: none;
            color: #000;
          }
          button {
            border: none;
            background: none;
            margin-left: 1rem;
          }
        `}</style>
            </div>
        );
    }

    /* ──────────────────────────── Render ────────────────────────────────── */
    return (
        <nav>
            {left}
            {right}
            <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
        </nav>
    );
};

export default Header;
