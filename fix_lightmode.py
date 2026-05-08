import os

path = '/home/kaielix/PROJECTS-WEB/LearnX/learnx-web/learnx/app/admin/dashboard/courses/[slug]/edit/page.tsx'

with open(path, 'r') as f:
    content = f.read()

replacements = {
    '"flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl group relative"': '"flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none rounded-xl group relative"',
    'text-zinc-200 truncate': 'text-zinc-900 dark:text-zinc-200 truncate',
    'bg-zinc-800/50 rounded-lg': 'bg-zinc-100 dark:bg-zinc-800/50 rounded-lg',
    'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800': 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800',
    'bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 space-y-4': 'bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 shadow-sm dark:shadow-none rounded-2xl p-4 space-y-4',
    'px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-500': 'px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 shadow-sm dark:shadow-none',
    'text-base font-semibold text-zinc-100': 'text-base font-semibold text-zinc-900 dark:text-zinc-100',
    'bg-zinc-800 hover:bg-zinc-700 text-zinc-200': 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 shadow-sm dark:shadow-none',
    'border-l border-zinc-800/60': 'border-l border-zinc-200 dark:border-zinc-800/60',
    'bg-zinc-800/30 rounded-xl text-center relative overflow-hidden': 'bg-zinc-50 dark:bg-zinc-800/30 rounded-xl text-center relative overflow-hidden',
    'border-dashed border-zinc-700': 'border-dashed border-zinc-300 dark:border-zinc-700',
    'bg-zinc-700 hover:bg-zinc-600 text-zinc-200': 'bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 shadow-sm dark:shadow-none',
    'px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300': 'px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-none',
    'bg-zinc-800/50 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800': 'bg-zinc-100 dark:bg-zinc-800/50 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800',
    'bg-zinc-900/50 border border-zinc-800/60 rounded-xl': 'bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/60 rounded-xl shadow-sm dark:shadow-none',
    'text-[11px] font-medium text-zinc-400': 'text-[11px] font-medium text-zinc-600 dark:text-zinc-400',
    'px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100': 'px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100',
    'bg-zinc-700': 'bg-zinc-200 dark:bg-zinc-700',
    'text-zinc-300 flex-1': 'text-zinc-700 dark:text-zinc-300 flex-1',
    'hover:bg-zinc-800/50': 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50',
    'px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100': 'px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100',
    'px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-100': 'px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100',
    'bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-5': 'bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/60 shadow-sm dark:shadow-none rounded-2xl p-5',
    'text-2xl font-bold text-zinc-100': 'text-2xl font-bold text-zinc-900 dark:text-zinc-100',
    'text-lg font-semibold text-zinc-200': 'text-lg font-semibold text-zinc-900 dark:text-zinc-200',
    'bg-zinc-900/30': 'bg-zinc-50 dark:bg-zinc-900/30',
    'border border-dashed border-zinc-800': 'border border-dashed border-zinc-300 dark:border-zinc-800',
    'bg-zinc-900/60 border border-zinc-800/60': 'bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/60 shadow-sm dark:shadow-none rounded-xl space-y-2.5',
    'border-zinc-600 hover:border-zinc-400': 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-400',
    'text-zinc-500 hover:text-zinc-300': 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300',
    'text-zinc-400 hover:text-zinc-200 transition-colors': 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors',
    'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800': 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800',
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)
print("Done")
