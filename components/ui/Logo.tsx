'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark' | 'auto'
  onClick?: () => void
}

const sizeMap = {
  xs: { width: 90, height: 28 },
  sm: { width: 110, height: 34 },
  md: { width: 130, height: 40 },
  lg: { width: 160, height: 50 },
}

export default function Logo({
  href = '/',
  className,
  size = 'md',
  variant = 'auto',
  onClick,
}: LogoProps) {
  const { width, height } = sizeMap[size]

  const img = (
    <Image
      src="/bluedemy-logo.png"
      alt="Bluedemy"
      width={width}
      height={height}
      className={cn(
        'object-contain',
        // For dark backgrounds, invert-free: the logo has blue + white elements
        // On dark bg, we brighten the image so the blue stays visible
        variant === 'dark' && 'brightness-0 invert',
        variant === 'auto' && 'dark:brightness-0 dark:invert',
        className
      )}
      priority
    />
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group" onClick={onClick}>
        <div className="transition-transform duration-300 group-hover:scale-105">
          {img}
        </div>
      </Link>
    )
  }

  return <div className="inline-flex items-center">{img}</div>
}
