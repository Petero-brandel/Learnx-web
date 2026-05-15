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
  src?: string
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
  src = '/bluedemy-icon.png',
}: LogoProps) {
  const { width, height } = sizeMap[size]

  const img = (
    <Image
      src={src}
      alt="Bluedemy"
      width={width}
      height={height}
      className={cn(
        'object-contain',
        // Keep logo colors natural in dark mode
        variant === 'dark' && '',
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
