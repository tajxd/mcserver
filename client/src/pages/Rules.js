import React from 'react';
import './Rules.css';
import { FaShieldAlt, FaSkullCrossbones, FaCogs, FaCalendarAlt, FaGavel, FaExclamationTriangle } from 'react-icons/fa';

const RuleCard = ({ icon: Icon, title, children }) => (
  <article className="rule-card fade-up" tabIndex={0} aria-labelledby={title.replace(/\s+/g, '-').toLowerCase()}>
    <div className="rule-card-header">
      <div className="rule-icon-wrapper">
        <Icon className="rule-icon" aria-hidden="true" />
      </div>
      <h3 className="rule-card-title" id={title.replace(/\s+/g, '-').toLowerCase()}>{title}</h3>
    </div>
    <div className="rule-card-body">{children}</div>
  </article>
);

export default function Rules() {
  return (
    <main className="rules-page">
      <header className="rules-hero">
        <h1 className="rules-title">Pravidlá Servera</h1>
        <p className="rules-subtitle">Krátke, jasné a spravodlivé — dodržiavajte pravidlá pre lepší zážitok všetkých hráčov.</p>
      </header>

      <section className="rules-grid container">
        <RuleCard icon={FaShieldAlt} title="Všeobecné pravidlá">
          <ul className="rule-list">
            <li>Zákaz hackov, cheatov a X-ray (server používa AntiXray)</li>
            <li>Zákaz combatlogovania – ak si v boji, nesmieš sa odpojiť</li>
            <li>Rešpektuj ostatných hráčov a neruší ich hru</li>
            <li>Zákaz griefovania stavieb na spawne</li>
          </ul>
        </RuleCard>

        <RuleCard icon={FaSkullCrossbones} title="Survival Gameplay">
          <ul className="rule-list">
            <li>PvP je povolené, ale bez spawncampovania; zákaz zneužívania elytry</li>
            <li>Raidovanie len ak je hráč online (žiadne offline vykrádanie)</li>
            <li>Bez lagovacích farm a preťažených redstone systémov</li>
            <li>Dupe glitche, ktoré sú obmedzené na konkrétne mechaniky, sú povolené</li>
          </ul>
        </RuleCard>

        <RuleCard icon={FaCogs} title="Módy a pluginy">
          <div className="modes-grid">
            <div>
              <h4>Optimalizácie</h4>
              <ul className="small-list"><li>Lithium</li><li>ServerCore</li><li>Alternate Current</li></ul>
            </div>
            <div>
              <h4>Ochrana</h4>
              <ul className="small-list"><li>EasyAuth</li><li>AntiXray</li></ul>
            </div>
            <div>
              <h4>Enchantmenty</h4>
              <ul className="small-list"><li>Gravity, Life-Steal, Recall Potion</li><li>True Shot, Thunder Strike</li></ul>
            </div>
          </div>
        </RuleCard>

        <RuleCard icon={FaCalendarAlt} title="Eventy">
          <ul className="rule-list">
            <li>Organizujeme PvP turnaje, boss eventy a treasure hunty</li>
            <li>Počas eventov môžu platiť dočasné pravidlá a odmeny</li>
          </ul>
        </RuleCard>

        <RuleCard icon={FaGavel} title="Postihy">
          <ul className="rule-list">
            <li>Varovanie → Dočasný ban → Permanentný ban pri opakovaní</li>
            <li>Administrátori rozhodujú podľa závažnosti a dôkazov</li>
          </ul>
        </RuleCard>

        <aside className="warning-card">
          <div className="warning-inner">
            <FaExclamationTriangle className="warning-icon" aria-hidden="true" />
            <div>
              <h4>Dôležité upozornenie</h4>
              <p>Administrátori môžu udeliť tresty aj za správanie, ktoré výrazne škodí komunite, aj keď to nie je explicitne uvedené.</p>
              <p className="strong">Zákaz používania Recall Potion vo fightoch. Odporúčame nahrávať súboje.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
