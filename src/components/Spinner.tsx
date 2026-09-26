import '../assets/CSS/Spinner.css'

interface SpinnerProps {
    label?: string
}

function Spinner({ label = 'Loading' }: SpinnerProps) {
    return (
        <div className="spinner-wrap">
            <div className="spinner-ring" />
            {label && <span className="spinner-label">{label}</span>}
        </div>
    )
}

export default Spinner