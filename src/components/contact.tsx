'use client';

import useWeb3Forms from '@web3forms/react';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface IFormInput {
  botcheck: boolean;
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<IFormInput>({
    mode: 'onTouched',
  });

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const { submit: onSubmit } = useWeb3Forms({
    access_key: process.env.WEB3_FORM_API_KEY!,
    settings: {
      from_name: 'Jagadhatri Online Website',
      subject: 'New Contact Message from Website',
    },
    onSuccess: (msg: string) => {
      setIsSuccess(true);
      setMessage(msg);
      reset();
    },
    onError: (msg: string) => {
      setIsSuccess(false);
      setMessage(msg);
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit as SubmitHandler<IFormInput>)}
        className="flex flex-col gap-5"
      >
        <input
          type="checkbox"
          className="hidden"
          style={{ display: 'none' }}
          {...register('botcheck')}
        />

        <div>
          <input
            type="text"
            placeholder="Full Name"
            autoComplete="false"
            className={`mt-1 h-10 w-full rounded-sm border bg-gray-50 px-4 ${
              errors.name
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-gray-600'
            }`}
            {...register('name', {
              required: 'Full name is required',
              maxLength: 80,
            })}
          />
          {errors.name && (
            <div className="mt-1 text-red-600">
              <small>{errors.name.message}</small>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="email_address" className="sr-only">
            Email Address
          </label>
          <input
            id="email_address"
            type="email"
            placeholder="Email Address"
            autoComplete="false"
            className={`mt-1 h-10 w-full rounded-sm border bg-gray-50 px-4 ${
              errors.email
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-gray-600'
            }`}
            {...register('email', {
              required: 'Enter your email',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Please enter a valid email',
              },
            })}
          />
          {errors.email && (
            <div className="mt-1 text-red-600">
              <small>{errors.email.message}</small>
            </div>
          )}
        </div>

        <div>
          <textarea
            placeholder="Your Message"
            className={`mt-1 h-36 w-full rounded-sm border bg-gray-50 px-4 py-3 ${
              errors.message
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-gray-600'
            }`}
            {...register('message', {
              required: 'Enter your Message',
            })}
          />
          {errors.message && (
            <div className="mt-1 text-red-600">
              <small>{errors.message.message}</small>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-yellow-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800 hover:text-white focus:outline-hidden"
        >
          {isSubmitting ? (
            <svg
              className="mx-auto h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Send Message'
          )}
        </button>
      </form>

      {isSubmitSuccessful && isSuccess && (
        <div className="mt-3 text-center text-sm text-green-500">
          {message || 'Success. Message sent successfully'}
        </div>
      )}
      {isSubmitSuccessful && !isSuccess && (
        <div className="mt-3 text-center text-sm text-red-500">
          {message || 'Something went wrong. Please try later.'}
        </div>
      )}
    </>
  );
};

export default Contact;
