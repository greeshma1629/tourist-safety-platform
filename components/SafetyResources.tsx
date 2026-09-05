"use client";

import {
  useState,
} from "react";

import {
  ExternalLink,
  LifeBuoy,
  Phone,
} from "lucide-react";

type Resource = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  phone: string | null;
  website_url: string | null;
  country: string | null;
  city: string | null;
};

type Props = {
  resources: Resource[];
};

const categories = [
  "all",
  "emergency",
  "medical",
  "police",
  "embassy",
  "transport",
  "travel_tip",
  "scam_awareness",
  "general",
];

export default function SafetyResources({
  resources,
}: Props) {
  const [category, setCategory] =
    useState("all");

  const filtered =
    category === "all"
      ? resources
      : resources.filter(
          (resource) =>
            resource.category ===
            category
        );

  function format(
    value: string
  ) {
    return value
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  }

  return (
    <div>
      <section className="glass-panel rounded-[26px] p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setCategory(item)
                }
                className={
                  category === item
                    ? "rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white"
                    : "glass-button rounded-full px-4 py-2 text-xs font-bold text-slate-600"
                }
              >
                {format(item)}
              </button>
            )
          )}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="glass-panel mt-6 rounded-[28px] p-12 text-center">
          <LifeBuoy className="mx-auto text-slate-400" />

          <p className="mt-4 font-bold text-slate-800">
            No resources in this category.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(
            (resource) => (
              <article
                key={resource.id}
                className="glass-card glass-card-hover rounded-[24px] p-6"
              >
                <span className="rounded-full bg-blue-100/70 px-3 py-1 text-xs font-bold text-blue-700">
                  {format(
                    resource.category
                  )}
                </span>

                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {resource.title}
                </h3>

                {resource.description && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {
                      resource.description
                    }
                  </p>
                )}

                {(resource.city ||
                  resource.country) && (
                  <p className="mt-4 text-sm font-semibold text-slate-500">
                    {[
                      resource.city,
                      resource.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  {resource.phone && (
                    <a
                      href={`tel:${resource.phone}`}
                      className="glass-button inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700"
                    >
                      <Phone
                        size={15}
                      />

                      Phone
                    </a>
                  )}

                  {resource.website_url && (
                    <a
                      href={
                        resource.website_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-button inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-blue-600"
                    >
                      Website

                      <ExternalLink
                        size={15}
                      />
                    </a>
                  )}
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}