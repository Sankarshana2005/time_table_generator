import { useState, useEffect, useRef } from "react";
import "../App.css";
import html2pdf from "html2pdf.js";

const Random = {
  shuffle: (array) => {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};

function TimetableGenerator() {
  const [branch, setBranch] = useState("CSE");
  const [sectionCount, setSectionCount] = useState(3);
  const [subjectInput, setSubjectInput] = useState("OS, CN, AI, ML_Lab, NSS");
  const [teachers, setTeachers] = useState({});
  const [dailySlotConfig, setDailySlotConfig] = useState([7, 7, 7, 7, 7, 4]); 
  const [timetable, setTimetable] = useState(null);
  const canvasRef = useRef(null);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const periodTimings = [
    "9:15-10:05", "10:05-10:55", "11:10-12:00", "12:00-12:50", 
    "1:50-2:40", "2:40-3:30", "3:30-4:20"
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      const subList = subjectInput.split(",").map(s => s.trim()).filter(s => s.length > 1);
      setTeachers(prev => {
        const updated = { ...prev };
        subList.forEach(s => { if (!(s in updated)) updated[s] = ""; });
        Object.keys(updated).forEach(k => { if (!subList.includes(k)) delete updated[k]; });
        return updated;
      });
    }, 600);
    return () => clearTimeout(handler);
  }, [subjectInput]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId, particles = [];
    const init = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 2, speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.4 - 0.2, opacity: Math.random() * 0.5
      }));
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    init(); animate();
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', init); };
  }, []);

  const generateGlobalSchedule = () => {
    const subList = Object.keys(teachers);
    if (subList.length < 2) return alert("Please enter at least 2 subjects!");
    const sectionsArr = Array.from({ length: sectionCount }, (_, i) => `Section ${String.fromCharCode(65 + i)}`);
    
    let globalTimetables = {};
    sectionsArr.forEach(sec => {
        globalTimetables[sec] = dailySlotConfig.map(count => new Array(count).fill(null));
    });

    for (let d = 0; d < 6; d++) {
      const currentDaySlots = dailySlotConfig[d];
      for (let s = 0; s < currentDaySlots; s++) {
        sectionsArr.forEach(sec => {
          if (globalTimetables[sec][d][s] !== null) return;

          const getWeeklyUsage = (sub) => {
            let count = 0;
            globalTimetables[sec].forEach(row => row.forEach(cell => { if(cell === sub) count++; }));
            return count;
          };

          const dayHasSpecial = globalTimetables[sec][d].some(c => c?.toLowerCase().includes("lab") || c?.toLowerCase().includes("nss"));

          // THE FIX: Filter and then sort by least used. 
          // If a slot is empty, we MUST pick something, even if it exceeds "ideal" hours.
          let options = subList.filter(sub => {
            const name = sub.toLowerCase();
            const is2H = name.includes("lab") || name.includes("nss");
            const tName = teachers[sub] || sub;

            // Strict constraints for Labs/NSS (Still once per week, once per day)
            if (is2H && (getWeeklyUsage(sub) >= 1 || dayHasSpecial)) return false;
            if (name.includes("nss") && s < 4) return false;
            
            // Teacher Conflict (Always strict)
            const isBusy = sectionsArr.some(other => {
                const val = globalTimetables[other][d][s];
                return val && val !== "SKIP" && (teachers[val] || val) === tName;
            });
            if (isBusy) return false;

            // Boundaries
            if (is2H && (s === 1 || s === 3 || s === currentDaySlots - 1)) return false;
            
            return true;
          });

          if (options.length > 0) {
            // Sort to ensure balanced distribution across subjects
            const sel = Random.shuffle(options).sort((a,b) => getWeeklyUsage(a) - getWeeklyUsage(b))[0];
            globalTimetables[sec][d][s] = sel;
            if ((sel.toLowerCase().includes("lab") || sel.toLowerCase().includes("nss")) && s + 1 < currentDaySlots) {
                globalTimetables[sec][d][s + 1] = "SKIP"; 
            }
          } else {
             // Emergency Fallback: If absolutely no teacher is free, pick the first subject to avoid "Revision"
             globalTimetables[sec][d][s] = subList[0]; 
          }
        });
      }
    }
    setTimetable(globalTimetables);
  };

const handleDownloadPDF = () => {
  const element = document.getElementById("timetable-results");

  element.classList.add("pdf-mode");

  const opt = {
    margin: 10,
    filename: `${branch}_Timetable.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "landscape"
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] }
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      element.classList.remove("pdf-mode");
    });
};
  const renderCell = (row, sIdx) => {
    if (sIdx >= row.length || row[sIdx] === "SKIP") return null;
    const is2H = row[sIdx + 1] === "SKIP";
    const sub = row[sIdx];
    let className = sub?.toLowerCase().includes("lab") ? "lab-cell" : sub?.toLowerCase().includes("nss") ? "nss-cell" : "editable-cell";

    return (
      <td key={sIdx} colSpan={is2H ? 2 : 1} className={className}>
        <div className="cell-sub">{sub}</div>
        <div className="cell-teacher">{teachers[sub] || "Staff"}</div>
      </td>
    );
  };

  return (
    <>
      <canvas id="particleCanvas" ref={canvasRef} />
      <div className="app-container">
        <h1 className="main-title">{branch} Timetable Generator</h1>
        
        <div className="card fade-in">
          <div className="input-section">
            <div className="num-inputs-grid">
               <div className="field-group"><label className="field-label">Branch</label><input type="text" value={branch} onChange={e => setBranch(e.target.value)} /></div>
               <div className="field-group"><label className="field-label">Sections</label><input type="number" value={sectionCount} onChange={e => setSectionCount(Number(e.target.value))} /></div>
            </div>
            <textarea className="subject-input" value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} />
            <div className="teacher-list">
                {Object.keys(teachers).map(sub => (
                  <div key={sub} className="teacher-item">
                    <span className="sub-badge">{sub}</span>
                    <input placeholder="Teacher Name" value={teachers[sub]} onChange={(e) => setTeachers({...teachers, [sub]: e.target.value})} />
                  </div>
                ))}
            </div>
          </div>

          <div className="config-section">
            <div className="slot-config-grid">
                {dayNames.map((day, idx) => (
                    <div key={day} className="day-config-item">
                        <span>{day}:</span>
                        <input type="number" value={dailySlotConfig[idx]} onChange={e => {
                            const newCfg = [...dailySlotConfig];
                            newCfg[idx] = Math.max(0, Math.min(7, Number(e.target.value)));
                            setDailySlotConfig(newCfg);
                        }} />
                    </div>
                ))}
            </div>
            <div className="action-stack">
              <button className="generate-btn" onClick={generateGlobalSchedule}>Generate All Sections</button>
              <div className="secondary-btns">
                {timetable && <button className="pdf-btn" onClick={handleDownloadPDF}>Download PDF</button>}
                <button className="reset-btn" onClick={() => { setTimetable(null); setSubjectInput(""); }}>Reset All</button>
              </div>
            </div>
          </div>
        </div>

        <div id="timetable-results">
          {timetable && Object.entries(timetable).map(([sec, mat]) => (
            <div key={sec} className="section-block fade-in">
              <h2 className="section-title">{branch} - {sec}</h2>
              <div className="table-container">
                <table className="timetable">
                  <thead>
                    <tr>
                      <th>DAY</th>
                      <th>P1<br/><small>{periodTimings[0]}</small></th>
                      <th>P2<br/><small>{periodTimings[1]}</small></th>
                      <th className="break-header">BREAK</th>
                      <th>P3<br/><small>{periodTimings[2]}</small></th>
                      <th>P4<br/><small>{periodTimings[3]}</small></th>
                      {Math.max(...dailySlotConfig) > 4 && <th className="lunch-header">LUNCH</th>}
                      <th>P5<br/><small>{periodTimings[4]}</small></th>
                      <th>P6<br/><small>{periodTimings[5]}</small></th>
                      <th>P7<br/><small>{periodTimings[6]}</small></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mat.map((row, di) => (
                      <tr key={di}>
                        <td className="day-label">{dayNames[di]}</td>
                        {renderCell(row, 0)}
                        {renderCell(row, 1)}
                        <td className="break-cell">15m</td>
                        {renderCell(row, 2)}
                        {renderCell(row, 3)}
                        {row.length > 4 && <td className="lunch-cell">LUNCH</td>}
                        {renderCell(row, 4)}
                        {renderCell(row, 5)}
                        {renderCell(row, 6)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TimetableGenerator;