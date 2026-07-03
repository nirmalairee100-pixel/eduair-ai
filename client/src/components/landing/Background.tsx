export default function Background() {
  return (
    <>
      <div className="absolute inset-0 -z-20 bg-black" />

      <div className="absolute left-1/2 top-40 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="absolute right-20 top-80 -z-10 h-72 w-72 rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="absolute left-20 bottom-20 -z-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
    </>
  );
}