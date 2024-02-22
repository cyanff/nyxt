"use client";

import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

export default function HomePage() {
  // Initial state object for visibility of divs
  const [isInView, setIsInView] = useState({
    divRef1: false,
    divRef2: false,
    divRef3: false,
    divRef4: false,
  });

  interface Refs {
    [key: string]: React.MutableRefObject<null>;
  }
  const divRefs: Refs = {
    divRef1: useRef(null),
    divRef2: useRef(null),
    divRef3: useRef(null),
    divRef4: useRef(null),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Dynamically updating state based on entry's target
          const foundRef = Object.keys(divRefs).find(
            (key) => divRefs[key].current === entry.target
          );
          if (foundRef) {
            setIsInView((prev) => ({
              ...prev,
              [foundRef]: entry.isIntersecting,
            }));
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    // Observing each ref
    Object.values(divRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Cleanup function to unobserve
    return () => {
      Object.values(divRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Additional state to control the text animation
  const [streamingText, setStreamingText] = useState("");

  // Example text content to animate
  const fullText =
    "   Paul Graham advocates for writing with ordinary words and simple sentences to ease reader engagement and comprehension. Emphasizing clarity over complexity helps ideas resonate more profoundly with the audience. This approach not only aids non-native English speakers but also maintains the writer's honesty and the longevity of their work. Graham's personal disdain for convoluted writing and his meticulous editing process further contribute to his straightforward writing style.";

  // Animate streaming text on load
  useEffect(() => {
    const intervalId = setInterval(() => {
      setStreamingText((prev) => {
        if (prev.length < fullText.length) {
          return prev + fullText[prev.length];
        } else {
          clearInterval(intervalId);
          return prev;
        }
      });
    }, 20); // Speed of the text stream

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-gradient-pink2 flex flex-col lg:flex-row items-center justify-center min-h-screen p-6 bg-gray-100">
      <ul className="flex flex-grow flex-col items-center justify-top ">
        {/* main section */}
        <div className="flex flex-row items-center justify-center h-screen">
          <div
            ref={divRefs.divRef1}
            className={`lg:flex-initial lg:pr-12 xl:pr-24 2xl:pr-32 textInitial ${
              isInView["divRef1"] ? "animate-fadeInSlide1" : ""
            }`}
          >
            <p className="text-indigo-900 bg-gradient-blue2 mb-3 max-w-max px-4 md:px-5 py-2 md:py-2.5 font-bold text-xs md:text-sm tracking-wider  rounded-full">
              RTX® Powered
            </p>
            <h1 className="tracking-[.020em] font-poppins font-bold text-8xl text-center lg:text-left text-gray-800 mb-7">
              nyxt.ai
            </h1>
            <p className="text-4xl  font-semibold text-center lg:text-left text-gray-700 mb-4">
              Summarize any article with just a click.
            </p>
            <p className="text-xl font-semibold text-center lg:text-left text-gray-700 mb-20">
              Accelerated with NVIDIA® TensorRT™
              <br />
            </p>
            <div className="flex flex-col items-start">
              <div className="flex items-center text-center space-x-6 lg:text-left">
                <Button
                  variant="default"
                  size="lg"
                  className="text-lg px-6 rounded-xl bg-blue-600 hover:bg-blue-500 transition duration-400 ease-out"
                >
                  <Link
                    href="https://github.com/cyanff/nyxt?tab=readme-ov-file#how-to-install-nyxt"
                    target="_blank"
                  >
                    add to chrome
                  </Link>
                </Button>
                <a
                  href="https://github.com/cyanff/nyxt"
                  className="bg-clear inline-flex items-center py-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/github-icon.svg"
                    alt="Github repo link"
                    className="h-10 w-10"
                  />
                </a>
              </div>
              <div className="text-center lg:text-left pl-5">
                <Button variant="link" size="lg" className="mt-4 px-1 text-lg">
                  <ScrollLink
                    to="nextDiv"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                  >
                    learn more →
                  </ScrollLink>
                </Button>
              </div>
            </div>
          </div>

          <div
            ref={divRefs.divRef2}
            className={`lg:flex-initial lg:self-center imageInitial ${
              isInView["divRef2"] ? "animate-fadeInSlide2" : ""
            }`}
          >
            <div
              id="overlay"
              className="flex flex-col w-[35vh] h-[56vh] rounded-xl shadow-2xl font-atkinson bg-neutral-50 "
            >
              <div
                id="handle"
                className="shrink-0 bg-gradient-blue3 opacity-50 text-gray-800 font-semibold py-2 px-3 rounded-t-lg flex items-center"
              >
                <div className="flex space-x-5">
                  <div
                    className="shrink-0 w-5 h-5 transition ease-in-out duration-200 hover:scale-110 group"
                    id="decrease-font"
                  >
                    <Image
                      src="/button-minus.svg"
                      alt="Chrome Extension Popup"
                      width={433}
                      height={693}
                      className="object-contain"
                    />
                  </div>
                  <div
                    className="shrink-0 w-5 h-5 transition ease-in-out duration-200 hover:scale-110 group"
                    id="increase-font"
                  >
                    <Image
                      src="/button-plus.svg"
                      alt="Chrome Extension Popup"
                      width={433}
                      height={693}
                      className="object-contain"
                    />
                  </div>

                  <div
                    className="shrink-0 w-5 h-5 transition ease-in-out duration-200 hover:scale-110 group"
                    id="refresh"
                  >
                    <Image
                      src="/button-refresh.svg"
                      alt="Chrome Extension Popup"
                      width={433}
                      height={693}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="grow"></div>
                <div className="shrink-0 flex justify-center items-center group rounded-full relative w-[15px] h-[15px] transition ease-in-out hover:scale-110 duration-200 ">
                  <Image
                    src="/button-close.svg"
                    alt="Chrome Extension Popup"
                    width={433}
                    height={693}
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="grow p-4 text-gray-600 text-left text-lg overflow-auto custom-scrollbar">
                {streamingText}
              </p>
            </div>
          </div>
        </div>
        {/* "ease of use" header */}
        <div id="nextDiv" className="flex flex-row justify-center pb-40 pt-16">
          <h1 className="font-poppins text-7xl text-center lg:text-left text-gray-800 font-bold mb-4 tracking-wide">
            Accessibility features
          </h1>
        </div>
        {/* "font scaling" section */}
        <div className="flex flex-row items-center justify-center pb-10">
          <div
            ref={divRefs.divRef4}
            className={`lg:flex-initial lg:self-center imageInitial ${
              isInView["divRef4"] ? "animate-fadeInSlide1" : ""
            }`}
          >
            <div
              id="overlay"
              className="flex flex-col w-[35vh] h-[56vh] bg-neutral-50 rounded-xl shadow-2xl font-atkinson"
            >
              <div
                id="handle"
                className="bg-gradient-blue3 opacity-50 text-gray-800 font-semibold py-2 px-3 rounded-t-lg flex items-center"
              >
                <div className="flex space-x-5">
                  <div
                    className="shrink-0 w-5 h-5 transition ease-in-out duration-200 hover:scale-110 group"
                    id="decrease-font"
                  >
                    <Image
                      src="/button-minus.svg"
                      alt="Chrome Extension Popup"
                      width={433}
                      height={693}
                      className="object-contain"
                    />
                  </div>
                  <div
                    className="shrink-0 w-5 h-5 transition ease-in-out duration-200 hover:scale-110 group"
                    id="increase-font"
                  >
                    <Image
                      src="/button-plus.svg"
                      alt="Chrome Extension Popup"
                      width={433}
                      height={693}
                      className="object-contain"
                    />
                  </div>

                  <div
                    className="shrink-0 w-5 h-5 transition ease-in-out duration-200 hover:scale-110 group"
                    id="refresh"
                  >
                    <Image
                      src="/button-refresh.svg"
                      alt="Chrome Extension Popup"
                      width={433}
                      height={693}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="grow"></div>
                <div className="shrink-0 flex justify-center items-center group rounded-full relative w-[15px] h-[15px] transition ease-in-out hover:scale-110 duration-200 ">
                  <Image
                    src="/button-close.svg"
                    alt="Chrome Extension Popup"
                    width={433}
                    height={693}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="text-gray-600 text-left text-lg  grow py-2 px-4 animate-fontScaleText overflow-auto custom-scrollbar">
                {streamingText}
              </div>
            </div>
          </div>

          <div className={`lg:flex-initial lg:pr-12 xl:pr-16 2xl:pr-20`}>
            <div className="ml-56 flex flex-col items-center px-36 py-20 bg-slate-50 rounded-3xl">
              <p className="text-3xl text-center lg:text-left text-gray-700 font-semibold mb-4 font-atkinson tracking-wide">
                Increase and decrease font sizes.
              </p>
              <p className="text-lg font-semibold text-center text-gray-600">
                Personalize your read—adjust font sizes for ultimate clarity and
                comfort.
              </p>
            </div>
          </div>
        </div>
        {/* "window scaling" section */}
        <div className="flex flex-row items-center pl-60 mb-44 h-[40rem] w-full ">
          <div className={`lg:flex-initial lg:pr-12 xl:pr-16 2xl:pr-20`}>
            <div className="justify-left mr-48 flex flex-col items-center px-36 py-16 bg-slate-50 rounded-3xl">
              <p className="text-4xl text-center lg:text-left text-gray-700 font-semibold mb-4 font-atkinson tracking-wide">
                Scalable window.
              </p>
              <p className="text-lg font-semibold text-center text-gray-600">
                Adjustable view for an optimal reading experience.
              </p>
            </div>
          </div>
          <div
            ref={divRefs.divRef3}
            className={`lg:flex-initial lg:self-center imageInitial ${
              isInView["divRef3"] ? "animate-fadeInSlide1" : ""
            }`}
          >
            <div
              id="overlay"
              className="flex flex-col w-[35vh] h-[56vh] bg-neutral-50 rounded-xl shadow-2xl animate-scaleWindow font-atkinson"
            >
              <div
                id="handle"
                className="shrink-0 bg-gradient-blue3 opacity-50 text-gray-800 font-semibold py-2 px-3 rounded-t-lg flex items-center"
              >
                <div className="flex space-x-5">
                  <div
                    className="shrink-0 w-5 h-5 transition ease-in-out duration-200 hover:scale-110 group"
                    id="decrease-font"
                  >
                    <Image
                      src="/button-minus.svg"
                      alt="Chrome Extension Popup"
                      width={433}
                      height={693}
                      className="object-contain"
                    />
                  </div>
                  <div
                    className="shrink-0 w-5 h-5 transition ease-in-out duration-200 hover:scale-110 group"
                    id="increase-font"
                  >
                    <Image
                      src="/button-plus.svg"
                      alt="Chrome Extension Popup"
                      width={433}
                      height={693}
                      className="object-contain"
                    />
                  </div>

                  <div
                    className="shrink-0 w-5 h-5 transition ease-in-out duration-200 hover:scale-110 group"
                    id="refresh"
                  >
                    <Image
                      src="/button-refresh.svg"
                      alt="Chrome Extension Popup"
                      width={433}
                      height={693}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="grow"></div>
                <div className="shrink-0 flex justify-center items-center group rounded-full relative w-[15px] h-[15px] transition ease-in-out hover:scale-110 duration-200 ">
                  <Image
                    src="/button-close.svg"
                    alt="Chrome Extension Popup"
                    width={433}
                    height={693}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="grow p-4 text-gray-600 text-left text-lg overflow-auto custom-scrollbar">
                {streamingText}
              </div>
            </div>
          </div>
        </div>

        {/* Atkinson section*/}
        <div className="flex flex-row items-center pb-96">
          <div className="lg:flex-initial lg:self-center">
            <Image
              src="/AtkinsonBlur.gif"
              height="600"
              width="600"
              className="rounded-2xl"
              alt="Show case of how Atkinson Hyperlegible glyphs are distinguishable even when blured."
            />
          </div>

          <div className={`lg:flex-initial lg:pr-12 xl:pr-16 2xl:pr-20`}>
            <div className="ml-56 flex flex-col items-center px-36 pt-6 pb-4 bg-slate-50 rounded-3xl">
              <p className="text-3xl text-center lg:text-left text-gray-700 font-semibold mb-4 font-atkinson tracking-wide">
                Atkinson Hyperlegible
              </p>
              <p className="text-lg font-semibold text-center text-gray-600">
                The Hyperlegible typeface created at the{" "}
                <Link
                  className="text-blue-600 hover:underline font-bold"
                  href="https://brailleinstitute.org/freefont"
                  target="_blank"
                >
                  Braille Institute
                </Link>
                .
                <br />
                <i>Tuned</i> for readability.
              </p>
              <Link href="https://brailleinstitute.org/give" target="_blank">
                <Image
                  src="/braille.png"
                  alt="Braile Institute Logo"
                  width="200"
                  height="200"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-row pb-5">
          <div className="space-x-2 flex flex-row items-center lg:flex-initial lg:pr-12 xl:pr-24 2xl:pr-32">
            <p className="text-xl text-center lg:text-left text-gray-700 font-semibold font-atkinson ">
              made with ❤️ by{" "}
              <Link
                className="hover:underline text-blue-600"
                href="https://twitter.com/abyssalblue_"
              >
                cyan
              </Link>
            </p>
            <a
              href="https://github.com/cyanff/nyxt"
              className="bg-clear inline-flex items-center py-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/github-icon.svg"
                alt="Github repo link"
                className="h-6 w-6"
              />
            </a>
          </div>
        </div>
      </ul>
    </div>
  );
}
