"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  Mail,
  Phone,
  Plus,
  Star,
  Trash2,
  UsersRound,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Contact = {
  id: string;
  name: string;
  relationship: string | null;
  phone: string;
  email: string | null;
  is_primary: boolean;
};

type Props = {
  initialContacts: Contact[];
};

export default function EmergencyContacts({
  initialContacts,
}: Props) {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const router = useRouter();

  const [name, setName] =
    useState("");

  const [
    relationship,
    setRelationship,
  ] = useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [primary, setPrimary] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function addContact(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setError(
        "You must be logged in."
      );

      setLoading(false);
      return;
    }

    const { error } =
      await supabase
        .from(
          "emergency_contacts"
        )
        .insert({
          user_id: user.id,
          name: name.trim(),
          relationship:
            relationship.trim() ||
            null,
          phone: phone.trim(),
          email:
            email.trim() || null,
          is_primary: primary,
        });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setName("");
    setRelationship("");
    setPhone("");
    setEmail("");
    setPrimary(false);

    setLoading(false);
    router.refresh();
  }

  async function deleteContact(
    id: string
  ) {
    if (
      !window.confirm(
        "Remove this emergency contact?"
      )
    ) {
      return;
    }

    const { error } =
      await supabase
        .from(
          "emergency_contacts"
        )
        .delete()
        .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <section className="glass-panel rounded-[28px] p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
            <Plus size={19} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Add Contact
            </h2>

            <p className="text-sm text-slate-500">
              Add a trusted person.
            </p>
          </div>
        </div>

        <form
          onSubmit={addContact}
          className="mt-6 space-y-4"
        >
          <input
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            required
            placeholder="Full name"
            className="glass-input w-full rounded-xl px-4 py-3"
          />

          <input
            value={relationship}
            onChange={(event) =>
              setRelationship(
                event.target.value
              )
            }
            placeholder="Relationship"
            className="glass-input w-full rounded-xl px-4 py-3"
          />

          <input
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value
              )
            }
            required
            placeholder="Phone number"
            className="glass-input w-full rounded-xl px-4 py-3"
          />

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            placeholder="Email (optional)"
            className="glass-input w-full rounded-xl px-4 py-3"
          />

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/70 bg-white/35 p-4">
            <input
              type="checkbox"
              checked={primary}
              onChange={(event) =>
                setPrimary(
                  event.target.checked
                )
              }
            />

            <span className="text-sm font-semibold text-slate-700">
              Mark as primary contact
            </span>
          </label>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Adding..."
              : "Add Emergency Contact"}
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <UsersRound className="text-blue-600" />

          <h2 className="text-xl font-bold text-slate-950">
            Saved Contacts
          </h2>
        </div>

        {initialContacts.length ===
        0 ? (
          <div className="glass-panel rounded-[24px] p-10 text-center">
            <p className="font-bold text-slate-800">
              No contacts yet
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Add someone you trust
              using the form.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {initialContacts.map(
              (contact) => (
                <article
                  key={contact.id}
                  className="glass-card glass-card-hover rounded-[22px] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-950">
                          {contact.name}
                        </h3>

                        {contact.is_primary && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2.5 py-1 text-xs font-bold text-amber-700">
                            <Star
                              size={12}
                            />
                            Primary
                          </span>
                        )}
                      </div>

                      {contact.relationship && (
                        <p className="mt-1 text-sm text-slate-500">
                          {
                            contact.relationship
                          }
                        </p>
                      )}

                      <div className="mt-4 space-y-2">
                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone
                            size={15}
                          />
                          {
                            contact.phone
                          }
                        </p>

                        {contact.email && (
                          <p className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail
                              size={15}
                            />
                            {
                              contact.email
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteContact(
                          contact.id
                        )
                      }
                      className="glass-button rounded-xl p-2.5 text-red-600"
                      aria-label="Delete contact"
                    >
                      <Trash2
                        size={17}
                      />
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}