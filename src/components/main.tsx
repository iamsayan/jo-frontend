import React, { ReactNode } from "react";
import { cn } from "@/utils/functions";
import NavBar from "./navbar";
import Footer from "./footer";

interface MainProps {
  children: ReactNode;
  className?: string;
  jsonLd?: object; // You might want to replace `object` with a more specific type if you know the structure
}

const Main: React.FC<MainProps> = ({ children, className, jsonLd }) => {
  const classes = cn("flex flex-col flex-wrap items-center justify-between", className);

  return (
    <>
      {typeof jsonLd !== "undefined" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <NavBar />
      <main className={classes}>{children}</main>
      <Footer />
    </>
  );
};

export default Main;
