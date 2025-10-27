export default function Spinner({size = 6}: {size?: number}){
    return(
        <div role="status" aria-live="polite" className="flex tems-centre">
          <svg className={`animate-spin h-${size} w-${size} mr-2`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75"></path>
      </svg>
      <span className="sr-only">Loading</span>
        </div>
    )
}