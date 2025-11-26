import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './PollWidget.css';

export default function PollWidget() {
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchActivePoll();
  }, []);

  const fetchActivePoll = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/polls/active`);
      setPoll(response.data);
      
      // Skontroluj localStorage či už hlasoval
      if (response.data) {
        const voted = localStorage.getItem(`poll_voted_${response.data._id}`);
        setHasVoted(!!voted);
      }
    } catch (error) {
      console.error('Chyba pri načítaní poll:', error);
    }
  };

  const handleVote = async (optionIndex) => {
    if (hasVoted || !poll) return;

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

  return (
    <div className="poll-widget minecraft-card">
      <h3 className="poll-title">
        <i className="fas fa-poll"></i> {poll.question}
      </h3>

      <div className="poll-options">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
          const isSelected = hasVoted && selectedOption === index;

          return (
            <div 
              key={index} 
              className={`poll-option ${hasVoted ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => !hasVoted && handleVote(index)}
            >
              <div className="poll-option-content">
                <span className="poll-option-text">{option.text}</span>
                {hasVoted && (
                  <span className="poll-option-votes">
                    {option.votes} {option.votes === 1 ? 'hlas' : 'hlasov'}
                  </span>
                )}
              </div>
              
              {hasVoted && (
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

      {hasVoted && (
        <div className="poll-footer">
          <i className="fas fa-check-circle"></i> Ďakujeme za tvoj hlas! Celkovo hlasov: {totalVotes}
        </div>
      )}

      {!hasVoted && (
        <div className="poll-footer">
          <i className="fas fa-hand-pointer"></i> Klikni na možnosť pre hlasovanie. Tvoj hlas nemôže byť zmenený.
        </div>
      )}
    </div>
  );
}
