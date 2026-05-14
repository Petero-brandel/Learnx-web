import re

with open('components/layout/Navbar.tsx', 'r') as f:
    content = f.read()

# Add isHomepage
content = content.replace("const navRef = useRef<HTMLDivElement>(null)", "const navRef = useRef<HTMLDivElement>(null)\n const isHomepage = pathname === '/'")

# Update nav class
nav_class_old = """className={cn(
 "fixed top-0 z-50 w-full transition-all duration-500 border-b",
 scrolled
 ? "bg-white/80 dark:bg-black/80 border-zinc-200 dark:border-zinc-800 shadow-sm"
 : "bg-white/50 dark:bg-black/50 border-transparent"
)}"""
nav_class_new = """className={cn(
 "fixed top-0 z-50 w-full transition-all duration-500 border-b",
 isHomepage
 ? (scrolled
 ? "bg-black/80 backdrop-blur-md border-zinc-800 shadow-sm"
 : "bg-black/50 backdrop-blur-sm border-transparent")
 : (scrolled
 ? "bg-white/80 dark:bg-black/80 border-zinc-200 dark:border-zinc-800 shadow-sm"
 : "bg-white/50 dark:bg-black/50 border-transparent")
)}"""
content = content.replace(nav_class_old, nav_class_new)

# Update logo color
logo_old = '<span className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">Bluedemy</span>'
logo_new = '<span className={cn("font-bold text-2xl tracking-tight", isHomepage ? "text-zinc-50" : "text-zinc-900 dark:text-zinc-50")}>Bluedemy</span>'
content = content.replace(logo_old, logo_new)

# Update dropdown button
btn_old = """className={cn(
 "inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
 "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
 activeMenu === item.label && "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/50"
)}"""
btn_new = """className={cn(
 "inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
 isHomepage
 ? "text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50"
 : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
 activeMenu === item.label && (isHomepage ? "text-zinc-100 bg-zinc-800/50" : "text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/50")
)}"""
content = content.replace(btn_old, btn_new)

# Update regular links
link_old = """className={cn(
 "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
 item.label === 'Teach on Bluedemy'
 ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40"
 : cn(
 "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
 pathname === item.href && "text-zinc-900 dark:text-zinc-100 font-semibold"
 )
)}"""
link_new = """className={cn(
 "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
 item.label === 'Teach on Bluedemy'
 ? (isHomepage
 ? "text-blue-400 font-semibold bg-blue-900/20 hover:bg-blue-900/40"
 : "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40")
 : cn(
 isHomepage
 ? "text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50"
 : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
 pathname === item.href && (isHomepage ? "text-zinc-100 font-semibold" : "text-zinc-900 dark:text-zinc-100 font-semibold")
 )
)}"""
content = content.replace(link_old, link_new)

# Update right nav search button
search_btn_old = """<button 
 aria-label="Search courses" 
 className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
 onClick={() => setIsSearchOpen(true)}
 >"""
search_btn_new = """<button 
 aria-label="Search courses" 
 className={cn("transition-colors", isHomepage ? "text-zinc-300 hover:text-zinc-100" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100")}
 onClick={() => setIsSearchOpen(true)}
 >"""
content = content.replace(search_btn_old, search_btn_new)

# Hide ThemeToggle and update separator & login/signup
tail_old = """<ThemeToggle />
 
 <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden lg:block"></div>

 <Link href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
 Log in
 </Link>
 <button
 onClick={() => router.push('/signup')}
 className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full px-5 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
 >
 Sign up
 </button>"""
tail_new = """{!isHomepage && <ThemeToggle />}
 
 <div className={cn("h-4 w-px hidden lg:block", isHomepage ? "bg-zinc-800" : "bg-zinc-200 dark:bg-zinc-800")}></div>

 <Link href="/login" className={cn("text-sm font-medium transition-colors", isHomepage ? "text-zinc-300 hover:text-zinc-100" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100")}>
 Log in
 </Link>
 <button
 onClick={() => router.push('/signup')}
 className={cn("rounded-full px-5 py-2 text-sm font-semibold hover:opacity-90 transition-opacity", isHomepage ? "bg-zinc-100 text-zinc-900" : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900")}
 >
 Sign up
 </button>"""
content = content.replace(tail_old, tail_new)

# Update Mobile Menu button
mobile_btn_old = """<button
 onClick={() => setIsOpen(!isOpen)}
 className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
 aria-label="Toggle menu"
 >"""
mobile_btn_new = """<button
 onClick={() => setIsOpen(!isOpen)}
 className={cn("inline-flex items-center justify-center rounded-lg p-2 transition-colors md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500", isHomepage ? "text-zinc-300 hover:bg-zinc-800/50" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50")}
 aria-label="Toggle menu"
 >"""
content = content.replace(mobile_btn_old, mobile_btn_new)

with open('components/layout/Navbar.tsx', 'w') as f:
    f.write(content)
