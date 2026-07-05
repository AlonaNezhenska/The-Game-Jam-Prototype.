// src/App.js
import React, { useState, useEffect } from "react";
import GameMap from "./Components/Objects/GameBackground.js";
import Sprite from "./Components/Objects/jennySprite.js";
import Cup from "./Components/Objects/CoffeeMachine.jsx";
import Printer from "./Components/Objects/Printer.jsx";
import BossSprite from "./Components/Objects/BossSprite.js";
import BossQuiz from "./Components/Objects/BossQuiz.js";
import StatsComponent from "./Components/stats/statsMain.jsx";
import Colleague from "./Components/Objects/colleagues";
import StickyNoteImg from "./sprites/objects/Interactables/stickynote.png";
import DeskComputer from "./Components/Objects/deskComputer";

// Colleague sprites
import ColleagueAlona from "./sprites/player/Alona/Alona.png";
import ColleagueCatherine from "./sprites/player/Catherine/Catherine.png";
import ColleagueEmma from "./sprites/player/Emma/Emma.png";
import ColleaguePrecious from "./sprites/player/Precious/Precious.png";
import ColleagueBlonde from "./sprites/player/Staff/Blondestaff.png";
import ColleagueDirtyBlondeGlassesStaff from "./sprites/player/Staff/DirtyBlondeGlassesStaff.png";
import ColleaguePinkStaff from "./sprites/player/Staff/PinkStaff.png";
import ColleagueBrownhairStaff from "./sprites/player/Staff/Brownhairstaff.png";
import ColleagueTamie from "./sprites/player/Tamie/Tamie.png";

function App() {
  // Jenny position
  const [jennyX, setJennyX] = useState(100);
  const [jennyY, setJennyY] = useState(100);
  const [playerPos, setPlayerPos] = useState({ x: 100, y: 100 });

  // Laptop mini-game state
  const [laptopMenuActive, setLaptopMenuActive] = useState(false);
  const [emailGameActive, setEmailGameActive] = useState(false);
  const [wifiGameActive, setWifiGameActive] = useState(false);
  const [pensionGameActive, setPensionGameActive] = useState(false);

  // Email game
  const [emails, setEmails] = useState([]);
  const [score, setScore] = useState(0);

  // Pension calculator
  const [age, setAge] = useState(30);
  const [contribution, setContribution] = useState(200);
  const [growth, setGrowth] = useState(5);
  const [years, setYears] = useState(35);
  const [pensionResult, setPensionResult] = useState(null);

  // Coffee & printer
  const [coffeeLevel, setCoffeeLevel] = useState(0);
  const [cupFilling, setCupFilling] = useState(false);
  const [printerActive, setPrinterActive] = useState(false);

  // Boss quiz (locked until tasks are done)
const [quizAvailable, setQuizAvailable] = useState(false);
const [showQuiz, setShowQuiz] = useState(false);


  // Colleague interaction
  const [speakingColleague, setSpeakingColleague] = useState(null);
  const [talkedColleagues, setTalkedColleagues] = useState([]);

  // Task sheet
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, text: "☕ Get a coffee", done: false },
    { id: 2, text: "🖨️ Use the printer", done: false },
    { id: 3, text: "📧 Respond to emails", done: false },
    { id: 4, text: "📡 Connect to Wi-Fi", done: false },
    { id: 5, text: "💰 Try the pension calculator", done: false },
    { id: 6, text: "💬 Talk to colleagues 0/9", done: false },
  ]);

  // Object positions
  const cupX = 630, cupY = 50;
  const printerX = 300, printerY = 270;
  const bossX = 1000, bossY = 200;
  const computerX = 390, computerY = 500;

  // Colleagues
  const colleagues = [
    { id: 1, name: "Alona", sprite: ColleagueAlona, x: 228, y: 155, fact: "On average, women are on track to receive £7,000 less per year in retirement income than men.Core value: Keep client data confidential.", },
    { id: 2, name: "Catherine", sprite: ColleagueCatherine, x: 687, y: 455, fact: "Approximately 1.4 million women in the UK miss out on auto-enrolment into a pension because they earn under £10,000 a year." },
     { id: 3, name: "Precious", sprite: ColleaguePrecious, x: 230, y: 450, fact: "Taking a career break of just 2.5 years can reduce a mother's pension pot by £8,000." },
    { id: 4, name: "Jemma", sprite: ColleagueBlonde, x: 700, y: 300, fact: "A striking 60% of divorced women do not discuss pensions during their divorce proceedings." },
    { id: 5, name: "Sarah", sprite: ColleagueDirtyBlondeGlassesStaff, x: 530, y: 100, fact: "In the UK, women are significantly more likely to work part-time than men, impacting their ability to save." },
    { id: 6, name: "Rose", sprite: ColleaguePinkStaff, x: 390, y: 90, fact: "Combining multiple old pensions into a single pot is a common and effective way to simplify tracking and management." },
    { id: 7, name: "Tamie", sprite: ColleagueTamie, x: 600, y: 500, fact: "For every £80 you put into your pension, the government typically tops it up by £20 in tax relief." },
    { id: 8, name: "Lucy", sprite: ColleagueBrownhairStaff, x: 950, y: 500, fact: "The minimum age you can access your private pension is rising to 57 in 2028." },
    { id: 9, name: "Emma", sprite: ColleagueEmma, x: 650, y: 210, fact: "The primary reason women often have smaller pensions is that time off for childcare and career breaks reduces their contributions." }
  ];

  // Update player position
  const updatePlayerPos = (x, y) => {
    setPlayerPos({ x, y });
    setJennyX(x);
    setJennyY(y);
  };

  // Coffee
  const handleFillCoffee = () => {
    if (coffeeLevel < 5) {
      setCoffeeLevel(prev => prev + 1);
      setCupFilling(true);
      setTimeout(() => setCupFilling(false), 2000);
      markTaskDone(1);
    }
  };

  // Printer
  const handleUsePrinter = () => {
    setPrinterActive(true);
    setTimeout(() => setPrinterActive(false), 2000);
    markTaskDone(2);
  };

  // Boss
  const handleBossInteract = () => {
    if (quizAvailable) setShowQuiz(true);
  };

  const handleQuizComplete = (passed, score, total) => {
    setShowQuiz(false);
    setQuizAvailable(false);
    alert(`Quiz finished! Score: ${score}/${total}. ${passed ? "✅ You passed!" : "❌ Try again tomorrow!"}`);
  };

  // Tasks
const markTaskDone = (taskId) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, done: true } : task));
  };

  // Pension Calculator Function
  const calculatePension = () => {
    let futureValue = 0;
    for (let i = 0; i < years; i++) {
      futureValue = (futureValue + contribution * 12) * (1 + growth / 100);
    }
    setPensionResult(futureValue.toFixed(2));
    markTaskDone(5);
  };

  const startBossQuiz = () => {
  if (quizAvailable) setShowQuiz(true);
};

  // Mini-game functions
  const startEmailGame = () => {
    setScore(0);
    setEmails([
      { id: 1, text: "Email: Urgent client issue" },
      { id: 2, text: "Email: Team meeting invite"},
      { id: 3, text: "Email: Newsletter subscription"},
    ]);
    setEmailGameActive(true);
    setLaptopMenuActive(false);
    markTaskDone(3); // Mark email task as done when started
  };

  const startWifiGame = () => {
    setWifiGameActive(true);
    setLaptopMenuActive(false);
    markTaskDone(4); // Mark Wi-Fi task as done when started
  };

  const startPensionGame = () => {
    setPensionGameActive(true);
    setLaptopMenuActive(false);
  };

  const handleClickEmail = (email) => {
    if (emails[0].id === email.id) {
      setScore(score + 1);
      setEmails(emails.slice(1));
      if (emails.length === 1) {
        setTimeout(() => {
          alert("All emails sorted! ✅");
          setEmailGameActive(false);
        }, 500);
      }
    } else {
      alert("Oops! Wrong email. Try again.");
    }
  };

  const handleWifiConnect = (network) => {
    if (network === "Office_WiFi") {
      alert("Connected to Wi-Fi! ✅");
      setWifiGameActive(false);
    } else {
      alert("Wrong network! ❌ Try 'Office_WiFi'");
    }
  };

  // Spacebar interactions for all objects
  const handleSpacebar = (event) => {
    if (event.code !== "Space") return;

    // Laptop/Computer interaction
    const distToComputer = Math.hypot(jennyX - computerX, jennyY - computerY);
    if (distToComputer < 50) {
      setLaptopMenuActive(true);
      return;
    }

    // Boss interaction
    const bossDist = Math.hypot(jennyX - bossX, jennyY - bossY);
    if (bossDist < 80 && quizAvailable) {
      handleBossInteract();
      return;
    }

    // Coffee machine interaction
    const coffeeDist = Math.hypot(jennyX - cupX, jennyY - cupY);
    if (coffeeDist < 50) {
      handleFillCoffee();
      return;
    }

    // Printer interaction
    const printerDist = Math.hypot(jennyX - printerX, jennyY - printerY);
    if (printerDist < 50) {
      handleUsePrinter();
      return;
    }

    // Colleague interaction
    let closest = null;
    let minDist = Infinity;
    colleagues.forEach(col => {
      const dist = Math.hypot(jennyX - col.x, jennyY - col.y);
      if (dist < minDist) {
        minDist = dist;
        closest = col;
      }
    });

    if (closest && minDist < 120) {
      setSpeakingColleague(closest.id);
      setTimeout(() => setSpeakingColleague(null), 3000);

      setTalkedColleagues(prev => {
        if (!prev.includes(closest.id)) {
          const newList = [...prev, closest.id];
          setTasks(prevTasks => prevTasks.map(task =>
            task.id === 6
              ? { ...task, text: `💬 Talk to colleagues ${newList.length}/9` }
              : task
          ));
          if (newList.length === colleagues.length) markTaskDone(6);
          return newList;
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleSpacebar);
    return () => window.removeEventListener("keydown", handleSpacebar);
  }, [jennyX, jennyY, quizAvailable, talkedColleagues]);

  useEffect(() => {
  const allDone = tasks.every(task => task.done);
  setQuizAvailable(allDone);
}, [tasks]);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🏦 Lloyds Bank Office Game</h1>
      <GameMap />
      <StatsComponent />

      {/* Coffee & Printer */}
      <Cup x={cupX} y={cupY} isFilling={cupFilling} />
      <Printer x={printerX} y={printerY} isPrinting={printerActive} />

      {/* Colleagues */}
      {colleagues.map(col => (
        <Colleague key={col.id} x={col.x} y={col.y} sprite={col.sprite} speech={speakingColleague === col.id ? col.fact : null} />
      ))}
      

      {/* Jenny Sprite */}
      <Sprite
  cupX={cupX}
  cupY={cupY}
  printerX={printerX}
  printerY={printerY}

  onFillCoffee={handleFillCoffee}
  onUsePrinter={handleUsePrinter}
  onUseComputer={() => alert("Laptop menu placeholder")}
  bossX={bossX}
  bossY={bossY}
  onStartBossQuiz={startBossQuiz}
  setPlayerPos={({ x, y }) => {
    setJennyX(x);
    setJennyY(y);
  }}
  colleagues={colleagues}
/>

      {/* Boss */}
      <BossSprite bossX={bossX} bossY={bossY} playerX={jennyX} playerY={jennyY} onBossInteract={handleBossInteract} isQuizAvailable={quizAvailable} />

      {/* Desk computer */}
      <DeskComputer x={computerX} y={computerY} />

      {/* Boss Quiz */}
      {showQuiz && <BossQuiz onQuizComplete={handleQuizComplete} />}

      {/* Laptop Menu Popup */}
      {/* Laptop Menu Popup */}
{laptopMenuActive && (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffebf3',
    padding: '25px',
    border: '4px solid #ff69b4',
    borderRadius: '0px',
    zIndex: 1000,
    minWidth: '400px',
    boxShadow: '8px 8px 0px #d1478c',
    borderImage: 'repeating-linear-gradient(45deg, #ff69b4, #ff69b4 4px, #ffebf3 4px, #ffebf3 8px) 4',
    fontFamily: "'Press Start 2P', monospace",
    imageRendering: 'pixelated'
  }}>
    <h2 style={{ 
      color: '#ff1493', 
      textAlign: 'center',
      fontSize: '18px',
      textShadow: '2px 2px 0px #ff69b4',
      marginBottom: '20px'
    }}>💻 LAPTOP MENU</h2>
    <p style={{ 
      textAlign: 'center', 
      color: '#8b008b',
      fontSize: '10px',
      marginBottom: '25px'
    }}>Select a task to complete:</p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
      <button 
        onClick={startEmailGame}
        style={{
          padding: '15px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: '3px solid #cc5555',
          borderRadius: '0px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          fontFamily: "'Press Start 2P', monospace",
          textShadow: '2px 2px 0px #cc5555',
          boxShadow: '4px 4px 0px #cc5555',
          transition: 'all 0.1s',
          imageRendering: 'pixelated'
        }}
        onMouseDown={e => {
          e.target.style.transform = 'translate(4px, 4px)';
          e.target.style.boxShadow = '2px 2px 0px #cc5555';
        }}
        onMouseUp={e => {
          e.target.style.transform = 'translate(0px, 0px)';
          e.target.style.boxShadow = '4px 4px 0px #cc5555';
        }}
      >
        📧 RESPOND TO EMAILS
      </button>
      
      <button 
        onClick={startWifiGame}
        style={{
          padding: '15px',
          backgroundColor: '#4ecdc4',
          color: 'white',
          border: '3px solid #2da8a0',
          borderRadius: '0px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          fontFamily: "'Press Start 2P', monospace",
          textShadow: '2px 2px 0px #2da8a0',
          boxShadow: '4px 4px 0px #2da8a0',
          transition: 'all 0.1s'
        }}
        onMouseDown={e => {
          e.target.style.transform = 'translate(4px, 4px)';
          e.target.style.boxShadow = '2px 2px 0px #2da8a0';
        }}
        onMouseUp={e => {
          e.target.style.transform = 'translate(0px, 0px)';
          e.target.style.boxShadow = '4px 4px 0px #2da8a0';
        }}
      >
        📡 CONNECT TO WI-FI
      </button>
      
      <button 
        onClick={startPensionGame}
        style={{
          padding: '15px',
          backgroundColor: '#45b7d1',
          color: 'white',
          border: '3px solid #2a8fa5',
          borderRadius: '0px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          fontFamily: "'Press Start 2P', monospace",
          textShadow: '2px 2px 0px #2a8fa5',
          boxShadow: '4px 4px 0px #2a8fa5',
          transition: 'all 0.1s'
        }}
        onMouseDown={e => {
          e.target.style.transform = 'translate(4px, 4px)';
          e.target.style.boxShadow = '2px 2px 0px #2a8fa5';
        }}
        onMouseUp={e => {
          e.target.style.transform = 'translate(0px, 0px)';
          e.target.style.boxShadow = '4px 4px 0px #2a8fa5';
        }}
      >
        💰 PENSION CALCULATOR
      </button>
    </div>
    
    <button 
      onClick={() => setLaptopMenuActive(false)}
      style={{
        padding: '12px 20px',
        backgroundColor: '#999',
        color: 'white',
        border: '3px solid #777',
        borderRadius: '0px',
        cursor: 'pointer',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        textShadow: '2px 2px 0px #777',
        boxShadow: '4px 4px 0px #777',
        transition: 'all 0.1s',
        display: 'block',
        margin: '0 auto'
      }}
      onMouseDown={e => {
        e.target.style.transform = 'translate(4px, 4px)';
        e.target.style.boxShadow = '2px 2px 0px #777';
      }}
      onMouseUp={e => {
        e.target.style.transform = 'translate(0px, 0px)';
        e.target.style.boxShadow = '4px 4px 0px #777';
      }}
    >
      CLOSE MENU
    </button>
  </div>
)}

{/* Email Mini-Game Popup */}
{emailGameActive && (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff9c4',
    padding: '25px',
    border: '4px solid #ffd700',
    borderRadius: '0px',
    zIndex: 1000,
    minWidth: '500px',
    boxShadow: '8px 8px 0px #ccaa00',
    fontFamily: "'Press Start 2P', monospace",
    imageRendering: 'pixelated'
  }}>
    <h2 style={{ 
      color: '#b8860b', 
      textAlign: 'center',
      fontSize: '16px',
      textShadow: '2px 2px 0px #ffd700',
      marginBottom: '15px'
    }}>📧 EMAIL PRIORITY CHALLENGE!</h2>
    <p style={{ textAlign: 'center', color: '#8b7500', fontSize: '9px', marginBottom: '5px' }}>
      Click emails in order of priority (1 = highest priority):
    </p>
    <p style={{ textAlign: 'center', color: '#8b7500', fontSize: '10px', marginBottom: '20px' }}>
      <strong>SCORE: {score}</strong>
    </p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '20px 0' }}>
      {emails.map((email) => (
        <button 
          key={email.id} 
          onClick={() => handleClickEmail(email)}
          style={{
            padding: '12px',
            backgroundColor: '#ffeaa7',
            border: '3px solid #fdcb6e',
            borderRadius: '0px',
            cursor: 'pointer',
            fontSize: '10px',
            textAlign: 'left',
            fontFamily: "'Press Start 2P', monospace",
            boxShadow: '4px 4px 0px #d4ac0d',
            transition: 'all 0.1s',
            color: '#8b7500'
          }}
          onMouseDown={e => {
            e.target.style.transform = 'translate(4px, 4px)';
            e.target.style.boxShadow = '2px 2px 0px #d4ac0d';
          }}
          onMouseUp={e => {
            e.target.style.transform = 'translate(0px, 0px)';
            e.target.style.boxShadow = '4px 4px 0px #d4ac0d';
          }}
        >
          <strong>{email.text}</strong> (Priority: {email.priority})
        </button>
      ))}
    </div>

    <button 
      onClick={() => setEmailGameActive(false)}
      style={{
        padding: '10px 20px',
        backgroundColor: '#999',
        color: 'white',
        border: '3px solid #777',
        borderRadius: '0px',
        cursor: 'pointer',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '9px',
        textShadow: '2px 2px 0px #777',
        boxShadow: '4px 4px 0px #777',
        transition: 'all 0.1s',
        display: 'block',
        margin: '0 auto'
      }}
      onMouseDown={e => {
        e.target.style.transform = 'translate(4px, 4px)';
        e.target.style.boxShadow = '2px 2px 0px #777';
      }}
      onMouseUp={e => {
        e.target.style.transform = 'translate(0px, 0px)';
        e.target.style.boxShadow = '4px 4px 0px #777';
      }}
    >
      CLOSE EMAIL GAME
    </button>
  </div>
)}
      
{/* Wi-Fi Mini-Game Popup */}
{wifiGameActive && (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#e0f7fa',
    padding: '25px',
    border: '4px solid #4ecdc4',
    borderRadius: '0px',
    zIndex: 1000,
    minWidth: '400px',
    boxShadow: '8px 8px 0px #2da8a0',
    fontFamily: "'Press Start 2P', monospace",
    imageRendering: 'pixelated'
  }}>
    <h2 style={{ 
      color: '#008b8b', 
      textAlign: 'center',
      fontSize: '16px',
      textShadow: '2px 2px 0px #4ecdc4',
      marginBottom: '15px'
    }}>📡 CONNECT TO WI-FI</h2>
    <p style={{ textAlign: 'center', color: '#006666', fontSize: '9px', marginBottom: '20px' }}>
      Select the correct office network:
    </p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
      {["Guest_WiFi", "Office_WiFi", "Cafe_Free"].map((network) => (
        <button 
          key={network} 
          onClick={() => handleWifiConnect(network)}
          style={{
            padding: '15px',
            
            border: '3px solid #4ecdc4',
            borderRadius: '0px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: network === "Office_WiFi" ? 'bold' : 'normal',
            fontFamily: "'Press Start 2P', monospace",
            color: network === "Office_WiFi" ? '#006666' : '#666',
            boxShadow: '4px 4px 0px #2da8a0',
            transition: 'all 0.1s'
          }}
          onMouseDown={e => {
            e.target.style.transform = 'translate(4px, 4px)';
            e.target.style.boxShadow = '2px 2px 0px #2da8a0';
          }}
          onMouseUp={e => {
            e.target.style.transform = 'translate(0px, 0px)';
            e.target.style.boxShadow = '4px 4px 0px #2da8a0';
          }}
        >
          {network}
        </button>
      ))}
    </div>

    <button 
      onClick={() => setWifiGameActive(false)}
      style={{
        padding: '10px 20px',
        backgroundColor: '#999',
        color: 'white',
        border: '3px solid #777',
        borderRadius: '0px',
        cursor: 'pointer',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '9px',
        textShadow: '2px 2px 0px #777',
        boxShadow: '4px 4px 0px #777',
        transition: 'all 0.1s',
        display: 'block',
        margin: '0 auto'
      }}
      onMouseDown={e => {
        e.target.style.transform = 'translate(4px, 4px)';
        e.target.style.boxShadow = '2px 2px 0px #777';
      }}
      onMouseUp={e => {
        e.target.style.transform = 'translate(0px, 0px)';
        e.target.style.boxShadow = '4px 4px 0px #777';
      }}
    >
      CLOSE WI-FI GAME
    </button>
  </div>
)}{/* Pension Calculator Popup */}
{pensionGameActive && (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#e3f2fd',
    padding: '25px',
    border: '4px solid #45b7d1',
    borderRadius: '0px',
    zIndex: 1000,
    minWidth: '450px',
    boxShadow: '8px 8px 0px #2a8fa5',
    fontFamily: "'Press Start 2P', monospace",
    imageRendering: 'pixelated'
  }}>
    <h2 style={{ 
      color: '#1565c0', 
      textAlign: 'center',
      fontSize: '16px',
      textShadow: '2px 2px 0px #45b7d1',
      marginBottom: '15px'
    }}>💰 PENSION CALCULATOR</h2>
    <p style={{ textAlign: 'center', color: '#0d47a1', fontSize: '9px', marginBottom: '20px' }}>
      Estimate your future pension savings:
    </p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
      {[
        { label: "CURRENT AGE:", value: age, min: 18, max: 65, onChange: setAge },
        { label: "MONTHLY CONTRIBUTION (£):", value: contribution, min: 50, max: 2000, onChange: setContribution },
        { label: "EXPECTED GROWTH RATE (%):", value: growth, min: 1, max: 15, step: 0.5, onChange: setGrowth },
        { label: "YEARS UNTIL RETIREMENT:", value: years, min: 1, max: 50, onChange: setYears }
      ].map((field, index) => (
        <div key={index}>
          <label style={{ color: '#0d47a1', fontSize: '8px', display: 'block', marginBottom: '5px' }}>
            <strong>{field.label}</strong>
          </label>
          <input 
            type="number" 
            value={field.value}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            onChange={(e) => field.onChange(Number(e.target.value))}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '3px solid #45b7d1',
              borderRadius: '0px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              backgroundColor: '#ffffff',
              imageRendering: 'pixelated'
            }}
          />
        </div>
      ))}
    </div>

    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
      <button 
        onClick={calculatePension}
        style={{
          padding: '12px 20px',
          backgroundColor: '#45b7d1',
          color: 'white',
          border: '3px solid #2a8fa5',
          borderRadius: '0px',
          cursor: 'pointer',
          fontSize: '10px',
          fontWeight: 'bold',
          fontFamily: "'Press Start 2P', monospace",
          textShadow: '2px 2px 0px #2a8fa5',
          boxShadow: '4px 4px 0px #2a8fa5',
          transition: 'all 0.1s'
        }}
        onMouseDown={e => {
          e.target.style.transform = 'translate(4px, 4px)';
          e.target.style.boxShadow = '2px 2px 0px #2a8fa5';
        }}
        onMouseUp={e => {
          e.target.style.transform = 'translate(0px, 0px)';
          e.target.style.boxShadow = '4px 4px 0px #2a8fa5';
        }}
      >
        CALCULATE
      </button>
    </div>

    {pensionResult && (
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#bbdefb',
        border: '3px solid #1565c0',
        borderRadius: '0px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#0d47a1', fontSize: '12px', marginBottom: '10px' }}>💰 ESTIMATED PENSION POT:</h3>
        <p style={{ fontSize: '18px', color: '#1565c0', fontWeight: 'bold', textShadow: '2px 2px 0px #90caf9' }}>
          £{parseFloat(pensionResult).toLocaleString()}
        </p>
        <p style={{ fontSize: '8px', color: '#0d47a1', marginTop: '8px' }}>
          Based on {years} years of contributions with {growth}% annual growth
        </p>
      </div>
    )}

    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <button 
        onClick={() => setPensionGameActive(false)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#999',
          color: 'white',
          border: '3px solid #777',
          borderRadius: '0px',
          cursor: 'pointer',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '9px',
          textShadow: '2px 2px 0px #777',
          boxShadow: '4px 4px 0px #777',
          transition: 'all 0.1s'
        }}
        onMouseDown={e => {
          e.target.style.transform = 'translate(4px, 4px)';
          e.target.style.boxShadow = '2px 2px 0px #777';
        }}
        onMouseUp={e => {
          e.target.style.transform = 'translate(0px, 0px)';
          e.target.style.boxShadow = '4px 4px 0px #777';
        }}
      >
        CLOSE CALCULATOR
      </button>
    </div>
  </div>
)}
        {/* Task Sheet */}
      <div
        style={{ position: "absolute", bottom: "20px", left: "20px", cursor: "pointer", zIndex: 1100 }}
        onClick={() => setTaskSheetOpen(true)}
      >
        <img src={StickyNoteImg} alt="Task Sheet" style={{ width: "60px", height: "60px" }} />
      </div>
      {taskSheetOpen && (
        <div style={{
          position: "absolute", left: "50px", bottom: "100px",
          backgroundColor: "#222", border: "4px solid #FF69B4", padding: "20px",
          zIndex: 1200, width: "300px", fontFamily: "'Press Start 2P', monospace",
          color: "#fff", textAlign: "left", boxShadow: "0 0 0 4px #444, 0 0 0 8px #FF69B4"
        }}>
          <h3 style={{ color: "#FF69B4", marginBottom: "10px" }}>📋 My Tasks</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map(task => (
              <li key={task.id} style={{
                margin: "6px 0", color: task.done ? "#0f0" : "#fff",
                textDecoration: task.done ? "line-through" : "none"
              }}>{task.text}</li>
            ))}
          </ul>
          <button onClick={() => setTaskSheetOpen(false)} style={{
            marginTop: "15px", padding: "8px 12px", fontFamily: "'Press Start 2P', monospace",
            backgroundColor: "#FF69B4", color: "#222", border: "2px solid #fff",
            cursor: "pointer", textShadow: "1px 1px #000", display: "block", width: "100%"
          }}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;