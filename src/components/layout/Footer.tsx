import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full mt-14  py-4 border-t border-gray-200 dark:border-gray-700 bg-background dark:bg-gray-800">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 ">
          &copy; {new Date().getFullYear()}, Muhammad Umair
        </div>
        <div className="flex-shrink-0 ">
          <Image
            alt="a cute ghost moving around"
            src="https://github.githubassets.com/images/mona-loading-dark.gif"
            width={32}
            height={32}
            unoptimized
            loading="lazy"
            className="object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
