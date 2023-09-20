import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div>
        <div className="NavBar">
          <div className="Element">
            <Link href="/">
              Chat
            </Link>
          </div>

          <div className="Element">
            <Link href="/profile">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;