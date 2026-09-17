import { Link } from "react-router-dom";

const features = [
  {
    title: "Create Tasks",
    text: "Add your academic or personal tasks in seconds.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Set Priorities",
    text: "Mark tasks as Low, Medium, or High priority.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
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
    text: "Set a due date so you know what needs to be completed.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Track Progress",
    text: "See your pending and completed tasks in one place.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M20 6 9 17l-5-5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Search & Filter",
    text: "Quickly find the task you are looking for.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Simple Dashboard",
    text: "See your total, pending, and completed tasks at a glance.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
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
          Keep track of your academic and personal tasks, set priorities, add
          due dates, and stay on top of your work.
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
