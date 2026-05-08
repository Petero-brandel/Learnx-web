import os

path = '/home/kaielix/PROJECTS-WEB/LearnX/learnx-web/learnx/app/admin/dashboard/courses/[slug]/edit/page.tsx'
with open(path, 'r') as f:
    content = f.read()

replacements = {
    'dark:hover:bg-zinc-200 dark:bg-zinc-700': 'dark:hover:bg-zinc-700',
    'bg-zinc-100 dark:bg-zinc-100 dark:bg-zinc-800/50': 'bg-zinc-100 dark:bg-zinc-800/50',
    'h-px bg-zinc-800': 'h-px bg-zinc-200 dark:bg-zinc-800',
    # Ensure Add Module and Add Lesson keep their primary dark look if needed
    'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 shadow-sm dark:shadow-none rounded-lg': 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 rounded-lg',
}
for old, new in replacements.items():
    content = content.replace(old, new)
with open(path, 'w') as f:
    f.write(content)
print("Done")
