import Link from 'next/link'
import Logo from './Logo'

// header for inner pages (the home page has its own, with the logo-hover effect)
export default function SubHeader() {
  return (
    <header>
      <nav>
        <Link href="/" className="logo" aria-label="Tech2O Labs home"><Logo /><span>Tech<sub>2</sub>O Labs</span></Link>
        <div><Link href="/#services">Services</Link><Link href="/#faq">FAQ</Link><Link href="/#contact">Contact</Link></div>
      </nav>
    </header>
  )
}
