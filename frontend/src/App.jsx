import { useEffect, useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowUpRight,
  Code2,
  Download,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import {
  profile,
  education,
  experience,
  services,
  projects,
} from "./portfolio";

const navigation = [
  ["/", "Home"],
  ["/about", "About"],
  ["/projects", "Projects"],
  ["/education", "Education"],
  ["/services", "Services"],
  ["/contact", "Contact"],
];

function PageHeading({ eyebrow, title, children }) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p className="lead">{children}</p>}
    </div>
  );
}

function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const current = navigation.find(([path]) => path === location.pathname);
    document.title = `${current?.[1] || "Portfolio"} | ${profile.name}`;
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label={`${profile.name} home`}>
            <span className="logo">{profile.initials}</span>
            <span>{profile.name}<small>SOFTWARE DEVELOPER</small></span>
          </Link>

          <nav aria-label="Main navigation">
            {navigation.map(([path, label]) => (
              <NavLink key={path} to={path} end={path === "/"}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content" className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/education" element={<Education />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="container footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Built with React. Designed with purpose.</span>
        <a href={`mailto:${profile.email}`}>Let’s connect <ArrowUpRight size={15} /></a>
      </footer>
    </>
  );
}

function Home() {
  const location = useLocation();

  return (
    <>
      {location.state?.contactCaptured && (
        <div className="notice" role="status">
          Thanks, your message was sent. I&apos;ll get back to you soon.
        </div>
      )}

      <section className="hero">
        <div>
          <p className="eyebrow"> RANANJAY CHAUHAN · DEVELOPER & CONTINUOUS LEARNER </p>
          <h1>
            Software for<br />
            <span>the everyday.</span>
          </h1>
          <p className="hero-name">Hi, I’m {profile.name}.</p>
          <p className="lead">{profile.introduction}</p>

          <div className="actions">
            <Link to="/projects" className="button">
              Explore my work <ArrowUpRight size={18} />
            </Link>
            <Link to="/about" className="button secondary">About me</Link>
          </div>

          <p className="location"><MapPin size={16} /> {profile.location}</p>
        </div>

        <aside className="home-portrait">
          <div className="portrait-frame">
            <img
            src={profile.photo}
            alt="Rananjay Chauhan"
            fetchPriority="high"
            />
          </div>
          <div className="portrait-note">
          <span className="handwritten">A little about me</span>
          <p>
            I enjoy making complicated things feel simpler—
            whether that is an application, a technical problem,
            or the next thing I am learning.
          </p>
          <Link to="/about" className="text-link">
          My story <ArrowUpRight size={16} />
          </Link>
          </div>
          </aside>
          </section>

      <section className="section">
        <div className="section-heading">
          <div><p className="eyebrow">MY APPROACH</p><h2>Built on strong foundations.</h2></div>
          <Link to="/services" className="text-link">Explore services <ArrowUpRight size={16} /></Link>
        </div>
        <div className="grid three">
          {[
            ["01", "Clarity first", "Translate complex requirements into understandable, maintainable solutions."],
            ["02", "Security in mind", "Consider data handling and secure coding throughout development."],
            ["03", "Always improving", "Learn through implementation, testing, feedback, and iteration."],
          ].map(([number, title, description]) => (
            <article className="card" key={number}>
              <span className="card-number">{number}</span>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function About() {
  return (
    <section className="page">
      <PageHeading eyebrow="BEHIND THE CODE" title="A developer. A problem solver.">
        {profile.tagline}
      </PageHeading>

      <div className="about-grid">
        <img className="portrait" src={profile.photo} alt={profile.name} />
        <div>
          <h2>{profile.name}</h2>
          <p className="lead">{profile.about}</p>
          <a className="button" href={profile.resume} target="_blank" rel="noreferrer">
            <Download size={18} /> View résumé PDF
          </a>
          <h3 className="spaced">Tools & technologies</h3>
          <div className="tags">{profile.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
        </div>
      </div>

      <div className="section">
        <p className="eyebrow">EXPERIENCE</p>
        <h2>Technical work. Human impact.</h2>
        <div className="timeline">
          {experience.map(item => (
            <article className="timeline-item" key={item.company}>
              <p className="eyebrow">{item.dates}</p>
              <h3>{item.role}</h3>
              <p className="accent">{item.company}</p>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectImage({ project }) {
  const positions = {
    left: "0% 50%",
    center: "50% 50%",
    right: "100% 50%",
  };

  return (
    <div
      className="project-cover"
      role="img"
      aria-label={`Conceptual cover illustration for ${project.title}`}
      style={{
        backgroundImage: `url("${project.image}")`,
        backgroundPosition:
          positions[project.coverPosition] || "50% 50%",
      }}
    >
      <span className="cover-caption">Project illustration</span>
    </div>
  );
}

function Projects() {
  return (
    <section className="page">
      <PageHeading
        eyebrow="A FEW THINGS I’VE BUILT"
        title="Different problems. The same curiosity."
      >
        From keeping a job search organized to understanding energy
        use and tracking fitness goals—these projects reflect the
        kinds of problems I enjoy working on.
      </PageHeading>

      <div className="grid three">
        {projects.map((project) => (
          <article
            className="card project-card"
            key={project.title}
          >
            <ProjectImage project={project} />

            <div className="project-body">
              <p className="eyebrow">{project.category}</p>

              {project.needsDetails && (
                <p className="draft-label">
                  Draft: real project details needed
                </p>
              )}

              <h2>{project.title}</h2>
              <p>{project.description}</p>

              <p>
                <strong>My role:</strong> {project.role}
              </p>

              <p>
                <strong>Outcome:</strong> {project.outcome}
              </p>

              <div className="tags">
                {project.technologies.map((technology) => (
                  <span key={technology}>
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="page">
      <PageHeading eyebrow="CONTINUOUS LEARNING" title="Knowledge that shapes my work.">
        Formal education alongside ongoing technical learning.
      </PageHeading>
      <div className="timeline">
        {education.map(item => (
          <article className="timeline-item card" key={item.institution}>
            <p className="eyebrow">{item.date}</p>
            <h2>{item.title}</h2>
            <p className="accent">{item.institution}</p>
            <p>{item.qualification}</p>
          </article>
        ))}
      </div>
      <div className="card certification">
        <ShieldCheck size={30} />
        <div>
          <h3>Additional certifications</h3>
          <p>CompTIA A+ · Cloud Computing (UoT) · Secure Coding (UW) · Google IT</p>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="page">
      <PageHeading eyebrow="HOW I CAN HELP" title="From requirements to working software.">
        Practical development services grounded in clarity and thoughtful implementation.
      </PageHeading>
      <div className="grid two">
        {services.map(service => (
          <article className="card service-card" key={service.number}>
            <span className="card-number">{service.number}</span>
            <Code2 size={28} className="accent" aria-hidden="true" />
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
      <div className="callout">
        <h2>Have a project in mind?</h2>
        <Link className="button" to="/contact">Start a conversation <ArrowUpRight size={18} /></Link>
      </div>
    </section>
  );
}

function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "", lastname: "", phone: "", email: "", message: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Your message could not be sent.");
      }

      navigate("/", { state: { contactCaptured: true } });
    } catch (submitError) {
      setError(`${submitError.message} Please try again or contact me by email.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <PageHeading eyebrow="LET’S CONNECT" title="Good work starts with a conversation.">
        Discuss a project, ask a question, or simply say hello.
      </PageHeading>

      <div className="contact-grid">
        <aside className="card contact-panel">
          <Mail size={32} className="accent" />
          <h2>Get in touch</h2>
          <p>Email</p>
          <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a>
          <p className="location"><MapPin size={16} /> {profile.location}</p>
          <hr />
          <p>Messages sent with this form are saved securely, and I&apos;ll reply by email.</p>
        </aside>

        <form className="card contact-form" onSubmit={handleSubmit}>
          <div className="grid two">
            <label>First name
              <input name="firstname" value={form.firstname} onChange={handleChange} autoComplete="given-name" required maxLength={80} />
            </label>
            <label>Last name
              <input name="lastname" value={form.lastname} onChange={handleChange} autoComplete="family-name" required maxLength={80} />
            </label>
          </div>
          <label>Email address
            <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required maxLength={254} />
          </label>
          <label>Contact number (optional)
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" maxLength={30} />
          </label>
          <label>Message
            <textarea name="message" value={form.message} onChange={handleChange} required rows={5} maxLength={3000} />
          </label>
          {error && <p role="alert">{error}</p>}
          <button className="button" type="submit" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Sending…" : "Send message"} <ArrowUpRight size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section className="page">
      <PageHeading eyebrow="404" title="That page isn’t here." />
      <Link className="button" to="/">Back to Home</Link>
    </section>
  );
}

export default function App() {
  return <HashRouter><Layout /></HashRouter>;
}
