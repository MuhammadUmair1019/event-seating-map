"use client";

import React from "react";
import { useSeatDetails } from "@/hooks/useSeatDetails";

export default function SeatDetails() {
  const { seat, price, priceLabel } = useSeatDetails();

  if (!seat) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Click on a seat to view details
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
        Seat Details
      </h3>
      <dl className="space-y-2">
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Seat ID
          </dt>
          <dd className="text-sm text-gray-900 dark:text-gray-100">
            {seat.id}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Section
          </dt>
          <dd className="text-sm text-gray-900 dark:text-gray-100">
            {seat.sectionLabel} ({seat.sectionId})
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Row
          </dt>
          <dd className="text-sm text-gray-900 dark:text-gray-100">
            {seat.rowIndex}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Column
          </dt>
          <dd className="text-sm text-gray-900 dark:text-gray-100">
            {seat.col}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Price Tier
          </dt>
          <dd className="text-sm text-gray-900 dark:text-gray-100">
            {priceLabel}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Price
          </dt>
          <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            ${price.toFixed(2)}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Status
          </dt>
          <dd className="text-sm text-gray-900 dark:text-gray-100 capitalize">
            {seat.status}
          </dd>
        </div>
      </dl>
    </div>
  );
}

