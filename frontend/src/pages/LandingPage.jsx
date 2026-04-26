import { Link } from "react-router-dom";
import "./LandingPage.css";

import LogoIcon from "../assets/website-icon.png";
import Baby1 from "../assets/Baby3.png";
import Baby2 from "../assets/Baby1.png";
import Baby3 from "../assets/Baby2.png";

function Leaf({ className = "" }) {
  return (
    <div className={`leaf ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="39"
        height="67"
        viewBox="0 0 39 67"
        fill="none"
      >
        <path
          d="M0.57716 37.11C-0.91584 19.4953 19.7524 0.681458 19.7524 0.681458C19.7524 0.681458 39.895 19.6582 38.4231 37.11C37.1502 52.2022 19.7524 65.6815 19.7524 65.6815C19.7524 65.6815 1.87232 52.3906 0.57716 37.11Z"
          fill="#87B387"
          stroke="#87B387"
        />
      </svg>
    </div>
  );
}

function LandingPage() {
  return (
    <main className="landing-page">
      <header className="topbar">
        <div className="logo">
          <img src={LogoIcon} alt="Littleloop logo" className="logo-icon" />
          <span className="logo-text">Littleloop</span>
        </div>

        <div className="topbar-buttons">
          <Link className="nav-btn signup-btn" to="/signup">
            Sign Up
          </Link>
          <Link className="nav-btn login-btn" to="/login">
            Log In
          </Link>
        </div>
      </header>

      <section className="hero">
        <Leaf className="leaf-hero-left" />
        <Leaf className="leaf-hero-center" />

        <div className="hero-left">
          <h1>Littleloop</h1>
          <h2>One shirt. Three childhoods.</h2>
          <p>
            To help families save money and support each other by keeping
            children&apos;s essentials in use, and out of landfills.
          </p>
        </div>

        <div className="hero-right">
          <img
            src={Baby1}
            alt="Child smiling"
            className="hero-img small top"
          />
          <img
            src={Baby2}
            alt="Toddler standing outside"
            className="hero-img tall"
          />
          <img
            src={Baby3}
            alt="Child in shopping cart"
            className="hero-img small bottom"
          />
        </div>
      </section>

      <section className="purpose section-center">
        <h2>Our Purpose</h2>
        <p>
          Our mission is to reduce textile waste by keeping children&apos;s
          clothing and essentials in use longer, because millions of perfectly
          usable items end up in landfills every year. By helping families
          share and reuse, we&apos;re building a more sustainable future, one
          item at a time.
        </p>

        <div className="purpose-cards">
          <div className="info-card green-card">
            <div className="card-icon">❤</div>
            <h3>Find Support</h3>
            <p>
              Looking for baby essentials, clothing, or supplies? Connect with
              donors in your area.
            </p>
            <button type="button">Get Started →</button>
          </div>

          <div className="info-card green-card">
            <div className="card-icon">⬡</div>
            <h3>Donate Items</h3>
            <p>
              Have gently used baby items to share? Help a family in your
              community.
            </p>
            <button type="button">Start Giving →</button>
          </div>
        </div>
      </section>

      <section className="mission">
        <Leaf className="leaf-mission-right" />
        <Leaf className="leaf-mission-bottom" />

        <h2>Our Mission</h2>
        <div className="mission-content">
          <img
            src={Baby2}
            alt="Families and community support"
            className="mission-img"
          />

          <div className="mission-text">
            <h3>+ 183 million pieces</h3>
            <p>
              of children&apos;s clothing are sent to landfills annually.
              Children&apos;s clothing is a significant contributor to the 92
              million tons of textile waste generated worldwide yearly, often
              due to rapid growth cycles, cheap production, and the fast-fashion
              waste crisis.
            </p>
            <p>We are here to change that.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works section-center">
        <h2>How it works!</h2>
        <div className="steps">
          <div className="step-card">
            <h3>Share what you don&apos;t need</h3>
            <p>List clothes, toys, or gear your child has outgrown.</p>
          </div>

          <div className="step-card">
            <h3>Connect with local families</h3>
            <p>
              Find nearby parents who need what you have — or have what you
              need.
            </p>
          </div>

          <div className="step-card">
            <h3>Give it a second life</h3>
            <p>Pass items along and keep them out of landfills.</p>
          </div>
        </div>
      </section>

      <section className="stories section-center">
        <h2 className="stories-title">Real Stories from our Community</h2>

        <div className="stories-grid">
          <div className="story-card">
            <h3>Jazmin H.</h3>
            <span>Mom of two twins</span>
            <p>
              “We didn&apos;t expect twins, and buying everything twice just
              wasn&apos;t possible. I found a stroller and bassinet through
              Littleloop, and it honestly felt like someone had my back when I
              needed it most.”
            </p>
          </div>

          <div className="story-card">
            <h3>Hector V.</h3>
            <span>Father of one girl</span>
            <p>
              “My daughter outgrew things every few months. Instead of throwing
              stuff away, we pass it on and pick up what we need next. It saves
              us a lot of money, but more than that, it feels good knowing
              it&apos;s helping another family too.”
            </p>
          </div>

          <div className="story-card">
            <h3>Gracy W.</h3>
            <span>Grandparent of six kids</span>
            <p>
              “I help my daughter raise the kids, and clothes add up quickly.
              This community made it easier to find gently used clothes without
              spending so much. It reminds me of how neighbors used to share
              things when I was younger.”
            </p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Join Our Community?</h2>
        <p>
          Whether you need support or want to give back, we&apos;re here for
          you.
        </p>

        <div className="cta-buttons">
          <Link to="/signup" className="cta-btn">
            Find Support
          </Link>
          <Link to="/signup" className="cta-btn secondary">
            Donate Items
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;