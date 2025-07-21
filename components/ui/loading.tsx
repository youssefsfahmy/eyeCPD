"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "blue" | "indigo" | "purple" | "green" | "red";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "blue",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    blue: "border-blue-500",
    indigo: "border-indigo-500",
    purple: "border-purple-500",
    green: "border-green-500",
    red: "border-red-500",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingDotsProps {
  color?: "blue" | "indigo" | "purple" | "green" | "red";
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  color = "blue",
  className = "",
}) => {
  const colorClasses = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    red: "bg-red-500",
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div
        className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-bounce`}
      ></div>
      <div
        className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  );
};

interface LoadingPulseProps {
  className?: string;
}

export const LoadingPulse: React.FC<LoadingPulseProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
      <div
        className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full animate-pulse"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-pulse"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  );
};

export const LoadingAnimatedLogo: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
  return (
    <div
      className={`h-full w-full min-h-[50vh] flex items-center justify-center ${className}`}
    >
      <div className="relative mb-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center animate-pulse">
          <div className="text-white font-bold text-2xl">CPD</div>
        </div>
      </div>
    </div>
  );
};

interface FullPageLoadingProps {
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  variant?: "default" | "minimal" | "medical";
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  title = "Loading",
  subtitle = "Please wait while we prepare your content...",
  showProgress = true,
  variant = "default",
}) => {
  if (variant === "minimal") {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <LoadingSpinner size="xl" color="blue" />
          <p className="mt-4 text-gray-600">{title}</p>
        </div>
      </div>
    );
  }

  if (variant === "medical") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Medical Cross Icon */}
          <div className="relative mb-8">
            <div className="w-16 h-16 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="text-green-600">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 -m-2">
              <div className="w-20 h-20 border-2 border-green-200 rounded-full animate-spin opacity-30"></div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{subtitle}</p>

          {showProgress && (
            <div className="max-w-xs mx-auto">
              <div className="bg-gray-200 rounded-full h-1">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-1 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl flex items-center justify-center animate-pulse">
            <div className="text-white font-bold text-2xl">CPD</div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Progress indicator */}
        {showProgress && (
          <div className="max-w-xs mx-auto mb-6">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full animate-pulse"
                style={{
                  animation: "loading-progress 2s infinite",
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Loading dots */}
        {!showProgress && <LoadingDots color="blue" />}
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

// Skeleton loader for content areas
interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  lines = 3,
  className = "",
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded h-4 mb-3 ${
            i === lines - 1 ? "w-3/4" : "w-full"
          }`}
        ></div>
      ))}
    </div>
  );
};

// Card skeleton for dashboard/grid layouts
export const CardSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="animate-pulse">
        <div className="bg-gray-200 rounded h-6 w-3/4 mb-3"></div>
        <div className="bg-gray-200 rounded h-4 w-full mb-2"></div>
        <div className="bg-gray-200 rounded h-4 w-5/6 mb-4"></div>
        <div className="bg-gray-200 rounded h-8 w-1/3"></div>
      </div>
    </div>
  );
};

// Table skeleton
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex space-x-4 mb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="bg-gray-300 rounded h-6 flex-1"></div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 mb-3">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="bg-gray-200 rounded h-4 flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};
