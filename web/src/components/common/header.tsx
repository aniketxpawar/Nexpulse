'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import Typography from '@/components/ui/typography'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MenuIcon, X } from 'lucide-react'

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function Header({ className }: SidebarProps) {
  const pathname = usePathname()
  const items = [
    {
      href: '/',
      title: 'Home',
      openInNewTab: false
    }
  ]
  const role = localStorage.getItem('role')
  // Conditionally add 'My Appointments' if the role is 'patient'
  if (role === 'patient') {
    items.push({
      href: '/doctors',
      title: 'Doctors',
      openInNewTab: false
    })
    items.push({
      href: '/my-appointments',
      title: 'My Appointments',
      openInNewTab: false,
    })
  }

  if (role === 'doctor') {
    items.push({
      href: '/dashboard/home',
      title: 'My Dashboard',
      openInNewTab: false
    })
  }

  const getLogo = () => (
    <Link href="/" className="pointer flex items-center">
      <Typography className="!text-base font-bold">
        NexPulse
      </Typography>
    </Link>
  )

  const getAuthButtons = () => (
    <div className="flex gap-3 items-center">
      <Link
        href="/"
        target="_blank"
      >
        <Typography variant="p">Login</Typography>
      </Link>
      <Link
        href="/"
        target="_blank"
      >
        <Button color="ghost">
          <Typography variant="p" className="text-white">
            Sign Up
          </Typography>
        </Button>
      </Link>
    </div>
  )

  const getHeaderItems = () => {
    return (
      <>
        {items.map((item) => {
          const selected =
            pathname === item.href ||
            pathname.includes(item.href)
          return (
            <Link
              href={item.href}
              className="pointer block w-fit"
              target={item.openInNewTab ? '_blank' : ''}
              key={item.title}
            >
              <Typography
                variant="p"
                className={cn(selected && 'text-primary')}
              >
                {item.title}
              </Typography>
            </Link>
          )
        })}
      </>
    )
  }

  return (
    <div
      className={cn(
        `flex md:h-12 h-14 items-center justify-center w-full
          border-b`,
        className
      )}
    >
      <div className="w-full max-w-7xl">
        {/* Desktop */}
        <div className="flex items-center gap-x-8 w-full">
          <div className="md:flex-0 min-w-fit flex-1">
            {getLogo()}
          </div>
          <div className="hidden md:flex items-center w-full">
            <div className="flex items-center gap-x-8 flex-1">
              {getHeaderItems()}
            </div>
            {getAuthButtons()}
          </div>
          {/* Mobile */}
          <div className="md:hidden flex gap-x-4 items-center">
            {getAuthButtons()}
            <Sheet>
              <SheetTrigger asChild>
                <MenuIcon />
              </SheetTrigger>
              <SheetContent className="h-screen top-0 right-0 left-auto mt-0 w-64 rounded-none">
                <div className="mx-auto w-full p-5">
                  <SheetHeader>
                  </SheetHeader>
                  <div className="p-4 pb-0 space-y-4">
                    {getHeaderItems()}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}