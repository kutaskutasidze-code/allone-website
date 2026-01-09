'use client';

import { useState, useEffect, useRef } from 'react';
import { workflowPathData } from './constants';

export function WorkflowDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [dots, setDots] = useState<{ id: string; x: number; y: number }[]>([]);

  const animateDot = (pathId: string, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const svg = svgRef.current;
      if (!svg) { resolve(); return; }
      const pathEl = svg.querySelector(`[data-path="${pathId}"]`) as SVGPathElement;
      if (!pathEl) { resolve(); return; }

      const totalLength = pathEl.getTotalLength();
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) * (1 - progress);
        const point = pathEl.getPointAtLength(eased * totalLength);

        setDots(prev => {
          const existing = prev.find(d => d.id === pathId);
          if (existing) {
            return prev.map(d => d.id === pathId ? { ...d, x: point.x, y: point.y } : d);
          }
          return [...prev, { id: pathId, x: point.x, y: point.y }];
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDots(prev => prev.filter(d => d.id !== pathId));
          resolve();
        }
      };
      requestAnimationFrame(animate);
    });
  };

  const animateDotsParallel = (pathIds: string[], duration: number): Promise<void> => {
    return Promise.all(pathIds.map(id => animateDot(id, duration))).then(() => {});
  };

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runAnimation = async () => {
      while (!cancelled) {
        setActiveNode('trigger');
        setActiveNodes([]);
        await wait(700);

        setActiveNode(null);
        await animateDot('trigger-main', 800);
        if (cancelled) return;
        setActiveNode('main');
        await wait(500);

        setActiveNode(null);
        await animateDotsParallel(['main-tool1', 'main-tool2'], 900);
        if (cancelled) return;
        setActiveNodes(['tool1', 'tool2']);
        await wait(600);
        setActiveNodes([]);

        await animateDot('main-decision', 700);
        if (cancelled) return;
        setActiveNode('decision');
        await wait(500);

        setActiveNode(null);
        await animateDotsParallel(['decision-output1', 'decision-output2'], 900);
        if (cancelled) return;
        setActiveNodes(['output1', 'output2']);
        await wait(600);
        setActiveNodes([]);

        await wait(2000);
      }
    };

    runAnimation();
    return () => { cancelled = true; };
  }, []);

  const isActive = (id: string) => activeNode === id || activeNodes.includes(id);

  return (
    <div className="relative w-full h-full min-h-[220px]">
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        <path data-path="trigger-main" d={workflowPathData['trigger-main']} stroke="#3f3f46" strokeWidth="1.5" fill="none" />
        <path data-path="main-decision" d={workflowPathData['main-decision']} stroke="#3f3f46" strokeWidth="1.5" fill="none" />
        <path data-path="decision-output1" d={workflowPathData['decision-output1']} stroke="#3f3f46" strokeWidth="1.5" fill="none" />
        <path data-path="decision-output2" d={workflowPathData['decision-output2']} stroke="#3f3f46" strokeWidth="1.5" fill="none" />
        <path data-path="main-tool1" d={workflowPathData['main-tool1']} stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
        <path data-path="main-tool2" d={workflowPathData['main-tool2']} stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />

        {/* Trigger Node */}
        <g>
          <circle
            cx="40" cy="80" r="14"
            fill={isActive('trigger') ? '#ffffff' : '#0a0a0a'}
            stroke={isActive('trigger') ? '#ffffff' : '#3f3f46'}
            strokeWidth="1.5"
            style={{ filter: isActive('trigger') ? 'url(#glow-white)' : 'none', transition: 'all 0.3s ease' }}
          />
          <polygon
            points="36,74 36,86 46,80"
            fill={isActive('trigger') ? '#0a0a0a' : '#ffffff'}
            style={{ transition: 'all 0.3s ease' }}
          />
        </g>

        {/* Main Node */}
        <g>
          <rect
            x="95" y="60" width="70" height="40" rx="8"
            fill={isActive('main') ? '#ffffff' : '#18181b'}
            stroke={isActive('main') ? '#ffffff' : '#3f3f46'}
            strokeWidth="1.5"
            style={{ filter: isActive('main') ? 'url(#glow-white)' : 'none', transition: 'all 0.3s ease' }}
          />
          <line x1="110" y1="75" x2="150" y2="75" stroke={isActive('main') ? '#18181b' : '#52525b'} strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
          <line x1="110" y1="85" x2="140" y2="85" stroke={isActive('main') ? '#18181b' : '#52525b'} strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
        </g>

        {/* Decision Node */}
        <g>
          <rect
            x="200" y="60" width="46" height="40" rx="6"
            fill={isActive('decision') ? '#ffffff' : '#18181b'}
            stroke={isActive('decision') ? '#ffffff' : '#3f3f46'}
            strokeWidth="1.5"
            style={{ filter: isActive('decision') ? 'url(#glow-white)' : 'none', transition: 'all 0.3s ease' }}
          />
          <line x1="212" y1="75" x2="234" y2="75" stroke={isActive('decision') ? '#18181b' : '#52525b'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
          <line x1="212" y1="85" x2="228" y2="85" stroke={isActive('decision') ? '#18181b' : '#52525b'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
        </g>

        {/* Output1 Node */}
        <g>
          <rect
            x="320" y="32" width="55" height="36" rx="6"
            fill={isActive('output1') ? '#ffffff' : '#18181b'}
            stroke={isActive('output1') ? '#ffffff' : '#3f3f46'}
            strokeWidth="1.5"
            style={{ filter: isActive('output1') ? 'url(#glow-white)' : 'none', transition: 'all 0.3s ease' }}
          />
          <line x1="330" y1="45" x2="365" y2="45" stroke={isActive('output1') ? '#18181b' : '#52525b'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
          <line x1="330" y1="55" x2="355" y2="55" stroke={isActive('output1') ? '#18181b' : '#52525b'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
        </g>

        {/* Output2 Node */}
        <g>
          <rect
            x="320" y="92" width="55" height="36" rx="6"
            fill={isActive('output2') ? '#ffffff' : '#18181b'}
            stroke={isActive('output2') ? '#ffffff' : '#3f3f46'}
            strokeWidth="1.5"
            style={{ filter: isActive('output2') ? 'url(#glow-white)' : 'none', transition: 'all 0.3s ease' }}
          />
          <line x1="330" y1="105" x2="365" y2="105" stroke={isActive('output2') ? '#18181b' : '#52525b'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
          <line x1="330" y1="115" x2="355" y2="115" stroke={isActive('output2') ? '#18181b' : '#52525b'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
        </g>

        {/* Tool1 Node */}
        <g>
          <circle
            cx="80" cy="170" r="18"
            fill={isActive('tool1') ? '#ffffff' : '#0a0a0a'}
            stroke={isActive('tool1') ? '#ffffff' : '#3f3f46'}
            strokeWidth="1.5"
            style={{ filter: isActive('tool1') ? 'url(#glow-white)' : 'none', transition: 'all 0.3s ease' }}
          />
          <line x1="68" y1="166" x2="92" y2="166" stroke={isActive('tool1') ? '#18181b' : '#52525b'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
          <line x1="68" y1="174" x2="85" y2="174" stroke={isActive('tool1') ? '#18181b' : '#52525b'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
        </g>

        {/* Tool2 Node */}
        <g>
          <circle
            cx="175" cy="180" r="18"
            fill={isActive('tool2') ? '#ffffff' : '#0a0a0a'}
            stroke={isActive('tool2') ? '#ffffff' : '#3f3f46'}
            strokeWidth="1.5"
            style={{ filter: isActive('tool2') ? 'url(#glow-white)' : 'none', transition: 'all 0.3s ease' }}
          />
          <line x1="163" y1="176" x2="187" y2="176" stroke={isActive('tool2') ? '#18181b' : '#52525b'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
          <line x1="163" y1="184" x2="180" y2="184" stroke={isActive('tool2') ? '#18181b' : '#52525b'} strokeWidth="2" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
        </g>

        {/* Animated dots - WHITE */}
        {dots.map((dot) => (
          <circle key={dot.id} cx={dot.x} cy={dot.y} r="3" fill="#ffffff" filter="url(#glow-white)" />
        ))}
      </svg>
    </div>
  );
}
