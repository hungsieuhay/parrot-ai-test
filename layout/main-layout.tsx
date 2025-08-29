/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <div className="relative">
        <img
          src="/image/graphic.png"
          alt="graphic"
          className="absolute -top-[20px] left-1/2 min-w-[1600px] -translate-x-1/2"
        />
        <ul className="relative container my-6 flex justify-center gap-4 text-white">
          <li className="hover:opacity-80">
            <Link href="/">Rankings</Link>
          </li>
          <li className="hover:opacity-80">
            <Link href="/answer-form">Form answer</Link>
          </li>
        </ul>
        {children}
      </div>
    </div>
  );
};
