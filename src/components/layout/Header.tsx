interface HeaderProps {
  venueName: string;
}

export default function Header({ venueName }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {venueName}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select up to 8 seats for your event
        </p>
      </div>
    </header>
  );
}

