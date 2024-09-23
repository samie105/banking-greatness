"use client";
import React, { useEffect, useState } from "react";
import { useColors } from "@/context/colorContext";
import { usePathname } from "next/navigation";
import hero from "@/public/assets/hero-logo-blue.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const MotionLink = motion(Link);
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    // Show button when the user scrolls beyond 100 pixels
    if (window.scrollY > 80) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  type navItems = {
    id: number;
    name: string;
    path: string;
    className: string;
  }[];
  const pathname = usePathname();
  const nav: navItems = [
    {
      id: 1,
      name: "Home",
      path: "/",
      className: "animate__animated animate__fadeInUp ",
    },
    {
      id: 2,
      name: "Contacts",
      path: "/contact",
      className: "animate__animated animate__fadeInUp animate__delay",
    },
  ];
  const colors = useColors();
  return (
    <div
      className={`nav_cont transition-all z-50  ${
        showButton
          ? "border-b bg-white py-5  md:py-3 "
          : "bg-gradient-to-b pb-12 pt-5 md:pt-3 from-white via-white to-transparent border-0"
      }  fixed top-0 w-full px-10 flex justify-between md:grid items-center text-sm md:grid-cols-12 `}
      // style={{ background: colors.defaultblu }}
    >
      <div className="logo col-span-1 font-bold animate__animated animate__fadeInUp animate__faster">
        <Image
          src={hero}
          alt=""
          width={1000}
          height={1000}
          className="w-16 h-6 opacity-80"
          style={{ color: colors.defaultblue }}
        />
      </div>
      <div className="menu col-span-9 justify-center  hidden md:flex text-xs items-center">
        <AnimatePresence>
          {nav.map((nav) => (
            <motion.div
              key={nav.path}
              className={`${
                nav.path === pathname
                  ? `font-bold text-neutral-700  rounded-full`
                  : "text-neutral-500 hover:opacity-100 font-semibold"
              } cursor-pointer /overflow-hidden text-sm px-5 py-2 relative transition ${
                nav.className
              }`}
            >
              <MotionLink href={nav.path}>
                <motion.p className="z-30">{nav.name}</motion.p>
                {nav.path === pathname ? (
                  <motion.div
                    transition={{ type: "spring" }}
                    style={{ backgroundColor: colors.defaultblue + "06" }}
                    layoutId="underline"
                    className="absolute  mover bg-[#ffffff26] rounded-full top-0 left-0 w-full h-full z-10 "
                  ></motion.div>
                ) : null}
              </MotionLink>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Link
        href={"/auth/login"}
        className="cta col-span-2 hidden md:flex  items-center gap-2"
      >
        <div className="text-nowrap font-bold text-neutral-500 px-5 py-3 rounded-full bg-neutral-100 cursor-pointer hover:opacity-90 transition-all">
          Sign-in
        </div>
        <div className="text-nowrap px-5 py-3 rounded-full font-bold bg-base-color/80 text-white cursor-pointer hover:opacity-90 transition-all">
          Get Started
        </div>
      </Link>
      <div className="sidemenu md:hidden">
        <Sheet>
          <SheetTrigger>
            <div
              className="icon text-white"
              style={{ color: colors.defaultblue }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </SheetTrigger>{" "}
          <SheetContent
            className="border-none /relative text-white w-[80%]"
            side={"left"}
            style={{ background: colors.defaultblue }}
          >
            {" "}
            <SheetHeader>
              {" "}
              <div className="logo flex justify-center text-white font-bold">
                <Image
                  src={hero}
                  alt=""
                  width={1000}
                  height={1000}
                  className="w-16 h-6"
                />{" "}
              </div>{" "}
            </SheetHeader>
            <div className="mt-20">
              <p className="uppercase font-bold mb-5 text-white/80 /text-sm">
                MENU
              </p>
              <AnimatePresence>
                {nav.map((nav) => (
                  <motion.div
                    key={nav.path}
                    className={`${
                      nav.path === pathname
                        ? `font-bold text-[#fff] rounded-xl`
                        : "text-white font-bold opacity-70 hover:opacity-100"
                    } cursor-pointer /overflow-hidden text-sm  px-5 py-4 relative transition`}
                  >
                    <MotionLink href={nav.path}>
                      <motion.p className="z-30">{nav.name}</motion.p>
                      {nav.path === pathname ? (
                        <motion.div
                          transition={{ type: "spring" }}
                          layoutId="underline"
                          className="absolute mover bg-[#ffffff26] rounded-xl top-0 left-0 w-full h-full z-10"
                        ></motion.div>
                      ) : null}
                    </MotionLink>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="cta absolute bottom-4 text-sm left-0 w-full px-5 text-center">
              <p className=" line h-0.5 w-[20%] bg-white/30 rounded-full mx-auto mb-4"></p>
              <Link
                href={"/auth/login"}
                // style={{ background: colors.defaultblue }}

                className=" px-5 py-3 rounded-xl  font-semibold bg-white/10 /text-white cursor-pointer hover:opacity-90 transition-all"
              >
                Sign-in
              </Link>
              <div
                className="mt-2 px-5 py-3 rounded-xl font-semibold text-white cursor-pointer hover:opacity-90 transition-all"
                style={{ background: colors.darkdefualtblue }}
              >
                Get Started
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
