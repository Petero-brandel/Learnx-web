"use client";

import Image from 'next/image';
import { useState } from 'react';

type Member = {
  name: string;
  role: string;
  image: string;
  bio: string[];
};

export default function TeamMember({ member }: { member: Member }) {
  const [expanded, setExpanded] = useState(false);
  const combined = member.bio.join('\n\n');

  return (
    <div className="group max-w-md mx-auto w-full overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50 hover:shadow-xl hover:shadow-zinc-900/10 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[5/4] w-full overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 42vw, 360px"
          className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
      </div>
      <div className="p-6 text-left">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{member.name}</h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-medium">{member.role}</p>

        <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <p
            className={`transition-all ${expanded ? '' : 'overflow-hidden'}`}
            style={
              expanded
                ? {}
                : {
                    display: '-webkit-box',
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: 'vertical',
                  }
            }
          >
            {combined}
          </p>

          <button
            type="button"
            onClick={() => setExpanded((s) => !s)}
            className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      </div>
    </div>
  );
}
