const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div
      className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"
      style={{
        transform: `translate(${10 * 0.02}px, ${10 * 0.02}px)`,
      }}
    />
    <div
      className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"
      style={{
        transform: `translate(${10 * -0.015}px, ${10 * 0.01}px)`,
      }}
    />
    <div
      className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-2000"
      style={{
        transform: `translate(${10 * 0.01}px, ${10 * -0.02}px)`,
      }}
    />

    {/* Floating geometric shapes */}
    <div className="absolute top-20 left-20 w-4 h-4 bg-white/10 rotate-45 animate-bounce delay-500" />
    <div className="absolute top-40 right-32 w-6 h-6 bg-emerald-400/20 rounded-full animate-bounce delay-1000" />
    <div
      className="absolute bottom-32 left-40 w-3 h-3 bg-teal-400/30 rotate-12 animate-spin"
      style={{ animationDuration: '10s' }}
    />
    <div className="absolute top-64 right-20 w-8 h-8 bg-green-400/20 rotate-45 animate-pulse" />
  </div>
)

export default AnimatedBackground
