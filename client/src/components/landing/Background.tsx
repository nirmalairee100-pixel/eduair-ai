export default function Background() {
  return (
    <>
      <div className="absolute inset-0 -z-20 bg-white" />

      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-[140px]" />

      <div className="absolute right-0 top-60 -z-10 h-72 w-72 rounded-full bg-blue-200/40 blur-[120px]" />

      <div className="absolute left-0 bottom-20 -z-10 h-72 w-72 rounded-full bg-violet-200/40 blur-[120px]" />
    </>
  );
}
