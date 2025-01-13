interface StatusProps {
  status: 'healthy' | 'warning' | 'error' | 'unknown'
  size?: 'small' | 'medium' | 'large'
}

export default function Status({ status, size = 'medium' }: StatusProps) {
  const colors = {
    healthy: 'bg-green-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-400',
    unknown: 'bg-gray-400'
  }

  const descriptions = {
    healthy: 'Operational',
    warning: 'Performance Issues',
    error: 'Not Responding',
    unknown: 'Status Unknown'
  }

  const sizes = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`${colors[status]} ${sizes[size]} rounded-full`} />
      <span className="text-sm text-gray-600">{descriptions[status]}</span>
    </div>
  )
}
