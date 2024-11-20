'use client';

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from 'next/link';

export default function ClientNavigation() {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {user ? (
          <>
            <li className="nav-item">
              <Link href="/profile">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/board">
                Board
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/score">
                Score
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/api/auth/logout">
                Logout
              </Link>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link href="#">
              
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}