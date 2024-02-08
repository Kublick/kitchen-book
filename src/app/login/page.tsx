export default async function SignUpPage() {
  return (
    <div className="flex flex-col justify-center items-center w-1/2">
      <>
        <h1>Sign in</h1>
        <a href="/login/github">Sign in with GitHub</a>
      </>
      <>
        <a href="/login/google">Sign in with Google</a>
      </>
    </div>
  );
}
