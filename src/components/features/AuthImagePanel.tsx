function AuthImagePanel() {
  return (
    <div className="bg-muted relative hidden lg:block">
      <img src="/auth-photo.webp" alt="Image of a person auditing expenses" className="absolute inset-0 h-full w-full object-cover brightness-[0.2] grayscale" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,204,106,0.3) 0%, rgba(31,43,36,0.7) 100%)"
        }}
      />
    </div>
  )
}

export default AuthImagePanel