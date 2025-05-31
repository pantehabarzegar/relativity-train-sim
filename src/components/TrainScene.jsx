import React, { useEffect, useState } from 'react';
import './TrainScene.css';

const originalLength = 400;

function TrainScene() {
  const [speed, setSpeed] = useState(0.7);
  const [tunnelLength, setTunnelLength] = useState(300);
  const [contractedLength, setContractedLength] = useState(0);
  const [position, setPosition] = useState(-500);
  const [gameStarted, setGameStarted] = useState(false);
  const [doorsClose, setDoorsClose] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [success, setSuccess] = useState(false);

  const tunnelX = window.innerWidth * 0.75;
  const trainDuration = 15000;
  const totalDistance = window.innerWidth + 600;
  const pixelsPerMs = totalDistance / trainDuration;

  useEffect(() => {
    setContractedLength(originalLength * Math.sqrt(1 - speed ** 2));
  }, [speed]);

  const fits = contractedLength <= tunnelLength;

  const startGame = () => {
    setGameStarted(true);
    setPosition(-500);
    setDoorsClose(false);
    setShowResult(false);
    setSuccess(false);

    const startTime = performance.now();

    const loop = (now) => {
      const elapsed = now - startTime;
      const newPos = pixelsPerMs * elapsed - 500;
      setPosition(newPos);

      if (!doorsClose) {
        if (fits) {
          // ✅ فقط وقتی کل قطار از تونل خارج شد، کرکره‌ها بسته شوند
          if (newPos >= tunnelX + tunnelLength) {
            setDoorsClose(true);
            handleResult(true);
          }
        } else {
          // ❌ در حالت برخورد: وسط تونل که رسید بسته شه
          if (newPos + 5 >= tunnelX + tunnelLength / 2) {
            setDoorsClose(true);
            handleResult(false);
          }
        }
      }

      if (elapsed < trainDuration) {
        requestAnimationFrame(loop);
      }
    };

    requestAnimationFrame(loop);
  };

  const handleResult = (isSuccess) => {
    setTimeout(() => {
      setShowResult(true);
      setSuccess(isSuccess);
      if (isSuccess) spawnFlowers();
      setTimeout(() => {
        setGameStarted(false);
        window.location.reload();
      }, 4000);
    }, 1000);
  };

  const spawnFlowers = () => {
    for (let i = 0; i < 50; i++) {
      const flower = document.createElement('div');
      flower.className = 'flower';
      flower.style.left = Math.random() * 100 + 'vw';
      flower.style.animationDuration = Math.random() * 2 + 3 + 's';
      document.body.appendChild(flower);
      setTimeout(() => flower.remove(), 6000);
    }
  };

  return (
    <div className="scene">
      {!gameStarted ? (
        <div className="intro">
          <h1>🚆 Relativity Tunnel Simulation</h1>
          <p>
            Welcome to a mind-bending experiment inspired by <strong>Einstein’s Special Relativity</strong>.
          </p>
          <ul style={{ textAlign: 'left', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
            <li><strong>Length Contraction:</strong> Fast-moving objects appear shorter in the direction of motion.</li>
            <li><strong>Time Dilation:</strong> Moving clocks tick slower.</li>
            <li><strong>Relativity of Simultaneity:</strong> Events that look simultaneous to you may not be so from the train's point of view.</li>
          </ul>
          <p>🎯 <strong>Your mission:</strong> Adjust the train’s speed so it contracts just enough to fully fit inside the tunnel.</p>
          <div className="controls">
            <label>
              Train Speed: {Math.round(speed * 100)}% of light speed
              <input
                type="range"
                min="0.01"
                max="0.99"
                step="0.01"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
              />
            </label>
            <label>
              Tunnel Length: {tunnelLength}px
              <input
                type="range"
                min="100"
                max="800"
                step="10"
                value={tunnelLength}
                onChange={(e) => setTunnelLength(parseInt(e.target.value))}
              />
            </label>
          </div>
          <button className="start-btn" onClick={startGame}>Start Simulation</button>
        </div>
      ) : (
        <>
          <div className="track">
            <div
              className={`tunnel ${doorsClose ? 'close' : ''}`}
              style={{ left: `${tunnelX}px`, width: `${tunnelLength}px` }}
            >
              <div className="door top" />
              <div className="door bottom" />
            </div>
            <div
              className={`train ${fits ? 'fit' : 'no-fit'} neon`}
              style={{
                width: `${contractedLength}px`,
                transform: `translateX(${position}px)`,
              }}
            >
              🚆
            </div>
          </div>

          {showResult && (
            <div className={`alert ${success ? 'success' : 'fail'}`}>
              {success
                ? '🎉 SUCCESS: You passed the tunnel without collision!'
                : '💥 COLLISION! The train didn’t fit. Try again...'}
            </div>
          )}
        </>
      )}

      <footer className="footer">
        Created by <strong>Panteha Barzegar</strong> · Designed with physics ❤️ by <strong>PiPuzzle</strong>
      </footer>
    </div>
  );
}

export default TrainScene;
