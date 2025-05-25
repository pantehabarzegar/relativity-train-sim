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

      // When nose reaches center of tunnel → close the doors
      if (!doorsClose && newPos + 5 >= tunnelX + tunnelLength / 2) {
        setDoorsClose(true);

        setTimeout(() => {
          setShowResult(true);
          if (fits) {
            setSuccess(true);
            spawnFlowers();
          } else {
            setSuccess(false);
          }

          setTimeout(() => setGameStarted(false), 4000); // reset to intro
        }, 1000);
      }

      if (elapsed < trainDuration) {
        requestAnimationFrame(loop);
      }
    };

    requestAnimationFrame(loop);
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
            In Einstein’s theory of Special Relativity, space and time are relative to the observer’s frame.
            <br />
            At near light-speed, objects <strong>contract</strong> in the direction of motion.
            Simultaneously, moving clocks <strong>tick slower</strong> — this is called Time Dilation.
          </p>
          <p className="physics-text">
            If a collision doesn’t occur in one frame, it won’t occur in any — that’s the beauty of relativity.
            Your challenge: adjust the speed so the contracted train fits completely inside the tunnel.
          </p>
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
          <button className="start-btn" onClick={startGame}>
            Start Simulation
          </button>
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

