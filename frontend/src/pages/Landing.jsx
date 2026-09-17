import { Link } from "react-router-dom";

const features = [
  {
    title: "Create Tasks",
    text: "Add academic or personal tasks in seconds.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Subject Organization",
    text: "Organize tasks by subject or category.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
        <path d="M15 4v5h5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Priorities",
    text: "Know which tasks need your attention first.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path
          d="M4 21V10M12 21V4M20 21v-7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Due Dates",
    text: "Keep track of upcoming deadlines.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Today View",
    text: "See what needs to be done today.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Progress",
    text: "Track completed tasks and your productivity.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const steps = [
  { title: "Create a Task", text: "Add what you need to do." },
  { title: "Set Your Plan", text: "Choose a priority and due date." },
  {
    title: "Complete Your Work",
    text: "Mark tasks as completed and track your progress.",
  },
];

const Landing = () => {
  return (
    <div className="landing">
      <header className="landing-hero">
        <h1>Manage Your Tasks. Stay Organized.</h1>
        <p>
          Plan your academic and personal tasks, set priorities, track due
          dates, and stay on top of your work.
        </p>
        <div className="landing-hero-buttons">
          <Link to="/register" className="btn-link btn-primary-link">
            Get Started
          </Link>
          <Link to="/login" className="btn-link">
            Login
          </Link>
        </div>
      </header>

      <section className="landing-section">
        <h2>Everything You Need to Manage Your Tasks</h2>
        <div className="landing-features">
          {features.map((feature) => (
            <div className="landing-feature-card" key={feature.title}>
              <div className="landing-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section landing-section-alt">
        <h2>How It Works</h2>
        <div className="landing-steps">
          {steps.map((step, index) => (
            <div className="landing-step-card" key={step.title}>
              <div className="landing-step-number">{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section landing-auth-message">
        <h2>Your Tasks, Your Space</h2>
        <p>
          Create an account to keep your tasks private and manage them from your
          personal dashboard.
        </p>
        <Link to="/register" className="btn-link btn-primary-link">
          Create Free Account
        </Link>
      </section>

      <section className="landing-cta">
        <h2>Ready to Get Organized?</h2>
        <p>Start managing your tasks today.</p>
        <Link to="/register" className="btn-link btn-primary-link">
          Get Started
        </Link>
      </section>

      <footer className="landing-footer">
        <p className="landing-footer-title">Student Task Manager</p>
        <p>Simple task management for students.</p>
        <p className="landing-footer-copy">© 2026 Student Task Manager</p>
      </footer>
    </div>
  );
};

export default Landing;
