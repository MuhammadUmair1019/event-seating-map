interface ErrorStateProps {
  error: string | null;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error || "Failed to load venue data"}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Please ensure venue.json exists in the public directory
        </p>
      </div>
    </div>
  );
}

