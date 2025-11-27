import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './PollWidget.css';

export default function PollWidget({ pollId }) {
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [pollEnded, setPollEnded] = useState(false);

  useEffect(() => {
    if (pollId) {
      fetchPollById(pollId);
    } else {
      fetchActivePoll();
    }
  }, [pollId]);

  useEffect(() => {
    if (!poll || !poll.endsAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(poll.endsAt).getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeRemaining(null);
        setPollEnded(true);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeRemaining({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [poll]);

  const fetchActivePoll = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/polls/active`);
      setPoll(response.data);
      
      // Skontroluj localStorage či už hlasoval
      if (response.data) {
        const voted = localStorage.getItem(`poll_voted_${response.data._id}`);
        setHasVoted(!!voted);
        
        // Skontroluj či poll skončil
        if (response.data.endsAt && new Date() > new Date(response.data.endsAt)) {
          setPollEnded(true);
        }
      }
    } catch (error) {
      console.error('Chyba pri načítaní poll:', error);
    }
  };

  const fetchPollById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/polls/${id}`);
      setPoll(response.data);
      
      // Skontroluj localStorage či už hlasoval
      const voted = localStorage.getItem(`poll_voted_${response.data._id}`);
      setHasVoted(!!voted);
      
      // Skontroluj či poll skončil
      if (response.data.endsAt && new Date() > new Date(response.data.endsAt)) {
        setPollEnded(true);
      }
    } catch (error) {
      console.error('Chyba pri načítaní poll:', error);
    }
  };

  const handleVote = async (optionIndex) => {
    if (hasVoted || !poll || pollEnded) return;

    try {
      const response = await axios.post(`${API_URL}/api/polls/${poll._id}/vote`, {
        optionIndex
      });
      
      setPoll(response.data.data);
      setHasVoted(true);
      setSelectedOption(optionIndex);
      localStorage.setItem(`poll_voted_${poll._id}`, 'true');
    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      }
    }
  };

  if (!poll || !poll.options || poll.options.length === 0) {
    return null;
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const canVote = !hasVoted && !pollEnded && !poll.showResults;
  const showVoteResults = hasVoted || poll.showResults || pollEnded;

  return (
    <div className={`poll-widget minecraft-card ${!poll.active ? 'inactive-poll' : ''}`}>
      <h3 className="poll-title">
        <i className="fas fa-poll"></i> {poll.question}
        {!poll.active && (
          <span className="poll-status-badge inactive-badge">
            <i className="fas fa-archive"></i> Neaktívne
          </span>
        )}
      </h3>

      {/* Countdown Timer */}
      {poll.endsAt && timeRemaining && !pollEnded && (
        <div className="poll-countdown">
          <i className="fas fa-clock"></i> Zostáva:{' '}
          <strong>
            {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
          </strong>
        </div>
      )}

      {pollEnded && (
        <div className="poll-ended-badge">
          <i className="fas fa-flag-checkered"></i> Hlasovanie skončilo
        </div>
      )}

      <div className="poll-options">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
          const isSelected = hasVoted && selectedOption === index;

          return (
            <div 
              key={index} 
              className={`poll-option ${!canVote ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${pollEnded ? 'ended' : ''}`}
              onClick={() => canVote && handleVote(index)}
            >
              <div className="poll-option-content">
                <span className="poll-option-text">{option.text}</span>
                {showVoteResults && (
                  <span className="poll-option-votes">
                    {option.votes} {option.votes === 1 ? 'hlas' : 'hlasov'}
                  </span>
                )}
              </div>
              
              {showVoteResults && (
                <div className="poll-progress-bar">
                  <div 
                    className="poll-progress-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <span className="poll-percentage">{percentage}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showVoteResults && !pollEnded && (
        <div className="poll-footer">
          {hasVoted ? (
            <><i className="fas fa-check-circle"></i> Ďakujeme za tvoj hlas! Celkovo hlasov: {totalVotes}</>
          ) : (
            <><i className="fas fa-eye"></i> Výsledky sú viditeľné. Celkovo hlasov: {totalVotes}</>
          )}
        </div>
      )}

      {pollEnded && (
        <div className="poll-footer ended">
          <i className="fas fa-flag-checkered"></i> Hlasovanie ukončené. Celkovo hlasov: {totalVotes}
        </div>
      )}

      {!hasVoted && !pollEnded && (
        <div className="poll-footer">
          <i className="fas fa-hand-pointer"></i> Klikni na možnosť pre hlasovanie. Tvoj hlas nemôže byť zmenený.
        </div>
      )}
    </div>
  );
}
