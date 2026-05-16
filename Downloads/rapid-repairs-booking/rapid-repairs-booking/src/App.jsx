import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  DEPOSIT_AMOUNT, SCREEN_DISCLAIMER, DEPOSIT_POLICY,
  categories, devicesByCat,
  iphoneSeries, samsungSeries,
  iphoneModels, samsungModels,
  modelRepairs, genericRepairs,
  getAvailableSlots,
} from './data';
import './styles.css';

const stripePromise = loadStripe('pk_test_REPLACE_WITH_YOUR_STRIPE_PUBLISHABLE_KEY');

// ── iPhone SVG silhouette (model-accurate: island / notch / home-button) ─────
function IPhoneSVG({ size = 'std', top = 'island', svgHeight = 90 }) {
  const uid = React.useId().replace(/:/g, '');
  const SIZE_W = { mini: 110, std: 130, plus: 148, max: 158 };
  const SIZE_H = { mini: 230, std: 250, plus: 268, max: 282 };
  const W = SIZE_W[size], H = SIZE_H[size];
  const vbW = W + 24, vbH = H + 24;
  const svgW = Math.round((svgHeight / vbH) * vbW);
  const r = top === 'home' ? 22 : 28;
  const innerPad = 8, screenR = Math.max(2, r - 5), stroke = 2, color = '#1a1a1f';
  const cx = W / 2;
  const islandW = size === 'mini' ? 38 : 48, islandH = 12, islandY = 14;
  const wideNotchW = size === 'mini' ? 62 : 74, wideNotchH = 16;
  const pillNotchW = size === 'mini' ? 42 : 52, pillNotchH = 13;
  const sgId = `sg${uid}`, bgId = `bg${uid}`;
  return (
    <svg viewBox={`-12 -12 ${vbW} ${vbH}`} width={svgW} height={svgHeight}>
      <defs>
        <linearGradient id={sgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef1f7" /><stop offset="100%" stopColor="#cfd6e6" />
        </linearGradient>
        <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a44" /><stop offset="100%" stopColor="#1a1a1f" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} rx={r} ry={r} fill={`url(#${bgId})`} stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
      <line x1={-1.5} y1={H*.22} x2={-1.5} y2={H*.28} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <line x1={-1.5} y1={H*.32} x2={-1.5} y2={H*.42} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <line x1={-1.5} y1={H*.44} x2={-1.5} y2={H*.54} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <line x1={W+1.5} y1={H*.26} x2={W+1.5} y2={H*.4}  stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      {top === 'home' ? (<>
        <rect x={innerPad} y={innerPad+18} width={W-innerPad*2} height={H-(innerPad+18)*2-6} rx={6} ry={6} fill={`url(#${sgId})`} strokeWidth={1.4} />
        <rect x={cx-22} y={innerPad+6} width={44} height={4} rx={2} fill={color} opacity={0.7} />
        <circle cx={cx} cy={H-innerPad-12} r={9} fill="none" stroke={color} strokeWidth={1.6} />
      </>) : (<>
        <rect x={innerPad} y={innerPad} width={W-innerPad*2} height={H-innerPad*2} rx={screenR} ry={screenR} fill={`url(#${sgId})`} strokeWidth={1.4} />
        {top === 'island' && <rect x={cx-islandW/2} y={islandY} width={islandW} height={islandH} rx={islandH/2} ry={islandH/2} fill={color} />}
        {top === 'notch-wide' && (() => { const w=wideNotchW,h=wideNotchH,br=7,x0=cx-w/2,y0=innerPad; return <path d={`M ${x0} ${y0} H ${x0+w} V ${y0+h-br} A ${br} ${br} 0 0 1 ${x0+w-br} ${y0+h} H ${x0+br} A ${br} ${br} 0 0 1 ${x0} ${y0+h-br} Z`} fill={color} />; })()}
        {top === 'notch'      && (() => { const w=pillNotchW,h=pillNotchH,br=h/2,x0=cx-w/2,y0=innerPad;  return <path d={`M ${x0} ${y0} H ${x0+w} V ${y0+h-br} A ${br} ${br} 0 0 1 ${x0+w-br} ${y0+h} H ${x0+br} A ${br} ${br} 0 0 1 ${x0} ${y0+h-br} Z`} fill={color} />; })()}
      </>)}
    </svg>
  );
}

function PhoneStage({ size, top, svgHeight = 90 }) {
  return (
    <div className="phone-stage" style={{ height: svgHeight + 20 }}>
      <IPhoneSVG size={size} top={top} svgHeight={svgHeight} />
    </div>
  );
}

function SamsungSVG({ type, selected }) {
  const stroke = selected ? 'var(--color-text-primary)' : 'var(--color-border-secondary)';
  const fill   = selected ? 'var(--color-background-secondary)' : 'var(--color-background-primary)';
  const w = type === 'ultra' ? 40 : type === 'plus' ? 38 : 34;
  const h = type === 'ultra' ? 80 : type === 'plus' ? 76 : 70;
  const r = type === 'ultra' ? 6 : 8;
  const bh = type === 'ultra' ? 22 : type === 'plus' ? 18 : 14;
  const bw = type === 'ultra' ? 16 : 12;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <rect x="1" y="1" width={w-2} height={h-2} rx={r} fill={fill} stroke={stroke} strokeWidth="1.5"/>
      <rect x={(w-bw)/2} y="6" width={bw} height={bh} rx="5" fill="none" stroke={stroke} strokeWidth="1" opacity="0.6"/>
      {type === 'ultra' ? (<>
        <circle cx={w/2} cy={6+bh/2-3} r="3" fill={stroke} opacity="0.3"/>
        <circle cx={w/2-3} cy={6+bh/2+4} r="2.5" fill={stroke} opacity="0.3"/>
        <circle cx={w/2+3} cy={6+bh/2+4} r="2.5" fill={stroke} opacity="0.3"/>
      </>) : type === 'plus' ? (<>
        <circle cx={w/2} cy={6+bh/2-2} r="3" fill={stroke} opacity="0.3"/>
        <circle cx={w/2} cy={6+bh/2+4} r="2.5" fill={stroke} opacity="0.3"/>
      </>) : (
        <circle cx={w/2} cy={6+bh/2} r="3" fill={stroke} opacity="0.3"/>
      )}
      <line x1={w/2-5} y1={h-6} x2={w/2+5} y2={h-6} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
    </svg>
  );
}

function PixelDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="px9proxl" viewBox="0 0 120 220">
          <rect x="14" y="8" width="92" height="204" rx="20" className="p-body-10"/>
          <rect x="14" y="8" width="92" height="204" rx="20" fill="url(#pxSheen)"/>
          <rect x="14" y="8" width="92" height="204" rx="20" className="p-edge"/>
          <rect x="24" y="26" width="72" height="30" rx="15" className="p-bar"/>
          <rect x="24" y="26" width="72" height="30" rx="15" fill="url(#pxBarSheen)"/>
          <circle cx="38" cy="41" r="7" className="p-lens"/><circle cx="38" cy="41" r="3" className="p-iris"/>
          <circle cx="58" cy="41" r="7" className="p-lens"/><circle cx="58" cy="41" r="3" className="p-iris"/>
          <circle cx="78" cy="41" r="7" className="p-lens"/><circle cx="78" cy="41" r="3" className="p-iris"/>
          <circle cx="91" cy="41" r="2.5" className="p-flash"/>
        </symbol>
        <symbol id="px9pro" viewBox="0 0 120 220">
          <rect x="18" y="14" width="84" height="192" rx="18" className="p-body-5"/>
          <rect x="18" y="14" width="84" height="192" rx="18" fill="url(#pxSheen)"/>
          <rect x="18" y="14" width="84" height="192" rx="18" className="p-edge"/>
          <rect x="26" y="30" width="68" height="28" rx="14" className="p-bar"/>
          <rect x="26" y="30" width="68" height="28" rx="14" fill="url(#pxBarSheen)"/>
          <circle cx="38" cy="44" r="6.5" className="p-lens"/><circle cx="38" cy="44" r="2.8" className="p-iris"/>
          <circle cx="56" cy="44" r="6.5" className="p-lens"/><circle cx="56" cy="44" r="2.8" className="p-iris"/>
          <circle cx="74" cy="44" r="6.5" className="p-lens"/><circle cx="74" cy="44" r="2.8" className="p-iris"/>
          <circle cx="87" cy="44" r="2.3" className="p-flash"/>
        </symbol>
        <symbol id="px9" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-8"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <rect x="30" y="32" width="60" height="26" rx="13" className="p-bar"/>
          <rect x="30" y="32" width="60" height="26" rx="13" fill="url(#pxBarSheen)"/>
          <circle cx="44" cy="45" r="6" className="p-lens"/><circle cx="44" cy="45" r="2.5" className="p-iris"/>
          <circle cx="62" cy="45" r="6" className="p-lens"/><circle cx="62" cy="45" r="2.5" className="p-iris"/>
          <circle cx="80" cy="45" r="2.2" className="p-flash"/>
        </symbol>
        <symbol id="px8pro" viewBox="0 0 120 220">
          <rect x="18" y="14" width="84" height="192" rx="18" className="p-body-9"/>
          <rect x="18" y="14" width="84" height="192" rx="18" fill="url(#pxSheen)"/>
          <rect x="18" y="14" width="84" height="192" rx="18" className="p-edge"/>
          <rect x="18" y="32" width="84" height="26" className="p-bar"/>
          <rect x="18" y="32" width="84" height="26" fill="url(#pxBarSheen)"/>
          <rect x="28" y="36" width="46" height="18" rx="9" className="p-glass"/>
          <circle cx="36" cy="45" r="4.5" className="p-lens"/><circle cx="36" cy="45" r="1.8" className="p-iris"/>
          <circle cx="50" cy="45" r="4.5" className="p-lens"/><circle cx="50" cy="45" r="1.8" className="p-iris"/>
          <circle cx="64" cy="45" r="4.5" className="p-lens"/><circle cx="64" cy="45" r="1.8" className="p-iris"/>
          <circle cx="84" cy="45" r="3" className="p-lens"/>
          <circle cx="94" cy="45" r="2" className="p-flash"/>
        </symbol>
        <symbol id="px8a" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="20" className="p-body-6"/>
          <rect x="20" y="16" width="80" height="188" rx="20" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="20" className="p-edge"/>
          <rect x="26" y="34" width="68" height="22" rx="11" className="p-bar"/>
          <rect x="26" y="34" width="68" height="22" rx="11" fill="url(#pxBarSheen)"/>
          <circle cx="40" cy="45" r="5" className="p-lens"/><circle cx="40" cy="45" r="2" className="p-iris"/>
          <circle cx="56" cy="45" r="5" className="p-lens"/><circle cx="56" cy="45" r="2" className="p-iris"/>
          <circle cx="80" cy="45" r="2" className="p-flash"/>
        </symbol>
        <symbol id="px8" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-4"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <rect x="20" y="32" width="80" height="24" className="p-bar"/>
          <rect x="20" y="32" width="80" height="24" fill="url(#pxBarSheen)"/>
          <rect x="30" y="36" width="34" height="16" rx="8" className="p-glass"/>
          <circle cx="38" cy="44" r="4.2" className="p-lens"/><circle cx="38" cy="44" r="1.7" className="p-iris"/>
          <circle cx="56" cy="44" r="4.2" className="p-lens"/><circle cx="56" cy="44" r="1.7" className="p-iris"/>
          <circle cx="80" cy="44" r="2" className="p-flash"/>
        </symbol>
        <symbol id="px7pro" viewBox="0 0 120 220">
          <rect x="18" y="14" width="84" height="192" rx="16" className="p-body-3"/>
          <rect x="18" y="14" width="84" height="192" rx="16" fill="url(#pxSheen)"/>
          <rect x="18" y="14" width="84" height="192" rx="16" className="p-edge"/>
          <rect x="18" y="30" width="84" height="28" className="p-bar-trim"/>
          <rect x="18" y="30" width="84" height="28" fill="url(#pxBarSheen)"/>
          <rect x="26" y="36" width="32" height="16" rx="8" className="p-glass"/>
          <circle cx="34" cy="44" r="4.5" className="p-lens"/><circle cx="34" cy="44" r="1.8" className="p-iris"/>
          <circle cx="50" cy="44" r="4.5" className="p-lens"/><circle cx="50" cy="44" r="1.8" className="p-iris"/>
          <rect x="64" y="36" width="22" height="16" rx="8" className="p-glass"/>
          <circle cx="75" cy="44" r="5" className="p-lens"/><circle cx="75" cy="44" r="2.2" className="p-iris-2"/>
          <circle cx="93" cy="44" r="2" className="p-flash"/>
        </symbol>
        <symbol id="px7a" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-2"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <rect x="20" y="32" width="80" height="24" className="p-bar-trim"/>
          <rect x="20" y="32" width="80" height="24" fill="url(#pxBarSheen)"/>
          <rect x="30" y="36" width="34" height="16" rx="8" className="p-glass"/>
          <circle cx="38" cy="44" r="4.2" className="p-lens"/><circle cx="38" cy="44" r="1.6" className="p-iris"/>
          <circle cx="56" cy="44" r="4.2" className="p-lens"/><circle cx="56" cy="44" r="1.6" className="p-iris"/>
          <circle cx="80" cy="44" r="2" className="p-flash"/>
        </symbol>
        <symbol id="px7" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-5"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <rect x="20" y="32" width="80" height="24" className="p-bar-trim"/>
          <rect x="20" y="32" width="80" height="24" fill="url(#pxBarSheen)"/>
          <rect x="30" y="36" width="34" height="16" rx="8" className="p-glass"/>
          <circle cx="38" cy="44" r="4.2" className="p-lens"/><circle cx="38" cy="44" r="1.6" className="p-iris"/>
          <circle cx="56" cy="44" r="4.2" className="p-lens"/><circle cx="56" cy="44" r="1.6" className="p-iris"/>
          <circle cx="80" cy="44" r="2" className="p-flash"/>
        </symbol>
        <symbol id="px6pro" viewBox="0 0 120 220">
          <rect x="18" y="14" width="84" height="192" rx="16" className="p-body-11"/>
          <rect x="18" y="14" width="84" height="192" rx="16" fill="url(#pxSheen)"/>
          <rect x="18" y="14" width="84" height="192" rx="16" className="p-edge"/>
          <path d="M18,30 L102,30 L102,58 L18,58 Z" fill="#f0d8a8"/>
          <rect x="18" y="14" width="84" height="16" fill="#1a1f28"/>
          <rect x="18" y="30" width="84" height="28" fill="url(#pxBarSheen)" opacity=".4"/>
          <rect x="18" y="34" width="84" height="20" className="p-bar"/>
          <rect x="28" y="38" width="34" height="12" rx="6" className="p-glass"/>
          <circle cx="36" cy="44" r="4" className="p-lens"/><circle cx="36" cy="44" r="1.4" className="p-iris"/>
          <circle cx="54" cy="44" r="4" className="p-lens"/><circle cx="54" cy="44" r="1.4" className="p-iris"/>
          <rect x="68" y="38" width="22" height="12" rx="6" className="p-glass"/>
          <circle cx="79" cy="44" r="4.2" className="p-lens"/><circle cx="79" cy="44" r="1.6" className="p-iris-2"/>
          <circle cx="94" cy="44" r="1.6" className="p-flash"/>
        </symbol>
        <symbol id="px6a" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="16" className="p-body-3"/>
          <rect x="20" y="16" width="80" height="188" rx="16" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="16" className="p-edge"/>
          <rect x="20" y="16" width="80" height="22" fill="#0d1218"/>
          <rect x="20" y="34" width="80" height="22" className="p-bar"/>
          <rect x="20" y="34" width="80" height="22" fill="url(#pxBarSheen)" opacity=".5"/>
          <rect x="30" y="38" width="34" height="14" rx="7" className="p-glass"/>
          <circle cx="38" cy="45" r="4" className="p-lens"/><circle cx="38" cy="45" r="1.4" className="p-iris"/>
          <circle cx="56" cy="45" r="4" className="p-lens"/><circle cx="56" cy="45" r="1.4" className="p-iris"/>
          <circle cx="80" cy="45" r="1.8" className="p-flash"/>
        </symbol>
        <symbol id="px6" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="16" className="p-body-8"/>
          <rect x="20" y="16" width="80" height="188" rx="16" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="16" className="p-edge"/>
          <rect x="20" y="16" width="80" height="20" fill="#f7e3bd"/>
          <rect x="20" y="36" width="80" height="22" className="p-bar"/>
          <rect x="30" y="40" width="34" height="14" rx="7" className="p-glass"/>
          <circle cx="38" cy="47" r="4" className="p-lens"/><circle cx="38" cy="47" r="1.4" className="p-iris"/>
          <circle cx="56" cy="47" r="4" className="p-lens"/><circle cx="56" cy="47" r="1.4" className="p-iris"/>
          <circle cx="80" cy="47" r="1.8" className="p-flash"/>
        </symbol>
        <symbol id="px5a" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-3"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <rect x="28" y="30" width="26" height="26" rx="6" className="p-bar"/>
          <circle cx="36" cy="38" r="4" className="p-lens"/><circle cx="36" cy="38" r="1.5" className="p-iris"/>
          <circle cx="46" cy="38" r="3" className="p-lens"/><circle cx="46" cy="38" r="1.1" className="p-iris"/>
          <circle cx="36" cy="49" r="1.8" className="p-flash"/>
          <circle cx="46" cy="49" r="1.4" className="p-flash"/>
          <circle cx="60" cy="110" r="9" className="p-fp"/>
        </symbol>
        <symbol id="px5" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-6"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <rect x="28" y="30" width="26" height="26" rx="6" className="p-bar"/>
          <circle cx="36" cy="38" r="4" className="p-lens"/><circle cx="36" cy="38" r="1.5" className="p-iris"/>
          <circle cx="46" cy="38" r="3" className="p-lens"/><circle cx="46" cy="38" r="1.1" className="p-iris"/>
          <circle cx="36" cy="49" r="1.8" className="p-flash"/>
          <circle cx="46" cy="49" r="1.4" className="p-flash"/>
          <circle cx="60" cy="110" r="9" className="p-fp"/>
        </symbol>
        <symbol id="px4a5g" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-11"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <rect x="28" y="30" width="26" height="26" rx="6" className="p-bar"/>
          <circle cx="36" cy="38" r="4" className="p-lens"/><circle cx="36" cy="38" r="1.5" className="p-iris"/>
          <circle cx="46" cy="38" r="3" className="p-lens"/><circle cx="46" cy="38" r="1.1" className="p-iris"/>
          <circle cx="36" cy="49" r="1.8" className="p-flash"/>
          <circle cx="46" cy="49" r="1.4" className="p-flash"/>
          <circle cx="60" cy="110" r="9" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" fill="none"/>
        </symbol>
        <symbol id="px4a" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-11"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <rect x="28" y="30" width="22" height="22" rx="5" className="p-bar"/>
          <circle cx="35" cy="37" r="3.5" className="p-lens"/><circle cx="35" cy="37" r="1.3" className="p-iris"/>
          <circle cx="35" cy="46" r="1.6" className="p-flash"/>
          <circle cx="44" cy="46" r="1.2" className="p-flash"/>
          <circle cx="60" cy="110" r="9" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" fill="none"/>
        </symbol>
        <symbol id="px4xl" viewBox="0 0 120 220">
          <rect x="18" y="14" width="84" height="192" rx="18" className="p-body-5"/>
          <rect x="18" y="14" width="84" height="192" rx="18" fill="url(#pxSheen)"/>
          <rect x="18" y="14" width="84" height="192" rx="18" className="p-edge"/>
          <rect x="26" y="28" width="34" height="34" rx="7" className="p-bar"/>
          <circle cx="36" cy="38" r="5" className="p-lens"/><circle cx="36" cy="38" r="1.8" className="p-iris"/>
          <circle cx="50" cy="38" r="4" className="p-lens"/><circle cx="50" cy="38" r="1.5" className="p-iris"/>
          <circle cx="36" cy="54" r="2" className="p-flash"/>
          <circle cx="50" cy="54" r="1.6" className="p-flash"/>
        </symbol>
        <symbol id="px4" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-3"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <rect x="28" y="30" width="32" height="32" rx="7" className="p-bar"/>
          <circle cx="37" cy="40" r="4.5" className="p-lens"/><circle cx="37" cy="40" r="1.7" className="p-iris"/>
          <circle cx="50" cy="40" r="3.6" className="p-lens"/><circle cx="50" cy="40" r="1.4" className="p-iris"/>
          <circle cx="37" cy="54" r="1.8" className="p-flash"/>
          <circle cx="50" cy="54" r="1.5" className="p-flash"/>
        </symbol>
        <symbol id="px3a" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-5"/>
          <rect x="20" y="16" width="80" height="60" rx="18" fill="#e9e3d2"/>
          <rect x="20" y="60" width="80" height="144" fill="#f3eee0"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <circle cx="36" cy="40" r="6" className="p-lens"/><circle cx="36" cy="40" r="2.4" className="p-iris"/>
          <rect x="48" y="36" width="6" height="8" rx="1.5" className="p-flash"/>
          <circle cx="60" cy="110" r="10" className="p-fp"/>
        </symbol>
        <symbol id="px3" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-body-5"/>
          <rect x="20" y="16" width="80" height="60" rx="18" fill="#ffffff"/>
          <rect x="20" y="60" width="80" height="144" fill="#f3eee0"/>
          <rect x="20" y="16" width="80" height="188" rx="18" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="18" className="p-edge"/>
          <circle cx="36" cy="40" r="6" className="p-lens"/><circle cx="36" cy="40" r="2.4" className="p-iris"/>
          <rect x="48" y="36" width="6" height="8" rx="1.5" className="p-flash"/>
          <circle cx="60" cy="110" r="10" className="p-fp"/>
        </symbol>
        <symbol id="px2xl" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="14" className="p-body-11"/>
          <rect x="20" y="16" width="80" height="80" rx="14" fill="#2a3340"/>
          <rect x="20" y="80" width="80" height="124" fill="#3a4350"/>
          <rect x="20" y="16" width="80" height="188" rx="14" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="14" className="p-edge"/>
          <circle cx="36" cy="40" r="5.5" className="p-lens"/><circle cx="36" cy="40" r="2.2" className="p-iris"/>
          <rect x="46" y="37" width="5" height="6" rx="1" className="p-flash"/>
          <circle cx="60" cy="110" r="10" fill="rgba(255,255,255,.12)"/>
        </symbol>
        <symbol id="px2" viewBox="0 0 120 220">
          <rect x="20" y="16" width="80" height="188" rx="14" className="p-body-5"/>
          <rect x="20" y="16" width="80" height="78" rx="14" fill="#f1ebdc"/>
          <rect x="20" y="78" width="80" height="126" fill="#ffffff"/>
          <rect x="20" y="16" width="80" height="188" rx="14" fill="url(#pxSheen)"/>
          <rect x="20" y="16" width="80" height="188" rx="14" className="p-edge"/>
          <circle cx="36" cy="40" r="5.5" className="p-lens"/><circle cx="36" cy="40" r="2.2" className="p-iris"/>
          <rect x="46" y="37" width="5" height="6" rx="1" className="p-flash"/>
          <circle cx="60" cy="110" r="10" className="p-fp"/>
        </symbol>
      </defs>
    </svg>
  );
}

function PixelPhoneSVG({ svgId }) {
  return (
    <svg viewBox="0 0 120 220" style={{ height: 88, width: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="pxSheen" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".18"/>
          <stop offset=".5" stopColor="#ffffff" stopOpacity="0"/>
          <stop offset="1" stopColor="#000000" stopOpacity=".06"/>
        </linearGradient>
        <linearGradient id="pxBarSheen" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".22"/>
          <stop offset="1" stopColor="#000000" stopOpacity=".15"/>
        </linearGradient>
      </defs>
      <use href={`#${svgId}`} />
    </svg>
  );
}

function IPadSVG({ size, selected }) {
  const stroke = selected ? 'var(--color-text-primary)' : 'var(--color-border-secondary)';
  const fill   = selected ? 'var(--color-background-secondary)' : 'var(--color-background-primary)';
  const dims = { sm: [42,56], md: [50,66], lg: [58,76] };
  const [w, h] = dims[size] || dims.md;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <rect x="1" y="1" width={w-2} height={h-2} rx="6" fill={fill} stroke={stroke} strokeWidth="1.5"/>
      <rect x={(w-18)/2} y="4" width="18" height="3" rx="1.5" fill={stroke} opacity="0.35"/>
      <circle cx={w/2} cy={h-8} r="4.5" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.5"/>
      <rect x="5" y="11" width={w-10} height={h-24} rx="2" fill="none" stroke={stroke} strokeWidth="0.75" opacity="0.2"/>
      <circle cx={w-5} cy={h/2} r="2" fill={stroke} opacity="0.2"/>
    </svg>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ labels, current }) {
  return (
    <div className="progress-wrap">
      <div className="progress-bar">
        {labels.map((l, i) => (
          <React.Fragment key={l+i}>
            <div className={`step-dot ${i < current ? 'done' : i === current ? 'active' : 'inactive'}`}>
              {i < current ? <i className="ti ti-check" aria-hidden="true" style={{ fontSize: 10 }} /> : i + 1}
            </div>
            {i < labels.length - 1 && <div className={`step-line ${i < current ? 'done' : ''}`} />}
          </React.Fragment>
        ))}
      </div>
      <div className="step-labels">
        {labels.map((l, i) => <span key={l+i} className={i === current ? 'active-label' : ''}>{l}</span>)}
      </div>
    </div>
  );
}

// ── MacBook repair type cards ─────────────────────────────────────────────────
const MB_CARDS = [
  { id: 'screen',      ico: '🖥️', name: 'Screen',                    sub: 'MacBook Air / Pro', price: 'From £349' },
  { id: 'battery',     ico: '🔋', name: 'Battery',                    sub: 'MacBook Air / Pro', price: 'From £119' },
  { id: 'motherboard', ico: '🔧', name: 'Motherboard / water damage', sub: 'MacBook Air / Pro', price: 'Free quote' },
  { id: 'other',       ico: '💬', name: 'Other repair',               sub: 'Keyboard, port, fan & more', price: 'Free quote' },
];

// ── Other laptop repair type cards ───────────────────────────────────────────
const LT_CARDS = [
  { id: 'screen',      ico: '🖥️', name: 'Screen replacement',        sub: 'HP, Asus, Lenovo, Dell & more', price: '£110–£239' },
  { id: 'battery',     ico: '🔋', name: 'Battery replacement',        sub: 'All makes and models',          price: 'From £119' },
  { id: 'motherboard', ico: '🔧', name: 'Motherboard / water damage', sub: 'Free diagnostic included',       price: 'Free quote' },
  { id: 'other',       ico: '💬', name: 'Other repair',               sub: 'Keyboard, port, fan & more',    price: 'Free quote' },
];

// iPad series / models
const IPAD_SERIES = [
  { id: 'ipad', name: 'iPad',      sub: 'Standard range', size: 'sm' },
  { id: 'air',  name: 'iPad Air',  sub: 'Air lineup',     size: 'md' },
  { id: 'pro',  name: 'iPad Pro',  sub: 'Pro lineup',     size: 'lg' },
];
const IPAD_MODELS = {
  ipad: [
    { name: 'iPad 10th gen', year: '2022' }, { name: 'iPad 9th gen', year: '2021' },
    { name: 'iPad 8th gen',  year: '2020' }, { name: 'iPad 7th gen', year: '2019' },
    { name: 'iPad 6th gen',  year: '2018' }, { name: 'iPad 5th gen', year: '2017' },
    { name: 'iPad 4th gen',  year: '2012' }, { name: 'iPad 3rd gen', year: '2012' },
  ],
  air: [
    { name: 'iPad Air 5th gen', year: '2022' }, { name: 'iPad Air 4th gen', year: '2020' },
    { name: 'iPad Air 3rd gen', year: '2019' }, { name: 'iPad Air 2nd gen', year: '2014' },
    { name: 'iPad Air 1st gen', year: '2013' },
  ],
  pro: [
    { name: 'iPad Pro 12.9" 5th gen', year: '2021' }, { name: 'iPad Pro 11" 5th gen', year: '2021' },
    { name: 'iPad Pro 12.9" 4th gen', year: '2020' }, { name: 'iPad Pro 11" 4th gen', year: '2020' },
    { name: 'iPad Pro 12.9" 3rd gen', year: '2018' }, { name: 'iPad Pro 11" 3rd gen', year: '2018' },
    { name: 'iPad Pro 12.9" 2nd gen', year: '2017' }, { name: 'iPad Pro 10.5" 2nd gen', year: '2017' },
    { name: 'iPad Pro 12.9" 1st gen', year: '2015' }, { name: 'iPad Pro 9.7" 1st gen', year: '2016' },
  ],
};
const IPAD_REPAIRS = {
  'iPad 10th gen': [{ name: 'Screen', sub: 'Outer glass/digitiser only', time: '1–2 hrs', price: 119 }, { name: 'Screen + LCD', sub: 'Full display — for dark spots or lines', time: '2–3 hrs', price: 269 }, { name: 'Battery replacement', time: '1–2 hrs', price: 149 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad 9th gen':  [{ name: 'Screen', sub: 'Outer glass/digitiser only', time: '1–2 hrs', price: 119 }, { name: 'Screen + LCD', sub: 'Full display — for dark spots or lines', time: '2–3 hrs', price: 179 }, { name: 'Battery replacement', time: '1–2 hrs', price: 115 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad 8th gen':  [{ name: 'Screen', sub: 'Outer glass/digitiser only', time: '1–2 hrs', price: 119 }, { name: 'Screen + LCD', sub: 'Full display — for dark spots or lines', time: '2–3 hrs', price: 179 }, { name: 'Battery replacement', time: '1–2 hrs', price: 115 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad 7th gen':  [{ name: 'Screen', sub: 'Outer glass/digitiser only', time: '1–2 hrs', price: 119 }, { name: 'Screen + LCD', sub: 'Full display — for dark spots or lines', time: '2–3 hrs', price: 179 }, { name: 'Battery replacement', time: '1–2 hrs', price: 115 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad 6th gen':  [{ name: 'Screen', sub: 'Outer glass/digitiser only', time: '1–2 hrs', price: 99 },  { name: 'Screen + LCD', sub: 'Full display — for dark spots or lines', time: '2–3 hrs', price: 169 }, { name: 'Battery replacement', time: '1–2 hrs', price: 99 },  { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad 5th gen':  [{ name: 'Screen', sub: 'Outer glass/digitiser only', time: '1–2 hrs', price: 99 },  { name: 'Screen + LCD', sub: 'Full display — for dark spots or lines', time: '2–3 hrs', price: 169 }, { name: 'Battery replacement', time: '1–2 hrs', price: 99 },  { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad 4th gen':  [{ name: 'Battery replacement', time: '1–2 hrs', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad 3rd gen':  [{ name: 'Battery replacement', time: '1–2 hrs', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Air 5th gen': [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 225 }, { name: 'Battery replacement', time: '1–2 hrs', price: 129 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Air 4th gen': [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 225 }, { name: 'Battery replacement', time: '1–2 hrs', price: 129 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Air 3rd gen': [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 189 }, { name: 'Battery replacement', time: '1–2 hrs', price: 119 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Air 2nd gen': [{ name: 'Battery replacement', time: '1–2 hrs', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Air 1st gen': [{ name: 'Battery replacement', time: '1–2 hrs', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Pro 12.9" 5th gen': [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 329 }, { name: 'Battery replacement', time: '1–2 hrs', price: 139 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Pro 11" 5th gen':   [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 299 }, { name: 'Battery replacement', time: '1–2 hrs', price: 139 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Pro 12.9" 4th gen': [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 329 }, { name: 'Battery replacement', time: '1–2 hrs', price: 139 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Pro 11" 4th gen':   [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 299 }, { name: 'Battery replacement', time: '1–2 hrs', price: 139 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Pro 12.9" 3rd gen': [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 329 }, { name: 'Battery replacement', time: '1–2 hrs', price: 129 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Pro 11" 3rd gen':   [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 275 }, { name: 'Battery replacement', time: '1–2 hrs', price: 129 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Pro 12.9" 2nd gen': [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 329 }, { name: 'Battery replacement', time: '1–2 hrs', price: 129 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Pro 10.5" 2nd gen': [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 275 }, { name: 'Battery replacement', time: '1–2 hrs', price: 119 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Pro 12.9" 1st gen': [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 329 }, { name: 'Battery replacement', time: '1–2 hrs', price: 129 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPad Pro 9.7" 1st gen':  [{ name: 'Screen', sub: 'Full screen replacement', time: '1–2 hrs', price: 275 }, { name: 'Battery replacement', time: '1–2 hrs', price: 119 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
};

const PIXEL_MODELS = [
  { name: 'Pixel 9 Pro XL', gen: 9, svgId: 'px9proxl' },
  { name: 'Pixel 9 Pro',    gen: 9, svgId: 'px9pro'   },
  { name: 'Pixel 9',        gen: 9, svgId: 'px9'      },
  { name: 'Pixel 8 Pro',    gen: 8, svgId: 'px8pro'   },
  { name: 'Pixel 8a',       gen: 8, svgId: 'px8a'     },
  { name: 'Pixel 8',        gen: 8, svgId: 'px8'      },
  { name: 'Pixel 7 Pro',    gen: 7, svgId: 'px7pro'   },
  { name: 'Pixel 7a',       gen: 7, svgId: 'px7a'     },
  { name: 'Pixel 7',        gen: 7, svgId: 'px7'      },
  { name: 'Pixel 6 Pro',    gen: 6, svgId: 'px6pro'   },
  { name: 'Pixel 6a',       gen: 6, svgId: 'px6a'     },
  { name: 'Pixel 6',        gen: 6, svgId: 'px6'      },
  { name: 'Pixel 5a',       gen: 5, svgId: 'px5a'     },
  { name: 'Pixel 5',        gen: 5, svgId: 'px5'      },
  { name: 'Pixel 4a 5G',    gen: 4, svgId: 'px4a5g'   },
  { name: 'Pixel 4a',       gen: 4, svgId: 'px4a'     },
  { name: 'Pixel 4 XL',     gen: 4, svgId: 'px4xl'    },
  { name: 'Pixel 4',        gen: 4, svgId: 'px4'      },
  { name: 'Pixel 3a',       gen: 3, svgId: 'px3a'     },
  { name: 'Pixel 3',        gen: 3, svgId: 'px3'      },
  { name: 'Pixel 2 XL',     gen: 2, svgId: 'px2xl'    },
  { name: 'Pixel 2',        gen: 2, svgId: 'px2'      },
];

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [SLOTS] = useState(() => getAvailableSlots());

  const [st, setSt] = useState({
    step: 0,
    cat: null, device: null,
    // iPhone/Samsung
    series: null, model: null,
    // iPad
    ipadSer: null, ipadMod: null,
    // MacBook
    mbCard: null,
    // Other laptop
    ltCard: null,
    // Google/other
    pixelMod: null,
    // Repair
    repairIdx: null,
    // Timeslot/payment
    dayIdx: 0, slot: null, payMode: 'deposit',
    // Forms
    details: { fname: '', lname: '', phone: '', email: '' },
    quoteForm: { fname: '', lname: '', phone: '', email: '', issue: '' },
    otherForm: { fname: '', lname: '', phone: '', email: '', brand: '', issue: '' },
    // Results
    paidAmount: null, bookingRef: null,
  });

  const set = (patch) => setSt(s => ({ ...s, ...patch }));
  const go  = (step)  => setSt(s => ({ ...s, step }));

  // ── Repair helpers ─────────────────────────────────────────────────────────
  function getRepairs() {
    const { device, model, ipadMod } = st;
    if (device === 'ipad')     return IPAD_REPAIRS[ipadMod] || [];
    if (device === 'macbook')  return [];
    if (!model)                return [];
    if (device === 'iphone' || device === 'samsung') return modelRepairs[model] || [];
    if (device === 'google')   return genericRepairs.google || [];
    return genericRepairs[device] || [];
  }

  function getSelectedRepair() {
    const rps = getRepairs();
    return st.repairIdx !== null ? rps[st.repairIdx] : null;
  }

  function isQuoteRepair() {
    const r = getSelectedRepair();
    return r && r.quote === true && !r.price;
  }

  function isMotherboardRepair() {
    if (st.device === 'macbook') return st.mbCard === 'motherboard';
    if (st.device === 'other_laptop') return st.ltCard === 'motherboard';
    const r = getSelectedRepair();
    return r && r.name && r.name.includes('Motherboard');
  }

  const repairPrice = (() => { const r = getSelectedRepair(); return r?.price || 0; })();
  const charge = st.payMode === 'deposit' ? DEPOSIT_AMOUNT : repairPrice;

  // ── Progress labels ────────────────────────────────────────────────────────
  function getProgressLabels() {
    const { device } = st;
    if (device === 'macbook' || device === 'other_laptop') return ['Category', 'Device', 'Repair type', 'Quote'];
    if (device === 'other_phone' || device === 'android_tab')
      return ['Category', 'Device', 'Details'];
    if (device === 'google') {
      return isQuoteRepair() || st.step === 80
        ? ['Category', 'Device', 'Model', 'Repair', 'Quote']
        : ['Category', 'Device', 'Model', 'Repair', 'Time slot', 'Payment'];
    }
    if (device === 'ipad') {
      return isQuoteRepair() || st.step === 80
        ? ['Category', 'Device', 'Series', 'Model', 'Repair', 'Quote']
        : ['Category', 'Device', 'Series', 'Model', 'Repair', 'Time slot', 'Payment'];
    }
    if (device === 'iphone' || device === 'samsung') {
      return isQuoteRepair() || st.step === 80
        ? ['Category', 'Device', 'Series', 'Model', 'Repair', 'Quote']
        : ['Category', 'Device', 'Series', 'Model', 'Repair', 'Time slot', 'Payment'];
    }
    return ['Category', 'Device', 'Repair', 'Time slot', 'Payment'];
  }

  function getProgressStep() {
    const { device, step } = st;
    if (step === 80 || step >= 90) return getProgressLabels().length - 1;
    if (device === 'macbook' || device === 'other_laptop') return Math.min(step - 1, 3);
    if (device === 'other_phone' || device === 'android_tab') return Math.min(step, 2);
    // step 0=cat 1=device 2=series 3=model 4=repair 5=time 6=pay
    return step;
  }

  function nextFromRepair() {
    if (isQuoteRepair()) go(80);
    else go(5);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const labels  = getProgressLabels();
  const current = getProgressStep();
  const isDone  = st.step >= 90;

  return (
    <div className="app">
      <PixelDefs />
      <div className="app-header">
        <div className="logo-mark">RR</div>
        <div>
          <div className="logo-name">Rapid Repairs</div>
          <div className="logo-sub">Finchley · N12</div>
        </div>
      </div>

      {!isDone && st.step !== 91 && st.step !== 92 && (
        <ProgressBar labels={labels} current={current} />
      )}

      <div className="step-body">
        {st.step === 0 && <StepCategory />}
        {st.step === 1 && <StepDevice />}
        {st.step === 2 && (
          st.device === 'iphone'      ? <StepIphoneSeries /> :
          st.device === 'samsung'     ? <StepSamsungSeries /> :
          st.device === 'google'      ? <StepPixelGrid /> :
          st.device === 'ipad'        ? <StepIPadSeries /> :
          st.device === 'macbook'     ? <StepMacBookCards /> :
          st.device === 'other_laptop'? <StepOtherLaptopCards /> :
                                        <StepOtherForm />
        )}
        {st.step === 3 && (
          st.device === 'ipad' ? <StepIPadModel /> : <StepModelGrid />
        )}
        {st.step === 4 && <StepRepair />}
        {st.step === 5 && <StepTimeSlot />}
        {st.step === 6 && (
          <Elements key={charge} stripe={stripePromise} options={{
            mode: 'payment', amount: charge * 100, currency: 'gbp',
            appearance: { theme: 'flat', variables: { fontFamily: 'inherit', borderRadius: '8px', colorPrimary: '#1a1a1a' } },
          }}>
            <StepPayment />
          </Elements>
        )}
        {st.step === 80 && <StepQuoteForm />}
        {st.step === 90 && <StepDone />}
        {st.step === 91 && <StepQuoteDone />}
        {st.step === 92 && <StepOtherDone />}
      </div>

      {!isDone && (
        <div className="trust-strip">
          <span><i className="ti ti-star" aria-hidden="true" /> 100+ five-star reviews</span>
          <span>·</span>
          <span><i className="ti ti-shield-check" aria-hidden="true" /> 90-day warranty</span>
          <span>·</span>
          <span><i className="ti ti-bolt" aria-hidden="true" /> Same-day repairs</span>
        </div>
      )}
    </div>
  );

  // ── Step components (closures over state) ──────────────────────────────────
  function StepCategory() {
    return (
      <div className="step-panel">
        <p className="section-title">What do you need repaired?</p>
        <p className="section-sub">Tap a category to get started.</p>
        <div className="cat-grid">
          {categories.map(c => (
            <button key={c.id} className="cat-card"
              onClick={() => { set({ cat: c.id, device: null, series: null, model: null, ipadSer: null, ipadMod: null, mbCard: null, pixelMod: null, repairIdx: null }); go(1); }}>
              <span className="cat-icon">{c.icon}</span>
              <div className="cat-name">{c.name}</div>
              <div className="cat-sub">{c.sub}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function StepDevice() {
    const devs = devicesByCat[st.cat] || [];
    return (
      <div className="step-panel">
        <p className="section-title">{categories.find(c => c.id === st.cat)?.name}</p>
        <p className="section-sub">Tap your device to continue.</p>
        <div className="dev-list">
          {devs.map(d => (
            <button key={d.id} className="dev-item"
              onClick={() => { set({ device: d.id, series: null, model: null, ipadSer: null, ipadMod: null, mbCard: null, pixelMod: null, repairIdx: null }); go(2); }}>
              <i className={`ti ${d.icon}`} aria-hidden="true" style={{ fontSize: 22, flexShrink: 0, color: 'var(--color-text-secondary)' }} />
              <div>
                <div className="dev-item-name">{d.name}</div>
                <div className="dev-item-sub">{d.sub}</div>
              </div>
              <i className="ti ti-chevron-right" aria-hidden="true" style={{ fontSize: 17, marginLeft: 'auto', color: 'var(--color-text-tertiary)' }} />
            </button>
          ))}
        </div>
        <button className="btn-back-full" onClick={() => go(0)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
      </div>
    );
  }

  function StepIphoneSeries() {
    return (
      <div className="step-panel">
        <p className="section-title">iPhone lineup</p>
        <p className="section-sub">Tap your range to continue.</p>
        <div className="series-grid">
          {iphoneSeries.map(s => (
            <button key={s.id} className="series-card"
              onClick={() => { set({ series: s.id, model: null, repairIdx: null }); go(3); }}>
              <PhoneStage {...s.svgProps} svgHeight={85} />
              <div className="series-name iphone-name">{s.name}</div>
              <div className="series-sub">{s.sub}</div>
            </button>
          ))}
        </div>
        <button className="btn-back-full" onClick={() => go(1)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
      </div>
    );
  }

  function StepSamsungSeries() {
    return (
      <div className="step-panel">
        <p className="section-title">Samsung lineup</p>
        <p className="section-sub">Tap your range to continue.</p>
        <div className="series-grid">
          {samsungSeries.map(s => (
            <button key={s.id} className="series-card"
              onClick={() => { set({ series: s.id, model: null, repairIdx: null }); go(3); }}>
              <SamsungSVG type={s.svgType} selected={false} />
              <div className="series-name">{s.name}</div>
              <div className="series-sub">{s.sub}</div>
            </button>
          ))}
        </div>
        <button className="btn-back-full" onClick={() => go(1)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
      </div>
    );
  }

  function StepPixelGrid() {
    return (
      <div className="step-panel">
        <p className="section-title">Google Pixel</p>
        <p className="section-sub">Tap your model to see repair prices.</p>
        <div className="model-grid">
          {PIXEL_MODELS.map(m => (
            <button key={m.name} className="model-card"
              onClick={() => { set({ pixelMod: m.name, model: m.name, repairIdx: null }); go(4); }}>
              <PixelPhoneSVG svgId={m.svgId} />
              <div className="model-name">{m.name}</div>
            </button>
          ))}
        </div>
        <button className="btn-back-full" onClick={() => go(1)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
      </div>
    );
  }

  function StepIPadSeries() {
    return (
      <div className="step-panel">
        <p className="section-title">iPad lineup</p>
        <p className="section-sub">Tap your range to continue.</p>
        <div className="series-grid">
          {IPAD_SERIES.map(s => (
            <button key={s.id} className="series-card"
              onClick={() => { set({ ipadSer: s.id, ipadMod: null, repairIdx: null }); go(3); }}>
              <IPadSVG size={s.size} selected={false} />
              <div className="series-name">{s.name}</div>
              <div className="series-sub">{s.sub}</div>
            </button>
          ))}
        </div>
        <button className="btn-back-full" onClick={() => go(1)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
      </div>
    );
  }

  function StepIPadModel() {
    const ser = IPAD_SERIES.find(s => s.id === st.ipadSer);
    const models = IPAD_MODELS[st.ipadSer] || [];
    return (
      <div className="step-panel">
        <p className="section-title">{ser?.name}</p>
        <p className="section-sub">Tap your model to see repair prices.</p>
        <div className="model-grid-2">
          {models.map(m => (
            <button key={m.name} className="model-card"
              onClick={() => { set({ ipadMod: m.name, model: m.name, repairIdx: null }); go(4); }}>
              <IPadSVG size={ser?.size || 'md'} selected={false} />
              <div className="model-name">{m.name}</div>
              <div className="model-year">{m.year}</div>
            </button>
          ))}
        </div>
        <button className="btn-back-full" onClick={() => go(2)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
      </div>
    );
  }

  function StepModelGrid() {
    const isSamsung = st.device === 'samsung';
    const models = isSamsung
      ? (samsungModels[st.series] || [])
      : (iphoneModels[st.series] || []);
    return (
      <div className="step-panel">
        <p className="section-title">Select your model</p>
        <p className="section-sub">Tap to see exact repair prices.</p>
        <div className="model-grid">
          {models.map(m => (
            <button key={m.name} className="model-card"
              onClick={() => { set({ model: m.name, repairIdx: null }); go(4); }}>
              {isSamsung
                ? <SamsungSVG type={m.svgType || 'std'} selected={false} />
                : <PhoneStage {...m.svgProps} svgHeight={72} />}
              <div className={`model-name${!isSamsung ? ' iphone-name' : ''}`}>{m.name}</div>
            </button>
          ))}
        </div>
        <button className="btn-back-full" onClick={() => go(2)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
      </div>
    );
  }

  function StepMacBookCards() {
    return (
      <div className="step-panel">
        <p className="section-title">MacBook</p>
        <p className="section-sub">What type of repair do you need? We'll get back to you with a quote and next steps.</p>
        <div className="mb-grid">
          {MB_CARDS.map(c => (
            <button key={c.id} className="mb-card"
              onClick={() => { set({ mbCard: c.id }); go(80); }}>
              <div className="mb-card-ico">{c.ico}</div>
              <div className="mb-card-name">{c.name}</div>
              <div className="mb-card-sub">{c.sub}</div>
              <div className="mb-card-price">{c.price}</div>
            </button>
          ))}
        </div>
        <button className="btn-back-full" onClick={() => go(1)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
      </div>
    );
  }

  function StepOtherLaptopCards() {
    return (
      <div className="step-panel">
        <p className="section-title">Other laptop</p>
        <p className="section-sub">What type of repair do you need? Price depends on brand, age and screen type.</p>
        <div className="mb-grid">
          {LT_CARDS.map(c => (
            <button key={c.id} className="mb-card"
              onClick={() => { set({ ltCard: c.id }); go(80); }}>
              <div className="mb-card-ico">{c.ico}</div>
              <div className="mb-card-name">{c.name}</div>
              <div className="mb-card-sub">{c.sub}</div>
              <div className="mb-card-price">{c.price}</div>
            </button>
          ))}
        </div>
        <button className="btn-back-full" onClick={() => go(1)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
      </div>
    );
  }

  function StepRepair() {
    const repairs = getRepairs();
    const showIphoneNote = repairs.some(r => r.name?.includes('Standard') || r.name?.includes('Premium'));
    const showGoogleNote = repairs.some(r => r.name?.includes('Original') || r.name?.includes('OLED'));
    const showIPadNote   = repairs.some(r => r.name === 'Screen + LCD');
    const backStep = st.device === 'google' ? 2 : st.device === 'ipad' ? 3 : 3;
    return (
      <div className="step-panel">
        <p className="section-title">{st.model || st.ipadMod}</p>
        <p className="section-sub">Tap a repair to book. All prices include parts and labour.</p>
        <div className="warranty-pill"><span className="pill-dot" /> 90-day warranty · No fix, no fee</div>
        <div className="repair-list">
          {repairs.map((r, i) => {
            const isQ = r.quote && !r.price;
            const ps = isQ ? (r.priceStr || 'Get a quote') : r.priceStr ? r.priceStr : `£${r.price}`;
            return (
              <button key={i} className="repair-item"
                onClick={() => { set({ repairIdx: i }); isQ ? go(80) : go(5); }}>
                <div>
                  <div className="repair-name">{r.name}</div>
                  {r.sub && <div className="repair-subtitle">{r.sub}</div>}
                  <div className="repair-time"><i className="ti ti-clock" aria-hidden="true" style={{ fontSize: 11 }} /> {r.time}</div>
                </div>
                <div className={`repair-price ${isQ && !r.priceStr ? 'quote-pill' : ''}`}>{ps}</div>
              </button>
            );
          })}
        </div>
        {(showIphoneNote || showGoogleNote || showIPadNote) && (
          <div className="disclaimer-box">
            <div className="disclaimer-title">Screen options explained</div>
            <p className="disclaimer-text">
              {showIphoneNote ? SCREEN_DISCLAIMER :
               showGoogleNote ? 'Original screen uses an OEM-matched panel — closest to factory quality. OLED uses a high-quality aftermarket panel at a lower price — still excellent clarity.' :
               'Screen only replaces the outer glass/digitiser — ideal if your LCD looks fine. Screen + LCD replaces the full display assembly — needed for dark spots, colour bleed, or lines.'}
            </p>
          </div>
        )}
        <button className="btn-back-full" onClick={() => go(backStep)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
      </div>
    );
  }

  function StepTimeSlot() {
    return (
      <div className="step-panel">
        <p className="section-title">Pick a time</p>
        <p className="section-sub">Tap a day and slot to continue — we're open 7 days.</p>
        <div className="addr-pill">
          <i className="ti ti-map-pin" aria-hidden="true" style={{ fontSize: 16, flexShrink: 0, color: 'var(--color-text-tertiary)' }} />
          <div>
            <strong style={{ color: 'var(--color-text-primary)' }}>193 Summers Lane, N12 0LA</strong> · Finchley<br />
            <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Nearest stations: Arnos Grove, Finchley Central</span>
          </div>
        </div>
        <div className="day-tabs">
          {SLOTS.map((s, i) => (
            <button key={i} className={`day-tab ${st.dayIdx === i ? 'active' : ''}`}
              onClick={() => set({ dayIdx: i, slot: null })}>{s.label}</button>
          ))}
        </div>
        <div className="time-grid">
          {SLOTS[st.dayIdx].times.length > 0
            ? SLOTS[st.dayIdx].times.map(t => (
                <button key={t} className={`time-slot ${st.slot === t ? 'selected' : ''}`}
                  onClick={() => { set({ slot: t }); go(6); }}>{t}</button>
              ))
            : <p className="no-slots">No slots — try another day</p>}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn-back-full" onClick={() => go(4)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
        </div>
      </div>
    );
  }

  function StepPayment() {
    const stripe = useStripe();
    const elements = useElements();
    const [form, setForm] = useState(st.details);
    const [payMode, setPayMode] = useState(st.payMode);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const c = payMode === 'deposit' ? DEPOSIT_AMOUNT : repairPrice;
    const valid = form.fname && form.lname && form.phone && form.email;
    const upd = (k, v) => { const u = { ...form, [k]: v }; setForm(u); set({ details: u }); };
    const switchMode = (mode) => { setPayMode(mode); set({ payMode: mode }); };

    const handlePay = async () => {
      if (!stripe || !elements || !valid) return;
      setLoading(true);
      setErrMsg('');
      try {
        const { error: submitErr } = await elements.submit();
        if (submitErr) { setErrMsg(submitErr.message); setLoading(false); return; }

        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: c * 100,
            metadata: {
              device: st.model || st.ipadMod || st.device,
              repair: getSelectedRepair()?.name || '',
              slot: `${SLOTS[st.dayIdx].label} at ${st.slot}`,
              name: `${form.fname} ${form.lname}`,
              phone: form.phone,
              email: form.email,
            },
          }),
        });
        const { clientSecret, error: apiErr } = await res.json();
        if (apiErr) throw new Error(apiErr);

        const { error: payErr } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: { return_url: window.location.href },
          redirect: 'if_required',
        });
        if (payErr) throw new Error(payErr.message);

        const ref = 'RR-' + Math.floor(10000 + Math.random() * 90000);
        set({ step: 90, paidAmount: c, bookingRef: ref });

        fetch('/api/confirm-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ref,
            device: st.model || st.ipadMod || st.device,
            repair: getSelectedRepair()?.name || '',
            repairCost: repairPrice,
            slotDate: SLOTS[st.dayIdx].label,
            slotTime: st.slot,
            payMode,
            paidAmount: c,
            customer: `${form.fname} ${form.lname}`,
            phone: form.phone,
            email: form.email,
          }),
        }).catch(console.error);
      } catch (err) {
        setErrMsg(err.message || 'Payment failed. Please try again.');
        setLoading(false);
      }
    };

    return (
      <div className="step-panel">
        <p className="section-title">Your details & payment</p>
        <p className="section-sub">Card details handled securely by Stripe.</p>
        <div className="pay-toggle">
          <button className={`pay-option ${payMode === 'deposit' ? 'selected' : ''}`} onClick={() => switchMode('deposit')}>
            <div className="pay-option-label">Pay deposit</div>
            <div className="pay-option-amount">£{DEPOSIT_AMOUNT}</div>
            <div className="pay-option-sub">Balance on collection</div>
          </button>
          <button className={`pay-option ${payMode === 'full' ? 'selected' : ''}`} onClick={() => switchMode('full')}>
            <div className="pay-option-label">Pay in full</div>
            <div className="pay-option-amount">£{repairPrice}</div>
            <div className="pay-option-sub">Nothing more to pay</div>
          </button>
        </div>
        <div className="deposit-note">
          <i className="ti ti-info-circle" aria-hidden="true" style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }} />
          <span>{DEPOSIT_POLICY}</span>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">First name</label><input type="text" placeholder="Joshua" value={form.fname} onChange={e => upd('fname', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Last name</label><input type="text" placeholder="Smith" value={form.lname} onChange={e => upd('lname', e.target.value)} /></div>
        </div>
        <div className="form-group"><label className="form-label">Phone</label><input type="tel" placeholder="07700 900 000" value={form.phone} onChange={e => upd('phone', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Email</label><input type="email" placeholder="you@email.com" value={form.email} onChange={e => upd('email', e.target.value)} /></div>
        <div className="stripe-box">
          <label className="form-label" style={{ marginBottom: 10, display: 'block' }}>Card details</label>
          <PaymentElement />
        </div>
        <div className="pay-summary">
          <span>Paying now</span>
          <span className="pay-summary-amount">£{c}</span>
        </div>
        {errMsg && <div className="error-msg">{errMsg}</div>}
        <div className="btn-row">
          <button className="btn-back" onClick={() => go(5)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
          <button className="btn-primary btn-pay" onClick={handlePay} disabled={loading || !valid || !stripe}>
            {loading ? 'Processing…' : `Pay £${c} securely`} <i className="ti ti-lock" aria-hidden="true" />
          </button>
        </div>
        <p className="stripe-note"><i className="ti ti-shield-check" aria-hidden="true" /> Secured by Stripe · PCI DSS compliant</p>
      </div>
    );
  }

  function StepQuoteForm() {
    const isMB = st.device === 'macbook';
    const isLT = st.device === 'other_laptop';
    const isLaptop = isMB || isLT;
    const mbCard = MB_CARDS.find(c => c.id === st.mbCard);
    const ltCard = LT_CARDS.find(c => c.id === st.ltCard);
    const laptopCard = isMB ? mbCard : ltCard;
    const r = getSelectedRepair();
    const repairLabel = isLaptop ? (laptopCard?.name || 'a repair') : (r?.name || 'a repair');
    const deviceLabel = isMB ? 'MacBook Air / Pro' : isLT ? 'your laptop' : (st.model || st.ipadMod || 'your device');
    const isMB_repair = isMotherboardRepair();
    const [form, setForm] = useState(st.quoteForm);
    const valid = form.fname && form.lname && form.phone && form.email && form.issue;
    const upd = (k, v) => { const u = { ...form, [k]: v }; setForm(u); set({ quoteForm: u }); };
    const phs = { screen: isLT ? 'e.g. Screen cracked, backlight issues, touch not working…' : 'e.g. Screen cracked, backlight issues, dead pixels…', battery: "e.g. Battery drains fast, won't charge, swollen battery…", motherboard: "e.g. Won't turn on after liquid damage, no power…", other: 'e.g. Keyboard not working, fan loud, charging port loose…' };
    const cardId = isMB ? st.mbCard : st.ltCard;
    const ph = isLaptop ? (phs[cardId] || 'Describe the issue…') : "e.g. Won't turn on, cracked screen, water damage…";
    const bannerSub = isMB_repair
      ? `You selected <strong>${repairLabel}</strong> for your <strong>${deviceLabel}</strong>. Please note this repair typically takes <strong>4–7 days</strong>.`
      : `You selected <strong>${repairLabel}</strong> for your <strong>${deviceLabel}</strong>. Describe your issue and we'll send a price right away.`;
    const backStep = isLaptop ? 2 : 4;

    return (
      <div className="step-panel">
        <p className="section-title">Get a free quote</p>
        <p className="section-sub">We'll get back to you within 20 minutes.</p>
        <div className="quote-banner">
          <i className="ti ti-message-circle" aria-hidden="true" style={{ fontSize: 20, flexShrink: 0, marginTop: 1, color: 'var(--color-text-secondary)' }} />
          <div>
            <div className="quote-banner-title">No commitment — free quote</div>
            <div className="quote-banner-sub" dangerouslySetInnerHTML={{ __html: bannerSub }} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">First name</label><input type="text" placeholder="Joshua" value={form.fname} onChange={e => upd('fname', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Last name</label><input type="text" placeholder="Smith" value={form.lname} onChange={e => upd('lname', e.target.value)} /></div>
        </div>
        <div className="form-group"><label className="form-label">Phone</label><input type="tel" placeholder="07700 900 000" value={form.phone} onChange={e => upd('phone', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Email</label><input type="email" placeholder="you@email.com" value={form.email} onChange={e => upd('email', e.target.value)} /></div>
        <div className="form-group">
          <label className="form-label">Describe the issue</label>
          <textarea placeholder={ph} value={form.issue} onChange={e => upd('issue', e.target.value)} rows={3} />
        </div>
        <div className="btn-row">
          <button className="btn-back" onClick={() => go(backStep)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
          <button className="btn-primary" onClick={() => { set({ bookingRef: 'RR-Q-' + Math.floor(10000 + Math.random() * 90000) }); go(91); }} disabled={!valid}>
            Send quote request <i className="ti ti-send" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  function StepOtherForm() {
    const titles = { other_phone: 'Other smartphone', android_tab: 'Android tablet', macbook: 'MacBook', other_laptop: 'Other laptop' };
    const subs   = { other_phone: 'We repair Sony, OnePlus, Motorola, Huawei, Nokia and more.', android_tab: 'We repair Samsung, Lenovo, Huawei tablets and more.', other_laptop: 'HP, Asus, Lenovo, Dell, Chromebook and more.' };
    const [form, setForm] = useState(st.otherForm);
    const valid = form.fname && form.lname && form.phone && form.email && form.issue;
    const upd = (k, v) => { const u = { ...form, [k]: v }; setForm(u); set({ otherForm: u }); };
    return (
      <div className="step-panel">
        <p className="section-title">{titles[st.device] || 'Get a quote'}</p>
        <p className="section-sub">Tell us about your device — we'll reply within 20 minutes with a price.</p>
        <div className="quote-banner">
          <i className="ti ti-message-circle" aria-hidden="true" style={{ fontSize: 20, flexShrink: 0, marginTop: 1, color: 'var(--color-text-secondary)' }} />
          <div>
            <div className="quote-banner-title">Free quote — no commitment</div>
            <div className="quote-banner-sub">{subs[st.device] || ''}</div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">First name</label><input type="text" placeholder="Joshua" value={form.fname} onChange={e => upd('fname', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Last name</label><input type="text" placeholder="Smith" value={form.lname} onChange={e => upd('lname', e.target.value)} /></div>
        </div>
        <div className="form-group"><label className="form-label">Phone</label><input type="tel" placeholder="07700 900 000" value={form.phone} onChange={e => upd('phone', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Email</label><input type="email" placeholder="you@email.com" value={form.email} onChange={e => upd('email', e.target.value)} /></div>
        <div className="form-group">
          <label className="form-label">Brand & model <span style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>(optional)</span></label>
          <input type="text" placeholder="e.g. Sony Xperia 1 V" value={form.brand} onChange={e => upd('brand', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Describe the issue</label>
          <textarea placeholder="e.g. Cracked screen, won't charge, water damage…" value={form.issue} onChange={e => upd('issue', e.target.value)} rows={3} />
        </div>
        <div className="btn-row">
          <button className="btn-back" onClick={() => go(1)}><i className="ti ti-arrow-left" aria-hidden="true" /> Back</button>
          <button className="btn-primary" onClick={() => go(92)} disabled={!valid}>Send enquiry <i className="ti ti-send" aria-hidden="true" /></button>
        </div>
      </div>
    );
  }

  function StepDone() {
    const r = getSelectedRepair();
    const slot = SLOTS[st.dayIdx];
    return (
      <div className="step-panel success-wrap">
        <div className="success-icon"><i className="ti ti-check" aria-hidden="true" style={{ fontSize: 22 }} /></div>
        <p className="success-title">Booking confirmed!</p>
        <div className="ref-badge">{st.bookingRef}</div>
        <div className="confirm-card">
          <div className="confirm-row"><span className="confirm-label">Device</span><span className="confirm-val">{st.model || st.ipadMod}</span></div>
          <div className="confirm-row"><span className="confirm-label">Repair</span><span className="confirm-val">{r?.name}</span></div>
          <div className="confirm-row"><span className="confirm-label">Repair cost</span><span className="confirm-val">£{repairPrice}</span></div>
          <div className="confirm-row"><span className="confirm-label">Slot</span><span className="confirm-val">{slot?.label} at {st.slot}</span></div>
          <div className="confirm-row"><span className="confirm-label">{st.payMode === 'deposit' ? 'Deposit paid' : 'Paid in full'}</span><span className="confirm-val">£{st.paidAmount}</span></div>
        </div>
        <p className="success-sub">We'll WhatsApp or call <strong>{st.details.phone || 'you'}</strong> within 20 minutes to confirm.<br /><br /><i className="ti ti-map-pin" aria-hidden="true" /> 193 Summers Lane, N12 0LA<br />Open 7 days · 24 hours</p>
      </div>
    );
  }

  function StepQuoteDone() {
    const isMB = st.device === 'macbook';
    const isLT = st.device === 'other_laptop';
    const mbCard = MB_CARDS.find(c => c.id === st.mbCard);
    const ltCard = LT_CARDS.find(c => c.id === st.ltCard);
    const r = getSelectedRepair();
    const deviceLabel = isMB ? 'MacBook Air / Pro' : isLT ? 'Your laptop' : (st.model || st.ipadMod || 'Your device');
    const repairLabel = isMB ? mbCard?.name : isLT ? ltCard?.name : r?.name;
    return (
      <div className="step-panel success-wrap">
        <div className="success-icon"><i className="ti ti-check" aria-hidden="true" style={{ fontSize: 22 }} /></div>
        <p className="success-title">Quote request sent!</p>
        <div className="ref-badge">{st.bookingRef}</div>
        <div className="confirm-card">
          <div className="confirm-row"><span className="confirm-label">Device</span><span className="confirm-val">{deviceLabel}</span></div>
          <div className="confirm-row"><span className="confirm-label">Repair</span><span className="confirm-val">{repairLabel}</span></div>
          <div className="confirm-row"><span className="confirm-label">Name</span><span className="confirm-val">{st.quoteForm.fname} {st.quoteForm.lname}</span></div>
          <div className="confirm-row"><span className="confirm-label">Contact</span><span className="confirm-val">{st.quoteForm.phone}</span></div>
        </div>
        <p className="success-sub">We'll WhatsApp or call <strong>{st.quoteForm.phone}</strong> within 20 minutes with your quote.<br /><br /><i className="ti ti-map-pin" aria-hidden="true" /> 193 Summers Lane, N12 0LA<br />Open 7 days · 24 hours</p>
      </div>
    );
  }

  function StepOtherDone() {
    const ref = 'RR-Q-' + Math.floor(10000 + Math.random() * 90000);
    return (
      <div className="step-panel success-wrap">
        <div className="success-icon"><i className="ti ti-check" aria-hidden="true" style={{ fontSize: 22 }} /></div>
        <p className="success-title">Enquiry sent!</p>
        <div className="ref-badge">{ref}</div>
        <div className="confirm-card">
          {st.otherForm.brand && <div className="confirm-row"><span className="confirm-label">Device</span><span className="confirm-val">{st.otherForm.brand}</span></div>}
          <div className="confirm-row"><span className="confirm-label">Name</span><span className="confirm-val">{st.otherForm.fname} {st.otherForm.lname}</span></div>
          <div className="confirm-row"><span className="confirm-label">Contact</span><span className="confirm-val">{st.otherForm.phone}</span></div>
        </div>
        <p className="success-sub">We'll WhatsApp or call <strong>{st.otherForm.phone}</strong> within 20 minutes with a quote.<br /><br /><i className="ti ti-map-pin" aria-hidden="true" /> 193 Summers Lane, N12 0LA<br />Open 7 days · 24 hours</p>
      </div>
    );
  }
}
