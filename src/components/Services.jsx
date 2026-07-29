import React from "react";
import { FaTools, FaWrench, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const services = [


  

  

  {
    icon: <FaTools size={32} color="#00FF9C" />,
    title: "Racket Stringing",
    desc: "High-precision stringing with optimal tension control for maximum performance on court.",
    tag: "Most Popular",
    price: "Starting ₹299",
    path: "/services/stringing",
    btn: "Book Now",
  },
  {
    icon: <FaWrench size={32} color="#00FF9C" />,
    title: "Racket Repair",
    desc: "Fix broken frames, grips, and restore your racket back to peak condition.",
    tag: "Quick Turnaround",
    price: "Starting ₹199",
    path: "/services/repair",
    btn: "Book Now",
  },
  {
    icon: <FaUserTie size={32} color="#00FF9C" />,
    title: "Coaching",
    desc: "Train with certified professionals and level up your footwork, smash, and strategy.",
    tag: "Pro Certified",
    price: "Starting ₹999/mo",
    path: "/services/coaching",
    btn: "Join Now",
  },
];

function Services() {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>

      {/* Badge */}
      <div style={styles.badge}>OUR SERVICES</div>

      <h2 style={styles.heading}>
        Everything Your Game Needs
      </h2>
      <p style={styles.subtext}>
        Expert stringing, repair, and coaching to elevate your performance
      </p>

      <div style={styles.grid}>
        {services.map((s, i) => (
          
          <div
            key={i}
            style={styles.card}
            onClick={() => {console.log("Path:",s.path);
              navigate(s.path)}}
             onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.borderColor = "#00FF9C";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,255,156,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#222";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
            }}
          >
            {/* Tag */}
            <div style={styles.tag}>{s.tag}</div>

            {/* Icon circle */}
            <div style={styles.iconCircle}>
              {s.icon}
            </div>

            <h3 style={styles.cardTitle}>{s.title}</h3>
            <p style={styles.cardDesc}>{s.desc}</p>

            {/* Divider */}
            <div style={styles.divider} />

            {/* Price + Button */}
            <div style={styles.cardBottom}>
              <span style={styles.price}>{s.price}</span>
              <button
                style={styles.btn}
                onClick={(e) => {e.stopPropagation();
                                 navigate(s.path);}}
                onMouseEnter={(e) => {
                  e.target.style.background = "#00FF9C";
                  e.target.style.color = "#000";
                  e.target.style.borderColor = "#00FF9C";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#fff";
                  e.target.style.borderColor = "#fff";
                }}
              >
                {s.btn}
              </button>
            </div>

            

          </div>
        ))}
      </div>

      {/* Bottom note */}
      <p style={styles.note}>
        ✅ &nbsp;All services available in-store &nbsp;·&nbsp; 📦 &nbsp;Doorstep pickup available &nbsp;·&nbsp; ⚡ &nbsp;Same-day service
      </p>

    </div>
    
  );
}

export default Services;

const styles = {
  container: {
    padding: "70px 40px",
    background: "#111111",
    textAlign: "center",
  },

  badge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "3px",
    color: "#00FF9C",
    border: "1px solid #00FF9C",
    borderRadius: "999px",
    padding: "5px 16px",
    marginBottom: "16px",
  },

  heading: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "10px",
  },

  subtext: {
    color: "#666",
    fontSize: "15px",
    marginBottom: "48px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    maxWidth: "1000px",
    margin: "0 auto 40px",
  },

  card: {
    background: "#1a1a1a",
    padding: "32px 24px",
    borderRadius: "20px",
    border: "1px solid #222",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    textAlign: "left",
    position: "relative",
  },

  tag: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#00FF9C",
    background: "rgba(0,255,156,0.08)",
    border: "1px solid rgba(0,255,156,0.2)",
    borderRadius: "999px",
    padding: "4px 12px",
    marginBottom: "20px",
    textTransform: "uppercase",
  },

  iconCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    background: "rgba(0,255,156,0.06)",
    border: "1px solid rgba(0,255,156,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "10px",
  },

  cardDesc: {
    fontSize: "13px",
    color: "#777",
    lineHeight: "1.8",
    marginBottom: "20px",
  },

  divider: {
    height: "1px",
    background: "#222",
    marginBottom: "20px",
  },

  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#00FF9C",
  },

  btn: {
    padding: "8px 20px",
    borderRadius: "999px",
    border: "1px solid #fff",
    background: "transparent",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.25s ease",
    letterSpacing: "0.5px",
  },

  note: {
    fontSize: "13px",
    color: "#444",
    marginTop: "10px",
  },
};