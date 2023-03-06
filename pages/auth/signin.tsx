import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { getServerSession } from 'next-auth/next';
import { getProviders, signIn, ClientSafeProvider } from 'next-auth/react';
import { authOptions } from '../api/auth/[...nextauth]';
import '../tailwind.css';

type ProviderType = 'Google'; // You can add more providers here

type Provider = {
  id: ProviderType;
  name: string;
};

type Props = {
  providers: Record<ProviderType, ClientSafeProvider> | null;
};

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md">
        {/* <img
            className="w-auto h-12 mx-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=sky&shade=600"
            alt="Your Company"
          /> */}
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Or{' '}
          <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
            register an account{' '}
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 rounded border-yray-300 text-sku-600 focus:ring-sky-600"
                />
                <label
                  htmlFor="remember-me"
                  className="block ml-2 text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-sky-600 hover:text-sky-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <div className=""></div>

            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm roundyd-md bg-sky-600 hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-60"
                onClick={() => signIn()}
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  Or continue with
                </span>
              </div>
            </div>

            {/* <div className="grid grid-cols-3 gap-3 mt-6"> */}
            <div className="grid grid-cols-1 gap-3 mt-6">
              {providers &&
                Object.values(providers).map((provider) => (
                  <div key={provider.name}>
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full px-4 py-2 text-gray-500 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                      onClick={() => signIn(provider.id)}
                    >
                      {/* Sign in with{' '}   */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 45 45"
                        className="flex justify-center w-4 h-4 mx-1 align-center"
                        aria-hidden="true"
                        fill="currentColor"
                        // viewBox="0 0 20 20"
                      >
                        <defs>
                          <path
                            id="a"
                            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                          />
                        </defs>
                        <clipPath id="b">
                          <use xlinkHref="#a" overflow="visible" />
                        </clipPath>
                        <path
                          clipPath="url(#b)"
                          fill="#FBBC05"
                          d="M0 37V11l17 13z"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#EA4335"
                          d="M0 11l17 13 7-6.1L48 14V0H0z"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#34A853"
                          d="M0 37l30-23 7.9 1L48 0v48H0z"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#4285F4"
                          d="M48 48L17 24l-4-3 35-10z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/app/page' } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

// to make a button work with next-auth google, you need to add the following to the button
// onClick={() => signIn('google')}
// and add the following to the top of the page
// import { signIn, signOut, useSession } from 'next-auth/client'
