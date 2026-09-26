import { Link } from 'react-router-dom'

interface BackLinkProps {
  to: string
  label: string
}

function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link to={to} className="back-link">
      <span className="back-link-arrow" aria-hidden="true">&larr;</span>
      <span className="back-link-label">{label}</span>
    </Link>
  )
}

export default BackLink