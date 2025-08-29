import React from 'react';

interface SeatSelectorProps {
    totalSeats: number;
    selectedSeats: number;
    onSelect: (seats: number) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ totalSeats, selectedSeats, onSelect }) => {
    const [seats, setSeats] = React.useState<number[]>(Array(totalSeats).fill(0));

    const handleSeatClick = (index: number) => {
        const newSeats = [...seats];
        newSeats[index] = newSeats[index] === 1 ? 0 : 1; // Toggle seat selection
        setSeats(newSeats);
        onSelect(newSeats.reduce((acc, seat) => acc + seat, 0)); // Update selected seats count
    };

    return (
        <div className="seat-selector">
            <h3>Select Seats</h3>
            <div className="seats-grid">
                {seats.map((seat, index) => (
                    <div
                        key={index}
                        className={`seat ${seat === 1 ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(index)}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
            <p>Selected Seats: {seats.reduce((acc, seat) => acc + seat, 0)}</p>
        </div>
    );
};

export default SeatSelector;