module.exports = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    --color: #444;
    --muted: #ccc;
    --bg: white;
  }
  
  html,
  body {
    height: 100%;
    min-height: 100%;
  }
  
  body {
    color: var(--color);
    background: var(--bg);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }
  
  .page {
    margin: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .calendar {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(1, 1fr);
  }
  
  .calendar-month {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .calendar-month-name {
    color: #999;
    margin-bottom: 0.5rem;
    font-weight: normal;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .calendar-weeks {
    display: flex;
    flex-direction: column;
  }
  
  .calendar-week {
    display: flex;
  }
  
  .calendar-day {
    position: relative;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .calendar-day-current:before {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: rgba(255, 0, 0, 0.2);
  }
  .calendar-day-muted {
    color: var(--muted);
  }
  
  .remaining {
    margin-bottom: 2rem;
    text-align: center;
    line-height: 1.5;
  }
  
  .duration-part {
    white-space: nowrap;
  }
  
  .duration-part-count {
    font-weight: 500;
  }
  
  .heart {
    width: 1em;
    height: 1em;
    color: #ff0000;
    animation: heart-pulse 1s ease infinite;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .heart {
      animation: none;
    }
  }
  
  @keyframes heart-pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }
  
  /* dark theme */
  @media (prefers-color-scheme: dark) {
    html {
      --color: #ccc;
      --muted: #666;
      --bg: radial-gradient(#2d4053, #26323d);
    }
  }
  
  /* responsive */
  @media (min-width: 600px) {
    .page {
      margin: 4rem auto;
      width: calc(600px - 4rem);
    }
  
    .calendar {
      grid-template-columns: repeat(2, 1fr);
      gap: 4rem;
    }
  
    .remaining {
      margin-bottom: 4rem;
    }
  }
  `;
