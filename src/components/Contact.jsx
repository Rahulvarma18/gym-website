import { useState } from "react";
import { contactInfo } from "../data/content";
import Reveal from "./Reveal";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", interest: contactInfo.interests[0], message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to send message");

      setSent(true);
      setForm({ name: "", email: "", interest: contactInfo.interests[0], message: "" });
    } catch (err) {
      setError(err.message || "Couldn't send your message — please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="border-b border-border bg-secondary py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
            Contact
          </span>
          <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-foreground sm:text-5xl">
            Come train
            <br />
            with us.
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Drop by for a tour or send a note. We'll set up your free trial
            week.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-brass">
                Location
              </h3>
              <p className="mt-2 text-foreground">
                {contactInfo.address[0]}
                <br />
                {contactInfo.address[1]}
              </p>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-brass">
                Phone
              </h3>
              <p className="mt-2 text-foreground">{contactInfo.phone}</p>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-brass">
                Email
              </h3>
              <p className="mt-2 text-foreground">{contactInfo.email}</p>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-brass">
                Hours
              </h3>
              <ul className="mt-2 space-y-1">
                {contactInfo.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-6 text-sm text-muted-foreground">
                    <span>{h.day}</span>
                    <span className="text-foreground">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-ember"
                />
              </div>
              <div>
                <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-ember"
                />
              </div>
            </div>

            <div>
              <label htmlFor="interest" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                I'm interested in
              </label>
              <select
                id="interest"
                name="interest"
                value={form.interest}
                onChange={handleChange}
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-ember"
              >
                {contactInfo.interests.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="mt-2 w-full border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-ember"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full border border-ember bg-ember px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-transparent hover:text-ember disabled:opacity-50 sm:w-auto"
            >
              {sending ? "Sending..." : "Send message"}
            </button>

            {sent && (
              <p className="font-mono text-xs uppercase tracking-widest text-brass">
                Message received. We'll be in touch shortly.
              </p>
            )}

            {error && (
              <p className="font-mono text-xs uppercase tracking-widest text-ember">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}