import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div>
        <ul >
            <Link href="/">
              Chat
            </Link>
            <Link href="/profile">
              Profile
            </Link>
        </ul>
      </div>
    </>
  );
};

export default Navbar;